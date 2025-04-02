<template>
  <div class="custom-card">
    <div class="custom-card-header">
      <div class="title-row">
        <div class="title-group">
          <div class="title">{{ $t('notam.analysis.distribution.title') }}</div>
          <div class="subtitle">{{ $t('notam.analysis.distribution.subtitle') }}</div>
        </div>
        <div class="actions">
          <el-radio-group v-model="selectedType" size="small">
            <el-radio-button label="distribution">{{ $t('notam.analysis.distribution.distribution') }}</el-radio-button>
            <el-radio-button label="timeline">{{ $t('notam.analysis.distribution.timeline') }}</el-radio-button>
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

const { t } = useI18n()
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null
const selectedType = ref('airport')

// 分布类型
const distributionTypes = {
  airport: 'airport',
  type: 'type',
  region: 'region'
}

// 模拟数据
const mockData = {
  airport: [
    { name: t('notam.airports.ZBAA'), value: 125 },
    { name: t('notam.airports.ZSPD'), value: 98 },
    { name: t('notam.airports.ZGGG'), value: 84 },
    { name: t('notam.airports.ZUUU'), value: 76 },
    { name: t('notam.airports.ZGSZ'), value: 65 },
    { name: t('notam.airports.ZPPP'), value: 58 },
    { name: t('notam.airports.ZUCK'), value: 52 },
    { name: t('notam.airports.ZHHH'), value: 48 }
  ],
  type: [
    { name: t('notam.analysis.type.legend.facilities'), value: 156 },
    { name: t('notam.analysis.type.legend.runway'), value: 124 },
    { name: t('notam.analysis.type.legend.navigation'), value: 98 },
    { name: t('notam.analysis.type.legend.airspace'), value: 87 },
    { name: t('notam.analysis.type.legend.weather'), value: 76 },
    { name: t('notam.analysis.type.legend.emergency'), value: 45 }
  ],
  region: [
    { name: t('notam.regions.north'), value: 186 },
    { name: t('notam.regions.east'), value: 165 },
    { name: t('notam.regions.south'), value: 142 },
    { name: t('notam.regions.southwest'), value: 98 },
    { name: t('notam.regions.northeast'), value: 76 },
    { name: t('notam.regions.northwest'), value: 65 }
  ]
}

// 更新图表
const updateChart = () => {
  if (!chart || !chartRef.value) return

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
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
        name: t('notam.analysis.distribution.title'),
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
        data: mockData[selectedType.value]
      }
    ]
  }

  chart.setOption(option)
}

// 监听类型变化
watch(selectedType, () => {
  updateChart()
})

// 监听语言变化
watch(() => t('notam.analysis.distribution.title'), () => {
  if (chart) {
    updateChart()
  }
})

// 初始化图表
onMounted(() => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    updateChart()
    window.addEventListener('resize', () => chart?.resize())
  }
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', () => chart?.resize())
})
</script>

<style lang="scss" scoped>
@import './styles/card.scss';
</style> 