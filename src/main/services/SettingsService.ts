import Store from 'electron-store'

export interface AppSettings {
  theme: 'dark' | 'light'
  accentColor: string
  launcherVisibility: 'hide' | 'close' | 'keep'
  javaPath: string
  downloadDir: string
}

const defaults: AppSettings = {
  theme: 'dark',
  accentColor: '#4ade80',
  launcherVisibility: 'hide',
  javaPath: '',
  downloadDir: ''
}

/**
 * Persistent settings backed by electron-store (JSON file in userData).
 * Only used in the main process — renderer accesses via IPC.
 */
export class SettingsService {
  private store: Store<AppSettings>

  constructor() {
    this.store = new Store<AppSettings>({ defaults })
  }

  getAll(): AppSettings {
    return this.store.store
  }

  get<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.store.get(key)
  }

  set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    this.store.set(key, value)
  }
}
