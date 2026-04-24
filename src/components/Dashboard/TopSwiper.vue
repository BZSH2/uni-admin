<script lang="ts" setup>
  const swiperItems = ref([
    {
      title: '首页',
      svg: '/static/icon/dashboard/dashboard.svg',
      icon: '/static/icon/dashboard/dashboard1.svg'
    },
    {
      title: '用户',
      svg: '/static/icon/dashboard/message.svg',
      icon: '/static/icon/dashboard/message1.svg'
    },
    {
      title: '消息',
      svg: '/static/icon/dashboard/role.svg',
      icon: '/static/icon/dashboard/role1.svg'
    },
    {
      title: '设置',
      svg: '/static/icon/dashboard/setting.svg',
      icon: '/static/icon/dashboard/setting1.svg'
    },
    {
      title: '成功',
      svg: '/static/icon/dashboard/user.svg',
      icon: '/static/icon/dashboard/user1.svg'
    }
  ])
</script>

<template>
  <view class="dashboard-swiper">
    <swiper
      class="custom-swiper"
      :current="0"
      :autoplay="true"
      :duration="1000"
      :interval="5000"
      :indicator-dots="true"
      :circular="true"
      previous-margin="0"
      next-margin="0"
    >
      <swiper-item v-for="(item, index) in swiperItems" :key="index">
        <view class="swiper-item-content">
          <view class="swiper-item-content-title">{{ item.title }}</view>
          <image class="swiper-item-content-icon" :src="item.icon" />
          <image class="swiper-item-content-image" :src="item.svg" />
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss" scoped>
  .dashboard-swiper {
    padding: 12rpx;
  }

  .custom-swiper {
    height: 300rpx;
  }

  .swiper-item-content {
    height: 100%;
    width: 100%;
    border-radius: $uni-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: $uni-shadow;
    background: #ffffff;
    position: relative;

    .swiper-item-content-image {
      position: absolute;
      width: 50%;
      top: 50%;
      right: 30rpx;
      transform: translate(0, -50%);
    }

    .swiper-item-content-icon {
      position: absolute;
      width: 20%;
      top: 0;
      left: 80rpx;
    }

    .swiper-item-content-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #000000;
      position: absolute;
      top: 40rpx;
      left: 100rpx;
      transform: translate(0, -50%);
    }
  }
</style>
