import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/request-form',
      name: 'requests',
      component: () => import('@/views/request-form.vue'),
    },
    {
      path: '/vendors',
      name: 'vendors',
      component: () => import('@/views/vendors.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/login.vue'),
    },
    
  ],
})

export default router
