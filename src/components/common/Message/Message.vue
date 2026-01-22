<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { MessageProps, MessageType } from './types'

interface Props extends MessageProps {}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
  closable: false,
  id: ''
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(false)
const timer = ref<number>()

// 计算图标
const icon = computed(() => {
  const iconMap: Record<MessageType, string> = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
  }
  return iconMap[props.type]
})

// 计算消息样式类
const messageClass = computed(() => {
  const classes: string[] = ['message-item', `message-${props.type}`]

  if (visible.value) {
    classes.push('message-visible')
  }

  return classes.join(' ')
})

// 关闭消息
const close = () => {
  visible.value = false
  emit('close')
}

// 启动计时器
const startTimer = () => {
  if (props.duration > 0) {
    timer.value = window.setTimeout(() => {
      close()
    }, props.duration)
  }
}

// 清除计时器
const clearTimer = () => {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = undefined
  }
}

// 鼠标移入暂停计时器
const handleMouseEnter = () => {
  clearTimer()
}

// 鼠标移出恢复计时器
const handleMouseLeave = () => {
  startTimer()
}

// 组件挂载时显示消息
onMounted(() => {
  visible.value = true
  startTimer()
})
</script>

<template>
  <Transition name="message-slide">
    <div
      v-if="visible"
      :class="messageClass"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- 图标 -->
      <span class="message-icon" v-html="icon"></span>

      <!-- 内容 -->
      <span class="message-content">{{ content }}</span>

      <!-- 关闭按钮 -->
      <button v-if="closable" class="message-close" @click="close">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.message-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 300px;
  max-width: 500px;
  padding: 12px 16px;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s ease;
}

/* 消息类型 */
.message-success {
  border-left: 4px solid #52c41a;
}

.message-success .message-icon {
  color: #52c41a;
}

.message-error {
  border-left: 4px solid #f5222d;
}

.message-error .message-icon {
  color: #f5222d;
}

.message-warning {
  border-left: 4px solid #faad14;
}

.message-warning .message-icon {
  color: #faad14;
}

.message-info {
  border-left: 4px solid #1890ff;
}

.message-info .message-icon {
  color: #1890ff;
}

/* 图标 */
.message-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.message-icon svg {
  width: 18px;
  height: 18px;
}

/* 内容 */
.message-content {
  flex: 1;
  color: #595959;
}

/* 关闭按钮 */
.message-close {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding: 2px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #8c8c8c;
  transition: color 0.2s;
  border-radius: 4px;
}

.message-close:hover {
  color: #262626;
  background-color: #f5f5f5;
}

.message-close svg {
  width: 14px;
  height: 14px;
}

/* 动画 */
.message-slide-enter-active,
.message-slide-leave-active {
  transition: all 0.3s ease;
}

.message-slide-enter-from,
.message-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.message-visible {
  opacity: 1;
  transform: translateX(0);
}
</style>
