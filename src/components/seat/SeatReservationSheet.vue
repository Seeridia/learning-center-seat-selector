<script setup lang="ts">
import { computed } from 'vue'
import { IosSheet, ReservationSeatCard, ReservationTimeCard } from '@/components/reservation'
import type { SeatRecord } from '@/types/seat'

const props = defineProps<{
  open: boolean
  selectedSeat: SeatRecord | null
  selectedSeatStatus?: number
  selectedDate: string
  startTime: string
  endTime: string
  isSubmitting: boolean
  reservationMessage: string
  reservationSuccess: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit'): void
}>()

const openModel = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value),
})

const selectedSeatStatusText = computed(() => {
  const status = props.selectedSeatStatus
  if (status === 0) return '可预约'
  if (status === undefined || status === null || Number.isNaN(status)) return '未查询'
  return '不可用'
})
</script>

<template>
  <IosSheet
    v-model:open="openModel"
    title="确认预约"
    description="请核对座位与时间后提交预约"
  >
    <ReservationSeatCard :seat="props.selectedSeat" :status-text="selectedSeatStatusText" />
    <ReservationTimeCard
      :selected-date="props.selectedDate"
      :start-time="props.startTime"
      :end-time="props.endTime"
    />
    <p v-if="props.reservationMessage" class="sheet-message" :data-success="props.reservationSuccess">
      {{ props.reservationMessage }}
    </p>
    <template #footer>
      <button
        class="sheet-primary"
        type="button"
        :disabled="props.isSubmitting || props.selectedSeatStatus !== 0 || props.reservationSuccess"
        @click="emit('submit')"
      >
        {{
          props.isSubmitting ? '提交中...' : props.reservationSuccess ? '已预约' : '确认预约'
        }}
      </button>
      <button class="sheet-secondary" type="button" @click="emit('update:open', false)">
        暂不预约
      </button>
    </template>
  </IosSheet>
</template>

<style scoped>
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
</style>
