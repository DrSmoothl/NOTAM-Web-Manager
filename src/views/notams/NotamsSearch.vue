<template>
  <div class="notams-search">
    <el-card class="search-card" :class="{ 'dark': isDark }">
      <template #header>
        <div class="card-header">
          <span>NOTAMS查询</span>
        </div>
      </template>
      <el-form 
        :model="searchForm" 
        :rules="rules"
        ref="searchFormRef"
        label-width="120px"
        @submit.prevent="onSearch"
      >
        <el-form-item label="机场/FIR代码" prop="code">
          <el-input 
            v-model="searchForm.code" 
            placeholder="请输入机场/FIR代码（如：ZBAA）"
            maxlength="4"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="时间范围" prop="dateRange">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="dateShortcuts"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="NOTAM类型" prop="type">
          <el-select v-model="searchForm.type" placeholder="请选择NOTAM类型">
            <el-option label="全部" value="" />
            <el-option label="新发布" value="新发布" />
            <el-option label="替换" value="替换" />
            <el-option label="取消" value="取消" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" :loading="loading">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const { isDark } = useTheme()
const searchFormRef = ref()
const loading = ref(false)

// 表单数据
const searchForm = ref({
  code: '',
  dateRange: [],
  type: ''
})

// 表单验证规则
const rules = {
  code: [
    { required: true, message: '请输入机场/FIR代码', trigger: 'blur' },
    { pattern: /^[A-Z]{4}$/, message: '请输入4位大写字母的机场/FIR代码', trigger: 'blur' }
  ],
  dateRange: [
    { required: true, message: '请选择时间范围', trigger: 'change' },
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
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
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
        ElMessage.error('查询失败，请重试')
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