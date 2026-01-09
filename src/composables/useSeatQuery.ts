import axios from 'axios'
import { computed, ref, watch, type Ref } from 'vue'
import { loadSeatLookup } from '@/utils/seatData'

type UseSeatQueryOptions = {
  token: Ref<string>
  floor: Ref<'4F' | '5F'>
}

const pad = (value: number) => String(value).padStart(2, '0')

export const useSeatQuery = ({ token, floor }: UseSeatQueryOptions) => {
  const today = new Date()
  const defaultDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

  const selectedDate = ref(defaultDate)
  const startTime = ref('12:00')
  const endTime = ref('13:00')
  const isQuerying = ref(false)
  const errorMessage = ref('')
  const seatStatusMap = ref<Record<string, number>>({})
  const lastQueryTime = ref('')
  const region = 1

  const queryPayload = computed(() => ({
    beginTime: `${selectedDate.value} ${startTime.value}`,
    endTime: `${selectedDate.value} ${endTime.value}`,
    floorLike: floor.value.replace('F', ''),
    parentId: null,
    region,
  }))

  const timeOptions = computed(() => {
    const options: string[] = []
    for (let hour = 8; hour <= 22; hour += 1) {
      const hourText = pad(hour)
      options.push(`${hourText}:00`)
      if (hour !== 22) options.push(`${hourText}:30`)
    }
    options.push('22:30')
    return options
  })

  const handleQuery = async () => {
    errorMessage.value = ''
    if (!selectedDate.value || !startTime.value || !endTime.value) {
      errorMessage.value = '请完整选择日期与时间'
      return
    }

    isQuerying.value = true
    seatStatusMap.value = {}
    try {
      const response = await axios.post(
        'https://aiot.fzu.edu.cn/api/ibs/spaceAppoint/app/queryStationStatusByTime',
        queryPayload.value,
        {
          headers: {
            Token: token.value,
          },
        },
      )
      const data = response?.data
      if (data?.code !== '0') {
        throw new Error(data?.msg || '查询失败')
      }

      const nextMap: Record<string, number> = {}
      const list = Array.isArray(data?.dataList) ? data.dataList : []
      const seatLookup = await loadSeatLookup(floor.value)
      for (const item of list) {
        const status = Number(item?.spaceStatus)
        const spaceName = item?.spaceName
        const spaceCode = item?.spaceCode
        const seat =
          (spaceName ? seatLookup.bySpaceName[String(spaceName)] : undefined) ||
          (spaceCode ? seatLookup.bySpaceCode[String(spaceCode)] : undefined)
        const spaceId = seat?.spaceId || ''

        if (spaceId) nextMap[spaceId] = status
      }
      seatStatusMap.value = nextMap
      lastQueryTime.value = new Date().toLocaleString()
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '查询失败，请稍后重试'
    } finally {
      isQuerying.value = false
    }
  }

  watch(
    () => floor.value,
    () => {
      seatStatusMap.value = {}
    },
  )

  return {
    selectedDate,
    startTime,
    endTime,
    timeOptions,
    isQuerying,
    errorMessage,
    seatStatusMap,
    lastQueryTime,
    handleQuery,
  }
}
