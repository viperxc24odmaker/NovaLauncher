<template>
  <div class="accounts-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">Accounts</h1>
        <p class="page-sub">Manage your Minecraft profiles</p>
      </div>
    </div>

    <!-- Account list -->
    <div class="account-list" v-if="accountStore.accounts.length > 0">
      <div
        v-for="acc in accountStore.accounts"
        :key="acc.id"
        class="account-item"
        :class="{ active: acc.isActive }"
        @click="accountStore.setActive(acc.id)"
      >
        <div class="acc-avatar">{{ acc.username.charAt(0).toUpperCase() }}</div>
        <div class="acc-info">
          <p class="acc-name">{{ acc.username }}</p>
          <p class="acc-type">{{ typeLabel(acc.type) }}</p>
        </div>
        <span class="active-badge" v-if="acc.isActive">Active</span>
        <button class="remove-btn" title="Remove" @click.stop="accountStore.removeAccount(acc.id)">
          ✕
        </button>
      </div>
    </div>

    <div class="empty-state" v-else>
      <span>👤</span>
      <p>No accounts added yet.</p>
    </div>

    <!-- Add account options -->
    <div class="add-section">
      <h3 class="add-title">Add Account</h3>
      <div class="add-options">
        <!-- Microsoft -->
        <div class="add-card add-card--soon">
          <div class="add-card-icon">🔷</div>
          <div>
            <p class="add-card-name">Microsoft</p>
            <p class="add-card-desc">Official Minecraft authentication</p>
          </div>
          <span class="coming-soon-tag">Soon</span>
        </div>

        <!-- Ely.by -->
        <div class="add-card add-card--soon">
          <div class="add-card-icon">🟣</div>
          <div>
            <p class="add-card-name">Ely.by</p>
            <p class="add-card-desc">Ely.by Yggdrasil authentication</p>
          </div>
          <span class="coming-soon-tag">Soon</span>
        </div>

        <!-- Offline -->
        <div class="add-card" @click="showOffline = true">
          <div class="add-card-icon">🌐</div>
          <div>
            <p class="add-card-name">Offline Profile</p>
            <p class="add-card-desc">Play on offline / local servers</p>
          </div>
          <span class="add-arrow">→</span>
        </div>
      </div>
    </div>

    <!-- Offline account modal -->
    <div class="modal-overlay" v-if="showOffline" @click.self="showOffline = false">
      <div class="modal">
        <h2 class="modal-title">Add Offline Account</h2>
        <div class="form-group">
          <label>Username</label>
          <input v-model="offlineUsername" type="text" placeholder="Steve" class="form-input"
                 @keyup.enter="addOffline" />
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showOffline = false">Cancel</button>
          <button class="btn-primary" @click="addOffline">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAccountStore } from '@/stores/accountStore'
import type { AccountType } from '@/types'

const accountStore    = useAccountStore()
const showOffline     = ref(false)
const offlineUsername = ref('')

function typeLabel(type: AccountType): string {
  const map: Record<AccountType, string> = {
    microsoft: 'Microsoft Account',
    elyby:     'Ely.by Account',
    offline:   'Offline Profile'
  }
  return map[type]
}

function addOffline() {
  if (!offlineUsername.value.trim()) return
  accountStore.addOfflineAccount(offlineUsername.value.trim())
  offlineUsername.value = ''
  showOffline.value     = false
}
</script>

<style scoped>
.accounts-view {
  padding: 32px 40px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.page-header { display: flex; align-items: flex-end; justify-content: space-between; }
.page-title  { font-size: 22px; font-weight: 700; }
.page-sub    { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

/* Account list */
.account-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--transition);
}
.account-item:hover { border-color: var(--border-focus); }
.account-item.active { border-color: var(--accent); }

.acc-avatar {
  width: 40px; height: 40px;
  border-radius: var(--radius-sm);
  background: var(--accent-dim);
  color: var(--accent);
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.acc-info { flex: 1; min-width: 0; }
.acc-name { font-size: 13px; font-weight: 600; }
.acc-type { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }

.active-badge {
  padding: 3px 10px;
  background: var(--accent-dim);
  color: var(--accent);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.remove-btn {
  color: var(--text-muted);
  font-size: 12px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background var(--transition), color var(--transition);
}
.remove-btn:hover { background: rgba(255,80,80,0.12); color: #ff5050; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px;
  color: var(--text-secondary);
  font-size: 14px;
}
.empty-state span { font-size: 32px; }

/* Add section */
.add-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
}

.add-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.add-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--transition), background var(--transition);
}
.add-card:hover:not(.add-card--soon) { border-color: var(--border-focus); background: var(--bg-elevated); }
.add-card--soon { cursor: default; opacity: 0.5; }

.add-card-icon { font-size: 24px; flex-shrink: 0; }
.add-card-name { font-size: 13px; font-weight: 600; }
.add-card-desc { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }

.add-arrow { margin-left: auto; color: var(--text-secondary); font-size: 16px; }
.coming-soon-tag {
  margin-left: auto;
  padding: 3px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
}

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}
.modal {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.modal-title { font-size: 16px; font-weight: 700; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 12px; font-weight: 600; color: var(--text-secondary); }
.form-input {
  padding: 9px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 13px;
  transition: border-color var(--transition);
}
.form-input:focus { border-color: var(--accent); }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
.btn-primary {
  padding: 9px 18px;
  background: var(--accent);
  color: #000;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 13px;
}
.btn-cancel {
  padding: 9px 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 13px;
}
.btn-cancel:hover { background: var(--bg-hover); }
</style>
