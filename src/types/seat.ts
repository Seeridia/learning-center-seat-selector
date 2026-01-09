export type SeatPosition = {
  x: number
  y: number
}

export type SeatRecord = {
  spaceName: string
  spaceId: string
  spaceCode: string
  mapName: string
  position: SeatPosition
}

export type SeatData = {
  seats: SeatRecord[]
}

export type SeatLookup = {
  bySpaceName: Record<string, SeatRecord>
  bySpaceCode: Record<string, SeatRecord>
  byMapName: Record<string, SeatRecord>
  bySpaceId: Record<string, SeatRecord>
}
