# Axios 自定义配置使用指南

本文档展示如何在项目中使用 Axios 自定义配置来控制消息提示行为。

## 📋 自定义配置项

| 配置项 | 类型 | 说明 | 使用场景 |
|--------|------|------|----------|
| `skipTip` | boolean | 完全静默，成功/失败都不弹提示 | 列表查询、下拉框数据请求 |
| `skipErrTip` | boolean | 失败不弹提示，成功正常提示 | 收藏、点赞等操作 |
| `skipSuccTip` | boolean | 成功不弹提示，失败正常提示 | 表单提交、登录、支付 |
| `customErrTip` | string | 自定义失败提示文案 | 需要特定错误提示时 |
| `customSuccTip` | string | 自定义成功提示文案 | 需要特定成功提示时 |

## 💡 使用示例

### 1. Service 层使用

在 Service 层，需要将 `RequestConfig` 类型传递给 Axios：

```typescript
// services/oj.service.ts
import apiClient, { type RequestConfig } from '@/utils/request'
import type { OJBindRequest, OJBindResponse } from '@/types'

/**
 * 绑定 OJ 账号
 */
export function bindOJ(
  data: OJBindRequest,
  config?: RequestConfig // ✅ 接收自定义配置
): Promise<ApiResponse<OJBindResponse>> {
  return apiClient.post<ApiResponse<OJBindResponse>>('/oj/bind', data, config).then((res) => res.data)
}

/**
 * 获取用户 OJ 卡片信息（静默请求）
 */
export function getOJStats(
  platform: 'luogu' | 'leetcode',
  config?: RequestConfig
): Promise<ApiResponse<OJStatsResponse>> {
  return apiClient
    .get<ApiResponse<OJStatsResponse>>('/oj/stats', {
      params: { platform },
      ...config // ✅ 传递自定义配置
    })
    .then((res) => res.data)
}
```

### 2. 组件中使用

#### 场景 1：完全静默（skipTip）

**适用于**：列表查询、下拉框数据加载等不需要提示的场景

```typescript
import { getRankingList } from '@/services/oj.service'

// ✅ 列表查询：不需要任何提示
const fetchRankingList = async () => {
  try {
    const response = await getRankingList('luogu', 1, 20, {
      skipTip: true // ✅ 完全静默
    })

    rankList.value = response.data.list
    myRank.value = response.data.my_rank
  } catch (error) {
    // 失败也不会弹提示，自己处理
    console.error('获取排行榜失败:', error)
  }
}
```

#### 场景 2：失败不提示（skipErrTip）

**适用于**：收藏、点赞等操作，失败时不打扰用户

```typescript
import { toggleFavorite } from '@/services/user.service'

// ✅ 收藏操作：失败不弹提示
const handleFavorite = async () => {
  try {
    await toggleFavorite(problemId, {
      skipErrTip: true // ✅ 失败不弹提示
    })

    // 成功会弹默认提示 "操作成功"
    isFavorite.value = !isFavorite.value
  } catch (error) {
    // 失败静默处理
    isFavorite.value = !isFavorite.value
  }
}
```

#### 场景 3：成功不提示（skipSuccTip）

**适用于**：表单提交、登录等，成功后通过页面跳转或状态变化反馈

```typescript
import { authService } from '@/services/auth.service'

// ✅ 登录操作：成功不弹提示
const handleLogin = async () => {
  try {
    const response = await authService.login(
      {
        phone: phone.value,
        password: password.value,
        captcha: captcha.value,
        captcha_id: captchaId.value
      },
      {
        skipSuccTip: true // ✅ 成功不弹提示
      }
    )

    // 登录成功，跳转到首页
    router.push('/home')
  } catch (error) {
    // 失败会自动弹提示（根据 status.ts 中的业务码）
    captchaRef.value?.refresh()
  }
}
```

#### 场景 4：自定义成功提示（customSuccTip）

**适用于**：需要特定成功提示文案的场景

```typescript
import { bindOJ } from '@/services/oj.service'

// ✅ 绑定操作：自定义成功提示
const handleBind = async () => {
  try {
    loading.value = true
    await bindOJ(
      {
        platform: 'luogu',
        identifier: identifier.value
      },
      {
        customSuccTip: '洛谷账号绑定成功！数据同步中...' // ✅ 自定义成功提示
      }
    )

    await loadOJStats()
  } catch (error) {
    // 失败会自动弹提示
  } finally {
    loading.value = false
  }
}
```

#### 场景 5：自定义失败提示（customErrTip）

**适用于**：需要特定错误提示文案的场景

```typescript
import { authService } from '@/services/auth.service'

// ✅ 登录操作：自定义失败提示
const handleLogin = async () => {
  try {
    const response = await authService.login(
      {
        phone: phone.value,
        password: password.value,
        captcha: captcha.value,
        captcha_id: captchaId.value
      },
      {
        skipSuccTip: true,
        customErrTip: '账号或密码错误，请核对后重试' // ✅ 自定义失败提示
      }
    )

    router.push('/home')
  } catch (error) {
    captchaRef.value?.refresh()
  }
}
```

#### 场景 6：组合使用

```typescript
// ✅ 表单提交：成功自定义提示，失败不跳转
const handleSubmit = async () => {
  try {
    await submitForm(formData, {
      skipSuccTip: true,        // 不弹默认成功提示
      customErrTip: '提交失败，请检查网络连接'
    })

    // 自己处理成功提示
    message.success('您的申请已提交，我们将尽快审核')
    router.push('/success')
  } catch (error) {
    // 失败已弹 customErrTip
  }
}
```

## 🔧 响应拦截器逻辑说明

### 提示优先级

#### 成功提示
```
customSuccTip > res.message > '操作成功'
```

#### 失败提示
```
customErrTip > getStatusMessage(res.code) > res.message > '操作失败，请稍后重试'
```

### 业务码处理

响应拦截器会自动处理以下业务码：

| 状态码 | 处理逻辑 |
|--------|----------|
| 2000 (SUCCESS) | 返回数据，弹成功提示（除非 skipTip/skipSuccTip） |
| 4010-4015 (认证相关) | 清除本地存储，跳转登录页 |
| 4029-4033 (注册/登录错误) | 弓弹错误提示，刷新验证码 |
| 4040-4042 (OJ 绑定错误) | 弹错误提示，由组件处理具体逻辑 |
| 4230 (FORBIDDEN) | 弹 warning 而非 error |
| 其他 | 弹错误提示 |

### HTTP 状态码处理

| HTTP 状态码 | 处理逻辑 |
|-------------|----------|
| 401 | 尝试刷新 Token，重试原请求 |
| 404/500 等 | 弹错误提示（除非 skipTip/skipErrTip） |

## 📝 完整示例

### OJCard 组件

```typescript
import { bindOJ, getOJStats } from '@/services/oj.service'
import type { RequestConfig } from '@/utils/request'

/**
 * 加载 OJ 信息（完全静默）
 */
const loadOJStats = async () => {
  try {
    isLoading.value = true

    // ✅ 静默请求，不弹任何提示
    const response = await getOJStats(props.platform, {
      skipTip: true
    })

    if (isSuccessStatusCode(response.code)) {
      userInfo.value = response.data
      isBound.value = true
    } else {
      isBound.value = false
      userInfo.value = null
    }
  } catch (error) {
    isBound.value = false
    userInfo.value = null
  } finally {
    isLoading.value = false
  }
}

/**
 * 绑定 OJ 账号
 */
const handleBind = async () => {
  if (!identifier.value.trim()) {
    message.warning('请输入用户ID')
    return
  }

  try {
    loading.value = true

    const config: RequestConfig = {
      customSuccTip: `${platformName.value}账号绑定成功！`, // ✅ 自定义成功提示
      skipErrTip: false // 失败弹提示
    }

    const response = await bindOJ(
      {
        platform: props.platform,
        identifier: identifier.value.trim()
      },
      config
    )

    if (isSuccessStatusCode(response.code)) {
      await loadOJStats()
      identifier.value = ''
      emit('bound', userInfo.value!)
    }
  } catch (error) {
    // 失败已自动弹提示
  } finally {
    loading.value = false
  }
}
```

### LeaderboardCard 组件

```typescript
import { getRankingList } from '@/services/oj.service'

/**
 * 获取排行榜数据（完全静默）
 */
const fetchRankingList = async () => {
  try {
    loading.value = true

    // ✅ 排行榜查询：完全静默
    const response = await getRankingList('luogu', 1, 20, {
      skipTip: true
    })

    if (isSuccessStatusCode(response.code)) {
      luoguRankList.value = response.data.list
      luoguMyRank.value = response.data.my_rank
    } else {
      luoguRankList.value = []
      luoguMyRank.value = null
    }
  } catch (error) {
    luoguRankList.value = []
    luoguMyRank.value = null
  } finally {
    loading.value = false
  }
}
```

## ✅ 最佳实践

### 1. Service 层统一传递 config

```typescript
// ✅ 推荐：Service 层接收 config 参数
export function bindOJ(
  data: OJBindRequest,
  config?: RequestConfig
): Promise<ApiResponse<OJBindResponse>> {
  return apiClient.post('/oj/bind', data, config).then(res => res.data)
}

// ❌ 不推荐：硬编码跳过提示
export function bindOJ(data: OJBindRequest): Promise<...> {
  return apiClient.post('/oj/bind', data, { skipTip: true })
}
```

### 2. 组件层根据场景选择配置

```typescript
// ✅ 推荐：根据业务场景选择合适的配置
await getList({ skipTip: true })                    // 列表查询
await submitForm({ skipSuccTip: true })              // 表单提交
await toggleLike({ skipErrTip: true })               // 点赞操作
await deleteItem({ customErrTip: '删除失败' })       // 删除操作

// ❌ 不推荐：所有请求都用 skipTip
await anyRequest({ skipTip: true })
```

### 3. 优先使用后端消息

```typescript
// ✅ 推荐：让拦截器自动处理提示
try {
  await bindOJ({ platform, identifier })
  // 成功/失败都会自动弹提示
} catch (error) {
  // 只需要处理业务逻辑（如刷新列表）
}

// ❌ 不推荐：手动处理所有提示
try {
  const response = await bindOJ({ platform, identifier })
  if (response.code === 2000) {
    message.success('绑定成功')
  } else {
    message.error('绑定失败')
  }
} catch (error) {
  message.error('绑定失败')
}
```

## 🎯 总结

通过自定义配置，你可以灵活控制每个请求的提示行为：

- **默认行为**：成功/失败都弹提示（使用 status.ts 中的映射）
- **skipTip**：完全静默，适用于列表查询
- **skipErrTip**：失败静默，适用于点赞/收藏
- **skipSuccTip**：成功静默，适用于登录/提交
- **customErrTip/customSuccTip**：自定义提示文案

这样既保证了统一的错误处理，又提供了足够的灵活性！
