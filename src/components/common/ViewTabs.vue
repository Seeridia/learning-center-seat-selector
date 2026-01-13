<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeName = computed(() => route.name)
</script>

<template>
  <nav class="view-tabs" aria-label="视图切换">
    <RouterLink
      class="view-tab"
      :data-active="activeName === 'seat'"
      to="/"
    >
      选座
    </RouterLink>
    <RouterLink
      class="view-tab"
      :data-active="activeName === 'history'"
      to="/history"
    >
      预约历史
    </RouterLink>
  </nav>
</template>

<style scoped>
.view-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 18px;
}

.view-tab {
  border: 1px solid transparent;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  color: var(--accent-strong);
  font-size: 13px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.view-tab[data-active='true'] {
  border-color: var(--accent-strong);
  background: #fff;
  box-shadow: var(--panel-shadow-md);
}

.view-tab:not([data-active='true']):hover {
  transform: translateY(-1px);
  box-shadow: var(--panel-shadow-lg);
}
</style>
