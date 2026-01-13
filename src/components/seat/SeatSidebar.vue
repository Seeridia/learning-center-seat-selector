<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { ViewTabs } from '@/components/common'
import { FloorSelectorCard, SeatQueryPanel, SeatStatsCard } from '@/components/seat'

const props = defineProps<{
  floor: '4F' | '5F'
  selectedDate: string
  startTime: string
  endTime: string
  timeOptions: string[]
  isQuerying: boolean
  errorMessage: string
  lastQueryTime: string
  availableCount: number
  unavailableCount: number
  unknownCount: number
  totalSeats: number
}>()

const emit = defineEmits<{
  (e: 'update:floor', value: '4F' | '5F'): void
  (e: 'update:selectedDate', value: string): void
  (e: 'update:startTime', value: string): void
  (e: 'update:endTime', value: string): void
  (e: 'query'): void
}>()

const selectedDateModel = computed({
  get: () => props.selectedDate,
  set: (value: string) => emit('update:selectedDate', value),
})

const startTimeModel = computed({
  get: () => props.startTime,
  set: (value: string) => emit('update:startTime', value),
})

const endTimeModel = computed({
  get: () => props.endTime,
  set: (value: string) => emit('update:endTime', value),
})
</script>

<template>
  <Primitive class="sidebar-header">
    <Primitive as="p" class="eyebrow">Learning Center</Primitive>
    <Primitive as="h2">学习中心</Primitive>
    <Primitive as="p" class="subtle">福州大学 学习中心预约平台</Primitive>
  </Primitive>
  <ViewTabs />
  <FloorSelectorCard :floor="props.floor" @update:floor="emit('update:floor', $event)" />
  <SeatQueryPanel
    v-model:selectedDate="selectedDateModel"
    v-model:startTime="startTimeModel"
    v-model:endTime="endTimeModel"
    :time-options="props.timeOptions"
    :is-querying="props.isQuerying"
    :error-message="props.errorMessage"
    :last-query-time="props.lastQueryTime"
    @query="emit('query')"
  />
  <SeatStatsCard
    :available-count="props.availableCount"
    :unavailable-count="props.unavailableCount"
    :unknown-count="props.unknownCount"
    :total-seats="props.totalSeats"
  />
</template>

<style scoped>
.sidebar-header {
  margin-bottom: 18px;
}

.sidebar-header h2 {
  margin: 6px 0;
  font-size: 22px;
  letter-spacing: 0.06em;
}

.eyebrow {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.4em;
  color: var(--muted);
  text-transform: uppercase;
}

.subtle {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
}
</style>
