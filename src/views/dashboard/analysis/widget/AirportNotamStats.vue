<template>
  <div class="custom-card">
    <div class="custom-card-header">
      <div class="title-row">
        <div class="title-group">
          <div class="title">{{ $t('notam.analysis.airport.title') }}</div>
          <div class="subtitle">{{ $t('notam.analysis.airport.subtitle') }}</div>
        </div>
        <div class="actions">
          <el-radio-group v-model="selectedMetric" size="small">
            <el-radio-button label="total">{{ $t('notam.analysis.airport.metrics.total') }}</el-radio-button>
            <el-radio-button label="active">{{ $t('notam.analysis.airport.metrics.active') }}</el-radio-button>
            <el-radio-button label="pending">{{ $t('notam.analysis.airport.metrics.pending') }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="custom-card-content">
      <div class="metrics-overview">
        <div class="metric-item">
          <div class="value">{{ totalNotams }}</div>
          <div class="label">{{ $t('notam.analysis.airport.totalNotams') }}</div>
        </div>
        <div class="metric-item">
          <div class="value">{{ activeNotams }}</div>
          <div class="label">{{ $t('notam.analysis.airport.activeNotams') }}</div>
          <div class="tag success">{{ $t('notam.analysis.airport.normal') }}</div>
        </div>
        <div class="metric-item">
          <div class="value">{{ pendingNotams }}</div>
          <div class="label">{{ $t('notam.analysis.airport.pendingNotams') }}</div>
          <div class="tag warning">{{ $t('notam.analysis.airport.warning') }}</div>
        </div>
      </div>
      <div class="chart-container" ref="chartRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const timeRange = ref('week')

// 模拟数据
const tableData = ref([
  {
    airport: '北京大兴国际机场',
    status: '正常',
    total: 156,
    active: 89,
    processing: 12,
    avgProcessTime: 15,
    efficiency: 95,
    trend: [30, 35, 28, 42, 38, 45, 32]
  },
  {
    airport: '上海浦东国际机场',
    status: '正常',
    total: 142,
    active: 76,
    processing: 8,
    avgProcessTime: 18,
    efficiency: 92,
    trend: [25, 32, 38, 35, 28, 30, 35]
  },
  {
    airport: '广州白云国际机场',
    status: '警告',
    total: 128,
    active: 65,
    processing: 15,
    avgProcessTime: 22,
    efficiency: 85,
    trend: [28, 25, 32, 28, 35, 30, 25]
  },
  {
    airport: '深圳宝安国际机场',
    status: '正常',
    total: 98,
    active: 52,
    processing: 6,
    avgProcessTime: 16,
    efficiency: 94,
    trend: [22, 28, 32, 35, 30, 28, 32]
  },
  {
    airport: '成都双流国际机场',
    status: '正常',
    total: 86,
    active: 45,
    processing: 5,
    avgProcessTime: 17,
    efficiency: 93,
    trend: [25, 30, 28, 32, 35, 30, 28]
  }
])

// 进度条颜色计算
const getProgressColor = (efficiency: number) => {
  if (efficiency >= 90) return '#10B981'
  if (efficiency >= 80) return '#F59E0B'
  return '#EF4444'
}

// 迷你趋势图
const sparklineCharts = new Map()

const setSparkline = (el: HTMLElement | null, data: number[]) => {
  if (!el) return

  const chart = echarts.init(el)
  sparklineCharts.set(el, chart)

  const option = {
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    xAxis: {
      type: 'category',
      show: false,
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      show: false,
      min: Math.min(...data) * 0.9,
      max: Math.max(...data) * 1.1
    },
    series: [
      {
        type: 'line',
        data: data,
        symbol: 'none',
        smooth: true,
        lineStyle: {
          color: '#3B82F6',
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(59, 130, 246, 0.2)'
            },
            {
              offset: 1,
              color: 'rgba(59, 130, 246, 0)'
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
  sparklineCharts.forEach(chart => {
    chart.resize()
  })
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  sparklineCharts.forEach(chart => {
    chart.dispose()
  })
  sparklineCharts.clear()
})

// 模拟图表数据生成函数
const generateChartData = () => {
  const airports = Object.keys(t('notam.airports', { returnObjects: true }))
  const metrics = {
    total: {
      name: t('notam.analysis.airport.metrics.total'),
      data: Array.from({ length: airports.length }, () => Math.floor(Math.random() * 50) + 50)
    },
    active: {
      name: t('notam.analysis.airport.metrics.active'),
      data: Array.from({ length: airports.length }, () => Math.floor(Math.random() * 30) + 20)
    },
    pending: {
      name: t('notam.analysis.airport.metrics.pending'),
      data: Array.from({ length: airports.length }, () => Math.floor(Math.random() * 10) + 5)
    }
  }

  return { airports, metrics }
}

const updateChart = () => {
  if (!chart) return

  const { airports, metrics } = generateChartData()
  const currentMetric = metrics[selectedMetric.value]

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const data = params[0]
        return `${t(`notam.airports.${data.name}`)}<br/>${currentMetric.name}: ${data.value}`
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
      data: airports,
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      axisLabel: {
        color: '#6B7280',
        fontSize: 12,
        formatter: (value: string) => t(`notam.airports.${value}`)
      }
    },
    yAxis: {
      type: 'value',
      name: t('notam.analysis.airport.quantity'),
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
        name: currentMetric.name,
        type: 'bar',
        data: currentMetric.data.map((value, index) => ({
          value,
          name: airports[index]
        })),
        itemStyle: {
          color: '#3B82F6'
        }
      }
    ]
  }

  chart.setOption(option)
}
</script>

<style lang="scss" scoped>
@import './styles/card.scss';

.metrics-overview {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;

  .metric-item {
    text-align: center;
    padding: 0 20px;

    .value {
      font-size: 24px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 4px;
    }

    .label {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }

    .tag {
      display: inline-block;
      padding: 2px 6px;
      font-size: 12px;
      border-radius: 4px;
      margin-top: 4px;

      &.success {
        background-color: var(--el-color-success-light-9);
        color: var(--el-color-success);
      }

      &.warning {
        background-color: var(--el-color-warning-light-9);
        color: var(--el-color-warning);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .metrics-overview {
    flex-direction: column;
    gap: 16px;

    .metric-item {
      padding: 0;
    }
  }
}
</style> 