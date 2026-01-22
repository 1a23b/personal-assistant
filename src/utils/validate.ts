/**
 * 表单验证工具函数
 */

import { FIELD_LENGTH, VALIDATION_REGEX, VALIDATION_MESSAGES } from '@/constants/validation'

/**
 * 验证结果接口
 */
export interface ValidationResult {
  /** 是否验证通过 */
  valid: boolean
  /** 错误消息 */
  message?: string
}

/**
 * 验证手机号
 */
export function validatePhone(phone: string): boolean {
  return VALIDATION_REGEX.PHONE.test(phone)
}

/**
 * 验证手机号（详细）
 * @returns 验证结果
 */
export function validatePhoneDetail(phone: string): ValidationResult {
  if (!phone) {
    return { valid: false, message: VALIDATION_MESSAGES.PHONE_REQUIRED }
  }

  if (phone.length !== FIELD_LENGTH.PHONE) {
    return { valid: false, message: VALIDATION_MESSAGES.PHONE_LENGTH }
  }

  if (!VALIDATION_REGEX.PHONE.test(phone)) {
    return { valid: false, message: VALIDATION_MESSAGES.PHONE_INVALID }
  }

  return { valid: true }
}

/**
 * 验证密码（8-16 位，包含字母和数字）
 */
export function validatePassword(password: string): boolean {
  return VALIDATION_REGEX.PASSWORD.test(password)
}

/**
 * 验证密码强度（详细）
 * @returns 验证结果
 */
export function validatePasswordDetail(password: string): ValidationResult {
  if (!password) {
    return { valid: false, message: VALIDATION_MESSAGES.PASSWORD_REQUIRED }
  }

  if (password.length < FIELD_LENGTH.PASSWORD_MIN) {
    return { valid: false, message: VALIDATION_MESSAGES.PASSWORD_TOO_SHORT }
  }

  if (password.length > FIELD_LENGTH.PASSWORD_MAX) {
    return { valid: false, message: VALIDATION_MESSAGES.PASSWORD_TOO_LONG }
  }

  if (!VALIDATION_REGEX.PASSWORD.test(password)) {
    return { valid: false, message: VALIDATION_MESSAGES.PASSWORD_INVALID }
  }

  return { valid: true }
}

/**
 * 验证用户名（4-20 位，字母数字下划线）
 */
export function validateUsername(username: string): boolean {
  return VALIDATION_REGEX.USERNAME.test(username)
}

/**
 * 验证用户名（详细）
 * @returns 验证结果
 */
export function validateUsernameDetail(username: string): ValidationResult {
  if (!username) {
    return { valid: false, message: VALIDATION_MESSAGES.USERNAME_REQUIRED }
  }

  if (username.length > FIELD_LENGTH.USERNAME_MAX) {
    return { valid: false, message: VALIDATION_MESSAGES.USERNAME_TOO_LONG }
  }

  if (!VALIDATION_REGEX.USERNAME.test(username)) {
    return { valid: false, message: VALIDATION_MESSAGES.USERNAME_INVALID }
  }

  return { valid: true }
}

/**
 * 验证姓名（2-20 位中文或英文字符）
 */
export function validateRealName(realName: string): boolean {
  return VALIDATION_REGEX.REAL_NAME.test(realName)
}

/**
 * 验证姓名（详细）
 * @returns 验证结果
 */
export function validateRealNameDetail(realName: string): ValidationResult {
  if (!realName) {
    return { valid: false, message: VALIDATION_MESSAGES.REAL_NAME_REQUIRED }
  }

  if (realName.length < FIELD_LENGTH.REAL_NAME_MIN) {
    return { valid: false, message: VALIDATION_MESSAGES.REAL_NAME_TOO_SHORT }
  }

  if (realName.length > FIELD_LENGTH.REAL_NAME_MAX) {
    return { valid: false, message: VALIDATION_MESSAGES.REAL_NAME_TOO_LONG }
  }

  if (!VALIDATION_REGEX.REAL_NAME.test(realName)) {
    return { valid: false, message: VALIDATION_MESSAGES.REAL_NAME_INVALID }
  }

  return { valid: true }
}

/**
 * 验证验证码（6 位数字）
 */
export function validateCaptcha(captcha: string): boolean {
  return VALIDATION_REGEX.CAPTCHA.test(captcha)
}

/**
 * 验证验证码（详细）
 * @returns 验证结果
 */
export function validateCaptchaDetail(captcha: string): ValidationResult {
  if (!captcha) {
    return { valid: false, message: VALIDATION_MESSAGES.CAPTCHA_REQUIRED }
  }

  if (!VALIDATION_REGEX.CAPTCHA.test(captcha)) {
    return { valid: false, message: VALIDATION_MESSAGES.CAPTCHA_INVALID }
  }

  return { valid: true }
}

/**
 * 验证两次密码是否一致
 */
export function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword) {
    return { valid: false, message: '请再次输入密码' }
  }

  if (password !== confirmPassword) {
    return { valid: false, message: VALIDATION_MESSAGES.PASSWORD_MISMATCH }
  }

  return { valid: true }
}
