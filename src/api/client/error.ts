import axios from 'axios'
import type { ApiErrorResponse } from '@/api/client/types'

// 统一错误消息提取
export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as ApiErrorResponse | undefined
    return responseData?.msg || error.message || '请求失败'
  }
  if (error instanceof Error) return error.message
  return '请求失败'
}
