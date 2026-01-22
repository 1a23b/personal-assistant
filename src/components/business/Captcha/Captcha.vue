<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Input } from "@/components/common";
import { getCaptcha } from "@/services/auth.service";
import type { CaptchaProps } from "./types";

interface Props extends CaptchaProps { }

const props = withDefaults(defineProps<Props>(), {
  width: 120,
  height: 40,
  placeholder: "请输入验证码",
  autoRefresh: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", captchaId: string, captchaCode: string): void;
}>();

const captchaId = ref("");
const captchaImage = ref("");
const captchaCode = ref("");
const loading = ref(false);

// 验证码图片样式
const captchaStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
}));

// 获取验证码
const fetchCaptcha = async () => {
  try {
    loading.value = true;
    const data = await getCaptcha({
      skipSuccTip: true, // 成功不提示
      customErrTip: '验证码加载失败，请检查网络'
    });

    // ✅ 优化：直接使用返回数据，无需判断 code
    captchaId.value = data.captcha_id;
    captchaImage.value = data.pic_path;

    // 触发 change 事件
    emit("change", captchaId.value, captchaCode.value);
  } catch (error) {
    console.error("获取验证码失败:", error);
  } finally {
    loading.value = false;
  }
};

// 刷新验证码
const refreshCaptcha = () => {
  captchaCode.value = "";
  fetchCaptcha();
};

// 处理输入变化
const handleInput = (value: string | number) => {
  captchaCode.value = String(value);
  emit("update:modelValue", captchaCode.value);

  // 如果输入了验证码，触发 change 事件
  if (captchaCode.value) {
    emit("change", captchaId.value, captchaCode.value);
  }
};

// 组件挂载时获取验证码
onMounted(() => {
  fetchCaptcha();
});

// 暴露刷新方法
defineExpose({
  refresh: refreshCaptcha,
});
</script>

<template>
  <div class="captcha-container">
    <div class="captcha-input-wrapper">
      <Input :model-value="captchaCode" :placeholder="placeholder" @update:model-value="handleInput" />
    </div>

    <div class="captcha-image-wrapper" :style="captchaStyle" @click="refreshCaptcha">
      <img v-if="captchaImage" :src="captchaImage" alt="验证码" class="captcha-image" />
      <div v-else class="captcha-loading">
        <div class="spinner"></div>
      </div>

      <!-- 刷新按钮 -->
      <div class="captcha-refresh-hint">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.captcha-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-input-wrapper {
  flex: 1;
}

.captcha-image-wrapper {
  position: relative;
  flex-shrink: 0;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.captcha-image-wrapper:hover {
  border-color: #1890ff;
}

.captcha-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.captcha-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.captcha-refresh-hint {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s;
}

.captcha-image-wrapper:hover .captcha-refresh-hint {
  opacity: 1;
}

.captcha-refresh-hint svg {
  width: 20px;
  height: 20px;
  color: #ffffff;
}

/* Loading 动画 */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1890ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
