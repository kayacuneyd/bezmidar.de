<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHatimStore } from '@/stores/hatim'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const hatimStore = useHatimStore()
const authStore = useAuthStore()

const hatim = ref(null)
const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    hatim.value = await hatimStore.loadHatimByInvite(route.params.code)
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
})

const joinHatim = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  try {
    await hatimStore.joinHatim(hatim.value.id)
    router.push({ name: 'hatim-detail', params: { id: hatim.value.id } })
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <main class="min-h-screen flex flex-col justify-center items-center px-6">
    <!-- Loading -->
    <div v-if="isLoading" class="text-center">
      <span class="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
      <p class="mt-4 text-slate-500">Davet yükleniyor...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center">
      <div class="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-red-500 text-4xl">error</span>
      </div>
      <h2 class="text-xl font-bold">Davet Geçersiz</h2>
      <p class="text-slate-500 mt-2">{{ error }}</p>
      <router-link 
        :to="{ name: 'home' }"
        class="inline-block mt-6 bg-primary text-background-dark px-6 py-3 rounded-xl font-bold"
      >
        Ana Sayfaya Dön
      </router-link>
    </div>

    <!-- Invite Card -->
    <div v-else class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-primary text-4xl">mail</span>
        </div>
        <h1 class="text-2xl font-bold">Hatim Daveti</h1>
      </div>

      <div class="bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/10 text-center">
        <h2 class="text-xl font-bold mb-2">{{ hatim.title }}</h2>
        <p class="text-slate-500 text-sm mb-4">
          {{ hatim.creator_name }} tarafından oluşturuldu
        </p>
        <div class="flex justify-center gap-4 text-sm text-slate-500 mb-6">
          <span>{{ hatim.participant_count }} katılımcı</span>
        </div>

        <button 
          @click="joinHatim"
          class="w-full bg-primary text-background-dark font-bold h-14 rounded-xl flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined">group_add</span>
          Hatime Katıl
        </button>
      </div>
    </div>
  </main>
</template>
