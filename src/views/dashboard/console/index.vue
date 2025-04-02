<template>
  <div class="console">
    <el-row :gutter="20">
      <el-col :span="24">
        <NotamOverview />
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :xl="16" :lg="16" :md="24">
        <NotamActivity />
      </el-col>
      <el-col :xl="8" :lg="8" :md="24">
        <SystemStatus />
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :xl="12" :lg="12" :md="24">
        <UrgentNotams />
      </el-col>
      <el-col :xl="12" :lg="12" :md="24">
        <NotamWorkflow />
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :xl="8" :lg="8" :md="24">
        <NotificationCenter />
      </el-col>
      <el-col :xl="8" :lg="8" :md="24">
        <TaskList />
      </el-col>
      <el-col :xl="8" :lg="8" :md="24">
        <SystemLog />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import NotamOverview from './widget/NotamOverview.vue'
import NotamActivity from './widget/NotamActivity.vue'
import SystemStatus from './widget/SystemStatus.vue'
import UrgentNotams from './widget/UrgentNotams.vue'
import NotamWorkflow from './widget/NotamWorkflow.vue'
import NotificationCenter from './widget/NotificationCenter.vue'
import TaskList from './widget/TaskList.vue'
import SystemLog from './widget/SystemLog.vue'

import { useSettingStore } from '@/store/modules/setting'
import { useCommon } from '@/composables/useCommon'

const settingStore = useSettingStore()
const currentGlopTheme = computed(() => settingStore.systemThemeType)

// 系统主题风格变化时，刷新页面重写渲染 Echarts
watch(currentGlopTheme, () => {
  settingStore.reload()
})

useCommon().scrollToTop()
</script>

<style lang="scss" scoped>
.console {
  padding: 20px;

  :deep(.custom-card) {
    background: var(--art-main-bg-color);
    border-radius: var(--el-border-radius-base);
    box-shadow: var(--el-box-shadow-light);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: var(--el-box-shadow);
    }
  }

  :deep(.card-header) {
    display: flex;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-light);

    .title {
      h4 {
        font-size: 16px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }

      p {
        margin-top: 4px;
        font-size: 13px;
        color: var(--el-text-color-secondary);

        .highlight {
          margin-left: 8px;
          color: var(--el-color-success);
        }
      }
    }

    .actions {
      .el-button {
        padding: 6px 12px;
        font-size: 13px;
      }
    }
  }

  :deep(.card-content) {
    padding: 20px;
  }

  .mt-20 {
    margin-top: 20px;
  }

  // 数据概览卡片
  :deep(.overview-card) {
    .overview-item {
      text-align: center;

      .value {
        font-size: 24px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .label {
        margin-top: 8px;
        font-size: 14px;
        color: var(--el-text-color-secondary);
      }

      .trend {
        margin-top: 4px;
        font-size: 12px;

        &.up {
          color: var(--el-color-danger);
        }

        &.down {
          color: var(--el-color-success);
        }
      }
    }
  }

  // 列表样式
  :deep(.list-content) {
    .list-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }

      .item-icon {
        width: 32px;
        height: 32px;
        margin-right: 12px;
        line-height: 32px;
        text-align: center;
        border-radius: var(--el-border-radius-base);

        &.info {
          color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
        }

        &.warning {
          color: var(--el-color-warning);
          background: var(--el-color-warning-light-9);
        }

        &.danger {
          color: var(--el-color-danger);
          background: var(--el-color-danger-light-9);
        }
      }

      .item-content {
        flex: 1;

        .title {
          font-size: 14px;
          color: var(--el-text-color-primary);
        }

        .info {
          margin-top: 4px;
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }

      .item-extra {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

// 响应式布局
@media screen and (max-width: 1200px) {
  .console {
    .mt-20 {
      margin-top: 16px;
    }

    :deep(.custom-card) {
      margin-bottom: 16px;
    }
  }
}

@media screen and (max-width: 768px) {
  .console {
    padding: 16px;

    :deep(.card-header) {
      padding: 12px 16px;

      .title {
        h4 {
          font-size: 14px;
        }

        p {
          font-size: 12px;
        }
      }
    }

    :deep(.card-content) {
      padding: 16px;
    }

    :deep(.overview-card) {
      .overview-item {
        .value {
          font-size: 20px;
        }

        .label {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
