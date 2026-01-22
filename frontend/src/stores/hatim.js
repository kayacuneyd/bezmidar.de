import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import { apiUrl } from '@/utils/apiBase'

export const useHatimStore = defineStore('hatim', () => {
    const authStore = useAuthStore()

    // State
    const myHatims = ref([])
    const publicHatims = ref([])
    const currentHatim = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    // API helper
    const apiCall = async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...(authStore.token && { 'Authorization': `Bearer ${authStore.token}` })
        }

        const response = await fetch(apiUrl(url), { ...options, headers })
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Bir hata oluştu')
        }

        return data
    }

    // Actions
    async function loadMyHatims() {
        isLoading.value = true
        error.value = null

        try {
            const data = await apiCall('/api/hatims/my')
            myHatims.value = data.hatims
            return data.hatims
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function loadPublicHatims() {
        isLoading.value = true
        error.value = null

        try {
            const data = await apiCall('/api/hatims')
            publicHatims.value = data.hatims
            return data.hatims
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function loadHatim(id) {
        isLoading.value = true
        error.value = null

        try {
            const data = await apiCall(`/api/hatims/${id}`)
            currentHatim.value = data
            return data
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function loadHatimByInvite(code) {
        isLoading.value = true
        error.value = null

        try {
            const data = await apiCall(`/api/hatims/invite/${code}`)
            return data.hatim
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function createHatim(hatimData) {
        isLoading.value = true
        error.value = null

        try {
            const data = await apiCall('/api/hatims', {
                method: 'POST',
                body: JSON.stringify(hatimData)
            })
            return data.hatim
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function joinHatim(hatimId) {
        isLoading.value = true
        error.value = null

        try {
            await apiCall(`/api/hatims/${hatimId}/join`, { method: 'POST' })
            await loadMyHatims()
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function assignJuz(hatimId, juzNumber) {
        try {
            await apiCall(`/api/hatims/${hatimId}/assign-juz`, {
                method: 'POST',
                body: JSON.stringify({ juz_number: juzNumber })
            })
            await loadHatim(hatimId)
        } catch (err) {
            error.value = err.message
            throw err
        }
    }

    async function completeJuz(hatimId, juzNumber) {
        try {
            const result = await apiCall(`/api/hatims/${hatimId}/complete-juz`, {
                method: 'POST',
                body: JSON.stringify({ juz_number: juzNumber })
            })
            await loadHatim(hatimId)
            return result
        } catch (err) {
            error.value = err.message
            throw err
        }
    }

    return {
        // State
        myHatims,
        publicHatims,
        currentHatim,
        isLoading,
        error,

        // Actions
        loadMyHatims,
        loadPublicHatims,
        loadHatim,
        loadHatimByInvite,
        createHatim,
        joinHatim,
        assignJuz,
        completeJuz
    }
})
