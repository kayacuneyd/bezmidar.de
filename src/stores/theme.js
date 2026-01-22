import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    // Check system preference or stored preference
    const getInitialTheme = () => {
        const stored = localStorage.getItem('theme')
        if (stored) return stored
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    const theme = ref(getInitialTheme())

    const isDark = () => theme.value === 'dark'

    const setTheme = (newTheme) => {
        theme.value = newTheme
        localStorage.setItem('theme', newTheme)
        applyTheme()
    }

    const toggleTheme = () => {
        setTheme(theme.value === 'dark' ? 'light' : 'dark')
    }

    const applyTheme = () => {
        if (theme.value === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    // Apply theme on init
    applyTheme()

    // Watch for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light')
        }
    })

    return {
        theme,
        isDark,
        setTheme,
        toggleTheme
    }
})
