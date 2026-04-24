<script lang="ts" setup>
  defineProps<{
    title: string
  }>()
</script>

<template>
  <view class="chart-title">{{ title }}</view>
</template>

<style lang="scss" scoped>
  .chart-title {
    font-size: 24rpx;
    font-weight: bold;
    color: #333333;
    padding: 16rpx 24rpx;
    border-bottom: 1rpx solid #ededed;
  }
</style>
