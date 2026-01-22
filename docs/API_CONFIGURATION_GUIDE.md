# API 配置使用指南

> 📘 本文档详细说明了在不同场景下如何使用 Axios 请求配置来控制消息提示行为

---

## 📋 配置选项概览

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `skipTip` | boolean | 完全静默（成功/失败都不弹提示） |
| `skipSuccTip` | boolean | 成功不弹提示，失败正常提示 |
| `skipErrTip` | boolean | 失败不弹提示，成功正常提示 |
| `customErrTip` | string | 自定义失败提示文案 |
| `customSuccTip` | string | 自定义成功提示文案 |

**优先级（失败提示）**：`customErrTip` > `前端预设文案` > `后端 message` > `默认文案`

---

## 🎯 7大场景配置规范

### 场景1：列表查询 → `skipTip: true`

**场景说明**：获取列表数据时，不需要任何提示（成功/失败都不弹）

**使用频率**：⭐⭐⭐⭐⭐ 最高频

**示例**：
```typescript
// ✅ 正确：获取排行榜列表
const response = await getRankingList('luogu', 1, 20, {
  skipTip: true  // 完全静默
})

// ✅ 正确：获取组织列表
const response = await getOrgList(0, 0, {
  skipTip: true  // 完全静默
})

// ✅ 正确：获取用户OJ信息
const response = await getOJStats('luogu', {
  skipTip: true  // 完全静默
})
```

**应用位置**：
- `src/components/business/LeaderboardCard/LeaderboardCard.vue:195`
- `src/components/business/LeaderboardCard/LeaderboardCard.vue:222`
- `src/views/Auth/RegisterView.vue:131`
- `src/components/business/OJCard/OJCard.vue:164`

---

### 场景2：登录 → `skipSuccTip: true` + 自定义错误

**场景说明**：登录成功后需要跳转页面，不需要成功提示，但需要错误提示

**使用频率**：⭐⭐⭐⭐⭐ 最高频

**示例**：
```typescript
// ✅ 正确：登录成功不弹提示（因为要跳转）
const result = await authStore.login(
  phone.value,
  password.value,
  captcha.value,
  captchaId.value,
  {
    skipSuccTip: true  // 成功不弹提示
  }
)

if (result.success) {
  router.push('/home')  // 跳转页面
}
```

**应用位置**：
- `src/views/Auth/LoginView.vue:63`

---

### 场景3：收藏/点赞 → `skipErrTip: true`

**场景说明**：收藏/点赞等操作，失败不弹提示（静默失败），成功需要提示

**使用频率**：⭐⭐⭐ 中等

**示例**：
```typescript
// ✅ 正确：收藏失败不弹提示
const response = await toggleFavorite(problemId, {
  skipErrTip: true  // 失败不弹提示
})

if (response.code === 2000) {
  // 成功手动处理
  message.success('收藏成功')
}
// 失败完全静默
```

**注意**：当前项目中暂未实现收藏/点赞功能

---

### 场景4：表单提交 → `customSuccTip`

**场景说明**：表单提交成功后，需要明确的成功提示

**使用频率**：⭐⭐⭐⭐⭐ 最高频

**示例**：
```typescript
// ✅ 正确：注册自定义成功提示
const result = await registerApi(
  {
    username: username.value,
    phone: phone.value,
    password: password.value,
    captcha: captcha.value,
    captcha_id: captchaId.value,
    org_id: Number(orgId.value) || 0
  },
  {
    customSuccTip: '注册成功！正在自动登录...'
  }
)

// ✅ 正确：绑定OJ账号自定义成功提示
const response = await bindOJ(
  {
    platform: props.platform,
    identifier: identifier.value.trim()
  },
  {
    customSuccTip: `${platformName.value}账号绑定成功！`
  }
)

// ✅ 正确：重新绑定自定义成功提示
const response = await bindOJ(
  {
    platform: props.platform,
    identifier: identifier.value.trim()
  },
  {
    customSuccTip: `${platformName.value}账号重新绑定成功！`
  }
)
```

**应用位置**：
- `src/views/Auth/RegisterView.vue:96`
- `src/components/business/OJCard/OJCard.vue:203`
- `src/components/business/OJCard/OJCard.vue:245`

---

### 场景5：获取用户信息 → 无配置

**场景说明**：获取用户信息，使用默认提示行为（成功/失败都弹提示）

**使用频率**：⭐⭐⭐ 中等

**示例**：
```typescript
// ✅ 正确：使用默认提示
const response = await getUserInfo()
// 成功弹：操作成功
// 失败弹：后端返回的错误信息或前端预设的错误信息
```

**注意**：当前项目中用户信息在登录时返回，暂无单独的获取用户信息API

---

### 场景6：支付 → 自定义成功和失败

**场景说明**：支付等关键操作，需要自定义成功和失败提示

**使用频率**：⭐ 低

**示例**：
```typescript
// ✅ 正确：支付自定义成功和失败提示
const response = await createOrder(
  {
    productId: productId.value,
    quantity: 1
  },
  {
    customSuccTip: '支付成功！即将跳转到订单页面...',
    customErrTip: '支付失败，请检查余额后重试'
  }
)
```

**注意**：当前项目中暂未实现支付功能

---

### 场景7：GET无参数 → `skipTip: true`

**场景说明**：GET请求无参数时，通常用于获取基础数据，不需要提示

**使用频率**：⭐⭐⭐⭐ 高频

**示例**：
```typescript
// ✅ 正确：获取验证码
const response = await getCaptcha(
  undefined,  // data 参数为空
  {
    skipSuccTip: true,  // 成功不弹提示
    customErrTip: '验证码加载失败，请检查网络'
  }
)

// ✅ 正确：刷新Token（已在拦截器中自动处理，无需配置）
// 自动刷新逻辑在 src/utils/request.ts:140-195
```

**应用位置**：
- `src/components/business/Captcha/Captcha.vue:38`

---

## 📊 当前项目API调用统计

| 场景 | API调用次数 | 文件数量 |
|------|------------|---------|
| 场景1：列表查询 | 4 | 3 |
| 场景2：登录 | 1 | 1 |
| 场景3：收藏/点赞 | 0 | 0 |
| 场景4：表单提交 | 3 | 2 |
| 场景5：获取用户信息 | 0 | 0 |
| 场景6：支付 | 0 | 0 |
| 场景7：GET无参数 | 1 | 1 |
| **总计** | **9** | **5** |

---

## 🔍 完整API调用清单

### 1. auth.service.ts (认证服务)

| API | 场景 | 配置 | 位置 |
|-----|------|------|------|
| `login()` | 场景2 | `skipSuccTip: true` | `LoginView.vue:63` |
| `register()` | 场景4 | `customSuccTip` | `RegisterView.vue:96` |
| `getCaptcha()` | 场景7 | `skipSuccTip: true` + `customErrTip` | `Captcha.vue:38` |
| `getOrgList()` | 场景1 | `skipTip: true` | `RegisterView.vue:131` |
| `logout()` | 场景2 | `skipSuccTip: true` | `auth.ts:85` |

### 2. oj.service.ts (OJ服务)

| API | 场景 | 配置 | 位置 |
|-----|------|------|------|
| `getOJStats()` | 场景1 | `skipTip: true` | `OJCard.vue:164` |
| `bindOJ()` | 场景4 | `customSuccTip` | `OJCard.vue:203` |
| `bindOJ()` (换绑) | 场景4 | `customSuccTip` | `OJCard.vue:245` |
| `getRankingList()` (洛谷) | 场景1 | `skipTip: true` | `LeaderboardCard.vue:195` |
| `getRankingList()` (力扣) | 场景1 | `skipTip: true` | `LeaderboardCard.vue:222` |

---

## 🛡️ 错误处理优先级

当API请求失败时，错误提示的优先级如下：

```typescript
// 1️⃣ 最高优先级：自定义错误文案
customErrTip: '登录失败，请检查手机号和密码'

// 2️⃣ 第二优先级：前端预设错误文案（status.ts）
StatusCodeMessages[4020] = '验证码错误'

// 3️⃣ 第三优先级：后端返回的错误信息
response.message: '用户名或密码错误'

// 4️⃣ 最低优先级：默认错误文案
'操作失败，请稍后重试'
```

**实现代码** (`src/utils/request.ts:90`)：
```typescript
const errText = customErrTip || getStatusMessage(res.code) || res.message || '操作失败，请稍后重试'
```

---

## ✅ 最佳实践

### 1. 列表查询必须静默
```typescript
// ✅ 正确
const list = await getList({ skipTip: true })

// ❌ 错误：会弹出不必要的提示
const list = await getList()
```

### 2. 登录成功不弹提示（因为要跳转）
```typescript
// ✅ 正确
const result = await login(data, { skipSuccTip: true })
if (result.success) router.push('/home')

// ❌ 错误：会弹提示再跳转，体验不好
const result = await login(data)
if (result.success) {
  message.success('登录成功')
  router.push('/home')
}
```

### 3. 表单提交必须明确提示
```typescript
// ✅ 正确
const result = await register(data, {
  customSuccTip: '注册成功！正在自动登录...'
})

// ❌ 错误：提示不够明确
const result = await register(data)  // 只会显示"操作成功"
```

### 4. 验证码等基础数据必须静默
```typescript
// ✅ 正确
const captcha = await getCaptcha(undefined, {
  skipSuccTip: true,
  customErrTip: '验证码加载失败，请检查网络'
})

// ❌ 错误：每次刷新都弹成功提示
const captcha = await getCaptcha()
```

---

## 📝 新增API调用检查清单

当添加新的API调用时，请按照以下步骤检查：

- [ ] 1. 确定API调用属于哪个场景
- [ ] 2. 根据场景选择合适的配置项
- [ ] 3. 确认是否需要自定义提示文案
- [ ] 4. 测试成功和失败的提示效果
- [ ] 5. 更新本文档的API调用清单

---

## 🔗 相关文档

- [业务状态码说明](./STATUS_CODE_USAGE.md)
- [Axios配置详解](./AXIOS_CONFIG_USAGE.md)
- [项目规范文档](../CLAUDE.md)

---

**文档版本**：v1.0.0
**最后更新**：2025-01-20
**维护人**：Claude AI
