<template>
  <div class="custom-card">
    <div class="custom-card-header">
      <div class="title-row">
        <div class="title-group">
          <div class="title">{{ $t('notam.analysis.efficiency.title') }}</div>
          <div class="subtitle">{{ $t('notam.analysis.efficiency.subtitle') }}</div>
        </div>
        <div class="actions">
          <el-radio-group v-model="selectedMetric" size="small">
            <el-radio-button label="processingTime">{{ $t('notam.analysis.efficiency.processingTime') }}</el-radio-button>
            <el-radio-button label="responseRate">{{ $t('notam.analysis.efficiency.responseRate') }}</el-radio-button>
            <el-radio-button label="completionRate">{{ $t('notam.analysis.efficiency.completionRate') }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="custom-card-content">
      <div class="metrics-overview">
        <div class="metric-item">
          <div class="value">{{ avgProcessingTime }}{{ $t('notam.analysis.efficiency.minutes') }}</div>
          <div class="label">{{ $t('notam.analysis.efficiency.avgProcessingTime') }}</div>
        </div>
        <div class="metric-item">
          <div class="value">{{ responseRate }}%</div>
          <div class="label">{{ $t('notam.analysis.efficiency.responseRate') }}</div>
          <div class="tag success">{{ $t('notam.analysis.efficiency.target') }}: 95%</div>
        </div>
        <div class="metric-item">
          <div class="value">{{ completionRate }}%</div>
          <div class="label">{{ $t('notam.analysis.efficiency.completionRate') }}</div>
          <div class="tag warning">{{ $t('notam.analysis.efficiency.target') }}: 98%</div>
        </div>
      </div>
      <div class="chart-container" ref="chartRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const { t } = useI18n()
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null
const selectedMetric = ref('processingTime')

// 模拟指标数据
const avgProcessingTime = ref(15)
const timeChange = ref(-5)
const responseRate = ref(95)
const responseChange = ref(2)
const completionRate = ref(98)
const completionChange = ref(1)

// 模拟图表数据生成函数
const generateChartData = () => {
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
  })

  const metrics = {
    processingTime: {
      name: t('notam.analysis.efficiency.processingTime'),
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 10),
      unit: t('notam.analysis.efficiency.minutes')
    },
    responseRate: {
      name: t('notam.analysis.efficiency.responseRate'),
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 90),
      unit: '%'
    },
    completionRate: {
      name: t('notam.analysis.efficiency.completionRate'),
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 5) + 95),
      unit: '%'
    }
  }

  return { dates, metrics }
}

const updateChart = () => {
  if (!chart) return

  const { dates, metrics } = generateChartData()
  const currentMetric = metrics[selectedMetric.value]

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>${currentMetric.name}: ${data.value}${currentMetric.unit}`
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
      data: dates,
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
      name: currentMetric.unit,
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
        type: 'line',
        smooth: true,
        data: currentMetric.data,
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

// 监听指标变化
watch(selectedMetric, () => {
  updateChart()
})

// 监听窗口大小变化
const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    updateChart()
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
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