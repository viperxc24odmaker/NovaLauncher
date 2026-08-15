import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Account } from '@/types'

function generateId(): string {
  return `acc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  const activeAccount = computed(() =>
    accounts.value.find(a => a.isActive) ?? null
  )

  function addOfflineAccount(username: string): Account {
    // Deactivate existing
    accounts.value.forEach(a => (a.isActive = false))

    const account: Account = {
      id: generateId(),
      type: 'offline',
      username,
      uuid: crypto.randomUUID(),
      avatarUrl: null,
      isActive: true
    }
    accounts.value.push(account)
    return account
  }

  function removeAccount(id: string) {
    const idx = accounts.value.findIndex(a => a.id === id)
    if (idx === -1) return
    const wasActive = accounts.value[idx].isActive
    accounts.value.splice(idx, 1)
    // Activate the first remaining account if the removed one was active
    if (wasActive && accounts.value.length > 0) {
      accounts.value[0].isActive = true
    }
  }

  function setActive(id: string) {
    accounts.value.forEach(a => (a.isActive = a.id === id))
  }

  return { accounts, activeAccount, addOfflineAccount, removeAccount, setActive }
})
