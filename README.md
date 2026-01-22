# 个人助手 - 前端

基于 Vue 3 + TypeScript + Tailwind CSS 的个人助手前端项目。

## 技术栈

- **Vue 3.4+** - 渐进式 JavaScript 框架
- **TypeScript 5.0+** - JavaScript 的超集
- **Vite 5.0+** - 新一代前端构建工具
- **Tailwind CSS 3.4+** - 实用优先的 CSS 框架
- **Pinia 2.1+** - Vue 的状态管理库
- **Vue Router 4.2+** - Vue 官方路由
- **Axios 1.6+** - HTTP 客户端
- **Element Plus 2.6+** - Vue 3 组件库
- **@vueuse/core** - Vue Composition API 工具集

## 项目结构

```
frontend/
├── src/
│   ├── assets/           # 静态资源
│   │   └── styles/       # 全局样式
│   ├── components/       # 组件
│   │   ├── common/       # 通用组件
│   │   ├── layout/       # 布局组件
│   │   └── business/     # 业务组件
│   ├── composables/      # 组合式函数
│   ├── router/           # 路由配置
│   ├── services/         # API 服务层
│   ├── stores/           # Pinia 状态管理
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.ts           # 应用入口
├── .env.development      # 开发环境变量
├── .env.production       # 生产环境变量
├── index.html            # HTML 模板
├── package.json          # 项目依赖
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
├── tailwind.config.js    # Tailwind CSS 配置
└── README.md             # 项目文档
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

项目将在 http://localhost:3000 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

## 代码规范

### 命名规范

- **组件**：PascalCase（如 `UserProfile.vue`）
- **函数**：camelCase（如 `fetchUserData`）
- **常量**：UPPER_SNAKE_CASE（如 `API_BASE_URL`）
- **类型/接口**：PascalCase（如 `UserData`）

### TypeScript 规范

- 禁止使用 `any` 类型，必须明确类型定义
- 所有异步操作必须包含 try-catch
- 优先使用 `interface` 定义对象类型

### CSS 规范

- 优先使用 Tailwind CSS 工具类
- 复杂动画使用 CSS Modules
- 避免内联样式

### API 请求规范

- Service 层只负责调用 API，不处理业务逻辑
- 401 错误统一在 axios 拦截器中处理（自动刷新 Token）
- 业务逻辑在页面/组件中处理（错误提示、路由跳转等）

## 开发指南

### Service 层示例

```typescript
// services/auth.service.ts
import apiClient from "@/utils/request";
import type { LoginRequest, LoginResponse } from "@/types";

export function login(data: LoginRequest): Promise<LoginResponse> {
  // ✅ 只负责调用 API
  return apiClient.post("/user/login", data);

  // ❌ 不要在 Service 中处理业务逻辑
  // Message.success('登录成功')
  // router.push('/home')
}
```

### 页面中使用示例

```typescript
// views/LoginView.vue
import { login } from "@/services";

const handleLogin = async () => {
  try {
    const response = await login(formData);
    authStore.setUser(response.user);
    authStore.setToken(response.access_token, response.access_token_expires_at);
    Message.success("登录成功"); // ✅ 在页面中处理业务逻辑
    router.push("/home");
  } catch (error) {
    Message.error("登录失败"); // ✅ 在页面中处理错误
  }
};
```

## 环境变量

### 开发环境 (.env.development)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=个人助手
```

### 生产环境 (.env.production)

```env
VITE_API_BASE_URL=https://api.algorithm-platform.com
VITE_APP_TITLE=个人助手
```

## 功能特性

- ✅ 用户认证（登录/注册/登出）
- ✅ 自动刷新 Token（401 错误处理）
- ✅ OJ 账号绑定（洛谷/力扣）
- ✅ 排行榜展示
- ✅ 3D 卡片翻转动画
- ✅ 轮播背景（4秒自动切换）
- ✅ 响应式布局

## 待开发功能

- ⏳ 登录/注册页面
- ⏳ 首页布局（三卡片）
- ⏳ 洛谷/力扣卡片组件
- ⏳ 排行榜组件
- ⏳ Header Bar 组件
- ⏳ 轮播背景组件

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 许可证

MIT

---

**开发时间**: 2025-01-18
**维护者**: AI 开发助手
