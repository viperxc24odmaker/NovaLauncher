// ── Instance ──────────────────────────────────────────────────────────────────

export type ModLoader = 'vanilla' | 'fabric' | 'forge' | 'neoforge'

export interface Instance {
  id: string
  name: string
  mcVersion: string
  loader: ModLoader
  loaderVersion?: string
  /** Path to a custom icon (PNG/JPG) chosen by the user, or null for default */
  iconPath: string | null
  /** Accent color override for this instance card */
  accentColor?: string
  lastPlayed?: string   // ISO date string
  playTime: number      // total minutes played
  description?: string
  createdAt: string     // ISO date string
}

// ── Account ───────────────────────────────────────────────────────────────────

export type AccountType = 'microsoft' | 'elyby' | 'offline'

export interface Account {
  id: string
  type: AccountType
  username: string
  /** UUID (online) or generated UUID (offline) */
  uuid: string
  /** Display avatar URL — null for offline accounts */
  avatarUrl: string | null
  isActive: boolean
}

// ── Mod ───────────────────────────────────────────────────────────────────────

export interface Mod {
  id: string
  name: string
  version: string
  description?: string
  author?: string
  /** Which instances this mod belongs to */
  instanceIds: string[]
  enabled: boolean
  /** Source platform ('modrinth' | 'curseforge' | 'local') */
  source: string
  thumbnailUrl?: string
}

// ── Modpack ───────────────────────────────────────────────────────────────────

export interface Modpack {
  id: string
  name: string
  version: string
  mcVersion: string
  loader: ModLoader
  description?: string
  author?: string
  thumbnailUrl?: string
  modCount: number
}

// ── Settings ──────────────────────────────────────────────────────────────────

export interface AppSettings {
  theme: 'dark' | 'light'
  accentColor: string
  launcherVisibility: 'hide' | 'close' | 'keep'
  javaPath: string
  downloadDir: string
}

// ── Electron API (injected by preload) ────────────────────────────────────────

export interface ElectronAPI {
  minimize:    () => void
  maximize:    () => void
  close:       () => void
  getSettings: () => Promise<AppSettings>
  setSetting:  (key: string, value: unknown) => Promise<boolean>
  getVersion:  () => Promise<string>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
