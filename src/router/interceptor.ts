import { getStorage } from '@/utils/storage'

const whiteList = ['/', '/login', '/pages/login/index']

function hasPermission(url: string) {
  // 取 path 部分，去掉 query 参数
  const path = url.split('?')[0]
  if (whiteList.includes(path)) {
    return true
  }

  // 其他页面需要鉴权，检查是否有 token
  const token = getStorage('TOKEN')
  if (token) {
    return true
  }
  return false
}

export function setupRouterInterceptor() {
  const routerMethods = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab']

  routerMethods.forEach((method) => {
    uni.addInterceptor(method, {
      invoke(e) {
        if (!hasPermission(e.url)) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          uni.reLaunch({
            url: '/pages/login/index'
          })
          return false
        }
        return true
      },
      fail(err) {
        console.error(`路由跳转失败 [${method}]:`, err)
      }
    })
  })
}
