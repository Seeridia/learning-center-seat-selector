<script setup lang="ts">
withDefaults(
  defineProps<{
    isQuerying?: boolean
    size?: number
  }>(),
  {
    isQuerying: false,
    size: 20,
  },
)
</script>

<template>
  <svg
    v-if="!isQuerying"
    class="query-status-icon"
    :width="size"
    :height="size"
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
    class="query-status-icon spinning"
    :width="size"
    :height="size"
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
</template>

<style scoped>
.query-status-icon {
  flex-shrink: 0;
}

.spinning {
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
</style>
