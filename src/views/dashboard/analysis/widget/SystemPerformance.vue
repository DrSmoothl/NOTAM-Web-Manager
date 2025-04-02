<template>
  <div class="custom-card">
    <div class="custom-card-header">
      <div class="title">系统性能分析</div>
      <div class="subtitle">系统运行状态和性能指标</div>
      <div class="actions">
        <el-button-group>
          <el-button size="small" :type="timeRange === '1h' ? 'primary' : ''" @click="timeRange = '1h'">1小时</el-button>
          <el-button size="small" :type="timeRange === '24h' ? 'primary' : ''" @click="timeRange = '24h'">24小时</el-button>
          <el-button size="small" :type="timeRange === '7d' ? 'primary' : ''" @click="timeRange = '7d'">7天</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="custom-card-content">
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <span class="label">系统响应时间</span>
            <el-tag size="small" :type="responseStatus">{{ responseLevel }}</el-tag>
          </div>
          <div class="metric-value">{{ avgResponseTime }}ms</div>
          <div class="metric-chart" ref="responseChartRef"></div>
        </div>
        <div class="metric-card">
          <div class="metric-header">
            <span class="label">CPU 使用率</span>
            <el-tag size="small" :type="cpuStatus">{{ cpuLevel }}</el-tag>
          </div>
          <div class="metric-value">{{ cpuUsage }}%</div>
          <div class="metric-chart" ref="cpuChartRef"></div>
        </div>
        <div class="metric-card">
          <div class="metric-header">
            <span class="label">内存使用率</span>
            <el-tag size="small" :type="memoryStatus">{{ memoryLevel }}</el-tag>
          </div>
          <div class="metric-value">{{ memoryUsage }}%</div>
          <div class="metric-chart" ref="memoryChartRef"></div>
        </div>
        <div class="metric-card">
          <div class="metric-header">
            <span class="label">API 调用成功率</span>
            <el-tag size="small" :type="apiStatus">{{ apiLevel }}</el-tag>
          </div>
          <div class="metric-value">{{ apiSuccessRate }}%</div>
          <div class="metric-chart" ref="apiChartRef"></div>
        </div>
      </div>
      <div class="system-status">
        <div class="status-header">
          <h3>系统状态</h3>
          <el-tag size="small" :type="systemHealth === 'healthy' ? 'success' : 'danger'">
            {{ systemHealth === 'healthy' ? '运行正常' : '异常警告' }}
          </el-tag>
        </div>
        <div class="status-list">
          <div v-for="(status, index) in systemStatuses" :key="index" class="status-item">
            <div class="status-info">
              <span class="name">{{ status.name }}</span>
              <span class="time">{{ status.time }}</span>
            </div>
            <div class="status-desc" :class="status.type">{{ status.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const timeRange = ref('1h')
const systemHealth = ref('healthy')

// 性能指标数据
const avgResponseTime = ref(126)
const responseStatus = ref('success')
const responseLevel = ref('良好')

const cpuUsage = ref(45)
const cpuStatus = ref('success')
const cpuLevel = ref('正常')

const memoryUsage = ref(62)
const memoryStatus = ref('warning')
const memoryLevel = ref('偏高')

const apiSuccessRate = ref(99.8)
const apiStatus = ref('success')
const apiLevel = ref('优秀')

// 系统状态记录
const systemStatuses = ref([
  {
    name: '系统更新',
    time: '10分钟前',
    description: '系统例行更新完成',
    type: 'success'
  },
  {
    name: '性能优化',
    time: '30分钟前',
    description: '完成数据库性能优化',
    type: 'success'
  },
  {
    name: '内存告警',
    time: '2小时前',
    description: '内存使用率超过预警值',
    type: 'warning'
  },
  {
    name: '系统维护',
    time: '1天前',
    description: '完成系统例行维护',
    type: 'info'
  }
])

// 图表引用
const responseChartRef = ref<HTMLElement>()
const cpuChartRef = ref<HTMLElement>()
const memoryChartRef = ref<HTMLElement>()
const apiChartRef = ref<HTMLElement>()

// 存储图表实例
const charts = new Map()

// 生成模拟数据
const generateMockData = (count: number, min: number, max: number) => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

// 创建迷你图表
const createMiniChart = (el: HTMLElement, data: number[], color: string) => {
  const chart = echarts.init(el)
  charts.set(el, chart)

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
          color: color,
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: color.replace(')', ', 0.2)') },
            { offset: 1, color: color.replace(')', ', 0)') }
          ])
        }
      }
    ]
  }

  chart.setOption(option)
}

// 初始化所有图表
const initCharts = () => {
  if (responseChartRef.value) {
    createMiniChart(responseChartRef.value, generateMockData(50, 100, 150), 'rgb(59, 130, 246)')
  }
  if (cpuChartRef.value) {
    createMiniChart(cpuChartRef.value, generateMockData(50, 30, 60), 'rgb(16, 185, 129)')
  }
  if (memoryChartRef.value) {
    createMiniChart(memoryChartRef.value, generateMockData(50, 50, 75), 'rgb(245, 158, 11)')
  }
  if (apiChartRef.value) {
    createMiniChart(apiChartRef.value, generateMockData(50, 99, 100), 'rgb(139, 92, 246)')
  }
}

// 监听窗口大小变化
const handleResize = () => {
  charts.forEach(chart => {
    chart.resize()
  })
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  charts.forEach(chart => {
    chart.dispose()
  })
  charts.clear()
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.custom-card {
  height: 100%;
  background: var(--art-main-bg-color);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--el-box-shadow);
  }
}

.custom-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-light);

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
  padding: 20px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.metric-card {
  padding: 16px;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);

  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .label {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  .metric-value {
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 16px;
  }

  .metric-chart {
    height: 40px;
  }
}

.system-status {
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  padding: 16px;

  .status-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      margin: 0;
    }
  }

  .status-list {
    .status-item {
      padding: 12px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }

      .status-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;

        .name {
          font-size: 14px;
          color: var(--el-text-color-primary);
        }

        .time {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }

      .status-desc {
        font-size: 13px;

        &.success {
          color: var(--el-color-success);
        }

        &.warning {
          color: var(--el-color-warning);
        }

        &.danger {
          color: var(--el-color-danger);
        }

        &.info {
          color: var(--el-color-info);
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style> 