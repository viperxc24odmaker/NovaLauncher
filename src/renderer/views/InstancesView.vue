<template>
  <div class="instances-view">
    <div class="page-header"><div><h1 class="page-title">Instances</h1><p class="page-sub">{{ instanceStore.instances.length }} instance{{ instanceStore.instances.length !== 1 ? 's' : '' }}</p></div><button class="btn-primary" @click="showCreate = true">+ New Instance</button></div>
    <div class="instance-grid" v-if="instanceStore.instances.length"><InstanceCard v-for="inst in instanceStore.instances" :key="inst.id" :instance="inst" :is-active="selectedId === inst.id" @select="selectedId = inst.id" @launch="launchInstance(inst)" /></div>
    <div class="empty-state" v-else><span>📦</span><p>No instances yet. Create one to get started!</p></div>

    <div class="modal-overlay" v-if="showCreate" @click.self="showCreate = false"><div class="modal">
      <h2 class="modal-title">New Instance</h2>
      <div class="form-group"><label>Name</label><input v-model="form.name" type="text" placeholder="My Instance" class="form-input" /></div>
      <div class="form-group"><label>Minecraft Version</label><select v-model="form.mcVersion" class="form-input"><option v-for="version in versions" :key="version" :value="version">{{ version }}</option></select></div>
      <div class="form-group"><label>Mod Loader</label><div class="loader-grid"><button v-for="loader in loaderOptions" :key="loader.value" class="loader-btn" :class="{ active: form.loader === loader.value }" @click="form.loader = loader.value">{{ loader.label }}</button></div></div>
      <div class="form-group" v-if="form.loader !== 'vanilla'"><label>Loader Version <span class="hint">(blank = latest compatible)</span></label><input v-model="form.loaderVersion" type="text" placeholder="Auto" class="form-input" /></div>
      <div class="java-row"><span>JRE for this Minecraft version is managed automatically.</span><button class="btn-secondary" :disabled="installingJava" @click="installJava">{{ installingJava ? 'Installing…' : 'Install JRE now' }}</button></div>
      <div class="modal-actions"><button class="btn-cancel" @click="showCreate = false">Cancel</button><button class="btn-primary" :disabled="!form.name.trim()" @click="createInstance">Create</button></div>
    </div></div>

    <div class="launch-overlay" v-if="launching"><div class="launch-card"><div class="spinner"></div><strong>Preparing Minecraft…</strong><span>Downloading missing files and starting the game.</span></div></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useInstanceStore } from '@/stores/instanceStore'
import InstanceCard from '@/components/InstanceCard.vue'
import type { Instance, ModLoader } from '@/types'

const instanceStore=useInstanceStore(); const selectedId=ref<string|null>(null); const showCreate=ref(false); const launching=ref(false); const installingJava=ref(false)
const versions=ref<string[]>(['26.2','26.1.2','1.21.11','1.21.1','1.20.1','1.0.0'])
const form=reactive({name:'',mcVersion:'26.2',loader:'vanilla' as ModLoader,loaderVersion:''})
const loaderOptions=[{value:'vanilla' as ModLoader,label:'Vanilla'},{value:'fabric' as ModLoader,label:'Fabric'},{value:'forge' as ModLoader,label:'Forge'},{value:'neoforge' as ModLoader,label:'NeoForge'}]

onMounted(async()=>{try{versions.value=await window.electronAPI.getMinecraftVersions();if(!versions.value.includes(form.mcVersion))form.mcVersion=versions.value[0]??'26.2'}catch{}})
function createInstance(){if(!form.name.trim()||!form.mcVersion.trim())return;instanceStore.addInstance({name:form.name.trim(),mcVersion:form.mcVersion,loader:form.loader,loaderVersion:form.loaderVersion.trim()||undefined,iconPath:null,lastPlayed:undefined,description:''});showCreate.value=false;form.name='';form.loader='vanilla';form.loaderVersion=''}
async function installJava(){installingJava.value=true;try{await window.electronAPI.installJava(form.mcVersion);window.alert(`Java for Minecraft ${form.mcVersion} is installed.`)}catch(error){window.alert(error instanceof Error?error.message:String(error))}finally{installingJava.value=false}}
async function launchInstance(inst:Instance){launching.value=true;try{await window.electronAPI.launchMinecraft({id:inst.id,version:inst.mcVersion,loader:inst.loader,loaderVersion:inst.loaderVersion,memoryMin:1024,memoryMax:4096});inst.lastPlayed=new Date().toISOString()}catch(error){window.alert(`NovaLauncher could not start Minecraft:\n\n${error instanceof Error?error.message:String(error)}`)}finally{launching.value=false}}
</script>

<style scoped>
.instances-view{padding:32px 40px;height:100%;overflow-y:auto}.page-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px}.page-title{font-size:22px;font-weight:700}.page-sub{font-size:12px;color:var(--text-secondary);margin-top:2px}.btn-primary{padding:9px 18px;background:var(--accent);color:#000;border-radius:var(--radius-md);font-weight:700;font-size:13px}.btn-primary:disabled,.btn-secondary:disabled{opacity:.45;cursor:not-allowed}.btn-secondary{padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-secondary);font-size:11px}.instance-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}.empty-state{display:flex;flex-direction:column;align-items:center;gap:12px;padding:80px 20px;color:var(--text-secondary);font-size:14px}.empty-state span{font-size:40px}.modal-overlay,.launch-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(4px)}.modal{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius-lg);padding:28px;width:420px;display:flex;flex-direction:column;gap:18px}.modal-title{font-size:16px;font-weight:700}.form-group{display:flex;flex-direction:column;gap:6px}.form-group label{font-size:12px;font-weight:600;color:var(--text-secondary)}.hint{font-weight:400;opacity:.7}.form-input{padding:9px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-primary);font-size:13px}.loader-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.loader-btn{padding:9px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:12px;color:var(--text-secondary)}.loader-btn.active{border-color:var(--accent);background:var(--accent-dim);color:var(--accent)}.java-row{display:flex;align-items:center;gap:10px;font-size:11px;color:var(--text-secondary)}.java-row span{flex:1}.modal-actions{display:flex;justify-content:flex-end;gap:10px}.btn-cancel{padding:9px 18px;border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-secondary)}.launch-card{width:340px;padding:28px;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--bg-elevated);display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}.launch-card span{font-size:12px;color:var(--text-secondary)}.spinner{width:28px;height:28px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
</style>
