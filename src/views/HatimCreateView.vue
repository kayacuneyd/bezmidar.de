<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHatimStore } from '@/stores/hatim'

const router = useRouter()
const hatimStore = useHatimStore()

// Form state
const step = ref(1)
const title = ref('')
const description = ref('')
const isPublic = ref(false)
const targetDate = ref('')

// Result
const createdHatim = ref(null)
const isLoading = ref(false)
const error = ref('')

const nextStep = () => {
  if (step.value === 1 && !title.value) {
    error.value = 'Hatim başlığı gerekli'
    return
  }
  error.value = ''
  step.value++
}

const prevStep = () => {
  step.value--
}

const createHatim = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const hatim = await hatimStore.createHatim({
      title: title.value,
      description: description.value,
      is_public: isPublic.value,
      target_date: targetDate.value || null
    })
    
    createdHatim.value = hatim
    step.value = 3
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const copyInviteLink = () => {
  navigator.clipboard.writeText(createdHatim.value.invite_link)
  alert('Davet linki kopyalandı!')
}

const goToHatim = () => {
  router.push({ name: 'hatim-detail', params: { id: createdHatim.value.id } })
}
</script>

<template>
  <main class="min-h-screen">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
      <div class="flex items-center justify-between px-4 py-3">
        <button 
          v-if="step < 3"
          @click="step === 1 ? router.push({ name: 'hatim-list' }) : prevStep()"
          class="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10"
        >
          <span class="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div v-else class="w-10"></div>
        
        <h1 class="text-lg font-bold tracking-tight">Yeni Hatim Oluştur</h1>
        <div class="w-10"></div>
      </div>
      
      <!-- Progress -->
      <div v-if="step < 3" class="flex w-full flex-row items-center justify-center gap-3 py-3">
        <div class="h-2 w-12 rounded-full" :class="step >= 1 ? 'bg-primary' : 'bg-slate-300 dark:bg-white/10'"></div>
        <div class="h-2 w-12 rounded-full" :class="step >= 2 ? 'bg-primary' : 'bg-slate-300 dark:bg-white/10'"></div>
      </div>
    </header>

    <div class="flex-1 pb-32">
      <!-- Step 1: Title & Description -->
      <div v-if="step === 1" class="p-4 space-y-6">
        <div>
          <h2 class="text-2xl font-bold">Hatim Bilgileri</h2>
          <p class="text-slate-500 mt-1">Kolektif okumanız için bir başlık girin</p>
        </div>

        <div>
          <label class="block text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Hatim Başlığı *
          </label>
          <input 
            v-model="title"
            type="text" 
            placeholder="Örn: Aile Hatimi, Ramazan 2024"
            class="w-full h-14 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:border-primary focus:ring-0"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Açıklama (Opsiyonel)
          </label>
          <textarea 
            v-model="description"
            placeholder="Hatim hakkında kısa bir açıklama..."
            rows="3"
            class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:border-primary focus:ring-0 resize-none"
          ></textarea>
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      </div>

      <!-- Step 2: Settings -->
      <div v-if="step === 2" class="p-4 space-y-6">
        <div>
          <h2 class="text-2xl font-bold">Ayarlar</h2>
          <p class="text-slate-500 mt-1">Hatim görünürlüğünü ve hedef tarihini belirleyin</p>
        </div>

        <!-- Visibility Toggle -->
        <div>
          <label class="block text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Görünürlük
          </label>
          <div class="flex p-1 bg-slate-200 dark:bg-white/10 rounded-xl">
            <button 
              @click="isPublic = false"
              class="flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
              :class="!isPublic ? 'bg-white dark:bg-background-dark shadow-sm' : 'opacity-60'"
            >
              <span class="material-symbols-outlined text-xl" :class="!isPublic ? 'text-primary' : ''">lock</span>
              <span class="font-medium">Özel</span>
            </button>
            <button 
              @click="isPublic = true"
              class="flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
              :class="isPublic ? 'bg-white dark:bg-background-dark shadow-sm' : 'opacity-60'"
            >
              <span class="material-symbols-outlined text-xl" :class="isPublic ? 'text-primary' : ''">public</span>
              <span class="font-medium">Herkese Açık</span>
            </button>
          </div>
          <p class="text-xs text-slate-500 mt-2 px-1">
            {{ isPublic ? 'Herkes bu hatimi görebilir ve katılabilir' : 'Sadece davet linki ile katılım mümkün' }}
          </p>
        </div>

        <!-- Target Date -->
        <div>
          <label class="block text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Hedef Bitiş Tarihi (Opsiyonel)
          </label>
          <input 
            v-model="targetDate"
            type="date"
            class="w-full h-14 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:border-primary focus:ring-0"
          />
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      </div>

      <!-- Step 3: Success -->
      <div v-if="step === 3" class="p-4 text-center space-y-6 pt-10">
        <div class="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
          <span class="material-symbols-outlined text-primary text-4xl">check_circle</span>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold">Hatim Oluşturuldu!</h2>
          <p class="text-slate-500 mt-1">{{ createdHatim?.title }}</p>
        </div>

        <!-- Invite Link -->
        <div class="bg-white dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/10">
          <p class="text-sm text-slate-500 mb-2">Davet Linki</p>
          <div class="flex items-center gap-2">
            <code class="flex-1 text-xs bg-slate-100 dark:bg-white/10 p-3 rounded-lg overflow-x-auto">
              {{ createdHatim?.invite_link }}
            </code>
            <button 
              @click="copyInviteLink"
              class="p-3 bg-primary text-background-dark rounded-lg"
            >
              <span class="material-symbols-outlined">content_copy</span>
            </button>
          </div>
        </div>

        <button 
          @click="goToHatim"
          class="w-full bg-primary text-background-dark font-bold h-14 rounded-xl flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined">arrow_forward</span>
          Hatime Git
        </button>
      </div>
    </div>

    <!-- Bottom Action -->
    <div v-if="step < 3" class="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/95 dark:via-background-dark/95 to-transparent">
      <button 
        v-if="step === 1"
        @click="nextStep"
        class="w-full bg-primary text-background-dark font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
      >
        Devam
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
      
      <button 
        v-else-if="step === 2"
        @click="createHatim"
        :disabled="isLoading"
        class="w-full bg-primary text-background-dark font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
      >
        <span v-if="isLoading" class="material-symbols-outlined animate-spin">progress_activity</span>
        <span v-else class="material-symbols-outlined">check</span>
        {{ isLoading ? 'Oluşturuluyor...' : 'Hatim Oluştur' }}
      </button>
    </div>
  </main>
</template>
