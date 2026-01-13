<script setup lang="ts">
import { Primitive } from 'reka-ui'

withDefaults(
  defineProps<{
    view?: 'seat' | 'history'
  }>(),
  {
    view: 'seat',
  },
)
</script>

<template>
  <Primitive class="app-layout" :data-view="view">
    <div class="mobile-tabs">
      <slot name="mobile-tabs" />
    </div>
    <Primitive class="main-area">
      <slot name="main" />
    </Primitive>
    <Primitive as="aside" class="sidebar">
      <slot name="sidebar" />
    </Primitive>
    <slot />
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

.main-area {
  flex: 1;
  position: relative;
  background: var(--seatmap-bg);
  overflow: hidden;
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

.mobile-tabs {
  display: none;
}

@media (max-width: 960px) {
  .app-layout {
    flex-direction: column;
  }

  .mobile-tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 12px 16px;
    background: var(--panel-soft);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--panel-shadow-md);
  }

  .mobile-tabs .view-tabs {
    margin-bottom: 0;
  }

  .view-tabs {
    display: none;
  }

  .sidebar {
    width: 100%;
    padding: 14px 16px 18px;
    border-left: none;
    border-top: 1px solid var(--border);
    box-shadow: var(--sidebar-shadow-mobile);
  }

  .sidebar-header {
    display: none;
  }

  .main-area {
    min-height: 56vh;
  }

  .app-layout[data-view='history'] .sidebar {
    display: none;
  }
}
</style>
