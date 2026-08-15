import { contextBridge, ipcRenderer } from 'electron'

/**
 * Preload: the only file that can safely touch both Node.js and browser APIs.
 *
 * We expose a minimal, typed API surface to the renderer via contextBridge.
 * The renderer NEVER accesses ipcRenderer directly.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // ── Window controls ──────────────────────────────────────────
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close:    () => ipcRenderer.send('window:close'),

  // ── Settings ──────────────────────────────────────────────────
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSetting:  (key: string, value: unknown) =>
    ipcRenderer.invoke('settings:set', key, value),

  // ── App info ──────────────────────────────────────────────────
  getVersion: () => ipcRenderer.invoke('app:getVersion')
})
