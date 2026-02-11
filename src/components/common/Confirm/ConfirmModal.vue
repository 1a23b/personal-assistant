<script setup lang="ts">
import { ref } from 'vue'
import { Modal } from '../Modal'
import { Button } from '../Button'

interface Props {
  title?: string
  content: string
  type?: 'info' | 'success' | 'warning' | 'error'
  okText?: string
  cancelText?: string
  onOk?: () => void
  onCancel?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '提示',
  type: 'warning',
  okText: '确定',
  cancelText: '取消'
})

const visible = ref(true)

const handleOk = () => {
  if (props.onOk) {
    props.onOk()
  }
  visible.value = false
}

const handleCancel = () => {
  if (props.onCancel) {
    props.onCancel()
  }
  visible.value = false
}

// 图标映射
const iconMap = {
  info: '<svg class="icon-info" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  success: '<svg class="icon-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  warning: '<svg class="icon-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
  error: '<svg class="icon-error" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
}
</script>

<template>
  <Modal
    v-model:visible="visible"
    :title="title"
    :footer="false"
    :width="420"
    :mask-closable="false"
    :centered="true"
    @close="handleCancel"
  >
    <div class="confirm-body">
      <div class="confirm-icon-wrapper" v-html="iconMap[type]"></div>
      <div class="confirm-content">
        <p class="confirm-text">{{ content }}</p>
      </div>
    </div>
    <div class="confirm-footer">
      <Button type="default" @click="handleCancel">{{ cancelText }}</Button>
      <Button :type="type === 'error' ? 'danger' : 'primary'" @click="handleOk">{{ okText }}</Button>
    </div>
  </Modal>
</template>

<style scoped>
.confirm-body {
  display: flex;
  gap: 16px;
  padding: 16px 0;
}

.confirm-icon-wrapper {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

:deep(.icon-info) {
  color: #3b82f6;
  width: 24px;
  height: 24px;
}

:deep(.icon-success) {
  color: #22c55e;
  width: 24px;
  height: 24px;
}

:deep(.icon-warning) {
  color: #f97316;
  width: 24px;
  height: 24px;
}

:deep(.icon-error) {
  color: #ef4444;
  width: 24px;
  height: 24px;
}

.confirm-content {
  flex: 1;
}

.confirm-text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
