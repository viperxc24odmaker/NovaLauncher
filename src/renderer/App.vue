<template>
  <div class="app-shell" :data-theme="settingsStore.theme">
    <!-- Custom title bar (frameless window) -->
    <TitleBar />

    <div class="app-body">
      <!-- Sidebar navigation -->
      <Sidebar />

      <!-- Main content area -->
      <main class="content">
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
import { onMounted } from 'vue'
import TitleBar from '@/components/TitleBar.vue'
import Sidebar  from '@/components/Sidebar.vue'
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()

onMounted(async () => {
  await settingsStore.load()
})
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow-y: auto;
  background: var(--bg);
}

/* Page transition */
.fade-enter-active,
.fade-leave-active { transition: opacity 120ms ease, transform 120ms ease; }
.fade-enter-from   { opacity: 0; transform: translateY(6px); }
.fade-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>
