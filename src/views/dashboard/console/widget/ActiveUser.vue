<template>
  <div class="region active-user art-custom-card">
    <div class="chart" ref="chartRef"></div>
    <div class="text">
      <h3 class="box-title">本月NOTAM趋势</h3>
      <p class="subtitle">比上月 <span class="text-success">+23%</span></p>
    </div>
    <div class="list">
      <div v-for="(item, index) in list" :key="index">
        <p>{{ item.num }}</p>
        <p class="subtitle">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useECharts } from '@/utils/echarts/useECharts'
import { useSettingStore } from '@/store/modules/setting'
import { getCssVariable } from '@/utils/colors'

const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions, removeResize, resize } = useECharts(chartRef as Ref<HTMLDivElement>)
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

const store = useSettingStore()
const isDark = computed(() => store.isDark)

const list = [
  { name: '新发布', num: '185' },
  { name: '替换', num: '65' },
  { name: '取消', num: '38' },
  { name: '总计', num: '288' }
]

const createChart = () => {
  setOptions({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '5%',
      top: '5%',
      containLabel: true
    },
    yAxis: {
      type: 'value',
      name: '数量',
      nameTextStyle: {
        color: isDark.value ? '#808290' : '#222B45',
        fontSize: 12,
        padding: [0, 30, 0, 0]
      },
      axisLabel: {
        show: true,
        color: '#999',
        fontSize: 12
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3',
          width: 1,
          type: 'dashed'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3',
          width: 1
        }
      }
    },
    xAxis: {
      type: 'category',
      data: ['1日', '5日', '10日', '15日', '20日', '25日', '30日'],
      boundaryGap: true,
      splitLine: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3',
          width: 1
        }
      },
      axisLabel: {
        show: true,
        color: '#999',
        fontSize: 12,
        interval: 0
      }
    },
    series: [
      {
        data: [45, 38, 52, 35, 45, 28, 25],
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: getCssVariable('--el-color-primary-light-3')
            },
            {
              offset: 1,
              color: getCssVariable('--el-color-primary')
            }
          ])
        }
      },
      {
        name: '趋势线',
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
          type: 'dashed',
          color: getCssVariable('--el-color-success')
        },
        data: [42, 40, 48, 38, 42, 32, 28]
      }
    ]
  })
}

// 添加窗口大小变化监听
onMounted(() => {
  createChart()
  window.addEventListener('resize', handleResize)
})

watch(isDark, () => {
  createChart()
})

onUnmounted(() => {
  removeResize()
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.active-user {
  height: 520px;
  padding: 20px;
  transition: all 0.3s ease;
  min-width: 600px;
  width: 100%;
  flex: 1;

  .chart {
    height: 280px;
    width: 100%;
  }

  @media (max-width: $device-notebook) {
    height: 420px;
    min-width: 500px;
    
    .chart {
      height: 200px;
    }
  }

  @media (max-width: $device-ipad-pro) {
    height: 350px;
    min-width: 400px;
    
    .chart {
      height: 160px;
    }
  }

  @media (max-width: $device-phone) {
    height: 320px;
    min-width: 300px;
    
    .chart {
      height: 140px;
    }

    .list {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
  }

  .text {
    margin-top: 20px;
    padding: 0 10px;

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

  .list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-top: 30px;
    padding: 20px;
    background-color: var(--el-bg-color-overlay);
    border-radius: 8px;

    > div {
      text-align: center;

      p:first-child {
        margin: 0;
        font-size: 20px;
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
}
</style>
