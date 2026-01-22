<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiUrl } from '@/utils/apiBase'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)
const isEmailSent = ref(false)
const error = ref('')

const sendMagicLink = async () => {
  if (!email.value) {
    error.value = 'Email adresi gerekli'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await fetch(apiUrl('/api/auth/magic-link'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Bir hata oluştu')
    }

    isEmailSent.value = true
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen flex flex-col justify-center px-6">
    <!-- Home Navigation Button -->
    <div class="absolute top-4 left-4">
      <router-link 
        :to="{ name: 'home' }"
        class="flex items-center gap-1 text-slate-500 hover:text-primary transition-colors"
      >
        <span class="material-symbols-outlined">arrow_back</span>
        <span class="text-sm font-medium">Ana Sayfa</span>
      </router-link>
    </div>

    <!-- Logo & Title -->
    <div class="text-center mb-10">
      <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
        <span class="material-symbols-outlined text-primary text-4xl">menu_book</span>
      </div>
      <h1 class="text-3xl font-bold tracking-tight">HatimConnect</h1>
      <p class="text-slate-500 mt-2">Kolektif Kuran hatimi</p>
    </div>

    <!-- Email Sent State -->
    <div v-if="isEmailSent" class="text-center space-y-4">
      <div class="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
        <span class="material-symbols-outlined text-primary text-3xl">mark_email_read</span>
      </div>
      <h2 class="text-xl font-bold">Email Gönderildi!</h2>
      <p class="text-slate-500">
        <strong>{{ email }}</strong> adresine giriş linki gönderdik. 
        Lütfen email'inizi kontrol edin.
      </p>
      <button 
        @click="isEmailSent = false" 
        class="text-primary font-semibold"
      >
        Farklı email kullan
      </button>
    </div>

    <!-- Login Form -->
    <div v-else class="space-y-6">
      <!-- Email Input -->
      <div>
        <label class="block text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Email Adresi
        </label>
        <input 
          v-model="email"
          type="email" 
          placeholder="ornek@email.com"
          class="w-full h-14 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:border-primary focus:ring-0 transition-all text-lg placeholder:text-slate-400"
          @keyup.enter="sendMagicLink"
        />
      </div>

      <!-- Error Message -->
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

      <!-- Submit Button -->
      <button 
        @click="sendMagicLink"
        :disabled="isLoading"
        class="w-full bg-primary text-background-dark font-bold h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading" class="material-symbols-outlined animate-spin">progress_activity</span>
        <span v-else class="material-symbols-outlined">send</span>
        {{ isLoading ? 'Gönderiliyor...' : 'Giriş Linki Gönder' }}
      </button>

      <p class="text-center text-sm text-slate-500">
        Email adresinize tek kullanımlık giriş linki göndereceğiz.
      </p>
    </div>
  </main>
</template>
