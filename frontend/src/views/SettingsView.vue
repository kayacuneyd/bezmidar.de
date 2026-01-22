<script setup>
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const themeStore = useThemeStore()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <main class="pb-24">
    <header class="px-4 pt-12 pb-6">
      <h1 class="text-2xl font-bold">Ayarlar</h1>
    </header>

    <div class="px-4 space-y-4">
      <!-- Appearance -->
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-200 dark:border-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Görünüm</p>
        </div>
        
        <button 
          @click="themeStore.toggleTheme()"
          class="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-slate-500">
              {{ themeStore.theme === 'dark' ? 'dark_mode' : 'light_mode' }}
            </span>
            <span>Karanlık Mod</span>
          </div>
          <div 
            class="w-12 h-7 rounded-full p-1 transition-colors"
            :class="themeStore.theme === 'dark' ? 'bg-primary' : 'bg-slate-300'"
          >
            <div 
              class="w-5 h-5 bg-white rounded-full shadow-md transition-transform"
              :class="themeStore.theme === 'dark' ? 'translate-x-5' : 'translate-x-0'"
            ></div>
          </div>
        </button>
      </div>

      <!-- App Info -->
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-200 dark:border-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Uygulama</p>
        </div>
        
        <div class="p-4 flex items-center justify-between">
          <span class="text-slate-500">Versiyon</span>
          <span class="font-medium">1.0.0</span>
        </div>
        
        <div class="p-4 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
          <span class="text-slate-500">PWA Durumu</span>
          <span class="text-primary font-medium flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">check_circle</span>
            Yüklü
          </span>
        </div>
      </div>

      <!-- Data -->
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-200 dark:border-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Veri</p>
        </div>
        
        <button class="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-slate-500">download</span>
            <span>Offline Veri İndir</span>
          </div>
          <span class="material-symbols-outlined text-slate-400">chevron_right</span>
        </button>
        
        <button class="w-full flex items-center justify-between p-4 border-t border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-slate-500">delete_sweep</span>
            <span>Önbelleği Temizle</span>
          </div>
          <span class="material-symbols-outlined text-slate-400">chevron_right</span>
        </button>
      </div>

      <!-- Account -->
      <div v-if="authStore.isAuthenticated" class="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-200 dark:border-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Hesap</p>
        </div>
        
        <button 
          @click="handleLogout"
          class="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <span class="material-symbols-outlined">logout</span>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  </main>
</template>
