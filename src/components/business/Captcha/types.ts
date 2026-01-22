/**
 * Captcha 验证码组件类型定义
 */

export interface CaptchaData {
  captcha_id: string
  pic_path: string // 验证码图片的 base64 编码
}

export interface CaptchaProps {
  /** 验证码图片宽度 */
  width?: number
  /** 验证码图片高度 */
  height?: number
  /** 占位文本 */
  placeholder?: string
  /** 是否自动刷新 */
  autoRefresh?: boolean
}
