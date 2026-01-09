import { seatApi } from './http'
import type {
  AddSpaceAppointPayload,
  ReservationHistoryPayload,
  ReservationHistoryResponse,
  SeatApiResponse,
  SeatQueryPayload,
} from '@/types/api'

export const queryStationStatusByTime = async (payload: SeatQueryPayload, token: string) =>
  seatApi.post<SeatApiResponse>('/spaceAppoint/app/queryStationStatusByTime', payload, {
    headers: {
      Token: token,
    },
  })

export const addSpaceAppoint = async (payload: AddSpaceAppointPayload, token: string) =>
  seatApi.post<SeatApiResponse>('/spaceAppoint/app/addSpaceAppoint', payload, {
    headers: {
      Token: token,
    },
  })

export const queryMyAppoint = async (payload: ReservationHistoryPayload, token: string) =>
  seatApi.post<ReservationHistoryResponse>('/spaceAppoint/app/queryMyAppoint', payload, {
    headers: {
      Token: token,
    },
  })
