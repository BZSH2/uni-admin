<script lang="ts" setup>
  import * as echarts from 'echarts'

  // 引入主题，如果环境不支持 require 请注释掉下面这行，并移除 initChart 中的 'macarons' 参数
  // require('echarts/theme/macarons')
  import ChartTitle from './ChartTitle.vue'

  interface Props {
    className?: string
    height?: string
    autoResize?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    className: 'chart',
    height: '350px',
    autoResize: true,
    chartData: () => ({ expectedData: [], actualData: [] })
  })

  // 获取 DOM 节点
  const chartRef = ref<HTMLElement | null>(null)
  let chartInstance: echarts.ECharts | null = null

  // 初始化图表
  function initChart() {
    if (!chartRef.value) return

    // 如果不需要 macarons 主题，第二个参数传 null 或 undefined
    chartInstance = echarts.init(chartRef.value, 'macarons')
    setOptions()
  }

  // 设置配置项
  function setOptions() {
    if (!chartInstance) return

    chartInstance.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        left: 'center',
        bottom: '10',
        data: ['Industries', 'Technology', 'Forex', 'Gold', 'For']
      },
      series: [
        {
          name: 'WEEKLY WRITE ARTICLES',
          type: 'pie',
          roseType: 'radius',
          radius: [15, 95],
          center: ['50%', '38%'],
          data: [
            { value: 320, name: 'Industries' },
            { value: 240, name: 'Technology' },
            { value: 149, name: 'Forex' },
            { value: 100, name: 'Gold' },
            { value: 59, name: 'For' }
          ],
          animationEasing: 'cubicInOut',
          animationDuration: 2600
        }
      ]
    })
  }

  // 监听尺寸变化 (简单的实现，对应原 mixins/resize)
  // 如果需要复杂的防抖 resize 逻辑，可以使用 @vueuse/core 的 useResizeObserver
  function handleResize() {
    chartInstance?.resize()
  }

  onMounted(() => {
    initChart()
    if (props.autoResize) {
      window.addEventListener('resize', handleResize)
    }
  })

  onBeforeUnmount(() => {
    if (props.autoResize) {
      window.removeEventListener('resize', handleResize)
    }
    chartInstance?.dispose()
    chartInstance = null
  })
</script>

<template>
  <view :class="className" class="pie-chart" :style="{ height }">
    <ChartTitle title="饼图" />
    <!-- 图表容器，必须指定宽高 -->
    <div ref="chartRef" class="chart-container" />
  </view>
</template>

<style lang="scss" scoped>
  .pie-chart {
    background: #ffffff;
    border-radius: $uni-radius;
    margin: $uni-margin $uni-margin 0;
    position: relative;

    // 确保容器有高度，否则图表可能无法显示
    display: flex;
    flex-direction: column;

    .chart-container {
      // 减去标题的高度，或者直接撑满，视具体需求而定
      // 如果 ChartTitle 占位较高，这里可能需要 calc(100% - 50px) 之类的处理
      flex: 1;
      min-height: 0; // 防止 flex 溢出
    }
  }
</style>
