/**
 * Message 消息提示服务
 * 用于全局调用消息提示
 */

import { createApp, type App } from 'vue'
import Message from './Message.vue'
import type { MessageProps, MessageType } from './types'

interface MessageInstance {
  app: App
  container: HTMLElement
  close: () => void
}

let messageContainer: HTMLElement | null = null
const instances: MessageInstance[] = []

// 获取或创建消息容器
const getContainer = () => {
  if (!messageContainer) {
    messageContainer = document.createElement('div')
    messageContainer.className = 'message-container'
    document.body.appendChild(messageContainer)
  }
  return messageContainer
}

// 创建消息实例
const createMessage = (props: MessageProps): MessageInstance => {
  const container = getContainer()

  // 创建包装器
  const wrapper = document.createElement('div')
  wrapper.className = 'message-wrapper'
  container.appendChild(wrapper)

  // 创建 Vue 应用实例
  const app = createApp(Message, {
    ...props,
    onClose: () => {
      props.onClose?.()
      // 延迟移除 DOM，等待动画完成
      setTimeout(() => {
        const index = instances.findIndex((instance) => instance.container === wrapper)
        if (index > -1) {
          instances.splice(index, 1)
        }
        app.unmount()
        container.removeChild(wrapper)

        // 如果没有消息了，移除容器
        if (instances.length === 0 && messageContainer) {
          document.body.removeChild(messageContainer)
          messageContainer = null
        }
      }, 300)
    }
  })

  // 挂载组件
  const instance = app.mount(wrapper)

  const messageInstance: MessageInstance = {
    app,
    container: wrapper,
    close: () => {
      ;(instance as any).close()
    }
  }

  instances.push(messageInstance)

  return messageInstance
}

// 消息方法
export const message = {
  success(content: string, duration?: number, onClose?: () => void) {
    return createMessage({
      type: 'success',
      content,
      duration,
      onClose
    })
  },

  error(content: string, duration?: number, onClose?: () => void) {
    return createMessage({
      type: 'error',
      content,
      duration,
      onClose
    })
  },

  warning(content: string, duration?: number, onClose?: () => void) {
    return createMessage({
      type: 'warning',
      content,
      duration,
      onClose
    })
  },

  info(content: string, duration?: number, onClose?: () => void) {
    return createMessage({
      type: 'info',
      content,
      duration,
      onClose
    })
  },

  // 通用方法
  show(type: MessageType, content: string, duration?: number, onClose?: () => void) {
    return createMessage({
      type,
      content,
      duration,
      onClose
    })
  }
}

// 导出类型
export type { MessageProps, MessageType }
