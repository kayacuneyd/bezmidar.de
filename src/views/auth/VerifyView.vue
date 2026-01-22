<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isVerifying = ref(true)
const error = ref('')

onMounted(async () => {
  const token = route.query.token

  if (!token) {
    error.value = 'Geçersiz link'
    isVerifying.value = false
    return
  }

  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Doğrulama başarısız')
    }

    // Set auth state
    authStore.setAuth(data.token, data.user)

    // Redirect based on profile completion
    if (data.user.is_profile_complete) {
      router.push({ name: 'home' })
    } else {
      router.push({ name: 'profile-setup' })
    }
  } catch (err) {
    error.value = err.message
    isVerifying.value = false
  }
})
</script>

<template>
  <main class="min-h-screen flex flex-col justify-center items-center px-6">
    <!-- Verifying -->
    <div v-if="isVerifying" class="text-center space-y-4">
      <div class="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
        <span class="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
      </div>
      <h2 class="text-xl font-bold">Doğrulanıyor...</h2>
      <p class="text-slate-500">Lütfen bekleyin</p>
    </div>

    <!-- Error -->
    <div v-else class="text-center space-y-4">
      <div class="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
        <span class="material-symbols-outlined text-red-500 text-3xl">error</span>
      </div>
      <h2 class="text-xl font-bold">Doğrulama Başarısız</h2>
      <p class="text-slate-500">{{ error }}</p>
      <router-link 
        :to="{ name: 'login' }"
        class="inline-block bg-primary text-background-dark font-bold px-6 py-3 rounded-xl"
      >
        Tekrar Dene
      </router-link>
    </div>
  </main>
</template>
