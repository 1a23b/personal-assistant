# AI Vue3 模块化开发提示词文档

## 个人助手

> 📘 **使用说明**：本文档包含完整的模块化开发提示词，可直接复制发送给 AI 工具（Claude/ChatGPT/Cursor）进行开发

---

## 📋 使用指南

### 如何使用本文档

1. **按顺序开发**：从模块1开始，依次向下开发
2. **复制提示词**：将对应模块的提示词完整复制发送给 AI
3. **检查代码**：AI 生成代码后，检查是否符合规范
4. **运行测试**：确保功能正常后再进行下一个模块
5. **更新进度**：在文档底部标记已完成模块

### 开发环境信息

- **框架**：Vue 3.4 + TypeScript 5.0
- **构建工具**：Vite 5.0
- **样式方案**：Tailwind CSS 3.4
- **状态管理**：Pinia 2.1
- **路由**：Vue Router 4.2
- **HTTP 客户端**：Axios 1.6

---

## 🎯 模块 1: 项目初始化

### 提示词

```
请帮我初始化一个 Vue3 + TypeScript + Tailwind CSS 项目：

1. 使用 Vite 创建项目
   - 项目名称：algorithm-platform
   - 模板：vue-ts
   - 包管理器：npm

2. 安装必要依赖
   - vue-router@4
   - pinia
   - axios
   - @vueuse/core

3. 安装并配置 Tailwind CSS
   - tailwindcss
   - postcss
   - autoprefixer
   - 初始化配置文件

4. 安装开发依赖
   - unplugin-auto-import
   - unplugin-vue-components
   - @types/node

5. 创建项目目录结构
   src/
     ├── assets/
     ├── components/
     │   ├── common/
     │   ├── layout/
     │   └── business/
     ├── composables/
     ├── router/
     ├── services/
     ├── stores/
     ├── types/
     ├── utils/
     ├── views/
     ├── App.vue
     └── main.ts

6. 配置 Vite
   - 配置路径别名 @ 指向 src
   - 配置自动导入插件
   - 配置开发服务器代理

7. 配置 TypeScript
   - 严格模式
   - 路径别名

8. 配置 Tailwind
   - 扩展颜色系统
   - 扩展圆角
   - 扩展阴影
   - 添加动画

请按照以上要求初始化项目，并生成所有配置文件。
```

---

## 🎯 模块 2: TypeScript 类型定义

### 提示词

```
请在 src/types/ 目录下创建以下类型定义文件：

1. src/types/common.types.ts - 通用类型
   - ApiResponse<T>：API 响应类型
   - PaginationParams：分页参数
   - PaginationResponse<T>：分页响应

2. src/types/auth.types.ts - 认证相关类型
   - LoginRequest：登录请求
   - RegisterRequest：注册请求
   - LoginResponse：登录响应
   - User：用户信息

3. src/types/oj.types.ts - OJ 相关类型
   - OJBindRequest：OJ 绑定请求
   - OJBindResponse：OJ 绑定响应
   - OJUser：OJ 用户信息
   - LeaderboardItem：排行榜项

类型定义参考：

// common.types.ts
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// auth.types.ts
export interface LoginRequest {
  phone: string
  password: string
  captcha: string
  captchaId: string
}

export interface RegisterRequest {
  username: string
  phone: string
  password: string
  captcha: string
  captchaId: string
  orgId?: number
}

export interface LoginResponse {
  user: User
  accessToken: string
  accessTokenExpiresAt: number
}

export interface User {
  id: number
  username: string
  phone: string
  avatar?: string
  createdAt: string
}

// oj.types.ts
export interface OJBindRequest {
  platform: 'luogu' | 'leetcode'
  identifier: string
}

export interface OJBindResponse {
  platform: string
  identifier: string
  realName: string
  userAvatar: string
  passedNumber: number
  easyNumber: number
  mediumNumber: number
  hardNumber: number
  totalNumber: number
}

export interface OJUser {
  id: number
  userId: number
  platform: 'luogu' | 'leetcode'
  identifier: string
  realName: string
  userAvatar: string
  passedNumber: number
  easyNumber: number
  mediumNumber: number
  hardNumber: number
  totalNumber: number
  ranking?: number
  createdAt: string
}

export interface LeaderboardItem {
  rank: number
  userId: number
  username: string
  avatar: string
  passedNumber: number
  isCurrentUser: boolean
}
```

---

## 🎯 模块 3: 工具函数封装

### 提示词

```
请在 src/utils/ 目录下创建以下工具函数文件：

1. src/utils/request.ts - Axios 封装
   - 创建 axios 实例
   - 配置基础 URL
   - 请求拦截器（添加 Token）
   - 响应拦截器（统一错误处理、Token 刷新）
   - 导出类型化的请求方法

2. src/utils/storage.ts - 本地存储封装
   - setItem：存储数据
   - getItem：获取数据
   - removeItem：删除数据
   - clear：清空所有数据

3. src/utils/validate.ts - 验证函数
   - isPhone：验证手机号
   - isPassword：验证密码
   - isUsername：验证用户名

参考实现：

// request.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/common.types'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token 过期，清除本地存储
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient

// storage.ts
export const storage = {
  setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error('存储数据失败:', error)
    }
  },

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('读取数据失败:', error)
      return null
    }
  },

  removeItem(key: string): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    localStorage.clear()
  }
}

// validate.ts
export const validate = {
  isPhone(phone: string): boolean {
    return /^1[3-9]\d{9}$/.test(phone)
  },

  isPassword(password: string): boolean {
    return password.length >= 8 && password.length <= 16
  },

  isUsername(username: string): boolean {
    return username.length >= 2 && username.length <= 20
  }
}
```

---

## 🎯 模块 4: Service 层封装

### 提示词

```
请在 src/services/ 目录下创建 API 服务层：

1. src/services/api.ts
   - 导出 axios 实例

2. src/services/auth.service.ts - 认证服务
   - login：用户登录
   - register：用户注册
   - logout：用户登出
   - getCaptcha：获取验证码
   - refreshToken：刷新 Token

3. src/services/oj.service.ts - OJ 服务
   - bindOJ：绑定 OJ 账号
   - getOJData：获取 OJ 数据
   - getLeaderboard：获取排行榜

参考实现：

// auth.service.ts
import apiClient from './api'
import type { LoginRequest, LoginResponse, RegisterRequest } from './types'

export const authService = {
  /**
   * 用户登录
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/user/login', data)
      // 存储 Token
      localStorage.setItem('access_token', response.accessToken)
      return response
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '登录失败，请检查手机号和密码')
    }
  },

  /**
   * 用户注册
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/user/register', data)
      return response
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '注册失败，请稍后重试')
    }
  },

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/user/logout')
    } catch (error) {
      throw new Error('登出失败')
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  },

  /**
   * 获取验证码
   */
  async getCaptcha(): Promise<{ captchaId: string; picPath: string }> {
    try {
      const response = await apiClient.post('/base/captcha')
      return response
    } catch (error) {
      throw new Error('获取验证码失败')
    }
  }
}

// oj.service.ts
import apiClient from './api'
import type { OJBindRequest, OJBindResponse, LeaderboardItem } from './types'

export const ojService = {
  /**
   * 绑定 OJ 账号
   */
  async bindOJ(data: OJBindRequest): Promise<OJBindResponse> {
    try {
      const response = await apiClient.post<OJBindResponse>('/oj/bind', data)
      return response
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '绑定失败，请检查 ID 是否正确')
    }
  },

  /**
   * 获取排行榜
   */
  async getLeaderboard(platform: 'luogu' | 'leetcode'): Promise<LeaderboardItem[]> {
    try {
      const response = await apiClient.get<LeaderboardItem[]>(`/oj/leaderboard/${platform}`)
      return response
    } catch (error) {
      throw new Error('获取排行榜失败')
    }
  }
}
```

---

## 🎯 模块 5: Pinia 状态管理

### 提示词

```
请在 src/stores/ 目录下创建 Pinia stores：

1. src/stores/auth.ts - 认证状态
   - State：user, accessToken, isLoggedIn
   - Actions：login, register, logout, getUserInfo
   - Getters：isAuthenticated

2. src/stores/oj.ts - OJ 状态
   - State：luoguData, leetcodeData, leaderboard
   - Actions：bindOJ, getLeaderboard
   - Getters：hasLuoguData, hasLeetcodeData

参考实现：

// auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import type { LoginRequest, RegisterRequest, User } from '@/services/types'
import { storage } from '@/utils/storage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string>('')
  const refreshToken = ref<string>('')

  const isLoggedIn = computed(() => !!user.value && !!accessToken.value)

  async function login(data: LoginRequest) {
    try {
      const response = await authService.login(data)
      user.value = response.user
      accessToken.value = response.accessToken

      // 存储到本地
      storage.setItem('access_token', response.accessToken)
      storage.setItem('user', response.user)

      return response
    } catch (error: any) {
      throw error
    }
  }

  async function register(data: RegisterRequest) {
    try {
      const response = await authService.register(data)
      return response
    } catch (error: any) {
      throw error
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      user.value = null
      accessToken.value = ''
      refreshToken.value = ''
      storage.clear()
    }
  }

  function initAuth() {
    const storedUser = storage.getItem<User>('user')
    const storedToken = storage.getItem<string>('access_token')

    if (storedUser && storedToken) {
      user.value = storedUser
      accessToken.value = storedToken
    }
  }

  return {
    user,
    accessToken,
    isLoggedIn,
    login,
    register,
    logout,
    initAuth
  }
})

// oj.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ojService } from '@/services/oj.service'
import type { OJBindRequest, OJUser, LeaderboardItem } from '@/services/types'

export const useOJStore = defineStore('oj', () => {
  const luoguData = ref<OJUser | null>(null)
  const leetcodeData = ref<OJUser | null>(null)
  const leaderboard = ref<LeaderboardItem[]>([])

  const hasLuoguData = computed(() => !!luoguData.value)
  const hasLeetcodeData = computed(() => !!leetcodeData.value)

  async function bindOJ(data: OJBindRequest) {
    try {
      const response = await ojService.bindOJ(data)

      if (data.platform === 'luogu') {
        luoguData.value = response as any
      } else {
        leetcodeData.value = response as any
      }

      return response
    } catch (error: any) {
      throw error
    }
  }

  async function getLeaderboard(platform: 'luogu' | 'leetcode') {
    try {
      const data = await ojService.getLeaderboard(platform)
      leaderboard.value = data
      return data
    } catch (error: any) {
      throw error
    }
  }

  return {
    luoguData,
    leetcodeData,
    leaderboard,
    hasLuoguData,
    hasLeetcodeData,
    bindOJ,
    getLeaderboard
  }
})
```

---

## 🎯 模块 6: 路由配置

### 提示词

```
请在 src/router/ 目录下创建路由配置：

1. src/router/index.ts - 路由配置
   - 定义路由表
   - 配置路由守卫

2. src/router/guards.ts - 路由守卫
   - beforeEach：检查登录状态
   - afterEach：页面标题

路由配置：
- /login：登录页
- /register：注册页
- /：首页（需要认证）

参考实现：

// index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { setupRouterGuards } from './guards'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/LoginView.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Auth/RegisterView.vue'),
    meta: { title: '注册', requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/HomeView.vue'),
    meta: { title: '首页', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
}

setupRouterGuards(router)

export default router

// guards.ts
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupRouterGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    // 初始化认证状态
    authStore.initAuth()

    const requiresAuth = to.meta.requiresAuth !== false
    const isLoggedIn = authStore.isLoggedIn

    if (requiresAuth && !isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else if ((to.name === 'Login' || to.name === 'Register') && isLoggedIn) {
      next({ name: 'Home' })
    } else {
      next()
    }
  })

  router.afterEach((to) => {
    document.title = `${to.meta.title || '个人助手'}`
  })
}
```

---

## 🎯 模块 7: 公共组件

### 提示词

```
请在 src/components/common/ 目录下创建公共组件：

1. Button 组件
   - Props：type（primary/default/danger）, size, loading, disabled
   - Events：click
   - 使用 Tailwind 样式

2. Input 组件
   - Props：modelValue, placeholder, type, error
   - Events：update:modelValue
   - 支持双向绑定

3. Loading 组件
   - Props：size, text
   - 显示加载动画

4. Message 组件
   - 方法：success, error, warning, info
   - 全局调用

参考实现：

// Button.vue
<script setup lang="ts">
interface Props {
  type?: 'primary' | 'default' | 'danger'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const typeClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    default: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-error text-white hover:bg-red-600'
  }

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  }

  return `${base} ${typeClasses[props.type]} ${sizeClasses[props.size]}`
})
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <slot />
  </button>
</template>
```

---

## 🎯 模块 8: 登录页面

### 提示词

```
请创建 src/views/Auth/LoginView.vue 登录页面：

页面要求：
1. 轮播背景（4秒自动切换，淡入淡出）
2. 登录框居中显示，半透明白色背景
3. 表单字段：手机号、密码、验证码
4. 底部链接：切换到注册页
5. 使用 Pinia authStore 进行登录
6. 使用 Tailwind CSS 样式
7. 表单验证

参考 UI 文件：/Users/petrel/arithmetic-tool/UI交互预览.html

实现要点：
- 使用 Carousel 组件或 CSS 动画实现轮播
- 表单使用 Vee-Validate 验证
- 错误提示使用 Message 组件
- 登录成功后跳转到首页
```

---

## 🎯 模块 9: 注册页面

### 提示词

```
请创建 src/views/Auth/RegisterView.vue 注册页面：

页面要求：
1. 与登录页相同的轮播背景
2. 注册框居中显示，半透明白色背景
3. 表单字段：用户名、手机号、密码、验证码、组织选择
4. 底部链接：切换到登录页
5. 使用 Pinia authStore 进行注册
6. 使用 Tailwind CSS 样式
7. 表单验证

参考 UI 文件：/Users/petrel/arithmetic-tool/UI交互预览.html

实现要点：
- 复用登录页的轮播背景
- 组织选择使用下拉框
- 注册成功后自动登录并跳转首页
```

---

## 🎯 模块 10: 轮播背景组件

### 提示词

```
请创建 src/components/business/Carousel/BackgroundCarousel.vue 轮播背景组件：

组件要求：
1. 全屏背景，z-index: -1
2. 4秒自动切换，淡入淡出
3. 4张渐变背景图
4. 无控制按钮
5. 使用 CSS 动画或 Vue Transition

实现方案：
- 使用 CSS 动画实现自动轮播
- @keyframes fadeAnimation
- 组件自动运行，无需 props

参考实现：
```

---

## 🎯 模块 11: Header Bar 组件

### 提示词

```
请创建 src/components/layout/HeaderBar.vue 顶部导航栏组件：

组件要求：
1. 默认隐藏在顶部
2. 顶部居中有个小触发按钮（24×24px）
3. 鼠标悬停时，Header 从顶部滑入
4. 左侧文字：欢迎来到算法平台
5. 右侧用户菜单：头像 + 下拉箭头
6. 下拉菜单：个人中心、我的数据、设置、退出登录

交互细节：
- 使用 VueUse 的 onMouseEnter/onMouseLeave
- 滑入动画：300ms，ease-out
- 点击外部关闭下拉菜单

参考 UI 文件：/Users/petrel/arithmetic-tool/UI交互预览.html
```

---

## 🎯 模块 12: OJ 卡片组件

### 提示词

```
请创建 OJ 绑定卡片组件，支持3D翻转：

1. src/components/business/OJCard/LuoguCard.vue - 洛谷卡片
2. src/components/business/OJCard/LeetCodeCard.vue - 力扣卡片
3. src/components/business/OJCard/types.ts - 类型定义

组件要求：
- 正面：平台 Logo + 平台名称 + ID 输入框 + 提交按钮
- 反面：用户头像 + 真实姓名 + 通过题目数 + 难度分布 + 修改按钮
- 3D 翻转动画：600ms，ease-in-out
- 卡片高度：320px
- 点击"提交"自动翻转到反面
- 点击"修改"翻转到正面

技术要点：
- 使用 CSS transform: rotateY(180deg)
- backface-visibility: hidden
- perspective: 1000px
- transform-style: preserve-3d

参考 UI 文件：/Users/petrel/arithmetic-tool/UI交互预览.html
```

---

## 🎯 模块 13: 排行榜卡片组件

### 提示词

```
请创建 src/components/business/Leaderboard/LeaderboardCard.vue 排行榜卡片：

组件要求：
1. 双面翻转卡片
2. 正面：洛谷排行榜
3. 反面：力扣排行榜
4. 卡片高度：660px
5. 显示内容：排名、头像、姓名、题目数
6. Top 3 金银铜色
7. 当前用户高亮显示
8. 点击卡片切换正反面

数据格式：
- 使用 Pinia ojStore 的 leaderboard 数据
- 从 props 接收 platform 参数

滚动条美化：
- 宽度 6px
- 圆角 3px
- 自定义颜色

参考 UI 文件：/Users/petrel/arithmetic-tool/UI交互预览.html
```

---

## 🎯 模块 14: 首页布局

### 提示词

```
请创建 src/views/Home/HomeView.vue 首页：

页面要求：
1. 使用轮播背景组件
2. 使用 Header Bar 组件
3. 三个卡片垂直水平居中布局
   - 左上：洛谷卡片
   - 左下：力扣卡片
   - 右侧：排行榜卡片
4. 卡片间距：20px
5. 左侧卡片：560×320px
6. 右侧卡片：560×660px

布局方案：
- 使用 flex 布局实现居中
- 左侧使用 flex-direction: column
- 使用 grid 或 gap 设置间距

参考 UI 文件：/Users/petrel/arithmetic-tool/UI交互预览.html
```

---

## 🎯 模块 15: 主应用入口

### 提示词

```
请更新 src/App.vue 和 src/main.ts：

App.vue 要求：
- 使用 <router-view> 显示页面
- 全局样式
- 引入 Tailwind CSS

main.ts 要求：
- 引入 Vue
- 引入 Router
- 引入 Pinia
- 挂载应用

参考实现：

// App.vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import BackgroundCarousel from '@/components/business/Carousel/BackgroundCarousel.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
</script>

<template>
  <div class="min-h-screen">
    <BackgroundCarousel />
    <router-view />
  </div>
</template>

<style>
@import url('./assets/styles/main.css');
</style>

// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

---

## 🎯 模块 16: 环境变量配置

### 提示词

```
请创建环境变量配置文件：

1. .env.development - 开发环境
   VITE_API_BASE_URL=http://localhost:8080

2. .env.production - 生产环境
   VITE_API_BASE_URL=https://api.example.com

3. 更新 .env 类型定义
   在 src/env.d.ts 中添加环境变量类型

参考实现：

// env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 🎯 模块 17: 错误处理优化

### 提示词

```
请完善项目的错误处理：

1. utils/request.ts
   - 统一错误处理
   - Token 过期自动刷新
   - 网络错误提示

2. utils/errorHandler.ts
   - handleError 函数
   - 根据 error code 返回友好提示

3. components/common/ErrorBoundary.vue
   - 捕获组件错误
   - 显示错误信息

参考实现：

// errorHandler.ts
export interface ErrorHandlerOptions {
  showMessage?: boolean
  fallbackMessage?: string
}

export function handleError(error: any, options: ErrorHandlerOptions = {}) {
  const { showMessage = true, fallbackMessage = '操作失败，请稍后重试' } = options

  let message = fallbackMessage

  if (error.response) {
    message = error.response.data?.message || message
  } else if (error.message) {
    message = error.message
  }

  if (showMessage) {
    // 使用 Message 组件显示
    console.error(message)
  }

  return message
}
```

---

## 🎯 模块 18: 性能优化

### 提示词

```
请优化项目性能：

1. 路由懒加载
   - 使用 () => import() 动态导入

2. 组件懒加载
   - 使用 defineAsyncComponent

3. 图片优化
   - 使用 WebP 格式
   - 懒加载

4. 代码分割
   - Vite 自动分割
   - 第三方库单独打包

5. Tree Shaking
   - 按需导入
   - 使用 ES Module
```

---

## 🎯 模块 19: 单元测试

### 提示词

```
请为主要功能添加单元测试：

1. 安装测试依赖
   - vitest
   - @vue/test-utils
   - happy-dom

2. 测试工具函数
   - src/utils/__tests__/validate.test.ts

3. 测试 Composables
   - src/composables/__tests__/useAuth.test.ts

4. 测试组件
   - src/components/common/__tests__/Button.test.ts

5. 配置测试脚本
   - package.json
   - vitest.config.ts
```

---

## 🎯 模块 20: 构建与部署

### 提示词

```
请配置生产环境构建：

1. 更新 vite.config.ts
   - 生产环境优化
   - 代码压缩
   - 去除 console

2. 配置 base 路径
   - 根据部署环境调整

3. 生成 .gitignore
   - node_modules
   - dist
   - .env.local

4. 更新 package.json scripts
   - build
   - preview
   - lint
   - format

5. 编写 README.md
   - 项目介绍
   - 安装步骤
   - 运行命令
   - 环境变量说明
```

---

## 📊 开发进度追踪

### 模块完成情况

| 模块 | 名称                | 状态      | 完成日期 | 备注 |
| ---- | ------------------- | --------- | -------- | ---- |
| 1    | 项目初始化          | ⏳ 待开始 | -        | -    |
| 2    | TypeScript 类型定义 | ⏳ 待开始 | -        | -    |
| 3    | 工具函数封装        | ⏳ 待开始 | -        | -    |
| 4    | Service 层封装      | ⏳ 待开始 | -        | -    |
| 5    | Pinia 状态管理      | ⏳ 待开始 | -        | -    |
| 6    | 路由配置            | ⏳ 待开始 | -        | -    |
| 7    | 公共组件            | ⏳ 待开始 | -        | -    |
| 8    | 登录页面            | ⏳ 待开始 | -        | -    |
| 9    | 注册页面            | ⏳ 待开始 | -        | -    |
| 10   | 轮播背景组件        | ⏳ 待开始 | -        | -    |
| 11   | Header Bar 组件     | ⏳ 待开始 | -        | -    |
| 12   | OJ 卡片组件         | ⏳ 待开始 | -        | -    |
| 13   | 排行榜卡片组件      | ⏳ 待开始 | -        | -    |
| 14   | 首页布局            | ⏳ 待开始 | -        | -    |
| 15   | 主应用入口          | ⏳ 待开始 | -        | -    |
| 16   | 环境变量配置        | ⏳ 待开始 | -        | -    |
| 17   | 错误处理优化        | ⏳ 待开始 | -        | -    |
| 18   | 性能优化            | ⏳ 待开始 | -        | -    |
| 19   | 单元测试            | ⏳ 待开始 | -        | -    |
| 20   | 构建与部署          | ⏳ 待开始 | -        | -    |

**图例**：✅ 已完成 | 🔄 进行中 | ⏳ 待开始 | ❌ 有问题

---

## 🔧 快速开始

### 开发一个新模块的流程

1. **复制提示词**：从本文档复制对应模块的提示词
2. **发送给 AI**：粘贴到 Claude/ChatGPT/Cursor 等工具
3. **审查代码**：检查代码是否符合规范
4. **运行测试**：确保功能正常
5. **更新进度**：在上方进度表中标记完成状态

### 常见问题

**Q1: AI 生成的代码有类型错误怎么办？**
A: 检查是否使用了 `any` 类型，确保所有类型都明确定义

**Q2: 组件样式不正确怎么办？**
A: 检查 Tailwind 类名是否正确，参考 UI 文件调整

**Q3: API 请求失败怎么办？**
A: 检查后端服务是否启动，查看浏览器控制台错误信息

**Q4: 路由跳转不工作怎么办？**
A: 检查路由配置和路由守卫逻辑

---

## 📚 相关文档

- [项目说明书](./CLAUDE.md)
- [需求文档](./requirement.md)
- [UI 需求文档](./UI需求与优化记录.md)
- [后端 API 文档](./t.md)

---

**文档版本**：v1.0.0
**最后更新**：2025-01-18
**维护人**：Claude AI
