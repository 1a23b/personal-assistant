/**
 * Modal 弹窗组件类型定义
 */

export type ModalSize = 'small' | 'medium' | 'large' | 'full'

export interface ModalProps {
  /** 是否显示弹窗 */
  visible?: boolean
  /** 弹窗标题 */
  title?: string
  /** 弹窗尺寸 */
  size?: ModalSize
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 是否显示遮罩层 */
  mask?: boolean
  /** 点击遮罩层是否关闭弹窗 */
  maskClosable?: boolean
  /** 是否显示底部按钮 */
  footer?: boolean
  /** 确定按钮文字 */
  okText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 确定按钮是否加载中 */
  okLoading?: boolean
  /** 确定按钮是否禁用 */
  okDisabled?: boolean
  /** 取消按钮是否禁用 */
  cancelDisabled?: boolean
  /** 是否 esc 键关闭弹窗 */
  keyboard?: boolean
  /** 弹窗宽度（number 类型以 px 为单位，string 类型可传任意单位） */
  width?: number | string
  /** 居中距离顶部的距离 */
  top?: string | number
  /** 是否垂直居中 */
  centered?: boolean
}

export interface ModalEmits {
  (e: 'update:visible', visible: boolean): void
  (e: 'ok'): void
  (e: 'cancel'): void
  (e: 'close'): void
}
