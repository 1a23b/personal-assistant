/**
 * Input 输入框组件类型定义
 */

export type InputSize = 'large' | 'medium' | 'small'
export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel'

export interface InputProps {
  /** 输入框类型 */
  type?: InputType
  /** 输入框尺寸 */
  size?: InputSize
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 占位文本 */
  placeholder?: string
  /** 最大长度 */
  maxlength?: number
  /** 最小长度 */
  minlength?: number
  /** 输入框内容 */
  modelValue?: string | number
  /** 是否显示清除按钮 */
  clearable?: boolean
  /** 是否显示密码切换按钮 */
  showPassword?: boolean
  /** 前缀图标 */
  prefixIcon?: string
  /** 后缀图标 */
  suffixIcon?: string
  /** 自动聚焦 */
  autofocus?: boolean
  /** 输入框名称 */
  name?: string
  /** 错误状态 */
  error?: boolean
  /** 错误提示文本 */
  errorText?: string
}
