<script lang="ts" setup>
  const navItems = ref([
    {
      icon: '/static/icon/nav/dashboard.svg',
      text: '首页',
      path: '/pages/dashboard/index'
    },
    {
      icon: '/static/icon/nav/user.svg',
      text: '用户',
      path: '/pages/user/index'
    },
    {
      icon: '/static/icon/nav/message.svg',
      text: '消息',
      path: '/pages/message/index'
    },
    {
      icon: '/static/icon/nav/setting.svg',
      text: '设置',
      path: '/pages/setting/index'
    }
  ])

  function handleClick(path: string) {
    uni.navigateTo({
      url: path
    })
  }
</script>

<template>
  <view class="layout-nav">
    <view
      v-for="item in navItems"
      :key="item.text"
      class="layout-nav-item"
      @click="handleClick(item.path)"
    >
      <view class="layout-nav-item-icon-container">
        <image class="layout-nav-item-icon" :src="item.icon" />
      </view>

      <view class="layout-nav-item-text">{{ item.text }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  .layout-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120rpx;
    background: #ffffff;
    box-shadow: 2rpx 4rpx 0 rgb(0, 0, 0, 10%);
    display: flex;
    justify-content: space-around;
    align-items: center;

    .layout-nav-item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      flex: 1;
    }

    .layout-nav-item-icon-container {
      margin-top: 20rpx;
    }

    .layout-nav-item-icon {
      width: 40rpx;
      height: 40rpx;
    }

    .layout-nav-item-text {
      font-size: 18rpx;
    }
  }
</style>
