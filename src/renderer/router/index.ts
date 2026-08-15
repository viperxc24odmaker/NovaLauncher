import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView      from '@/views/HomeView.vue'
import InstancesView from '@/views/InstancesView.vue'
import ModsView      from '@/views/ModsView.vue'
import ModpacksView  from '@/views/ModpacksView.vue'
import AccountsView  from '@/views/AccountsView.vue'
import NewsView      from '@/views/NewsView.vue'
import SettingsView  from '@/views/SettingsView.vue'

const routes = [
  { path: '/',          name: 'home',      component: HomeView      },
  { path: '/instances', name: 'instances', component: InstancesView },
  { path: '/mods',      name: 'mods',      component: ModsView      },
  { path: '/modpacks',  name: 'modpacks',  component: ModpacksView  },
  { path: '/accounts',  name: 'accounts',  component: AccountsView  },
  { path: '/news',      name: 'news',      component: NewsView      },
  { path: '/settings',  name: 'settings',  component: SettingsView  }
]

export const router = createRouter({
  // Hash history works in both dev (Vite) and production (file://)
  history: createWebHashHistory(),
  routes
})
