import Taro from '@tarojs/taro'
import { API_BASE_URL, REQUEST_TIMEOUT, USE_MOCK, DEBUG } from '../config/api'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: any
  needAuth?: boolean
}

interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 统一请求封装
 */
export async function request<T = any>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', data, header = {}, needAuth = true } = options

  // 开发环境日志
  if (DEBUG) {
    console.log('=== API Request ===')
    console.log('URL:', API_BASE_URL + url)
    console.log('Method:', method)
    console.log('Data:', data)
    console.log('NeedAuth:', needAuth)
    console.log('==================')
  }

  // 添加 token
  if (needAuth) {
    const token = Taro.getStorageSync('AUTH_TOKEN')
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }
  }

  try {
    const response = await Taro.request({
      url: API_BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
      timeout: REQUEST_TIMEOUT,
    })

    // 开发环境日志
    if (DEBUG) {
      console.log('=== API Response ===')
      console.log('Status:', response.statusCode)
      console.log('Data:', response.data)
      console.log('===================')
    }

    const result = response.data as ResponseData<T>

    // 处理响应
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (result.code === 0 || result.code === 200) {
        return result.data
      } else {
        throw new Error(result.message || '请求失败')
      }
    } else if (response.statusCode === 401) {
      // 未授权，清除token并跳转登录
      Taro.removeStorageSync('AUTH_TOKEN')
      Taro.redirectTo({ url: '/pages/login/index' })
      throw new Error('请先登录')
    } else {
      throw new Error(result.message || `请求失败(${response.statusCode})`)
    }
  } catch (error: any) {
    // 开发环境日志
    if (DEBUG) {
      console.error('=== API Error ===')
      console.error('Error:', error)
      console.error('=================')
    }

    // 网络错误
    if (error.errMsg) {
      throw new Error('网络连接失败，请检查网络')
    }
    throw error
  }
}

// GET 请求
export function get<T = any>(url: string, data?: any, needAuth = true): Promise<T> {
  return request<T>({ url, method: 'GET', data, needAuth })
}

// POST 请求
export function post<T = any>(url: string, data?: any, needAuth = true): Promise<T> {
  return request<T>({ url, method: 'POST', data, needAuth })
}

// PUT 请求
export function put<T = any>(url: string, data?: any, needAuth = true): Promise<T> {
  return request<T>({ url, method: 'PUT', data, needAuth })
}

// DELETE 请求
export function del<T = any>(url: string, data?: any, needAuth = true): Promise<T> {
  return request<T>({ url, method: 'DELETE', data, needAuth })
}

