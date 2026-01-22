import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || null)
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

    const isAuthenticated = computed(() => !!token.value)
    const isProfileComplete = computed(() => user.value?.is_profile_complete || false)

    function setAuth(authToken, userData) {
        token.value = authToken
        user.value = userData
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('profileComplete', userData.is_profile_complete ? 'true' : 'false')
    }

    function updateUser(userData) {
        user.value = { ...user.value, ...userData }
        localStorage.setItem('user', JSON.stringify(user.value))
        localStorage.setItem('profileComplete', user.value.is_profile_complete ? 'true' : 'false')
    }

    function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('profileComplete')
    }

    return {
        token,
        user,
        isAuthenticated,
        isProfileComplete,
        setAuth,
        updateUser,
        logout
    }
})
