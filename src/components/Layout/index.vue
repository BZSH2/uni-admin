<script setup lang="ts">
  import { getPagesTitle } from '@/utils/pages'

  import Header from './Header.vue'
  import Nav from './Nav.vue'

  export interface LayoutProps {
    /** 布局标题 优先级 当有header插槽时 该值无效 */
    title?: string
    /** 是否显示头部 */
    showHeader?: boolean
    /** content 头部距离顶部的距离 一般在自定义Header时使用 */
    top?: string
    /** 是否显示导航栏 */
    showNav?: boolean
  }

  const props = withDefaults(defineProps<LayoutProps>(), {
    title: '',
    showHeader: true
  })

  const title = ref(props.title)

  onMounted(() => {
    title.value = props.title || getPagesTitle()
  })
</script>

<template>
  <view class="layout-container">
    <!-- 头部 -->
    <slot v-if="$slots.header" name="header" />
    <Header v-else :title="title" :show-header="props.showHeader">
      <template #header-right>
        <slot name="header-right" />
      </template>
    </Header>
    <view class="layout-content" :style="{ paddingTop: props.top || (showHeader ? '80rpx' : '0') }">
      <slot></slot>
    </view>
    <Nav />
  </view>
</template>

<style lang="scss" scoped>
  .layout-container {
    position: relative;
    display: flex;
    flex-direction: column;

    .layout-content {
      flex: 1;
      background: linear-gradient(180deg, #f6f9ff 0%, #eef5ff 100%);
      box-sizing: border-box;
    }
  }
</style>
