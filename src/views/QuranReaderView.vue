<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuranStore } from '@/stores/quran'
import VerseItem from '@/components/quran/VerseItem.vue'

const route = useRoute()
const router = useRouter()
const quranStore = useQuranStore()

// State
const viewMode = ref('juz-select') // 'juz-select', 'reading'
const selectedJuz = ref(null)
const allVerses = ref([]) // Flat list of all verses
const currentPage = ref(0)
const pages = ref([]) // Array of page numbers found in content
const showTranslation = ref(false)
const showTranscription = ref(false)
const currentAudioSrc = ref('')
const currentAudioTitle = ref('')

// Audio Player State
const audioElement = ref(null)
const isAudioPlaying = ref(false)
const audioProgress = ref(0)
const audioDuration = ref(0)
const audioCurrentTime = ref(0)

// Computed
const isLoading = computed(() => quranStore.isLoading)

const currentPageVerses = computed(() => {
  if (pages.value.length === 0) return []
  const pageNum = pages.value[currentPage.value]
  return allVerses.value.filter(v => v.page === pageNum)
})

const currentSurah = computed(() => {
  if (currentPageVerses.value.length === 0) return null
  return currentPageVerses.value[0].surah
})

const hasMultipleSurahsOnPage = computed(() => {
  const surahIds = new Set(currentPageVerses.value.map(v => v.surah.id))
  return surahIds.size > 1
})

const progressPercent = computed(() => {
  if (pages.value.length === 0) return 0
  return ((currentPage.value + 1) / pages.value.length) * 100
})


// Initial Load
onMounted(async () => {
  if (route.params.juzId) {
    await loadJuz(parseInt(route.params.juzId))
  } else if (route.params.surahId) {
    await loadSurah(parseInt(route.params.surahId))
  }
})

watch(() => route.params, async (params) => {
  if (params.juzId) {
    await loadJuz(parseInt(params.juzId))
  } else if (params.surahId) {
    await loadSurah(parseInt(params.surahId))
  }
})

// Loading Logic
async function loadJuz(juzNumber) {
  try {
    viewMode.value = 'reading'
    selectedJuz.value = juzNumber
    const data = await quranStore.loadJuz(juzNumber)
    processVerses(data.surahs)
  } catch (error) {
    console.error('Cüz yüklenemedi:', error)
  }
}

async function loadSurah(surahId) {
  try {
    viewMode.value = 'reading'
    const data = await quranStore.loadSurah(surahId)
    // Structure like Juz response for uniform processing
    processVerses([{
      surah: { id: data.id, name: data.name, name_original: data.name_original, audio: data.audio },
      verses: data.verses.map(v => ({ ...v, surah: { id: data.id, name: data.name, audio: data.audio } }))
    }])
  } catch (error) {
    console.error('Sure yüklenemedi:', error)
  }
}

function processVerses(surahsData) {
  // Flatten all verses and attach surah info to each verse if missing
  let flat = []
  surahsData.forEach(s => {
    const sInfo = s.surah
    s.verses.forEach(v => {
      flat.push({
        ...v,
        surah: sInfo
      })
    })
  })
  
  allVerses.value = flat
  
  // Extract unique pages
  const uniquePages = [...new Set(flat.map(v => v.page))]
  pages.value = uniquePages.sort((a, b) => a - b)
  currentPage.value = 0 // Start at first page
  
  updateAudio()
}

// Navigation
function nextPage() {
  if (currentPage.value < pages.value.length - 1) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
    updateAudio()
  } else if (selectedJuz.value) {
    // End of Juz
    markAsRead()
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
    updateAudio()
  }
}

function updateAudio() {
  if (currentSurah.value) {
    // Use Arabic Audio (Mishary Rashid Alafasy)
    // Format: 001.mp3, 010.mp3, 114.mp3
    const paddedId = currentSurah.value.id.toString().padStart(3, '0')
    const audioUrl = `https://server8.mp3quran.net/afs/${paddedId}.mp3`
    
    currentAudioSrc.value = audioUrl
    currentAudioTitle.value = `${currentSurah.value.name} (Arapça)`
  }
}

function selectJuz(juzNumber) {
  router.push({ name: 'quran-juz', params: { juzId: juzNumber } })
}

function goBack() {
  if (viewMode.value === 'reading') {
    viewMode.value = 'juz-select'
    router.push({ name: 'quran' })
  }
}

function markAsRead() {
  if (selectedJuz.value) {
    quranStore.markJuzComplete(selectedJuz.value)
    alert(`Cüz ${selectedJuz.value} başarıyla tamamlandı!`)
    router.push({ name: 'quran' })
  }
}

// Audio Control Functions
function toggleAudio() {
  if (!audioElement.value) return
  if (isAudioPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play()
  }
  isAudioPlaying.value = !isAudioPlaying.value
}

function seekAudio(e) {
  if (!audioElement.value) return
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const percent = x / rect.width
  audioElement.value.currentTime = percent * audioElement.value.duration
}

function onAudioTimeUpdate() {
  if (!audioElement.value) return
  audioCurrentTime.value = audioElement.value.currentTime
  audioProgress.value = (audioElement.value.currentTime / audioElement.value.duration) * 100
}

function onAudioLoadedMetadata() {
  if (!audioElement.value) return
  audioDuration.value = audioElement.value.duration
}

function onAudioEnded() {
  isAudioPlaying.value = false
  audioProgress.value = 0
  audioCurrentTime.value = 0
}

function formatAudioTime(seconds) {
  if (!seconds) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <main class="pb-32">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-white/10 backdrop-blur-md bg-opacity-90">
      <div class="flex items-center px-4 py-3 justify-between max-w-3xl mx-auto w-full">
        <!-- Left: Back Button -->
        <button 
          v-if="viewMode === 'reading'"
          @click="goBack"
          class="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <span class="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div v-else class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[20px]">cloud_done</span>
          <span class="text-xs font-medium text-primary/80 uppercase tracking-wider">Senkron</span>
        </div>

        <!-- Center: Title -->
        <div class="flex flex-col items-center">
          <h2 class="text-lg font-bold leading-tight tracking-tight">
            {{ viewMode === 'reading' ? (currentSurah?.name || 'Kuran-ı Kerim') : 'Kuran-ı Kerim' }}
          </h2>
          <p v-if="viewMode === 'reading'" class="text-[10px] text-slate-500 uppercase tracking-widest">
            Sayfa {{ pages[currentPage] }} / {{ pages[pages.length-1] }}
          </p>
          <p v-else class="text-[10px] text-slate-500 uppercase tracking-widest">
            Cüz Seçin
          </p>
        </div>

        <!-- Right: Settings/Toggle -->
        <div class="flex items-center gap-1">
          <div v-if="viewMode === 'reading'" class="flex items-center mr-2">
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" v-model="showTranscription" class="w-3 h-3 rounded text-primary focus:ring-primary bg-slate-100 dark:bg-white/10 dark:border-white/20">
              <span class="text-[10px] font-bold text-slate-500 uppercase">Latin</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Progress Bar (reading mode) -->
      <div v-if="viewMode === 'reading'" class="w-full bg-slate-200 dark:bg-white/5 h-1">
        <div class="bg-primary h-full transition-all duration-300" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <span class="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
    </div>

    <!-- Juz Selection Grid -->
    <div v-else-if="viewMode === 'juz-select'" class="p-4 max-w-3xl mx-auto">
      <h3 class="text-lg font-bold mb-4">Cüzler</h3>
      <div class="grid grid-cols-5 gap-2">
        <button 
          v-for="juz in 30" 
          :key="juz"
          @click="selectJuz(juz)"
          class="aspect-square flex flex-col items-center justify-center rounded-xl border transition-all"
          :class="quranStore.getJuzProgress(juz) 
            ? 'bg-primary/20 border-primary text-primary' 
            : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/10 hover:border-primary'"
        >
          <span class="text-lg font-bold" :class="quranStore.getJuzProgress(juz) ? 'text-primary' : ''">{{ juz }}</span>
          <span class="text-[8px] uppercase text-slate-500">Cüz</span>
          <span v-if="quranStore.getJuzProgress(juz)" class="material-symbols-outlined text-primary text-xs mt-0.5">check_circle</span>
        </button>
      </div>
    </div>

    <!-- Page Reader View -->
    <div v-else-if="viewMode === 'reading'" class="max-w-2xl mx-auto w-full px-4 pt-4">
      <!-- Page Content -->
      <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
        <!-- Mushaf Header with Audio Player -->
        <div class="bg-[#FDFBF7] dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-3">
          <div v-if="currentAudioSrc" class="flex items-center gap-3">
            <!-- Play Button -->
            <button 
              @click="toggleAudio"
              class="size-10 shrink-0 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-md active:scale-95 transition-transform"
            >
              <span class="material-symbols-outlined text-xl">
                {{ isAudioPlaying ? 'pause' : 'play_arrow' }}
              </span>
            </button>
            
            <!-- Info & Progress -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="font-arabic text-lg text-slate-700 dark:text-slate-300 truncate">
                  {{ currentSurah?.name_original }}
                </span>
                <span class="text-[10px] font-mono text-slate-400 ml-2">
                  {{ formatAudioTime(audioCurrentTime) }} / {{ formatAudioTime(audioDuration) }}
                </span>
              </div>
              <!-- Progress Bar -->
              <div 
                class="h-1.5 bg-slate-200 dark:bg-white/10 rounded-full cursor-pointer"
                @click="seekAudio"
              >
                <div 
                  class="h-full bg-primary rounded-full transition-all"
                  :style="{ width: audioProgress + '%' }"
                ></div>
              </div>
            </div>
          </div>
          
          <!-- Fallback when no audio -->
          <div v-else class="text-center py-1">
            <span class="font-arabic text-xl text-slate-400">
              surah {{ currentSurah?.name_original }}
            </span>
          </div>
        </div>

        <!-- Hidden Audio Element -->
        <audio 
          ref="audioElement" 
          :src="currentAudioSrc" 
          @timeupdate="onAudioTimeUpdate"
          @loadedmetadata="onAudioLoadedMetadata"
          @ended="onAudioEnded"
          class="hidden"
        ></audio>

        <!-- Verses List -->
        <div class="px-4">
            <VerseItem 
              v-for="verse in currentPageVerses"
              :key="verse.id"
              :verse="verse"
              :show-translation="showTranslation"
              :show-transcription="showTranscription"
              @toggle-translation="showTranslation = !showTranslation"
            />
        </div>
        
        <!-- Page Footer/Navigation -->
        <div class="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
             <button 
                @click="prevPage"
                :disabled="currentPage === 0"
                class="flex items-center px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-white/10 disabled:opacity-30 transition-all font-medium text-sm"
             >
                <span class="material-symbols-outlined text-lg mr-1">chevron_left</span>
                Önceki
             </button>

             <span class="text-xs font-mono text-slate-400 font-bold">{{ pages[currentPage] }}</span>

             <button 
                @click="nextPage"
                class="flex items-center px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold text-sm"
             >
                {{ currentPage === pages.length - 1 ? 'Bitir' : 'Sonraki' }}
                <span v-if="currentPage < pages.length - 1" class="material-symbols-outlined text-lg ml-1">chevron_right</span>
                <span v-else class="material-symbols-outlined text-lg ml-1">check</span>
             </button>
        </div>
      </div>


       <!-- Global Controls (Floating) -->
       <div class="fixed bottom-32 right-4 flex flex-col gap-2 z-30">
          <button 
            @click="showTranslation = !showTranslation"
            class="size-12 rounded-full shadow-xl flex items-center justify-center transition-all active:scale-95 border-2"
            :class="showTranslation ? 'bg-primary text-background-dark border-primary' : 'bg-white dark:bg-surface-dark text-slate-500 border-slate-200 dark:border-white/10'"
          >
             <span class="material-symbols-outlined text-[20px]">translate</span>
          </button>
       </div>
    </div>
  </main>
</template>
