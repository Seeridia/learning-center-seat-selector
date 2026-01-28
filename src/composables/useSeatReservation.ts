import { computed, ref, type Ref } from 'vue'
import { addSpaceAppoint } from '@/api'
import type { SeatRecord } from '@/types/seat'

type UseSeatReservationOptions = {
  selectedDate: Ref<string>
  startTime: Ref<string>
  endTime: Ref<string>
  selectedSeat: Ref<SeatRecord | null>
  seatStatusMap: Ref<Record<string, number>>
}

export const useSeatReservation = ({
  selectedDate,
  startTime,
  endTime,
  selectedSeat,
  seatStatusMap,
}: UseSeatReservationOptions) => {
  const isSubmitting = ref(false)
  const reservationMessage = ref('')
  const reservationSuccess = ref(false)

  const selectedSeatStatus = computed(() => {
    const seat = selectedSeat.value
    if (!seat?.spaceId) return undefined
    return seatStatusMap.value[seat.spaceId]
  })

  const resetReservationState = () => {
    isSubmitting.value = false
    reservationMessage.value = ''
    reservationSuccess.value = false
  }

  const submitReservation = async () => {
    if (!selectedSeat.value) return
    if (selectedSeatStatus.value !== 0) return
    if (!selectedDate.value || !startTime.value || !endTime.value) return
    isSubmitting.value = true
    reservationMessage.value = ''
    reservationSuccess.value = false
    try {
      const response = await addSpaceAppoint({
        spaceId: selectedSeat.value.spaceId,
        beginTime: startTime.value,
        endTime: endTime.value,
        date: selectedDate.value,
      })
      const data = response?.data
      if (data?.code !== '0') {
        throw new Error(data?.msg || '预约失败')
      }
      reservationSuccess.value = true
      reservationMessage.value = '预约成功'
    } catch (error) {
      reservationMessage.value = error instanceof Error ? error.message : '预约失败，请稍后重试'
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    reservationMessage,
    reservationSuccess,
    selectedSeatStatus,
    resetReservationState,
    submitReservation,
  }
}
