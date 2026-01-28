import { tokenApi } from '@/api/client'
import type { LoginPayload, LoginResponse } from '@/types/api'

// 认证模块：与登录/token 服务交互
export const fetchLoginToken = async (payload: LoginPayload) =>
  tokenApi.post<LoginResponse>('/', payload)
