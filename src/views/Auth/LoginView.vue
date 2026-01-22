<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Button, Input, message } from "@/components/common";
import { Captcha } from "@/components/business";
import { useAuthStore } from "@/stores/auth";
import {
  validatePhoneDetail,
  validatePasswordDetail,
  validateCaptchaDetail,
} from "@/utils/validate";

const router = useRouter();
const authStore = useAuthStore();

// 表单数据
const phone = ref("");
const password = ref("");
const captcha = ref("");
const captchaId = ref("");

// 状态
const loading = ref(false);
const agreeTerms = ref(false);

// 验证码组件引用
const captchaRef = ref<InstanceType<typeof Captcha>>();

// 表单验证
const validateForm = () => {
  const phoneResult = validatePhoneDetail(phone.value);
  if (!phoneResult.valid) {
    message.warning(phoneResult.message || "验证失败");
    return false;
  }

  const passwordResult = validatePasswordDetail(password.value);
  if (!passwordResult.valid) {
    message.warning(passwordResult.message || "验证失败");
    return false;
  }

  const captchaResult = validateCaptchaDetail(captcha.value);
  if (!captchaResult.valid) {
    message.warning(captchaResult.message || "验证失败");
    return false;
  }

  return true;
};

// 处理登录
const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    loading.value = true;

    // ✅ 登录成功弹提示，失败不自动弹提示（在catch中手动处理）
    const result = await authStore.login(
      phone.value,
      password.value,
      captcha.value,
      captchaId.value,
      {
        skipErrTip: true, // 失败不自动弹提示，在catch中手动处理
      },
    );

    if (result.success) {
      // 登录成功，跳转到首页
      router.push("/home");
    } else {
      // 失败（理论上不会走到这里，因为authStore.login会抛出错误）
      captchaRef.value?.refresh();
    }
  } catch (error: any) {
    // ✅ 手动处理错误提示
    // 优先显示后端返回的 error 字段，否则显示默认提示
    const errorMsg = error.responseData?.error || "登录失败";
    message.error(errorMsg);

    // 刷新验证码
    captchaRef.value?.refresh();
  } finally {
    loading.value = false;
  }
};

// 跳转到注册页
const goToRegister = () => {
  router.push("/register");
};

// 验证码变化
const handleCaptchaChange = (id: string) => {
  captchaId.value = id;
};

// 忘记密码
const handleForgotPassword = () => {
  message.info("忘记密码功能开发中");
};
</script>

<template>
  <div class="login-view">
    <!-- 登录框 -->
    <div class="login-container">
      <div class="login-box">
        <!-- Logo 和标题 -->
        <div class="login-header">
          <h1 class="login-title">个人助手</h1>
          <p class="login-subtitle">登录您的账户</p>
        </div>

        <!-- 登录表单 -->
        <div class="login-form">
          <!-- 手机号 -->
          <div class="form-item">
            <div class="form-label">手机号</div>
            <Input
              v-model="phone"
              type="tel"
              placeholder="请输入手机号"
              :maxlength="11"
              clearable
            />
          </div>

          <!-- 密码 -->
          <div class="form-item">
            <div class="form-label">密码</div>
            <Input
              v-model="password"
              type="password"
              placeholder="请输入密码（8-16位）"
              show-password
              @keydown.enter="handleLogin"
            />
          </div>

          <!-- 验证码 -->
          <div class="form-item">
            <div class="form-label">验证码</div>
            <Captcha
              ref="captchaRef"
              v-model="captcha"
              @change="handleCaptchaChange"
            />
          </div>

          <!-- 记住密码和忘记密码 -->
          <div class="form-actions">
            <label class="checkbox-label">
              <input type="checkbox" v-model="agreeTerms" />
              <span>我已阅读并同意</span>
              <a href="#" class="link">《用户协议》</a>
              <span>和</span>
              <a href="#" class="link">《隐私政策》</a>
            </label>
            <a
              href="#"
              class="link forgot-link"
              @click.prevent="handleForgotPassword"
              >忘记密码？</a
            >
          </div>

          <!-- 登录按钮 -->
          <Button
            type="primary"
            size="large"
            block
            :loading="loading"
            :disabled="!agreeTerms"
            @click="handleLogin"
          >
            登录
          </Button>

          <!-- 注册链接 -->
          <div class="register-link">
            还没有账户？
            <a href="#" class="link" @click.prevent="goToRegister">立即注册</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 登录容器 */
.login-container {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
}

/* 登录框 */
.login-box {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

/* 登录头部 */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #8c8c8c;
}

/* 表单 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

/* 表单操作 */
.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #595959;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
}

.link {
  color: #1890ff;
  text-decoration: none;
  transition: color 0.2s;
}

.link:hover {
  color: #40a9ff;
}

.forgot-link {
  color: #595959;
  text-decoration: none;
}

.forgot-link:hover {
  color: #1890ff;
}

/* 注册链接 */
.register-link {
  text-align: center;
  font-size: 14px;
  color: #595959;
  margin-top: 8px;
}
</style>
