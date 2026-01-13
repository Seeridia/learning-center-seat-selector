<script setup lang="ts">
import { SeatQueryForm } from '@/components/common'

const props = defineProps<{
  selectedDate: string
  startTime: string
  endTime: string
  timeOptions: string[]
  isQuerying: boolean
  errorMessage: string
  lastQueryTime: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedDate', value: string): void
  (e: 'update:startTime', value: string): void
  (e: 'update:endTime', value: string): void
  (e: 'query'): void
}>()
</script>

<template>
  <section class="section">
    <h3>查询条件</h3>
    <SeatQueryForm
      variant="desktop"
      :selected-date="props.selectedDate"
      :start-time="props.startTime"
      :end-time="props.endTime"
      :time-options="props.timeOptions"
      :is-querying="props.isQuerying"
      :error-message="props.errorMessage"
      :last-query-time="props.lastQueryTime"
      @update:selectedDate="emit('update:selectedDate', $event)"
      @update:startTime="emit('update:startTime', $event)"
      @update:endTime="emit('update:endTime', $event)"
      @query="emit('query')"
    />
  </section>
</template>

<style scoped>
.section {
  margin-top: 12px;
  padding: 14px;
  border-radius: var(--radius-lg);
  background: var(--panel);
  border: 1px solid var(--border);
  box-shadow: var(--panel-shadow-lg);
}

.section h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-strong);
  margin: 0 0 12px;
}
</style>
