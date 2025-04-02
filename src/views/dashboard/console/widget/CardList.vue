<template>
  <div class="card-list">
    <div class="card-item" v-for="(item, index) in cardList" :key="index">
      <div class="card-content">
        <div class="card-title">
          <span>{{ item.title }}</span>
          <el-tooltip :content="item.tooltip" placement="top" v-if="item.tooltip">
            <i class="iconfont-sys">&#xe6f6;</i>
          </el-tooltip>
        </div>
        <div class="card-value">
          <span>{{ item.value }}</span>
          <span class="unit" v-if="item.unit">{{ item.unit }}</span>
        </div>
        <div class="card-footer">
          <span :class="['change', item.trend === 'up' ? 'text-success' : 'text-danger']">
            <i class="iconfont-sys">{{ item.trend === 'up' ? '&#xe778;' : '&#xe77b;' }}</i>
            {{ item.change }}
          </span>
          <span class="time">较上月</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const cardList = ref([
  {
    title: '本月NOTAM总数',
    value: '288',
    unit: '条',
    change: '15%',
    trend: 'up',
    tooltip: '包括新发布、替换和取消的NOTAM'
  },
  {
    title: '活跃机场数',
    value: '56',
    unit: '个',
    change: '12%',
    trend: 'up',
    tooltip: '本月发布NOTAM的机场数量'
  },
  {
    title: 'NOTAM处理时间',
    value: '12',
    unit: '分钟',
    change: '8%',
    trend: 'up',
    tooltip: 'NOTAM从接收到发布的平均处理时间'
  },
  {
    title: '系统响应时间',
    value: '1.2',
    unit: '秒',
    change: '5%',
    trend: 'up',
    tooltip: 'NOTAM查询和处理的平均响应时间'
  }
])
</script>

<style lang="scss" scoped>
.card-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--console-margin);

  .card-item {
    padding: 20px;
    background: var(--art-main-bg-color);
    border-radius: calc(var(--custom-radius) + 4px);
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
    }

    .card-content {
      .card-title {
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--art-text-gray-600);
        font-size: 14px;

        i {
          font-size: 12px;
          cursor: help;
        }
      }

      .card-value {
        margin-top: 12px;
        font-size: 28px;
        font-weight: 500;
        color: var(--art-text-gray-900);

        .unit {
          margin-left: 4px;
          font-size: 14px;
          color: var(--art-text-gray-600);
        }
      }

      .card-footer {
        margin-top: 12px;
        display: flex;
        align-items: center;
        gap: 8px;

        .change {
          display: flex;
          align-items: center;
          font-size: 13px;

          i {
            font-size: 12px;
            margin-right: 2px;
          }
        }

        .time {
          font-size: 13px;
          color: var(--art-text-gray-600);
        }
      }
    }
  }
}

@media (width <= $device-notebook) {
  .card-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width <= $device-phone) {
  .card-list {
    grid-template-columns: 1fr;
  }
}
</style>
