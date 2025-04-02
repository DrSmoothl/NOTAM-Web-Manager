<template>
  <div class="custom-card">
    <div class="card-header">
      <div class="title">
        <h4>任务列表</h4>
        <p>待处理任务 <span class="highlight">{{ pendingTasks.length }}个</span></p>
      </div>
      <div class="actions">
        <el-button type="primary" size="small" @click="handleAddTask">新建任务</el-button>
      </div>
    </div>
    <div class="card-content">
      <div class="task-filters">
        <el-radio-group v-model="filterType" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="pending">待处理</el-radio-button>
          <el-radio-button label="completed">已完成</el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="task-list">
        <el-empty v-if="filteredTasks.length === 0" description="暂无任务" />
        <div v-else v-for="(task, index) in filteredTasks" :key="index" class="task-item">
          <div class="task-checkbox">
            <el-checkbox 
              v-model="task.completed"
              @change="handleTaskStatusChange(task)"
            />
          </div>
          <div class="task-content" :class="{ completed: task.completed }">
            <div class="task-header">
              <span class="title">{{ task.title }}</span>
              <el-tag 
                size="small" 
                :type="getPriorityType(task.priority)"
              >{{ getPriorityText(task.priority) }}</el-tag>
            </div>
            <div class="task-info">
              <span class="deadline">
                <el-icon><Clock /></el-icon>
                {{ task.deadline }}
              </span>
              <span class="assignee">
                <el-icon><User /></el-icon>
                {{ task.assignee }}
              </span>
            </div>
          </div>
          <div class="task-actions">
            <el-dropdown trigger="click">
              <el-button type="primary" text>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleEditTask(task)">
                    <el-icon><Edit /></el-icon>编辑
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleDeleteTask(task)">
                    <el-icon><Delete /></el-icon>删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Clock, User, MoreFilled, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const filterType = ref('all')

// 模拟任务数据
const tasks = ref([
  {
    id: 1,
    title: '审核新增NOTAM',
    priority: 'high',
    deadline: '今天 14:00',
    assignee: '张三',
    completed: false
  },
  {
    id: 2,
    title: '更新机场信息',
    priority: 'medium',
    deadline: '明天 16:00',
    assignee: '李四',
    completed: false
  },
  {
    id: 3,
    title: '系统日志检查',
    priority: 'low',
    deadline: '本周五',
    assignee: '王五',
    completed: true
  }
])

// 根据筛选条件过滤任务
const filteredTasks = computed(() => {
  switch (filterType.value) {
    case 'pending':
      return tasks.value.filter(task => !task.completed)
    case 'completed':
      return tasks.value.filter(task => task.completed)
    default:
      return tasks.value
  }
})

// 获取待处理任务
const pendingTasks = computed(() => {
  return tasks.value.filter(task => !task.completed)
})

// 获取优先级对应的标签类型
const getPriorityType = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'danger'
    case 'medium':
      return 'warning'
    default:
      return 'info'
  }
}

// 获取优先级对应的文本
const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high':
      return '高优先级'
    case 'medium':
      return '中优先级'
    default:
      return '低优先级'
  }
}

// 处理任务状态变更
const handleTaskStatusChange = (task: any) => {
  const status = task.completed ? '完成' : '待处理'
  ElMessage.success(`任务已标记为${status}`)
}

// 新建任务
const handleAddTask = () => {
  ElMessage.info('打开新建任务对话框')
}

// 编辑任务
const handleEditTask = (task: any) => {
  ElMessage.info(`编辑任务：${task.title}`)
}

// 删除任务
const handleDeleteTask = (task: any) => {
  ElMessageBox.confirm(
    '确定要删除这个任务吗？',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index > -1) {
      tasks.value.splice(index, 1)
      ElMessage.success('任务已删除')
    }
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.task-filters {
  margin-bottom: 16px;
}

.task-list {
  .task-item {
    display: flex;
    align-items: flex-start;
    padding: 12px;
    margin-bottom: 8px;
    background: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--el-border-radius-base);
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .task-checkbox {
      margin-right: 12px;
      padding-top: 2px;
    }
    
    .task-content {
      flex: 1;
      min-width: 0;
      
      &.completed {
        .task-header {
          .title {
            text-decoration: line-through;
            color: var(--el-text-color-secondary);
          }
        }
      }
      
      .task-header {
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
      
      .task-info {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: var(--el-text-color-secondary);
        
        .deadline, .assignee {
          display: flex;
          align-items: center;
          
          .el-icon {
            margin-right: 4px;
            font-size: 14px;
          }
        }
        
        .assignee {
          margin-left: 16px;
        }
      }
    }
    
    .task-actions {
      margin-left: 12px;
    }
  }
}

@media screen and (max-width: 768px) {
  .task-list {
    .task-item {
      padding: 10px;
      
      .task-content {
        .task-header {
          .title {
            font-size: 13px;
          }
        }
        
        .task-info {
          font-size: 11px;
          
          .assignee {
            margin-left: 12px;
          }
        }
      }
    }
  }
}
</style> 