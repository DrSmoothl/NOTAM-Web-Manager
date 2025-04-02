<template>
  <div class="custom-card">
    <div class="custom-card-header">
      <div class="title">系统状态</div>
      <div class="subtitle">系统运行状态和性能指标</div>
      <div class="status-tag">
        <el-tag :type="systemHealth === 'normal' ? 'success' : 'danger'" size="small">
          {{ systemHealth === 'normal' ? '运行正常' : '异常警告' }}
        </el-tag>
      </div>
    </div>
    <div class="custom-card-content">
      <div class="metrics-grid">
        <div class="metric-item">
          <div class="metric-header">
            <span class="label">系统响应时间</span>
            <el-tag size="small" :type="getMetricStatus(metrics.responseTime.value, 200, 500)">
              {{ metrics.responseTime.value }}ms
            </el-tag>
          </div>
          <el-progress 
            :percentage="getPercentage(metrics.responseTime.value, 1000)"
            :status="getMetricStatus(metrics.responseTime.value, 200, 500)"
          />
          <div class="metric-footer">
            <span class="trend" :class="{ up: metrics.responseTime.trend > 0 }">
              {{ Math.abs(metrics.responseTime.trend) }}%
              <el-icon><CaretTop /></el-icon>
            </span>
            <span class="compare">对比昨日</span>
          </div>
        </div>

        <div class="metric-item">
          <div class="metric-header">
            <span class="label">CPU 使用率</span>
            <el-tag size="small" :type="getMetricStatus(metrics.cpuUsage.value, 60, 80)">
              {{ metrics.cpuUsage.value }}%
            </el-tag>
          </div>
          <el-progress 
            :percentage="metrics.cpuUsage.value"
            :status="getMetricStatus(metrics.cpuUsage.value, 60, 80)"
          />
          <div class="metric-footer">
            <span class="trend" :class="{ up: metrics.cpuUsage.trend > 0 }">
              {{ Math.abs(metrics.cpuUsage.trend) }}%
              <el-icon><CaretTop /></el-icon>
            </span>
            <span class="compare">对比昨日</span>
          </div>
        </div>

        <div class="metric-item">
          <div class="metric-header">
            <span class="label">内存使用率</span>
            <el-tag size="small" :type="getMetricStatus(metrics.memoryUsage.value, 70, 85)">
              {{ metrics.memoryUsage.value }}%
            </el-tag>
          </div>
          <el-progress 
            :percentage="metrics.memoryUsage.value"
            :status="getMetricStatus(metrics.memoryUsage.value, 70, 85)"
          />
          <div class="metric-footer">
            <span class="trend" :class="{ up: metrics.memoryUsage.trend > 0 }">
              {{ Math.abs(metrics.memoryUsage.trend) }}%
              <el-icon><CaretTop /></el-icon>
            </span>
            <span class="compare">对比昨日</span>
          </div>
        </div>

        <div class="metric-item">
          <div class="metric-header">
            <span class="label">磁盘使用率</span>
            <el-tag size="small" :type="getMetricStatus(metrics.diskUsage.value, 75, 90)">
              {{ metrics.diskUsage.value }}%
            </el-tag>
          </div>
          <el-progress 
            :percentage="metrics.diskUsage.value"
            :status="getMetricStatus(metrics.diskUsage.value, 75, 90)"
          />
          <div class="metric-footer">
            <span class="trend" :class="{ up: metrics.diskUsage.trend > 0 }">
              {{ Math.abs(metrics.diskUsage.trend) }}%
              <el-icon><CaretTop /></el-icon>
            </span>
            <span class="compare">对比昨日</span>
          </div>
        </div>
      </div>

      <div class="alerts-section">
        <div class="section-header">
          <h3>系统告警</h3>
          <el-tag size="small" type="danger" v-if="alerts.length > 0">{{ alerts.length }}个告警</el-tag>
        </div>
        <div class="alerts-list">
          <div v-for="(alert, index) in alerts" :key="index" class="alert-item" :class="alert.level">
            <el-icon class="alert-icon">
              <Warning v-if="alert.level === 'warning'" />
              <CircleClose v-else-if="alert.level === 'error'" />
              <InfoFilled v-else />
            </el-icon>
            <div class="alert-content">
              <div class="alert-header">
                <span class="title">{{ alert.title }}</span>
                <span class="time">{{ alert.time }}</span>
              </div>
              <div class="description">{{ alert.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CaretTop, Warning, CircleClose, InfoFilled } from '@element-plus/icons-vue'

const systemHealth = ref('normal')

// 模拟指标数据
const metrics = ref({
  responseTime: {
    value: 156,
    trend: 5.2
  },
  cpuUsage: {
    value: 45,
    trend: -2.8
  },
  memoryUsage: {
    value: 68,
    trend: 3.5
  },
  diskUsage: {
    value: 72,
    trend: 1.2
  }
})

// 模拟告警数据
const alerts = ref([
  {
    level: 'error',
    title: '数据库连接异常',
    time: '10分钟前',
    description: '主数据库连接超时，已自动切换至备用数据库'
  },
  {
    level: 'warning',
    title: '内存使用率过高',
    time: '30分钟前',
    description: '系统内存使用率超过预警阈值 (80%)'
  },
  {
    level: 'info',
    title: '系统更新提醒',
    time: '1小时前',
    description: '新版本 v2.1.0 已发布，建议及时更新'
  }
])

// 获取指标状态
const getMetricStatus = (value: number, warningThreshold: number, errorThreshold: number) => {
  if (value >= errorThreshold) return 'danger'
  if (value >= warningThreshold) return 'warning'
  return 'success'
}

// 计算百分比
const getPercentage = (value: number, max: number) => {
  return Math.min(Math.round((value / max) * 100), 100)
}
</script>

<style lang="scss" scoped>
.status-tag {
  position: absolute;
  right: 20px;
  top: 20px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.metric-item {
  padding: 16px;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  
  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .label {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
  
  .metric-footer {
    display: flex;
    align-items: center;
    margin-top: 8px;
    
    .trend {
      display: flex;
      align-items: center;
      font-size: 13px;
      color: var(--el-color-danger);
      
      &.up {
        color: var(--el-color-success);
        
        .el-icon {
          transform: rotate(180deg);
        }
      }
      
      .el-icon {
        margin-left: 4px;
        font-size: 12px;
      }
    }
    
    .compare {
      margin-left: 8px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}

.alerts-section {
  .section-header {
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
}

.alerts-list {
  .alert-item {
    display: flex;
    align-items: flex-start;
    padding: 12px 16px;
    margin-bottom: 8px;
    border-radius: var(--el-border-radius-base);
    background: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color-light);
    
    &.error {
      border-left: 4px solid var(--el-color-danger);
      
      .alert-icon {
        color: var(--el-color-danger);
      }
    }
    
    &.warning {
      border-left: 4px solid var(--el-color-warning);
      
      .alert-icon {
        color: var(--el-color-warning);
      }
    }
    
    &.info {
      border-left: 4px solid var(--el-color-info);
      
      .alert-icon {
        color: var(--el-color-info);
      }
    }
    
    .alert-icon {
      font-size: 20px;
      margin-right: 12px;
      margin-top: 2px;
    }
    
    .alert-content {
      flex: 1;
      min-width: 0;
      
      .alert-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        
        .title {
          font-size: 14px;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }
        
        .time {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
      
      .description {
        font-size: 13px;
        color: var(--el-text-color-regular);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .metric-item {
    padding: 12px;
  }
  
  .alerts-list {
    .alert-item {
      padding: 10px 12px;
      
      .alert-icon {
        font-size: 18px;
        margin-right: 10px;
      }
      
      .alert-content {
        .alert-header {
          .title {
            font-size: 13px;
          }
        }
        
        .description {
          font-size: 12px;
        }
      }
    }
  }
}
</style> 