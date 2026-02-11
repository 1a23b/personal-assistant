<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from './types'

interface Props extends ButtonProps {}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
  htmlType: 'button',
  block: false,
  ghost: false,
  danger: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    return
  }
  emit('click', event)
}

// 计算按钮样式类
const buttonClass = computed(() => {
  const classes: string[] = ['btn', `btn-${props.type}`, `btn-${props.size}`]

  if (props.disabled) {
    classes.push('btn-disabled')
  }

  if (props.loading) {
    classes.push('btn-loading')
  }

  if (props.block) {
    classes.push('btn-block')
  }

  if (props.ghost) {
    classes.push('btn-ghost')
  }

  if (props.danger && props.type === 'default') {
    classes.push('btn-danger')
  }

  return classes.join(' ')
})
</script>

<template>
  <button
    :class="buttonClass"
    :type="htmlType"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="btn-loading-icon">
      <svg class="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="spinner-circle-bg" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="spinner-circle-fg"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </span>
    <span v-if="icon && !loading" class="btn-icon">
      {{ icon }}
    </span>
    <span class="btn-content">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
/* 基础样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: 6px;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
  white-space: nowrap;
}

.btn:focus {
  outline: 2px solid rgba(24, 144, 255, 0.2);
  outline-offset: 2px;
}

/* 尺寸 */
.btn-small {
  padding: 0.25rem 0.75rem;
  font-size: 12px;
  height: 28px;
}

.btn-medium {
  padding: 0.375rem 1rem;
  font-size: 14px;
  height: 36px;
}

.btn-large {
  padding: 0.5rem 1.5rem;
  font-size: 16px;
  height: 44px;
}

/* 按钮类型 - 默认 */
.btn-default {
  background-color: #ffffff;
  border-color: #d9d9d9;
  color: #262626;
}

.btn-default:hover:not(.btn-disabled):not(.btn-loading) {
  background-color: #ffffff;
  border-color: #40a9ff;
  color: #40a9ff;
}

.btn-default:active:not(.btn-disabled):not(.btn-loading) {
  background-color: #ffffff;
  border-color: #096dd9;
  color: #096dd9;
}

/* 按钮类型 - 主要 */
.btn-primary {
  background-color: #1890ff;
  border-color: #1890ff;
  color: #ffffff;
}

.btn-primary:hover:not(.btn-disabled):not(.btn-loading) {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

.btn-primary:active:not(.btn-disabled):not(.btn-loading) {
  background-color: #096dd9;
  border-color: #096dd9;
}

/* 按钮类型 - 成功 */
.btn-success {
  background-color: #52c41a;
  border-color: #52c41a;
  color: #ffffff;
}

.btn-success:hover:not(.btn-disabled):not(.btn-loading) {
  background-color: #73d13d;
  border-color: #73d13d;
}

.btn-success:active:not(.btn-disabled):not(.btn-loading) {
  background-color: #389e0d;
  border-color: #389e0d;
}

/* 按钮类型 - 警告 */
.btn-warning {
  background-color: #faad14;
  border-color: #faad14;
  color: #ffffff;
}

.btn-warning:hover:not(.btn-disabled):not(.btn-loading) {
  background-color: #ffc53d;
  border-color: #ffc53d;
}

.btn-warning:active:not(.btn-disabled):not(.btn-loading) {
  background-color: #d48806;
  border-color: #d48806;
}

/* 按钮类型 - 危险 */
.btn-danger {
  background-color: #f5222d;
  border-color: #f5222d;
  color: #ffffff;
}

.btn-danger:hover:not(.btn-disabled):not(.btn-loading) {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

.btn-danger:active:not(.btn-disabled):not(.btn-loading) {
  background-color: #cf1322;
  border-color: #cf1322;
}

/* 危险按钮（仅用于 type="default"） */
.btn-default.btn-danger {
  color: #f5222d;
  border-color: #f5222d;
  background-color: #ffffff;
}

.btn-default.btn-danger:hover:not(.btn-disabled):not(.btn-loading) {
  color: #ff4d4f;
  border-color: #ff4d4f;
  background-color: #fff1f0;
}

/* 幽灵按钮 */
.btn-ghost {
  background-color: transparent !important;
}

.btn-primary.btn-ghost {
  color: #1890ff;
  border-color: #1890ff;
}

.btn-primary.btn-ghost:hover:not(.btn-disabled):not(.btn-loading) {
  color: #40a9ff;
  border-color: #40a9ff;
  background-color: rgba(24, 144, 255, 0.1) !important;
}

/* 禁用状态 */
.btn-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-default.btn-disabled {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  color: #8c8c8c;
}

.btn-primary.btn-disabled,
.btn-success.btn-disabled,
.btn-warning.btn-disabled,
.btn-danger.btn-disabled {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  color: #8c8c8c;
}

/* 加载状态 */
.btn-loading {
  cursor: default;
}

/* 加载图标 */
.btn-loading-icon svg {
  width: 1em;
  height: 1em;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

.spinner-circle-bg {
  opacity: 0.25;
}

.spinner-circle-fg {
  opacity: 0.75;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 块级按钮 */
.btn-block {
  display: flex;
  width: 100%;
}

/* 图标 */
.btn-icon {
  display: inline-flex;
  align-items: center;
}
</style>
