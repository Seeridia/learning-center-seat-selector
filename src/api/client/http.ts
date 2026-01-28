import axios, { AxiosError, AxiosHeaders } from 'axios'
import { apiTimeout, seatBaseURL, tokenBaseURL } from '@/api/client/config'
import { getErrorMessage } from '@/api/client/error'

let seatToken = ''

// 外部调用：设置/清空座位系统 Token
export const setSeatApiToken = (token: string | null) => {
  seatToken = token?.trim() ?? ''
}

// 创建通用 Client
const createApiClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    timeout: apiTimeout,
  })

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(new Error(getErrorMessage(error))),
  )

  return client
}

export const seatApi = createApiClient(seatBaseURL)
export const tokenApi = createApiClient(tokenBaseURL)

// 仅 seatApi 需要注入 Token 请求头
seatApi.interceptors.request.use((config) => {
  if (seatToken) {
    const headers = config.headers
    if (headers && typeof (headers as AxiosHeaders).set === 'function') {
      ;(headers as AxiosHeaders).set('Token', seatToken)
    } else {
      config.headers = new AxiosHeaders({
        ...(headers || {}),
        Token: seatToken,
      })
    }
  }
  return config
})
