import { app, dialog } from 'electron'
import { mkdir, readFile, writeFile, cp, readdir } from 'node:fs/promises'
import { basename, join, resolve, sep } from 'node:path'
import AdmZip from 'adm-zip'

export interface ModpackSearchResult { id:string; title:string; description:string; author:string; iconUrl:string|null; downloads:number; projectType:string }
export interface InstalledModpack { id:string; name:string; fileName:string; mcVersion:string; loader:string; loaderVersion:string|null; installedAt:string; instanceId:string }

type MrpackIndex={formatVersion:number;game:string;versionId:string;name:string;summary?:string;files:Array<{path:string;hashes:{sha1?:string;sha512?:string};downloads:string[];fileSize?:number;env?:{client?:string;server?:string}}>;dependencies?:Record<string,string>}

const ROOT=join(app.getPath('appData'),'.novalauncher','modpacks')
const USER_AGENT='viperxc24odmaker/NovaLauncher/0.2.0 (https://github.com/viperxc24odmaker/NovaLauncher)'

function safePath(root:string, relative:string):string{
  const target=resolve(root,relative)
  const base=resolve(root)+sep
  if(target!==resolve(root)&&!target.startsWith(base)) throw new Error('Modpack contains an unsafe path.')
  return target
}

export class ModpackService {
  private async ensureRoot(){await mkdir(ROOT,{recursive:true})}

  async search(query:string,mcVersion?:string,loader?:string):Promise<ModpackSearchResult[]> {
    const params=new URLSearchParams({query:query.trim(),limit:'20'})
    const facets:string[][]=[['project_type:modpack']]
    if(mcVersion) facets.push([`versions:${mcVersion}`])
    if(loader&&loader!=='vanilla') facets.push([`categories:${loader}`])
    params.set('facets',JSON.stringify(facets))
    const response=await fetch(`https://api.modrinth.com/v2/search?${params}`,{headers:{'User-Agent':USER_AGENT}})
    if(!response.ok) throw new Error(`Modrinth search failed: HTTP ${response.status}`)
    const data=await response.json() as {hits:Array<{project_id:string;title:string;description:string;author:string;icon_url:string|null;downloads:number;project_type:string}>}
    return data.hits.map(hit=>({id:hit.project_id,title:hit.title,description:hit.description,author:hit.author,iconUrl:hit.icon_url,downloads:hit.downloads,projectType:hit.project_type}))
  }

  async importMrpack(instanceId:string):Promise<InstalledModpack>{
    await this.ensureRoot()
    const result=await dialog.showOpenDialog({properties:['openFile'],filters:[{name:'Modrinth Modpack',extensions:['mrpack']}]})
    if(result.canceled||!result.filePaths[0]) throw new Error('No modpack selected.')
    return this.installMrpackFile(instanceId,result.filePaths[0])
  }

  async installFromModrinth(instanceId:string,projectId:string):Promise<InstalledModpack>{
    const versionsResponse=await fetch(`https://api.modrinth.com/v2/project/${encodeURIComponent(projectId)}/version`,{headers:{'User-Agent':USER_AGENT}})
    if(!versionsResponse.ok) throw new Error(`Modrinth version lookup failed: HTTP ${versionsResponse.status}`)
    const versions=await versionsResponse.json() as Array<{id:string;name:string;version_number:string;files:Array<{url:string;filename:string;primary?:boolean}>;game_versions:string[];loaders:string[];dependencies:Array<{version_id:string}>}>
    const version=versions[0]
    if(!version) throw new Error('No published modpack version was found.')
    const file=version.files.find(entry=>entry.primary)||version.files[0]
    if(!file||!file.url.endsWith('.mrpack')) throw new Error('Modrinth returned a version without a .mrpack file.')
    const response=await fetch(file.url,{headers:{'User-Agent':USER_AGENT}})
    if(!response.ok) throw new Error(`Modpack download failed: HTTP ${response.status}`)
    const destination=join(ROOT,`${projectId}-${version.version_number}.mrpack`)
    await writeFile(destination,Buffer.from(await response.arrayBuffer()))
    return this.installMrpackFile(instanceId,destination)
  }

  private async installMrpackFile(instanceId:string,filePath:string):Promise<InstalledModpack>{
    const zip=new AdmZip(filePath)
    const indexEntry=zip.getEntry('modrinth.index.json')
    if(!indexEntry) throw new Error('Invalid .mrpack: modrinth.index.json is missing.')
    const index=JSON.parse(indexEntry.getData().toString('utf8')) as MrpackIndex
    if(index.formatVersion!==1||index.game!=='minecraft') throw new Error('Unsupported Modrinth modpack format.')
    const instanceRoot=join(app.getPath('appData'),'.novalauncher','instances',instanceId)
    await mkdir(instanceRoot,{recursive:true})

    for(const file of index.files){
      if(file.env?.client==='unsupported') continue
      const target=safePath(instanceRoot,file.path)
      await mkdir(resolve(target,'..'),{recursive:true})
      let downloaded=false
      for(const url of file.downloads??[]){
        if(!/^https:\/\//i.test(url)) continue
        try{
          const response=await fetch(url,{headers:{'User-Agent':USER_AGENT}})
          if(!response.ok) continue
          const bytes=Buffer.from(await response.arrayBuffer())
          const expected=file.hashes.sha1||file.hashes.sha512
          if(expected){
            const crypto=await import('node:crypto')
            const algorithm=file.hashes.sha512?'sha512':'sha1'
            const actual=crypto.createHash(algorithm).update(bytes).digest('hex')
            if(actual.toLowerCase()!==expected.toLowerCase()) continue
          }
          await writeFile(target,bytes)
          downloaded=true
          break
        }catch{ /* try the next mirror */ }
      }
      if(!downloaded) throw new Error(`Unable to download modpack file: ${file.path}`)
    }

    const overrides=zip.getEntries().filter(entry=>entry.entryName.startsWith('overrides/')&&!entry.isDirectory)
    for(const entry of overrides){
      const relative=entry.entryName.slice('overrides/'.length)
      if(!relative) continue
      const target=safePath(instanceRoot,relative)
      await mkdir(resolve(target,'..'),{recursive:true})
      await writeFile(target,entry.getData())
    }

    const deps=index.dependencies??{}
    const loader=deps.forge?'forge':deps.neoforge?'neoforge':deps['fabric-loader']?'fabric':'vanilla'
    const loaderVersion=deps.forge||deps.neoforge||deps['fabric-loader']||null
    const installed:InstalledModpack={id:index.versionId,name:index.name,fileName:basename(filePath),mcVersion:deps.minecraft||'unknown',loader,loaderVersion,installedAt:new Date().toISOString(),instanceId}
    const metadataFile=join(ROOT,`${instanceId}.json`)
    let existing:InstalledModpack[]=[]
    try{existing=JSON.parse(await readFile(metadataFile,'utf8')) as InstalledModpack[]}catch{}
    existing=[...existing.filter(item=>item.id!==installed.id),installed]
    await writeFile(metadataFile,JSON.stringify(existing,null,2),'utf8')
    return installed
  }

  async listInstalled(instanceId?:string):Promise<InstalledModpack[]>{
    await this.ensureRoot()
    const files=await readdir(ROOT)
    const packs:InstalledModpack[]=[]
    for(const file of files.filter(name=>name.endsWith('.json'))){try{const entries=JSON.parse(await readFile(join(ROOT,file),'utf8')) as InstalledModpack[];packs.push(...entries)}catch{}}
    return instanceId?packs.filter(pack=>pack.instanceId===instanceId):packs
  }
}
