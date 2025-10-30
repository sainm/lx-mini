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
  code: number | string  // 支持数字或字符串类型的 code
  message?: string       // message 可选
  msg?: string          // 兼容后端使用 msg 字段
  data: T
}

/**
 * 将对象转换为 URL 查询字符串
 */
function objectToQueryString(obj: Record<string, any>): string {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
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
    console.log('Data Type:', typeof data)
    console.log('Header:', header)
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
    // 合并请求头，优先使用传入的 header（后面的会覆盖前面的）
    const finalHeader = {
      'Content-Type': 'application/json',
      ...header,
    }
    
    const response = await Taro.request({
      url: API_BASE_URL + url,
      method,
      data,
      header: finalHeader,
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
    
    // 获取错误消息（兼容 message 和 msg 字段）
    const errorMsg = result.message || result.msg || '请求失败'

    // 处理响应
    if (response.statusCode >= 200 && response.statusCode < 300) {
      // 兼容不同的成功码
      // 常见成功码：0, 200, "0", "200", "A0000", "00000" 等
      const codeStr = String(result.code)
      const isSuccess = 
        result.code === 0 || 
        result.code === 200 || 
        codeStr === '0' || 
        codeStr === '200' ||
        codeStr === 'A0000' ||
        codeStr === '00000' ||
        codeStr.startsWith('A0000') // 兼容 A00001 等成功码
      
      if (isSuccess) {
        return result.data
      } else {
        // 业务错误
        throw new Error(errorMsg)
      }
    } else if (response.statusCode === 401) {
      // 未授权，清除token并跳转登录
      Taro.removeStorageSync('AUTH_TOKEN')
      Taro.redirectTo({ url: '/pages/login/index' })
      throw new Error('请先登录')
    } else {
      // HTTP 错误
      throw new Error(errorMsg || `请求失败(${response.statusCode})`)
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

// POST 请求（JSON 格式）
export function post<T = any>(url: string, data?: any, needAuth = true): Promise<T> {
  return request<T>({ url, method: 'POST', data, needAuth })
}

// POST 请求（表单格式 - 用于 @RequestParam）
export function postForm<T = any>(url: string, data?: any, needAuth = true): Promise<T> {
  // 微信小程序的 request 在设置 Content-Type 为 application/x-www-form-urlencoded 时
  // 会自动将对象转换为表单格式，所以直接传对象即可
  return request<T>({ 
    url, 
    method: 'POST', 
    data: data || {},
    needAuth,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// PUT 请求
export function put<T = any>(url: string, data?: any, needAuth = true): Promise<T> {
  return request<T>({ url, method: 'PUT', data, needAuth })
}

// DELETE 请求
export function del<T = any>(url: string, data?: any, needAuth = true): Promise<T> {
  return request<T>({ url, method: 'DELETE', data, needAuth })
}

