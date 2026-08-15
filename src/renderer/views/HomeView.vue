<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <p class="hero-eyebrow">Ready to play</p>
        <h1 class="hero-title">What are you<br><span class="accent">building today?</span></h1>
        <p class="hero-sub">{{ instanceStore.instances.length }} instance{{ instanceStore.instances.length !== 1 ? 's' : '' }} · {{ activeAccount ? activeAccount.username : 'No account' }}</p>
        <div class="hero-actions">
          <button class="btn-play" :disabled="!selectedInstance || !activeAccount || launching" @click="launch">▶ {{ launching ? 'Launching…' : 'Launch' }}</button>
          <button class="btn-secondary" @click="$router.push('/instances')">Manage Instances</button>
        </div>
        <p v-if="!activeAccount" class="warn"><router-link to="/accounts">Add an account</router-link> to start playing</p>
      </div>
      <div class="hero-deco" aria-hidden="true"><div class="deco-grid"><div v-for="n in 64" :key="n" class="deco-cell"></div></div><div class="deco-glow"></div></div>
    </section>

    <section class="quick-section" v-if="instanceStore.instances.length"><h2 class="section-title">Recent Instances</h2><div class="quick-grid"><InstanceCard v-for="inst in recentInstances" :key="inst.id" :instance="inst" :is-active="selectedInstance?.id === inst.id" @select="selectedInstance = inst" @launch="launch" /></div></section>
    <section class="empty-section" v-else><div class="empty-card"><span class="empty-icon">🧱</span><h3>No instances yet</h3><p>Create your first instance to get started.</p><button class="btn-play" @click="$router.push('/instances')">Create Instance</button></div></section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useInstanceStore } from '@/stores/instanceStore'
import { useAccountStore } from '@/stores/accountStore'
import InstanceCard from '@/components/InstanceCard.vue'
import type { Instance } from '@/types'

const instanceStore=useInstanceStore(); const accountStore=useAccountStore(); const selectedInstance=ref<Instance|null>(instanceStore.instances[0]??null); const launching=ref(false)
const activeAccount=computed(()=>accountStore.activeAccount); const recentInstances=computed(()=>[...instanceStore.instances].sort((a,b)=>(b.lastPlayed??'').localeCompare(a.lastPlayed??'')).slice(0,6))

onMounted(()=>accountStore.load())
async function launch(){if(!selectedInstance.value||!activeAccount.value||launching.value)return;launching.value=true;try{await window.electronAPI.launchMinecraft({id:selectedInstance.value.id,version:selectedInstance.value.mcVersion,loader:selectedInstance.value.loader,loaderVersion:selectedInstance.value.loaderVersion,memoryMin:1024,memoryMax:4096});selectedInstance.value.lastPlayed=new Date().toISOString()}catch(error){window.alert(`NovaLauncher could not start Minecraft:\n\n${error instanceof Error?error.message:String(error)}`)}finally{launching.value=false}}
</script>

<style scoped>
.home{display:flex;flex-direction:column;height:100%;overflow-y:auto}.hero{position:relative;padding:60px 40px 48px;overflow:hidden;flex-shrink:0}.hero-content{position:relative;z-index:1;max-width:520px}.hero-eyebrow{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:14px}.hero-title{font-size:clamp(28px,3vw,40px);font-weight:700;line-height:1.15;margin-bottom:12px}.accent{color:var(--accent)}.hero-sub{font-size:13px;color:var(--text-secondary);margin-bottom:28px}.hero-actions{display:flex;gap:12px;flex-wrap:wrap}.btn-play{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:var(--accent);color:#000;border-radius:var(--radius-md);font-weight:700;font-size:13px}.btn-play:disabled{opacity:.4;cursor:not-allowed}.btn-secondary{padding:10px 18px;border:1px solid var(--border-focus);border-radius:var(--radius-md);color:var(--text-primary);font-size:13px}.warn{margin-top:14px;font-size:12px;color:var(--text-secondary)}.warn a{color:var(--accent);text-decoration:underline}.hero-deco{position:absolute;inset:0;pointer-events:none}.deco-grid{position:absolute;right:0;top:0;width:55%;height:100%;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);gap:2px;padding:20px}.deco-cell{border-radius:4px;background:var(--accent);opacity:.12}.deco-glow{position:absolute;right:10%;top:50%;transform:translateY(-50%);width:300px;height:300px;background:radial-gradient(circle,var(--accent-glow) 0%,transparent 70%);border-radius:50%}.quick-section{padding:0 40px 40px}.section-title{font-size:13px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px}.quick-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}.empty-section{padding:0 40px 40px;display:flex;justify-content:center}.empty-card{display:flex;flex-direction:column;align-items:center;gap:10px;padding:48px 32px;border:1px dashed var(--border);border-radius:var(--radius-lg);max-width:360px;text-align:center}.empty-icon{font-size:40px}.empty-card h3{font-size:16px;font-weight:600}.empty-card p{font-size:13px;color:var(--text-secondary)}
</style>
