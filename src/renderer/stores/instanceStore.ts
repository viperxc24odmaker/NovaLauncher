import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Instance } from '@/types'

const STORAGE_KEY = 'novalauncher.instances'

function generateId(): string { return `inst_${Date.now()}_${Math.random().toString(36).slice(2,7)}` }
const DEFAULT_INSTANCES: Instance[] = []

export const useInstanceStore = defineStore('instances', () => {
  const instances = ref<Instance[]>(loadInstances())
  const activeId = ref<string | null>(null)

  function loadInstances(): Instance[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Instance[] : [...DEFAULT_INSTANCES]
    } catch { return [...DEFAULT_INSTANCES] }
  }

  function getById(id:string):Instance|undefined{return instances.value.find(instance=>instance.id===id)}
  function addInstance(partial:Omit<Instance,'id'|'playTime'|'createdAt'>):Instance{const instance:Instance={...partial,id:generateId(),playTime:0,createdAt:new Date().toISOString()};instances.value.push(instance);return instance}
  function removeInstance(id:string){instances.value=instances.value.filter(instance=>instance.id!==id);if(activeId.value===id)activeId.value=null}
  function setActive(id:string|null){activeId.value=id}

  watch(instances,value=>localStorage.setItem(STORAGE_KEY,JSON.stringify(value)),{deep:true})
  return {instances,activeId,getById,addInstance,removeInstance,setActive}
})
