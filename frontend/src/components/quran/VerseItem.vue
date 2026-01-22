<script setup>
import { computed } from 'vue'

const props = defineProps({
  verse: {
    type: Object,
    required: true
  },
  showTranslation: {
    type: Boolean,
    default: true
  },
  showTranscription: {
    type: Boolean,
    default: false
  },
  isPlaying: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-translation', 'play-verse'])

const transcription = computed(() => props.verse.transcription || '')
</script>

<template>
  <div 
    class="flex flex-col gap-4 py-6 border-b border-slate-100 dark:border-white/5 transition-colors"
    :class="{ 'bg-primary/5 dark:bg-primary/10 -mx-4 px-4': isPlaying }"
  >
    <!-- Arabic Verse -->
    <div class="flex gap-4 justify-between items-start">
      <div 
        class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs mt-1"
      >
        {{ verse.verse_number }}
      </div>
      <div 
        class="flex-1 text-right"
        @click="emit('toggle-translation')"
      >
        <p class="arabic-text text-3xl md:text-4xl leading-[2.5] text-slate-800 dark:text-slate-100">
          {{ verse.verse }}
        </p>
      </div>
    </div>

    <!-- Transcription (Optional) -->
    <div v-if="showTranscription" class="pl-12">
      <p class="text-sm text-slate-500 italic">
        {{ transcription }}
      </p>
    </div>

    <!-- Translation (Toggleable) -->
    <div 
      v-if="showTranslation" 
      class="pl-12 pt-1 relative"
    >
      <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/30"></div>
      <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
        {{ verse.translation?.text }}
      </p>
    </div>
  </div>
</template>
