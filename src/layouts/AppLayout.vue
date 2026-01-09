<script setup lang="ts">
import { Primitive, ToggleGroupItem, ToggleGroupRoot, type AcceptableValue } from 'reka-ui'
import { computed, onMounted, ref, toRef, watch } from 'vue'
import SeatMap from '../components/seatMap.vue'
import SeatQueryPanel from '../components/SeatQueryPanel.vue'
import { useSeatQuery } from '../composables/useSeatQuery'
import { loadSeatData } from '../utils/seatData'

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

const handleFloorChange = (value: AcceptableValue | AcceptableValue[]) => {
  if (value === '4F' || value === '5F') {
    emit('update:floor', value)
  }
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
  <Primitive class="app-layout">
    <Primitive class="seatmap">
      <SeatMap :floor="props.floor" :seat-status-map="seatStatusMap" />
    </Primitive>
    <Primitive as="aside" class="sidebar">
      <Primitive class="sidebar-header">
        <Primitive as="p" class="eyebrow">Learning Center</Primitive>
        <Primitive as="h2">学习中心</Primitive>
        <Primitive as="p" class="subtle">福州大学 学习中心预约平台</Primitive>
      </Primitive>
      <Primitive class="sidebar-card">
        <Primitive as="p" class="section-title">楼层选择</Primitive>
        <ToggleGroupRoot
          type="single"
          class="floor-selector"
          :model-value="props.floor"
          @update:modelValue="handleFloorChange"
        >
          <ToggleGroupItem as-child value="4F">
            <Primitive as="button" class="toggle" type="button">4F</Primitive>
          </ToggleGroupItem>
          <ToggleGroupItem as-child value="5F">
            <Primitive as="button" class="toggle" type="button">5F</Primitive>
          </ToggleGroupItem>
        </ToggleGroupRoot>
      </Primitive>
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
      <Primitive class="sidebar-card stats-card">
        <Primitive as="p" class="section-title">座位统计</Primitive>
        <Primitive class="stats-row">
          <span class="stats-label">
            <span class="status-dot available" aria-hidden="true"></span>
            <span>可预约</span>
          </span>
          <strong class="status available">{{ availableCount }}</strong>
        </Primitive>
        <Primitive class="stats-row">
          <span class="stats-label">
            <span class="status-dot unavailable" aria-hidden="true"></span>
            <span>不可用</span>
          </span>
          <strong class="status unavailable">{{ unavailableCount }}</strong>
        </Primitive>
        <Primitive class="stats-row">
          <span class="stats-label">
            <span class="status-dot unknown" aria-hidden="true"></span>
            <span>未查询</span>
          </span>
          <strong class="status unknown">{{ unknownCount }}</strong>
        </Primitive>
        <Primitive class="stats-total">总座位：{{ totalSeats }}</Primitive>
      </Primitive>
    </Primitive>
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

.seatmap {
  flex: 1;
  position: relative;
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.9), rgba(241, 236, 225, 0.7));
}

.sidebar {
  width: 320px;
  padding: 28px 24px;
  border-left: 1px solid var(--border);
  background: var(--panel-soft);
  box-shadow: -18px 0 40px rgba(20, 15, 8, 0.08);
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

.sidebar-card {
  margin-top: 18px;
  padding: 12px 12px 14px;
  border-radius: 14px;
  background: var(--panel);
  border: 1px solid var(--border);
  box-shadow: 0 10px 20px rgba(20, 16, 10, 0.06);
}

.section-title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-strong);
}

.stats-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--accent-strong);
  font-size: 13px;
}

.stats-row span {
  color: var(--muted);
}

.stats-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  flex: 0 0 auto;
}

.status-dot.available {
  background: #2ba471;
}

.status-dot.unavailable {
  background: #d54941;
}

.status-dot.unknown {
  background: #9a9084;
}

.status {
  font-size: 15px;
}

.status.available {
  color: #2ba471;
}

.status.unavailable {
  color: #d54941;
}

.status.unknown {
  color: #9a9084;
}

.stats-total {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted);
}

.floor-selector {
  display: flex;
  gap: 10px;
}

.toggle {
  flex: 1;
  border: 1px solid var(--border);
  background: #fff;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.toggle[data-state='on'] {
  background: var(--accent-strong);
  color: #fff;
  border-color: var(--accent-strong);
  box-shadow: 0 10px 18px rgba(20, 16, 10, 0.16);
}

@media (max-width: 960px) {
  .app-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-left: none;
    border-top: 1px solid var(--border);
    box-shadow: 0 -18px 40px rgba(20, 15, 8, 0.08);
  }

  .seatmap {
    min-height: 52vh;
  }
}
</style>
