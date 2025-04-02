<template>
  <div class="custom-card">
    <div class="custom-card-header">
      <div class="title">{{ $t('notam.overview.title') }}</div>
      <div class="subtitle">{{ $t('notam.overview.subtitle') }}</div>
      <div class="actions">
        <el-button-group>
          <el-button size="small" :type="timeRange === 'today' ? 'primary' : ''" @click="timeRange = 'today'">
            {{ $t('notam.overview.timeRange.today') }}
          </el-button>
          <el-button size="small" :type="timeRange === 'week' ? 'primary' : ''" @click="timeRange = 'week'">
            {{ $t('notam.overview.timeRange.week') }}
          </el-button>
          <el-button size="small" :type="timeRange === 'month' ? 'primary' : ''" @click="timeRange = 'month'">
            {{ $t('notam.overview.timeRange.month') }}
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div class="custom-card-content">
      <div class="overview-grid">
        <div class="stat-card total">
          <div class="icon-wrapper">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="label">{{ $t('notam.overview.total') }}</div>
            <div class="value">{{ stats.total }}</div>
            <div class="trend" :class="{ up: stats.totalTrend > 0, down: stats.totalTrend < 0 }">
              {{ Math.abs(stats.totalTrend) }}%
              <el-icon><CaretTop v-if="stats.totalTrend > 0" /><CaretBottom v-else /></el-icon>
            </div>
          </div>
        </div>
        <div class="stat-card active">
          <div class="icon-wrapper">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="stat-info">
            <div class="label">{{ $t('notam.overview.active') }}</div>
            <div class="value">{{ stats.active }}</div>
            <div class="trend" :class="{ up: stats.activeTrend > 0, down: stats.activeTrend < 0 }">
              {{ Math.abs(stats.activeTrend) }}%
              <el-icon><CaretTop v-if="stats.activeTrend > 0" /><CaretBottom v-else /></el-icon>
            </div>
          </div>
        </div>
        <div class="stat-card pending">
          <div class="icon-wrapper">
            <el-icon><Loading /></el-icon>
          </div>
          <div class="stat-info">
            <div class="label">{{ $t('notam.overview.pending') }}</div>
            <div class="value">{{ stats.pending }}</div>
            <div class="trend" :class="{ up: stats.pendingTrend > 0, down: stats.pendingTrend < 0 }">
              {{ Math.abs(stats.pendingTrend) }}%
              <el-icon><CaretTop v-if="stats.pendingTrend > 0" /><CaretBottom v-else /></el-icon>
            </div>
          </div>
        </div>
        <div class="stat-card expired">
          <div class="icon-wrapper">
            <el-icon><WarningFilled /></el-icon>
          </div>
          <div class="stat-info">
            <div class="label">{{ $t('notam.overview.expired') }}</div>
            <div class="value">{{ stats.expired }}</div>
            <div class="trend" :class="{ up: stats.expiredTrend > 0, down: stats.expiredTrend < 0 }">
              {{ Math.abs(stats.expiredTrend) }}%
              <el-icon><CaretTop v-if="stats.expiredTrend > 0" /><CaretBottom v-else /></el-icon>
            </div>
          </div>
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
import {
  Document,
  Timer,
  Loading,
  WarningFilled,
  CaretTop,
  CaretBottom
} from '@element-plus/icons-vue'

const { t } = useI18n()
const timeRange = ref('today')
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 模拟数据
const stats = ref({
  total: 258,
  totalTrend: 5.2,
  active: 156,
  activeTrend: 3.8,
  pending: 45,
  pendingTrend: -2.1,
  expired: 57,
  expiredTrend: -1.5
})

// 生成趋势数据
const generateTrendData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => (i < 10 ? '0' + i : i) + ':00')
  const totalData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 50 + 200))
  const activeData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 30 + 120))
  
  return {
    hours,
    totalData,
    activeData
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  const { hours, totalData, activeData } = generateTrendData()
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#808290',
          width: 1,
          type: 'dashed'
        }
      }
    },
    legend: {
      data: [t('notam.overview.total'), t('notam.overview.active')],
      bottom: '0%',
      icon: 'circle'
    },
    grid: {
      top: '5%',
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: hours,
      axisLine: {
        lineStyle: {
          color: '#808290'
        }
      },
      axisLabel: {
        color: '#808290'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#808290'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#808290',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#808290'
      }
    },
    series: [
      {
        name: t('notam.overview.total'),
        type: 'line',
        smooth: true,
        data: totalData,
        symbolSize: 6,
        itemStyle: {
          color: '#3B82F6'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59,130,246,0.3)' },
            { offset: 1, color: 'rgba(59,130,246,0.1)' }
          ])
        }
      },
      {
        name: t('notam.overview.active'),
        type: 'line',
        smooth: true,
        data: activeData,
        symbolSize: 6,
        itemStyle: {
          color: '#10B981'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16,185,129,0.3)' },
            { offset: 1, color: 'rgba(16,185,129,0.1)' }
          ])
        }
      }
    ]
  }
  
  chart.setOption(option)
}

// 监听时间范围变化
watch(timeRange, () => {
  if (chart) {
    const { hours, totalData, activeData } = generateTrendData()
    chart.setOption({
      xAxis: { data: hours },
      series: [
        { data: totalData },
        { data: activeData }
      ]
    })
  }
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
.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: var(--el-border-radius-base);
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-light);
  
  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 8px;
    margin-right: 16px;
    
    .el-icon {
      font-size: 24px;
      color: #fff;
    }
  }
  
  .stat-info {
    flex: 1;
    
    .label {
      font-size: 14px;
      color: var(--el-text-color-secondary);
      margin-bottom: 4px;
    }
    
    .value {
      font-size: 24px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      line-height: 1.2;
    }
    
    .trend {
      display: flex;
      align-items: center;
      font-size: 13px;
      margin-top: 4px;
      
      &.up {
        color: #10B981;
      }
      
      &.down {
        color: #EF4444;
      }
      
      .el-icon {
        margin-left: 4px;
      }
    }
  }
  
  &.total .icon-wrapper {
    background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
  }
  
  &.active .icon-wrapper {
    background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  }
  
  &.pending .icon-wrapper {
    background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
  }
  
  &.expired .icon-wrapper {
    background: linear-gradient(135deg, #EF4444 0%, #F87171 100%);
  }
}

.chart-container {
  height: 300px;
  margin-top: 20px;
}

@media screen and (max-width: 1200px) {
  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 12px;
    
    .icon-wrapper {
      width: 40px;
      height: 40px;
      margin-right: 12px;
      
      .el-icon {
        font-size: 20px;
      }
    }
    
    .stat-info {
      .value {
        font-size: 20px;
      }
    }
  }
  
  .chart-container {
    height: 200px;
  }
}
</style> 