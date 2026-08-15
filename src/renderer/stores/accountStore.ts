import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Account } from '@/types'

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])
  const initialized = ref(false)

  const activeAccount = computed(() => accounts.value.find(account => account.isActive) ?? null)

  async function load(): Promise<void> {
    accounts.value = await window.electronAPI.getAccounts()
    initialized.value = true
  }

  async function addOfflineAccount(username: string): Promise<Account> {
    const account = await window.electronAPI.addOfflineAccount(username)
    await load()
    return account
  }

  async function loginMicrosoft(): Promise<Account> {
    const account = await window.electronAPI.loginMicrosoft()
    await load()
    return account
  }

  async function removeAccount(id: string): Promise<void> {
    await window.electronAPI.removeAccount(id)
    await load()
  }

  async function setActive(id: string): Promise<void> {
    await window.electronAPI.setActiveAccount(id)
    await load()
  }

  return {
    accounts,
    initialized,
    activeAccount,
    load,
    addOfflineAccount,
    loginMicrosoft,
    removeAccount,
    setActive
  }
})
