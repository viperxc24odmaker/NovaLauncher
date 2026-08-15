import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Instance, ModLoader } from '@/types'

function generateId(): string {
  return `inst_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

// Demo instances so the UI isn't empty on first launch
const DEMO_INSTANCES: Instance[] = [
  {
    id: 'demo_1',
    name: 'Survival World',
    mcVersion: '1.21.1',
    loader: 'fabric',
    loaderVersion: '0.15.11',
    iconPath: null,
    lastPlayed: new Date(Date.now() - 3600_000).toISOString(),
    playTime: 412,
    description: 'Main survival world with performance mods',
    createdAt: new Date(Date.now() - 7 * 86400_000).toISOString()
  },
  {
    id: 'demo_2',
    name: 'Modded Mayhem',
    mcVersion: '1.20.1',
    loader: 'forge',
    loaderVersion: '47.2.23',
    iconPath: null,
    lastPlayed: new Date(Date.now() - 86400_000).toISOString(),
    playTime: 87,
    description: 'Big kitchen sink pack',
    createdAt: new Date(Date.now() - 14 * 86400_000).toISOString()
  },
  {
    id: 'demo_3',
    name: 'Vanilla Snapshot',
    mcVersion: '1.21.4',
    loader: 'vanilla',
    iconPath: null,
    playTime: 0,
    createdAt: new Date().toISOString()
  }
]

export const useInstanceStore = defineStore('instances', () => {
  const instances     = ref<Instance[]>(DEMO_INSTANCES)
  const activeId      = ref<string | null>(null)

  function getById(id: string): Instance | undefined {
    return instances.value.find(i => i.id === id)
  }

  function addInstance(partial: Omit<Instance, 'id' | 'playTime' | 'createdAt'>): Instance {
    const instance: Instance = {
      ...partial,
      id: generateId(),
      playTime: 0,
      createdAt: new Date().toISOString()
    }
    instances.value.push(instance)
    return instance
  }

  function removeInstance(id: string) {
    instances.value = instances.value.filter(i => i.id !== id)
    if (activeId.value === id) activeId.value = null
  }

  function setActive(id: string | null) {
    activeId.value = id
  }

  return { instances, activeId, getById, addInstance, removeInstance, setActive }
})
