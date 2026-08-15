import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),

  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSetting: (key: string, value: unknown) => ipcRenderer.invoke('settings:set', key, value),
  getVersion: () => ipcRenderer.invoke('app:getVersion'),

  getMinecraftVersions: () => ipcRenderer.invoke('minecraft:versions'),
  loginMicrosoft: () => ipcRenderer.invoke('minecraft:loginMicrosoft'),
  addOfflineAccount: (username: string) => ipcRenderer.invoke('minecraft:addOffline', username),
  getAccounts: () => ipcRenderer.invoke('minecraft:accounts'),
  removeAccount: (id: string) => ipcRenderer.invoke('minecraft:removeAccount', id),
  setActiveAccount: (id: string) => ipcRenderer.invoke('minecraft:setActiveAccount', id),
  installJava: (version: string) => ipcRenderer.invoke('minecraft:installJava', version),
  launchMinecraft: (input: unknown) => ipcRenderer.invoke('minecraft:launch', input),
  getMods: (instanceId: string) => ipcRenderer.invoke('minecraft:mods', instanceId),
  toggleMod: (instanceId: string, fileName: string, enabled: boolean) => ipcRenderer.invoke('minecraft:toggleMod', instanceId, fileName, enabled)
})
