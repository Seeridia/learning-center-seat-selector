<script setup lang="ts">
import { computed } from 'vue'

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

const startTimeModel = computed({
  get: () => props.startTime,
  set: (value: string) => emit('update:startTime', value),
})

const endTimeModel = computed({
  get: () => props.endTime,
  set: (value: string) => emit('update:endTime', value),
})

const idleLabel = computed(() => {
  if (props.submitLabel) return props.submitLabel
  return props.variant === 'mobile' ? '查询座位' : '查询'
})

const buttonText = computed(() => (props.isQuerying ? '查询中...' : idleLabel.value))
</script>

<template>
  <div class="seat-query-form" :data-variant="props.variant">
    <label class="field">
      <span class="field-label">日期</span>
      <input v-model="selectedDateModel" type="date" class="input" />
    </label>

    <div class="time-row">
      <label class="field">
        <span class="field-label">开始时间</span>
        <select v-model="startTimeModel" class="input">
          <option v-for="option in timeOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>
      <label class="field">
        <span class="field-label">结束时间</span>
        <select v-model="endTimeModel" class="input">
          <option v-for="option in timeOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>
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
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
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
  grid-template-columns: 1fr;
  gap: 12px;
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

.seat-query-form[data-variant='mobile'] .time-row {
  grid-template-columns: 1fr 1fr;
}
</style>
