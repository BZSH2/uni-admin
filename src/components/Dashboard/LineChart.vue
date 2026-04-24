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
    height: '450rpx',
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
    setOptions(props.chartData)
  }

  // 设置配置项
  function setOptions(data: ChartDataProps = {}) {
    if (!chartInstance) return

    const { expectedData = [], actualData = [] } = data

    chartInstance.setOption({
      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        boundaryGap: false,
        axisTick: {
          show: false
        }
      },
      grid: {
        left: 10,
        right: 10,
        bottom: 20,
        top: 40,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        padding: [5, 10]
      },
      yAxis: {
        axisTick: {
          show: false
        }
      },
      legend: {
        data: ['expected', 'actual'],
        top: 10,
        right: 10
      },
      series: [
        {
          name: 'expected',

          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },

        {
          name: 'actual',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: actualData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }
      ]
    })
  }

  // 监听数据变化
  watch(
    () => props.chartData,
    (newData) => {
      setOptions(newData)
    },
    { deep: true }
  )

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
  <view :class="className" class="line-chart" :style="{ height }">
    <ChartTitle title="折线图" />
    <!-- 图表容器，必须指定宽高 -->
    <div ref="chartRef" class="chart-container" />
  </view>
</template>

<style lang="scss" scoped>
  .line-chart {
    background: #ffffff;
    border-radius: $uni-radius;
    margin: 0 $uni-padding;
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
