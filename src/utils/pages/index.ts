/**
 * 路由与页面工具函数
 * 提供获取当前页面路由、页面标题等功能
 */
import pagesJson from '@/pages.json'

/**
 * 获取当前页面路径
 * @returns {string} 返回当前页面路由路径，如 'pages/dashboard/index'
 */
function getNowRoute(): string {
  const pages = getCurrentPages()
  const length = pages.length
  if (!length) {
    return ''
  }
  const currentPage = pages[length - 1]
  return currentPage.route || ''
}

/**
 * 从 pages.json 中获取当前页面的标题配置
 * @returns {string} 返回配置的 navigationBarTitleText，未找到则返回空字符串
 */
export function getPagesTitle(): string {
  const route = getNowRoute()
  const pages = pagesJson.pages
  const page = pages.find((item) => item.path === route)
  return page?.style?.navigationBarTitleText || ''
}
