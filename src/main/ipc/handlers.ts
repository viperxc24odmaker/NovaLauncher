import { IpcMain, BrowserWindow, app } from 'electron'
import { SettingsService } from '../services/SettingsService'

const settingsService = new SettingsService()

/**
 * Register all IPC handlers for the main process.
 * Renderer communicates via the preload bridge — never directly.
 */
export function setupIpcHandlers(ipcMain: IpcMain): void {
  // ── Window controls ─────────────────────────────────────────
  ipcMain.on('window:minimize', () => {
    BrowserWindow.getFocusedWindow()?.minimize()
  })

  ipcMain.on('window:maximize', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return
    win.isMaximized() ? win.unmaximize() : win.maximize()
  })

  ipcMain.on('window:close', () => {
    BrowserWindow.getFocusedWindow()?.close()
  })

  // ── Settings ─────────────────────────────────────────────────
  ipcMain.handle('settings:get', () => {
    return settingsService.getAll()
  })

  ipcMain.handle('settings:set', (_event, key: string, value: unknown) => {
    settingsService.set(key, value)
    return true
  })

  // ── App info ─────────────────────────────────────────────────
  ipcMain.handle('app:getVersion', () => {
    return app.getVersion()
  })
}
