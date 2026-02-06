<script setup lang="ts">
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    description?: string
    closeLabel?: string
  }>(),
  {
    description: '',
    closeLabel: '关闭',
  },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const renderOpen = ref(false)
const isClosing = ref(false)
const isDragging = ref(false)
const sheetTranslateY = ref(0)
const sheetHeight = ref(0)
const viewportHeight = ref(typeof window === 'undefined' ? 0 : window.innerHeight)
const viewportWidth = ref(typeof window === 'undefined' ? 0 : window.innerWidth)
const sheetRef = ref<HTMLElement | null>(null)

const sheetTransitionMs = 240
const maxTranslate = computed(() => Math.max(sheetHeight.value + 24, viewportHeight.value))
const isWideScreen = computed(() => viewportWidth.value >= 961)

const dragStartY = ref(0)
const dragStartTranslate = ref(0)
const dragStartTime = ref(0)

let resizeObserver: ResizeObserver | null = null

const syncViewportHeight = () => {
  viewportHeight.value = window.innerHeight
  viewportWidth.value = window.innerWidth
}

const updateSheetHeight = () => {
  if (!sheetRef.value) return
  sheetHeight.value = sheetRef.value.getBoundingClientRect().height
}

const openSheet = async () => {
  if (renderOpen.value) return
  renderOpen.value = true
  isClosing.value = false
  await nextTick()
  updateSheetHeight()
  if (!resizeObserver && sheetRef.value) {
    resizeObserver = new ResizeObserver(() => updateSheetHeight())
    resizeObserver.observe(sheetRef.value)
  }
  sheetTranslateY.value = maxTranslate.value
  requestAnimationFrame(() => {
    sheetTranslateY.value = 0
  })
}

const animateClose = () => {
  if (!renderOpen.value || isClosing.value) return
  isClosing.value = true
  updateSheetHeight()
  sheetTranslateY.value = maxTranslate.value
  window.setTimeout(() => {
    renderOpen.value = false
    isClosing.value = false
  }, sheetTransitionMs)
}

const requestClose = () => {
  emit('update:open', false)
  animateClose()
}

const handleDialogOpenChange = (value: boolean) => {
  if (!value) requestClose()
}

const onDragMove = (event: PointerEvent) => {
  if (!isDragging.value) return
  const delta = Math.max(event.clientY - dragStartY.value, 0)
  const next = Math.min(dragStartTranslate.value + delta, maxTranslate.value)
  sheetTranslateY.value = next
}

const endDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
  const elapsed = Math.max(performance.now() - dragStartTime.value, 1)
  const velocity = (sheetTranslateY.value - dragStartTranslate.value) / elapsed
  const shouldClose = sheetTranslateY.value > maxTranslate.value * 0.4 || velocity > 1.1
  if (shouldClose) {
    requestClose()
  } else {
    sheetTranslateY.value = 0
  }
}

const startDrag = (event: PointerEvent) => {
  if (event.button !== 0) return
  if (isWideScreen.value) return
  isDragging.value = true
  dragStartY.value = event.clientY
  dragStartTranslate.value = sheetTranslateY.value
  dragStartTime.value = performance.now()
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)
}

watch(
  () => props.open,
  (value) => {
    if (value) {
      openSheet()
    } else {
      animateClose()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', syncViewportHeight)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', syncViewportHeight)
    window.removeEventListener('pointermove', onDragMove)
    window.removeEventListener('pointerup', endDrag)
    window.removeEventListener('pointercancel', endDrag)
  }
  resizeObserver?.disconnect()
})
</script>

<template>
  <DialogRoot :open="renderOpen" @update:open="handleDialogOpenChange">
    <DialogPortal>
      <DialogOverlay class="sheet-overlay" @click="requestClose" />
      <DialogContent as-child>
        <section
          ref="sheetRef"
          class="sheet"
          :class="{ 'sheet-dragging': isDragging }"
          :style="{ '--sheet-translate': `${sheetTranslateY}px` }"
        >
          <div class="sheet-handle" @pointerdown="startDrag"></div>
          <header class="sheet-header">
            <div>
              <DialogTitle class="sheet-title">{{ title }}</DialogTitle>
              <DialogDescription v-if="description" class="sheet-subtitle">
                {{ description }}
              </DialogDescription>
            </div>
            <button class="sheet-close" type="button" @click="requestClose">{{ closeLabel }}</button>
          </header>
          <div class="sheet-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="sheet-footer">
            <slot name="footer" />
          </div>
        </section>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(24, 20, 14, 0.32);
  backdrop-filter: blur(8px);
  z-index: 300;
}

.sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 310;
  margin: 0 auto;
  background: var(--panel);
  border-radius: 18px 18px 0 0;
  box-shadow: var(--panel-shadow-float);
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 560px;
  width: 100%;
  max-height: calc(100vh - 24px);
  transform: translateY(var(--sheet-translate, 0));
  transition: transform 0.24s ease;
}

.sheet-dragging {
  transition: none;
}

.sheet-handle {
  width: 52px;
  height: 6px;
  border-radius: 999px;
  background: rgba(28, 23, 16, 0.14);
  margin: 6px auto 14px;
  touch-action: none;
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.sheet-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.sheet-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--muted);
}

.sheet-close {
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 6px 12px;
  background: var(--panel);
  cursor: pointer;
  font-size: 12px;
}

.sheet-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 16px;
  overflow-y: auto;
}

.sheet-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

@media (max-width: 960px) {
  .sheet {
    max-width: 100%;
  }
}

@media (min-width: 961px) {
  .sheet-handle {
    display: none;
  }

  .sheet {
    left: 50%;
    right: auto;
    top: 50%;
    bottom: auto;
    width: min(560px, calc(100vw - 48px));
    border-radius: 18px;
    transform: translate(-50%, -50%) translateY(var(--sheet-translate, 0));
  }
}
</style>
