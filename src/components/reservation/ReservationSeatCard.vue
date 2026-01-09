<script setup lang="ts">
import type { SeatRecord } from '../../types/seat'

const props = defineProps<{
  seat: SeatRecord | null
  statusText: string
}>()
</script>

<template>
  <div class="card">
    <p class="label">座位信息</p>
    <p class="main">{{ props.seat?.spaceName || props.seat?.mapName || '未知座位' }}</p>
    <p class="meta">
      ID：{{ props.seat?.spaceId || '-' }} ·
      编码：{{ props.seat?.spaceCode || '-' }}
    </p>
    <span class="status" :data-status="props.statusText">{{ props.statusText }}</span>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid var(--border);
  background: var(--panel);
  padding: 14px 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--panel-shadow-md);
  position: relative;
}

.label {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
}

.main {
  margin: 6px 0 4px;
  font-size: 16px;
  font-weight: 600;
}

.meta {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
}

.status {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: rgba(160, 122, 71, 0.14);
  color: var(--accent-strong);
}

.status[data-status='可预约'] {
  background: rgba(43, 164, 113, 0.16);
  color: var(--success);
}

.status[data-status='不可用'] {
  background: rgba(213, 73, 65, 0.14);
  color: var(--danger);
}
</style>
