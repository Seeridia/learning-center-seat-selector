<script setup lang="ts">
import { Primitive, ToggleGroupItem, ToggleGroupRoot, type AcceptableValue } from 'reka-ui'

const props = defineProps<{
  floor: '4F' | '5F'
}>()

const emit = defineEmits<{
  (e: 'update:floor', value: '4F' | '5F'): void
}>()

const handleFloorChange = (value: AcceptableValue | AcceptableValue[]) => {
  if (value === '4F' || value === '5F') {
    emit('update:floor', value)
  }
}
</script>

<template>
  <Primitive class="mobile-top-card">
    <!-- 楼层切换 -->
    <ToggleGroupRoot
      type="single"
      class="floor-pills"
      :model-value="props.floor"
      @update:modelValue="handleFloorChange"
    >
      <ToggleGroupItem as-child value="4F">
        <button class="floor-pill" type="button">4F</button>
      </ToggleGroupItem>
      <ToggleGroupItem as-child value="5F">
        <button class="floor-pill" type="button">5F</button>
      </ToggleGroupItem>
    </ToggleGroupRoot>
  </Primitive>
</template>

<style scoped>
.mobile-top-card {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  padding: 12px 16px;
  padding-top: calc(env(safe-area-inset-top, 0px) + 12px);
}

@media (max-width: 960px) {
  .mobile-top-card {
    display: block;
  }
}

/* 楼层切换药丸 */
.floor-pills {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 3px;
  gap: 2px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(45, 36, 24, 0.1);
}

.floor-pill {
  border: none;
  background: transparent;
  padding: 6px 14px;
  border-radius: 17px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.floor-pill[data-state='on'] {
  background: var(--panel);
  color: var(--accent-strong);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
