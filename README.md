# ⛏ MC Launcher

A modern Minecraft Java Edition launcher built with **Electron + Vue 3 + TypeScript**.

> **Milestone 1** — Foundation & UI structure. Minecraft launching is not yet implemented.

---

## Requirements

- **Node.js** 20+
- **npm** 9+
- **Windows** (for production builds — dev mode works on any OS)

---

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/mc-launcher
cd mc-launcher
npm install
```

---

## Development

Start the Vite dev server and Electron together:

```bash
npm run dev
```

Electron will open automatically once Vite is ready on `localhost:5173`.

---

## Build

Compile TypeScript and bundle the renderer:

```bash
npm run build
```

Package into a Windows `.exe` installer:

```bash
npm run dist
```

Output is placed in `release/`.

---

## GitHub Actions

Every push to `main` triggers `.github/workflows/build.yml`, which:

1. Checks out the repo
2. Sets up Node.js 20
3. Runs `npm ci`
4. Builds the Vite renderer
5. Compiles the Electron main process
6. Packages with `electron-builder` for Windows x64
7. Uploads the installer as a build artifact

---

## Project Structure

```
mc-launcher/
├── assets/                  # App icons (add icon.ico here)
├── src/
│   ├── main/                # Electron main process (Node.js)
│   │   ├── index.ts         # App entry, BrowserWindow creation
│   │   ├── ipc/
│   │   │   └── handlers.ts  # All IPC handler registrations
│   │   └── services/
│   │       └── SettingsService.ts  # Persistent settings via electron-store
│   │
│   ├── preload/
│   │   └── index.ts         # Secure contextBridge API exposed to renderer
│   │
│   └── renderer/            # Vue 3 app (browser context)
│       ├── index.html
│       ├── main.ts          # Vue app entry
│       ├── App.vue          # Root layout (TitleBar + Sidebar + router-view)
│       ├── router/
│       │   └── index.ts     # Vue Router (hash history)
│       ├── stores/
│       │   ├── settingsStore.ts   # Theme, accent color, IPC settings sync
│       │   ├── instanceStore.ts   # Instance list management
│       │   └── accountStore.ts    # Account list management
│       ├── components/
│       │   ├── TitleBar.vue       # Custom frameless window controls
│       │   ├── Sidebar.vue        # Main navigation sidebar
│       │   └── InstanceCard.vue   # Reusable instance card
│       ├── views/
│       │   ├── HomeView.vue       # Hero + quick instances
│       │   ├── InstancesView.vue  # Full instance list + create modal
│       │   ├── ModsView.vue       # Placeholder
│       │   ├── ModpacksView.vue   # Placeholder
│       │   ├── AccountsView.vue   # Account list + offline account creation
│       │   ├── NewsView.vue       # Placeholder (shimmer skeleton)
│       │   └── SettingsView.vue   # Theme, accent color, java path, about
│       ├── services/
│       │   └── LauncherService.ts # Stub — wire up Minecraft launching here
│       ├── types/
│       │   └── index.ts           # Shared TypeScript interfaces
│       └── styles/
│           └── global.css         # Design tokens, dark/light themes, reset
│
├── .github/workflows/
│   └── build.yml            # GitHub Actions Windows CI
├── vite.config.ts
├── tsconfig.json            # Renderer TypeScript config
└── tsconfig.electron.json   # Main process TypeScript config
```

---

## Architecture Notes

- **Main process** (`src/main/`) — Node.js only. Never import Vue here.
- **Renderer** (`src/renderer/`) — Browser context. Never import Node.js APIs directly.
- **Preload** (`src/preload/`) — The secure bridge. Uses `contextBridge` to expose a safe `window.electronAPI` to the renderer.
- **IPC** — Renderer → Preload → Main process for settings, window controls, and (future) launching.
- **Stores** — Pinia stores hold all reactive state. Components stay thin.
