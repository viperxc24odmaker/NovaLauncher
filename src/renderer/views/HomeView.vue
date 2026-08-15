<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <p class="hero-eyebrow">NovaLauncher</p>
        <h1 class="hero-title">Your Minecraft.<br><span class="accent">Your way.</span></h1>
        <p class="hero-sub">{{ instanceStore.instances.length }} instance{{ instanceStore.instances.length !== 1 ? 's' : '' }} · {{ activeAccount ? activeAccount.username : 'No account selected' }}</p>
        <div class="hero-actions">
          <button class="btn-play" :disabled="!selectedInstance || !activeAccount || launching" @click="launch">▶ {{ launching ? 'Launching…' : 'Play' }}</button>
          <button class="btn-secondary" @click="$router.push('/instances')">Manage Instances</button>
          <button v-if="!activeAccount" class="btn-secondary" @click="$router.push('/accounts')">Add Account</button>
        </div>
      </div>
      <div class="hero-deco" aria-hidden="true"><div class="deco-grid"><div v-for="n in 64" :key="n" class="deco-cell"></div></div><div class="deco-glow"></div></div>
    </section>

    <section class="stats-grid">
      <button class="stat-card" @click="$router.push('/instances')"><span class="stat-icon">🎮</span><span><strong>{{ instanceStore.instances.length }}</strong><small>Instances</small></span></button>
      <button class="stat-card" @click="$router.push('/accounts')"><span class="stat-icon">👤</span><span><strong>{{ accountStore.accounts.length }}</strong><small>Accounts</small></span></button>
      <button class="stat-card" @click="$router.push('/mods')"><span class="stat-icon">🧩</span><span><strong>Mods</strong><small>Manage your mods</small></span></button>
      <button class="stat-card" @click="$router.push('/modpacks')"><span class="stat-icon">📦</span><span><strong>Modpacks</strong><small>Browse Modrinth packs</small></span></button>
    </section>

    <section class="quick-section" v-if="instanceStore.instances.length">
      <div class="section-heading"><h2 class="section-title">Recent Instances</h2><button @click="$router.push('/instances')">View all →</button></div>
      <div class="quick-grid"><InstanceCard v-for="inst in recentInstances" :key="inst.id" :instance="inst" :is-active="selectedInstance?.id === inst.id" @select="selectedInstance = inst" @launch="launch" /></div>
    </section>
    <section class="empty-section" v-else>
      <div class="empty-card"><span class="empty-icon">⛏️</span><h3>Ready for your first world?</h3><p>Create an isolated Minecraft instance with Vanilla, Fabric, Forge, or NeoForge.</p><button class="btn-play" @click="$router.push('/instances')">Create Instance</button></div>
    </section>

    <section class="news-preview">
      <div class="section-heading"><h2 class="section-title">Minecraft News</h2><button @click="$router.push('/news')">Open news →</button></div>
      <div class="news-placeholder"><span>📰</span><div><strong>Stay up to date</strong><p>NovaLauncher will surface Minecraft news here as the live feed is enabled.</p></div></div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useInstanceStore } from '@/stores/instanceStore'
import { useAccountStore } from '@/stores/accountStore'
import InstanceCard from '@/components/InstanceCard.vue'
import type { Instance } from '@/types'

const instanceStore = useInstanceStore()
const accountStore = useAccountStore()
const selectedInstance = ref<Instance | null>(instanceStore.instances[0] ?? null)
const launching = ref(false)
const activeAccount = computed(() => accountStore.activeAccount)
const recentInstances = computed(() => [...instanceStore.instances].sort((a, b) => (b.lastPlayed ?? '').localeCompare(a.lastPlayed ?? '')).slice(0, 6))

onMounted(() => { void accountStore.load().catch(() => undefined) })

async function launch(): Promise<void> {
  if (!selectedInstance.value || !activeAccount.value || launching.value) return
  launching.value = true
  try {
    await window.electronAPI.launchMinecraft({ id: selectedInstance.value.id, version: selectedInstance.value.mcVersion, loader: selectedInstance.value.loader, loaderVersion: selectedInstance.value.loaderVersion, memoryMin: 1024, memoryMax: 4096 })
    selectedInstance.value.lastPlayed = new Date().toISOString()
  } catch (error) {
    window.alert(`NovaLauncher could not start Minecraft:\n\n${error instanceof Error ? error.message : String(error)}`)
  } finally { launching.value = false }
}
</script>

<style scoped>
.home{display:flex;flex-direction:column;min-height:100%;overflow-y:auto}.hero{position:relative;padding:58px 40px 46px;overflow:hidden;flex-shrink:0;border-bottom:1px solid var(--border)}.hero-content{position:relative;z-index:1;max-width:620px}.hero-eyebrow{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin-bottom:14px}.hero-title{font-size:clamp(32px,4vw,52px);font-weight:800;line-height:1.05;letter-spacing:-.03em;margin-bottom:14px}.accent{color:var(--accent)}.hero-sub{font-size:13px;color:var(--text-secondary);margin-bottom:26px}.hero-actions{display:flex;gap:10px;flex-wrap:wrap}.btn-play{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:var(--accent);color:#000;border-radius:var(--radius-md);font-weight:800;font-size:13px}.btn-play:disabled{opacity:.4;cursor:not-allowed}.btn-secondary{padding:10px 16px;border:1px solid var(--border-focus);border-radius:var(--radius-md);color:var(--text-primary);font-size:13px;background:var(--bg-surface)}.hero-deco{position:absolute;inset:0;pointer-events:none}.deco-grid{position:absolute;right:0;top:0;width:55%;height:100%;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);gap:2px;padding:20px}.deco-cell{border-radius:4px;background:var(--accent);opacity:.1}.deco-glow{position:absolute;right:10%;top:50%;transform:translateY(-50%);width:300px;height:300px;background:radial-gradient(circle,var(--accent-glow) 0%,transparent 70%);border-radius:50%}.stats-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;padding:24px 40px}.stat-card{display:flex;align-items:center;gap:12px;padding:16px;text-align:left;border:1px solid var(--card-border);border-radius:var(--radius-md);background:var(--card-bg);color:var(--text-primary);transition:transform var(--transition),border-color var(--transition)}.stat-card:hover{transform:translateY(-2px);border-color:var(--border-focus)}.stat-icon{font-size:22px}.stat-card strong,.stat-card small{display:block}.stat-card strong{font-size:14px}.stat-card small{margin-top:3px;font-size:11px;color:var(--text-secondary)}.quick-section,.news-preview{padding:0 40px 30px}.section-heading{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.section-heading button{font-size:11px;color:var(--accent)}.section-title{font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.08em}.quick-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}.empty-section{padding:0 40px 30px}.empty-card{display:flex;flex-direction:column;align-items:center;gap:10px;padding:34px 28px;border:1px dashed var(--border);border-radius:var(--radius-lg);text-align:center;background:var(--card-bg)}.empty-icon{font-size:34px}.empty-card h3{font-size:15px}.empty-card p{max-width:440px;font-size:12px;color:var(--text-secondary);line-height:1.5}.news-placeholder{display:flex;align-items:center;gap:14px;padding:18px;border:1px solid var(--card-border);border-radius:var(--radius-md);background:var(--card-bg)}.news-placeholder>span{font-size:28px}.news-placeholder strong{font-size:13px}.news-placeholder p{margin-top:4px;font-size:11px;color:var(--text-secondary)}@media(max-width:900px){.stats-grid{grid-template-columns:repeat(2,1fr)}.hero,.stats-grid,.quick-section,.news-preview,.empty-section{padding-left:20px;padding-right:20px}}
</style>
