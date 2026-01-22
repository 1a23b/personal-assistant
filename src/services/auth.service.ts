/**
 * 认证相关 API 服务
 * 注意：Service 层只负责调用 API，不处理业务逻辑
 * ✅ 优化：直接返回业务数据类型，无需解包
 */

import apiClient, { type RequestOptions } from "@/utils/request";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  CaptchaResponse,
  RefreshTokenResponse,
  OrgListResponse,
} from "@/types";

/**
 * 获取图形验证码
 * @param config 自定义请求配置
 */
export function getCaptcha(config?: RequestOptions): Promise<CaptchaResponse> {
  return apiClient.post("/base/captcha", {}, config)
}

/**
 * 用户注册
 * @param data 注册信息
 * @param config 自定义请求配置
 */
export function register(
  data: RegisterRequest,
  config?: RequestOptions,
): Promise<RegisterResponse> {
  return apiClient.post("/user/register", data, config)
}

/**
 * 用户登录
 * @param data 登录信息
 * @param config 自定义请求配置
 */
export function login(
  data: LoginRequest,
  config?: RequestOptions,
): Promise<LoginResponse> {
  return apiClient.post("/user/login", data, config)
}

/**
 * 刷新 Token（业务层使用）
 * @param config 自定义请求配置
 */
export function refreshToken(
  config?: RequestOptions,
): Promise<RefreshTokenResponse> {
  return apiClient.get("/refreshToken", config)
}

/**
 * 刷新 Access Token（拦截器内部使用）
 * 使用 POST 方法，通过请求体传递 refresh_token
 * 注意：这个函数返回的是原始 AxiosResponse，需要在 request.ts 中处理
 * @param refreshToken 刷新令牌
 */
export function refreshAccessTokenPost(refreshToken: string) {
  const data = {
    'x-refresh-token': refreshToken
  }
  // 直接使用 axios 原始实例，避免拦截器循环
  return apiClient.post("/refreshToken", data)
}

/**
 * 用户登出
 * @param config 自定义请求配置
 */
export function logout(config?: RequestOptions): Promise<null> {
  return apiClient.post("/user/logout", {}, config)
}

/**
 * 获取组织列表
 * @param page 页码
 * @param pageSize 每页数量
 * @param config 自定义请求配置
 */
export function getOrgList(
  page?: number,
  pageSize?: number,
  config?: RequestOptions,
): Promise<OrgListResponse> {
  const params: Record<string, number> = {};
  if (page !== undefined) params.page = page;
  if (pageSize !== undefined) params.page_size = pageSize;

  // 使用类型断言传递 params，因为 RequestOptions 不包含 params 属性
  return apiClient.get("/org/list", {
    ...config,
    params,
  } as any)
}
