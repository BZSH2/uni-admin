<script lang="ts" setup>
  import * as echarts from 'echarts'

  // 引入主题，如果环境不支持 require 请注释掉下面这行，并移除 initChart 中的 'macarons' 参数
  // require('echarts/theme/macarons')
  import ChartTitle from './ChartTitle.vue'

  // 定义 Props 接口
  interface ChartDataProps {
    expectedData?: number[]
    actualData?: number[]
  }

  interface Props {
    className?: string
    height?: string
    autoResize?: boolean
    chartData?: ChartDataProps
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
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      radar: {
        radius: '66%',
        center: ['50%', '42%'],
        splitNumber: 8,
        splitArea: {
          areaStyle: {
            color: 'rgba(127,95,132,.3)',
            opacity: 1,
            shadowBlur: 45,
            shadowColor: 'rgba(0,0,0,.5)',
            shadowOffsetX: 0,
            shadowOffsetY: 15
          }
        },
        indicator: [
          { name: 'Sales', max: 10000 },
          { name: 'Administration', max: 20000 },
          { name: 'Information Technology', max: 20000 },
          { name: 'Customer Support', max: 20000 },
          { name: 'Development', max: 20000 },
          { name: 'Marketing', max: 20000 }
        ]
      },
      legend: {
        left: 'center',
        bottom: '10',
        data: ['Allocated Budget', 'Expected Spending', 'Actual Spending']
      },
      series: [
        {
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: [
            {
              value: [5000, 7000, 12000, 11000, 15000, 14000],
              name: 'Allocated Budget'
            },
            {
              value: [4000, 9000, 15000, 15000, 13000, 11000],
              name: 'Expected Spending'
            },
            {
              value: [5500, 11000, 12000, 15000, 12000, 12000],
              name: 'Actual Spending'
            }
          ],
          animationDuration: 3000
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
  <view :class="className" class="raddar-chart" :style="{ height }">
    <ChartTitle title="雷达图" />
    <!-- 图表容器，必须指定宽高 -->
    <div ref="chartRef" class="chart-container" />
  </view>
</template>

<style lang="scss" scoped>
  .raddar-chart {
    background: #ffffff;
    border-radius: $uni-radius;
    margin: $uni-margin $uni-margin 0 $uni-margin;
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
