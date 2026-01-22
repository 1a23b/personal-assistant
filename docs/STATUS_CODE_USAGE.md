# 业务状态码使用指南

本文档展示如何在项目中处理各种业务状态码。

## 1. 基础使用

### 1.1 判断成功状态

```typescript
import { isSuccessStatusCode } from '@/constants/status'

// 在 Service 层或组件中
if (isSuccessStatusCode(response.code)) {
  // 处理成功逻辑
}
```

### 1.2 获取状态码对应的错误消息

```typescript
import { getStatusMessage } from '@/constants/status'

try {
  const response = await bindOJ({ platform, identifier })

  if (isSuccessStatusCode(response.code)) {
    message.success('绑定成功')
  } else {
    // 自动获取状态码对应的错误消息
    const errorMsg = getStatusMessage(response.code)
    message.error(errorMsg)
  }
} catch (error) {
  // 使用 fallback 消息
  message.error(getStatusMessage(0, '网络错误，请检查连接'))
}
```

## 2. 在组件中处理业务错误

### 2.1 登录组件示例

```typescript
import { message } from '@/components/common'
import { authStore } from '@/stores/auth'
import {
  isSuccessStatusCode,
  getStatusMessage,
  isCaptchaError
} from '@/constants/status'

const handleLogin = async () => {
  try {
    loading.value = true
    const response = await authStore.login(phone, password, captcha, captchaId)

    if (isSuccessStatusCode(response.code)) {
      message.success('登录成功')
      router.push('/home')
    } else {
      // 根据状态码获取对应的错误消息
      const errorMsg = getStatusMessage(response.code)

      // 如果是验证码错误，刷新验证码
      if (isCaptchaError(response.code)) {
        captchaRef.value?.refresh()
      }

      message.error(errorMsg)
    }
  } catch (error: any) {
    message.error(error.response?.data?.message || '登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
```

### 2.2 注册组件示例

```typescript
import {
  isSuccessStatusCode,
  getStatusMessage,
  isUserExistsError
} from '@/constants/status'

const handleRegister = async () => {
  try {
    loading.value = true
    const response = await authStore.register(username, phone, password, captcha, captchaId)

    if (isSuccessStatusCode(response.code)) {
      message.success('注册成功')
      router.push('/home')
    } else {
      // 获取错误消息
      const errorMsg = getStatusMessage(response.code)

      // 特殊处理：用户已存在
      if (isUserExistsError(response.code)) {
        message.warning(errorMsg)
        // 可以引导用户去登录页
      } else {
        message.error(errorMsg)
        // 刷新验证码
        captchaRef.value?.refresh()
      }
    }
  } catch (error: any) {
    message.error(error.response?.data?.message || '注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
```

### 2.3 OJ 绑定组件示例

```typescript
import {
  isSuccessStatusCode,
  getStatusMessage,
  isOJBindError
} from '@/constants/status'

const handleBind = async () => {
  try {
    loading.value = true
    const response = await bindOJ({ platform, identifier })

    if (isSuccessStatusCode(response.code)) {
      message.success('绑定成功')
      await loadOJStats()
    } else {
      const errorMsg = getStatusMessage(response.code)

      // 特殊处理：OJ 绑定错误
      if (isOJBindError(response.code)) {
        if (response.code === 4040) {
          // OJ_ALREADY_BOUND - 提示用户重新绑定
          showRebindConfirm.value = true
        } else {
          message.error(errorMsg)
        }
      } else {
        message.error(errorMsg)
      }
    }
  } catch (error: any) {
    message.error(error.response?.data?.message || '绑定失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
```

## 3. 状态码判断工具函数

### 3.1 可用的判断函数

```typescript
import {
  isSuccessStatusCode,     // 判断是否成功
  isTokenError,            // 判断是否 Token 错误
  shouldReLogin,           // 判断是否需要重新登录
  isCaptchaError,          // 判断是否验证码错误
  isUserExistsError,       // 判断是否用户已存在
  isOJBindError           // 判断是否 OJ 绑定错误
} from '@/constants/status'

// 使用示例
if (isCaptchaError(code)) {
  // 刷新验证码
  captchaRef.value?.refresh()
}

if (shouldReLogin(code)) {
  // 清除本地存储，跳转登录页
  authStore.logout()
  router.push('/login')
}
```

## 4. 添加新的业务状态码

### 4.1 在 status.ts 中添加

```typescript
// 1. 在 StatusCode 枚举中添加
export enum StatusCode {
  // ... 现有状态码

  /** 新的业务状态码 */
  NEW_ERROR_CODE = 4050
}

// 2. 在 StatusCodeMessages 中添加对应消息
export const StatusCodeMessages: Record<StatusCode, string> = {
  // ... 现有消息
  [StatusCode.NEW_ERROR_CODE]: '新的错误提示信息'
}

// 3. （可选）添加判断函数
export function isNewError(code: number): boolean {
  return code === StatusCode.NEW_ERROR_CODE
}
```

### 4.2 在组件中使用

```typescript
import { getStatusMessage } from '@/constants/status'

const errorMsg = getStatusMessage(4050) // '新的错误提示信息'
message.error(errorMsg)
```

## 5. 最佳实践

### 5.1 统一的错误处理模式

```typescript
// ✅ 推荐：使用 getStatusMessage
if (!isSuccessStatusCode(response.code)) {
  const errorMsg = getStatusMessage(response.code, response.message)
  message.error(errorMsg)
}

// ❌ 不推荐：硬编码错误消息
if (response.code === 4029) {
  message.error('该手机号已被注册')
} else if (response.code === 4030) {
  message.error('该用户名已被使用')
}
```

### 5.2 使用后端返回的自定义消息

```typescript
// 优先使用后端返回的 message，如果没有则使用预定义的消息
const errorMsg = response.message || getStatusMessage(response.code)
message.error(errorMsg)
```

### 5.3 结合 axios 拦截器统一处理

```typescript
// utils/request.ts
import { getStatusMessage, shouldReLogin } from '@/constants/status'
import { message } from '@/components/common'

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { response } = error

    if (response?.data?.code) {
      const code = response.data.code
      const backendMessage = response.data.message

      // 判断是否需要重新登录
      if (shouldReLogin(code)) {
        message.error('登录已过期，请重新登录')
        authStore.logout()
        router.push('/login')
        return Promise.reject(error)
      }

      // 其他错误：使用后端消息或预定义消息
      const errorMsg = backendMessage || getStatusMessage(code)
      message.error(errorMsg)
    }

    return Promise.reject(error)
  }
)
```

## 6. 完整状态码列表

| 状态码 | 枚举名 | 错误消息 |
|--------|--------|----------|
| 2000 | SUCCESS | 操作成功 |
| 4000 | BAD_REQUEST | 请求参数错误 |
| 4010 | UNAUTHORIZED | 未授权，请先登录 |
| 4011 | TOKEN_EXPIRED | Token 已过期，请重新登录 |
| 4012 | TOKEN_MALFORMED | Token 格式错误 |
| 4013 | TOKEN_INVALID | Token 无效 |
| 4014 | USER_NOT_FOUND | 用户不存在 |
| 4015 | USER_FROZEN | 用户已被冻结 |
| 4020 | CAPTCHA_ERROR | 验证码错误 |
| 4021 | CAPTCHA_EXPIRED | 验证码已过期 |
| 4022 | CAPTCHA_NOT_FOUND | 验证码不存在 |
| 4029 | PHONE_ALREADY_EXISTS | 该手机号已被注册 |
| 4030 | USERNAME_ALREADY_EXISTS | 该用户名已被使用 |
| 4031 | PHONE_NOT_EXISTS | 手机号不存在 |
| 4032 | PASSWORD_ERROR | 密码错误 |
| 4033 | ACCOUNT_OR_PASSWORD_ERROR | 账号或密码错误 |
| 4040 | OJ_ALREADY_BOUND | 该 OJ 账号已绑定 |
| 4041 | OJ_NOT_FOUND | OJ 账号不存在 |
| 4042 | OJ_BIND_FAILED | OJ 账号绑定失败 |
| 4230 | FORBIDDEN | 权限不足，禁止访问 |
| 4290 | TOO_MANY_REQUESTS | 请求过于频繁，请稍后再试 |
| 5000 | SERVER_ERROR | 服务器内部错误 |
