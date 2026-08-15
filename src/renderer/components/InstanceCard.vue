<template>
  <div class="instance-card" :class="{ active: isActive }" @click="$emit('select')">
    <!-- Icon -->
    <div class="card-icon">
      <img v-if="instance.iconPath" :src="instance.iconPath" alt="" />
      <span v-else class="icon-emoji">{{ loaderEmoji }}</span>
    </div>

    <!-- Info -->
    <div class="card-info">
      <p class="card-name truncate">{{ instance.name }}</p>
      <p class="card-meta">{{ instance.mcVersion }} · {{ loaderLabel }}</p>
    </div>

    <!-- Play -->
    <button class="play-btn" title="Launch" @click.stop="$emit('launch')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5,3 19,12 5,21"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Instance } from '@/types'

const props = defineProps<{
  instance: Instance
  isActive?: boolean
}>()

defineEmits<{
  select: []
  launch: []
}>()

const loaderLabel = computed(() => {
  const map: Record<string, string> = {
    vanilla:  'Vanilla',
    fabric:   'Fabric',
    forge:    'Forge',
    neoforge: 'NeoForge'
  }
  return map[props.instance.loader] ?? props.instance.loader
})

const loaderEmoji = computed(() => {
  const map: Record<string, string> = {
    vanilla:  '🌿',
    fabric:   '🧵',
    forge:    '⚒️',
    neoforge: '🔥'
  }
  return map[props.instance.loader] ?? '🎮'
})
</script>

<style scoped>
.instance-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  cursor: pointer;
  transition: border-color var(--transition), background var(--transition), box-shadow var(--transition);
}
.instance-card:hover {
  border-color: var(--border-focus);
  background: var(--bg-elevated);
}
.instance-card.active {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent-dim);
}

.card-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  overflow: hidden;
}
.card-icon img { width: 100%; height: 100%; object-fit: cover; }

.card-info {
  flex: 1;
  min-width: 0;
}
.card-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.card-meta {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.play-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-dim);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition), transform var(--transition);
  flex-shrink: 0;
}
.play-btn:hover {
  background: var(--accent);
  color: #000;
  transform: scale(1.08);
}
</style>
