<template>
  <div class="app-shell" :data-theme="settingsStore.theme">
    <TitleBar />
    <div class="app-body">
      <Sidebar />
      <main class="content">
        <div v-if="startupError" class="startup-banner">
          <span>Settings could not be loaded: {{ startupError }}</span>
          <button @click="retryStartup">Retry</button>
        </div>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TitleBar from '@/components/TitleBar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()
const startupError = ref('')

async function retryStartup(): Promise<void> {
  startupError.value = ''
  try {
    await settingsStore.load()
  } catch (error) {
    startupError.value = error instanceof Error ? error.message : String(error)
  }
}

onMounted(() => { void retryStartup() })
</script>

<style scoped>
.app-shell{display:flex;flex-direction:column;width:100vw;height:100vh;overflow:hidden;background:var(--bg)}
.app-body{display:flex;flex:1;overflow:hidden}
.content{position:relative;flex:1;min-width:0;overflow-y:auto;background:var(--bg)}
.startup-banner{position:absolute;top:10px;left:10px;right:10px;z-index:200;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 12px;border:1px solid rgba(239,68,68,.35);border-radius:var(--radius-md);background:rgba(127,29,29,.92);color:#fff;font-size:12px;backdrop-filter:blur(8px)}
.startup-banner button{padding:5px 10px;border-radius:var(--radius-sm);background:#fff;color:#111;font-size:11px;font-weight:700}
.fade-enter-active,.fade-leave-active{transition:opacity 120ms ease,transform 120ms ease}.fade-enter-from{opacity:0;transform:translateY(6px)}.fade-leave-to{opacity:0;transform:translateY(-4px)}
</style>
