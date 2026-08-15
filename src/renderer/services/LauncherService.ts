/**
 * LauncherService
 *
 * This service will be the single entry point for launching Minecraft.
 * It is intentionally left as a stub in Milestone 1.
 *
 * In a future milestone, this will:
 *  - Accept an Instance + Account
 *  - Resolve the correct Java binary
 *  - Download missing game assets / libraries via a library like minecraft-launcher-core
 *  - Build the JVM argument list
 *  - Spawn the Java process via Electron IPC → main process
 *  - Stream stdout/stderr back for a console log
 *
 * DO NOT connect Electron's child_process here — all Node.js calls must go
 * through the IPC bridge to the main process.
 */

import type { Instance } from '@/types'
import type { Account } from '@/types'

export interface LaunchOptions {
  instance: Instance
  account:  Account
  javaPath?: string
}

export interface LaunchResult {
  success: boolean
  message: string
}

export class LauncherService {
  /**
   * Launch a Minecraft instance.
   * Currently a no-op stub — returns a clear "not implemented" result.
   */
  async launch(options: LaunchOptions): Promise<LaunchResult> {
    console.log('[LauncherService] launch() called — not yet implemented', options)

    // TODO (Milestone 2):
    //  1. Validate Java path
    //  2. Authenticate account (Microsoft / Ely.by / offline token)
    //  3. Download / verify game files
    //  4. Build JVM args
    //  5. Send 'launch:start' IPC to main process

    return {
      success: false,
      message: 'Launching not yet implemented. Coming in Milestone 2!'
    }
  }
}

// Export a singleton so all components share the same instance
export const launcherService = new LauncherService()
