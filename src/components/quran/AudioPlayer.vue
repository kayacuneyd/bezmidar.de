<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  audioSrc: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
})

const audio = ref(null)
const isPlaying = ref(false)
const progress = ref(0)
const duration = ref(0)
const currentTime = ref(0)

const togglePlay = () => {
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const onTimeUpdate = () => {
  currentTime.value = audio.value.currentTime
  progress.value = (audio.value.currentTime / audio.value.duration) * 100
}

const onLoadedMetadata = () => {
  duration.value = audio.value.duration
}

const onEnded = () => {
  isPlaying.value = false
  progress.value = 0
  currentTime.value = 0
}

const seek = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const width = rect.width
  const percent = x / width
  audio.value.currentTime = percent * audio.value.duration
}

const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Watch for source changes
watch(() => props.audioSrc, (newSrc) => {
  if (audio.value) {
    audio.value.pause()
    isPlaying.value = false
    progress.value = 0
    audio.value.load() // Load new source
  }
})

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
  }
})
</script>

<template>
  <div class="mt-4 px-4 pb-4">
    <div class="bg-background-light dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-2xl p-3 shadow-xl backdrop-blur-md flex flex-col gap-2">
      <!-- Progress Bar -->
      <div 
        class="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full cursor-pointer relative group"
        @click="seek"
      >
        <div 
          class="h-full bg-primary rounded-full relative"
          :style="{ width: progress + '%' }"
        >
          <div class="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-primary rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform"></div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-between">
        <div class="flex flex-col min-w-0 flex-1 mr-4">
          <p class="font-bold text-sm truncate">{{ title }}</p>
          <p class="text-xs text-slate-500 truncate">{{ subtitle }}</p>
        </div>
        
        <div class="flex items-center gap-3">
          <span class="text-[10px] font-mono text-slate-400 tabular-nums">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </span>
          <button 
            @click="togglePlay"
            class="size-10 rounded-full bg-primary text-background-dark flex items-center justify-center font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            <span class="material-symbols-outlined text-2xl fill-1">
              {{ isPlaying ? 'pause' : 'play_arrow' }}
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <audio 
      ref="audio" 
      :src="audioSrc" 
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      class="hidden"
    ></audio>
  </div>
</template>
