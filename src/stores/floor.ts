import { ref } from 'vue'
import { defineStore } from 'pinia'

const FLOOR_KEY = 'learning_center_floor'

export const useFloorStore = defineStore('floor', () => {
  const currentFloor = ref<'4F' | '5F'>(
    localStorage.getItem(FLOOR_KEY) === '5F' ? '5F' : '4F',
  )

  const setFloor = (value: '4F' | '5F') => {
    currentFloor.value = value
    localStorage.setItem(FLOOR_KEY, value)
  }

  return {
    currentFloor,
    setFloor,
  }
})
