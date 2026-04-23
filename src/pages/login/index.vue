<script setup lang="ts">
  import { setStorage } from '@/utils/storage'

  function handleLogin() {
    setStorage('TOKEN', '123456')
    uni.navigateTo({
      url: '/pages/dashboard/index'
    })
  }
</script>

<template>
  <view px-10 py-20 text-center>
    <view class="text-2xl font-bold" @click="handleLogin">登录</view>
    <tButton @click="handleLogin">登录</tButton>
  </view>
</template>
