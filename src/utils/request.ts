/**
 * 网络请求封装
 * 基于 uni.request
 */

// 定义后端返回的通用数据结构
export interface ResponseData<T = any> {
  code: number
  data: T
  msg: string
}

// 基础配置
const BASE_URL = import.meta.env.VITE_APP_BASE_API || ''
const TIMEOUT = Number.parseInt(import.meta.env.VITE_APP_REQUEST_TIMEOUT || '10000', 10)

/**
 * 请求拦截器
 */
function requestInterceptor(options: UniApp.RequestOptions): UniApp.RequestOptions {
  // 1. 拼接基础路径 (如果已经是完整 http 路径则不拼接)
  if (!options.url.startsWith('http')) {
    options.url = BASE_URL + options.url
  }

  // 2. 设置超时时间
  options.timeout = options.timeout || TIMEOUT

  // 3. 设置默认请求头
  options.header = {
    ...options.header
  }

  // 4. 注入 Token (假设存在 Storage 中)
  const token = uni.getStorageSync('token')
  if (token) {
    options.header.Authorization = `Bearer ${token}`
  }

  return options
}

/**
 * 响应拦截器
 */
function responseInterceptor<T>(response: UniApp.RequestSuccessCallbackResult): Promise<T> {
  const res = response.data as ResponseData<T>
  const statusCode = response.statusCode

  // HTTP 状态码 2xx 范围表示网络请求成功
  if (statusCode >= 200 && statusCode < 300) {
    // 业务状态码校验 (这里假设 code === 200 或 0 为成功，具体请根据后端接口定义修改)
    if (res.code === 200 || res.code === 0) {
      return Promise.resolve(res.data)
    }

    // 401 登录失效/未授权
    if (res.code === 401) {
      uni.removeStorageSync('token')
      uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
      // uni.navigateTo({ url: '/pages/login/login' }) // 按需放开跳转
      return Promise.reject(new Error('登录已过期'))
    }

    // 其他业务错误统一提示
    uni.showToast({ title: res.msg || '请求失败', icon: 'none' })
    return Promise.reject(new Error(res.msg || '请求失败'))
  }

  // HTTP 状态码异常 (如 404, 500 等)
  uni.showToast({ title: `网络错误: ${statusCode}`, icon: 'none' })
  return Promise.reject(new Error(`网络错误: ${statusCode}`))
}

/**
 * 核心请求函数 (Promise 封装)
 */
export function request<T = any>(options: UniApp.RequestOptions): Promise<T> {
  // 拦截请求配置
  const interceptedOptions = requestInterceptor(options)

  return new Promise((resolve, reject) => {
    uni.request({
      ...interceptedOptions,
      success: (res) => {
        // 拦截响应数据
        responseInterceptor<T>(res).then(resolve).catch(reject)
      },
      fail: (err) => {
        // 处理底层网络故障 (如断网、跨域等)
        uni.showToast({ title: '网络请求失败，请检查网络后重试', icon: 'none' })
        reject(err)
      }
    })
  })
}

/**
 * 快捷 HTTP 方法导出
 */
export const http = {
  get<T = any>(url: string, data?: any, config?: Partial<UniApp.RequestOptions>) {
    return request<T>({ url, method: 'GET', data, ...config })
  },
  post<T = any>(url: string, data?: any, config?: Partial<UniApp.RequestOptions>) {
    return request<T>({ url, method: 'POST', data, ...config })
  },
  put<T = any>(url: string, data?: any, config?: Partial<UniApp.RequestOptions>) {
    return request<T>({ url, method: 'PUT', data, ...config })
  },
  delete<T = any>(url: string, data?: any, config?: Partial<UniApp.RequestOptions>) {
    return request<T>({ url, method: 'DELETE', data, ...config })
  }
}
