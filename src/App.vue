<script setup lang="ts">
  import { onError, onLaunch } from '@dcloudio/uni-app'

  import initRouteGuard from '@/utils/guard'

  // 初始化路由守卫
  onLaunch(() => {
    console.log('应用启动')
    initRouteGuard()
  })

  // 【优化】应用级错误监听（如小程序原生层面报错）
  onError((err) => {
    console.error('【App 全局级异常】', err)
  })
</script>
