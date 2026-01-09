<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, onMounted, ref, toRef, watch } from 'vue'
import FloorSelectorCard from '../components/FloorSelectorCard.vue'
import IosSheet from '../components/reservation/IosSheet.vue'
import ReservationHistoryContainer from '../components/reservation/ReservationHistoryContainer.vue'
import ReservationHistoryView from '../components/reservation/ReservationHistoryView.vue'
import ReservationSeatCard from '../components/reservation/ReservationSeatCard.vue'
import ReservationTimeCard from '../components/reservation/ReservationTimeCard.vue'
import SeatMap from '../components/SeatMap.vue'
import SeatQueryPanel from '../components/SeatQueryPanel.vue'
import SeatStatsCard from '../components/SeatStatsCard.vue'
import { useSeatReservation } from '../composables/useSeatReservation'
import { useSeatQuery } from '../composables/useSeatQuery'
import { loadSeatData } from '../utils/seatData'
import type { SeatRecord } from '../types/seat'

const props = defineProps<{
  floor: '4F' | '5F'
  token: string
}>()

const emit = defineEmits<{
  (e: 'update:floor', value: '4F' | '5F'): void
}>()

const activeView = ref<'seat' | 'history'>('seat')

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

const selectedSeatStatusText = computed(() => {
  const status = selectedSeatStatus.value
  if (status === 0) return '可预约'
  if (status === undefined || status === null || Number.isNaN(status)) return '未查询'
  return '不可用'
})

const sheetOpen = ref(false)

const openSheetForSeat = (seat: SeatRecord) => {
  selectedSeat.value = seat
  resetReservationState()
  sheetOpen.value = true
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

watch(
  () => activeView.value,
  (nextView) => {
    if (nextView === 'history') {
      sheetOpen.value = false
    }
  },
)

</script>

<template>
  <Primitive class="app-layout">
    <Primitive class="main-area">
      <SeatMap
        v-show="activeView === 'seat'"
        :floor="props.floor"
        :seat-status-map="seatStatusMap"
        @select-seat="openSheetForSeat($event.seat)"
      />
      <ReservationHistoryContainer
        :token="props.token"
        :active="activeView === 'history'"
        v-slot="history"
      >
        <ReservationHistoryView
          v-show="activeView === 'history'"
          :records="history.records"
          :is-loading="history.isLoading"
          :error-message="history.errorMessage"
          :current-page="history.currentPage"
          :page-size="history.pageSize"
          :total="history.total"
          :last-query-time="history.lastQueryTime"
          @refresh="history.fetchHistory"
          @prev-page="history.goPrevPage"
          @next-page="history.goNextPage"
        />
      </ReservationHistoryContainer>
    </Primitive>
    <Primitive as="aside" class="sidebar">
      <Primitive class="sidebar-header">
        <Primitive as="p" class="eyebrow">Learning Center</Primitive>
        <Primitive as="h2">学习中心</Primitive>
        <Primitive as="p" class="subtle">福州大学 学习中心预约平台</Primitive>
      </Primitive>
      <div class="view-tabs">
        <button
          class="view-tab"
          type="button"
          :data-active="activeView === 'seat'"
          @click="activeView = 'seat'"
        >
          选座
        </button>
        <button
          class="view-tab"
          type="button"
          :data-active="activeView === 'history'"
          @click="activeView = 'history'"
        >
          预约历史
        </button>
      </div>
      <div v-show="activeView === 'seat'">
        <FloorSelectorCard :floor="props.floor" @update:floor="emit('update:floor', $event)" />
        <SeatQueryPanel
          v-model:selectedDate="selectedDate"
          v-model:startTime="startTime"
          v-model:endTime="endTime"
          :time-options="timeOptions"
          :is-querying="isQuerying"
          :error-message="errorMessage"
          :last-query-time="lastQueryTime"
          @query="handleQuery"
        />
        <SeatStatsCard
          :available-count="availableCount"
          :unavailable-count="unavailableCount"
          :unknown-count="unknownCount"
          :total-seats="totalSeats"
        />
      </div>
    </Primitive>
    <IosSheet
      v-model:open="sheetOpen"
      title="确认预约"
      description="请核对座位与时间后提交预约"
    >
      <ReservationSeatCard :seat="selectedSeat" :status-text="selectedSeatStatusText" />
      <ReservationTimeCard
        :selected-date="selectedDate"
        :start-time="startTime"
        :end-time="endTime"
      />
      <p v-if="reservationMessage" class="sheet-message" :data-success="reservationSuccess">
        {{ reservationMessage }}
      </p>
      <template #footer>
        <button
          class="sheet-primary"
          type="button"
          :disabled="isSubmitting || selectedSeatStatus !== 0 || reservationSuccess"
          @click="submitReservation"
        >
          {{ isSubmitting ? '提交中...' : reservationSuccess ? '已预约' : '确认预约' }}
        </button>
        <button class="sheet-secondary" type="button" @click="sheetOpen = false">
          暂不预约
        </button>
      </template>
    </IosSheet>
  </Primitive>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  gap: 0;
}

.main-area {
  flex: 1;
  position: relative;
  background: var(--seatmap-bg);
  overflow: hidden;
}

.sheet-message {
  margin: 0;
  font-size: 13px;
  color: var(--danger);
}

.sheet-message[data-success='true'] {
  color: var(--success);
}

.sheet-primary {
  border: none;
  padding: 12px 16px;
  border-radius: 999px;
  background: var(--accent-strong);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.sheet-primary:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: var(--panel-shadow-float);
}

.sheet-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sheet-secondary {
  border: 1px solid var(--border);
  padding: 10px 16px;
  border-radius: 999px;
  background: transparent;
  color: var(--accent-strong);
  cursor: pointer;
  font-size: 14px;
}

.sidebar {
  width: var(--sidebar-width);
  padding: var(--sidebar-padding);
  border-left: 1px solid var(--border);
  background: var(--panel-soft);
  box-shadow: var(--sidebar-shadow);
  overflow-y: auto;
}

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

.view-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 18px;
}

.view-tab {
  border: 1px solid transparent;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  color: var(--accent-strong);
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.view-tab[data-active='true'] {
  border-color: var(--accent-strong);
  background: #fff;
  box-shadow: var(--panel-shadow-md);
}

.view-tab:not([data-active='true']):hover {
  transform: translateY(-1px);
  box-shadow: var(--panel-shadow-lg);
}

@media (max-width: 960px) {
  .app-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-left: none;
    border-top: 1px solid var(--border);
    box-shadow: var(--sidebar-shadow-mobile);
  }

  .main-area {
    min-height: 52vh;
  }
}
</style>
