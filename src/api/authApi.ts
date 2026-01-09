import { tokenApi } from './http'
import type { LoginPayload, LoginResponse } from '@/types/api'

export const fetchLoginToken = async (payload: LoginPayload) =>
  tokenApi.post<LoginResponse>('/', payload)
