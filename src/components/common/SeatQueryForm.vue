<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    selectedDate: string
    startTime: string
    endTime: string
    timeOptions: string[]
    isQuerying: boolean
    errorMessage: string
    lastQueryTime: string
    variant?: 'desktop' | 'mobile'
    submitLabel?: string
  }>(),
  {
    variant: 'desktop',
  },
)

const emit = defineEmits<{
  (e: 'update:selectedDate', value: string): void
  (e: 'update:startTime', value: string): void
  (e: 'update:endTime', value: string): void
  (e: 'query'): void
}>()

const selectedDateModel = computed({
  get: () => props.selectedDate,
  set: (value: string) => emit('update:selectedDate', value),
})

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const startTimeModel = computed({
  get: () => props.startTime,
  set: (value: string) => emit('update:startTime', value),
})

const endTimeModel = computed({
  get: () => props.endTime,
  set: (value: string) => emit('update:endTime', value),
})

const dateOptions = computed(() => {
  const options: Array<{ value: string; day: string; weekday: string }> = []
  const today = new Date()
  const formatter = new Intl.DateTimeFormat('zh-CN', { weekday: 'short' })
  for (let offset = 0; offset < 8; offset += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + offset)
    const value = formatLocalDate(date)
    options.push({
      value,
      day: String(date.getDate()).padStart(2, '0'),
      weekday: formatter.format(date),
    })
  }
  return options
})

const selectedRange = computed(() => {
  const startIndex = props.timeOptions.indexOf(props.startTime)
  const endIndex = props.timeOptions.indexOf(props.endTime)
  return {
    startIndex,
    endIndex,
    hasRange: startIndex >= 0 && endIndex >= 0 && endIndex > startIndex,
  }
})

const isSelectingStart = ref(true)
const MAX_DURATION_STEPS = 9

const isStartTime = (option: string) => option === props.startTime
const isEndTime = (option: string) => option === props.endTime
const isInRange = (option: string) => {
  const { startIndex, endIndex, hasRange } = selectedRange.value
  if (!hasRange) return false
  const currentIndex = props.timeOptions.indexOf(option)
  return currentIndex > startIndex && currentIndex < endIndex
}

const handleTimeClick = (option: string) => {
  const startIndex = props.timeOptions.indexOf(props.startTime)
  const clickedIndex = props.timeOptions.indexOf(option)

  const hasRange = Boolean(props.startTime && props.endTime)

  if (hasRange) {
    startTimeModel.value = option
    endTimeModel.value = ''
    isSelectingStart.value = false
    return
  }

  if (isSelectingStart.value || !props.startTime) {
    startTimeModel.value = option
    isSelectingStart.value = false
    return
  }

  if (clickedIndex <= startIndex) {
    startTimeModel.value = option
    endTimeModel.value = ''
    isSelectingStart.value = false
    return
  }

  const durationSteps = clickedIndex - startIndex
  if (durationSteps > MAX_DURATION_STEPS) {
    endTimeModel.value = props.timeOptions[startIndex + MAX_DURATION_STEPS] ?? option
  } else {
    endTimeModel.value = option
  }
  isSelectingStart.value = true
}

const idleLabel = computed(() => {
  if (props.submitLabel) return props.submitLabel
  return props.variant === 'mobile' ? '查询座位' : '查询'
})

const buttonText = computed(() => (props.isQuerying ? '查询中...' : idleLabel.value))
</script>

<template>
  <div class="seat-query-form" :data-variant="props.variant">
    <div class="date-row">
      <span class="field-label">日期</span>
      <div class="date-grid">
        <button
          v-for="option in dateOptions"
          :key="option.value"
          type="button"
          class="date-cell"
          :class="{ 'is-selected': option.value === props.selectedDate }"
          :disabled="isQuerying"
          @click="selectedDateModel = option.value"
        >
          <span class="date-day">{{ option.day }}</span>
          <span class="date-week">{{ option.weekday }}</span>
        </button>
      </div>
    </div>

    <div class="time-row">
      <span class="field-label">选择时间段</span>
      <div class="time-grid">
        <button
          v-for="option in timeOptions"
          :key="option"
          type="button"
          class="time-cell"
          :class="{
            'is-start': isStartTime(option),
            'is-end': isEndTime(option),
            'is-range': isInRange(option),
          }"
          :disabled="isQuerying"
          @click="handleTimeClick(option)"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <button class="query-button" type="button" :disabled="isQuerying" @click="emit('query')">
      {{ buttonText }}
    </button>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="lastQueryTime" class="meta">最后查询：{{ lastQueryTime }}</p>
  </div>
</template>

<style scoped>
.seat-query-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
}

.input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  background: var(--control-bg);
  font-size: 16px; /* 防止 iOS 缩放 */
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  -webkit-appearance: none;
  appearance: none;
}

.input:focus {
  outline: none;
  border-color: rgba(160, 122, 71, 0.6);
  box-shadow: 0 0 0 3px rgba(160, 122, 71, 0.16);
}

.time-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.date-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.date-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
}

.date-cell {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 6px;
  background: var(--control-bg);
  color: var(--text);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.date-cell.is-selected {
  background: var(--accent-strong);
  border-color: transparent;
  color: #fff;
}

.date-cell:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.date-day {
  font-size: 16px;
  font-weight: 700;
}

.date-week {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.time-cell {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 8px;
  background: var(--control-bg);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.time-cell.is-range {
  background: rgba(160, 122, 71, 0.12);
  border-color: rgba(160, 122, 71, 0.35);
}

.time-cell.is-start,
.time-cell.is-end {
  background: var(--accent-strong);
  border-color: transparent;
  color: #fff;
}

.time-cell:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.query-button {
  width: 100%;
  border: none;
  background: var(--accent-strong);
  color: #fff;
  padding: 14px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-top: 8px;
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease;
}

.query-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: var(--panel-shadow-float);
}

.query-button:not(:disabled):active {
  transform: scale(0.98);
}

.query-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin: 0;
  padding: 10px 14px;
  background: rgba(213, 73, 65, 0.1);
  border-radius: var(--radius-sm);
  color: var(--danger);
  font-size: 14px;
}

.meta {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  text-align: center;
}

.seat-query-form[data-variant='desktop'] {
  gap: 12px;
}

.seat-query-form[data-variant='desktop'] .field {
  gap: 6px;
  margin-bottom: 0;
}

.seat-query-form[data-variant='desktop'] .field-label {
  font-size: 13px;
  font-weight: 500;
}

.seat-query-form[data-variant='desktop'] .input {
  padding: 9px 12px;
  font-size: 14px;
}

.seat-query-form[data-variant='desktop'] .time-row {
  gap: 8px;
}

.seat-query-form[data-variant='desktop'] .date-grid {
  gap: 6px;
}

.seat-query-form[data-variant='desktop'] .date-cell {
  padding: 8px 6px;
}

.seat-query-form[data-variant='desktop'] .date-day {
  font-size: 14px;
}

.seat-query-form[data-variant='desktop'] .date-week {
  font-size: 10px;
}

.seat-query-form[data-variant='desktop'] .time-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
}

.seat-query-form[data-variant='desktop'] .time-cell {
  padding: 8px 6px;
  font-size: 12px;
}

.seat-query-form[data-variant='desktop'] .query-button {
  padding: 10px 12px;
  font-size: 14px;
  letter-spacing: 0.08em;
  margin-top: 0;
}

.seat-query-form[data-variant='desktop'] .error {
  padding: 0;
  background: transparent;
  border-radius: 0;
  font-size: 12px;
}

.seat-query-form[data-variant='desktop'] .meta {
  font-size: 12px;
  text-align: left;
}

.seat-query-form[data-variant='mobile'] .time-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.seat-query-form[data-variant='mobile'] .date-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
</style>
