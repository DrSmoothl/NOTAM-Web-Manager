<template>
  <div class="custom-card">
    <div class="custom-card-header">
      <div class="title">{{ $t('notam.activity.title') }}</div>
      <div class="subtitle">{{ $t('notam.activity.subtitle') }}</div>
      <div class="actions">
        <el-button-group>
          <el-button size="small" :type="timeRange === 'today' ? 'primary' : ''" @click="timeRange = 'today'">
            {{ $t('notam.overview.timeRange.today') }}
          </el-button>
          <el-button size="small" :type="timeRange === 'week' ? 'primary' : ''" @click="timeRange = 'week'">
            {{ $t('notam.overview.timeRange.week') }}
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div class="custom-card-content">
      <div class="activity-list">
        <div v-for="(activity, index) in activities" :key="index" class="activity-item">
          <div class="activity-icon" :class="activity.type">
            <el-icon>
              <component :is="getActivityIcon(activity.type)" />
            </el-icon>
          </div>
          <div class="activity-content">
            <div class="activity-header">
              <span class="title">{{ $t('notam.activity.' + activity.type) }}</span>
              <span class="time">{{ activity.time }}</span>
            </div>
            <div class="activity-body">
              <div class="notam-info">
                <span class="label">NOTAM ID：</span>
                <span class="value">{{ activity.notamId }}</span>
              </div>
              <div class="operator-info">
                <span class="label">{{ $t('notam.list.columns.actions') }}：</span>
                <span class="value">{{ activity.operator }}</span>
              </div>
              <div class="description">{{ activity.description }}</div>
            </div>
            <div class="activity-footer">
              <el-tag size="small" :type="getTagType(activity.status)">
                {{ $t('notam.activity.status.' + activity.status) }}
              </el-tag>
              <el-button v-if="activity.type === 'review'" type="primary" link size="small">
                {{ $t('notam.list.actions.view') }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Plus as IconPlus,
  Edit as IconEdit,
  View as IconView,
  Delete as IconDelete,
  Check as IconCheck,
  Warning as IconWarning
} from '@element-plus/icons-vue'

const { t } = useI18n()
const timeRange = ref('today')

// 模拟活动数据
const activities = ref([
  {
    type: 'create',
    time: '10分钟前',
    notamId: 'A1234/23',
    operator: '张三',
    description: '创建了关于跑道维护的新NOTAM',
    status: 'published'
  },
  {
    type: 'edit',
    time: '30分钟前',
    notamId: 'B5678/23',
    operator: '李四',
    description: '更新了生效时间和影响范围',
    status: 'pending'
  },
  {
    type: 'review',
    time: '1小时前',
    notamId: 'C9012/23',
    operator: '王五',
    description: '完成了安全评估和内容审核',
    status: 'approved'
  },
  {
    type: 'warning',
    time: '2小时前',
    notamId: 'D3456/23',
    operator: '系统',
    description: 'NOTAM将在24小时内过期',
    status: 'processing'
  },
  {
    type: 'delete',
    time: '3小时前',
    notamId: 'E7890/23',
    operator: '赵六',
    description: '由于情况变更撤销了NOTAM',
    status: 'cancelled'
  }
])

// 获取活动图标
const getActivityIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    create: IconPlus,
    edit: IconEdit,
    review: IconView,
    delete: IconDelete,
    warning: IconWarning,
    complete: IconCheck
  }
  return iconMap[type]
}

// 获取状态标签类型
const getTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    published: 'success',
    pending: 'warning',
    approved: 'success',
    processing: 'info',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}
</script>

<style lang="scss" scoped>
.activity-list {
  .activity-item {
    display: flex;
    padding: 16px 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
    
    &:last-child {
      border-bottom: none;
    }
    
    .activity-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 16px;
      
      .el-icon {
        font-size: 16px;
        color: #fff;
      }
      
      &.create {
        background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
      }
      
      &.edit {
        background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
      }
      
      &.review {
        background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
      }
      
      &.warning {
        background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
      }
      
      &.delete {
        background: linear-gradient(135deg, #EF4444 0%, #F87171 100%);
      }
      
      &.complete {
        background: linear-gradient(135deg, #059669 0%, #34D399 100%);
      }
    }
    
    .activity-content {
      flex: 1;
      min-width: 0;
      
      .activity-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
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
      
      .activity-body {
        margin-bottom: 8px;
        
        .notam-info,
        .operator-info {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          
          .label {
            font-size: 13px;
            color: var(--el-text-color-secondary);
            margin-right: 8px;
          }
          
          .value {
            font-size: 13px;
            color: var(--el-text-color-primary);
          }
        }
        
        .description {
          font-size: 13px;
          color: var(--el-text-color-regular);
          margin-top: 8px;
        }
      }
      
      .activity-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .activity-list {
    .activity-item {
      padding: 12px 0;
      
      .activity-icon {
        width: 28px;
        height: 28px;
        margin-right: 12px;
        
        .el-icon {
          font-size: 14px;
        }
      }
      
      .activity-content {
        .activity-header {
          .title {
            font-size: 13px;
          }
        }
        
        .activity-body {
          .notam-info,
          .operator-info,
          .description {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style> 