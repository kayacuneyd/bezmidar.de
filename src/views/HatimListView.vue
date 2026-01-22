<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHatimStore } from '@/stores/hatim'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const hatimStore = useHatimStore()
const authStore = useAuthStore()

const activeTab = ref('my') // 'my' or 'public'

onMounted(() => {
  if (authStore.isAuthenticated) {
    hatimStore.loadMyHatims()
  }
  hatimStore.loadPublicHatims()
})

const getProgress = (hatim) => {
  return Math.round((hatim.completed_juz / 30) * 100)
}
</script>

<template>
  <main class="pb-24">
    <header class="px-4 pt-12 pb-4">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Hatimler</h1>
        <router-link 
          v-if="authStore.isAuthenticated"
          :to="{ name: 'hatim-create' }"
          class="flex items-center gap-2 bg-primary text-background-dark px-4 py-2 rounded-xl font-bold text-sm"
        >
          <span class="material-symbols-outlined text-lg">add</span>
          Yeni
        </router-link>
      </div>
    </header>

    <!-- Tabs -->
    <div class="px-4 mb-4">
      <div class="flex p-1 bg-slate-200 dark:bg-white/10 rounded-xl">
        <button 
          @click="activeTab = 'my'"
          class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all"
          :class="activeTab === 'my' ? 'bg-white dark:bg-background-dark shadow-sm' : 'opacity-60'"
        >
          Hatimlerim
        </button>
        <button 
          @click="activeTab = 'public'"
          class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all"
          :class="activeTab === 'public' ? 'bg-white dark:bg-background-dark shadow-sm' : 'opacity-60'"
        >
          Herkese Açık
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="hatimStore.isLoading" class="flex justify-center py-12">
      <span class="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
    </div>

    <!-- My Hatims -->
    <div v-else-if="activeTab === 'my'" class="px-4 space-y-3">
      <div v-if="!authStore.isAuthenticated" class="py-12 text-center">
        <span class="material-symbols-outlined text-slate-400 text-5xl mb-3">login</span>
        <p class="text-slate-500">Hatimlerinizi görmek için giriş yapın</p>
        <router-link 
          :to="{ name: 'login' }"
          class="inline-block mt-4 bg-primary text-background-dark px-6 py-3 rounded-xl font-bold"
        >
          Giriş Yap
        </router-link>
      </div>

      <div v-else-if="hatimStore.myHatims.length === 0" class="py-12 text-center">
        <span class="material-symbols-outlined text-slate-400 text-5xl mb-3">groups</span>
        <p class="text-slate-500 font-semibold">Henüz hatim yok</p>
        <p class="text-slate-400 text-sm mt-1">Yeni bir hatim başlatın veya davet linki ile katılın</p>
      </div>

      <div 
        v-else
        v-for="hatim in hatimStore.myHatims" 
        :key="hatim.id"
        @click="router.push({ name: 'hatim-detail', params: { id: hatim.id } })"
        class="bg-white dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/10 cursor-pointer hover:border-primary transition-colors"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="font-bold">{{ hatim.title }}</h3>
            <p class="text-xs text-slate-500">{{ hatim.participant_count }} katılımcı</p>
          </div>
          <span 
            class="text-[10px] font-bold px-2 py-1 rounded-full uppercase"
            :class="hatim.status === 'completed' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-500'"
          >
            {{ hatim.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor' }}
          </span>
        </div>
        
        <div class="flex items-center gap-2">
          <div class="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              class="h-full bg-primary rounded-full transition-all" 
              :style="{ width: getProgress(hatim) + '%' }"
            ></div>
          </div>
          <span class="text-xs font-bold">{{ getProgress(hatim) }}%</span>
        </div>
        
        <div v-if="hatim.my_juz" class="mt-3 text-xs text-primary font-medium">
          Cüzünüz: {{ hatim.my_juz }}
        </div>
      </div>
    </div>

    <!-- Public Hatims -->
    <div v-else-if="activeTab === 'public'" class="px-4 space-y-3">
      <div v-if="hatimStore.publicHatims.length === 0" class="py-12 text-center">
        <span class="material-symbols-outlined text-slate-400 text-5xl mb-3">public</span>
        <p class="text-slate-500">Henüz herkese açık hatim yok</p>
      </div>

      <div 
        v-else
        v-for="hatim in hatimStore.publicHatims" 
        :key="hatim.id"
        class="bg-white dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/10"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-bold">{{ hatim.title }}</h3>
            <p class="text-xs text-slate-500 mt-1">
              {{ hatim.creator_name }} • {{ hatim.participant_count }} katılımcı
            </p>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex-1 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full">
                <div 
                  class="h-full bg-primary rounded-full" 
                  :style="{ width: getProgress(hatim) + '%' }"
                ></div>
              </div>
              <span class="text-[10px] font-bold">{{ getProgress(hatim) }}%</span>
            </div>
          </div>
          <button 
            @click="router.push({ name: 'hatim-detail', params: { id: hatim.id } })"
            class="px-4 py-2 bg-primary text-background-dark text-xs font-bold rounded-full"
          >
            Katıl
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
