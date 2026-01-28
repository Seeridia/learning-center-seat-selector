<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useReservationHistory } from '@/composables/useReservationHistory'

const props = defineProps<{
  active?: boolean
}>()

const history = useReservationHistory()

const hasFetched = ref(false)

const maybeFetchHistory = () => {
  if (hasFetched.value) return
  hasFetched.value = true
  history.fetchHistory()
}

const slotProps = computed(() => ({
  records: history.records.value,
  isLoading: history.isLoading.value,
  errorMessage: history.errorMessage.value,
  currentPage: history.currentPage.value,
  pageSize: history.pageSize.value,
  total: history.total.value,
  totalPages: history.totalPages.value,
  lastQueryTime: history.lastQueryTime.value,
  fetchHistory: history.fetchHistory,
  goPrevPage: history.goPrevPage,
  goNextPage: history.goNextPage,
}))

onMounted(() => {
  if (props.active) {
    maybeFetchHistory()
  }
})

watch(
  () => props.active,
  (value) => {
    if (value) {
      maybeFetchHistory()
    }
  },
)
</script>

<template>
  <slot v-bind="slotProps" />
</template>
