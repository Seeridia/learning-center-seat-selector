<script setup lang="ts">
import { Primitive, ToggleGroupItem, ToggleGroupRoot, type AcceptableValue } from 'reka-ui'
import SeatMap from '../components/seatMap.vue'

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
  <Primitive class="app-layout">
    <Primitive class="seatmap">
      <SeatMap :floor="props.floor" />
    </Primitive>
    <Primitive as="aside" class="sidebar">
      <Primitive as="h2">学习中心</Primitive>
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
  </Primitive>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.seatmap {
  flex: 1;
  position: relative;
}

.sidebar {
  width: 280px;
  padding: 20px;
  border-left: 1px solid #e5e7eb;
  background: #f9fafb;
  overflow-y: auto;
}

.floor-selector {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.toggle {
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
}

.toggle[data-state='on'] {
  background: #111827;
  color: #fff;
  border-color: #111827;
}
</style>
