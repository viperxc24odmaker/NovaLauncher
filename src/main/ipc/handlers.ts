import { BrowserWindow, IpcMain, app, dialog } from 'electron'
import { SettingsService } from '../services/SettingsService'
import { AccountService } from '../services/AccountService'
import { MinecraftService } from '../services/MinecraftService'

const settingsService = new SettingsService()
const accountService = new AccountService()
const minecraftService = new MinecraftService(accountService)

export function setupIpcHandlers(ipcMain: IpcMain): void {
  ipcMain.on('window:minimize', () => BrowserWindow.getFocusedWindow()?.minimize())
  ipcMain.on('window:maximize', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return
    win.isMaximized() ? win.unmaximize() : win.maximize()
  })
  ipcMain.on('window:close', () => BrowserWindow.getFocusedWindow()?.close())

  ipcMain.handle('settings:get', () => settingsService.getAll())
  ipcMain.handle('settings:set', (_event, key: string, value: unknown) => {
    settingsService.set(key as never, value as never)
    return true
  })
  ipcMain.handle('app:getVersion', () => app.getVersion())

  ipcMain.handle('minecraft:versions', () => minecraftService.getMinecraftVersions())
  ipcMain.handle('minecraft:loginMicrosoft', () => {
    const window = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
    if (!window) throw new Error('Launcher window is unavailable.')
    return minecraftService.loginMicrosoft(window)
  })
  ipcMain.handle('minecraft:addOffline', (_event, username: string) => minecraftService.addOffline(username))
  ipcMain.handle('minecraft:accounts', () => minecraftService.listAccounts())
  ipcMain.handle('minecraft:removeAccount', (_event, id: string) => minecraftService.removeAccount(id))
  ipcMain.handle('minecraft:setActiveAccount', (_event, id: string) => minecraftService.setActiveAccount(id))
  ipcMain.handle('minecraft:installJava', (_event, version: string) => minecraftService.installJava(version))
  ipcMain.handle('minecraft:launch', (_event, input) => minecraftService.launch(input))
  ipcMain.handle('minecraft:mods', (_event, instanceId: string) => minecraftService.listMods(instanceId))
  ipcMain.handle('minecraft:toggleMod', (_event, instanceId: string, fileName: string, enabled: boolean) => minecraftService.toggleMod(instanceId, fileName, enabled))
  ipcMain.handle('minecraft:importMod', async (_event, instanceId: string) => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Minecraft Mod', extensions: ['jar'] }]
    })
    if (result.canceled || !result.filePaths[0]) return minecraftService.listMods(instanceId)
    return minecraftService.importMod(instanceId, result.filePaths[0])
  })
}
