<script setup lang="ts">
defineOptions({
  name: 'SeatPage',
})

import { computed, ref, toRef, watch } from 'vue'
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
  floor: toRef(props, 'floor'),
})

const totalSeats = ref(0)
const seatSummary = computed(() => {
  let available = 0
  let unavailable = 0
  for (const status of Object.values(seatStatusMap.value)) {
    if (status === 0) {
      available += 1
    } else if (status !== undefined && status !== null && !Number.isNaN(status)) {
      unavailable += 1
    }
  }
  const unknown = Math.max(totalSeats.value - available - unavailable, 0)
  return {
    available,
    unavailable,
    unknown,
  }
})

const availableCount = computed(() => seatSummary.value.available)
const unavailableCount = computed(() => seatSummary.value.unavailable)
const unknownCount = computed(() => seatSummary.value.unknown)

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

watch(
  () => props.floor,
  () => {
    loadSeatTotals()
  },
  { immediate: true },
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
