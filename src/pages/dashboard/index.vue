<script setup lang="ts">
  import Card from '@/components/Dashboard/Card.vue'
  import LineChart from '@/components/Dashboard/LineChart.vue'
  import RaddarChart from '@/components/Dashboard/RaddarChart.vue'
  import TopSwiper from '@/components/Dashboard/TopSwiper.vue'
  import Layout from '@/components/Layout/index.vue'

  const activeIndex = ref(0)
  const lineChartData = ref([
    {
      expectedData: [100, 120, 161, 134, 105, 160, 165],
      actualData: [120, 82, 91, 154, 162, 140, 145]
    },
    {
      expectedData: [200, 192, 120, 144, 160, 130, 140],
      actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    {
      expectedData: [80, 100, 121, 104, 105, 90, 100],
      actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    {
      expectedData: [130, 140, 141, 142, 145, 150, 160],
      actualData: [120, 82, 91, 154, 162, 140, 130]
    }
  ])

  function changeActive(index: number) {
    activeIndex.value = index
  }

  onPullDownRefresh(() => {
    uni.stopPullDownRefresh()
  })
</script>

<template>
  <Layout :show-header="false">
    <TopSwiper />
    <Card :active="activeIndex" @change-active="changeActive" />
    <LineChart :chart-data="lineChartData[activeIndex]" :auto-resize="true" />
    <RaddarChart />
  </Layout>
</template>

<style lang="scss" scoped></style>
