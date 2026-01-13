import { tokenApi } from '@/api/http'
import type { LoginPayload, LoginResponse } from '@/types/api'

export const fetchLoginToken = async (payload: LoginPayload) =>
  tokenApi.post<LoginResponse>('/', payload)
