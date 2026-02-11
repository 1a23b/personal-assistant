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
    success: '<svg viewBox="64 64 896 896" focusable="false" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg>',
    error: '<svg viewBox="64 64 896 896" focusable="false" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg>',
    warning: '<svg viewBox="64 64 896 896" focusable="false" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg>',
    info: '<svg viewBox="64 64 896 896" focusable="false" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg>'
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
/* 样式已迁移至 index.css */
</style>
