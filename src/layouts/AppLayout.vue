<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, onMounted, ref, toRef, watch } from 'vue'
import FloorSelectorCard from '../components/FloorSelectorCard.vue'
import SeatMap from '../components/seatMap.vue'
import SeatQueryPanel from '../components/SeatQueryPanel.vue'
import SeatStatsCard from '../components/SeatStatsCard.vue'
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
  background: var(--seatmap-bg);
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

  .seatmap {
    min-height: 52vh;
  }
}
</style>
