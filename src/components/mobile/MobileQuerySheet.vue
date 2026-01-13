<script setup lang="ts">
import IosSheet from '@/components/reservation/IosSheet.vue'
import { SeatQueryForm } from '@/components/common'

const props = defineProps<{
  open: boolean
  selectedDate: string
  startTime: string
  endTime: string
  timeOptions: string[]
  isQuerying: boolean
  errorMessage: string
  lastQueryTime: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'update:selectedDate', value: string): void
  (e: 'update:startTime', value: string): void
  (e: 'update:endTime', value: string): void
  (e: 'query'): void
}>()

const handleQuery = () => {
  emit('query')
  emit('update:open', false)
}
</script>

<template>
  <IosSheet
    :open="open"
    title="查询设置"
    description="选择日期和时间段来查询座位"
    @update:open="emit('update:open', $event)"
  >
    <SeatQueryForm
      variant="mobile"
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
      @query="handleQuery"
    />
  </IosSheet>
</template>

<style scoped></style>
