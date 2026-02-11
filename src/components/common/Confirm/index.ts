import { createVNode, render } from 'vue'
import ConfirmModal from './ConfirmModal.vue'

interface ConfirmOptions {
  title?: string
  content: string
  type?: 'info' | 'success' | 'warning' | 'error'
  okText?: string
  cancelText?: string
}

export const Confirm = (contentOrOptions: string | ConfirmOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    const options = typeof contentOrOptions === 'string'
      ? { content: contentOrOptions }
      : contentOrOptions

    const container = document.createElement('div')
    document.body.appendChild(container)

    const destroy = () => {
      render(null, container)
      document.body.removeChild(container)
    }

    const vnode = createVNode(ConfirmModal, {
      ...options,
      onOk: () => {
        destroy()
        resolve()
      },
      onCancel: () => {
        destroy()
        reject(new Error('cancel'))
      }
    })

    render(vnode, container)
  })
}
