<template>
  <div class="custom-card">
    <div class="custom-card-header">
      <div class="title-row">
        <div class="title-group">
          <div class="title">{{ $t('notam.analysis.region.title') }}</div>
          <div class="subtitle">{{ $t('notam.analysis.region.subtitle') }}</div>
        </div>
        <div class="actions">
          <el-radio-group v-model="selectedType" size="small">
            <el-radio-button label="total">{{ $t('notam.analysis.region.total') }}</el-radio-button>
            <el-radio-button label="active">{{ $t('notam.analysis.region.active') }}</el-radio-button>
            <el-radio-button label="pending">{{ $t('notam.analysis.region.pending') }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="custom-card-content">
      <div class="stats-overview">
        <div class="stat-item">
          <div class="value">{{ totalRegions }}</div>
          <div class="label">{{ $t('notam.analysis.region.totalRegions') }}</div>
        </div>
        <div class="stat-item">
          <div class="value">{{ maxNotamsRegion }}</div>
          <div class="label">{{ $t('notam.analysis.region.maxNotamsRegion') }}</div>
          <div class="tag info">{{ maxNotamsCount }} {{ $t('notam.analysis.region.notams') }}</div>
        </div>
        <div class="stat-item">
          <div class="value">{{ avgNotamsPerRegion }}</div>
          <div class="label">{{ $t('notam.analysis.region.avgNotamsPerRegion') }}</div>
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
import { chinaGeoJson } from './china-geo'
import type { EChartsOption } from 'echarts'

const { t } = useI18n()
const viewType = ref('map')
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null
const selectedType = ref('total')

// 模拟数据
const mockRegionalData = [
  { name: t('notam.regions.north'), value: 235, airports: 45, active: 180 },
  { name: t('notam.regions.northeast'), value: 189, airports: 38, active: 145 },
  { name: t('notam.regions.east'), value: 312, airports: 62, active: 256 },
  { name: t('notam.regions.central'), value: 278, airports: 55, active: 220 },
  { name: t('notam.regions.southwest'), value: 198, airports: 42, active: 165 },
  { name: t('notam.regions.northwest'), value: 167, airports: 35, active: 134 },
  { name: t('notam.regions.xinjiang'), value: 145, airports: 28, active: 112 }
]

// 模拟统计数据
const totalRegions = ref(7)
const maxNotamsRegion = ref(t('notam.regions.north'))
const maxNotamsCount = ref(156)
const avgNotamsPerRegion = ref(98)

// 注册地图数据
onMounted(() => {
  echarts.registerMap('china', chinaGeoJson)
  initChart()
  window.addEventListener('resize', handleResize)
})

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  updateChart()
}

// 更新图表
const updateChart = () => {
  if (!chart) return

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>${t('notam.analysis.region.notams')}: ${data.value}`
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
      data: mockRegionalData.map(item => item.name),
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      axisLabel: {
        color: '#6B7280',
        fontSize: 12,
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: t('notam.analysis.region.notamCount'),
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
        fontSize: 12,
        formatter: (value: number) => `${value}${t('notam.analysis.region.unit')}`
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
        name: t(`notam.analysis.region.${selectedType.value}`),
        type: 'bar',
        data: mockRegionalData.map(item => ({
          value: item[selectedType.value],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#60A5FA' },
              { offset: 1, color: '#93C5FD' }
            ])
          }
        })),
        barWidth: '60%',
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#3B82F6' },
              { offset: 1, color: '#60A5FA' }
            ])
          }
        }
      }
    ]
  }

  chart.setOption(option)
}

// 监听类型变化
watch(selectedType, () => {
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

.stats-overview {
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

      &.info {
        background-color: var(--el-color-info-light-9);
        color: var(--el-color-info);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .stats-overview {
    flex-direction: column;
    gap: 16px;

    .stat-item {
      padding: 0;
    }
  }
}
</style> 