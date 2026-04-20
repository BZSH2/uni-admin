import { getStorage, removeStorage } from '../storage'
import type { RequestConfig, ResponseData } from './types'

// 基础配置读取环境变量
const defaultBaseURL = import.meta.env.VITE_APP_BASE_API || ''
const defaultTimeout = Number.parseInt(import.meta.env.VITE_APP_REQUEST_TIMEOUT || '10000', 10)

/**
 * 请求拦截器：在发送网络请求前触发
 * 负责：路径拼接、设置超时、注入鉴权 Token
 *
 * @param options - `uni.request` 原始的请求配置
 * @param config - 初始化 `http` 对象时的全局配置
 * @returns 拦截处理后的请求配置
 */
export function requestInterceptor(
  options: UniApp.RequestOptions,
  config?: RequestConfig
): UniApp.RequestOptions {
  const requestOptions = options as UniApp.RequestOptions & {
    withCredentials?: boolean
    enableCookie?: boolean
  }
  const baseURL = config?.baseURL ?? defaultBaseURL
  const timeout = config?.timeout ?? defaultTimeout

  // 1. 拼接基础路径 (如果 url 已经是完整的 http 绝对路径，则不拼接)
  if (!requestOptions.url.startsWith('http')) {
    // 确保 url 以 / 开头，或者 baseURL 以 / 结尾
    const separator = baseURL.endsWith('/') || requestOptions.url.startsWith('/') ? '' : '/'
    requestOptions.url = baseURL + separator + requestOptions.url
  }

  // 2. 设置超时时间
  requestOptions.timeout = requestOptions.timeout || timeout

  // 3. 浅拷贝 header 防止修改原引用，并设置基础内容类型
  requestOptions.header = {
    'content-type': 'application/json;charset=utf-8',
    ...requestOptions.header
  }

  // 4. 全局开启 Cookie 透传（若调用方显式传入则尊重调用方配置）
  // withCredentials: H5 跨域场景下携带 Cookie
  // enableCookie: 小程序等平台启用 Cookie 管理
  requestOptions.withCredentials = requestOptions.withCredentials ?? true
  requestOptions.enableCookie = requestOptions.enableCookie ?? true

  // 5. 自动注入鉴权 Token
  // (注：此处通过 storage 工具统一读取 TOKEN，避免直接依赖 uni 原生 API)
  const token = getStorage('TOKEN')
  if (token) {
    requestOptions.header.Authorization = `Bearer ${token}`
  }

  return requestOptions
}

/**
 * 响应拦截器：在收到网络请求的响应后触发
 * 负责：处理底层网络状态异常 (如 404, 500)、处理业务状态异常 (如 401)、剥离冗余的响应外壳。
 *
 * @template T - 业务数据类型
 * @param response - `uni.request` 成功回调拿到的原始响应体
 * @returns 剥离外壳后的业务数据 Promise
 */
export function responseInterceptor<T>(response: UniApp.RequestSuccessCallbackResult): Promise<T> {
  const res = response.data as ResponseData<T>
  const statusCode = response.statusCode

  // HTTP 状态码 2xx 范围表示网络请求连通且成功
  if (statusCode >= 200 && statusCode < 300) {
    // ----------------------------------------------------
    // 业务状态码校验逻辑：
    // 此处的 res.code 视后端团队接口规范而定。
    // 通常约定 200 或 0 代表“业务处理成功”。
    // ----------------------------------------------------
    if (res.code === 200 || res.code === 0) {
      // 成功，直接抛出包裹在 data 里的真实业务数据
      return Promise.resolve(res.data)
    }

    // 401 代表未授权或登录状态已过期
    if (res.code === 401) {
      removeStorage('TOKEN') // 清除失效 Token
      uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
      // 如果项目包含 vue-router 或 uni.navigateTo，可在此跳转到登录页
      // uni.navigateTo({ url: '/pages/login/login' })
      return Promise.reject(new Error('登录已过期'))
    }

    // 其他业务级错误统一通过 Toast 弹出错误提示
    uni.showToast({ title: res.msg || '业务处理失败', icon: 'none' })
    return Promise.reject(new Error(res.msg || '业务处理失败'))
  }

  // HTTP 状态码异常 (如 404 找不到接口, 500 服务器崩溃, 502 网关错误等)
  uni.showToast({ title: `网络服务错误 [${statusCode}]`, icon: 'none' })
  return Promise.reject(new Error(`网络服务错误 [${statusCode}]`))
}
