import EMLLib from 'eml-lib'
import { BrowserWindow, app } from 'electron'
import { copyFile, mkdir, readdir, rename } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { AccountService, type StoredAccount } from './AccountService'

export type Loader = 'vanilla' | 'fabric' | 'forge' | 'neoforge'

export interface LaunchInstanceInput {
  id: string
  version: string
  loader: Loader
  loaderVersion?: string
  memoryMin?: number
  memoryMax?: number
}

export interface PublicAccount {
  id: string
  type: 'microsoft' | 'offline'
  username: string
  uuid: string
  avatarUrl: string | null
  isActive: boolean
}

export interface ModFile {
  name: string
  enabled: boolean
}

const ROOT_NAME = 'novalauncher'

export class MinecraftService {
  private readonly accounts: AccountService

  constructor(accounts: AccountService) { this.accounts = accounts }

  private publicAccount(account: StoredAccount): PublicAccount {
    return { id: account.id, type: account.type, username: account.account.name, uuid: account.account.uuid, avatarUrl: null, isActive: this.accounts.getActive()?.id === account.id }
  }

  listAccounts(): PublicAccount[] { return this.accounts.list().map(account => this.publicAccount(account)) }

  async loginMicrosoft(mainWindow: BrowserWindow): Promise<PublicAccount> {
    const account = await new EMLLib.MicrosoftAuth(mainWindow).auth()
    return this.publicAccount(this.accounts.add('microsoft', account))
  }

  addOffline(username: string): PublicAccount {
    const clean = username.trim()
    if (!/^[A-Za-z0-9_]{3,16}$/.test(clean)) throw new Error('Offline usernames must be 3-16 characters and contain only letters, numbers, or underscores.')
    return this.publicAccount(this.accounts.add('offline', new EMLLib.CrackAuth().auth(clean)))
  }

  removeAccount(id: string): void { this.accounts.remove(id) }
  setActiveAccount(id: string): boolean { return this.accounts.setActive(id) }

  async getMinecraftVersions(): Promise<string[]> {
    const response = await fetch('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json')
    if (!response.ok) throw new Error(`Minecraft version manifest failed: HTTP ${response.status}`)
    const manifest = await response.json() as { versions: Array<{ id: string; type: string }> }
    return manifest.versions.filter(version => version.type === 'release').map(version => version.id)
  }

  async resolveLoaderVersion(minecraftVersion: string, loader: Exclude<Loader, 'vanilla'>): Promise<string> {
    if (loader === 'fabric') {
      const response = await fetch(`https://meta.fabricmc.net/v2/versions/loader/${encodeURIComponent(minecraftVersion)}`)
      if (!response.ok) throw new Error(`No Fabric loader metadata for Minecraft ${minecraftVersion}.`)
      const versions = await response.json() as Array<{ loader: { version: string; stable: boolean } }>
      const selected = versions.find(entry => entry.loader.stable) ?? versions[0]
      if (!selected) throw new Error(`No Fabric loader is available for Minecraft ${minecraftVersion}.`)
      return selected.loader.version
    }

    if (loader === 'forge') {
      const response = await fetch('https://files.minecraftforge.net/maven/net/minecraftforge/forge/promotions_slim.json')
      if (!response.ok) throw new Error(`Forge metadata failed: HTTP ${response.status}`)
      const data = await response.json() as { promos?: Record<string, string> }
      const version = data.promos?.[`${minecraftVersion}-latest`]
      if (!version) throw new Error(`No Forge build is published for Minecraft ${minecraftVersion}.`)
      return version
    }

    const response = await fetch('https://maven.neoforged.net/releases/net/neoforged/neoforge/maven-metadata.xml')
    if (!response.ok) throw new Error(`NeoForge metadata failed: HTTP ${response.status}`)
    const xml = await response.text()
    const versions = [...xml.matchAll(/<version>([^<]+)<\/version>/g)].map(match => match[1])
    const prefix = minecraftVersion.startsWith('1.') ? minecraftVersion.slice(2) : minecraftVersion
    const compatible = versions.filter(version => version.startsWith(`${prefix}.`))
    const selected = compatible.at(-1)
    if (!selected) throw new Error(`No NeoForge build was found for Minecraft ${minecraftVersion}.`)
    return selected
  }

  async installJava(minecraftVersion: string): Promise<void> {
    await new EMLLib.Java({ minecraft: { version: minecraftVersion }, root: ROOT_NAME }).download()
  }

  async launch(input: LaunchInstanceInput): Promise<void> {
    const stored = this.accounts.getActive()
    if (!stored) throw new Error('Add or select a Minecraft account before launching.')
    const loaderVersion = input.loader === 'vanilla' ? undefined : input.loaderVersion?.trim() || await this.resolveLoaderVersion(input.version, input.loader)
    const launcher = new EMLLib.Launcher({
      root: ROOT_NAME,
      storage: 'isolated',
      account: stored.account,
      profile: { slug: input.id, minecraft: {
        version: input.version,
        loader: input.loader === 'vanilla' ? { loader: 'vanilla', version: input.version } : { loader: input.loader, version: loaderVersion },
        args: []
      } },
      cleaning: { enabled: true, ignored: ['mods/', 'config/', 'saves/', 'resourcepacks/', 'shaderpacks/', 'logs/', 'crash-reports/', 'options.txt'] },
      java: { install: 'auto' },
      memory: { min: Math.max(512, input.memoryMin ?? 1024), max: Math.max(1024, input.memoryMax ?? 4096) },
      window: { width: 1280, height: 720, fullscreen: false }
    })
    await launcher.launch()
  }

  private instanceDirectory(id: string): string { return join(app.getPath('appData'), '.novalauncher', id.toLowerCase().replace(/[^a-z0-9-]/g, '')) }
  private modsDirectory(id: string): string { return join(this.instanceDirectory(id), 'mods') }

  async importMod(instanceId: string, sourcePath: string): Promise<ModFile[]> {
    const sourceName = basename(sourcePath)
    if (!/\.jar$/i.test(sourceName)) throw new Error('Only .jar mod files are supported.')
    await mkdir(this.modsDirectory(instanceId), { recursive: true })
    await copyFile(sourcePath, join(this.modsDirectory(instanceId), sourceName))
    return this.listMods(instanceId)
  }

  async listMods(instanceId: string): Promise<ModFile[]> {
    const modsDirectory = this.modsDirectory(instanceId)
    await mkdir(modsDirectory, { recursive: true })
    const entries = await readdir(modsDirectory, { withFileTypes: true })
    return entries.filter(entry => entry.isFile() && /\.jar(?:\.disabled)?$/i.test(entry.name)).map(entry => ({ name: entry.name, enabled: !entry.name.toLowerCase().endsWith('.disabled') }))
  }

  async toggleMod(instanceId: string, fileName: string, enabled: boolean): Promise<ModFile[]> {
    const safeName = basename(fileName)
    if (safeName !== fileName || !/\.jar(?:\.disabled)?$/i.test(safeName)) throw new Error('Invalid mod filename.')
    const modsDirectory = this.modsDirectory(instanceId)
    await mkdir(modsDirectory, { recursive: true })
    const current = join(modsDirectory, safeName)
    const targetName = enabled ? safeName.replace(/\.disabled$/i, '') : safeName.toLowerCase().endsWith('.jar') ? `${safeName}.disabled` : safeName
    const target = join(modsDirectory, targetName)
    if (current !== target) await rename(current, target)
    return this.listMods(instanceId)
  }
}
