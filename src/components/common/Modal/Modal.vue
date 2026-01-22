<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { ModalProps, ModalEmits } from './types'
import { Button } from '../Button'

interface Props extends ModalProps {}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  size: 'medium',
  closable: true,
  mask: true,
  maskClosable: true,
  footer: true,
  okText: '确定',
  cancelText: '取消',
  okLoading: false,
  okDisabled: false,
  cancelDisabled: false,
  keyboard: true,
  width: undefined,
  top: '15vh',
  centered: false
})

const emit = defineEmits<ModalEmits>()

const modalRef = ref<HTMLElement>()
const dialogRef = ref<HTMLElement>()

// 计算弹窗样式类
const modalClass = computed(() => {
  const classes: string[] = ['modal-container']

  if (props.size) {
    classes.push(`modal-${props.size}`)
  }

  if (props.centered) {
    classes.push('modal-centered')
  }

  return classes.join(' ')
})

// 计算弹窗宽度样式
const modalStyle = computed(() => {
  const styles: Record<string, string> = {}

  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  if (!props.centered && props.top) {
    styles.marginTop = typeof props.top === 'number' ? `${props.top}px` : props.top
  }

  return styles
})

// 关闭弹窗
const close = () => {
  emit('update:visible', false)
  emit('close')
}

// 点击遮罩层
const handleMaskClick = () => {
  if (props.mask && props.maskClosable) {
    close()
  }
}

// 确定按钮点击
const handleOk = () => {
  emit('ok')
}

// 取消按钮点击
const handleCancel = () => {
  emit('cancel')
  close()
}

// 关闭按钮点击
const handleClose = () => {
  close()
}

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  if (props.keyboard && event.key === 'Escape' && props.visible) {
    close()
  }
}

// 监听 visible 变化，处理 body 滚动
watch(
  () => props.visible,
  (val) => {
    if (val) {
      // 禁止 body 滚动
      document.body.style.overflow = 'hidden'
    } else {
      // 恢复 body 滚动
      document.body.style.overflow = ''
    }
  },
  { immediate: true }
)

// 组件挂载时添加键盘事件监听
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

// 组件卸载时移除键盘事件监听并恢复 body 滚动
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" ref="modalRef" class="modal-overlay" @click="handleMaskClick">
        <Transition name="modal-slide">
          <div
            v-if="visible"
            ref="dialogRef"
            :class="modalClass"
            :style="modalStyle"
            @click.stop
          >
            <!-- 弹窗头部 -->
            <div v-if="title || $slots.header" class="modal-header">
              <div class="modal-title">
                <slot name="header">{{ title }}</slot>
              </div>
              <button v-if="closable" class="modal-close" @click="handleClose">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- 弹窗内容 -->
            <div class="modal-body">
              <slot></slot>
            </div>

            <!-- 弹窗底部 -->
            <div v-if="footer || $slots.footer" class="modal-footer">
              <slot name="footer">
                <Button type="default" :disabled="cancelDisabled" @click="handleCancel">
                  {{ cancelText }}
                </Button>
                <Button type="primary" :loading="okLoading" :disabled="okDisabled" @click="handleOk">
                  {{ okText }}
                </Button>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 弹窗容器 */
.modal-container {
  position: relative;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

/* 弹窗尺寸 */
.modal-small {
  width: 400px;
}

.modal-medium {
  width: 600px;
}

.modal-large {
  width: 800px;
}

.modal-full {
  width: 100%;
  height: 100%;
  max-height: 100vh;
  border-radius: 0;
}

/* 垂直居中 */
.modal-centered {
  margin: 0;
}

/* 弹窗头部 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  line-height: 1.5;
}

.modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #8c8c8c;
  transition: color 0.2s;
  border-radius: 4px;
}

.modal-close:hover {
  color: #262626;
  background-color: #f5f5f5;
}

.modal-close svg {
  width: 16px;
  height: 16px;
}

/* 弹窗内容 */
.modal-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  color: #595959;
  font-size: 14px;
  line-height: 1.5;
}

/* 弹窗底部 */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 24px;
  border-top: 1px solid #f0f0f0;
}

/* 动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all 0.3s ease;
}

.modal-slide-enter-from,
.modal-slide-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}
</style>
