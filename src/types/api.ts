export type SeatQueryPayload = {
  beginTime: string
  endTime: string
  floorLike: string
  parentId: number | null
  region: number
}

export type AddSpaceAppointPayload = {
  spaceId: string
  beginTime: string
  endTime: string
  date: string
}

export type SeatApiResponse = {
  code: string
  msg: string
  dataList?: unknown
}

export type ReservationHistoryPayload = {
  currentPage: number
  pageSize: number
  auditStatus?: string
  spaceName?: string
}

export type ReservationHistoryRecord = {
  id: number
  date: string
  beginTime: string
  endTime: string
  region?: string
  regionName?: string
  floor?: number
  spaceId?: number
  spaceName?: string
  seatCode?: string
  applyUser?: string
  userName?: string
  campusNumber?: string
  spaceType?: number
  auditStatus?: number | string
  auditTime?: string
  sign?: boolean
  endAppointmentTime?: string
  appointmentType?: number
}

export type ReservationHistoryResponse = {
  code: string
  msg: string
  dataList?: ReservationHistoryRecord[]
  pageIndex?: number
  pageSize?: number
  currentPage?: number
  total?: number
}

export type LoginPayload = {
  username: string
  password: string
}

export type LoginResponse = {
  token?: string
}
