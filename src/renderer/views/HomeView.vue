<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <p class="hero-eyebrow">Ready to play</p>
        <h1 class="hero-title">
          What are you<br>
          <span class="accent">building today?</span>
        </h1>
        <p class="hero-sub">
          {{ instanceStore.instances.length }} instance{{ instanceStore.instances.length !== 1 ? 's' : '' }} ·
          {{ activeAccount ? activeAccount.username : 'No account' }}
        </p>
        <div class="hero-actions">
          <button class="btn-play" :disabled="!selectedInstance || !activeAccount" @click="launch">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
            Launch
          </button>
          <button class="btn-secondary" @click="$router.push('/instances')">
            Manage Instances
          </button>
        </div>

        <!-- No-account warning -->
        <p v-if="!activeAccount" class="warn">
          <router-link to="/accounts">Add an account</router-link> to start playing
        </p>
      </div>

      <!-- Decorative grid -->
      <div class="hero-deco" aria-hidden="true">
        <div class="deco-grid">
          <div v-for="n in 64" :key="n" class="deco-cell"
               :style="{ opacity: Math.random() * 0.3 + 0.05 }"></div>
        </div>
        <div class="deco-glow"></div>
      </div>
    </section>

    <!-- Quick instances -->
    <section class="quick-section" v-if="instanceStore.instances.length > 0">
      <h2 class="section-title">Recent Instances</h2>
      <div class="quick-grid">
        <InstanceCard
          v-for="inst in recentInstances"
          :key="inst.id"
          :instance="inst"
          :is-active="selectedInstance?.id === inst.id"
          @select="selectedInstance = inst"
          @launch="launch"
        />
      </div>
    </section>

    <!-- Empty state -->
    <section class="empty-section" v-else>
      <div class="empty-card">
        <span class="empty-icon">🧱</span>
        <h3>No instances yet</h3>
        <p>Create your first instance to get started.</p>
        <button class="btn-play" @click="$router.push('/instances')">
          Create Instance
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInstanceStore } from '@/stores/instanceStore'
import { useAccountStore }  from '@/stores/accountStore'
import InstanceCard from '@/components/InstanceCard.vue'
import type { Instance } from '@/types'

const instanceStore = useInstanceStore()
const accountStore  = useAccountStore()

const selectedInstance = ref<Instance | null>(
  instanceStore.instances[0] ?? null
)

const activeAccount  = computed(() => accountStore.activeAccount)
const recentInstances = computed(() =>
  [...instanceStore.instances]
    .sort((a, b) => (b.lastPlayed ?? '').localeCompare(a.lastPlayed ?? ''))
    .slice(0, 6)
)

function launch() {
  if (!selectedInstance.value) return
  // LauncherService will be wired up in a future milestone
  alert(`Launching "${selectedInstance.value.name}" — coming soon!`)
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

/* Hero */
.hero {
  position: relative;
  padding: 60px 40px 48px;
  overflow: hidden;
  flex-shrink: 0;
}

.hero-content { position: relative; z-index: 1; max-width: 520px; }

.hero-eyebrow {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin-bottom: 14px;
}

.hero-title {
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 700;
  line-height: 1.15;
  color: var(--text-primary);
  margin-bottom: 12px;
}
.accent { color: var(--accent); }

.hero-sub {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 28px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-play {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--accent);
  color: #000;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 13px;
  transition: opacity var(--transition), transform var(--transition);
}
.btn-play:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
.btn-play:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-secondary {
  padding: 10px 18px;
  border: 1px solid var(--border-focus);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  transition: background var(--transition), border-color var(--transition);
}
.btn-secondary:hover { background: var(--bg-elevated); border-color: var(--border-focus); }

.warn {
  margin-top: 14px;
  font-size: 12px;
  color: var(--text-secondary);
}
.warn a { color: var(--accent); text-decoration: underline; }

/* Decorative background */
.hero-deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.deco-grid {
  position: absolute;
  right: 0; top: 0;
  width: 55%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 2px;
  padding: 20px;
}

.deco-cell {
  border-radius: 4px;
  background: var(--accent);
}

.deco-glow {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
  border-radius: 50%;
}

/* Quick instances */
.quick-section {
  padding: 0 40px 40px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 14px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
}

/* Empty */
.empty-section {
  padding: 0 40px 40px;
  display: flex;
  justify-content: center;
}

.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 48px 32px;
  border: 1px dashed var(--border);
  border-radius: var(--radius-lg);
  max-width: 360px;
  text-align: center;
}

.empty-icon { font-size: 40px; }
.empty-card h3 { font-size: 16px; font-weight: 600; }
.empty-card p  { font-size: 13px; color: var(--text-secondary); }
</style>
