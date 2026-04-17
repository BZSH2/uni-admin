import { requestInterceptor, responseInterceptor } from './interceptors'
import type { RequestConfig } from './types'

export * from './types'

/**
 * 核心请求函数 (Promise 封装)
 *
 * @template T - 期望返回的业务数据类型
 * @param options - 传递给 `uni.request` 的基础配置
 * @param config - 拦截器需要的全局配置选项 (例如自定义 baseURL)
 * @returns 包含请求结果的 Promise 对象
 */
export function request<T = any>(
  options: UniApp.RequestOptions,
  config?: RequestConfig
): Promise<T> {
  // 1. 经过请求拦截器处理基础路径、超时以及鉴权等参数
  const interceptedOptions = requestInterceptor(options, config)

  return new Promise((resolve, reject) => {
    // 2. 发起原生网络请求
    uni.request({
      ...interceptedOptions,
      success: (res) => {
        // 3. 成功后，将原生返回体交给响应拦截器处理
        responseInterceptor<T>(res)
          .then(resolve) // 业务判断成功时解析 Promise
          .catch(reject) // 业务判断失败时拒绝 Promise
      },
      fail: (err) => {
        // 4. 处理底层网络故障 (例如完全断网、跨域失败、DNS 无法解析等)
        uni.showToast({ title: '网络连接异常，请检查网络设置', icon: 'none' })
        reject(err)
      }
    })
  })
}

/**
 * 为了提升使用体验，提供的快捷 HTTP 方法对象。
 *
 * 可以通过 `http.get<UserInfo>('/user/profile')` 的方式调用。
 * 如果需要在单个请求上覆盖 baseURL，可以通过 `config` 参数传入：
 * `http.get('/api', null, { baseURL: 'https://other-domain.com' })`
 */
export const http = {
  /**
   * 发送 GET 请求
   * @param url 接口路径
   * @param data 请求参数 (Query String)
   * @param config 拦截器配置选项 (可选)
   */
  get<T = any>(url: string, data?: any, config?: Partial<UniApp.RequestOptions> & RequestConfig) {
    return request<T>({ url, method: 'GET', data, ...config }, config)
  },

  /**
   * 发送 POST 请求
   * @param url 接口路径
   * @param data 请求体数据 (Body Payload)
   * @param config 拦截器配置选项 (可选)
   */
  post<T = any>(url: string, data?: any, config?: Partial<UniApp.RequestOptions> & RequestConfig) {
    return request<T>({ url, method: 'POST', data, ...config }, config)
  },

  /**
   * 发送 PUT 请求
   * @param url 接口路径
   * @param data 请求体数据 (Body Payload)
   * @param config 拦截器配置选项 (可选)
   */
  put<T = any>(url: string, data?: any, config?: Partial<UniApp.RequestOptions> & RequestConfig) {
    return request<T>({ url, method: 'PUT', data, ...config }, config)
  },

  /**
   * 发送 DELETE 请求
   * @param url 接口路径
   * @param data 请求参数
   * @param config 拦截器配置选项 (可选)
   */
  delete<T = any>(
    url: string,
    data?: any,
    config?: Partial<UniApp.RequestOptions> & RequestConfig
  ) {
    return request<T>({ url, method: 'DELETE', data, ...config }, config)
  }
}
