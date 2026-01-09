<script setup lang="ts">
const props = defineProps<{
  selectedDate: string
  startTime: string
  endTime: string
}>()
</script>

<template>
  <div class="card">
    <p class="label">预约时间</p>
    <p class="main">{{ props.selectedDate }} {{ props.startTime }} - {{ props.endTime }}</p>
    <p class="meta">请确认时间段是否正确</p>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid var(--border);
  background: var(--panel);
  padding: 14px 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--panel-shadow-md);
}

.label {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
}

.main {
  margin: 6px 0 4px;
  font-size: 16px;
  font-weight: 600;
}

.meta {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
}
</style>
