<script setup lang="ts">
  import Card from '@/components/Dashboard/Card.vue'
  import TopSwiper from '@/components/Dashboard/TopSwiper.vue'
  import Layout from '@/components/Layout/index.vue'

  onPullDownRefresh(() => {
    uni.stopPullDownRefresh()
  })
</script>

<template>
  <Layout :show-header="false">
    <TopSwiper />
    <Card />
  </Layout>
</template>

<style lang="scss" scoped></style>
