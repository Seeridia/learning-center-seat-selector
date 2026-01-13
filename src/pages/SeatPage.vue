<script setup lang="ts">
defineOptions({
  name: 'SeatPage',
})

import { computed, onMounted, ref, toRef, watch } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { ViewTabs } from '@/components/common'
import { SeatMap, SeatReservationSheet, SeatSidebar } from '@/components/seat'
import { MobileTopCard, MobileBottomBar, MobileQuerySheet } from '@/components/mobile'
import { useSeatReservation } from '@/composables/useSeatReservation'
import { useSeatQuery } from '@/composables/useSeatQuery'
import { loadSeatData } from '@/utils/seatData'
import type { SeatRecord } from '@/types/seat'

const props = defineProps<{
  floor: '4F' | '5F'
  token: string
}>()

const emit = defineEmits<{
  (e: 'update:floor', value: '4F' | '5F'): void
}>()

const {
  selectedDate,
  startTime,
  endTime,
  timeOptions,
  isQuerying,
  errorMessage,
  seatStatusMap,
  lastQueryTime,
  handleQuery,
} = useSeatQuery({
  token: toRef(props, 'token'),
  floor: toRef(props, 'floor'),
})

const totalSeats = ref(0)
const availableCount = computed(
  () => Object.values(seatStatusMap.value).filter((status) => status === 0).length,
)
const unavailableCount = computed(
  () =>
    Object.values(seatStatusMap.value).filter(
      (status) => status !== 0 && status !== undefined && status !== null && !Number.isNaN(status),
    ).length,
)
const unknownCount = computed(() => {
  const remaining = totalSeats.value - availableCount.value - unavailableCount.value
  return remaining > 0 ? remaining : 0
})

const loadSeatTotals = async () => {
  const data = await loadSeatData(props.floor)
  totalSeats.value = data.seats.length
}

const selectedSeat = ref<SeatRecord | null>(null)
const {
  isSubmitting,
  reservationMessage,
  reservationSuccess,
  selectedSeatStatus,
  resetReservationState,
  submitReservation,
} = useSeatReservation({
  token: toRef(props, 'token'),
  selectedDate,
  startTime,
  endTime,
  selectedSeat,
  seatStatusMap,
})

const sheetOpen = ref(false)
const querySheetOpen = ref(false)

const openSheetForSeat = (seat: SeatRecord) => {
  selectedSeat.value = seat
  resetReservationState()
  sheetOpen.value = true
}

const openQuerySheet = () => {
  querySheetOpen.value = true
}

onMounted(() => {
  loadSeatTotals()
})

watch(
  () => props.floor,
  () => {
    loadSeatTotals()
  },
)
</script>

<template>
  <AppLayout view="seat">
    <template #mobile-tabs>
      <ViewTabs />
    </template>

    <!-- 移动端浮动控制区 -->
    <template #mobile-controls>
      <MobileTopCard :floor="props.floor" @update:floor="emit('update:floor', $event)" />
      <MobileBottomBar
        :selected-date="selectedDate"
        :start-time="startTime"
        :end-time="endTime"
        :is-querying="isQuerying"
        @open-query="openQuerySheet"
      />
      <MobileQuerySheet
        v-model:open="querySheetOpen"
        :selected-date="selectedDate"
        :start-time="startTime"
        :end-time="endTime"
        :time-options="timeOptions"
        :is-querying="isQuerying"
        :error-message="errorMessage"
        :last-query-time="lastQueryTime"
        @update:selectedDate="selectedDate = $event"
        @update:startTime="startTime = $event"
        @update:endTime="endTime = $event"
        @query="handleQuery"
      />
    </template>

    <template #main>
      <SeatMap
        :floor="props.floor"
        :seat-status-map="seatStatusMap"
        @select-seat="openSheetForSeat($event.seat)"
      />
    </template>
    <template #sidebar>
      <SeatSidebar
        :floor="props.floor"
        :selected-date="selectedDate"
        :start-time="startTime"
        :end-time="endTime"
        :time-options="timeOptions"
        :is-querying="isQuerying"
        :error-message="errorMessage"
        :last-query-time="lastQueryTime"
        :available-count="availableCount"
        :unavailable-count="unavailableCount"
        :unknown-count="unknownCount"
        :total-seats="totalSeats"
        @update:floor="emit('update:floor', $event)"
        @update:selectedDate="selectedDate = $event"
        @update:startTime="startTime = $event"
        @update:endTime="endTime = $event"
        @query="handleQuery"
      />
    </template>

    <SeatReservationSheet
      v-model:open="sheetOpen"
      :selected-seat="selectedSeat"
      :selected-seat-status="selectedSeatStatus"
      :selected-date="selectedDate"
      :start-time="startTime"
      :end-time="endTime"
      :is-submitting="isSubmitting"
      :reservation-message="reservationMessage"
      :reservation-success="reservationSuccess"
      @submit="submitReservation"
    />
  </AppLayout>
</template>

<style scoped></style>
