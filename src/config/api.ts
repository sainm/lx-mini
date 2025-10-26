/**
 * 环境配置
 */
interface EnvConfig {
  API_BASE_URL: string
  REQUEST_TIMEOUT: number
  USE_MOCK: boolean
  DEBUG: boolean
}

// 获取环境变量
const getEnvConfig = (): EnvConfig => {
  // 从环境变量读取配置
  const apiBaseUrl = process.env.TARO_APP_API_BASE_URL
  const requestTimeout = process.env.TARO_APP_REQUEST_TIMEOUT
  const useMock = process.env.TARO_APP_USE_MOCK === 'true'
  const debug = process.env.TARO_APP_DEBUG === 'true'

  return {
    API_BASE_URL: apiBaseUrl || 'http://localhost:3000',
    REQUEST_TIMEOUT: requestTimeout ? parseInt(requestTimeout) : 10000,
    USE_MOCK: useMock,
    DEBUG: debug,
  }
}

// 导出配置
const ENV_CONFIG = getEnvConfig()

export const API_BASE_URL = ENV_CONFIG.API_BASE_URL
export const REQUEST_TIMEOUT = ENV_CONFIG.REQUEST_TIMEOUT
export const USE_MOCK = ENV_CONFIG.USE_MOCK
export const DEBUG = ENV_CONFIG.DEBUG

// 开发环境日志
if (DEBUG) {
  console.log('=== 环境配置 ===')
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('API_BASE_URL:', API_BASE_URL)
  console.log('REQUEST_TIMEOUT:', REQUEST_TIMEOUT)
  console.log('USE_MOCK:', USE_MOCK)
  console.log('===============')
}

// API 端点
export const API_ENDPOINTS = {
  // 认证相关
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',

  // 任务相关
  TASK_LIST: '/api/tasks',
  TASK_DETAIL: '/api/tasks/:id',

  // 答题相关
  SUBMIT_ANSWER: '/api/tasks/:id/submit',

  // 结果相关
  RESULT_LIST: '/api/results',
  RESULT_DETAIL: '/api/results/:id',
}

// 环境标识
export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: (process.env.NODE_ENV as string) === 'test',
}

