<script setup lang="ts">
import { ref } from 'vue'
import SeatMap from './components/seatMap.vue'

const currentFloor = ref<'4F' | '5F'>('4F')
</script>

<template>
  <div class="Container">
    <div class="seatMap-wrapper">
      <SeatMap :floor="currentFloor" />
    </div>
    <aside class="sidebar">
      <h2>学习中心</h2>
      <div class="floor-selector">
        <button @click="currentFloor = '4F'" :class="{ active: currentFloor === '4F' }">4F</button>
        <button @click="currentFloor = '5F'" :class="{ active: currentFloor === '5F' }">5F</button>
      </div>
    </aside>
  </div>
</template>

<style>
body {
  margin: 0;
}
</style>

<style scoped>
.Container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.seatMap-wrapper {
  flex: 1;
  position: relative;
}
.sidebar {
  width: 300px;
  padding: 20px;
  background-color: #f5f5f5;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}
.floor-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.floor-selector button {
  padding: 8px 16px;
  cursor: pointer;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
}
.floor-selector button.active {
  background: #32cd79;
  color: white;
  border-color: #32cd79;
}
</style>
