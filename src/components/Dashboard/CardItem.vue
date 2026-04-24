<script setup lang="ts">
  defineProps<{
    item: {
      title: string
      content: string
      icon: string
      color: string
    }
    active: boolean
  }>()
</script>

<template>
  <t-col span="12" class="mb-12rpx">
    <view class="card-item">
      <view class="card-text">
        <view class="card-title" :style="{ color: active ? item.color : '' }">
          {{ item.title }}
        </view>
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
    padding: 30rpx 0;

    .card-text {
      margin-left: 12rpx;
      border-radius: $uni-radius;
      padding-left: $uni-padding;
      padding-bottom: $uni-padding;

      .card-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
        margin: 12rpx 0 6rpx;
        padding: 0 12rpx;
      }

      .card-content {
        font-size: 24rpx;
        color: #666666;
        padding-left: $uni-padding;
      }
    }

    .card-icon-image {
      position: absolute;
      top: -110rpx;
      right: 20rpx;
      width: 180rpx;
    }
  }
</style>
