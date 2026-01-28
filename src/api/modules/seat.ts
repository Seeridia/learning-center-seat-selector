import { seatApi } from '@/api/client'
import type {
  AddSpaceAppointPayload,
  ReservationHistoryPayload,
  ReservationHistoryResponse,
  SeatApiResponse,
  SeatQueryPayload,
} from '@/types/api'

// 业务模块：座位相关接口
export const queryStationStatusByTime = async (payload: SeatQueryPayload) =>
  seatApi.post<SeatApiResponse>('/spaceAppoint/app/queryStationStatusByTime', payload)

export const addSpaceAppoint = async (payload: AddSpaceAppointPayload) =>
  seatApi.post<SeatApiResponse>('/spaceAppoint/app/addSpaceAppoint', payload)

export const queryMyAppoint = async (payload: ReservationHistoryPayload) =>
  seatApi.post<ReservationHistoryResponse>('/spaceAppoint/app/queryMyAppoint', payload)
