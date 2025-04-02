<template>
  <div class="custom-card">
    <div class="card-header">
      <div class="title">
        <h4>紧急NOTAM</h4>
        <p>需要立即处理的NOTAM <span class="highlight">{{ urgentNotams.length }}条</span></p>
      </div>
      <div class="actions">
        <el-button type="primary" size="small" @click="handleProcessAll">批量处理</el-button>
      </div>
    </div>
    <div class="card-content">
      <div class="list-content">
        <div v-for="(notam, index) in urgentNotams" :key="index" class="list-item">
          <div class="item-icon" :class="getUrgencyClass(notam.urgencyLevel)">
            <el-icon>
              <Warning v-if="notam.urgencyLevel === 'high'" />
              <AlarmClock v-else-if="notam.urgencyLevel === 'medium'" />
              <Bell v-else />
            </el-icon>
          </div>
          <div class="item-content">
            <div class="title">{{ notam.title }}</div>
            <div class="info">
              <span>NOTAM ID: {{ notam.id }}</span>
              <el-divider direction="vertical" />
              <span>{{ notam.airport }}</span>
              <el-divider direction="vertical" />
              <span>{{ notam.category }}</span>
            </div>
          </div>
          <div class="item-extra">
            <el-tag 
              size="small" 
              :type="getUrgencyType(notam.urgencyLevel)"
            >{{ getUrgencyText(notam.urgencyLevel) }}</el-tag>
            <div class="time">{{ notam.remainingTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Warning, AlarmClock, Bell } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 模拟紧急NOTAM数据
const urgentNotams = ref([
  {
    id: 'A1234/23',
    title: '跑道临时关闭通知',
    airport: '北京首都国际机场',
    category: '跑道',
    urgencyLevel: 'high',
    remainingTime: '剩余 2小时'
  },
  {
    id: 'B5678/23',
    title: '导航设备维护',
    airport: '上海浦东国际机场',
    category: '导航',
    urgencyLevel: 'medium',
    remainingTime: '剩余 4小时'
  },
  {
    id: 'C9012/23',
    title: '机场灯光系统升级',
    airport: '广州白云国际机场',
    category: '灯光',
    urgencyLevel: 'low',
    remainingTime: '剩余 6小时'
  }
])

// 获取紧急程度对应的图标样式类
const getUrgencyClass = (level: string) => {
  switch (level) {
    case 'high':
      return 'danger'
    case 'medium':
      return 'warning'
    default:
      return 'info'
  }
}

// 获取紧急程度对应的标签类型
const getUrgencyType = (level: string) => {
  switch (level) {
    case 'high':
      return 'danger'
    case 'medium':
      return 'warning'
    default:
      return 'info'
  }
}

// 获取紧急程度对应的文本
const getUrgencyText = (level: string) => {
  switch (level) {
    case 'high':
      return '高优先级'
    case 'medium':
      return '中优先级'
    default:
      return '低优先级'
  }
}

// 批量处理按钮点击事件
const handleProcessAll = () => {
  ElMessage.success('已开始批量处理紧急NOTAM')
}
</script>

<style lang="scss" scoped>
.item-extra {
  text-align: right;
  
  .time {
    margin-top: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.info {
  display: flex;
  align-items: center;
  
  .el-divider {
    margin: 0 8px;
  }
}
</style> 