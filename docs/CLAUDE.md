# 个人助手 - 项目说明书

> 📘 **Claude AI 开发指南** - 本文档为 AI 助手提供完整的项目上下文和开发规范

---

## 📋 项目概述

### 项目信息

| 属性         | 值                                |
| ------------ | --------------------------------- |
| **项目名称** | 个人助手                          |
| **项目类型** | Web 应用 (算法学习管理系统)       |
| **开发阶段** | 从 0 到 1 开发                    |
| **技术栈**   | Vue 3 + TypeScript + Tailwind CSS |
| **开发模式** | 模块化开发，AI 辅助编码           |

### 项目简介

这是一个面向教育机构的个人助手，主要功能包括：

- 学生注册/登录系统
- OJ（Online Judge）账号绑定（洛谷、力扣）
- 刷题数据自动同步
- 算法排行榜展示
- 个人学习进度可视化

### 核心价值

- **对学生**：可视化学习成果，与同学良性竞争
- **对教师**：实时掌握全班学习进度，降低管理成本
- **对机构**：沉淀教学数据资产，提升管理效率

---

## 🎯 UI 设计参考

### 设计文件

- **UI 原型**：`./UI交互预览.html`
- **UI 需求文档**：`./UI需求与优化记录.md`

### 页面结构

#### 1. 登录/注册页面

- **轮播背景**：4秒自动切换，淡入淡出
  - 使用 `<img>` 标签显示图片
  - 开发阶段可用渐变色代替
  - 无控制按钮（无左右箭头、无指示器点）
- **登录框**：居中显示，半透明白色背景
- **表单切换**：底部文字链接切换登录/注册

#### 2. 首页（登录后）

- **Header Bar**：默认隐藏，顶部小按钮触发显示
- **卡片布局**：三个卡片垂直水平居中
  - 左上：洛谷绑定卡片（320px高）
  - 左下：力扣绑定卡片（320px高）
  - 右侧：排行榜卡片（660px高）
- **卡片翻转**：3D翻转动画，正面输入，反面展示数据

### 设计规范

```typescript
// 颜色系统
const colors = {
  primary: "#1890FF", // 品牌蓝
  success: "#52C41A", // 成功绿
  warning: "#FAAD14", // 警告橙
  error: "#F5222D", // 错误红
  text: {
    primary: "#262626", // 主要文字
    secondary: "#595959", // 次要文字
    tertiary: "#8C8C8C", // 辅助文字
  },
  border: "#D9D9D9",
  background: "#F5F5F5",
};

// 字体大小
const fontSize = {
  h1: "24px",
  h2: "18px",
  h3: "16px",
  body: "14px",
  caption: "12px",
};

// 圆角
const borderRadius = {
  card: "12px",
  button: "6px",
  input: "6px",
};

// 阴影
const shadow = {
  card: "0 2px 8px rgba(0,0,0,0.08)",
  hover: "0 4px 16px rgba(0,0,0,0.12)",
};
```

---

## 🛠️ 技术栈

### 前端框架

- **Vue 3.4+**：Composition API
- **TypeScript 5.0+**：严格类型检查
- **Vite 5.0+**：构建工具

### UI 框架

- **Tailwind CSS 3.4+**：原子化 CSS
- **Headless UI**：无样式组件库（可选）

### 状态管理

- **Pinia 2.1+**：Vue 官方状态管理

### 路由

- **Vue Router 4.2+**：单页应用路由

### HTTP 客户端

- **Axios 1.6+**：HTTP 请求库

### 数据缓存

- **Pinia Persist**：状态持久化

### 表单验证

- **Vee-Validate 4.12+**：表单验证
- **Yup**：Schema 验证

---

## 📁 项目结构

```
algorithm-platform/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/              # 静态资源
│   │   ├── images/
│   │   └── styles/
│   ├── components/          # 公共组件
│   │   ├── common/         # 通用组件
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── Loading/
│   │   ├── layout/         # 布局组件
│   │   │   ├── HeaderBar.vue
│   │   │   └── PageLayout.vue
│   │   └── business/       # 业务组件
│   │       ├── OJCard/
│   │       │   ├── LuoguCard.vue
│   │       │   ├── LeetCodeCard.vue
│   │       │   └── types.ts
│   │       ├── Leaderboard/
│   │       │   ├── LeaderboardCard.vue
│   │       │   └── types.ts
│   │       └── Carousel/
│   │           └── BackgroundCarousel.vue
│   ├── composables/        # 组合式函数
│   │   ├── useAuth.ts
│   │   ├── useOJBinding.ts
│   │   └── useCarousel.ts
│   ├── router/             # 路由配置
│   │   ├── index.ts
│   │   └── guards.ts
│   ├── services/           # API 服务层
│   │   ├── api.ts          # API 基础配置
│   │   ├── auth.service.ts
│   │   ├── oj.service.ts
│   │   └── types.ts
│   ├── stores/             # Pinia 状态管理
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── oj.ts
│   ├── types/              # 全局类型定义
│   │   ├── auth.types.ts
│   │   ├── oj.types.ts
│   │   └── common.types.ts
│   ├── utils/              # 工具函数
│   │   ├── request.ts     # Axios 封装
│   │   ├── storage.ts     # 本地存储
│   │   ├── validate.ts    # 验证函数
│   │   └── format.ts      # 格式化函数
│   ├── views/              # 页面组件
│   │   ├── Auth/
│   │   │   ├── LoginView.vue
│   │   │   └── RegisterView.vue
│   │   └── Home/
│   │       └── HomeView.vue
│   ├── App.vue
│   └── main.ts
├── .env.development        # 开发环境变量
├── .env.production         # 生产环境变量
├── .eslintrc.cjs           # ESLint 配置
├── .prettierrc             # Prettier 配置
├── index.html
├── package.json
├── tailwind.config.js      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── vite.config.ts          # Vite 配置
```

---

## 📐 代码规范

### 命名规范

#### 文件命名

```
组件文件：PascalCase.vue        例：UserProfile.vue
工具文件：camelCase.ts          例：formatDate.ts
类型文件：camelCase.types.ts   例：user.types.ts
样式文件：camelCase.module.css  例：card.module.css
```

#### 变量命名

```typescript
// 组件名：PascalCase
const UserProfile: Component = ...

// 函数名：camelCase
function fetchUserData() {}
const handleSubmit = () => {}

// 常量：UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'

// 接口/类型：PascalCase
interface UserInfo {}
type UserRole = 'student' | 'teacher'

// 布尔值：is/has/should 前缀
const isLoading = false
const hasError = true
const shouldUpdate = true
```

### 组件规范

#### 组件定义

```vue
<script setup lang="ts">
// 1. 导入依赖
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

// 2. 定义 Props（withDefaults）
interface Props {
  title: string;
  count?: number;
}
const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

// 3. 定义 Emits
interface Emits {
  (e: "update", value: string): void;
  (e: "delete", id: number): void;
}
const emit = defineEmits<Emits>();

// 4. 响应式数据
const isLoading = ref(false);
const dataList = ref<Item[]>([]);

// 5. 计算属性
const totalCount = computed(() => dataList.value.length);

// 6. 方法
const fetchData = async () => {
  try {
    isLoading.value = true;
    // API 调用
  } catch (error) {
    console.error("获取数据失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 7. 生命周期
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<style scoped lang="scss">
/* 使用 Tailwind 类，复杂动画用 CSS */
</style>
```

### TypeScript 规范

#### 类型定义

```typescript
// ✅ 推荐：明确的类型定义
interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "teacher";
}

// ❌ 禁止：使用 any
const data: any = fetchData();

// ✅ 推荐：泛型使用
function fetchData<T>(url: string): Promise<T> {
  return axios.get<T>(url);
}

// ✅ 推荐：联合类型
type Status = "pending" | "success" | "error";

// ✅ 推荐：枚举
enum UserRole {
  Student = "student",
  Teacher = "teacher",
}
```

### API 请求规范

#### 核心原则

**重要**：

1. ✅ **Service 层只负责纯 API 调用**，不处理业务逻辑
2. ✅ **401 错误统一在 axios 拦截器中处理**（自动刷新 Token）
3. ✅ **业务逻辑在页面/组件中处理**（错误提示、跳转、状态更新）
4. ❌ **禁止在 Service 中使用 `try-catch` 包装业务逻辑**

#### Axios 封装（utils/request.ts）

```typescript
// utils/request.ts
import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponse } from "@/types/common.types";

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const { response, config } = error;

    // 401 错误统一处理：自动刷新 Token
    if (response?.status === 401 && !config?._retry) {
      config._retry = true;

      try {
        // 调用刷新 Token 接口
        const refreshResponse = await axios.get(
          `${apiClient.defaults.baseURL}/refreshToken`,
          {
            withCredentials: true, // 允许携带 Cookie
          },
        );

        const { access_token, access_token_expires_at } =
          refreshResponse.data.data;

        // 更新本地 Token
        localStorage.setItem("access_token", access_token);

        // 更新请求头
        if (config.headers) {
          config.headers.Authorization = `Bearer ${access_token}`;
        }

        // 重试原请求
        return apiClient(config);
      } catch (refreshError) {
        // 刷新失败，清除本地存储，跳转登录页
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 其他错误直接抛出
    return Promise.reject(error);
  },
);

export default apiClient;
```

#### Service 层规范

**Service 层职责**：

- ✅ 调用 API 接口
- ✅ 返回类型化的数据
- ❌ **不处理错误**（让错误抛出到页面/组件）
- ❌ **不显示提示信息**（Message/Toast 在页面中处理）
- ❌ **不跳转路由**（路由跳转在页面中处理）
- ❌ **不更新状态**（状态更新在 Pinia store 中处理）

```typescript
// services/auth.service.ts
import apiClient from "@/utils/request";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  CaptchaResponse,
} from "./types";

/**
 * 认证服务
 * Service 层只负责 API 调用，不处理业务逻辑
 */
export const authService = {
  /**
   * 用户登录
   * @param data 登录信息
   * @returns Promise<LoginResponse>
   */
  login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse, ApiResponse<LoginResponse>>(
      "/user/login",
      data,
    );
  },

  /**
   * 用户注册
   * @param data 注册信息
   * @returns Promise<LoginResponse>
   */
  register(data: RegisterRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse, ApiResponse<LoginResponse>>(
      "/user/register",
      data,
    );
  },

  /**
   * 用户登出
   * @returns Promise<void>
   */
  logout(): Promise<void> {
    return apiClient.post<void, ApiResponse<void>>("/user/logout");
  },

  /**
   * 获取验证码
   * @returns Promise<CaptchaResponse>
   */
  getCaptcha(): Promise<CaptchaResponse> {
    return apiClient.post<CaptchaResponse, ApiResponse<CaptchaResponse>>(
      "/base/captcha",
    );
  },
};

// services/oj.service.ts
import apiClient from "@/utils/request";
import type { OJBindRequest, OJBindResponse, LeaderboardItem } from "./types";

/**
 * OJ 服务
 * Service 层只负责 API 调用，不处理业务逻辑
 */
export const ojService = {
  /**
   * 绑定 OJ 账号
   * @param data OJ 绑定信息
   * @returns Promise<OJBindResponse>
   */
  bindOJ(data: OJBindRequest): Promise<OJBindResponse> {
    return apiClient.post<OJBindResponse, ApiResponse<OJBindResponse>>(
      "/oj/bind",
      data,
    );
  },

  /**
   * 获取排行榜
   * @param platform 平台名称
   * @returns Promise<LeaderboardItem[]>
   */
  getLeaderboard(platform: "luogu" | "leetcode"): Promise<LeaderboardItem[]> {
    return apiClient.get<LeaderboardItem[], ApiResponse<LeaderboardItem[]>>(
      `/oj/leaderboard/${platform}`,
    );
  },
};

// services/org.service.ts
import apiClient from "@/utils/request";
import type { OrgListResponse, OrgListParams } from "./types";

/**
 * 组织服务
 */
export const orgService = {
  /**
   * 获取组织列表
   * @param params 分页参数
   * @returns Promise<OrgListResponse>
   */
  getList(params?: OrgListParams): Promise<OrgListResponse> {
    return apiClient.get<OrgListResponse, ApiResponse<OrgListResponse>>(
      "/org/list",
      { params },
    );
  },
};
```

#### 在页面/组件中处理业务逻辑

```typescript
// ❌ 错误：在 Service 中处理业务逻辑
export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/user/login', data)
      Message.success('登录成功')  // ❌ 不在这里处理
      router.push('/home')          // ❌ 不在这里跳转
      return response
    } catch (error) {
      Message.error('登录失败')    // ❌ 不在这里提示
      throw error
    }
  }
}

// ✅ 正确：在页面中处理业务逻辑
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth'
import { Message } from '@/utils/message'  // 假设有 Message 工具

const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async (data: LoginRequest) => {
  try {
    // Service 层只负责 API 调用
    const response = await authService.login(data)

    // 业务逻辑在页面中处理
    authStore.setUser(response.user)
    authStore.setToken(response.access_token)

    Message.success('登录成功')
    router.push('/home')
  } catch (error: any) {
    // 错误处理在页面中处理
    const message = error.response?.data?.message || '登录失败，请检查手机号和密码'
    Message.error(message)
  }
}
</script>
```

### Tailwind CSS 规范

```vue
<template>
  <!-- ✅ 推荐：使用 Tailwind 工具类 -->
  <div
    class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
  >
    <h2 class="text-lg font-semibold text-gray-900">标题</h2>
    <button
      class="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      按钮
    </button>
  </div>

  <!-- ❌ 避免：内联样式 -->
  <div style="display: flex; padding: 16px;">...</div>
</template>

<!-- 对于复杂动画，使用 CSS Modules -->
<style scoped lang="scss">
@keyframes flip {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(180deg);
  }
}

.flip-card {
  animation: flip 0.6s ease-in-out;
}
</style>
```

---

## 🔐 类型定义

### 核心类型

```typescript
// types/auth.types.ts
export interface LoginRequest {
  phone: string;
  password: string;
  captcha: string;
  captchaId: string;
}

export interface RegisterRequest {
  username: string;
  phone: string;
  password: string;
  captcha: string;
  captchaId: string;
  orgId?: number;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  accessTokenExpiresAt: number;
}

export interface User {
  id: number;
  username: string;
  phone: string;
  avatar?: string;
  createdAt: string;
}

// types/oj.types.ts
export interface OJBindRequest {
  platform: "luogu" | "leetcode";
  identifier: string;
}

export interface OJBindResponse {
  platform: string;
  identifier: string;
  realName: string;
  userAvatar: string;
  passedNumber: number;
  easyNumber: number;
  mediumNumber: number;
  hardNumber: number;
  totalNumber: number;
}

export interface OJUser {
  id: number;
  userId: number;
  platform: "luogu" | "leetcode";
  identifier: string;
  realName: string;
  userAvatar: string;
  passedNumber: number;
  easyNumber: number;
  mediumNumber: number;
  hardNumber: number;
  totalNumber: number;
  ranking?: number;
  createdAt: string;
}

export interface LeaderboardItem {
  rank: number;
  userId: number;
  username: string;
  avatar: string;
  passedNumber: number;
  isCurrentUser: boolean;
}

// types/common.types.ts
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

## 📡 后端 API 接口文档

### 基础信息

**基础URL**: `http://localhost:8080`

**统一响应格式**:

```typescript
interface ApiResponse<T = any> {
  code: number; // 状态码
  message: string; // 响应消息
  data: T; // 响应数据
}
```

**认证方式**:

- JWT Token（放在 HTTP Header 中）：`Authorization: Bearer <access_token>`
- RefreshToken（自动存储在 HttpOnly Cookie 中）

**状态码说明**:
| 状态码 | 说明 |
|--------|------|
| 2000 | 操作成功 |
| 4000 | 请求参数错误 |
| 4010 | 未授权（未登录或 Token 无效） |
| 4011 | Token 已过期 |
| 4012 | Token 格式错误 |
| 4013 | Token 无效 |
| 4014 | 用户不存在 |
| 4015 | 用户已被冻结 |
| 4230 | 禁止访问（权限不足） |
| 4290 | 请求过于频繁（限流） |
| 5000 | 服务器内部错误 |

---

### 公共接口（无需认证）

#### 1. 获取验证码

**接口路径**: `POST /base/captcha`

**接口作用**: 生成图形验证码，用于注册、登录等操作

**请求参数**: 无

**返回参数**:

```typescript
{
  code: 2000,
  message: "验证码生成成功",
  data: {
    captcha_id: string      // 验证码 ID
    pic_path: string        // 验证码图片的 base64 编码
  }
}
```

---

#### 2. 用户注册

**接口路径**: `POST /user/register`

**接口作用**: 新用户注册，注册成功后自动登录

**请求参数**:

```typescript
{
  username: string         // 用户名（必填，最大 20 位）
  password: string         // 密码（必填，8-16 位）
  phone: string            // 手机号（必填，11 位）
  captcha: string          // 图形验证码（必填，6 位）
  captcha_id: string       // 图形验证码 ID（必填）
  org_id?: number          // 组织 ID（可选）
}
```

**返回参数**:

```typescript
{
  code: 2000,
  message: "登录成功",
  data: {
    user: {
      id: number
      uuid: string
      username: string
      phone: string
      email: string
      avatar: string
      address: string
      signature: string
      freeze: boolean
      current_org_id: number
      created_at: string
      updated_at: string
    },
    access_token: string
    access_token_expires_at: number
  }
}
```

---

#### 3. 用户登录

**接口路径**: `POST /user/login`

**接口作用**: 用户通过手机号和密码登录

**请求参数**:

```typescript
{
  phone: string; // 手机号（必填，11 位）
  password: string; // 密码（必填，8-16 位）
  captcha: string; // 图形验证码（必填，6 位）
  captcha_id: string; // 图形验证码 ID（必填）
}
```

**返回参数**:

```typescript
{
  code: 2000,
  message: "登录成功",
  data: {
    user: {
      id: number
      uuid: string
      username: string
      phone: string
      email: string
      avatar: string
      address: string
      signature: string
      freeze: boolean
      current_org_id: number
      created_at: string
      updated_at: string
    },
    access_token: string
    access_token_expires_at: number
  }
}
```

---

#### 4. 获取组织列表

**接口路径**: `GET /org/list`

**接口作用**: 获取组织列表，支持分页查询

**请求参数**:

```
?page=1&page_size=10
```

| 参数      | 类型   | 必填 | 说明                                                    |
| --------- | ------ | ---- | ------------------------------------------------------- |
| page      | number | 否   | 页码，默认 1。如果为 0 或不传，则返回所有数据（不分页） |
| page_size | number | 否   | 每页数量，默认 10                                       |

**返回参数**:

```typescript
{
  code: 2000,
  message: "获取成功",
  data: {
    list: [
      {
        id: number              // 组织 ID
        name: string            // 组织名称
        description: string     // 组织描述
        code: string            // 加入邀请码
        owner_id: number        // 创建者 ID
        created_at: string      // 创建时间
        updated_at: string      // 更新时间
      }
    ],
    total: number  // 总记录数（仅在分页时有效）
  }
}
```

---

#### 5. 刷新 Token

**接口路径**: `GET /refreshToken`

**接口作用**: 使用 RefreshToken 刷新 AccessToken

**请求参数**: RefreshToken 从 Cookie 中自动获取（HttpOnly）

**返回参数**:

```typescript
{
  code: 2000,
  message: "刷新成功",
  data: {
    access_token: string            // 新的访问令牌
    access_token_expires_at: number  // 访问令牌过期时间（毫秒时间戳）
  }
}
```

**错误返回**:

```typescript
{
  code: 4010,
  message: "token is blacklist",
  data: {
    message: string
    reload: boolean    // 是否需要重新加载页面（true 表示需要）
  }
}
```

---

### 业务接口（需要 JWT 认证）

#### 6. 用户登出

**接口路径**: `POST /user/logout`

**接口作用**: 用户退出登录，清除登录状态

**请求头**:

```
Authorization: Bearer <access_token>
```

**请求参数**: 无

**返回参数**:

```typescript
{
  code: 2000,
  message: "登出成功",
  data: {
    message: "已成功退出登录"
  }
}
```

---

#### 7. 绑定 OJ 账号

**接口路径**: `POST /oj/bind`

**接口作用**: 绑定用户的洛谷或力扣账号，获取用户在对应平台的刷题信息

**请求头**:

```
Authorization: Bearer <access_token>
```

**请求参数**:

```typescript
{
  platform: string; // 平台名称（必填，可选值：leetcode、luogu）
  identifier: string; // 平台用户 ID（必填）
}
```

**返回参数**:

```typescript
{
  code: 2000,
  message: "绑定成功",
  data: {
    platform: string          // 平台名称
    identifier: string        // 平台用户 ID
    real_name: string         // 真实姓名
    user_avatar: string       // 用户头像 URL
    easy_number: number       // 简单题数量（可选）
    medium_number: number     // 中等题数量（可选）
    hard_number: number       // 困难题数量（可选）
    total_number: number      // 总题目数量（可选）
    passed_number: number     // 通过的题目数量（可选）
  }
}
```

---

#### 8. 获取用户 OJ 卡片信息

**接口路径**: `GET /oj/stats`

**接口作用**: 获取用户在指定平台的 OJ 信息（绑定状态、刷题数据等）

**请求头**:

```
Authorization: Bearer <access_token>
```

**请求参数**:

```
?platform=luogu
```

| 参数     | 类型   | 必填 | 说明                              |
| -------- | ------ | ---- | --------------------------------- |
| platform | string | 是   | 平台名称，可选值：luogu、leetcode |

**返回参数**:

```typescript
{
  code: 200,
  msg: "success",
  data: {
    platform: string          // 平台名称
    identifier: string        // 平台用户 ID
    real_name: string         // 真实姓名
    user_avatar: string       // 用户头像 URL
    passed_number: number     // 通过的题目数量
  }
}
```

---

#### 9. 组织内做题排行榜

**接口路径**: `GET /oj/luogu/ranking_list`

**接口作用**: 获取组织内用户的刷题排行榜

**请求头**:

```
Authorization: Bearer <access_token>
```

**请求参数**:

```typescript
{
  platform: string    // 平台名称（luogu、leetcode）
  page?: number       // 页码，默认 1
  page_size?: number  // 每页数量，默认 20
}
```

**返回参数**:

```typescript
{
  code: 200,
  msg: "success",
  data: {
    list: [
      {
        rank: number              // 排名
        user_id: number           // 用户 ID
        real_name: string         // 真实姓名
        avatar: string            // 头像 URL
        total_passed: number      // 总通过题数
        platform_details: {
          [platform: string]: number  // 各平台通过题数
        }
      }
    ],
    my_rank: {
      rank: number              // 当前用户排名
      total_passed: number      // 当前用户通过题数
    },
    total: number              // 总记录数
  }
}
```

---

### Token 刷新流程

1. **AccessToken 过期时**：
   - 前端自动调用 `GET /refreshToken`
   - RefreshToken 从 HttpOnly Cookie 中自动携带
   - 获取新的 AccessToken
   - 更新本地存储
   - 重试原请求

2. **RefreshToken 过期或失效时**：
   - 返回 `reload: true`
   - 前端清除本地存储
   - 跳转到登录页
   - 用户需要重新登录

---

## 🎨 Tailwind 配置

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1890FF",
          hover: "#40A9FF",
          active: "#096DD9",
        },
        success: "#52C41A",
        warning: "#FAAD14",
        error: "#F5222D",
        text: {
          primary: "#262626",
          secondary: "#595959",
          tertiary: "#8C8C8C",
        },
        border: "#D9D9D9",
        background: "#F5F5F5",
      },
      borderRadius: {
        card: "12px",
        button: "6px",
        input: "6px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08)",
        hover: "0 4px 16px rgba(0,0,0,0.12)",
      },
      animation: {
        flip: "flip 0.6s ease-in-out",
        "fade-in": "fadeIn 0.3s ease-out",
      },
      keyframes: {
        flip: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
```

---

## 📦 开发流程

### 1. 环境准备

```bash
# 创建项目
npm create vite@latest algorithm-platform -- --template vue-ts
cd algorithm-platform

# 安装依赖
npm install

# 安装 Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 安装额外依赖
npm install vue-router@4 pinia axios
npm install @vueuse/core  # Vue 工具库

# 开发依赖
npm install -D @types/node
npm install -D eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D unplugin-auto-import unplugin-vue-components  # 自动导入
```

### 2. 配置文件

#### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      dts: "src/auto-imports.d.ts",
    }),
    Components({
      dts: "src/components.d.ts",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

#### TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. 开发命令

```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 代码格式化
npm run format

# 构建
npm run build

# 预览构建结果
npm run preview
```

---

## 🚀 开发优先级

### Phase 1: 项目初始化（第1天）

- [x] 创建 Vite + Vue3 + TS 项目
- [x] 配置 Tailwind CSS
- [x] 配置路由（Vue Router）
- [x] 配置状态管理（Pinia）
- [x] 配置 Axios 请求封装
- [x] 创建基础项目结构

### Phase 2: 公共组件（第2-3天）

- [x] Button 组件
- [x] Input 组件
- [x] Modal 组件
- [x] Loading 组件
- [x] Message 组件

### Phase 3: 认证模块（第4-5天）

- [x] 登录页面
- [x] 注册页面
- [x] 路由守卫
- [x] Token 管理
- [x] 验证码组件

### Phase 4: 核心功能（第6-8天）

- [ ] 首页布局
- [ ] 轮播背景组件
- [ ] Header Bar 组件
- [ ] 洛谷卡片（正面输入 + 反面展示）
- [ ] 力扣卡片（正面输入 + 反面展示）
- [ ] 排行榜卡片（洛谷 + 力扣翻转）
- [ ] 卡片翻转动画

### Phase 5: 优化与测试（第9-10天）

- [ ] 响应式适配
- [ ] 性能优化
- [ ] 错误处理完善
- [ ] 单元测试
- [ ] E2E 测试

---

## ⚠️ 注意事项

### 禁止事项

1. **禁止使用 `any` 类型**

   ```typescript
   // ❌ 错误
   const data: any = await api.getUser();

   // ✅ 正确
   const data: User = await api.getUser();
   ```

2. **禁止忽略类型错误**
   - 使用 `// @ts-ignore` 或 `// @ts-expect-error` 必须说明原因

3. **禁止在组件中直接调用 API**

   ```typescript
   // ❌ 错误：组件中直接调用 axios
   import axios from "axios";
   const data = await axios.get("/api/user");

   // ✅ 正确：使用 Service 层
   import { userService } from "@/services/user.service";
   const data = await userService.getCurrentUser();
   ```

4. **禁止硬编码配置**

   ```typescript
   // ❌ 错误
   const apiUrl = "http://localhost:8080";

   // ✅ 正确
   const apiUrl = import.meta.env.VITE_API_BASE_URL;
   ```

### 必须遵守

1. **所有异步操作必须包含 try-catch**

   ```typescript
   async function fetchData() {
     try {
       const data = await api.getData();
       return data;
     } catch (error) {
       console.error("获取数据失败:", error);
       throw error; // 重新抛出或处理错误
     }
   }
   ```

2. **组件 Props 必须定义类型**

   ```typescript
   interface Props {
     title: string;
     count?: number;
   }
   const props = withDefaults(defineProps<Props>(), {
     count: 0,
   });
   ```

3. **API 请求必须使用 Service 层**

   ```typescript
   // services/xxx.service.ts
   export const xxxService = {
     async getData() {
       // API 调用逻辑
     },
   };
   ```

4. **复杂状态使用 Pinia 管理**
   ```typescript
   // stores/xxx.ts
   export const useXxxStore = defineStore("xxx", () => {
     // 状态逻辑
   });
   ```

---

## 🔍 代码审查规范

所有代码提交前必须经过 Code Review，审查内容包括：

### 1. 命名是否符合领域语言

**检查要点**：

- ✅ 变量名、函数名、组件名是否符合业务领域语言
- ✅ 是否使用专业术语而非技术实现细节
- ✅ 命名是否清晰表达意图，无需额外注释

**示例**：

```typescript
// ✅ 正确 - 符合领域语言
const submitOrder = () => {};
const userId = ref(0);
const isLoggedIn = computed(() => !!user.value);

// ❌ 错误 - 技术实现细节命名
const submitData = () => {};
const uData = ref(0);
const checkLogin = computed(() => !!user.value);
```

### 2. 是否遵循项目分层结构

**检查要点**：

- ✅ 视图层（Views）只负责 UI 渲染和用户交互
- ✅ 业务逻辑在 Composables 或 Store 中
- ✅ API 调用统一在 Service 层
- ✅ 类型定义在 types 目录
- ✅ 工具函数在 utils 目录

**示例**：

```typescript
// ✅ 正确 - 遵循分层结构
// views/Auth/LoginView.vue - 视图层
import { useAuthStore } from "@/stores";
import { authService } from "@/services";

// services/auth.service.ts - 服务层
export const login = (data: LoginRequest) =>
  apiClient.post("/user/login", data);

// stores/auth.ts - 状态管理层
export const useAuthStore = defineStore("auth", () => {
  const login = async (phone: string, password: string) => {
    // 业务逻辑
  };
});

// ❌ 错误 - 视图层直接调用 API
import axios from "axios";
const data = await axios.post("/api/login", { phone, password });
```

### 3. 是否有冗余或硬编码

**检查要点**：

- ✅ 是否有重复的代码逻辑
- ✅ 是否有重复的样式定义
- ✅ 是否存在可复用但未封装的组件
- ✅ 配置是否使用环境变量
- ✅ 魔法数字是否提取为常量

**示例**：

```typescript
// ✅ 正确 - 使用环境变量和常量
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MAX_LOGIN_ATTEMPTS = 3;
const CAPTCHA_LENGTH = 6;

// ❌ 错误 - 硬编码
const apiUrl = "http://localhost:8080";
if (attempts >= 3) {
}
if (code.length === 6) {
}

// ✅ 正确 - 提取重复逻辑为组件
import { BackgroundCarousel } from "@/components/layout";

// ❌ 错误 - 重复的轮播背景代码在每个页面都写一遍
```

### 4. 是否有测试覆盖

**检查要点**：

- ✅ 核心业务逻辑是否有单元测试
- ✅ 工具函数是否有测试用例
- ✅ 组件是否有基础测试
- ✅ API 调用是否有 Mock 测试
- ✅ 测试覆盖率是否达到要求

**测试要求**：

```typescript
// 工具函数必须有测试
// utils/validate.test.ts
import { validatePhone, validatePassword } from "../validate";

describe("validatePhone", () => {
  it("should validate correct phone number", () => {
    expect(validatePhone("13800138000")).toBe(true);
  });

  it("should reject invalid phone number", () => {
    expect(validatePhone("12345")).toBe(false);
  });
});

// 组件测试
// components/common/Button/Button.test.ts
import { mount } from "@vue/test-utils";
import Button from "./Button.vue";

describe("Button", () => {
  it("renders button text", () => {
    const wrapper = mount(Button, { slots: { default: "Click me" } });
    expect(wrapper.text()).toContain("Click me");
  });

  it("emits click event", async () => {
    const wrapper = mount(Button);
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
  });
});
```

### 代码审查清单

提交代码前，请确认以下内容：

#### 代码质量

- [ ] 代码通过 ESLint 检查（无警告）
- [ ] 代码通过 TypeScript 类型检查
- [ ] 代码通过 Prettier 格式化
- [ ] 没有注释掉的代码或调试代码
- [ ] 没有 console.log 或 debugger

#### 命名规范

- [ ] 变量、函数名使用 camelCase
- [ ] 组件名使用 PascalCase
- [ ] 常量使用 UPPER_SNAKE_CASE
- [ ] 类型/接口使用 PascalCase
- [ ] 布尔值使用 is/has/should 前缀

#### 代码结构

- [ ] 遵循项目分层结构
- [ ] 单个文件不超过 300 行
- [ ] 单个函数不超过 50 行
- [ ] 嵌套层级不超过 3 层
- [ ] 循环复杂度不超过 10

#### 性能优化

- [ ] 大列表使用虚拟滚动
- [ ] 图片使用懒加载
- [ ] 避免不必要的响应式数据
- [ ] 合理使用 computed 缓存
- [ ] 组件按需加载

#### 可维护性

- [ ] 关键逻辑有注释说明
- [ ] 复杂算法有文档说明
- [ ] 没有魔法数字
- [ ] 配置使用环境变量
- [ ] 错误处理完善

---

## 📝 开发日志

### 当前版本：v0.4.0 (2025-01-19)

**已完成**：

- ✅ 项目需求文档
- ✅ UI 设计规范
- ✅ 技术选型确定
- ✅ 项目结构规划
- ✅ 项目初始化完成（Vite + Vue3 + TS + Tailwind CSS）
- ✅ 公共组件封装完成
  - Button 按钮（5种类型、3种尺寸、多种状态）
  - Input 输入框（5种类型、3种尺寸、清除/密码/图标支持）
  - Modal 弹窗（4种尺寸、自定义按钮、遮罩控制）
  - Loading 加载（3种类型、3种尺寸、全屏支持）
  - Message 消息提示（4种类型、函数式调用）
- ✅ 组件使用文档完成
- ✅ 认证模块开发完成
  - Captcha 验证码组件（自动获取、点击刷新、Base64显示）
  - Auth Store 认证状态管理（登录/登出、Token管理、自动恢复）
  - LoginView 登录页面（表单验证、背景轮播、用户协议）
  - RegisterView 注册页面（完整表单、组织选择、自动登录）
  - 路由守卫（认证检查、自动跳转、路径保存）
  - API 接口修正（类型定义、返回结构、参数处理）
- ✅ **代码审查与优化完成**（v0.4.0）
  - 创建 `BackgroundCarousel` 组件，消除 ~400 行重复代码
  - 文件行数优化：LoginView 360→298 行，RegisterView 454→392 行
  - 创建 `constants/validation.ts` 常量文件，消除所有魔法数字
  - 完善 `utils/validate.ts`，新增 5 个详细验证函数
  - 更新组件使用统一验证函数，提升代码可维护性
  - 移除非关键 Console 语句，保留认证相关日志用于调试

**优化成果**：
| 指标 | 优化前 | 优化后 | 改进 |
|------|--------|--------|------|
| LoginView.vue | 360 行 | 298 行 | ✅ -17% (达标) |
| RegisterView.vue | 454 行 | 392 行 | ✅ -14% (接近目标) |
| 魔法数字 | 6+ 处 | 0 处 | ✅ 100% 消除 |
| 代码重复 | ~400 行 | 0 行 | ✅ 完全消除 |
| 验证逻辑 | 分散在组件 | 统一工具函数 | ✅ 集中管理 |

**进行中**：

- 🔄 核心功能开发（准备中）

**待办**：

- ⏳ 核心功能开发
- ⏳ 单元测试覆盖
- ⏳ E2E 测试

### 历史版本

#### v0.2.0 (2025-01-19)

- 公共组件封装完成

#### v0.1.0 (2025-01-18)

- 项目初始化
- 基础配置完成

---

## 🔗 相关文档

- [需求文档](./requirement.md)
- [UI 需求与优化记录](./UI需求与优化记录.md)
- [AI 前端开发提示词](./AI前端开发提示词文档.md)
- [AI Vue 模块化开发提示词](./AI-Vue模块化开发提示词.md)
- [需求定义阶段文档](./需求定义阶段文档.md)
- [后端 API 文档](../../personal_assistant/README.md)

---

## 📞 联系方式

如有疑问，请参考本文档或查看相关文档。

---

**文档版本**：v1.4.0
**最后更新**：2025-01-19
**维护人**：Claude AI
