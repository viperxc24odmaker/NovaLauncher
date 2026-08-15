<template>
  <div class="instances-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">Instances</h1>
        <p class="page-sub">{{ instanceStore.instances.length }} instance{{ instanceStore.instances.length !== 1 ? 's' : '' }}</p>
      </div>
      <button class="btn-primary" @click="showCreate = true">+ New Instance</button>
    </div>

    <!-- Instance list -->
    <div class="instance-grid" v-if="instanceStore.instances.length > 0">
      <InstanceCard
        v-for="inst in instanceStore.instances"
        :key="inst.id"
        :instance="inst"
        :is-active="selectedId === inst.id"
        @select="selectedId = inst.id"
        @launch="launchInstance(inst)"
      />
    </div>

    <div class="empty-state" v-else>
      <span>📦</span>
      <p>No instances yet. Create one to get started!</p>
    </div>

    <!-- Create instance modal placeholder -->
    <div class="modal-overlay" v-if="showCreate" @click.self="showCreate = false">
      <div class="modal">
        <h2 class="modal-title">New Instance</h2>

        <div class="form-group">
          <label>Name</label>
          <input v-model="form.name" type="text" placeholder="My Instance" class="form-input" />
        </div>

        <div class="form-group">
          <label>Minecraft Version</label>
          <input v-model="form.mcVersion" type="text" placeholder="1.21.1" class="form-input" />
        </div>

        <div class="form-group">
          <label>Mod Loader</label>
          <div class="loader-grid">
            <button
              v-for="loader in loaderOptions"
              :key="loader.value"
              class="loader-btn"
              :class="{ active: form.loader === loader.value }"
              @click="form.loader = loader.value"
            >
              {{ loader.emoji }} {{ loader.label }}
            </button>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="showCreate = false">Cancel</button>
          <button class="btn-primary" @click="createInstance">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useInstanceStore } from '@/stores/instanceStore'
import InstanceCard from '@/components/InstanceCard.vue'
import type { Instance, ModLoader } from '@/types'

const instanceStore = useInstanceStore()
const selectedId    = ref<string | null>(null)
const showCreate    = ref(false)

const form = reactive({ name: '', mcVersion: '1.21.1', loader: 'vanilla' as ModLoader })

const loaderOptions = [
  { value: 'vanilla',  label: 'Vanilla',  emoji: '🌿' },
  { value: 'fabric',   label: 'Fabric',   emoji: '🧵' },
  { value: 'forge',    label: 'Forge',    emoji: '⚒️'  },
  { value: 'neoforge', label: 'NeoForge', emoji: '🔥' }
]

function createInstance() {
  if (!form.name.trim()) return
  instanceStore.addInstance({
    name:      form.name.trim(),
    mcVersion: form.mcVersion.trim() || '1.21.1',
    loader:    form.loader,
    iconPath:  null,
    lastPlayed: undefined,
    description: ''
  })
  showCreate.value = false
  form.name = ''
  form.mcVersion = '1.21.1'
  form.loader = 'vanilla'
}

function launchInstance(inst: Instance) {
  alert(`Launching "${inst.name}" — coming soon!`)
}
</script>

<style scoped>
.instances-view {
  padding: 32px 40px;
  height: 100%;
  overflow-y: auto;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}
.page-sub {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.btn-primary {
  padding: 9px 18px;
  background: var(--accent);
  color: #000;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 13px;
  transition: opacity var(--transition);
}
.btn-primary:hover { opacity: 0.88; }

.instance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 20px;
  color: var(--text-secondary);
  font-size: 14px;
}
.empty-state span { font-size: 40px; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label { font-size: 12px; font-weight: 600; color: var(--text-secondary); }

.form-input {
  padding: 9px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 13px;
  transition: border-color var(--transition);
}
.form-input:focus { border-color: var(--accent); }

.loader-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.loader-btn {
  padding: 9px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  transition: background var(--transition), border-color var(--transition), color var(--transition);
}
.loader-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
.loader-btn.active {
  border-color: var(--accent);
  background: var(--accent-dim);
  color: var(--accent);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.btn-cancel {
  padding: 9px 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 13px;
  transition: background var(--transition);
}
.btn-cancel:hover { background: var(--bg-hover); }
</style>
