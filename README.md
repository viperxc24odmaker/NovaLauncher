# 🚀 NovaLauncher

A modern Windows Minecraft Java Edition launcher built with **Electron + Vue 3 + TypeScript**.

## Current milestone — Java basics

NovaLauncher currently provides the foundation for:

- Minecraft release version discovery from Mojang
- Isolated per-instance game directories
- Vanilla, Fabric, Forge, and NeoForge launch configuration
- Automatic compatible loader resolution where supported
- Microsoft account authentication
- Multiple persisted accounts
- Offline/local profiles
- Automatic Mojang Java runtime management
- Explicit JRE installation for an instance's Minecraft version
- Local `.jar` mod import
- Enable/disable local mods
- Dark/light UI and launcher settings
- Windows installer builds through GitHub Actions

**Modpacks are intentionally not implemented in this milestone.** They are the next phase.

## Requirements

- Node.js 20+
- npm 9+
- Windows for production builds

## Development

```bash
npm install
npm run dev
```

## Typecheck and build

```bash
npm run build
```

## Windows installer

```bash
npm run dist
```

The installer is written to `release/`.

## GitHub Actions

Pushes and pull requests targeting `main` run the Windows build workflow in `.github/workflows/build.yml`. The workflow installs dependencies, typechecks, builds, packages the NSIS installer, and uploads the `.exe` as an artifact.

## Architecture

```text
src/
├── main/
│   ├── index.ts
│   ├── ipc/handlers.ts
│   └── services/
│       ├── AccountService.ts
│       ├── MinecraftService.ts
│       └── SettingsService.ts
├── preload/
│   └── index.ts
└── renderer/
    ├── components/
    ├── router/
    ├── stores/
    ├── types/
    └── views/
```

Electron Node APIs stay in the main process. Vue talks to the main process through the preload/contextBridge IPC layer.

## Minecraft implementation

NovaLauncher uses the MIT-licensed `eml-lib` package for the core Minecraft operations. EML handles Minecraft file installation, Java runtime management, Microsoft authentication, and Vanilla/Fabric/Forge/NeoForge launching. NovaLauncher keeps that integration behind its own `MinecraftService` so the launcher can replace or extend the core later.

Minecraft itself is not bundled with NovaLauncher; required game files are obtained by the launcher when an instance is installed/launched.

## Roadmap

### Phase 1 — Java basics

- [x] Versions
- [x] Instances
- [x] Vanilla
- [x] Fabric
- [x] Forge
- [x] NeoForge
- [x] Microsoft accounts
- [x] Offline profiles
- [x] Automatic Java
- [x] Local mods

### Phase 2 — Modpacks

- [ ] Modpack instances
- [ ] Modpack import/export
- [ ] Modpack dependency handling
- [ ] Modrinth/CurseForge integration

NovaLauncher is not affiliated with Mojang Studios or Microsoft.
