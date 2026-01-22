<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const goToLogin = () => {
  router.push({ name: 'login' })
}

const goToQuran = () => {
  router.push({ name: 'quran' })
}
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <!-- TopAppBar -->
    <nav class="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 border-b border-slate-200 dark:border-white/10 justify-between">
      <div class="flex items-center gap-2">
        <div class="text-primary flex size-10 shrink-0 items-center justify-center bg-primary/10 rounded-lg">
          <span class="material-symbols-outlined">menu_book</span>
        </div>
        <h2 class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">HatimConnect</h2>
      </div>
      <div class="flex items-center justify-end">
        <button 
          @click="goToLogin"
          class="bg-primary text-background-dark px-4 py-2 rounded-lg text-sm font-bold tracking-[0.015em] hover:opacity-90 transition-opacity"
        >
          Başla
        </button>
      </div>
    </nav>

    <!-- HeroSection -->
    <header class="relative overflow-hidden bg-white dark:bg-background-dark">
      <div class="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <!-- Image -->
          <div class="w-full lg:w-1/2 flex-shrink-0">
            <div 
              class="w-full aspect-square sm:aspect-[4/3] lg:aspect-square bg-center bg-no-repeat bg-cover rounded-2xl shadow-xl"
              style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDo_htxs3KeyZNUWweQdYPUXg0BN4kKtAmCbS5JQ_bI3qByebVBKZIuret9BrsTnciJFmsnZkJREXD3wdZEjRjibO02nfI1URcMKTWCBGXm9T-M6htvDutqNtHGVwQVEfj_F-FJ90vzeOp1zhOVLje8FwIE_zkKEgLMY1UgGjxXBNvea3EPWNFSVX_sSWYXQ8dbg8OMHQ279trz29dekzYRxtazlt2K_yab6YQyrc9aicTJicVd5RwyU6-xlTTpfAsafTt6qNr33lA');"
            ></div>
          </div>
          
          <!-- Content -->
          <div class="w-full lg:w-1/2 flex flex-col gap-6">
            <div class="flex flex-col gap-4 text-center lg:text-left">
              <span class="text-primary font-bold tracking-widest uppercase text-xs">PWA Deneyimi</span>
              <h1 class="text-slate-900 dark:text-white text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">
                Kolektif Kuran Hatimi, Yeniden Tasarlandı
              </h1>
              <p class="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-normal leading-relaxed">
                Dünya çapında hatimlere katılın, çevrimdışı ilerlemenizi takip edin ve topluluğunuzla kusursuz bir ruhani deneyimde bağlantı kurun.
              </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button 
                @click="goToQuran"
                class="w-full sm:w-auto flex cursor-pointer items-center justify-center rounded-xl h-12 px-8 bg-primary text-background-dark text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                Şimdi Okumaya Başla
              </button>
              <button 
                @click="goToLogin"
                class="w-full sm:w-auto flex cursor-pointer items-center justify-center rounded-xl h-12 px-8 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-base font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Daha Fazla Bilgi
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- App Walkthrough Video Placeholder -->
    <section class="p-4 py-10 bg-slate-50 dark:bg-[#0a1510]">
      <div class="max-w-4xl mx-auto flex flex-col gap-6">
        <h3 class="text-center text-xl font-bold dark:text-white">Nasıl çalıştığını izleyin</h3>
        <div 
          class="relative flex items-center justify-center bg-slate-900 bg-cover bg-center aspect-video rounded-xl shadow-2xl overflow-hidden group border-4 border-white dark:border-white/10"
          style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDkGACZseTVnVoLJs3g9aJXAC3IKL20VhLbjhUdRZB9H04owY7Sm0JxuSN7i8Nwt2awG8thl9nHzFJxERZp_1_uX3LkiEO6QxwZbfZZVwZBoPBCsuzEmKVXp1byo3F9hJFLvhD_taSOgjiyb6D-ldrLkBw0zl4daSk12eKXb-ooA_KTV7lgikVm6mNQKtyRPkwArPXJP5dd7A4blCqDP-KOlJhxORwv9O1pbr4HZMFJ9P8HUj-9hctN8NhgOKVuB4ccpBTMX1IbQgY');"
        >
          <div class="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
          <button class="relative z-10 flex shrink-0 items-center justify-center rounded-full size-20 bg-primary text-background-dark shadow-xl hover:scale-110 transition-transform">
            <span class="material-symbols-outlined !text-4xl">play_arrow</span>
          </button>
          <div class="absolute inset-x-0 bottom-0 px-6 py-5 z-10 bg-gradient-to-t from-black/80 to-transparent">
            <div class="flex h-1.5 items-center justify-center mb-2">
              <div class="h-1.5 flex-1 rounded-full bg-primary"></div>
              <div class="relative">
                <div class="absolute -left-2 -top-1 size-3 rounded-full bg-primary shadow-lg"></div>
              </div>
              <div class="h-1.5 flex-1 rounded-full bg-white/30"></div>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-white text-xs font-medium">0:37</p>
              <p class="text-white text-xs font-medium">2:23</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FeatureSection -->
    <section class="bg-white dark:bg-background-dark">
      <div class="flex flex-col gap-10 px-4 py-16 max-w-7xl mx-auto">
        <div class="flex flex-col gap-4 text-center items-center">
          <h2 class="text-slate-900 dark:text-white tracking-light text-3xl font-black leading-tight md:text-4xl max-w-[720px]">
            Hatimin Geleceğini Deneyimleyin
          </h2>
          <p class="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed max-w-[600px]">
            Modern okuyucu için topluluk ruhu ve evrensel erişilebilirlik odaklı tasarlandı.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Feature 1 -->
          <div class="flex flex-1 gap-5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 flex-col hover:border-primary/50 transition-colors shadow-sm">
            <div class="text-primary bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg">
              <span class="material-symbols-outlined !text-3xl">cloud_off</span>
            </div>
            <div class="flex flex-col gap-2">
              <h3 class="text-slate-900 dark:text-white text-lg font-bold leading-tight">Çevrimdışı Okuma</h3>
              <p class="text-slate-500 dark:text-slate-400 text-sm font-normal leading-relaxed">
                İnternet bağlantısı olmadan her yerde, her zaman okuyun. Çevrimiçi olduğunuzda ilerleme otomatik senkronize olur.
              </p>
            </div>
          </div>
          <!-- Feature 2 -->
          <div class="flex flex-1 gap-5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 flex-col hover:border-primary/50 transition-colors shadow-sm">
            <div class="text-primary bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg">
              <span class="material-symbols-outlined !text-3xl">group</span>
            </div>
            <div class="flex flex-col gap-2">
              <h3 class="text-slate-900 dark:text-white text-lg font-bold leading-tight">Grup Hatim Takibi</h3>
              <p class="text-slate-500 dark:text-slate-400 text-sm font-normal leading-relaxed">
                Ortak hatim hedeflerinde gerçek zamanlı güncellemeler. Hangi bölümlerin okunduğunu görün ve tamamlamaları birlikte kutlayın.
              </p>
            </div>
          </div>
          <!-- Feature 3 -->
          <div class="flex flex-1 gap-5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 flex-col hover:border-primary/50 transition-colors shadow-sm">
            <div class="text-primary bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg">
              <span class="material-symbols-outlined !text-3xl">chat_bubble</span>
            </div>
            <div class="flex flex-col gap-2">
              <h3 class="text-slate-900 dark:text-white text-lg font-bold leading-tight">Entegre Mesajlaşma</h3>
              <p class="text-slate-500 dark:text-slate-400 text-sm font-normal leading-relaxed">
                Dahili topluluk sohbetiyle motivasyonunuzu koruyun. Okuma çevrenizde görüşler, hatırlatıcılar ve destek paylaşın.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TestimonialsSection -->
    <section class="py-16 bg-slate-50 dark:bg-[#0a1510]">
      <h4 class="text-primary text-sm font-bold leading-normal tracking-[0.15em] px-4 mb-2 text-center uppercase">Sevgi Duvarı</h4>
      <h2 class="text-center text-3xl font-black mb-10 dark:text-white">Topluluğumuz Ne Diyor</h2>
      <div class="flex flex-col gap-6 px-4 max-w-4xl mx-auto">
        <div class="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
          <p class="text-slate-900 dark:text-white italic mb-4">
            "HatimConnect ailemizin birlikte okuma şeklini tamamen değiştirdi. Farklı şehirlerde olmamıza rağmen artık her ay bir hatim bitiriyoruz."
          </p>
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">SA</div>
            <div>
              <p class="text-sm font-bold dark:text-white">Sarah Al-Farsi</p>
              <p class="text-xs text-slate-500">Londra, İngiltere</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
          <p class="text-slate-900 dark:text-white italic mb-4">
            "Çevrimdışı mod işe gidip gelirken hayat kurtarıcı. Kullandığım en cilalı Kuran uygulaması. PWA iPhone'umda mükemmel çalışıyor."
          </p>
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">OM</div>
            <div>
              <p class="text-sm font-bold dark:text-white">Omar Mansour</p>
              <p class="text-xs text-slate-500">Toronto, Kanada</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-white/10 px-4 py-12">
      <div class="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <div class="flex items-center gap-2">
          <div class="text-primary flex size-8 shrink-0 items-center justify-center bg-primary/10 rounded-lg">
            <span class="material-symbols-outlined !text-xl">menu_book</span>
          </div>
          <h2 class="text-slate-900 dark:text-white text-lg font-bold">HatimConnect</h2>
        </div>
        <nav class="flex flex-wrap justify-center gap-6">
          <a class="text-slate-500 hover:text-primary text-sm font-medium transition-colors" href="#">Gizlilik Politikası</a>
          <a class="text-slate-500 hover:text-primary text-sm font-medium transition-colors" href="#">Kullanım Şartları</a>
          <a class="text-slate-500 hover:text-primary text-sm font-medium transition-colors" href="#">Destek</a>
          <a class="text-slate-500 hover:text-primary text-sm font-medium transition-colors" href="#">İletişim</a>
        </nav>
        <div class="flex gap-4">
          <a class="size-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition-all" href="#">
            <span class="material-symbols-outlined">share</span>
          </a>
          <a class="size-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition-all" href="#">
            <span class="material-symbols-outlined">alternate_email</span>
          </a>
        </div>
        <p class="text-slate-500 text-xs text-center">
          © 2024 HatimConnect. Ümmet için sevgiyle yapıldı.
        </p>
        <p class="text-[10px] text-slate-400 text-center">
          developed by 
          <a href="https://kayacuneyt.com" target="_blank" rel="noopener" class="text-primary/70 hover:text-primary">cüneyt kaya</a>
          & 
          <a href="https://digitaltamam.com" target="_blank" rel="noopener" class="text-primary/70 hover:text-primary">digitaltamam.com</a>
        </p>
      </div>
    </footer>
  </div>
</template>
