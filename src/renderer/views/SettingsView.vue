<template>
  <div class="settings-view">
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-sub">Launcher preferences</p>
    </div>

    <!-- Appearance -->
    <section class="settings-section">
      <h2 class="section-title">Appearance</h2>

      <!-- Theme -->
      <div class="setting-row">
        <div class="setting-info">
          <p class="setting-name">Theme</p>
          <p class="setting-desc">Switch between dark and light mode</p>
        </div>
        <div class="theme-toggle">
          <button
            class="theme-btn"
            :class="{ active: settingsStore.theme === 'dark' }"
            @click="settingsStore.setTheme('dark')"
          >🌙 Dark</button>
          <button
            class="theme-btn"
            :class="{ active: settingsStore.theme === 'light' }"
            @click="settingsStore.setTheme('light')"
          >☀️ Light</button>
        </div>
      </div>

      <!-- Accent Color -->
      <div class="setting-row">
        <div class="setting-info">
          <p class="setting-name">Accent Color</p>
          <p class="setting-desc">Choose your launcher highlight color</p>
        </div>
        <div class="color-picker-row">
          <button
            v-for="color in presetColors"
            :key="color"
            class="color-swatch"
            :style="{ background: color }"
            :class="{ active: settingsStore.accentColor === color }"
            :title="color"
            @click="settingsStore.setAccentColor(color)"
          ></button>
          <input
            type="color"
            class="color-input"
            :value="settingsStore.accentColor"
            @input="(e) => settingsStore.setAccentColor((e.target as HTMLInputElement).value)"
            title="Custom color"
          />
        </div>
      </div>
    </section>

    <!-- Launcher behaviour -->
    <section class="settings-section">
      <h2 class="section-title">Launcher Behaviour</h2>

      <div class="setting-row">
        <div class="setting-info">
          <p class="setting-name">After Launch</p>
          <p class="setting-desc">What happens to the launcher when a game starts</p>
        </div>
        <div class="radio-group">
          <label v-for="opt in visibilityOptions" :key="opt.value" class="radio-label">
            <input
              type="radio"
              :value="opt.value"
              v-model="launcherVisibility"
              @change="updateVisibility"
              class="radio-input"
            />
            {{ opt.label }}
          </label>
        </div>
      </div>
    </section>

    <!-- Java -->
    <section class="settings-section">
      <h2 class="section-title">Java</h2>

      <div class="setting-row setting-row--col">
        <div class="setting-info">
          <p class="setting-name">Custom Java Path</p>
          <p class="setting-desc">Leave blank to use auto-detected Java</p>
        </div>
        <div class="input-row">
          <input
            v-model="javaPath"
            type="text"
            placeholder="e.g. C:\Program Files\Java\jdk-21\bin\java.exe"
            class="form-input"
            @blur="saveJavaPath"
          />
          <button class="btn-browse" disabled title="File browse coming soon">Browse</button>
        </div>
      </div>
    </section>

    <!-- About -->
    <section class="settings-section">
      <h2 class="section-title">About</h2>
      <div class="about-card">
        <p class="about-name">⛏ MC Launcher</p>
        <p class="about-version">Version {{ version }}</p>
        <p class="about-desc">A modern Minecraft Java Edition launcher built with Electron + Vue 3.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()
const version       = ref('')
const javaPath      = ref(settingsStore.javaPath)
const launcherVisibility = ref(settingsStore.launcherVisibility)

const presetColors = [
  '#4ade80', // green (default)
  '#60a5fa', // blue
  '#f472b6', // pink
  '#fb923c', // orange
  '#a78bfa', // purple
  '#facc15', // yellow
  '#2dd4bf', // teal
  '#f87171'  // red
]

const visibilityOptions = [
  { value: 'hide',  label: 'Hide' },
  { value: 'close', label: 'Close' },
  { value: 'keep',  label: 'Keep open' }
]

onMounted(async () => {
  version.value = await window.electronAPI.getVersion()
  javaPath.value = settingsStore.javaPath
  launcherVisibility.value = settingsStore.launcherVisibility
})

async function updateVisibility() {
  await settingsStore.save('launcherVisibility', launcherVisibility.value)
}

async function saveJavaPath() {
  await settingsStore.save('javaPath', javaPath.value)
}
</script>

<style scoped>
.settings-view {
  padding: 32px 40px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 720px;
}

.page-header { }
.page-title  { font-size: 22px; font-weight: 700; }
.page-sub    { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

/* Section */
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

/* Row */
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
  gap: 16px;
}
.setting-row:last-child { border-bottom: none; }
.setting-row--col {
  flex-direction: column;
  align-items: flex-start;
}

.setting-info { flex: 1; min-width: 0; }
.setting-name { font-size: 13px; font-weight: 600; }
.setting-desc { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

/* Theme toggle */
.theme-toggle {
  display: flex;
  gap: 4px;
}
.theme-btn {
  padding: 7px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 12px;
  color: var(--text-secondary);
  transition: background var(--transition), border-color var(--transition), color var(--transition);
}
.theme-btn:hover { background: var(--bg-hover); }
.theme-btn.active {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 600;
}

/* Color swatches */
.color-picker-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.color-swatch {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: transform var(--transition), border-color var(--transition);
}
.color-swatch:hover { transform: scale(1.15); }
.color-swatch.active { border-color: white; transform: scale(1.15); }

.color-input {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid var(--border);
  padding: 0;
}

/* Radio */
.radio-group {
  display: flex;
  gap: 16px;
}
.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
}
.radio-input { accent-color: var(--accent); }

/* Input row */
.input-row {
  display: flex;
  gap: 8px;
  width: 100%;
  margin-top: 8px;
}
.form-input {
  flex: 1;
  padding: 9px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 12px;
  font-family: var(--font-mono);
  transition: border-color var(--transition);
}
.form-input:focus { border-color: var(--accent); }

.btn-browse {
  padding: 9px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.5;
  cursor: not-allowed;
}

/* About */
.about-card {
  padding: 20px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.about-name    { font-size: 15px; font-weight: 700; }
.about-version { font-size: 12px; color: var(--accent); }
.about-desc    { font-size: 12px; color: var(--text-secondary); margin-top: 4px; line-height: 1.6; }
</style>
