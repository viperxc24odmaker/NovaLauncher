<template>
  <header class="titlebar" @dblclick="handleMaximize">
    <div class="titlebar-drag">
      <span class="app-logo">⛏</span>
      <span class="app-name">MC Launcher</span>
    </div>
    <div class="titlebar-controls">
      <button class="ctrl min" title="Minimize" @click="minimize">
        <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor"/></svg>
      </button>
      <button class="ctrl max" title="Maximize" @click="handleMaximize">
        <svg width="9" height="9" viewBox="0 0 9 9"><rect x=".5" y=".5" width="8" height="8" fill="none" stroke="currentColor"/></svg>
      </button>
      <button class="ctrl close" title="Close" @click="close">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" stroke-width="1.2"/>
          <line x1="10" y1="0" x2="0"  y2="10" stroke="currentColor" stroke-width="1.2"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
function minimize()         { window.electronAPI.minimize() }
function handleMaximize()   { window.electronAPI.maximize() }
function close()            { window.electronAPI.close()    }
</script>

<style scoped>
.titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 8px 0 16px;
  background: var(--sidebar-bg);
  border-bottom: 1px solid var(--border);
  /* Makes the whole bar draggable */
  -webkit-app-region: drag;
  user-select: none;
  flex-shrink: 0;
}

.titlebar-drag {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-logo { font-size: 16px; }
.app-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.titlebar-controls {
  display: flex;
  gap: 2px;
  -webkit-app-region: no-drag;
}

.ctrl {
  width: 36px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: background var(--transition), color var(--transition);
}
.ctrl:hover { background: var(--bg-hover); color: var(--text-primary); }
.ctrl.close:hover { background: #e81123; color: #fff; }
</style>
