<template>
  <div class="custom-card">
    <div class="custom-card-header">
      <div class="title">{{ $t('notam.analysis.trends.title') }}</div>
      <div class="subtitle">{{ $t('notam.analysis.trends.subtitle') }}</div>
      <div class="actions">
        <el-button-group>
          <el-button size="small">{{ $t('notam.analysis.trends.day') }}</el-button>
          <el-button size="small" type="primary">{{ $t('notam.analysis.trends.week') }}</el-button>
          <el-button size="small">{{ $t('notam.analysis.trends.month') }}</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="custom-card-content">
      <div class="chart-container" ref="chartRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const { t } = useI18n()
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 模拟数据
const mockData = {
  dates: Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
  }),
  values: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 30)
}

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: mockData.dates,
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      axisLabel: {
        color: '#6B7280',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: t('notam.analysis.trends.quantity'),
      nameTextStyle: {
        color: '#6B7280',
        fontSize: 12
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#6B7280',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: '#E5E7EB',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: t('notam.analysis.trends.notamQuantity'),
        type: 'line',
        smooth: true,
        data: mockData.values,
        itemStyle: {
          color: '#3B82F6'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(59, 130, 246, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(59, 130, 246, 0.1)'
            }
          ])
        }
      }
    ]
  }

  chart.setOption(option)
}

// 监听窗口大小变化
const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.custom-card {
  height: 100%;
  background: var(--art-main-bg-color);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--el-box-shadow);
  }
}

.chart-container {
  width: 100%;
  height: 300px;
}
</style> 