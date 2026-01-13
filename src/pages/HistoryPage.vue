<script setup lang="ts">
import { Primitive } from 'reka-ui'
import AppLayout from '@/layouts/AppLayout.vue'
import { ViewTabs } from '@/components/common'
import { ReservationHistoryContainer, ReservationHistoryView } from '@/components/reservation'

defineProps<{
  token: string
  floor?: '4F' | '5F'
}>()
</script>

<template>
  <AppLayout view="history">
    <template #mobile-tabs>
      <ViewTabs />
    </template>
    <template #main>
      <ReservationHistoryContainer :token="token" :active="true" v-slot="history">
        <ReservationHistoryView
          :records="history.records"
          :is-loading="history.isLoading"
          :error-message="history.errorMessage"
          :current-page="history.currentPage"
          :page-size="history.pageSize"
          :total="history.total"
          :last-query-time="history.lastQueryTime"
          @refresh="history.fetchHistory"
          @prev-page="history.goPrevPage"
          @next-page="history.goNextPage"
        />
      </ReservationHistoryContainer>
    </template>
    <template #sidebar>
      <Primitive class="sidebar-header">
        <Primitive as="p" class="eyebrow">Learning Center</Primitive>
        <Primitive as="h2">学习中心</Primitive>
        <Primitive as="p" class="subtle">福州大学 学习中心预约平台</Primitive>
      </Primitive>
      <ViewTabs />
    </template>
  </AppLayout>
</template>

<style scoped>
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
</style>
