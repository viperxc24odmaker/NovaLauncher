<template>
  <div class="app-shell" :data-theme="settingsStore.theme">
    <TitleBar />
    <div class="app-body">
      <Sidebar />
      <main class="content">
        <div v-if="startupError" class="startup-error">
          <div class="error-card">
            <div class="error-icon">!</div>
            <h1>NovaLauncher started with limited settings</h1>
            <p>{{ startupError }}</p>
            <button @click="retryStartup">Retry</button>
          </div>
        </div>
        <router-view v-else v-slot="{ Component }">
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

onMounted(() => {
  void retryStartup()
})
</script>

<style scoped>
.app-shell{display:flex;flex-direction:column;width:100vw;height:100vh;overflow:hidden;background:var(--bg)}
.app-body{display:flex;flex:1;overflow:hidden}
.content{position:relative;flex:1;min-width:0;overflow-y:auto;background:var(--bg)}
.startup-error{height:100%;display:grid;place-items:center;padding:32px}
.error-card{max-width:520px;padding:32px;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--card-bg);text-align:center}
.error-icon{width:40px;height:40px;margin:0 auto 16px;display:grid;place-items:center;border-radius:50%;background:#7f1d1d;color:#fff;font-weight:800}
.error-card h1{font-size:18px;margin-bottom:10px}.error-card p{color:var(--text-secondary);font-size:13px;line-height:1.6;margin-bottom:20px}
.error-card button{padding:9px 18px;border-radius:var(--radius-md);background:var(--accent);color:#000;font-weight:700}
.fade-enter-active,.fade-leave-active{transition:opacity 120ms ease,transform 120ms ease}.fade-enter-from{opacity:0;transform:translateY(6px)}.fade-leave-to{opacity:0;transform:translateY(-4px)}
</style>
