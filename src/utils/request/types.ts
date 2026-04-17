/**
 * 定义后端返回的通用数据结构
 * @template T - 业务数据 data 的具体类型
 */
export interface ResponseData<T = any> {
  /** 业务状态码 (如 200 为成功) */
  code: number
  /** 具体的业务数据 */
  data: T
  /** 提示信息 (如 '请求成功', '登录过期') */
  msg: string
}

/**
 * 基础配置接口
 */
export interface RequestConfig {
  /**
   * 接口基础路径
   * 优先使用传入的 baseURL，否则使用环境变量中的 VITE_APP_BASE_API
   */
  baseURL?: string
  /**
   * 请求超时时间 (ms)
   * 优先使用传入的 timeout，否则使用环境变量中的 VITE_APP_REQUEST_TIMEOUT
   */
  timeout?: number
}
