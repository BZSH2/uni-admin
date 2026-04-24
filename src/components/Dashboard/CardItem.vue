<script setup lang="ts">
  defineProps<{
    item: {
      title: string
      content: string
      icon: string
    }
  }>()
</script>

<template>
  <t-col span="12" class="mb-12rpx">
    <view class="card-item">
      <view class="card-text">
        <view class="card-title">{{ item.title }}</view>
        <view class="card-content">{{ item.content }}</view>
      </view>
      <view class="card-icon">
        <image :src="item.icon" class="card-icon-image" />
      </view>
    </view>
  </t-col>
</template>

<style scoped lang="scss">
  .card-item {
    height: 100%;
    display: flex;
    align-items: center;
    background: #ffffff;
    box-shadow: $uni-shadow;
    border-radius: $uni-radius;
    position: relative;
    overflow: hidden;
    padding: 60rpx 0;

    .card-text {
      padding-left: 30rpx;

      .card-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
        margin-bottom: 12rpx;
      }

      .card-content {
        font-size: 24rpx;
        color: #666666;
        margin-bottom: 12rpx;
      }

      .card-icon {
        position: absolute;
        top: -100rpx;
        right: 0rpx;
        width: 240rpx;
      }
    }

    .card-icon-image {
      position: absolute;
      top: -100rpx;
      right: 0rpx;
      width: 240rpx;
    }
  }
</style>
