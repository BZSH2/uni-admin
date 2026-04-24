<script setup lang="ts">
  import CardItem from './CardItem.vue'

  const cardList = ref([
    {
      title: '测试1',
      content: '123',
      icon: '/static/icon/dashboard/card1.svg'
    },
    {
      title: '测试2',
      content: '456',
      icon: '/static/icon/dashboard/card2.svg'
    },
    {
      title: '测试3',
      content: '789',
      icon: '/static/icon/dashboard/card3.svg'
    },
    {
      title: '测试4',
      content: '1011',
      icon: '/static/icon/dashboard/card4.svg'
    }
  ])
</script>

<template>
  <t-row gutter="8" class="px-12rpx">
    <CardItem v-for="item in cardList" :key="item.title" :item="item" />
  </t-row>
</template>
