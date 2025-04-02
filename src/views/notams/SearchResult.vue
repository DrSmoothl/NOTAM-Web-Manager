<template>
  <div class="search-result">
    <el-card :class="{ 'dark': isDark }">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <span>查询结果</span>
            <el-tag type="info" class="query-info">{{ searchForm.code }}</el-tag>
            <el-tag type="info" class="query-info">{{ searchForm.dateRange }}</el-tag>
            <el-tag type="info" class="query-info" v-if="searchForm.type">{{ searchForm.type }}</el-tag>
          </div>
          <div class="header-actions">
            <el-button type="primary" @click="onExport" :loading="exporting">导出</el-button>
            <el-button @click="onBack">返回</el-button>
          </div>
        </div>
      </template>

      <!-- 数据概览卡片 -->
      <div class="data-overview">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="stat-card">
              <div class="stat-icon" style="background: var(--el-color-primary-light-9)">
                <i class="iconfont-sys" style="color: var(--el-color-primary)">&#xe7ae;</i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.total }}</div>
                <div class="stat-label">NOTAM总数</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card">
              <div class="stat-icon" style="background: var(--el-color-success-light-9)">
                <i class="iconfont-sys" style="color: var(--el-color-success)">&#xe779;</i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.new }}</div>
                <div class="stat-label">新发布</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card">
              <div class="stat-icon" style="background: var(--el-color-warning-light-9)">
                <i class="iconfont-sys" style="color: var(--el-color-warning)">&#xe8d5;</i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.replace }}</div>
                <div class="stat-label">替换</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card">
              <div class="stat-icon" style="background: var(--el-color-danger-light-9)">
                <i class="iconfont-sys" style="color: var(--el-color-danger)">&#xe7c7;</i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.cancel }}</div>
                <div class="stat-label">取消</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 图表展示区域 -->
      <div class="charts-container">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="chart-card">
              <div class="chart-title">NOTAM类型分布</div>
              <div ref="typeChartRef" style="height: 300px"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-card">
              <div class="chart-title">时间分布趋势</div>
              <div ref="timeChartRef" style="height: 300px"></div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="24">
            <div class="chart-card">
              <div class="chart-title">内容分类统计</div>
              <div ref="categoryChartRef" style="height: 300px"></div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <el-table 
        :data="tableData" 
        style="width: 100%" 
        v-loading="loading"
        :class="{ 'dark': isDark }"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="notamId" :label="$t('notam.list.columns.id')" min-width="180" sortable />
        <el-table-column prop="type" :label="$t('notam.list.columns.type')" min-width="120">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.type)">{{ $t(`${scope.row.type}`) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" :label="$t('notam.list.columns.location')" min-width="120" sortable />
        <el-table-column prop="startTime" :label="$t('notam.list.columns.startTime')" min-width="180" sortable />
        <el-table-column prop="endTime" :label="$t('notam.list.columns.endTime')" min-width="180" sortable />
        <el-table-column prop="content" :label="$t('notam.list.columns.content')" min-width="300" show-overflow-tooltip />
        <el-table-column fixed="right" :label="$t('notam.list.columns.actions')" min-width="120">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row)">{{ $t('notam.list.actions.view') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="NOTAM详情"
      width="50%"
      :class="{ 'dark': isDark }"
    >
      <div class="detail-content">
        <p><strong>NOTAM编号：</strong>{{ currentDetail.notamId }}</p>
        <p><strong>类型：</strong>
          <el-tag :type="getTagType(currentDetail.type)">{{ currentDetail.type }}</el-tag>
        </p>
        <p><strong>位置：</strong>{{ currentDetail.location }}</p>
        <p><strong>生效时间：</strong>{{ currentDetail.startTime }}</p>
        <p><strong>失效时间：</strong>{{ currentDetail.endTime }}</p>
        <p><strong>内容：</strong></p>
        <p class="content-text">{{ currentDetail.content }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useTheme } from '@/composables/useTheme'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()
const { isDark } = useTheme()

const loading = ref(false)
const exporting = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const currentDetail = ref({})

// 图表引用
const typeChartRef = ref(null)
const timeChartRef = ref(null)
const categoryChartRef = ref(null)

// 搜索参数
const searchForm = computed(() => ({
  code: route.query.code as string,
  dateRange: `${route.query.startDate} 至 ${route.query.endDate}`,
  type: route.query.type as string
}))

// 统计数据
const statistics = ref({
  total: 0,
  new: 0,
  replace: 0,
  cancel: 0
})

// 模拟数据生成函数
const generateMockData = (params: any) => {
  const mockData = []
  const types = ['新发布', '替换', '取消']
  const categories = [
    '跑道相关',
    '天气相关',
    '导航设备',
    '机场设施',
    '空域调整'
  ]
  const contents = {
    '跑道相关': [
      '跑道18L/36R关闭进行维护工作',
      '跑道积雪清理作业',
      '跑道灯光系统维护'
    ],
    '天气相关': [
      '能见度降低至500米',
      '强对流天气影响',
      '大风预警'
    ],
    '导航设备': [
      'ILS系统维护',
      'VOR设备校准',
      'DME设备升级'
    ],
    '机场设施': [
      '航站楼A区施工',
      '停机坪维护',
      '滑行道标识更新'
    ],
    '空域调整': [
      '临时限制空域设立',
      '航路调整',
      '军事活动区域设立'
    ]
  }

  for (let i = 0; i < 100; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const categoryContents = contents[category]
    const content = categoryContents[Math.floor(Math.random() * categoryContents.length)]

    const startDate = new Date(params.startDate)
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30))
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 10))

    mockData.push({
      notamId: `A${1000 + i}/${new Date().getFullYear().toString().slice(-2)}`,
      type,
      category,
      location: params.code,
      startTime: startDate.toLocaleString(),
      endTime: endDate.toLocaleString(),
      content
    })
  }

  return mockData
}

// 初始化图表
const initCharts = (data: any[]) => {
  // 类型分布图表
  const typeChart = echarts.init(typeChartRef.value)
  const typeData = ['新发布', '替换', '取消'].map(type => ({
    name: type,
    value: data.filter(item => item.type === type).length
  }))
  
  typeChart.setOption({
    title: {
      text: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: typeData
      }
    ]
  })

  // 时间分布趋势图表
  const timeChart = echarts.init(timeChartRef.value)
  const timeData = new Array(30).fill(0)
  data.forEach(item => {
    const date = new Date(item.startTime)
    const day = date.getDate()
    timeData[day - 1]++
  })

  timeChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: Array.from({length: 30}, (_, i) => i + 1),
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'NOTAM数量',
        type: 'bar',
        barWidth: '60%',
        data: timeData
      }
    ]
  })

  // 内容分类统计图表
  const categoryChart = echarts.init(categoryChartRef.value)
  const categories = ['跑道相关', '天气相关', '导航设备', '机场设施', '空域调整']
  const categoryData = categories.map(category => ({
    name: category,
    value: data.filter(item => item.category === category).length
  }))

  categoryChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['数量']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: categories
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: categoryData.map(item => item.value)
      }
    ]
  })

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    typeChart.resize()
    timeChart.resize()
    categoryChart.resize()
  })
}

// 模拟数据
const allData = ref([])
const tableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allData.value.slice(start, end)
})

const getTagType = (type: string) => {
  const types = {
    '新发布': 'success',
    '替换': 'warning',
    '取消': 'danger'
  }
  return types[type] || ''
}

const viewDetail = (row: any) => {
  currentDetail.value = row
  dialogVisible.value = true
}

const onExport = async () => {
  exporting.value = true
  try {
    // 模拟导出延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  } finally {
    exporting.value = false
  }
}

const onBack = () => {
  router.back()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

onMounted(() => {
  loading.value = true
  try {
    // 生成模拟数据
    allData.value = generateMockData({
      code: route.query.code,
      startDate: route.query.startDate,
      endDate: route.query.endDate,
      type: route.query.type
    })
    total.value = allData.value.length

    if (route.query.type) {
      allData.value = allData.value.filter(item => item.type === route.query.type)
    }

    // 更新统计数据
    statistics.value = {
      total: allData.value.length,
      new: allData.value.filter(item => item.type === '新发布').length,
      replace: allData.value.filter(item => item.type === '替换').length,
      cancel: allData.value.filter(item => item.type === '取消').length
    }

    // 初始化图表
    nextTick(() => {
      initCharts(allData.value)
    })
  } catch (error) {
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.search-result {
  padding: 20px;
  min-height: calc(100vh - 120px);
  background-color: var(--el-bg-color);

  :deep(.el-card) {
    background-color: var(--el-bg-color-overlay);
    border-color: var(--el-border-color-light);
    
    &.dark {
      .el-card__header {
        border-bottom: 1px solid var(--el-border-color-darker);
      }

      .el-table {
        background-color: var(--el-bg-color);
        
        th.el-table__cell {
          background-color: var(--el-bg-color-overlay);
        }
        
        .el-table__cell {
          background-color: var(--el-bg-color);
        }
      }
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--el-text-color-primary);

    .header-title {
      display: flex;
      align-items: center;
      gap: 10px;

      .query-info {
        margin-left: 8px;
      }
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .data-overview {
    margin: 20px 0;

    .stat-card {
      display: flex;
      align-items: center;
      padding: 20px;
      background: var(--el-bg-color-overlay);
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

      .stat-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        margin-right: 16px;

        i {
          font-size: 24px;
        }
      }

      .stat-info {
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: var(--el-text-color-primary);
          line-height: 1.2;
        }

        .stat-label {
          font-size: 14px;
          color: var(--el-text-color-secondary);
          margin-top: 4px;
        }
      }
    }
  }

  .charts-container {
    margin: 20px 0;

    .chart-card {
      background: var(--el-bg-color-overlay);
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

      .chart-title {
        font-size: 16px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        margin-bottom: 16px;
      }
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .detail-content {
    padding: 20px;
    color: var(--el-text-color-primary);

    p {
      margin: 10px 0;
      line-height: 1.5;

      strong {
        font-weight: 500;
        margin-right: 8px;
      }
    }

    .content-text {
      margin-top: 10px;
      padding: 15px;
      background-color: var(--el-bg-color);
      border-radius: 4px;
      line-height: 1.6;
    }
  }
}
</style> 