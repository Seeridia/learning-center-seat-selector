<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import MobileNavIcon from './MobileNavIcon.vue'

const route = useRoute()
const isOnSeatPage = computed(() => route.name === 'seat')
</script>

<template>
  <RouterLink class="mobile-nav-button" :to="isOnSeatPage ? '/history' : '/'">
    <MobileNavIcon :is-on-seat-page="isOnSeatPage" />
  </RouterLink>
</template>

<style scoped>
.mobile-nav-button {
  display: none;
  position: fixed;
  bottom: 24px;
  left: 16px;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0px);

  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;

  border: none;
  background: var(--panel);
  color: var(--accent-strong);
  border-radius: 50%;
  cursor: pointer;
  text-decoration: none;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 8px 24px rgba(45, 36, 24, 0.12);
  transition: all 0.2s ease;
}

@media (max-width: 960px) {
  .mobile-nav-button {
    display: flex;
  }
}

.mobile-nav-button:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.12),
    0 12px 32px rgba(45, 36, 24, 0.15);
}

.mobile-nav-button:active {
  transform: translateY(0) scale(0.95);
}
</style>
