<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')
const isLoading = ref(false)
const error = ref('')

const setupProfile = async () => {
  // Validation
  if (!password.value || password.value.length < 6) {
    error.value = 'Şifre en az 6 karakter olmalıdır'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Şifreler eşleşmiyor'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        password: password.value,
        first_name: firstName.value || null,
        last_name: lastName.value || null
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Bir hata oluştu')
    }

    // Update user state
    authStore.updateUser({ 
      is_profile_complete: true,
      first_name: firstName.value,
      last_name: lastName.value
    })

    router.push({ name: 'home' })
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen flex flex-col px-6 py-12">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold">Profilinizi Tamamlayın</h1>
      <p class="text-slate-500 mt-1">Hesabınız için bir şifre belirleyin</p>
    </div>

    <form @submit.prevent="setupProfile" class="space-y-6 flex-1">
      <!-- Password (Required) -->
      <div>
        <label class="block text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Şifre <span class="text-red-500">*</span>
        </label>
        <input 
          v-model="password"
          type="password" 
          placeholder="En az 6 karakter"
          class="w-full h-14 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:border-primary focus:ring-0 transition-all text-lg"
        />
      </div>

      <!-- Confirm Password -->
      <div>
        <label class="block text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Şifre Tekrar <span class="text-red-500">*</span>
        </label>
        <input 
          v-model="confirmPassword"
          type="password" 
          placeholder="Şifrenizi tekrar girin"
          class="w-full h-14 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:border-primary focus:ring-0 transition-all text-lg"
        />
      </div>

      <hr class="border-slate-200 dark:border-white/10" />

      <!-- First Name (Optional) -->
      <div>
        <label class="block text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
          İsim <span class="text-slate-400">(opsiyonel)</span>
        </label>
        <input 
          v-model="firstName"
          type="text" 
          placeholder="İsminiz"
          class="w-full h-14 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:border-primary focus:ring-0 transition-all text-lg"
        />
      </div>

      <!-- Last Name (Optional) -->
      <div>
        <label class="block text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Soyisim <span class="text-slate-400">(opsiyonel)</span>
        </label>
        <input 
          v-model="lastName"
          type="text" 
          placeholder="Soyisminiz"
          class="w-full h-14 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:border-primary focus:ring-0 transition-all text-lg"
        />
      </div>

      <!-- Error -->
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

      <!-- Submit -->
      <button 
        type="submit"
        :disabled="isLoading"
        class="w-full bg-primary text-background-dark font-bold h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
      >
        <span v-if="isLoading" class="material-symbols-outlined animate-spin">progress_activity</span>
        <span v-else class="material-symbols-outlined">check</span>
        {{ isLoading ? 'Kaydediliyor...' : 'Tamamla' }}
      </button>
    </form>
  </main>
</template>
