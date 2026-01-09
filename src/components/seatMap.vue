<script setup lang="ts">
import { onMounted, watch, onUnmounted, shallowRef, ref } from 'vue'
import { Primitive } from 'reka-ui'
import { Leafer, Rect, Image, Group } from 'leafer-ui'
import '@leafer-in/viewport'
import { loadSeatData, type SeatRecord } from '@/utils/seatData'

const props = defineProps<{
  floor: '4F' | '5F'
  seatStatusMap?: Record<string, number>
}>()

const leaferRef = shallowRef<Leafer | null>(null)
const viewRef = ref<HTMLDivElement | null>(null)
const renderToken = shallowRef(0)
const resizeObserver = shallowRef<ResizeObserver | null>(null)
const seatRects = shallowRef<Map<string, Rect>>(new Map())

const getSeatFill = (seatStatusMap: Record<string, number> | undefined, seatId: string) => {
  const status = seatStatusMap?.[seatId]
  if (status === 0) return '#2ba471'
  if (status === undefined || status === null || Number.isNaN(status)) return '#DDDDDD'
  return '#d54941'
}

// 座位数据类型
type SeatData = {
  seats: SeatRecord[]
}

// 初始化/重绘整张座位图
const initMap = async () => {
  // 递增令牌，用于取消过期渲染
  const token = ++renderToken.value
  if (leaferRef.value) {
    leaferRef.value.destroy()
    leaferRef.value = null
  }

  // 按楼层异步加载座位数据
  let seatData: SeatData | null = null
  try {
    seatData = await loadSeatData(props.floor)
  } catch (e) {
    console.error(`Failed to load seat data for ${props.floor}`, e)
    return
  }

  if (token !== renderToken.value) return

  const backgroundImageUrl = new URL(`../assets/background/${props.floor}.webp`, import.meta.url)
    .href

  const leafer = new Leafer({
    view: viewRef.value as HTMLDivElement,
    type: 'design',
  })
  leaferRef.value = leafer

  // 所有图形放进一个组，其实是为了方便整体居中
  const group = new Group({
    x: (leafer.width || 0) / 2,
    y: (leafer.height || 0) / 2,
  })

  leafer.add(group)

  // 不同楼层的座位位置信息和背景图缩放比例不同，这里做个校准
  const scaleConfig: Record<string, number> = {
    '4F': 0.377,
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

  seatRects.value = new Map()

  // 座位点位
  for (const seat of seatData.seats) {
    const seatRect = new Rect({
      x: seat.position.x,
      y: seat.position.y,
      width: 5,
      height: 5,
      fill: getSeatFill(props.seatStatusMap, seat.spaceId),
      cornerRadius: 1,
      cursor: 'pointer',
    })

    seatRect.on('click', () => {
      const status = seat.spaceId ? props.seatStatusMap?.[seat.spaceId] : undefined
      const statusText = status === 0 ? '可预约' : status === undefined ? '未查询' : '不可用'
      console.log(
        `该座位：spaceName：${seat.spaceName}，spaceId：${seat.spaceId}，spaceCode：${seat.spaceCode}，mapName：${seat.mapName}，状态：${statusText}`,
      )
    })

    group.add(seatRect)
    if (seat.spaceId) seatRects.value.set(seat.spaceId, seatRect)
  }

  // 居中并缩放到合适大小
  const fitGroupToView = () => {
    const leaferHeight = leafer.height ?? 1
    const leaferWidth = leafer.width ?? 1
    const groupHeight = Math.max(group.height ?? 1, 1)
    const groupWidth = Math.max(group.width ?? 1, 1)

    group.scale = Math.min((leaferHeight / groupHeight) * 0.8, (leaferWidth / groupWidth) * 0.8)
  }

  fitGroupToView()
  resizeObserver.value?.disconnect()
  if (viewRef.value) {
    resizeObserver.value = new ResizeObserver(() => fitGroupToView())
    resizeObserver.value.observe(viewRef.value)
  }
}

const applySeatStatuses = () => {
  for (const [seatKey, rect] of seatRects.value) {
    rect.fill = getSeatFill(props.seatStatusMap, seatKey)
  }
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

watch(
  () => props.seatStatusMap,
  () => {
    applySeatStatuses()
  },
)

onUnmounted(() => {
  resizeObserver.value?.disconnect()
  if (leaferRef.value) leaferRef.value.destroy()
})
</script>

<template>
  <Primitive as-child>
    <div ref="viewRef" class="view-root"></div>
  </Primitive>
</template>

<style scoped>
.view-root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
