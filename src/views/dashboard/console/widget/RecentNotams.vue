<template>
  <div class="region recent-notams art-custom-card">
    <div class="card-header">
      <div class="title">
        <h4 class="box-title">最近NOTAM</h4>
        <p class="subtitle">最新发布的5条NOTAM</p>
      </div>
    </div>
    <div class="notam-list">
      <div v-for="(item, index) in notamList" :key="index" class="notam-item">
        <div class="notam-header">
          <span class="notam-id">{{ item.id }}</span>
          <el-tag :type="getTagType(item.type)" size="small">{{ item.type }}</el-tag>
        </div>
        <div class="notam-content">{{ item.content }}</div>
        <div class="notam-footer">
          <span class="location">{{ item.location }}</span>
          <span class="time">{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const notamList = ref([
  {
    id: 'A1234/23',
    type: '新发布',
    content: '由于跑道维护工作，跑道18L/36R从2023年12月1日0800UTC至2023年12月5日1600UTC期间关闭',
    location: 'ZBAA',
    time: '2023-12-01 08:00'
  },
  {
    id: 'A1235/23',
    type: '替换',
    content: '导航设备VOR/DME将进行例行维护，可能影响导航精度',
    location: 'ZSPD',
    time: '2023-12-01 09:30'
  },
  {
    id: 'A1236/23',
    type: '取消',
    content: '取消NOTAM A1200/23关于跑道施工的通知',
    location: 'ZGGG',
    time: '2023-12-01 10:15'
  },
  {
    id: 'A1237/23',
    type: '新发布',
    content: '机场除冰作业，可能造成航班延误',
    location: 'ZHHH',
    time: '2023-12-01 11:00'
  },
  {
    id: 'A1238/23',
    type: '新发布',
    content: '塔台频率临时更改为118.75MHz',
    location: 'ZSSS',
    time: '2023-12-01 11:30'
  }
])

const getTagType = (type: string) => {
  const types = {
    '新发布': 'success',
    '替换': 'warning',
    '取消': 'danger'
  }
  return types[type] || 'info'
}
</script>

<style lang="scss" scoped>
.recent-notams {
  height: 420px;
  padding: 20px;

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

  .notam-list {
    margin-top: 20px;
    height: calc(100% - 80px);
    overflow-y: auto;
    
    .notam-item {
      padding: 12px;
      margin-bottom: 10px;
      border-radius: 8px;
      background-color: var(--el-bg-color-overlay);
      border: 1px solid var(--el-border-color-light);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }

      .notam-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .notam-id {
          font-weight: 500;
          color: var(--el-text-color-primary);
        }
      }

      .notam-content {
        font-size: 14px;
        color: var(--el-text-color-regular);
        margin-bottom: 8px;
        line-height: 1.4;
      }

      .notam-footer {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--el-text-color-secondary);

        .location {
          background-color: var(--el-fill-color-lighter);
          padding: 2px 6px;
          border-radius: 4px;
        }
      }
    }
  }
}

:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}
</style> 