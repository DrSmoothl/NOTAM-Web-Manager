<template>
  <div class="custom-card">
    <div class="card-header">
      <div class="title">
        <h4>系统日志</h4>
        <p>最近系统操作记录</p>
      </div>
      <div class="actions">
        <el-button type="primary" text @click="handleViewAll">查看全部</el-button>
      </div>
    </div>
    <div class="card-content">
      <div class="log-filters">
        <el-select v-model="logType" size="small" placeholder="日志类型" style="width: 120px">
          <el-option label="全部类型" value="all" />
          <el-option label="操作日志" value="operation" />
          <el-option label="系统日志" value="system" />
          <el-option label="安全日志" value="security" />
        </el-select>
        <el-select v-model="logLevel" size="small" placeholder="日志级别" style="width: 120px">
          <el-option label="全部级别" value="all" />
          <el-option label="信息" value="info" />
          <el-option label="警告" value="warning" />
          <el-option label="错误" value="error" />
        </el-select>
      </div>

      <div class="log-timeline">
        <el-timeline>
          <el-timeline-item
            v-for="(log, index) in filteredLogs"
            :key="index"
            :type="getLogType(log.level)"
            :color="getLogColor(log.level)"
            :timestamp="log.time"
            :hollow="log.level === 'info'"
          >
            <div class="log-content">
              <div class="log-header">
                <span class="title">{{ log.title }}</span>
                <el-tag 
                  size="small" 
                  :type="getLogType(log.level)"
                >{{ getLogLevelText(log.level) }}</el-tag>
              </div>
              <div class="description">{{ log.description }}</div>
              <div class="meta">
                <span class="user">
                  <el-icon><User /></el-icon>
                  {{ log.user }}
                </span>
                <span class="ip">
                  <el-icon><Monitor /></el-icon>
                  {{ log.ip }}
                </span>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { User, Monitor } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const logType = ref('all')
const logLevel = ref('all')

// 模拟日志数据
const logs = ref([
  {
    title: '用户登录',
    description: '用户成功登录系统',
    level: 'info',
    type: 'security',
    user: '张三',
    ip: '192.168.1.100',
    time: '10分钟前'
  },
  {
    title: '数据库备份',
    description: '系统自动备份数据完成',
    level: 'info',
    type: 'system',
    user: 'System',
    ip: 'localhost',
    time: '30分钟前'
  },
  {
    title: '异常访问',
    description: '检测到异常IP多次访问尝试',
    level: 'warning',
    type: 'security',
    user: 'System',
    ip: '10.0.0.123',
    time: '1小时前'
  },
  {
    title: '系统错误',
    description: '数据库连接超时',
    level: 'error',
    type: 'system',
    user: 'System',
    ip: 'localhost',
    time: '2小时前'
  },
  {
    title: 'NOTAM发布',
    description: '新NOTAM已成功发布',
    level: 'info',
    type: 'operation',
    user: '李四',
    ip: '192.168.1.101',
    time: '3小时前'
  }
])

// 根据筛选条件过滤日志
const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const typeMatch = logType.value === 'all' || log.type === logType.value
    const levelMatch = logLevel.value === 'all' || log.level === logLevel.value
    return typeMatch && levelMatch
  })
})

// 获取日志级别对应的类型
const getLogType = (level: string) => {
  switch (level) {
    case 'error':
      return 'danger'
    case 'warning':
      return 'warning'
    default:
      return 'info'
  }
}

// 获取日志级别对应的颜色
const getLogColor = (level: string) => {
  switch (level) {
    case 'error':
      return '#F56C6C'
    case 'warning':
      return '#E6A23C'
    default:
      return '#409EFF'
  }
}

// 获取日志级别对应的文本
const getLogLevelText = (level: string) => {
  switch (level) {
    case 'error':
      return '错误'
    case 'warning':
      return '警告'
    default:
      return '信息'
  }
}

// 查看全部日志
const handleViewAll = () => {
  ElMessage.info('跳转到日志管理页面')
}
</script>

<style lang="scss" scoped>
.log-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.log-timeline {
  :deep(.el-timeline) {
    padding-left: 0;
  }

  :deep(.el-timeline-item__wrapper) {
    padding-left: 20px;
  }

  :deep(.el-timeline-item__timestamp) {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.log-content {
  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    .title {
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
  }
  
  .description {
    font-size: 13px;
    color: var(--el-text-color-regular);
    margin-bottom: 8px;
  }
  
  .meta {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    
    .user, .ip {
      display: flex;
      align-items: center;
      
      .el-icon {
        margin-right: 4px;
        font-size: 14px;
      }
    }
    
    .ip {
      margin-left: 16px;
    }
  }
}

@media screen and (max-width: 768px) {
  .log-filters {
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
    
    .el-select {
      width: 100% !important;
    }
  }
  
  .log-content {
    .log-header {
      .title {
        font-size: 13px;
      }
    }
    
    .description {
      font-size: 12px;
    }
    
    .meta {
      font-size: 11px;
      
      .ip {
        margin-left: 12px;
      }
    }
  }
}
</style> 