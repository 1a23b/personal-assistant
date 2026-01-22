/**
 * 路由相关类型定义
 */

import type { RouteRecordRaw } from 'vue-router'

// 扩展路由元信息
declare module 'vue-router' {
  interface RouteMeta extends Record<string, unknown> {
    title?: string
    requiresAuth?: boolean
    hideInMenu?: boolean
    icon?: string
    order?: number
  }
}

export const routes: RouteRecordRaw[] = []
