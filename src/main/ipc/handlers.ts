import { BrowserWindow, IpcMain, app, dialog } from 'electron'
import { SettingsService } from '../services/SettingsService'
import { AccountService } from '../services/AccountService'
import { MinecraftService } from '../services/MinecraftService'
import { ModpackService } from '../services/ModpackService'
import { CosmeticsService } from '../services/CosmeticsService'

const settingsService=new SettingsService();const accountService=new AccountService();const minecraftService=new MinecraftService(accountService);const modpackService=new ModpackService();const cosmeticsService=new CosmeticsService(accountService)
export function setupIpcHandlers(ipcMain:IpcMain):void{
  ipcMain.on('window:minimize',()=>BrowserWindow.getFocusedWindow()?.minimize())
  ipcMain.on('window:maximize',()=>{const win=BrowserWindow.getFocusedWindow();if(!win)return;win.isMaximized()?win.unmaximize():win.maximize()})
  ipcMain.on('window:close',()=>BrowserWindow.getFocusedWindow()?.close())
  ipcMain.handle('settings:get',()=>settingsService.getAll())
  ipcMain.handle('settings:set',(_event,key:string,value:unknown)=>{settingsService.set(key as never,value as never);return true})
  ipcMain.handle('app:getVersion',()=>app.getVersion())
  ipcMain.handle('minecraft:versions',()=>minecraftService.getMinecraftVersions())
  ipcMain.handle('minecraft:loginMicrosoft',()=>{const window=BrowserWindow.getFocusedWindow()??BrowserWindow.getAllWindows()[0];if(!window)throw new Error('Launcher window is unavailable.');return minecraftService.loginMicrosoft(window)})
  ipcMain.handle('minecraft:loginElyBy',(_event,username:string,password:string)=>minecraftService.loginElyBy(username,password))
  ipcMain.handle('minecraft:addOffline',(_event,username:string)=>minecraftService.addOffline(username))
  ipcMain.handle('minecraft:accounts',()=>minecraftService.listAccounts())
  ipcMain.handle('minecraft:removeAccount',(_event,id:string)=>minecraftService.removeAccount(id))
  ipcMain.handle('minecraft:setActiveAccount',(_event,id:string)=>minecraftService.setActiveAccount(id))
  ipcMain.handle('minecraft:installJava',(_event,version:string)=>minecraftService.installJava(version))
  ipcMain.handle('minecraft:launch',(_event,input)=>minecraftService.launch(input))
  ipcMain.handle('minecraft:mods',(_event,instanceId:string)=>minecraftService.listMods(instanceId))
  ipcMain.handle('minecraft:toggleMod',(_event,instanceId:string,fileName:string,enabled:boolean)=>minecraftService.toggleMod(instanceId,fileName,enabled))
  ipcMain.handle('minecraft:importMod',async(_event,instanceId:string)=>{const result=await dialog.showOpenDialog({properties:['openFile'],filters:[{name:'Minecraft Mod',extensions:['jar']}]});if(result.canceled||!result.filePaths[0])return minecraftService.listMods(instanceId);return minecraftService.importMod(instanceId,result.filePaths[0])})
  ipcMain.handle('modpacks:search',(_event,query:string,mcVersion?:string,loader?:string)=>modpackService.search(query,mcVersion,loader))
  ipcMain.handle('modpacks:import',(_event,instanceId:string)=>modpackService.importMrpack(instanceId))
  ipcMain.handle('modpacks:install',(_event,instanceId:string,projectId:string)=>modpackService.installFromModrinth(instanceId,projectId))
  ipcMain.handle('modpacks:list',(_event,instanceId?:string)=>modpackService.listInstalled(instanceId))
  ipcMain.handle('cosmetics:get',(_event,accountId:string)=>cosmeticsService.getForAccount(accountId))
  ipcMain.handle('cosmetics:switchCape',(_event,accountId:string,capeId:string)=>cosmeticsService.switchCape(accountId,capeId))
  ipcMain.handle('cosmetics:hideCape',(_event,accountId:string)=>cosmeticsService.hideCape(accountId))
}
