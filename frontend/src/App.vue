<script setup>
import { RouterView } from 'vue-router'
import BottomNav from '@/components/layout/BottomNav.vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { computed, onMounted } from 'vue'

const route = useRoute()
const themeStore = useThemeStore()

// Hide bottom nav on auth pages and landing page
const showBottomNav = computed(() => {
  const hiddenRoutes = ['home', 'login', 'verify', 'profile-setup', 'hatim-join']
  return !hiddenRoutes.includes(route.name)
})

// Initialize theme
onMounted(() => {
  themeStore.toggleTheme // Just to trigger reactivity
})
</script>

<template>
  <!-- Main App Container -->
  <div 
    class="min-h-screen transition-colors duration-300 max-w-3xl mx-auto shadow-2xl relative border-x border-slate-200 dark:border-white/5"
    :class="themeStore.theme === 'dark' ? 'bg-[#102219] text-white' : 'bg-[#FDFBF7] text-slate-900'"
  >
    <RouterView v-slot="{ Component }">
      <transition 
        name="fade" 
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </RouterView>
    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<style>
/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide up for modals */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
