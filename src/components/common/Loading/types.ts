/**
 * Loading 加载组件类型定义
 */

export type LoadingSize = 'small' | 'medium' | 'large'
export type LoadingType = 'spinner' | 'dots' | 'bars'

export interface LoadingProps {
  /** 是否显示加载状态 */
  loading?: boolean
  /** 加载图标尺寸 */
  size?: LoadingSize
  /** 加载指示器类型 */
  type?: LoadingType
  /** 加载文本 */
  text?: string
  /** 是否显示全屏遮罩 */
  fullscreen?: boolean
  /** 背景颜色 */
  background?: string
  /** 文本颜色 */
  textColor?: string
}
