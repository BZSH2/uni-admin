<script setup lang="ts">
  import { onError, onLaunch } from '@dcloudio/uni-app'

  onLaunch(() => {})

  // 【优化】应用级错误监听（如小程序原生层面报错）
  onError((err) => {
    console.error('【App 全局级异常】', err)
  })
</script>

<style lang="scss">
  @import '@climblee/uv-ui/index';
</style>
