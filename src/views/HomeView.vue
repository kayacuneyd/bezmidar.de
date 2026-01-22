<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useHatimStore } from '@/stores/hatim'
import { useQuranStore } from '@/stores/quran'

const router = useRouter()
const authStore = useAuthStore()
const hatimStore = useHatimStore()
const quranStore = useQuranStore()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      await hatimStore.loadMyHatims()
    } catch (e) {
      console.log('Could not load user hatims')
    }
  }
  try {
    await hatimStore.loadPublicHatims()
  } catch (e) {
    console.log('Could not load public hatims')
  }
})

const userName = computed(() => {
  if (authStore.user?.first_name) {
    return authStore.user.first_name
  }
  return 'Ziyaretçi'
})

const stats = computed(() => {
  const completedJuz = quranStore.readingProgress?.completedJuz?.length || 0
  const activeHatims = hatimStore.myHatims?.filter(h => h.status === 'active').length || 0
  const completedHatims = hatimStore.myHatims?.filter(h => h.status === 'completed').length || 0
  return { completedJuz, activeHatims, completedHatims }
})

const getProgress = (hatim) => {
  return Math.round((hatim.completed_juz / 30) * 100)
}
</script>

<template>
  <main class="pb-24">
    <!-- Header with User Greeting -->
    <section class="px-4 pt-12 pb-4 flex justify-between items-center">
      <div class="flex gap-4 items-center">
        <div 
          class="bg-primary/20 rounded-full h-16 w-16 border-2 border-primary/30 flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-primary text-3xl">person</span>
        </div>
        <div class="flex flex-col">
          <p class="text-xl font-bold leading-tight tracking-tight">
            Selam, {{ userName }}
          </p>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            Günlük cüzünüze hazır mısınız?
          </p>
        </div>
      </div>
      <router-link 
        :to="{ name: 'hatim-create' }"
        v-if="authStore.isAuthenticated"
        class="flex items-center justify-center gap-2 rounded-xl h-11 px-4 bg-primary text-background-dark font-bold text-sm shadow-lg shadow-primary/20"
      >
        <span class="material-symbols-outlined text-xl">add_circle</span>
        <span class="hidden sm:inline">Yeni Hatim</span>
      </router-link>
    </section>

    <!-- Stats Overview -->
    <section class="px-4 py-2 flex gap-3 overflow-x-auto no-scrollbar">
      <div class="flex-none bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 min-w-[110px]">
        <p class="text-xs text-slate-500 dark:text-slate-400">Okunan Cüz</p>
        <p class="text-2xl font-bold text-primary">{{ stats.completedJuz }}</p>
      </div>
      <div class="flex-none bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 min-w-[110px]">
        <p class="text-xs text-slate-500 dark:text-slate-400">Aktif Hatim</p>
        <p class="text-2xl font-bold">{{ stats.activeHatims }}</p>
      </div>
      <div class="flex-none bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 min-w-[110px]">
        <p class="text-xs text-slate-500 dark:text-slate-400">Tamamlanan</p>
        <p class="text-2xl font-bold">{{ stats.completedHatims }}</p>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="px-4 py-4">
      <div class="grid grid-cols-2 gap-3">
        <router-link 
          :to="{ name: 'quran' }"
          class="bg-primary text-background-dark rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          <span class="material-symbols-outlined text-3xl">auto_stories</span>
          <span class="font-bold text-sm">Kuran Oku</span>
        </router-link>
        <router-link 
          :to="{ name: 'hatim-list' }"
          class="bg-white dark:bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-slate-200 dark:border-white/10 active:scale-95 transition-transform"
        >
          <span class="material-symbols-outlined text-3xl text-primary">groups</span>
          <span class="font-bold text-sm">Hatimlerim</span>
        </router-link>
      </div>
    </section>

    <!-- Active Hatims -->
    <section v-if="hatimStore.myHatims?.length > 0">
      <div class="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 class="text-lg font-bold tracking-tight">Aktif Hatimleriniz</h2>
        <router-link :to="{ name: 'hatim-list' }" class="text-primary text-sm font-semibold">
          Tümü
        </router-link>
      </div>
      
      <div class="px-4 space-y-3">
        <div 
          v-for="hatim in hatimStore.myHatims.slice(0, 2)" 
          :key="hatim.id"
          @click="router.push({ name: 'hatim-detail', params: { id: hatim.id } })"
          class="bg-white dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/10 cursor-pointer hover:border-primary/50 transition-all active:scale-[0.98]"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-bold">{{ hatim.title }}</h3>
              <p class="text-xs text-slate-500">{{ hatim.participant_count }} katılımcı</p>
            </div>
            <span 
              v-if="hatim.my_juz"
              class="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded-full"
            >
              Cüz {{ hatim.my_juz }}
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <div class="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                class="h-full bg-primary rounded-full transition-all" 
                :style="{ width: getProgress(hatim) + '%' }"
              ></div>
            </div>
            <span class="text-xs font-bold min-w-[35px] text-right">{{ getProgress(hatim) }}%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- No Hatims State -->
    <section v-else class="px-4 py-6">
      <div class="bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/10 text-center">
        <span class="material-symbols-outlined text-slate-400 text-5xl mb-3">menu_book</span>
        <h3 class="font-bold mb-1">Henüz aktif hatim yok</h3>
        <p class="text-sm text-slate-500 mb-4">Yeni bir hatim oluşturun veya mevcut birine katılın</p>
        <router-link 
          :to="{ name: 'hatim-create' }"
          class="inline-flex items-center gap-2 bg-primary text-background-dark px-6 py-3 rounded-xl font-bold text-sm"
        >
          <span class="material-symbols-outlined">add</span>
          Hatim Başlat
        </router-link>
      </div>
    </section>

    <!-- Public Hatims -->
    <section v-if="hatimStore.publicHatims?.length > 0" class="pb-8">
      <div class="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 class="text-lg font-bold tracking-tight">Açık Hatimler</h2>
        <router-link :to="{ name: 'discover' }" class="text-primary text-sm font-semibold">
          Keşfet
        </router-link>
      </div>
      
      <div class="px-4 space-y-3">
        <div 
          v-for="hatim in hatimStore.publicHatims.slice(0, 3)" 
          :key="hatim.id"
          class="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span class="material-symbols-outlined">public</span>
            </div>
            <div>
              <p class="font-semibold text-sm">{{ hatim.title }}</p>
              <p class="text-xs text-slate-500">{{ hatim.participant_count }} katılımcı</p>
            </div>
          </div>
          <button 
            @click="router.push({ name: 'hatim-detail', params: { id: hatim.id } })"
            class="px-4 py-1.5 bg-primary text-background-dark text-xs font-bold rounded-full"
          >
            Katıl
          </button>
        </div>
      </div>
    </section>
  </main>
</template>
