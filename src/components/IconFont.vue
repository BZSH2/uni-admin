<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    /**
     * 图标名称（不含前缀）
     * 例如：name="home" => class "icon-home"
     */
    name: string
    /** class 前缀，默认 icon- */
    prefix?: string
    /** 图标颜色 */
    color?: string
    /** 图标尺寸（px） */
    size?: number | string
  }

  const props = withDefaults(defineProps<Props>(), {
    prefix: 'icon-',
    color: '',
    size: 16
  })

  const iconClass = computed(() => `${props.prefix}${props.name}`)
  const iconStyle = computed(() => ({
    color: props.color || undefined,
    fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size
  }))
</script>

<template>
  <text class="iconfont" :class="iconClass" :style="iconStyle" />
</template>

<style lang="scss" scoped>
  /*
   * 把 iconfont 基础样式收敛到组件内。
   * 后续可将 iconfont.cn 下载的 @font-face 与 .icon-xxx:before 映射继续补在这里。
   */
  .iconfont {
    display: inline-block;
    font-family: iconfont !important;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    text-transform: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
