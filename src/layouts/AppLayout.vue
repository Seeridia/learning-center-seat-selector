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
    <!-- 桌面端 tabs -->
    <div class="mobile-tabs desktop-only">
      <slot name="mobile-tabs" />
    </div>
    <!-- 移动端浮动控制区 -->
    <div class="mobile-controls">
      <slot name="mobile-controls" />
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

.mobile-controls {
  display: contents;
}

.desktop-only {
  display: none;
}

@media (max-width: 960px) {
  .app-layout {
    flex-direction: column;
  }

  /* 移动端隐藏所有 mobile-tabs */
  .mobile-tabs {
    display: none !important;
  }

  .view-tabs {
    display: none;
  }

  /* 座位页面：地图全屏，隐藏 sidebar */
  .app-layout[data-view='seat'] .sidebar {
    display: none;
  }

  .app-layout[data-view='seat'] .main-area {
    height: 100vh;
    min-height: 100vh;
  }

  /* 历史页面：隐藏 sidebar */
  .app-layout[data-view='history'] .sidebar {
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
    flex: 1;
    min-height: 0;
  }
}
</style>
