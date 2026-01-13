<script setup lang="ts">
import { Primitive } from 'reka-ui'

defineProps<{
  availableCount: number
  unavailableCount: number
  unknownCount: number
  totalSeats: number
}>()
</script>

<template>
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
</template>

<style scoped>
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
  width: var(--status-dot-size);
  height: var(--status-dot-size);
  border-radius: 50%;
  display: inline-block;
  flex: 0 0 auto;
}

.status-dot.available {
  background: var(--success);
}

.status-dot.unavailable {
  background: var(--danger);
}

.status-dot.unknown {
  background: var(--status-unknown);
}

.status {
  font-size: 15px;
}

.status.available {
  color: var(--success);
}

.status.unavailable {
  color: var(--danger);
}

.status.unknown {
  color: var(--status-unknown);
}

.stats-total {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted);
}
</style>
