<template>
  <div class="mods-view">
    <div class="page-header">
      <div><h1 class="page-title">Mods</h1><p class="page-sub">Manage local .jar mods per instance</p></div>
      <button class="btn-primary" :disabled="!selectedId" @click="importMod">+ Add Mod</button>
    </div>

    <div class="toolbar">
      <label>Instance</label>
      <select v-model="selectedId" class="form-input" @change="loadMods">
        <option disabled value="">Select an instance</option>
        <option v-for="instance in instanceStore.instances" :key="instance.id" :value="instance.id">{{ instance.name }}</option>
      </select>
    </div>

    <div v-if="!selectedId" class="empty-state"><span>🧩</span><p>Select an instance to manage its mods.</p></div>
    <div v-else-if="mods.length" class="mod-list">
      <div v-for="mod in mods" :key="mod.name" class="mod-row">
        <div class="mod-icon">🧩</div>
        <div class="mod-info"><strong>{{ mod.name }}</strong><span>{{ mod.enabled ? 'Enabled' : 'Disabled' }}</span></div>
        <button class="toggle" @click="toggle(mod)">{{ mod.enabled ? 'Disable' : 'Enable' }}</button>
      </div>
    </div>
    <div v-else-if="!loading" class="empty-state"><span>📁</span><p>No .jar mods installed for this instance.</p><small>Use “Add Mod” to copy a mod into the instance.</small></div>
    <div v-if="loading" class="loading">Loading mods…</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useInstanceStore } from '@/stores/instanceStore'
import type { ModFile } from '@/types'

const instanceStore = useInstanceStore()
const selectedId = ref('')
const mods = ref<ModFile[]>([])
const loading = ref(false)

onMounted(() => {
  selectedId.value = instanceStore.instances[0]?.id ?? ''
  if (selectedId.value) loadMods()
})

async function loadMods() {
  if (!selectedId.value) return
  loading.value = true
  try { mods.value = await window.electronAPI.getMods(selectedId.value) }
  finally { loading.value = false }
}

async function toggle(mod: ModFile) {
  mods.value = await window.electronAPI.toggleMod(selectedId.value, mod.name, !mod.enabled)
}

async function importMod() {
  if (!selectedId.value) return
  mods.value = await window.electronAPI.importMod(selectedId.value)
}
</script>

<style scoped>
.mods-view{padding:32px 40px;height:100%;overflow-y:auto}.page-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px}.page-title{font-size:22px;font-weight:700}.page-sub{font-size:12px;color:var(--text-secondary);margin-top:2px}.btn-primary{padding:9px 18px;background:var(--accent);color:#000;border-radius:var(--radius-md);font-weight:700}.btn-primary:disabled{opacity:.45;cursor:not-allowed}.toolbar{display:flex;align-items:center;gap:10px;margin-bottom:18px}.toolbar label{font-size:12px;color:var(--text-secondary)}.form-input{min-width:260px;padding:9px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-primary)}.mod-list{display:flex;flex-direction:column;gap:8px}.mod-row{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-md)}.mod-icon{font-size:22px}.mod-info{flex:1;display:flex;flex-direction:column;gap:3px}.mod-info strong{font-size:13px}.mod-info span{font-size:11px;color:var(--text-secondary)}.toggle{padding:7px 12px;border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-secondary)}.toggle:hover{border-color:var(--accent);color:var(--accent)}.empty-state{display:flex;flex-direction:column;align-items:center;gap:10px;padding:70px 20px;color:var(--text-secondary);text-align:center}.empty-state span{font-size:40px}.empty-state small{font-size:11px}.loading{text-align:center;color:var(--text-secondary);padding:30px}
</style>
