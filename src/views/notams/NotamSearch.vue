<template>
  <div class="notams-search">
    <el-card class="search-card" :class="{ 'dark': isDark }">
      <template #header>
        <div class="card-header">
          <span>{{ $t('notam.search.title') }}</span>
        </div>
      </template>
      <el-form 
        :model="searchForm" 
        :rules="rules"
        ref="searchFormRef"
        label-width="120px"
        @submit.prevent="onSearch"
      >
        <el-form-item :label="$t('notam.search.airportCode')" prop="code">
          <el-input 
            v-model="searchForm.code" 
            :placeholder="$t('notam.search.placeholder.airport')"
            maxlength="4"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('notam.search.dateRange')" prop="dateRange">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            :start-placeholder="$t('notam.search.placeholder.startDate')"
            :end-placeholder="$t('notam.search.placeholder.endDate')"
            :shortcuts="dateShortcuts"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item :label="$t('notam.search.type')" prop="type">
          <el-select v-model="searchForm.type" :placeholder="$t('notam.search.type')">
            <el-option label="全部" value="" />
            <el-option 
              v-for="(value, key) in notamTypes" 
              :key="key"
              :label="$t(`notam.types.${key}`)"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" :loading="loading">
            {{ $t('notam.search.search') }}
          </el-button>
          <el-button @click="onReset">{{ $t('notam.search.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useTheme } from '@/composables/useTheme'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { isDark } = useTheme()
const { t } = useI18n()
const searchFormRef = ref()
const loading = ref(false)

// NOTAM类型
const notamTypes = {
  new: 'new',
  replace: 'replace',
  cancel: 'cancel',
  facilities: 'facilities',
  runway: 'runway',
  navigation: 'navigation',
  airspace: 'airspace',
  weather: 'weather',
  emergency: 'emergency'
}

// 表单数据
const searchForm = ref({
  code: '',
  dateRange: [],
  type: ''
})

// 表单验证规则
const rules = {
  code: [
    { required: true, message: t('notam.search.placeholder.airport'), trigger: 'blur' },
    { pattern: /^[A-Z]{4}$/, message: t('notam.search.placeholder.airport'), trigger: 'blur' }
  ],
  dateRange: [
    { required: true, message: t('notam.search.dateRange'), trigger: 'change' },
    { 
      validator: (rule: any, value: string[], callback: Function) => {
        if (value && value.length === 2) {
          const start = new Date(value[0])
          const end = new Date(value[1])
          const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24))
          if (diff > 90) {
            callback(new Error('时间范围不能超过90天'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 日期快捷选项
const dateShortcuts = [
  {
    text: t('notam.overview.timeRange.week'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: t('notam.overview.timeRange.month'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  }
]

// 查询
const onSearch = () => {
  searchFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        router.push({
          path: '/notams/result',
          query: {
            code: searchForm.value.code,
            startDate: searchForm.value.dateRange[0],
            endDate: searchForm.value.dateRange[1],
            type: searchForm.value.type
          }
        })
      } catch (error) {
        ElMessage.error(t('common.error.searchFailed'))
      } finally {
        loading.value = false
      }
    }
  })
}

// 重置
const onReset = () => {
  searchFormRef.value.resetFields()
}
</script>

<style scoped lang="scss">
.notams-search {
  padding: 20px;
  min-height: calc(100vh - 120px);
  background-color: var(--el-bg-color);
  
  .search-card {
    max-width: 800px;
    margin: 0 auto;
    background-color: var(--el-bg-color-overlay);
    border-color: var(--el-border-color-light);
    
    &.dark {
      :deep(.el-card__header) {
        border-bottom: 1px solid var(--el-border-color-darker);
      }
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--el-text-color-primary);
    }

    :deep(.el-form) {
      .el-form-item__label {
        color: var(--el-text-color-regular);
      }
    }
  }
}
</style> 