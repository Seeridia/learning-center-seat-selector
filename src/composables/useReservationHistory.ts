import { computed, ref } from 'vue'
import { queryMyAppoint } from '@/api'
import type { ReservationHistoryRecord } from '@/types/api'

export const useReservationHistory = () => {
  const records = ref<ReservationHistoryRecord[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const lastQueryTime = ref('')

  const totalPages = computed(() => {
    const pages = Math.ceil(total.value / pageSize.value)
    return pages > 0 ? pages : 1
  })

  const fetchHistory = async () => {
    errorMessage.value = ''
    isLoading.value = true
    try {
      const response = await queryMyAppoint({
        currentPage: currentPage.value,
        pageSize: pageSize.value,
      })
      const data = response?.data
      if (data?.code !== '0') {
        throw new Error(data?.msg || '查询失败')
      }
      records.value = Array.isArray(data?.dataList) ? data.dataList : []
      total.value = Number(data?.total ?? records.value.length)
      lastQueryTime.value = new Date().toLocaleString()
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '查询失败，请稍后重试'
    } finally {
      isLoading.value = false
    }
  }

  const goPrevPage = () => {
    if (currentPage.value <= 1) return
    currentPage.value -= 1
    fetchHistory()
  }

  const goNextPage = () => {
    if (currentPage.value >= totalPages.value) return
    currentPage.value += 1
    fetchHistory()
  }

  return {
    records,
    isLoading,
    errorMessage,
    currentPage,
    pageSize,
    total,
    totalPages,
    lastQueryTime,
    fetchHistory,
    goPrevPage,
    goNextPage,
  }
}
