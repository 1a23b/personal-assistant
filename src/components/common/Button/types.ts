/**
 * Button 按钮组件类型定义
 */

export type ButtonType = 'primary' | 'default' | 'danger' | 'success' | 'warning'
export type ButtonSize = 'large' | 'medium' | 'small'
export type ButtonHtmlType = 'button' | 'submit' | 'reset'

export interface ButtonProps {
  /** 按钮类型 */
  type?: ButtonType
  /** 按钮尺寸 */
  size?: ButtonSize
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 按钮原生类型 */
  htmlType?: ButtonHtmlType
  /** 是否为块级按钮 */
  block?: boolean
  /** 幽灵按钮（背景透明） */
  ghost?: boolean
  /** 危险按钮（仅用于 type="default"） */
  danger?: boolean
  /** 图标组件 */
  icon?: string
}
