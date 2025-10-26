import { post } from '../utils/request'
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
  return post<LoginResponse>(API_ENDPOINTS.LOGIN, params, false)
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

