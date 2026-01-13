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
  <Primitive class="sidebar-card">
    <Primitive as="p" class="section-title">楼层选择</Primitive>
    <ToggleGroupRoot
      type="single"
      class="floor-selector"
      :model-value="props.floor"
      @update:modelValue="handleFloorChange"
    >
      <ToggleGroupItem as-child value="4F">
        <Primitive as="button" class="toggle" type="button">4F</Primitive>
      </ToggleGroupItem>
      <ToggleGroupItem as-child value="5F">
        <Primitive as="button" class="toggle" type="button">5F</Primitive>
      </ToggleGroupItem>
    </ToggleGroupRoot>
  </Primitive>
</template>

<style scoped>
.floor-selector {
  display: flex;
  gap: 10px;
}

.toggle {
  flex: 1;
  border: 1px solid var(--border);
  background: var(--control-bg);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.toggle[data-state='on'] {
  background: var(--accent-strong);
  color: #fff;
  border-color: var(--accent-strong);
  box-shadow: var(--toggle-shadow-active);
}
</style>
