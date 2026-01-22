import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/LandingView.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/HomeView.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue')
    },
    {
        path: '/auth/verify',
        name: 'verify',
        component: () => import('@/views/auth/VerifyView.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/ProfileView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/setup',
        name: 'profile-setup',
        component: () => import('@/views/auth/ProfileSetupView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/quran',
        name: 'quran',
        component: () => import('@/views/QuranReaderView.vue')
    },
    {
        path: '/quran/juz/:juzId',
        name: 'quran-juz',
        component: () => import('@/views/QuranReaderView.vue')
    },
    {
        path: '/quran/surah/:surahId',
        name: 'quran-surah',
        component: () => import('@/views/QuranReaderView.vue')
    },
    {
        path: '/hatim',
        name: 'hatim-list',
        component: () => import('@/views/HatimListView.vue')
    },
    {
        path: '/hatim/create',
        name: 'hatim-create',
        component: () => import('@/views/HatimCreateView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/hatim/join/:code',
        name: 'hatim-join',
        component: () => import('@/views/HatimJoinView.vue')
    },
    {
        path: '/hatim/:id',
        name: 'hatim-detail',
        component: () => import('@/views/HatimDetailView.vue')
    },
    {
        path: '/discover',
        name: 'discover',
        component: () => import('@/views/DiscoverView.vue')
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guard for auth
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token')
    const profileComplete = localStorage.getItem('profileComplete') === 'true'

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'login', query: { redirect: to.fullPath } })
    } else if (isAuthenticated && !profileComplete && to.name !== 'profile-setup' && to.name !== 'login') {
        next({ name: 'profile-setup' })
    } else {
        next()
    }
})

export default router
