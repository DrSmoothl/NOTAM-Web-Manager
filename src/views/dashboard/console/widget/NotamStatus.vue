<template>
  <div class="region notam-status art-custom-card">
    <div class="card-header">
      <div class="title">
        <h4 class="box-title">NOTAM状态分布</h4>
        <p class="subtitle">实时统计</p>
      </div>
    </div>
    <div class="chart" ref="chartRef"></div>
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

const store = useSettingStore()
const isDark = computed(() => store.isDark)
const settingStore = useSettingStore()
const menuOpen = computed(() => settingStore.menuOpen)

// 收缩菜单时，重新计算图表大小
watch(menuOpen, () => {
  const delays = [100, 200, 300]
  delays.forEach((delay) => {
    setTimeout(resize, delay)
  })
})

const createChart = () => {
  setOptions({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      bottom: '5%',
      left: 'center',
      textStyle: {
        color: isDark.value ? '#808290' : '#222B45'
      }
    },
    series: [
      {
        name: 'NOTAM状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: isDark.value ? '#1a1a1a' : '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {c}条',
          fontSize: 12,
          color: isDark.value ? '#808290' : '#222B45'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10
        },
        data: [
          { 
            value: 185, 
            name: '有效', 
            itemStyle: { 
              color: getCssVariable('--el-color-success') 
            }
          },
          { 
            value: 45, 
            name: '即将过期', 
            itemStyle: { 
              color: getCssVariable('--el-color-warning') 
            }
          },
          { 
            value: 28, 
            name: '已过期', 
            itemStyle: { 
              color: getCssVariable('--el-color-danger') 
            }
          },
          { 
            value: 30, 
            name: '已取消', 
            itemStyle: { 
              color: getCssVariable('--el-color-info') 
            }
          }
        ]
      }
    ]
  })
}

onMounted(() => {
  createChart()
})

watch(isDark, () => {
  createChart()
})

onUnmounted(() => {
  removeResize()
})
</script>

<style lang="scss" scoped>
.notam-status {
  height: 420px;
  padding: 20px;

  .chart {
    height: 320px;
  }

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
}
</style> 