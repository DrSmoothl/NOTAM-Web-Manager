<template>
  <div class="custom-card">
    <div class="custom-card-header">
      <div class="title-row">
        <div class="title-group">
          <div class="title">{{ $t('notam.analysis.type.title') }}</div>
          <div class="subtitle">{{ $t('notam.analysis.type.subtitle') }}</div>
        </div>
        <div class="actions">
          <el-radio-group v-model="timeRange" size="small">
            <el-radio-button label="week">{{ $t('notam.analysis.type.week') }}</el-radio-button>
            <el-radio-button label="month">{{ $t('notam.analysis.type.month') }}</el-radio-button>
            <el-radio-button label="year">{{ $t('notam.analysis.type.year') }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="custom-card-content">
      <div class="chart-container" ref="chartRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { format } from 'date-fns'

const { t } = useI18n()
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null
const timeRange = ref('week')

// 模拟数据生成函数
const generateMockData = (days: number) => {
  const dates = Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    return `${date.getMonth() + 1}-${date.getDate()}`
  })

  const types = [
    t('notam.analysis.type.legend.facilities'),
    t('notam.analysis.type.legend.runway'),
    t('notam.analysis.type.legend.navigation'),
    t('notam.analysis.type.legend.airspace'),
    t('notam.analysis.type.legend.weather'),
    t('notam.analysis.type.legend.emergency')
  ]

  const series = types.map(type => ({
    name: type,
    type: 'line',
    smooth: true,
    emphasis: {
      focus: 'series'
    },
    data: Array.from({ length: days }, () => Math.floor(Math.random() * 20) + 5)
  }))

  return {
    dates,
    series
  }
}

const updateChart = () => {
  if (!chart) return

  const days = timeRange.value === 'week' ? 7 : timeRange.value === 'month' ? 30 : 365
  const { dates, series } = generateMockData(days)

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: [
        t('notam.analysis.type.legend.facilities'),
        t('notam.analysis.type.legend.runway'),
        t('notam.analysis.type.legend.navigation'),
        t('notam.analysis.type.legend.airspace'),
        t('notam.analysis.type.legend.weather'),
        t('notam.analysis.type.legend.emergency')
      ],
      top: 0,
      textStyle: {
        color: '#6B7280'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '40px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      axisLabel: {
        color: '#6B7280',
        fontSize: 12,
        rotate: timeRange.value === 'year' ? 45 : 0
      }
    },
    yAxis: {
      type: 'value',
      name: t('notam.analysis.type.quantity'),
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
    series: series.map((item, index) => ({
      ...item,
      itemStyle: {
        color: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899'
        ][index]
      }
    }))
  }

  chart.setOption(option)
}

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  updateChart()
}

// 监听时间范围变化
watch(timeRange, () => {
  updateChart()
})

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
@import './styles/card.scss';

.custom-card {
  height: 100%;
  background: var(--art-main-bg-color);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: var(--el-box-shadow);
  }
}

.custom-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-light);
  flex-wrap: wrap;
  gap: 8px;

  .title {
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  .subtitle {
    margin-top: 4px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

.custom-card-content {
  flex: 1;
  padding: 20px;
  min-height: 0;
}

.chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style> 