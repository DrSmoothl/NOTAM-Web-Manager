<template>
  <div class="region sales-overview art-custom-card">
    <div class="card-header">
      <div class="title">
        <h4 class="box-title">NOTAM分类统计</h4>
        <p class="subtitle">按类型统计 <span class="text-success">实时数据</span></p>
      </div>
    </div>
    <div class="chart" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { useECharts } from '@/utils/echarts/useECharts'
import { useSettingStore } from '@/store/modules/setting'
import { getCssVariable } from '@/utils/colors'

const chartRef = ref<HTMLDivElement>()
const { setOptions, removeResize, resize } = useECharts(chartRef as Ref<HTMLDivElement>)

const store = useSettingStore()
const isDark = computed(() => store.isDark)
const settingStore = useSettingStore()
const menuOpen = computed(() => settingStore.menuOpen)

// 监听窗口大小变化
const handleResize = () => {
  const delays = [100, 200, 300]
  delays.forEach((delay) => {
    setTimeout(resize, delay)
  })
}

// 监听菜单状态变化
watch(menuOpen, () => {
  handleResize()
})

// 添加窗口大小变化监听
onMounted(() => {
  createChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  removeResize()
  window.removeEventListener('resize', handleResize)
})

const createChart = () => {
  setOptions({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['跑道', '导航设备', '天气', '空域', '机场设施', '其他'],
      bottom: '5%',
      left: 'center',
      textStyle: {
        color: isDark.value ? '#808290' : '#222B45'
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      axisLine: {
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3'
        }
      },
      axisLabel: {
        color: isDark.value ? '#808290' : '#222B45',
        fontSize: 12,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '数量',
      nameTextStyle: {
        color: isDark.value ? '#808290' : '#222B45',
        fontSize: 12,
        padding: [0, 30, 0, 0]
      },
      splitLine: {
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: isDark.value ? '#808290' : '#222B45',
        fontSize: 12
      }
    },
    series: [
      {
        name: '跑道',
        type: 'bar',
        stack: 'total',
        barWidth: '60%',
        emphasis: {
          focus: 'series'
        },
        data: [42, 55, 48, 52, 45, 58],
        itemStyle: {
          color: getCssVariable('--el-color-primary')
        }
      },
      {
        name: '导航设备',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: [35, 42, 38, 45, 38, 42],
        itemStyle: {
          color: getCssVariable('--el-color-success')
        }
      },
      {
        name: '天气',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: [28, 35, 42, 38, 32, 38],
        itemStyle: {
          color: getCssVariable('--el-color-warning')
        }
      },
      {
        name: '空域',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: [25, 28, 32, 35, 30, 34],
        itemStyle: {
          color: getCssVariable('--el-color-danger')
        }
      },
      {
        name: '机场设施',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: [20, 25, 28, 32, 25, 30],
        itemStyle: {
          color: getCssVariable('--el-color-info')
        }
      },
      {
        name: '其他',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: [15, 20, 25, 22, 28, 25],
        itemStyle: {
          color: '#8e9dbb'
        }
      }
    ]
  })
}

watch(isDark, () => {
  createChart()
})
</script>

<style lang="scss" scoped>
.sales-overview {
  height: 520px;
  padding: 20px;
  transition: all 0.3s ease;
  min-width: 600px;
  width: 100%;
  flex: 1;

  .card-header {
    .title {
      .box-title {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }

      .subtitle {
        margin: 5px 0 0;
        font-size: 13px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .chart {
    height: 440px;
    width: 100%;
  }

  @media (max-width: $device-notebook) {
    height: 420px;
    min-width: 500px;
    
    .chart {
      height: 340px;
    }
  }

  @media (max-width: $device-ipad-pro) {
    height: 350px;
    min-width: 400px;
    
    .chart {
      height: 270px;
    }
  }

  @media (max-width: $device-phone) {
    height: 320px;
    min-width: 300px;
    
    .chart {
      height: 240px;
    }
  }
}
</style>
