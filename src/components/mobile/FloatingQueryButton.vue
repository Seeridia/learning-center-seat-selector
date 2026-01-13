<script setup lang="ts">
defineProps<{
  isQuerying?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button class="floating-query-button" type="button" :disabled="isQuerying" @click="emit('click')">
    <svg
      v-if="!isQuerying"
      class="icon"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
    <svg
      v-else
      class="icon spinning"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
    >
      <path
        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        opacity="0.3"
      />
      <path d="M12 2v4" />
    </svg>
    <span class="label">{{ isQuerying ? '查询中' : '查询座位' }}</span>
  </button>
</template>

<style scoped>
.floating-query-button {
  display: none;
  position: fixed;
  bottom: 24px;
  right: 16px;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0px);

  align-items: center;
  gap: 8px;

  border: none;
  background: var(--accent-strong);
  color: #fff;
  padding: 14px 20px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 8px 24px rgba(45, 36, 24, 0.2);
  transition: all 0.2s ease;
}

@media (max-width: 960px) {
  .floating-query-button {
    display: flex;
  }
}

.floating-query-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.18),
    0 12px 32px rgba(45, 36, 24, 0.25);
}

.floating-query-button:not(:disabled):active {
  transform: translateY(0) scale(0.98);
}

.floating-query-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.icon {
  flex-shrink: 0;
}

.icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.label {
  white-space: nowrap;
}
</style>
