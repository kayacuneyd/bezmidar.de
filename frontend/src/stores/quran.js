import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import quranApi from '@/services/quranApi'

export const useQuranStore = defineStore('quran', () => {
    // State
    const surahs = ref([])
    const currentSurah = ref(null)
    const currentJuz = ref(null)
    const currentVerses = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    // Reading progress
    const readingProgress = ref(JSON.parse(localStorage.getItem('readingProgress') || '{}'))

    // Getters
    const getSurahById = computed(() => (id) => {
        return surahs.value.find(s => s.id === id)
    })

    // Actions
    async function loadSurahs() {
        if (surahs.value.length > 0) return surahs.value

        isLoading.value = true
        error.value = null

        try {
            const response = await quranApi.getSurahs()
            surahs.value = response.data
            return surahs.value
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function loadSurah(surahId) {
        isLoading.value = true
        error.value = null

        try {
            const response = await quranApi.getSurah(surahId)
            currentSurah.value = response.data
            currentVerses.value = response.data.verses
            return response.data
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function loadJuz(juzNumber) {
        isLoading.value = true
        error.value = null

        try {
            const data = await quranApi.getJuzVerses(juzNumber)
            currentJuz.value = data
            return data
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    function saveProgress(surahId, verseNumber) {
        readingProgress.value = {
            ...readingProgress.value,
            lastRead: {
                surahId,
                verseNumber,
                timestamp: Date.now()
            }
        }
        localStorage.setItem('readingProgress', JSON.stringify(readingProgress.value))
    }

    function markJuzComplete(juzNumber) {
        if (!readingProgress.value.completedJuz) {
            readingProgress.value.completedJuz = []
        }
        if (!readingProgress.value.completedJuz.includes(juzNumber)) {
            readingProgress.value.completedJuz.push(juzNumber)
        }
        localStorage.setItem('readingProgress', JSON.stringify(readingProgress.value))
    }

    function getJuzProgress(juzNumber) {
        return readingProgress.value.completedJuz?.includes(juzNumber) || false
    }

    return {
        // State
        surahs,
        currentSurah,
        currentJuz,
        currentVerses,
        isLoading,
        error,
        readingProgress,

        // Getters
        getSurahById,

        // Actions
        loadSurahs,
        loadSurah,
        loadJuz,
        saveProgress,
        markJuzComplete,
        getJuzProgress
    }
})
