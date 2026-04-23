<script setup lang="ts">
  import type { LayoutProps } from './index.vue'

  const props = defineProps<LayoutProps>()
</script>

<template>
  <view v-if="props.showHeader" class="layout-header px-[12px]">
    <view class="layout-header-back">
      <t-icon name="chevron-left" size="48rpx" />
    </view>
    <view class="layout-header-title">{{ props.title }}</view>
    <view class="layout-header-slot">
      <slot name="header-right" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
  .layout-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    z-index: 1;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 8px 32px rgb(0, 0, 0, 10%);
  }
</style>
