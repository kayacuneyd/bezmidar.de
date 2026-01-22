<script setup>
// DiscoverView - Placeholder
</script>

<template>
  <main class="pb-24">
    <header class="px-4 pt-12 pb-6">
      <h1 class="text-2xl font-bold">Keşfet</h1>
      <p class="text-slate-500 text-sm mt-1">Açık hatimleri keşfedin ve katılın</p>
    </header>

    <div class="px-4">
      <!-- Search -->
      <div class="relative mb-6">
        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input 
          type="text" 
          placeholder="Hatim ara..."
          class="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-primary focus:ring-0 transition-all"
        />
      </div>

      <div class="py-8 text-center text-slate-500">
        <span class="material-symbols-outlined text-5xl mb-3">public</span>
        <p class="font-semibold">Açık hatimler yükleniyor...</p>
      </div>
    </div>
  </main>
</template>
