/**
 * 验证相关常量
 * 统一管理验证规则中的魔法数字
 */

/**
 * 字段长度限制
 */
export const FIELD_LENGTH = {
  /** 手机号长度 */
  PHONE: 11,

  /** 用户名最大长度 */
  USERNAME_MAX: 20,

  /** 用户名最小长度 */
  USERNAME_MIN: 4,

  /** 姓名最小长度 */
  REAL_NAME_MIN: 2,

  /** 姓名最大长度 */
  REAL_NAME_MAX: 20,

  /** 密码最小长度 */
  PASSWORD_MIN: 8,

  /** 密码最大长度 */
  PASSWORD_MAX: 16,

  /** 验证码长度 */
  CAPTCHA: 6,

  /** 组织 ID 默认值 */
  ORG_ID_DEFAULT: '0'
} as const

/**
 * 验证正则表达式
 */
export const VALIDATION_REGEX = {
  /** 手机号正则 */
  PHONE: /^1[3-9]\d{9}$/,

  /** 用户名正则（字母数字下划线） */
  USERNAME: /^[a-zA-Z0-9_]{4,20}$/,

  /** 姓名正则（中文、英文，2-20位） */
  REAL_NAME: /^[\u4e00-\u9fa5a-zA-Z\s]{2,20}$/,

  /** 密码正则（8-16 位，包含字母和数字） */
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,

  /** 验证码正则（6 位数字） */
  CAPTCHA: /^\d{6}$/
} as const

/**
 * 验证错误提示消息
 */
export const VALIDATION_MESSAGES = {
  /** 手机号相关 */
  PHONE_REQUIRED: '请输入手机号',
  PHONE_INVALID: '请输入正确的手机号',
  PHONE_LENGTH: '手机号应为 11 位数字',

  /** 用户名相关 */
  USERNAME_REQUIRED: '请输入用户名',
  USERNAME_INVALID: '用户名应为 4-20 位字母、数字或下划线',
  USERNAME_TOO_LONG: '用户名不能超过 20 个字符',

  /** 姓名相关 */
  REAL_NAME_REQUIRED: '请输入姓名',
  REAL_NAME_INVALID: '姓名应为 2-20 位中文或英文字符',
  REAL_NAME_TOO_SHORT: '姓名不能少于 2 个字符',
  REAL_NAME_TOO_LONG: '姓名不能超过 20 个字符',

  /** 密码相关 */
  PASSWORD_REQUIRED: '请输入密码',
  PASSWORD_INVALID: '密码应为 8-16 位，包含字母和数字',
  PASSWORD_TOO_SHORT: '密码长度不能少于 8 位',
  PASSWORD_TOO_LONG: '密码长度不能超过 16 位',
  PASSWORD_MISMATCH: '两次输入的密码不一致',

  /** 验证码相关 */
  CAPTCHA_REQUIRED: '请输入验证码',
  CAPTCHA_INVALID: '验证码应为 6 位数字',

  /** 协议相关 */
  AGREEMENT_REQUIRED: '请阅读并同意用户协议和隐私政策'
} as const
