import { post, postForm } from '../utils/request'
import { API_ENDPOINTS, USE_MOCK } from '../config/api'
import type { User } from '../types'
import { delay } from '../utils/mock'

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  user: User
}

// 后端实际返回的登录响应
interface BackendLoginResponse {
  tokenType: string
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// 注册请求参数
export interface RegisterParams {
  username: string
  password: string
  nickname?: string
}

/**
 * 用户登录
 */
export async function login(params: LoginParams): Promise<LoginResponse> {
  if (USE_MOCK) {
    await delay()
    // Mock 登录验证
    if (params.username === 'test' && params.password === '123456') {
      return {
        token: 'mock_token_' + Date.now(),
        user: {
          id: '1',
          username: params.username,
          nickname: '测试用户',
          createdAt: new Date().toISOString()
        }
      }
    } else {
      throw new Error('用户名或密码错误')
    }
  }

  // 使用表单格式发送（后端使用 @RequestParam）
  const backendResponse = await postForm<BackendLoginResponse>(API_ENDPOINTS.LOGIN, params, false)

  // 转换后端响应格式为前端期望的格式
  return {
    token: backendResponse.accessToken,  // 使用 accessToken 作为 token
    user: {
      id: params.username,  // 后端没返回用户信息，暂时用 username 作为 id
      username: params.username,
      nickname: params.username,  // 暂时用 username 作为 nickname
      createdAt: new Date().toISOString()
    }
  }
}

/**
 * 用户注册
 */
export async function register(params: RegisterParams): Promise<LoginResponse> {
  if (USE_MOCK) {
    await delay()
    // Mock 注册
    return {
      token: 'mock_token_' + Date.now(),
      user: {
        id: Date.now().toString(),
        username: params.username,
        nickname: params.nickname || params.username,
        createdAt: new Date().toISOString()
      }
    }
  }
  return post<LoginResponse>(API_ENDPOINTS.REGISTER, params, false)
}

/**
 * 用户登出
 */
export async function logout(): Promise<void> {
  if (USE_MOCK) {
    await delay()
    return
  }
  return post<void>(API_ENDPOINTS.LOGOUT)
}

