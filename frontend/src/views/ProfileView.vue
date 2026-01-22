<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useQuranStore } from '@/stores/quran'
import { useHatimStore } from '@/stores/hatim'

const router = useRouter()
const authStore = useAuthStore()
const quranStore = useQuranStore()
const hatimStore = useHatimStore()

const stats = computed(() => ({
  readJuz: quranStore.readingProgress?.completedJuz?.length || 0,
  totalHatims: hatimStore.myHatims?.length || 0,
  completedHatims: hatimStore.myHatims?.filter(h => h.status === 'completed').length || 0
}))

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <main class="pb-24">
    <!-- Profile Header -->
    <div class="bg-gradient-to-b from-primary/20 to-transparent pt-12 pb-8 px-4">
      <div class="flex flex-col items-center text-center">
        <div class="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary/30 flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-primary text-5xl">person</span>
        </div>
        <h1 class="text-2xl font-bold">
          {{ authStore.user?.first_name || 'Kullanıcı' }}
          {{ authStore.user?.last_name || '' }}
        </h1>
        <p class="text-slate-500 text-sm mt-1">{{ authStore.user?.email }}</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="px-4 -mt-4">
      <div class="bg-white dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/10 flex justify-around">
        <div class="text-center">
          <p class="text-2xl font-bold text-primary">{{ stats.readJuz }}</p>
          <p class="text-xs text-slate-500">Okunan Cüz</p>
        </div>
        <div class="w-px bg-slate-200 dark:bg-white/10"></div>
        <div class="text-center">
          <p class="text-2xl font-bold">{{ stats.totalHatims }}</p>
          <p class="text-xs text-slate-500">Toplam Hatim</p>
        </div>
        <div class="w-px bg-slate-200 dark:bg-white/10"></div>
        <div class="text-center">
          <p class="text-2xl font-bold">{{ stats.completedHatims }}</p>
          <p class="text-xs text-slate-500">Tamamlanan</p>
        </div>
      </div>
    </div>

    <!-- Menu -->
    <div class="px-4 mt-6 space-y-4">
      <!-- Account Section -->
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-200 dark:border-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Hesap</p>
        </div>
        
        <button class="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-slate-500">edit</span>
            <span>Profili Düzenle</span>
          </div>
          <span class="material-symbols-outlined text-slate-400">chevron_right</span>
        </button>
        
        <button class="w-full flex items-center justify-between p-4 border-t border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-slate-500">lock</span>
            <span>Şifre Değiştir</span>
          </div>
          <span class="material-symbols-outlined text-slate-400">chevron_right</span>
        </button>
      </div>

      <!-- Activity Section -->
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-200 dark:border-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Aktivite</p>
        </div>
        
        <router-link 
          :to="{ name: 'hatim-list' }"
          class="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-slate-500">history</span>
            <span>Hatim Geçmişi</span>
          </div>
          <span class="material-symbols-outlined text-slate-400">chevron_right</span>
        </router-link>
        
        <router-link 
          :to="{ name: 'quran' }"
          class="w-full flex items-center justify-between p-4 border-t border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-slate-500">bookmark</span>
            <span>Okuma İlerlemesi</span>
          </div>
          <span class="material-symbols-outlined text-slate-400">chevron_right</span>
        </router-link>
      </div>

      <!-- Settings Section -->
      <div class="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <router-link 
          :to="{ name: 'settings' }"
          class="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-slate-500">settings</span>
            <span>Ayarlar</span>
          </div>
          <span class="material-symbols-outlined text-slate-400">chevron_right</span>
        </router-link>
      </div>

      <!-- Logout -->
      <button 
        @click="handleLogout"
        class="w-full bg-red-500/10 text-red-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      >
        <span class="material-symbols-outlined">logout</span>
        Çıkış Yap
      </button>
    </div>
  </main>
</template>
