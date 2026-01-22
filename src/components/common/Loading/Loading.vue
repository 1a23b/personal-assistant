<script setup lang="ts">
import { computed } from 'vue'
import type { LoadingProps } from './types'

interface Props extends LoadingProps {}

const props = withDefaults(defineProps<Props>(), {
  loading: true,
  size: 'medium',
  type: 'spinner',
  text: '',
  fullscreen: false,
  background: 'rgba(255, 255, 255, 0.9)',
  textColor: '#595959'
})

// 计算加载器尺寸
const spinnerSize = computed(() => {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32
  }
  return sizeMap[props.size]
})
</script>

<template>
  <Teleport to="body">
    <Transition name="loading-fade">
      <div
        v-if="loading"
        :class="['loading-container', { 'loading-fullscreen': fullscreen }]"
        :style="{ background: fullscreen ? background : 'transparent' }"
      >
        <div class="loading-content">
          <!-- Spinner 类型 -->
          <div v-if="type === 'spinner'" class="loading-spinner" :style="{ width: `${spinnerSize}px`, height: `${spinnerSize}px` }">
            <svg class="spinner" viewBox="0 0 50 50">
              <circle class="path" cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
            </svg>
          </div>

          <!-- Dots 类型 -->
          <div v-else-if="type === 'dots'" :class="['loading-dots', `loading-dots-${size}`]">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>

          <!-- Bars 类型 -->
          <div v-else-if="type === 'bars'" :class="['loading-bars', `loading-bars-${size}`]">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>

          <!-- 加载文本 -->
          <div v-if="text" class="loading-text" :style="{ color: textColor }">
            {{ text }}
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-fullscreen {
  position: fixed;
  z-index: 2000;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* Spinner 样式 */
.loading-spinner {
  color: #1890ff;
}

.spinner {
  width: 100%;
  height: 100%;
  animation: rotate 2s linear infinite;
}

.spinner .path {
  stroke: currentColor;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* Dots 样式 */
.loading-dots {
  display: flex;
  gap: 8px;
  align-items: center;
}

.loading-dots .dot {
  display: inline-block;
  background-color: #1890ff;
  border-radius: 50%;
  animation: dots-bounce 1.4s infinite ease-in-out both;
}

.loading-dots-small .dot {
  width: 6px;
  height: 6px;
}

.loading-dots-medium .dot {
  width: 8px;
  height: 8px;
}

.loading-dots-large .dot {
  width: 10px;
  height: 10px;
}

.loading-dots .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots .dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dots-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Bars 样式 */
.loading-bars {
  display: flex;
  gap: 4px;
  align-items: center;
}

.loading-bars .bar {
  display: inline-block;
  background-color: #1890ff;
  border-radius: 2px;
  animation: bars-stretch 1.2s infinite ease-in-out;
}

.loading-bars-small .bar {
  width: 3px;
  height: 16px;
}

.loading-bars-medium .bar {
  width: 4px;
  height: 24px;
}

.loading-bars-large .bar {
  width: 5px;
  height: 32px;
}

.loading-bars .bar:nth-child(1) {
  animation-delay: -1.1s;
}

.loading-bars .bar:nth-child(2) {
  animation-delay: -1.0s;
}

.loading-bars .bar:nth-child(3) {
  animation-delay: -0.9s;
}

@keyframes bars-stretch {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}

/* 加载文本 */
.loading-text {
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
}

/* 动画 */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.3s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
</style>
