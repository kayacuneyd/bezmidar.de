<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()

const navItems = [
  { name: 'dashboard', icon: 'home', label: 'Ana Sayfa' },
  { name: 'discover', icon: 'explore', label: 'Keşfet' },
  { name: 'quran', icon: 'auto_stories', label: 'Oku', isCenter: true },
  { name: 'hatim-list', icon: 'group', label: 'Hatimler' },
  { name: 'profile', icon: 'person', label: 'Profil' }
]

const isActive = (name) => {
  if (name === 'quran') {
    return route.name?.startsWith('quran')
  }
  if (name === 'hatim-list') {
    return route.name?.startsWith('hatim')
  }
  return route.name === name
}

const isDark = computed(() => themeStore.theme === 'dark')
</script>

<template>
  <nav 
    class="fixed bottom-0 left-0 right-0 z-50 ios-blur border-t safe-bottom max-w-3xl mx-auto"
    :class="isDark ? 'bg-[#102219]/95 border-white/10' : 'bg-[#FDFBF7]/95 border-slate-200'"
  >
    <div class="max-w-md mx-auto flex justify-around items-center px-4 pb-2 pt-2">
      <template v-for="item in navItems" :key="item.name">
        <!-- Center button (Quran reader) -->
        <div v-if="item.isCenter" class="relative -top-4">
          <button 
            @click="router.push({ name: item.name })"
            class="w-14 h-14 rounded-full bg-primary text-[#102219] shadow-lg shadow-primary/40 flex items-center justify-center active:scale-95 transition-transform"
            :class="{ 'animate-pulse-glow': isActive(item.name) }"
          >
            <span class="material-symbols-outlined text-3xl">{{ item.icon }}</span>
          </button>
        </div>
        <!-- Regular nav items -->
        <button 
          v-else
          @click="router.push({ name: item.name })"
          class="flex flex-col items-center gap-0.5 py-2 px-3 transition-colors"
          :class="isActive(item.name) ? 'text-primary' : 'text-slate-400'"
        >
          <span 
            class="material-symbols-outlined text-2xl"
            :class="{ 'font-variation-fill': isActive(item.name) }"
          >{{ item.icon }}</span>
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </button>
      </template>
    </div>
    <!-- Developer Credits -->
    <div class="text-center pb-2">
      <p class="text-[8px] text-slate-400">
        developed by 
        <a href="https://kayacuneyt.com" target="_blank" rel="noopener" class="text-primary/70 hover:text-primary">cüneyt kaya</a>
        &amp; 
        <a href="https://digitaltamam.com" target="_blank" rel="noopener" class="text-primary/70 hover:text-primary">digitaltamam.com</a>
      </p>
    </div>
  </nav>
</template>
