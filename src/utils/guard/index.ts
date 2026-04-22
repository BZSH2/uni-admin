import { getStorage } from '@/utils/storage'

/** 登录页路由 */
const LOGIN_PATH = '/pages/login/index'
/** 登录后默认落地页 */
const DASHBOARD_PATH = '/pages/dashboard/index'
/** 登录页可识别路径（兼容 h5 alias） */
const LOGIN_PATH_SET = new Set([LOGIN_PATH, '/login'])
/** 需要拦截的页面跳转 API */
const INTERCEPT_METHODS = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'] as const
/** 避免重复注册拦截器 */
let hasInstalled = false
/** 首屏路由未就绪时的重试次数 */
const INITIAL_GUARD_MAX_RETRY = 20
/** 首屏重试间隔（毫秒） */
const INITIAL_GUARD_RETRY_DELAY = 50

/** 通过本地 TOKEN 判断登录态 */
function isLoggedIn() {
  return Boolean(getStorage('TOKEN'))
}

/** 去掉 query，统一按纯路径做鉴权匹配 */
function normalizePath(url: string) {
  const withoutQuery = url.split('?')[0]
  const withoutHash = withoutQuery.split('#')[0]
  const path = withoutHash.startsWith('/') ? withoutHash : `/${withoutHash}`
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

/** H5 场景下从浏览器地址读取当前路由 */
function getH5Path() {
  if (typeof window === 'undefined') {
    return ''
  }

  const { hash, pathname } = window.location
  if (hash.startsWith('#/')) {
    return normalizePath(hash.slice(1))
  }

  if (pathname && pathname !== '/') {
    return normalizePath(pathname)
  }

  return ''
}

/**
 * 根据目标地址计算是否需要重定向。
 * - 未登录访问非白名单页 => 去登录页
 * - 已登录访问登录页 => 去看板页
 */
function resolveGuardTarget(url: string) {
  const targetPath = normalizePath(url)
  const loggedIn = isLoggedIn()

  if (!loggedIn && !LOGIN_PATH_SET.has(targetPath)) {
    return LOGIN_PATH
  }

  if (loggedIn && LOGIN_PATH_SET.has(targetPath)) {
    return DASHBOARD_PATH
  }

  return null
}

/** 获取当前页面路径（格式：/pages/xxx/index） */
function getCurrentRoutePath() {
  const pages = getCurrentPages()
  const current = pages.at(-1)
  if (current?.route) {
    return normalizePath(current.route)
  }

  const h5Path = getH5Path()
  if (h5Path) {
    return h5Path
  }

  // 页面栈尚未就绪时，尝试使用启动参数兜底
  const launchPath = uni.getLaunchOptionsSync().path
  return launchPath ? normalizePath(launchPath) : ''
}

/** 拦截常见跳转 API，在跳转前执行鉴权重定向 */
function installNavigationInterceptors() {
  INTERCEPT_METHODS.forEach((method) => {
    uni.addInterceptor(method, {
      invoke(args: { url?: string }) {
        if (!args.url) {
          return args
        }

        const redirectPath = resolveGuardTarget(args.url)
        if (!redirectPath) {
          return args
        }

        // switchTab 只能跳 tabBar 页面，遇到鉴权重定向时改用 reLaunch 兜底。
        if (method === 'switchTab') {
          uni.reLaunch({ url: redirectPath })
          return false
        }

        args.url = redirectPath
        return args
      }
    })
  })
}

/** 应用启动后立即校验当前页，避免首屏直接进入无权限页面 */
function runInitialGuard(retry = 0) {
  const currentPath = getCurrentRoutePath()
  if (!currentPath) {
    if (retry < INITIAL_GUARD_MAX_RETRY) {
      setTimeout(() => {
        runInitialGuard(retry + 1)
      }, INITIAL_GUARD_RETRY_DELAY)
    }
    return
  }

  const redirectPath = resolveGuardTarget(currentPath)
  if (!redirectPath || redirectPath === currentPath) {
    return
  }

  uni.reLaunch({ url: redirectPath })
}

/** 初始化路由守卫 */
export default function initRouteGuard() {
  if (!hasInstalled) {
    installNavigationInterceptors()
    hasInstalled = true
  }
  runInitialGuard()
}
