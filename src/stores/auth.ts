/**
 * 认证状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { login as loginApi, logout as logoutApi } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const accessToken = ref<string>('')
  const accessTokenExpiresAt = ref<number>(0)
  const refreshToken = ref<string>('')

  // 计算属性
  const isLoggedIn = computed(() => !!user.value && !!accessToken.value)
  const isTokenExpired = computed(() => {
    if (!accessTokenExpiresAt.value) return true
    return Date.now() > accessTokenExpiresAt.value
  })

  /**
   * 设置用户信息
   */
  const setUser = (userData: User) => {
    user.value = userData
    // 持久化到 localStorage
    localStorage.setItem('user', JSON.stringify(userData))
  }

  /**
   * 设置 Token
   */
  const setToken = (token: string, expiresAt: number) => {
    accessToken.value = token
    accessTokenExpiresAt.value = expiresAt
    // 持久化到 localStorage
    localStorage.setItem('access_token', token)
    localStorage.setItem('access_token_expires_at', String(expiresAt))
  }

  /**
   * 设置 RefreshToken
   */
  const setRefreshToken = (token: string) => {
    refreshToken.value = token
    // 持久化到 localStorage
    localStorage.setItem('refresh_token', token)
  }

  /**
   * 登录
   * @param phone 手机号
   * @param password 密码
   * @param captcha 验证码
   * @param captchaId 验证码ID
   * @param config 自定义请求配置（可选）
   */
  const login = async (
    phone: string,
    password: string,
    captcha: string,
    captchaId: string,
    config?: any
  ) => {
    // ✅ 优化：API 直接返回业务数据，无需判断 code 和解包
    const { user: userData, access_token, access_token_expires_at, refresh_token } = await loginApi(
      { phone, password, captcha, captcha_id: captchaId },
      config
    )

    setUser(userData)
    setToken(access_token, access_token_expires_at)

    // 如果响应体中有 refresh_token，存储到 localStorage
    if (refresh_token) {
      setRefreshToken(refresh_token)
      console.log('[Auth Login] refresh_token from response body')
    } else {
      // 否则检查 Cookie
      console.log('[Auth Login] Checking cookies for refresh_token...')
      console.log('[Auth Login] document.cookie:', document.cookie)
      const cookieToken = document.cookie.match(/(?:^|; )x-refresh-token=([^;]*)/)
      if (cookieToken) {
        console.log('[Auth Login] Found x-refresh-token in cookie')
      } else {
        console.warn('[Auth Login] No refresh_token found in response body or cookie')
      }
    }

    return { success: true }
  }

  /**
   * 登出
   * @param config 自定义请求配置（可选）
   */
  const logout = async (config?: any) => {
    try {
      // 调用后端登出接口（将RefreshToken加入黑名单）
      await logoutApi({
        skipSuccTip: true, // 成功不弹提示，由调用方处理
        skipErrTip: true, // 失败不弹提示，因为无论如何都会清除本地状态
        ...config
      })
    } catch (error) {
      // 即使后端接口失败，也要清除本地状态
      // 静默处理，不抛出错误
    } finally {
      // 无论后端接口成功与否，都清除本地认证信息
      clearAuth()
    }
  }

  /**
   * 清除认证信息
   */
  const clearAuth = () => {
    user.value = null
    accessToken.value = ''
    accessTokenExpiresAt.value = 0
    refreshToken.value = ''

    // 清除 localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('access_token_expires_at')
    localStorage.removeItem('refresh_token')
  }

  /**
   * 从 localStorage 恢复认证信息
   */
  const restoreAuth = () => {
    try {
      const userStr = localStorage.getItem('user')
      const token = localStorage.getItem('access_token')
      const expiresAt = localStorage.getItem('access_token_expires_at')
      const refreshTkn = localStorage.getItem('refresh_token')

      if (userStr && token && expiresAt) {
        user.value = JSON.parse(userStr)
        accessToken.value = token
        accessTokenExpiresAt.value = Number(expiresAt)
        refreshToken.value = refreshTkn || ''

        // 如果 Token 已过期，清除认证信息
        if (isTokenExpired.value) {
          clearAuth()
        }
      }
    } catch (error) {
      // 恢复失败，清除可能损坏的数据
      clearAuth()
    }
  }

  /**
   * 检查 Token 是否即将过期（提前5分钟）
   */
  const checkTokenExpiring = () => {
    if (!accessTokenExpiresAt.value) return false
    const fiveMinutes = 5 * 60 * 1000
    return Date.now() + fiveMinutes > accessTokenExpiresAt.value
  }

  return {
    // 状态
    user,
    accessToken,
    accessTokenExpiresAt,
    refreshToken,

    // 计算属性
    isLoggedIn,
    isTokenExpired,

    // 方法
    setUser,
    setToken,
    setRefreshToken,
    login,
    logout,
    clearAuth,
    restoreAuth,
    checkTokenExpiring
  }
})
