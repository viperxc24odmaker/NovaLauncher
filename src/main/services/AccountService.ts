import Store from 'electron-store'
import type { Account as EMLAccount } from 'eml-lib'

export interface StoredAccount {
  id: string
  type: 'microsoft' | 'offline'
  account: EMLAccount
}

interface AccountStoreData {
  accounts: StoredAccount[]
  activeId: string | null
}

export class AccountService {
  private readonly store = new Store<AccountStoreData>({
    defaults: {
      accounts: [],
      activeId: null
    }
  })

  list(): StoredAccount[] {
    return this.store.get('accounts')
  }

  getActive(): StoredAccount | null {
    const activeId = this.store.get('activeId')
    return this.list().find(account => account.id === activeId) ?? null
  }

  add(type: StoredAccount['type'], account: EMLAccount): StoredAccount {
    const id = `acc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const stored: StoredAccount = { id, type, account }
    const accounts = this.list().filter(existing => existing.account.uuid !== account.uuid)
    accounts.push(stored)
    this.store.set('accounts', accounts)
    this.store.set('activeId', id)
    return stored
  }

  remove(id: string): void {
    const accounts = this.list().filter(account => account.id !== id)
    this.store.set('accounts', accounts)
    if (this.store.get('activeId') === id) {
      this.store.set('activeId', accounts[0]?.id ?? null)
    }
  }

  setActive(id: string): boolean {
    const exists = this.list().some(account => account.id === id)
    if (!exists) return false
    this.store.set('activeId', id)
    return true
  }

  update(id: string, account: EMLAccount): void {
    const accounts = this.list().map(existing =>
      existing.id === id ? { ...existing, account } : existing
    )
    this.store.set('accounts', accounts)
  }
}
