<script setup lang="ts">
import { computed } from 'vue'
import type { ReservationHistoryRecord } from '@/types/api'

const props = defineProps<{
  records: ReservationHistoryRecord[]
  isLoading: boolean
  errorMessage: string
  currentPage: number
  pageSize: number
  total: number
  lastQueryTime: string
}>()

const emit = defineEmits<{
  (e: 'prev-page'): void
  (e: 'next-page'): void
  (e: 'refresh'): void
}>()

const totalPages = computed(() => {
  const pages = Math.ceil(props.total / props.pageSize)
  return pages > 0 ? pages : 1
})

const normalizeStatus = (status?: number | string) => {
  if (status === undefined || status === null) return undefined
  const parsed = Number(status)
  return Number.isNaN(parsed) ? undefined : parsed
}

const statusLabel = (status?: number | string) => {
  const normalized = normalizeStatus(status)
  switch (normalized) {
    case 0:
      return '审核中'
    case 1:
      return '未通过'
    case 2:
      return '可签到'
    case 3:
      return '已取消'
    case 4:
      return '已失效'
    case 5:
      return '已完成'
    default:
      return '未知状态'
  }
}

const statusTone = (status?: number | string) => {
  const normalized = normalizeStatus(status)
  switch (normalized) {
    case 2:
    case 5:
      return 'success'
    case 1:
    case 3:
      return 'danger'
    case 0:
    case 4:
      return 'muted'
    default:
      return 'neutral'
  }
}

const formatDate = (record: ReservationHistoryRecord) => record.date || '日期未知'

const formatTimeRange = (record: ReservationHistoryRecord) => {
  const beginTime = record.beginTime || ''
  const endTime = record.endTime || record.endAppointmentTime || ''
  if (!beginTime && !endTime) return '时间未知'
  return `${beginTime}${endTime ? ` - ${endTime}` : ''}`.trim()
}

const formatLocation = (record: ReservationHistoryRecord) =>
  record.spaceName || record.regionName || '未知位置'
</script>

<template>
  <section class="history-view">
    <header class="history-header">
      <div>
        <p class="eyebrow">My Appointments</p>
        <h2>我的预约历史</h2>
        <p class="subtle">共 {{ props.total }} 条记录 · 第 {{ props.currentPage }} / {{ totalPages }} 页</p>
      </div>
      <button class="ghost" type="button" :disabled="props.isLoading" @click="emit('refresh')">
        {{ props.isLoading ? '刷新中...' : '刷新列表' }}
      </button>
    </header>

    <p v-if="props.errorMessage" class="error">{{ props.errorMessage }}</p>

    <div v-if="props.isLoading" class="loading">正在加载预约记录...</div>

    <div v-else-if="props.records.length === 0" class="empty">
      <p>暂无预约记录</p>
      <p class="subtle">可以调整筛选条件后重试</p>
    </div>

    <div v-else class="history-list">
      <article v-for="record in props.records" :key="record.id" class="history-card">
        <div class="card-top">
          <p class="title">{{ formatLocation(record) }}</p>
          <span class="status" :data-tone="statusTone(record.auditStatus)">
            {{ statusLabel(record.auditStatus) }}
          </span>
        </div>
        <p class="meta">{{ formatDate(record) }} {{ formatTimeRange(record) }}</p>
      </article>
    </div>

    <footer class="pagination">
      <button type="button" class="ghost" :disabled="props.currentPage <= 1" @click="emit('prev-page')">
        上一页
      </button>
      <span>第 {{ props.currentPage }} / {{ totalPages }} 页</span>
      <button
        type="button"
        class="ghost"
        :disabled="props.currentPage >= totalPages"
        @click="emit('next-page')"
      >
        下一页
      </button>
    </footer>

    <p v-if="props.lastQueryTime" class="meta">最后更新：{{ props.lastQueryTime }}</p>
  </section>
</template>

<style scoped>
.history-view {
  height: 100%;
  padding: 32px 36px;
  overflow-y: auto;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.history-header h2 {
  margin: 6px 0;
  font-size: 24px;
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

.loading,
.empty {
  margin-top: 20px;
  padding: 18px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--border);
  background: rgba(255, 255, 255, 0.6);
  color: var(--muted);
}

.history-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.history-card {
  border: 1px solid var(--border);
  background: var(--panel);
  padding: 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--panel-shadow-md);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.meta {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
}

.card-body p {
  margin: 0;
  font-size: 13px;
  color: var(--text);
}

.status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: rgba(154, 144, 132, 0.16);
  color: var(--status-unknown);
}

.status[data-tone='success'] {
  background: rgba(43, 164, 113, 0.16);
  color: var(--success);
}

.status[data-tone='danger'] {
  background: rgba(213, 73, 65, 0.14);
  color: var(--danger);
}

.status[data-tone='muted'] {
  background: rgba(160, 122, 71, 0.14);
  color: var(--accent-strong);
}

.status[data-tone='neutral'] {
  background: rgba(210, 210, 210, 0.4);
  color: #666;
}

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--muted);
}

.ghost {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.8);
  color: var(--accent-strong);
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.ghost:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: var(--panel-shadow-float);
}

.ghost:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  margin: 0 0 12px;
  color: var(--danger);
  font-size: 12px;
}

@media (max-width: 960px) {
  .history-view {
    padding: 24px 20px;
  }

  .history-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .history-list {
    grid-template-columns: 1fr;
  }
}
</style>
