import { createRouter, createWebHistory } from 'vue-router'
import SeatPage from '@/pages/SeatPage.vue'
import HistoryPage from '@/pages/HistoryPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/seat',
    },
    {
      path: '/seat',
      name: 'seat',
      component: SeatPage,
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryPage,
    },
  ],
})

export default router
