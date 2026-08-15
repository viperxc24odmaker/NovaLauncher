import type EMLLibType from 'eml-lib'
import { AccountService } from './AccountService'

type EMLLib=typeof EMLLibType
let emlPromise:Promise<EMLLib>|undefined
function loadEML():Promise<EMLLib>{if(!emlPromise)emlPromise=new Function('return import("eml-lib").then(module => module.default)')() as Promise<EMLLib>;return emlPromise}

export interface CosmeticTexture { id?:string; name?:string; url?:string; active?:boolean; variant?:string; type?:string }

export class CosmeticsService {
  constructor(private readonly accounts:AccountService){}

  async getForAccount(id:string):Promise<{skins:CosmeticTexture[];capes:CosmeticTexture[]}> {
    const stored=this.accounts.list().find(account=>account.id===id)
    if(!stored) throw new Error('Account not found.')
    if(stored.type==='offline') return {skins:[],capes:[]}
    const EML=await loadEML()
    const skinApi=new (EML as any).Skin(stored.account)
    const skins=await skinApi.getSkins()
    const capes=await skinApi.getCapes()
    return {skins:Array.isArray(skins)?skins:[],capes:Array.isArray(capes)?capes:[]}
  }

  async switchCape(accountId:string,capeId:string):Promise<void>{
    const stored=this.accounts.list().find(account=>account.id===accountId)
    if(!stored) throw new Error('Account not found.')
    if(stored.type!=='microsoft') throw new Error('Cape switching is only supported for Microsoft accounts.')
    const EML=await loadEML()
    const skinApi=new (EML as any).Skin(stored.account)
    await skinApi.switchCape(capeId)
  }

  async hideCape(accountId:string):Promise<void>{
    const stored=this.accounts.list().find(account=>account.id===accountId)
    if(!stored) throw new Error('Account not found.')
    if(stored.type!=='microsoft') throw new Error('Cape hiding is only supported for Microsoft accounts.')
    const EML=await loadEML()
    const skinApi=new (EML as any).Skin(stored.account)
    await skinApi.hideCape()
  }
}
