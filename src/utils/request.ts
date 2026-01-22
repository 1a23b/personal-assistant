/**
 * Axios 请求封装
 * 统一处理业务状态码、Token 刷新、消息提示
 */

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types'
import {
  StatusCode,
  isSuccessStatusCode,
  getFriendlyErrorMessage
} from '@/constants/status'
import { message } from '@/components/common'
/**
 * 自定义请求配置项
 */
export interface RequestConfig extends InternalAxiosRequestConfig {
  // ✅ 场景1：本次请求【完全静默】，成功/失败都不弹任何提示
  skipTip?: boolean
  // ✅ 场景2：失败不弹提示，成功正常提示
  skipErrTip?: boolean
  // ✅ 场景3：成功不弹提示，失败正常提示
  skipSuccTip?: boolean
  // ✅ 场景4：自定义失败提示文案
  customErrTip?: string
  // ✅ 场景5：自定义成功提示文案
  customSuccTip?: string
  // 内部使用：Token 刷新标记
  _retry?: boolean
}

// 配置对象类型（用于组件传递）
export type RequestOptions = Partial<Pick<RequestConfig, 'skipTip' | 'skipErrTip' | 'skipSuccTip' | 'customErrTip' | 'customSuccTip'>>

// 创建 Axios 实例
const apiClientRaw: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  withCredentials: true, // 携带 Cookie（用于 RefreshToken）
  headers: {
    'Content-Type': 'application/json',

  },
})

// 请求拦截器 - 添加 AccessToken
apiClientRaw.interceptors.request.use(
  (config) => {
    // 刷新 Token 接口不需要携带 AccessToken
    if (config.url?.includes('/refreshToken')) {
      console.log(`[请求11refresh] ${config.method?.toUpperCase()} ${config.url}`, { skipAccessToken: true })
      return config
    }

    // 从 localStorage 获取 AccessToken
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      console.log(`[请求] ${config.method?.toUpperCase()} ${config.url}`, { withAccessToken: true })
    } else {
      console.log(`[请求] ${config.method?.toUpperCase()} ${config.url}`, { withAccessToken: false })
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * 正在刷新 Token 的标记
 * 防止多个请求同时触发刷新
 */
let isRefreshing = false

/**
 * 等待刷新 Token 的请求队列
 */
let refreshQueue: Array<(token: string) => void> = []

/**
 * 从 Cookie 中获取指定名称的值
 */
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    console.log(`[Cookie] Found cookie ${name}:`, cookieValue ? cookieValue.substring(0, 20) + '...' : 'empty')
    return cookieValue || null
  }

  console.warn(`[Cookie] Cookie ${name} not found. Available cookies:`, document.cookie)
  return null
}

/**
 * 刷新 AccessToken
 * 从 Cookie 获取 x-refresh-token，通过请求体传递
 */
const refreshAccessToken = async (): Promise<string> => {
  interface RefreshTokenData {
    access_token: string
    access_token_expires_at: number
  }

  console.log('[Token Refresh] Starting refresh process')

  // 从 Cookie 中获取 x-refresh-token
  const refreshTokenValue = getCookie('x-refresh-token')

  if (!refreshTokenValue) {
    console.error('[Token Refresh] Available cookies:', document.cookie)
    throw new Error('x-refresh-token not found in Cookie')
  }

  console.log('[Token Refresh] Got refresh token from cookie:', refreshTokenValue.substring(0, 20) + '...')

  // 动态导入 service 函数，避免循环依赖
  const { refreshAccessTokenPost } = await import('@/services/auth.service')
  const response = await refreshAccessTokenPost(refreshTokenValue)

  // 处理响应数据
  const apiResponse = response.data as ApiResponse
  if (apiResponse.code !== 2000) {
    throw new Error(apiResponse.message || '刷新 Token 失败')
  }

  const { access_token, access_token_expires_at } = apiResponse.data as RefreshTokenData

  console.log('[Token Refresh] Got new access token:', access_token.substring(0, 20) + '...')

  localStorage.setItem('access_token', access_token)
  localStorage.setItem('access_token_expires_at', String(access_token_expires_at))

  return access_token
}

/**
 * 处理 Token 过期（code = 4010）
 * 尝试刷新 Token 并重试原请求
 */
const handleTokenExpired = async (_response: AxiosResponse, config: RequestConfig): Promise<any> => {
  // 如果已经重试过，直接退出登录
  if (config._retry) {
    console.log('❌ [Token刷新] 重试失败，退出登录')
    // await handleLogout()
    return Promise.reject(new Error('Token 刷新失败'))
  }

  // 标记为已重试
  config._retry = true

  // 如果正在刷新，将请求加入队列
  if (isRefreshing) {
    console.log('⏳ [Token刷新] 正在刷新中，加入队列...')
    return new Promise((resolve) => {
      refreshQueue.push((newToken: string) => {
        console.log('✅ [Token刷新] 队列请求获得新 token，开始重试')
        // 更新请求头
        if (config.headers) {
          config.headers.Authorization = `Bearer ${newToken}`
        }
        // 重试原请求 - 使用 request 方法
        resolve(apiClientRaw.request(config))
      })
    })
  }

  // 开始刷新 Token
  isRefreshing = true

  try {
    // 调用刷新接口
    console.log('📡 [Token刷新] 请求 /refreshToken 接口...')
    const newToken = await refreshAccessToken()

    // 刷新成功，处理队列中的请求
    console.log('✅ [Token刷新] 刷新成功，处理队列中的请求')
    refreshQueue.forEach((callback) => callback(newToken))
    refreshQueue = []

    // 更新当前请求的 Token
    if (config.headers) {
      config.headers.Authorization = `Bearer ${newToken}`
    }

    // 重试原请求 - 使用 request 方法
    console.log('🔄 [Token刷新] 使用新 token 重试原请求')
    return apiClientRaw.request(config)
  } catch (error) {
    // 刷新失败，清空队列并退出登录
    console.log('❌ [Token刷新] 刷新失败，退出登录', error)
    refreshQueue = []
    // await handleLogout()
    return Promise.reject(error)
  } finally {
    isRefreshing = false
  }
}

// 响应拦截器 - 统一处理业务状态码和 Token 刷新
const responseInterceptor = (
  response: AxiosResponse
): any => {
  const res = response.data as ApiResponse
  const config = response.config as RequestConfig

  // ===== 提取配置项，无配置则为 false/空 =====
  const { skipTip, skipSuccTip, skipErrTip, customSuccTip, customErrTip } = config

  // ✅ ========== 情况1：业务成功 (code=2000) ==========
  if (isSuccessStatusCode(res.code)) {
    console.log(`[响应] ${config.url}`, { status: 'success', code: res.code })
    // 判断是否需要弹【成功提示】
    if (!skipTip && !skipSuccTip) {
      // 优先级：自定义成功文案 > 后端 tip > 后端 message > 默认文案
      const succText = customSuccTip || res.tip || res.message || '操作成功'
      message.success(succText)
    }
    // ✅ 核心：成功直接返回业务数据，组件无需解包
    return res.data
  }

  // ✅ ========== 情况2：Token 过期 (code=4010) ==========
  // 短 token 失效，尝试用长 token 刷新
  if (res.code === StatusCode.UNAUTHORIZED) {
    console.log(`[响应] ${config.url}`, { status: 'token_expired' })
    // 判断是否应该触发 Token 刷新：
    // 1. 排除登录接口（账号密码/验证码错误也会返回 4010）
    // 2. 排除注册接口
    // 3. 排除 refreshToken 接口本身
    // 4. 必须已登录（有 AccessToken）
    const shouldRefreshToken =
      !config.url?.includes('/user/login') &&
      !config.url?.includes('/user/register') &&
      !config.url?.includes('/refreshToken') &&
      !!localStorage.getItem('access_token')

    if (shouldRefreshToken) {
      console.log('🔄 [Token刷新] 开始刷新 access_token...')
      // 触发 Token 刷新流程
      return handleTokenExpired(response, config)
    }

    // 如果是 refreshToken 接口本身返回 4010，说明长 token 也失效了，直接退出登录
    if (config.url?.includes('/refreshToken')) {
      console.log('❌ [RefreshToken] refresh_token 已过期，退出登录')
      // handleLogout()
      return Promise.reject(new Error('RefreshToken 已失效，请重新登录'))
    }
  }

  // ✅ ========== 情况3：其他业务失败 (code≠2000 且 code≠4010) ==========
  // 五层提示优先级：【自定义失败文案】>【后端tip】>【前端预设友好文案】>【后端message】>【默认文案】
  const errText = customErrTip || getFriendlyErrorMessage(res.code, res.tip, res.message)

  // 判断是否需要弹【失败提示】
  if (!skipTip && !skipErrTip) {
    // 403 权限问题用 warning，其他用 error，体验更好
    if (res.code === StatusCode.FORBIDDEN) {
      message.warning(errText)
    } else {
      message.error(errText)
    }
  }

  // 所有失败都返回 Promise.reject，组件可 catch 捕获
  return Promise.reject(res)
}

// HTTP 错误处理拦截器
const errorInterceptor = async (
  error: AxiosError<ApiResponse>
): Promise<any> => {
  const originalRequest = error.config as RequestConfig

  // HTTP 层面的错误（网络错误、超时、404、500 等）
  const config = originalRequest

  // 判断是否需要弹【失败提示】
  if (!config?.skipTip && !config?.skipErrTip) {
    const errText =
      config?.customErrTip ||
      error.response?.data?.message ||
      error.message ||
      '网络请求失败，请稍后重试'
    message.error(errText)
  }

  return Promise.reject(error)
}

// ✅ 使用类型断言来设置响应拦截器，绕过 TypeScript 类型检查
(apiClientRaw.interceptors.response.use as any)(responseInterceptor, errorInterceptor)

/**
 * 类型安全的 API 客户端包装器
 * 支持自定义请求配置项（skipTip, skipErrTip 等）
 */
const apiClient = {
  get<T = any>(url: string, config?: RequestOptions): Promise<T> {
    return apiClientRaw.get(url, config as any)
  },
  post<T = any>(url: string, data?: any, config?: RequestOptions): Promise<T> {
    return apiClientRaw.post(url, data, config as any)
  },
  put<T = any>(url: string, data?: any, config?: RequestOptions): Promise<T> {
    return apiClientRaw.put(url, data, config as any)
  },
  delete<T = any>(url: string, config?: RequestOptions): Promise<T> {
    return apiClientRaw.delete(url, config as any)
  },
  patch<T = any>(url: string, data?: any, config?: RequestOptions): Promise<T> {
    return apiClientRaw.patch(url, data, config as any)
  },
}

export default apiClient

