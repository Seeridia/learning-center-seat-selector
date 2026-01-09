import type { SeatData, SeatLookup, SeatRecord } from '@/types/seat'

const seatDataCache: Record<string, Promise<SeatData>> = {}
const seatLookupCache: Record<string, Promise<SeatLookup>> = {}

export const loadSeatData = async (floor: '4F' | '5F'): Promise<SeatData> => {
  if (!seatDataCache[floor]) {
    seatDataCache[floor] = import(`@/assets/map/${floor}.json`).then(
      (module) => module.default as SeatData,
    )
  }
  return seatDataCache[floor]
}

export const loadSeatLookup = async (floor: '4F' | '5F'): Promise<SeatLookup> => {
  if (!seatLookupCache[floor]) {
    seatLookupCache[floor] = loadSeatData(floor).then((data) => {
      const bySpaceName: Record<string, SeatRecord> = {}
      const bySpaceCode: Record<string, SeatRecord> = {}
      const byMapName: Record<string, SeatRecord> = {}
      const bySpaceId: Record<string, SeatRecord> = {}

      for (const seat of data.seats) {
        if (seat.spaceName) bySpaceName[seat.spaceName] = seat
        if (seat.spaceCode) bySpaceCode[seat.spaceCode] = seat
        if (seat.mapName) byMapName[seat.mapName] = seat
        if (seat.spaceId) bySpaceId[seat.spaceId] = seat
      }

      return {
        bySpaceName,
        bySpaceCode,
        byMapName,
        bySpaceId,
      }
    })
  }
  return seatLookupCache[floor]
}
