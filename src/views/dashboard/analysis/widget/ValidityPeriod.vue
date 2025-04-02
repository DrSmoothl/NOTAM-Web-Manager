<template>
  <div class="custom-card">
    <div class="custom-card-header">
      <div class="title-row">
        <div class="title-group">
          <div class="title">{{ $t('notam.analysis.validity.title') }}</div>
          <div class="subtitle">{{ $t('notam.analysis.validity.subtitle') }}</div>
        </div>
        <div class="actions">
          <el-radio-group v-model="analysisType" size="small">
            <el-radio-button label="distribution">{{ $t('notam.analysis.validity.distribution') }}</el-radio-button>
            <el-radio-button label="timeline">{{ $t('notam.analysis.validity.timeline') }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="custom-card-content">
      <div class="statistics-overview">
        <div class="stat-item">
          <div class="value">{{ avgValidityDays }}{{ $t('notam.analysis.validity.days') }}</div>
          <div class="label">{{ $t('notam.analysis.validity.avgValidity') }}</div>
        </div>
        <div class="stat-item">
          <div class="value">{{ activeNotams }}</div>
          <div class="label">{{ $t('notam.analysis.validity.activeNotams') }}</div>
        </div>
        <div class="stat-item">
          <div class="value">{{ expiringNotams }}</div>
          <div class="label">{{ $t('notam.analysis.validity.expiringNotams') }}</div>
          <div class="tag warning">{{ $t('notam.analysis.validity.next7Days') }}</div>
        </div>
      </div>
      <div class="chart-container" ref="chartRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const { t } = useI18n()
const chartRef = ref<HTMLElement>()
let chart = ref<echarts.ECharts | null>(null)
const analysisType = ref('distribution')

// 模拟统计数据
const avgValidityDays = ref(30)
const activeNotams = ref(156)
const expiringNotams = ref(23)

// 模拟分布数据生成函数
const generateDistributionData = () => {
  const periods = [
    t('notam.analysis.validity.periods.1to7'),
    t('notam.analysis.validity.periods.8to30'),
    t('notam.analysis.validity.periods.31to90'),
    t('notam.analysis.validity.periods.91to180'),
    t('notam.analysis.validity.periods.181to365'),
    t('notam.analysis.validity.periods.over365')
  ]
  const data = periods.map(period => ({
    name: period,
    value: Math.floor(Math.random() * 100) + 20
  }))
  return { periods, data }
}

// 模拟时间轴数据生成函数
const generateTimelineData = () => {
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
  })

  return dates.map(date => ({
    date,
    active: Math.floor(Math.random() * 50) + 100,
    expiring: Math.floor(Math.random() * 20) + 5,
    new: Math.floor(Math.random() * 30) + 10
  }))
}

const updateChart = () => {
  if (!chart.value) return

  let option: EChartsOption
  if (analysisType.value === 'distribution') {
    const { periods, data } = generateDistributionData()
    option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        textStyle: {
          color: 'var(--el-text-color-regular)'
        }
      },
      series: [
        {
          name: t('notam.analysis.validity.distribution'),
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: 'var(--el-bg-color)',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    }
  } else {
    const timelineData = generateTimelineData()
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: [
          t('notam.analysis.validity.active'),
          t('notam.analysis.validity.expiring'),
          t('notam.analysis.validity.new')
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
        data: timelineData.map(item => item.date),
        axisLine: {
          lineStyle: {
            color: '#E5E7EB'
          }
        },
        axisLabel: {
          color: '#6B7280',
          fontSize: 12,
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: t('notam.analysis.validity.quantity'),
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
          name: t('notam.analysis.validity.active'),
          type: 'bar',
          stack: 'total',
          data: timelineData.map(item => item.active),
          itemStyle: {
            color: '#10B981'
          }
        },
        {
          name: t('notam.analysis.validity.expiring'),
          type: 'bar',
          stack: 'total',
          data: timelineData.map(item => item.expiring),
          itemStyle: {
            color: '#F59E0B'
          }
        },
        {
          name: t('notam.analysis.validity.new'),
          type: 'bar',
          stack: 'total',
          data: timelineData.map(item => item.new),
          itemStyle: {
            color: '#3B82F6'
          }
        }
      ]
    }
  }

  chart.value.setOption(option)
}

// 监听分析类型变化
watch(analysisType, () => {
  nextTick(() => {
    updateChart()
  })
})

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  if (chart.value) {
    chart.value.dispose()
  }
  
  chart.value = echarts.init(chartRef.value)
  updateChart()
}

// 处理窗口大小变化
const handleResize = () => {
  if (chart.value) {
    chart.value.resize()
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chart.value) {
    chart.value.dispose()
    chart.value = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
@import './styles/card.scss';

.statistics-overview {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;

  .stat-item {
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

      &.warning {
        background-color: var(--el-color-warning-light-9);
        color: var(--el-color-warning);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .statistics-overview {
    flex-direction: column;
    gap: 16px;

    .stat-item {
      padding: 0;
    }
  }
}
</style> 