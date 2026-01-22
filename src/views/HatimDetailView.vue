<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHatimStore } from '@/stores/hatim'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const hatimStore = useHatimStore()
const authStore = useAuthStore()

const showJuzModal = ref(false)

onMounted(() => {
  hatimStore.loadHatim(route.params.id)
})

const hatim = computed(() => hatimStore.currentHatim?.hatim)
const participants = computed(() => hatimStore.currentHatim?.participants || [])
const juzAssignments = computed(() => hatimStore.currentHatim?.juzAssignments || [])

const completedCount = computed(() => 
  juzAssignments.value.filter(j => j.status === 'completed').length
)

const progress = computed(() => 
  Math.round((completedCount.value / 30) * 100)
)

const myJuz = computed(() => 
  juzAssignments.value.find(j => j.user_id === authStore.user?.id)
)

const availableJuz = computed(() => 
  juzAssignments.value.filter(j => j.status === 'available')
)

const joinHatim = async () => {
  try {
    await hatimStore.joinHatim(route.params.id)
    showJuzModal.value = true
  } catch (error) {
    alert(error.message)
  }
}

const selectJuz = async (juzNumber) => {
  try {
    await hatimStore.assignJuz(route.params.id, juzNumber)
    showJuzModal.value = false
    alert(`Cüz ${juzNumber} size atandı!`)
  } catch (error) {
    alert(error.message)
  }
}

const completeMyJuz = async () => {
  if (!myJuz.value) return
  
  try {
    const result = await hatimStore.completeJuz(route.params.id, myJuz.value.juz_number)
    if (result.hatimCompleted) {
      alert('🎉 Hatim tamamlandı!')
    } else {
      alert('Cüzünüz tamamlandı!')
    }
  } catch (error) {
    alert(error.message)
  }
}

const copyInviteLink = () => {
  const link = `${window.location.origin}/hatim/join/${hatim.value?.invite_code}`
  navigator.clipboard.writeText(link)
  alert('Davet linki kopyalandı!')
}

const isParticipant = computed(() => 
  participants.value.some(p => p.user_id === authStore.user?.id)
)
</script>

<template>
  <main class="pb-24">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
      <div class="flex items-center justify-between px-4 py-3">
        <button 
          @click="router.push({ name: 'hatim-list' })"
          class="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10"
        >
          <span class="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 class="text-lg font-bold tracking-tight line-clamp-1">{{ hatim?.title || 'Yükleniyor...' }}</h1>
        <button 
          @click="copyInviteLink"
          class="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10"
        >
          <span class="material-symbols-outlined">share</span>
        </button>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="hatimStore.isLoading" class="flex justify-center py-20">
      <span class="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
    </div>

    <div v-else-if="hatim" class="p-4 space-y-6">
      <!-- Progress Card -->
      <div class="bg-white dark:bg-white/5 rounded-2xl p-5 border border-slate-200 dark:border-white/10">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-xl font-bold">{{ hatim.title }}</h2>
            <p class="text-sm text-slate-500">{{ completedCount }}/30 Cüz tamamlandı</p>
          </div>
          <span 
            class="text-xs font-bold px-3 py-1 rounded-full uppercase"
            :class="hatim.status === 'completed' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-500'"
          >
            {{ hatim.status === 'completed' ? 'Tamamlandı' : 'Aktif' }}
          </span>
        </div>
        
        <div class="h-3 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            class="h-full bg-primary rounded-full transition-all" 
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <p class="text-right text-sm font-bold mt-2">{{ progress }}%</p>
      </div>

      <!-- My Assignment -->
      <div v-if="myJuz" class="bg-primary/10 dark:bg-primary/20 rounded-2xl p-5 border border-primary/20">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-primary font-medium">Sizin Cüzünüz</p>
            <p class="text-3xl font-bold text-primary">{{ myJuz.juz_number }}</p>
          </div>
          <button
            v-if="myJuz.status !== 'completed'"
            @click="completeMyJuz"
            class="bg-primary text-background-dark px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <span class="material-symbols-outlined">check</span>
            Tamamlandı
          </button>
          <span v-else class="text-primary font-bold flex items-center gap-2">
            <span class="material-symbols-outlined">check_circle</span>
            Tamamlandı
          </span>
        </div>
      </div>

      <!-- Participants -->
      <div>
        <h3 class="font-bold mb-3">Katılımcılar ({{ participants.length }})</h3>
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="p in participants" 
            :key="p.id"
            class="flex items-center gap-2 bg-white dark:bg-surface-dark px-3 py-2 rounded-full border border-slate-200 dark:border-white/10"
          >
            <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span class="text-primary text-xs font-bold">{{ (p.first_name || p.email)?.[0]?.toUpperCase() }}</span>
            </div>
            <span class="text-sm">{{ p.first_name || p.email?.split('@')[0] }}</span>
          </div>
        </div>
      </div>

      <!-- Juz Grid -->
      <div>
        <h3 class="font-bold mb-3">Cüz Durumu</h3>
        <div class="grid grid-cols-6 gap-2">
          <div 
            v-for="juz in juzAssignments" 
            :key="juz.juz_number"
            class="aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-bold"
            :class="{
              'bg-primary text-background-dark': juz.status === 'completed',
              'bg-blue-500/20 text-blue-500 border border-blue-500/30': juz.status === 'assigned' || juz.status === 'in_progress',
              'bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10': juz.status === 'available'
            }"
          >
            <span>{{ juz.juz_number }}</span>
            <span v-if="juz.status === 'completed'" class="material-symbols-outlined text-xs">check</span>
          </div>
        </div>
      </div>

      <!-- Join / Select Juz CTA -->
      <div v-if="authStore.isAuthenticated && !isParticipant" class="pt-4">
        <button 
          @click="joinHatim"
          class="w-full bg-primary text-background-dark font-bold h-14 rounded-xl flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined">group_add</span>
          Hatime Katıl
        </button>
      </div>

      <div v-else-if="isParticipant && !myJuz && availableJuz.length > 0" class="pt-4">
        <button 
          @click="showJuzModal = true"
          class="w-full bg-primary text-background-dark font-bold h-14 rounded-xl flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined">menu_book</span>
          Cüz Seç
        </button>
      </div>
    </div>

    <!-- Juz Selection Modal -->
    <div 
      v-if="showJuzModal" 
      class="fixed inset-0 z-50 bg-black/50 flex items-end"
      @click.self="showJuzModal = false"
    >
      <div class="w-full bg-background-light dark:bg-background-dark rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Cüz Seçin</h3>
          <button @click="showJuzModal = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <p class="text-slate-500 text-sm mb-4">Okumak istediğiniz cüzü seçin:</p>
        
        <div class="grid grid-cols-5 gap-2">
          <button 
            v-for="juz in availableJuz" 
            :key="juz.juz_number"
            @click="selectJuz(juz.juz_number)"
            class="aspect-square flex flex-col items-center justify-center bg-primary/10 hover:bg-primary hover:text-background-dark rounded-xl border border-primary/30 transition-all"
          >
            <span class="text-lg font-bold">{{ juz.juz_number }}</span>
            <span class="text-[8px] uppercase">Cüz</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
