<template>
  <div class="custom-card">
    <div class="card-header">
      <div class="title">
        <h4>通知中心</h4>
        <p>未读消息 <span class="highlight">{{ unreadCount }}条</span></p>
      </div>
      <div class="actions">
        <el-button type="primary" text @click="handleReadAll">全部已读</el-button>
      </div>
    </div>
    <div class="card-content">
      <div class="notification-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="系统通知" name="system">
            <div class="notification-list">
              <div 
                v-for="(notification, index) in systemNotifications" 
                :key="index" 
                class="notification-item"
                :class="{ unread: !notification.read }"
              >
                <div class="notification-icon" :class="notification.type">
                  <el-icon>
                    <Bell v-if="notification.type === 'info'" />
                    <Warning v-else-if="notification.type === 'warning'" />
                    <CircleCheck v-else-if="notification.type === 'success'" />
                    <CircleClose v-else />
                  </el-icon>
                </div>
                <div class="notification-content">
                  <div class="title">{{ notification.title }}</div>
                  <div class="description">{{ notification.content }}</div>
                  <div class="time">{{ notification.time }}</div>
                </div>
                <div class="notification-actions">
                  <el-button 
                    v-if="!notification.read"
                    type="primary" 
                    size="small" 
                    text
                    @click="handleMarkAsRead(notification)"
                  >标记已读</el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="待办提醒" name="todo">
            <div class="notification-list">
              <div 
                v-for="(todo, index) in todoNotifications" 
                :key="index" 
                class="notification-item"
                :class="{ unread: !todo.read }"
              >
                <div class="notification-icon" :class="todo.priority">
                  <el-icon>
                    <AlarmClock />
                  </el-icon>
                </div>
                <div class="notification-content">
                  <div class="title">{{ todo.title }}</div>
                  <div class="description">{{ todo.content }}</div>
                  <div class="time">截止时间：{{ todo.deadline }}</div>
                </div>
                <div class="notification-actions">
                  <el-button 
                    type="primary" 
                    size="small" 
                    text
                    @click="handleTodoAction(todo)"
                  >去处理</el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell, Warning, CircleCheck, CircleClose, AlarmClock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('system')

// 模拟系统通知数据
const systemNotifications = ref([
  {
    type: 'info',
    title: '系统更新通知',
    content: '系统将于今晚22:00进行例行维护更新',
    time: '10分钟前',
    read: false
  },
  {
    type: 'warning',
    title: '数据备份提醒',
    content: '请注意及时备份重要数据',
    time: '30分钟前',
    read: false
  },
  {
    type: 'success',
    title: '功能升级完成',
    content: '新版本功能已成功部署',
    time: '1小时前',
    read: true
  }
])

// 模拟待办提醒数据
const todoNotifications = ref([
  {
    priority: 'high',
    title: 'NOTAM审核',
    content: '有3条NOTAM等待您的审核',
    deadline: '今天 14:00',
    read: false
  },
  {
    priority: 'medium',
    title: '周报提交',
    content: '请及时提交本周工作总结',
    deadline: '明天 18:00',
    read: false
  }
])

// 计算未读消息数
const unreadCount = computed(() => {
  const systemUnread = systemNotifications.value.filter(n => !n.read).length
  const todoUnread = todoNotifications.value.filter(n => !n.read).length
  return systemUnread + todoUnread
})

// 标记单条消息已读
const handleMarkAsRead = (notification: any) => {
  notification.read = true
  ElMessage.success('已标记为已读')
}

// 全部标记已读
const handleReadAll = () => {
  systemNotifications.value.forEach(n => n.read = true)
  todoNotifications.value.forEach(n => n.read = true)
  ElMessage.success('已全部标记为已读')
}

// 处理待办事项
const handleTodoAction = (todo: any) => {
  ElMessage.info(`正在处理：${todo.title}`)
}
</script>

<style lang="scss" scoped>
.notification-list {
  .notification-item {
    display: flex;
    align-items: flex-start;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: var(--el-border-radius-base);
    background: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color-light);
    transition: all 0.3s ease;
    
    &.unread {
      background: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary-light-7);
    }
    
    .notification-icon {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.info {
        color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
      }
      
      &.warning {
        color: var(--el-color-warning);
        background: var(--el-color-warning-light-9);
      }
      
      &.success {
        color: var(--el-color-success);
        background: var(--el-color-success-light-9);
      }
      
      &.error {
        color: var(--el-color-danger);
        background: var(--el-color-danger-light-9);
      }
      
      &.high {
        color: var(--el-color-danger);
        background: var(--el-color-danger-light-9);
      }
      
      &.medium {
        color: var(--el-color-warning);
        background: var(--el-color-warning-light-9);
      }
    }
    
    .notification-content {
      flex: 1;
      min-width: 0;
      
      .title {
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        margin-bottom: 4px;
      }
      
      .description {
        font-size: 13px;
        color: var(--el-text-color-regular);
        margin-bottom: 4px;
      }
      
      .time {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
    
    .notification-actions {
      margin-left: 12px;
    }
  }
}

@media screen and (max-width: 768px) {
  .notification-list {
    .notification-item {
      padding: 10px;
      
      .notification-icon {
        width: 28px;
        height: 28px;
      }
      
      .notification-content {
        .title {
          font-size: 13px;
        }
        
        .description {
          font-size: 12px;
        }
        
        .time {
          font-size: 11px;
        }
      }
    }
  }
}
</style> 