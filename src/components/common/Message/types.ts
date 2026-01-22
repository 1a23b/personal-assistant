/**
 * Message 消息提示组件类型定义
 */

export type MessageType = 'success' | 'error' | 'warning' | 'info'

export interface MessageProps {
  /** 消息类型 */
  type?: MessageType
  /** 消息内容 */
  content: string
  /** 显示时长（毫秒），0 表示不自动关闭 */
  duration?: number
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 关闭时的回调 */
  onClose?: () => void
  /** 唯一标识 */
  id?: string
}

export interface MessageInstance {
  close: () => void
}
