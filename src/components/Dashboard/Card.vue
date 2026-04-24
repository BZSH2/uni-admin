<script setup lang="ts">
  import CardItem from './CardItem.vue'

  defineProps<{
    active: number
  }>()

  const emit = defineEmits(['change-active'])

  const cardList = ref([
    {
      title: '测试1',
      content: '123',
      icon: '/static/icon/dashboard/card1.svg',
      color: '#40c9c6'
    },
    {
      title: '测试2',
      content: '456',
      icon: '/static/icon/dashboard/card2.svg',
      color: '#36a3f7'
    },
    {
      title: '测试3',
      content: '789',
      icon: '/static/icon/dashboard/card3.svg',
      color: '#f4516c'
    },
    {
      title: '测试4',
      content: '1011',
      icon: '/static/icon/dashboard/card4.svg',
      color: '#34bfa3'
    }
  ])
</script>

<template>
  <t-row gutter="8" class="px-12rpx">
    <CardItem
      v-for="(item, index) in cardList"
      :key="item.title"
      :item="item"
      :active="active === index"
      @click="emit('change-active', index)"
    />
  </t-row>
</template>
