<script setup lang="ts">
import { onMounted, watch, onUnmounted, shallowRef } from 'vue'
import { Leafer, Rect, Image, Group } from 'leafer-ui'
import '@leafer-in/viewport'

const props = defineProps<{
  floor: '4F' | '5F'
}>()

const leaferRef = shallowRef<Leafer | null>(null)

const initMap = async () => {
  if (leaferRef.value) {
    leaferRef.value.destroy()
    leaferRef.value = null
  }

  let seatData
  try {
    const module = await import(`@/assets/map/${props.floor}.json`)
    seatData = module.default
  } catch (e) {
    console.error(`Failed to load seat data for ${props.floor}`, e)
    return
  }

  const backgroundImageUrl = new URL(`../assets/background/${props.floor}.webp`, import.meta.url)
    .href

  const leafer = new Leafer({ view: 'leafer-view', type: 'design' })
  leaferRef.value = leafer

  const group = new Group({
    x: (leafer.width || 0) / 2,
    y: (leafer.height || 0) / 2,
  })

  leafer.add(group)

  const scaleConfig: Record<string, number> = {
    '4F': 0.376,
    '5F': 0.14,
  }
  const currentScale = scaleConfig[props.floor] || 0.188

  const imgX = (-2500 * currentScale) / 2
  const imgY = (-2500 * currentScale) / 2

  const backgroundImage = new Image({
    x: imgX,
    y: imgY,
    scale: currentScale,
    url: backgroundImageUrl,
  })
  group.add(backgroundImage)

  if (seatData && seatData.seats) {
    for (const seat of seatData.seats) {
      const seatRect = new Rect({
        x: seat.position.x,
        y: seat.position.y,
        width: 5,
        height: 5,
        fill: '#32cd79',
        cornerRadius: 1,
        cursor: 'pointer',
      })

      seatRect.on('click', () => {
        alert(`You selected seat: ${seat.name}`)
      })

      group.add(seatRect)
    }
  }

  const leaferHeight = leafer.height ?? 1
  const leaferWidth = leafer.width ?? 1
  const groupHeight = Math.max(group.height ?? 1, 1)
  const groupWidth = Math.max(group.width ?? 1, 1)

  group.scale = Math.min((leaferHeight / groupHeight) * 0.8, (leaferWidth / groupWidth) * 0.8)
}

onMounted(() => {
  initMap()
})

watch(
  () => props.floor,
  () => {
    initMap()
  },
)

onUnmounted(() => {
  if (leaferRef.value) leaferRef.value.destroy()
})
</script>

<template>
  <div id="leafer-view"></div>
</template>

<style scoped>
#leafer-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
