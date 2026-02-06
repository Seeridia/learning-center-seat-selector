<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MobileNavIcon from './MobileNavIcon.vue'
import QueryStatusIcon from './QueryStatusIcon.vue'

const props = defineProps<{
  selectedDate: string
  startTime: string
  endTime: string
  isQuerying?: boolean
}>()

const emit = defineEmits<{
  (e: 'openQuery'): void
  (e: 'query'): void
}>()

const route = useRoute()
const isOnSeatPage = computed(() => route.name === 'seat')

const parseLocalDate = (value: string) => {
  const [yearText, monthText, dayText] = value.split('-')
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null
  return new Date(year, month - 1, day)
}

const formattedDate = computed(() => {
  if (!props.selectedDate) return '今天'
  const date = parseLocalDate(props.selectedDate)
  if (!date) return props.selectedDate
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return '今天'
  if (date.toDateString() === tomorrow.toDateString()) return '明天'
  return `${date.getMonth() + 1}/${date.getDate()}`
})

const timeRange = computed(() => {
  if (!props.startTime || !props.endTime) return ''
  return `${props.startTime.slice(0, 5)}-${props.endTime.slice(0, 5)}`
})
</script>

<template>
  <div class="mobile-bottom-bar">
    <!-- 左侧：导航按钮 -->
    <RouterLink class="nav-button" :to="isOnSeatPage ? '/history' : '/'">
      <MobileNavIcon :is-on-seat-page="isOnSeatPage" />
    </RouterLink>

    <!-- 中间：时间显示（点击打开查询面板） -->
    <button class="time-display" type="button" @click="emit('openQuery')">
      <span class="time-text">
        <span class="date">{{ formattedDate }}</span>
        <span class="separator">·</span>
        <span class="time">{{ timeRange }}</span>
      </span>
      <svg
        class="chevron"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>

    <!-- 右侧：查询按钮 -->
    <button class="query-button" type="button" :disabled="isQuerying" @click="emit('openQuery')">
      <QueryStatusIcon :is-querying="isQuerying" />
    </button>
  </div>
</template>

<style scoped>
.mobile-bottom-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 12px 16px;
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(255, 255, 255, 0.95) 70%,
    rgba(255, 255, 255, 0) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 960px) {
  .mobile-bottom-bar {
    display: flex;
  }
}

/* 导航按钮 */
.nav-button {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--panel);
  color: var(--accent-strong);
  border-radius: 50%;
  cursor: pointer;
  text-decoration: none;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(45, 36, 24, 0.1);
  transition: all 0.2s ease;
}

.nav-button:hover {
  transform: translateY(-1px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 8px 24px rgba(45, 36, 24, 0.12);
}

.nav-button:active {
  transform: translateY(0) scale(0.95);
}

/* 时间显示按钮 */
.time-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  background: var(--panel);
  height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  cursor: pointer;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 4px 16px rgba(45, 36, 24, 0.08);
  transition: all 0.2s ease;
}

.time-display:hover {
  background: #fff;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 8px 24px rgba(45, 36, 24, 0.1);
}

.time-display:active {
  transform: scale(0.98);
}

.time-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--accent-strong);
}

.separator {
  color: var(--muted);
}

.time {
  color: var(--text);
}

.chevron {
  color: var(--muted);
  transition: transform 0.2s ease;
}

/* 查询按钮 */
.query-button {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--accent-strong);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(45, 36, 24, 0.15);
  transition: all 0.2s ease;
}

.query-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.12),
    0 8px 24px rgba(45, 36, 24, 0.2);
}

.query-button:not(:disabled):active {
  transform: translateY(0) scale(0.95);
}

.query-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

</style>
