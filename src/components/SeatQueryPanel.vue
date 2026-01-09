<script setup lang="ts">
import { computed } from 'vue'

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
  <section class="section">
    <h3>查询条件</h3>
    <label class="field">
      <span>日期</span>
      <input v-model="selectedDateModel" type="date" class="input" />
    </label>
    <label class="field">
      <span>开始时间</span>
      <select v-model="startTimeModel" class="input">
        <option v-for="option in timeOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </label>
    <label class="field">
      <span>结束时间</span>
      <select v-model="endTimeModel" class="input">
        <option v-for="option in timeOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </label>
    <button class="primary" type="button" :disabled="isQuerying" @click="emit('query')">
      {{ isQuerying ? '查询中...' : '查询' }}
    </button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="lastQueryTime" class="meta">最后查询：{{ lastQueryTime }}</p>
  </section>
</template>

<style scoped>
.section {
  margin-top: 12px;
  padding: 14px;
  border-radius: 16px;
  background: var(--panel);
  border: 1px solid var(--border);
  box-shadow: 0 12px 24px rgba(20, 16, 10, 0.06);
}

.section h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-strong);
  margin: 0 0 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
  color: var(--muted);
  font-size: 13px;
}

.input {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 9px 12px;
  background: #fff;
  font-size: 14px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: rgba(160, 122, 71, 0.6);
  box-shadow: 0 0 0 3px rgba(160, 122, 71, 0.16);
}

.primary {
  width: 100%;
  border: none;
  background: var(--accent-strong);
  color: #fff;
  padding: 10px 12px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  letter-spacing: 0.08em;
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease;
}

.primary:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(20, 16, 10, 0.18);
}

.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 10px;
  color: var(--danger);
  font-size: 12px;
}

.meta {
  margin-top: 8px;
  color: var(--muted);
  font-size: 12px;
}
</style>
