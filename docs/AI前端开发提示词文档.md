# AI前端开发提示词文档

## 个人助手 - 模块化开发指南

---

## 📋 文档说明

**使用方法**：

1. 复制对应模块的提示词
2. 发送给AI（Claude/ChatGPT/Cursor）
3. 按照AI生成的代码进行开发
4. 根据实际情况调整提示词

**技术栈**：

- React 18
- TypeScript 5
- Vite 5
- Ant Design 5
- Tailwind CSS 3
- React Router 6
- Axios 1
- Zustand 4
- React Query 5

**设计风格**：

- 版心：1200px
- 主色调：#1890FF（蓝色）
- 圆角：登录框16px、卡片12px、按钮6px
- 动画：ease-out（页面）、ease-in-out（卡片翻转）

---

## 🎯 模块1：项目初始化

### 提示词 1.1：创建项目

```
请帮我创建一个React + TypeScript + Vite项目，具体要求：

1. 项目名称：algorithm-platform-frontend
2. 使用Vite创建项目
3. 安装以下依赖：
   - react@18.2.x
   - react-dom@18.2.x
   - react-router-dom@6.x
   - antd@5.x
   - axios@1.x
   - zustand@4.x
   - @tanstack/react-query@5.x
   - tailwindcss@3.x
   - @types/react@18.x
   - @types/react-dom@18.x
   - dayjs

4. 配置Tailwind CSS：
   - 内容：./index.html, ./src/**/*.{js,ts,jsx,tsx}
   - 主题：在tailwind.config.js中定义主色调#1890FF

5. 配置路径别名：
   - @/ 指向 ./src
   - @/components 指向 ./src/components
   - @/pages 指向 ./src/pages
   - @/services 指向 ./src/services
   - @/store 指向 ./src/store
   - @/utils 指向 ./src/utils
   - @/types 指向 ./src/types
   - @/hooks 指向 ./src/hooks

6. 创建以下目录结构：
src/
  ├── assets/          # 静态资源
  ├── components/      # 公共组件
  │   ├── common/      # 通用组件
  │   └── layout/      # 布局组件
  ├── pages/           # 页面组件
  │   ├── Login/
  │   ├── Register/
  │   └── Home/
  ├── hooks/           # 自定义Hooks
  ├── services/        # API服务
  ├── store/           # 状态管理
  ├── types/           # TypeScript类型
  ├── utils/           # 工具函数
  ├── router/          # 路由配置
  ├── App.tsx
  └── main.tsx

请生成完整的package.json、vite.config.ts、tsconfig.json、tailwind.config.js文件。
```

---

### 提示词 1.2：TypeScript类型定义

```
请基于以下需求生成完整的TypeScript类型定义，保存在 src/types/index.ts 中：

// 用户相关类型
interface User {
  id: number;
  uuid: string;
  username: string;
  phone: string;
  email: string | null;
  avatar: string;
  signature: string;
  freeze: boolean;
  current_org_id: number | null;
  leetcode_details?: OJBindingData[];
  luogu_details?: OJBindingData[];
  current_org?: Organization;
  created_at: string;
  updated_at: string;
}

// OJ绑定数据
interface OJBindingData {
  platform: 'luogu' | 'leetcode';
  identifier: string;
  real_name: string;
  user_avatar: string;
  passed_number: number;
  easy_number?: number;
  medium_number?: number;
  hard_number?: number;
  total_number?: number;
}

// 组织
interface Organization {
  id: number;
  name: string;
  description: string;
  code: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

// 排行榜项
interface LeaderboardItem {
  rank: number;
  user_id: number;
  avatar: string;
  real_name: string;
  passed_number: number;
  isCurrentUser: boolean;
}

// 请求类型
interface LoginRequest {
  phone: string;
  password: string;
  captcha: string;
  captcha_id: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  phone: string;
  captcha: string;
  captcha_id: string;
  org_id?: number;
}

interface BindOJRequest {
  platform: 'luogu' | 'leetcode';
  identifier: string;
}

// 响应类型
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

interface LoginResponse {
  user: User;
  access_token: string;
  access_token_expires_at: number;
}

interface CaptchaResponse {
  captcha_id: string;
  pic_path: string;
}

interface LeaderboardResponse {
  list: LeaderboardItem[];
  total: number;
}

// 路由相关
type RouteConfig = {
  path: string;
  element: React.LazyExoticComponent<any>;
  meta?: {
    title: string;
    requireAuth?: boolean;
  };
};

请生成完整的类型定义文件，包含所有必需的类型和接口。
```

---

## 🎯 模块2：API服务封装

### 提示词 2.1：Axios配置

```
请创建完整的Axios实例配置，保存在 src/services/request.ts 中：

要求：
1. 创建axios实例
   - baseURL: 从环境变量读取（默认 http://localhost:8080）
   - timeout: 10000ms

2. 请求拦截器：
   - 自动添加 Authorization header（从 localStorage 读取 access_token）
   - 添加请求时间戳（用于监控）

3. 响应拦截器：
   - 统一处理响应数据结构 { code, message, data }
   - 处理 4010 错误（Token过期）
     - 自动调用刷新接口
     - 重新发送原请求
   - 其他错误统一提示（antd message）

4. 工具函数：
   - get<T>(url, params?)
   - post<T>(url, data?)
   - put<T>(url, data?)
   - delete<T>(url, params?)

5. 类型安全：
   - 使用泛型确保类型安全
   - 定义 RequestResponse 类型

请生成完整的代码，包含详细的注释。
```

---

### 提示词 2.2：API接口定义

```
请创建完整的API接口定义，保存在 src/services/api.ts 中：

基于以下接口需求：

1. 认证接口（src/services/modules/auth.ts）
   - getCaptcha(): 获取验证码
   - login(data: LoginRequest): 登录
   - register(data: RegisterRequest): 注册
   - logout(): 登出
   - refreshToken(): 刷新Token

2. OJ接口（src/services/modules/oj.ts）
   - bindAccount(data: BindOJRequest): 绑定OJ账号
   - getLeaderboard(platform: string): 获取排行榜
   - getUserOJData(platform: string): 获取用户OJ数据

3. 组织接口（src/services/modules/org.ts）
   - getOrgList(params?: {page?: number; page_size?: number}): 获取组织列表

要求：
1. 使用已经配置好的 request 实例
2. 所有接口返回类型为 ApiResponse<T>
3. 详细的参数注释
4. 完整的错误处理

请生成完整的API接口代码。
```

---

## 🎯 模块3：状态管理（Zustand）

### 提示词 3.1：Auth Store

````
请创建用户认证状态管理，保存在 src/store/authStore.ts 中：

使用 Zustand v4，实现以下功能：

1. 状态定义：
```typescript
interface AuthState {
  // 用户信息
  user: User | null;

  // Token
  token: string | null;
  refreshToken: string | null;

  // 认证状态
  isAuthenticated: boolean;

  // 加载状态
  isLoading: boolean;

  // 错误信息
  error: string | null;
}
````

2. Actions：
   - setUser(user: User): 设置用户信息
   - setToken(token: string, refreshToken: string): 设置Token
   - login(phone: string, password: string, captcha: string, captcha_id: string): 登录
   - register(username: string, phone: string, password: string, captcha: string, captcha_id: string, org_id?: number): 注册
   - logout(): 登出
   - refreshToken(): 刷新Token
   - checkAuth(): 检查登录状态
   - clearError(): 清除错误信息

3. 持久化：
   - 使用 localStorage 持久化 token 和 refreshToken
   - 使用 zustand/middleware 持久化 user 信息

4. Token刷新逻辑：
   - 4010 错误时自动刷新
   - 刷新失败则登出

5. 初始化：
   - 应用启动时自动检查本地存储的token

请生成完整的 authStore.ts 代码。

```

---

### 提示词 3.2：OJ Store

```

请创建OJ绑定状态管理，保存在 src/store/ojStore.ts 中：

使用 Zustand v4，实现以下功能：

1. 状态定义：

```typescript
interface OJState {
  // 绑定数据
  luoguBinding: OJBindingData | null;
  leetcodeBinding: OJBindingData | null;

  // 排行榜数据
  luoguLeaderboard: LeaderboardItem[];
  leetcodeLeaderboard: LeaderboardItem[];

  // 加载状态
  bindingLoading: boolean;
  leaderboardLoading: boolean;

  // 错误信息
  error: string | null;
}
```

2. Actions：
   - setLuoguBinding(data: OJBindingData): 设置洛谷绑定数据
   - setLeetcodeBinding(data: OJBindingData): 设置力扣绑定数据
   - setLuoguLeaderboard(data: LeaderboardItem[]): 设置洛谷排行榜
   - setLeetcodeLeaderboard(data: LeaderboardItem[]): 设置力扣排行榜
   - bindAccount(platform: 'luogu' | 'leetcode', identifier: string): 绑定账号
   - fetchLeaderboard(platform: 'luogu' | 'leetcode'): 获取排行榜
   - clearError(): 清除错误

3. 业务逻辑：
   - 绑定成功后自动获取排行榜
   - 绑定失败时显示错误信息
   - 排行榜按通过题目数降序排列

请生成完整的 ojStore.ts 代码。

```

---

## 🎯 模块4：公共组件

### 提示词 4.1：HeaderBar 组件

```

请创建顶部导航栏组件，保存在 src/components/layout/HeaderBar/index.tsx 中：

功能需求：

1. 初始状态：完全隐藏
2. 触发方式：顶部居中有一个小按钮（24x24px圆形），悬浮时显示HeaderBar
3. 显示动画：从顶部滑入，300ms，ease-out
4. 高度：60px
5. 背景色：白色
6. 版心：1200px，水平居中
7. 内容：
   - 左侧：文字"欢迎来到算法平台"（14px，黑色）
   - 右侧：用户图标（32x32px）+ 下拉菜单
     - 下拉菜单包含：用户名 + 退出登录按钮

接口：

```typescript
interface HeaderBarProps {
  visible: boolean;
  user: User;
  onLogout: () => void;
}
```

样式要求：

- 使用 Tailwind CSS
- 响应式设计
- 过渡动画效果

请生成完整的 HeaderBar 组件代码。

```

---

### 提示词 4.2：卡片翻转组件

```

请创建一个通用的卡片翻转组件，保存在 src/components/common/FlipCard/index.tsx 中：

功能需求：

1. 支持3D翻转效果（正面/反面）
2. 翻转触发：通过 isFlipped 属性控制
3. 翻转动画：600ms，ease-in-out
4. 鼠标悬停时有轻微放大效果

接口：

```typescript
interface FlipCardProps {
  isFlipped: boolean;
  front: React.ReactNode; // 正面内容
  back: React.ReactNode; // 反面内容
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}
```

实现细节：

- 使用 CSS transform: rotateY(180deg)
- 使用 perspective 和 transform-style: preserve-3d
- 正反面使用 backface-visibility: hidden

请生成完整的 FlipCard 组件代码，包含样式文件。

```

---

## 🎯 模块5：认证模块

### 提示词 5.1：登录页面

```

请创建登录页面，保存在 src/pages/Login/index.tsx 中：

页面布局：

1. 背景：轮播图，4秒切换，淡入淡出效果
   - 图片尺寸：1920x1080px
   - 去除切换按钮
   - 内容：算法、编程相关主题

2. 登录框：
   - 位置：页面垂直水平居中
   - 尺寸：400x500px
   - 背景：白色 + 85%不透明度
   - 圆角：16px
   - 阴影：0 8px 32px rgba(0,0,0,0.1)

3. 表单字段：
   - 手机号输入框（Input，类型tel）
   - 密码输入框（Input.Password）
   - 验证码输入框（6位数字）
   - 验证码图片（显示后端返回的base64图片）
   - 登录按钮（类型primary，block）
   - 底部链接："没有账号？去注册"

验证规则：

- 手机号：必填，11位，正则校验
- 密码：必填，8-16位
- 验证码：必填，6位数字

功能：

- 提交时调用 authStore.login()
- 成功后跳转到主页
- 失败时显示错误提示
- 验证码图片可点击刷新

请生成完整的登录页面代码。

```

---

### 提示词 5.2：注册页面

```

请创建注册页面，保存在 src/pages/Register/index.tsx 中：

页面布局：
与登录页面相同，背景和登录框位置一致

表单字段：

1. 用户名输入框（必填，最大20位）
2. 手机号输入框（必填，11位）
3. 密码输入框（必填，8-16位）
   - 提示：必须包含字母和数字
4. 确认密码输入框
5. 验证码输入框（6位数字）
6. 验证码图片
7. 组织选择（可选，下拉框）
8. 注册按钮（类型primary，block）
9. 底部链接："已有账号？去登录"

验证规则：

- 两次密码必须一致
- 密码必须包含字母和数字
- 手机号格式校验

功能：

- 提交时调用 authStore.register()
- 成功后跳转到主页（注册即登录）
- 失败时显示错误提示
- 实时密码一致性检查

请生成完整的注册页面代码。

```

---

## 🎯 模块6：主页

### 提示词 6.1：主页布局

```

请创建主页组件，保存在 src/pages/Home/index.tsx 中：

页面结构：
┌─────────────────────────────────────────┐
│ [顶部触发按钮] │
├─────────────────────────────────────────┤
│ Header Bar（默认隐藏） │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ 欢迎来到算法平台 [用户图标▼] │
└─────────────────────────────────────────┘
│ │
│ ┌────────────┬────────────────────────┐│
│ │ │ ││
│ │ 洛谷卡片 │ ││
│ │ │ ││
│ ├────────────┤ ││
│ │ │ 排行榜卡片 ││
│ │ 力扣卡片 │ ││
│ │ │ ││
│ └────────────┴────────────────────────┘│
│ │
└─────────────────────────────────────────┘

布局要求：

1. 版心：1200px，水平居中
2. HeaderBar：使用公共组件
3. 顶部触发按钮：固定在顶部居中，圆形，24x24px
4. 卡片区域：
   - 左侧卡片：两个垂直排列（洛谷、力扣）
   - 右侧卡片：一个大的排行榜卡片
   - 卡片尺寸：
     - 左侧卡片：580x280px
     - 右侧卡片：580x580px
   - 卡片间距：20px

请生成完整的主页布局代码。

```

---

## 🎯 模块7：OJ绑定卡片

### 提示词 7.1：洛谷卡片

```

请创建洛谷绑定卡片组件，保存在 src/components/LuoguCard/index.tsx 中：

功能需求：

1. 正面（未绑定状态）：
   - 洛谷图标（64x64px）
   - 平台名称："洛谷"（18px，加粗）
   - 输入框（placeholder：请输入洛谷ID）
   - 提交按钮（类型primary）
   - 提示文字："输入洛谷用户ID，绑定后自动获取刷题数据"

2. 反面（已绑定状态）：
   - 用户头像（80x80px，圆形）
   - 真实姓名（18px，加粗）
   - 通过题目总数（24px，橙色，加粗）
   - 详细统计：
     - 简单：XX题
     - 中等：XX题
     - 困难：XX题
   - 修改按钮（类型default，小尺寸）

3. 交互规则：
   - 绑定成功后自动翻转到反面
   - 点击"修改"按钮翻转到正面
   - 绑定失败时不翻转，显示错误提示
   - 提交时显示loading状态

接口：

```typescript
interface LuoguCardProps {
  data: OJBindingData | null;
  onBind: (identifier: string) => Promise<void>;
}
```

样式要求：

- 卡片背景：白色，圆角12px
- 阴影：0 2px 8px rgba(0,0,0,0.1)
- 内边距：24px
- 使用FlipCard组件实现翻转

请生成完整的洛谷卡片组件代码。

```

---

### 提示词 7.2：力扣卡片

```

请创建力扣绑定卡片组件，保存在 src/components/LeetCodeCard/index.tsx 中：

功能需求：
与洛谷卡片相同，只是替换为力扣相关内容：

1. 正面（未绑定状态）：
   - 力扣图标（64x64px）
   - 平台名称："力扣 LeetCode"（18px，加粗）
   - 输入框（placeholder：请输入力扣ID）
   - 提交按钮（类型primary）
   - 提示文字："输入力扣用户ID，绑定后自动获取刷题数据"

2. 反面（已绑定状态）：
   - 用户头像（80x80px，圆形）
   - 真实姓名（18px，加粗）
   - 通过题目总数（24px，橙色，加粗）
   - 详细统计：
     - Easy：XX题
     - Medium：XX题
     - Hard：XX题
   - 修改按钮（类型default，小尺寸）

接口：

```typescript
interface LeetCodeCardProps {
  data: OJBindingData | null;
  onBind: (identifier: string) => Promise<void>;
}
```

请生成完整的力扣卡片组件代码。

```

---

## 🎯 模块8：排行榜卡片

### 提示词 8.1：排行榜组件

```

请创建排行榜组件，保存在 src/components/Leaderboard/index.tsx 中：

功能需求：

1. 双面卡片结构：
   - 正面：洛谷排行榜
   - 反面：力扣排行榜
   - 点击卡片切换平台

2. 列表展示：
   - 列表项高度：60px
   - 展示字段：
     - 排名序号（1/2/3特殊颜色，其余灰色）
     - 用户头像（40x40px，圆形）
     - 真实姓名（14px）
     - 通过题目数（16px，加粗，橙色）
   - 当前用户的排名高亮显示（浅蓝色背景）

3. 空状态处理：
   - 未绑定OJ账号："请先绑定OJ账号才能查看排行榜"
   - 无数据："暂无排行数据"
   - 加载中：显示加载动画

4. 数据处理：
   - 只显示前60%用户
   - 按通过题目数降序排列
   - 当前用户排名高亮

接口：

```typescript
interface LeaderboardProps {
  luoguData: LeaderboardItem[];
  leetcodeData: LeaderboardItem[];
  currentUserId: number;
  isLoading?: boolean;
}
```

交互：

- 点击卡片切换平台
- 切换时有翻转动画

请生成完整的排行榜组件代码。

```

---

## 🎯 模块9：路由配置

### 提示词 9.1：路由设置

```

请创建路由配置，保存在 src/router/index.tsx 中：

使用 React Router v6，实现以下路由：

1. 路由配置：

```typescript
const routes: RouteConfig[] = [
  {
    path: "/login",
    element: lazy(() => import("@/pages/Login")),
    meta: { title: "登录", requireAuth: false },
  },
  {
    path: "/register",
    element: lazy(() => import("@/pages/Register")),
    meta: { title: "注册", requireAuth: false },
  },
  {
    path: "/",
    element: lazy(() => import("@/pages/Home")),
    meta: { title: "主页", requireAuth: true },
  },
];
```

2. 路由守卫：
   - 未登录用户访问主页时重定向到登录页
   - 已登录用户访问登录页时重定向到主页

3. 页面标题：
   - 根据路由配置自动更新 document.title

4. 404页面：
   - 未匹配的路由显示404页面

5. 加载状态：
   - 使用 Suspense 包裹，显示加载动画

请生成完整的路由配置代码。

```

---

## 🎯 模块10：工具函数

### 提示词 10.1：通用工具函数

```

请创建工具函数库，保存在 src/utils/index.ts 中：

实现以下工具函数：

1. 格式化函数

```typescript
// 格式化日期
formatDate(date: string | Date, format: string): string

// 格式化数字（12345 -> 12,345）
formatNumber(num: number): string

// 格式化时间戳（毫秒转相对时间）
formatRelativeTime(timestamp: number): string
```

2. 验证函数

```typescript
// 验证手机号
validatePhone(phone: string): boolean

// 验证密码强度
validatePassword(password: string): { valid: boolean; strength: 'weak' | 'medium' | 'strong' }

// 验证用户名
validateUsername(username: string): boolean
```

3. Token管理

```typescript
// 获取Token
getToken(): string | null

// 设置Token
setToken(token: string, refreshToken: string): void

// 清除Token
clearToken(): void

// Token是否过期
isTokenExpired(token: string): boolean
```

4. 存储管理

```typescript
// LocalStorage操作
const storage = {
  get: <T>(key: string): T | null
  set: <T>(key: string, value: T): void
  remove: (key: string): void
  clear: (): void
}
```

5. HTTP状态码处理

```typescript
// 判断是否成功
isSuccess(code: number): boolean

// 判断是否未授权
isUnauthorized(code: number): boolean

// 获取错误信息
getErrorMessage(code: number, defaultMessage?: string): string
```

请生成完整的工具函数代码，包含详细注释和类型定义。

```

---

## 🎯 模块11：全局样式

### 提示词 11.1：全局CSS

```

请创建全局样式文件，保存在 src/index.css 中：

1. 重置样式
2. 全局变量定义
3. 通用class

具体要求：

1. 全局变量：

```css
:root {
  /* 主色调 */
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  --text-color: #000000;
  --text-color-secondary: #666666;
  --border-color: #d9d9d9;
  --bg-color: #ffffff;
  --bg-color-light: #fafafa;

  /* 圆角 */
  --border-radius-sm: 6px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;

  /* 阴影 */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

2. 通用class：

```css
.container {
  width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

3. 动画class：

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}
```

请生成完整的全局样式代码。

```

---

## 🎯 模块12：Hooks

### 提示词 12.1：自定义Hooks

```

请创建自定义Hooks，保存在 src/hooks/ 目录下：

1. useRequest（请求封装）

```typescript
// 封装常用的请求逻辑
function useRequest<T>(
  apiFunc: () => Promise<T>,
  options?: {
    manual?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  },
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  run: () => Promise<void>;
  refresh: () => Promise<void>;
};
```

2. useLocalStorage（本地存储）

```typescript
// 封装localStorage操作
function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void, () => void];
```

3. useCountdown（倒计时）

```typescript
// 验证码倒计时
function useCountdown(
  seconds: number,
  onEnd?: () => void,
): {
  count: number;
  start: () => void;
  reset: () => void;
};
```

4. useToggle（切换状态）

```typescript
// 切换布尔值状态
function useToggle(
  initialValue: boolean = false,
): [boolean, (value?: boolean) => void];
```

请生成完整的Hooks代码，包含TypeScript类型定义。

```

---

## 🎯 模块13：轮播背景

### 提示词 13.1：轮播组件

```

请创建轮播背景组件，保存在 src/components/common/Carousel/index.tsx 中：

功能需求：

1. 自动轮播，4秒切换一次
2. 淡入淡出效果（opacity: 1 → 0 → 1）
3. 无切换按钮
4. 图片要求：
   - 尺寸：1920x1080px
   - 格式：JPG/WebP
   - 内容：算法、编程相关

5. 图片列表（示例）：

```typescript
const carouselImages = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920",
  "https://images.unsplash.com/photo-1504639725590-34d0984388de?w=1920",
  "https://images.unsplash.com/photo-1555066931-4365d14bab0c?w=1920",
];
```

接口：

```typescript
interface CarouselProps {
  images?: string[];
  duration?: number; // 切换间隔（毫秒）
  autoplay?: boolean;
}
```

实现细节：

- 使用 useState 管理当前图片索引
- 使用 useEffect 实现自动切换
- 使用 CSS transition 实现淡入淡出
- 图片预加载优化

请生成完整的轮播组件代码。

```

---

## 🎯 模块14：集成测试

### 提示词 14.1：E2E测试（Playwright）

```

请创建E2E测试，保存在 tests/ 目录下：

使用 Playwright 实现以下测试场景：

1. 用户注册流程测试（tests/auth/register.spec.ts）

```typescript
测试场景：
Scenario 1: 正常注册
  - 访问注册页
  - 填写表单（用户名、手机号、密码、验证码）
  - 提交注册
  - 验证：跳转到主页
  - 验证：Token存在

Scenario 2: 手机号重复
  - 输入已注册的手机号
  - 提交注册
  - 验证：显示错误提示

Scenario 3: 密码格式错误
  - 输入少于8位的密码
  - 提交注册
  - 验证：显示格式错误提示
```

2. 用户登录流程测试（tests/auth/login.spec.ts）

```typescript
测试场景：
Scenario 1: 正常登录
  - 访问登录页
  - 填写表单（手机号、密码、验证码）
  - 提交登录
  - 验证：跳转到主页
  - 验证：Header Bar显示

Scenario 2: 密码错误
  - 输入错误的密码
  - 提交登录
  - 验证：显示密码错误提示

Scenario 3: Token刷新
  - 模拟Token过期
  - 访问需要认证的接口
  - 验证：自动刷新Token
```

3. OJ绑定流程测试（tests/oj/bind.spec.ts）

```typescript
测试场景：
Scenario 1: 成功绑定洛谷账号
  - 进入主页
  - 在洛谷卡片输入ID
  - 点击提交
  - 验证：卡片翻转到反面
  - 验证：显示用户数据

Scenario 2: ID不存在
  - 输入不存在的ID
  - 点击提交
  - 验证：显示错误提示
  - 验证：卡片不翻转

Scenario 3: 修改已绑定ID
  - 已绑定状态下点击修改
  - 验证：卡片翻转到正面
  - 修改ID并提交
  - 验证：数据更新
```

4. 排行榜功能测试（tests/leaderboard/index.spec.ts）

```typescript
测试场景：
Scenario 1: 查看洛谷排行榜
  - 进入主页
  - 查看排行榜卡片
  - 验证：显示洛谷排行榜
  - 验证：按通过题目数降序排列

Scenario 2: 切换到力扣排行榜
  - 点击排行榜卡片
  - 验证：卡片翻转到反面
  - 验证：显示力扣排行榜

Scenario 3: 当前用户高亮
  - 确保当前用户的排名高亮显示
```

请生成完整的E2E测试代码，包含：

- 测试配置（playwright.config.ts）
- 测试辅助函数
- 测试用例

```

---

## 🎯 模块15：性能优化

### 提示词 15.1：性能优化配置

```

请创建性能优化配置，包括以下内容：

1. 代码分割（Code Splitting）
   - 路由级别懒加载
   - 组件级别懒加载

2. 图片优化
   - 使用 WebP 格式
   - 图片懒加载
   - 响应式图片

3. 缓存策略
   - Service Worker缓存静态资源
   - React Query缓存API数据

4. 打包优化
   - 代码压缩
   - Tree Shaking
   - Gzip压缩

请生成以下配置文件：

1. vite.config.ts 优化配置
2. vite-env.d.ts 类型定义
3. .env.production 生产环境变量
4. public/sw.js Service Worker

包含详细注释和说明。

```

---

## 🎯 模块16：环境配置

### 提示词 16.1：环境变量

```

请创建环境变量配置文件：

1. .env.development（开发环境）

```env
VITE_API_URL=http://localhost:8080
VITE_APP_TITLE=个人助手
VITE_APP_DESC=Algorithm Learning Platform
```

2. .env.production（生产环境）

```env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=个人助手
VITE_APP_DESC=Algorithm Learning Platform
```

3. .env.test（测试环境）

```env
VITE_API_URL=http://localhost:8080
VITE_APP_TITLE=个人助手
```

4. vite-env.d.ts（类型定义）

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_DESC: string;
}
```

请生成完整的环境变量配置文件。

```

---

## 🎯 模块17：错误处理

### 提示词 17.1：错误边界

```

请创建错误边界组件，保存在 src/components/ErrorBoundary/index.tsx 中：

功能需求：

1. 捕获组件树中的JavaScript错误
2. 显示友好的错误页面
3. 提供重试和返回首页的按钮

实现：

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
```

UI设计：

- 错误页面居中显示
- 错误图标（可使用Ant Design Icons）
- 错误信息（生产环境隐藏技术细节）
- 操作按钮（刷新页面、返回首页）

请生成完整的错误边界组件代码。

```

---

## 🎯 模块18：打包配置

### 提示词 18.1：生产环境优化

```

请优化Vite生产环境构建配置，修改 vite.config.ts：

优化项：

1. 代码分割

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'antd': ['antd', '@ant-design/icons'],
        'utils': ['axios', 'dayjs', 'zustand'],
      }
    }
  }
}
```

2. 压缩优化

```typescript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,  // 移除console
      drop_debugger: true,
    },
  },
}
```

3. 资源内联限制

```typescript
build: {
  assetsInlineLimit: 4096, // 小于4KB的资源转为base64
}
```

4. CSS代码分割

```typescript
build: {
  cssCodeSplit: true,
}
```

5. 设置构建目标

```typescript
build: {
  outDir: 'dist',
  assetsDir: 'assets',
  sourcemap: false,  // 生产环境不生成sourcemap
  chunkSizeWarningLimit: 1000,
}
```

请生成优化后的完整 vite.config.ts 文件。

```

---

## 🎯 模块19：文档和说明

### 提示词 19.1：README

```

请创建项目 README.md 文档，包含以下内容：

1. 项目简介
   - 项目名称
   - 项目描述
   - 技术栈

2. 功能特性
   - 用户认证（登录、注册、登出）
   - OJ账号绑定（洛谷、力扣）
   - 排行榜展示
   - 数据统计

3. 快速开始
   - 环境要求（Node.js >= 18）
   - 安装依赖
   - 启动开发服务器
   - 构建生产版本

4. 项目结构
   - 目录说明
   - 文件说明

5. 开发指南
   - 代码规范
   - Git提交规范
   - 分支管理

6. 部署说明
   - 构建命令
   - 部署步骤
   - 环境变量配置

7. 常见问题
   - 依赖安装失败
   - 端口冲突
   - Token刷新问题

8. 更新日志

请生成完整专业的 README.md 文档。

```

---

## 📋 使用说明

### 如何使用本文档

1. **按顺序开发**：
   - 从模块1开始，依次完成每个模块
   - 前一个模块是后一个模块的基础

2. **复制提示词**：
   - 直接复制对应模块的提示词
   - 发送给AI（Claude/ChatGPT/Cursor）
   - AI会生成详细的代码

3. **检查生成代码**：
   - AI生成的代码可能有小问题
   - 需要人工review和调整
   - 确保类型安全、错误处理完整

4. **测试验证**：
   - 每个模块完成后进行测试
   - 确保功能正常
   - 再进行下一个模块

### 开发顺序建议

```

第1天：模块1（项目初始化）
第2天：模块2（API服务）+ 模块3（状态管理）
第3天：模块4（公共组件）+ 模块5（认证模块）
第4天：模块6（主页布局）+ 模块7（OJ绑定卡片）
第5天：模块8（排行榜）+ 模块9（路由）
第6天：模块10（工具函数）+ 模块11（全局样式）
第7天：模块12（Hooks）+ 模块13（轮播背景）
第8天：模块14（集成测试）+ 模块15（性能优化）
第9天：模块16（环境配置）+ 模块17（错误处理）
第10天：模块18（打包配置）+ 模块19（文档）

```

### 提示词优化技巧

1. **添加上下文**：
   - 提供更多细节信息
   - 说明与其他组件的关系
   - 给出具体的使用示例

2. **分步骤实现**：
   - 复杂模块拆分成多个小提示词
   - 逐步完成，降低出错率

3. **要求输出格式**：
   - 指定文件名和路径
   - 要求代码注释
   - 要求TypeScript类型定义

---

## 🎯 附录：完整项目提示词

### A. 完整项目生成提示词

```

请基于以下需求文档，完整生成个人助手前端项目：

需求文档路径：./requirement.md

技术要求：

1. React 18 + TypeScript + Vite
2. Ant Design 5（UI组件库）
3. Tailwind CSS 3（样式）
4. React Router 6（路由）
5. Axios 1（HTTP客户端）
6. Zustand 4（状态管理）
7. React Query 5（数据请求缓存）

功能模块：

1. 用户认证（登录、注册、登出）
2. OJ账号绑定（洛谷、力扣）
3. 排行榜展示（支持切换）
4. 个人数据卡片（翻转动画）
5. 轮播背景（4秒切换）

页面：

- 登录页（/login）
- 注册页（/register）
- 主页（/）

设计规范：

- 版心：1200px
- 主色调：#1890FF（蓝色）
- 圆角：登录框16px、卡片12px、按钮6px
- 动画：ease-out、ease-in-out

请生成完整项目代码，包含：

1. 完整的目录结构
2. 所有组件代码
3. 路由配置
4. 状态管理
5. API服务封装
6. 工具函数
7. 全局样式
8. TypeScript类型定义

代码要求：

- TypeScript严格模式
- 完整的类型定义
- 详细的代码注释
- 错误边界处理
- 响应式设计
- 性能优化（代码分割、懒加载）

请分文件生成，每个组件一个文件，并在回复中说明文件路径。

```

---

## 🎯 快速开始

### 推荐的AI工具

1. **代码生成**：
   - Claude（推荐）：代码质量高，理解能力强
   - ChatGPT：功能全面
   - Cursor：AI代码编辑器

2. **代码审查**：
   - GitHub Copilot：代码补全和review
   - CodeRabbit：PR审查

3. **UI设计**：
   - Galileo AI：AI生成UI设计稿
   - Uizard：AI设计工具

### 开发工作流

```

1. 准备阶段
   ├─ 让AI生成UI设计稿（基于requirement.md）
   ├─ 让AI生成数据库设计
   └─ 让AI生成项目结构

2. 开发阶段
   ├─ 逐个模块生成代码
   ├─ 人工review和调整
   ├─ 测试功能
   └─ 修复bug

3. 优化阶段
   ├─ 性能优化
   ├─ 代码重构
   └─ 添加注释

4. 部署阶段
   ├─ 构建生产版本
   ├─ 配置环境变量
   └─ 部署到服务器

```

---

**文档结束**

祝AI开发顺利！
```
