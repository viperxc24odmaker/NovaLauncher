import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { AppSettings } from '@/types'

export const useSettingsStore = defineStore('settings', () => {
  const theme       = ref<'dark' | 'light'>('dark')
  const accentColor = ref('#4ade80')
  const launcherVisibility = ref<'hide' | 'close' | 'keep'>('hide')
  const javaPath    = ref('')
  const downloadDir = ref('')
  const loaded      = ref(false)

  /** Load settings from main process via IPC */
  async function load() {
    const s: AppSettings = await window.electronAPI.getSettings()
    theme.value              = s.theme
    accentColor.value        = s.accentColor
    launcherVisibility.value = s.launcherVisibility
    javaPath.value           = s.javaPath
    downloadDir.value        = s.downloadDir
    loaded.value             = true
    applyTheme()
    applyAccent()
  }

  /** Persist a single setting to disk via IPC */
  async function save(key: keyof AppSettings, value: unknown) {
    await window.electronAPI.setSetting(key, value)
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function applyAccent() {
    document.documentElement.style.setProperty('--accent', accentColor.value)
  }

  async function setTheme(t: 'dark' | 'light') {
    theme.value = t
    applyTheme()
    await save('theme', t)
  }

  async function setAccentColor(color: string) {
    accentColor.value = color
    applyAccent()
    await save('accentColor', color)
  }

  return {
    theme, accentColor, launcherVisibility,
    javaPath, downloadDir, loaded,
    load, setTheme, setAccentColor, save
  }
})
