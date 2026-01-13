<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isOnSeatPage = computed(() => route.name === 'seat')
</script>

<template>
  <RouterLink class="mobile-nav-button" :to="isOnSeatPage ? '/history' : '/seat'">
    <!-- 历史图标 -->
    <svg
      v-if="isOnSeatPage"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
    <!-- 地图图标 -->
    <svg
      v-else
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
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
