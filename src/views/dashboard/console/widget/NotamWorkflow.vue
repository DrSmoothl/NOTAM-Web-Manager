<template>
  <div class="custom-card">
    <div class="card-header">
      <div class="title">
        <h4>{{ $t('notam.workflow.title') }}</h4>
        <p>{{ $t('notam.workflow.subtitle') }} <span class="highlight">{{ workflows.length }}</span></p>
      </div>
      <div class="actions">
        <el-button-group>
          <el-button size="small" :type="viewType === 'all' ? 'primary' : 'default'" @click="viewType = 'all'">
            {{ $t('notam.workflow.viewAll') }}
          </el-button>
          <el-button size="small" :type="viewType === 'my' ? 'primary' : 'default'" @click="viewType = 'my'">
            {{ $t('notam.workflow.viewMine') }}
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div class="card-content">
      <div class="workflow-list">
        <div v-for="(workflow, index) in filteredWorkflows" :key="index" class="workflow-item">
          <div class="workflow-header">
            <span class="notam-id">{{ workflow.notamId }}</span>
            <el-tag size="small" :type="getStatusType(workflow.status)">
              {{ $t('notam.activity.status.' + workflow.status) }}
            </el-tag>
          </div>
          <el-steps :active="workflow.currentStep" finish-status="success" simple>
            <el-step 
              v-for="(step, stepIndex) in workflow.steps" 
              :key="stepIndex" 
              :title="$t('notam.workflow.steps.' + step.type)"
              :description="step.operator"
            />
          </el-steps>
          <div class="workflow-footer">
            <span class="time">{{ workflow.time }}</span>
            <div class="actions">
              <el-button type="primary" link size="small">{{ $t('notam.list.actions.view') }}</el-button>
              <el-button type="primary" link size="small">{{ $t('notam.list.actions.edit') }}</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const viewType = ref('all')

// 模拟工作流数据
const workflows = ref([
  {
    notamId: 'A1234/23',
    status: 'processing',
    currentStep: 1,
    steps: [
      { type: 'draft', operator: '张三' },
      { type: 'review', operator: '李四' },
      { type: 'approve', operator: '王五' },
      { type: 'publish', operator: '系统' }
    ],
    time: '10分钟前',
    assignee: '张三'
  },
  {
    notamId: 'B5678/23',
    status: 'pending',
    currentStep: 2,
    steps: [
      { type: 'draft', operator: '李四' },
      { type: 'review', operator: '王五' },
      { type: 'approve', operator: '赵六' },
      { type: 'publish', operator: '系统' }
    ],
    time: '30分钟前',
    assignee: '王五'
  },
  {
    notamId: 'C9012/23',
    status: 'approved',
    currentStep: 3,
    steps: [
      { type: 'draft', operator: '王五' },
      { type: 'review', operator: '赵六' },
      { type: 'approve', operator: '张三' },
      { type: 'publish', operator: '系统' }
    ],
    time: '1小时前',
    assignee: '张三'
  }
])

// 根据视图类型过滤工作流
const filteredWorkflows = computed(() => {
  if (viewType.value === 'my') {
    return workflows.value.filter(w => w.assignee === '张三')
  }
  return workflows.value
})

// 获取状态标签类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    processing: 'info',
    pending: 'warning',
    approved: 'success',
    published: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}
</script>

<style lang="scss" scoped>
.workflow-list {
  .workflow-item {
    padding: 16px;
    margin-bottom: 16px;
    background: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--el-border-radius-base);
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .workflow-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .notam-id {
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }
    
    :deep(.el-steps) {
      margin: 16px 0;
      
      .el-step__title {
        font-size: 13px;
      }
      
      .el-step__description {
        font-size: 12px;
      }
    }
    
    .workflow-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      
      .time {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
      
      .actions {
        .el-button {
          padding: 4px 8px;
          font-size: 12px;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .workflow-list {
    .workflow-item {
      padding: 12px;
      
      .workflow-header {
        margin-bottom: 12px;
        
        .notam-id {
          font-size: 13px;
        }
      }
      
      :deep(.el-steps) {
        margin: 12px 0;
        
        .el-step__title {
          font-size: 12px;
        }
        
        .el-step__description {
          font-size: 11px;
        }
      }
    }
  }
}
</style> 