<template>
  <div class="notams-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ $t('notam.list.title') }}</span>
          <div class="header-actions">
            <el-button type="primary" @click="onRefresh">{{ $t('notam.list.refresh') }}</el-button>
          </div>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="notamId" :label="$t('notam.list.columns.id')" min-width="180" sortable />
        <el-table-column prop="type" :label="$t('notam.list.columns.type')" min-width="120">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.type)">{{ $t(`notam.types.${scope.row.type}`) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" :label="$t('notam.list.columns.location')" min-width="120" sortable />
        <el-table-column prop="startTime" :label="$t('notam.list.columns.startTime')" min-width="180" sortable />
        <el-table-column prop="endTime" :label="$t('notam.list.columns.endTime')" min-width="180" sortable />
        <el-table-column prop="status" :label="$t('notam.list.columns.status')" min-width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ $t(`notam.activity.status.${scope.row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" :label="$t('notam.list.columns.content')" min-width="300" show-overflow-tooltip />
        <el-table-column fixed="right" :label="$t('notam.list.columns.actions')" min-width="180">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row)">
              {{ $t('notam.list.actions.view') }}
            </el-button>
            <el-button link type="primary" @click="handleEdit(scope.row)">
              {{ $t('notam.list.actions.edit') }}
            </el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)">
              {{ $t('notam.list.actions.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="$t('notam.list.title')"
      width="50%"
    >
      <div class="detail-content">
        <p><strong>{{ $t('notam.list.columns.id') }}：</strong>{{ currentDetail.notamId }}</p>
        <p>
          <strong>{{ $t('notam.list.columns.type') }}：</strong>
          <el-tag :type="getTagType(currentDetail.type)">
            {{ $t(`notam.types.${currentDetail.type}`) }}
          </el-tag>
        </p>
        <p><strong>{{ $t('notam.list.columns.location') }}：</strong>{{ currentDetail.location }}</p>
        <p><strong>{{ $t('notam.list.columns.startTime') }}：</strong>{{ currentDetail.startTime }}</p>
        <p><strong>{{ $t('notam.list.columns.endTime') }}：</strong>{{ currentDetail.endTime }}</p>
        <p><strong>{{ $t('notam.list.columns.content') }}：</strong></p>
        <p class="content-text">{{ currentDetail.content }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const currentDetail = ref({})

// 模拟数据
const tableData = ref([
  {
    notamId: 'A1234/23',
    type: 'new',
    location: 'ZBAA',
    startTime: '2024-03-21 08:00',
    endTime: '2024-03-22 08:00',
    status: 'published',
    content: '由于跑道维护工作，跑道18L/36R关闭'
  },
  {
    notamId: 'B5678/23',
    type: 'replace',
    location: 'ZSPD',
    startTime: '2024-03-21 09:00',
    endTime: '2024-03-23 09:00',
    status: 'pending',
    content: '导航设备VOR/DME将进行例行维护'
  },
  {
    notamId: 'C9012/23',
    type: 'cancel',
    location: 'ZGGG',
    startTime: '2024-03-21 10:00',
    endTime: '2024-03-24 10:00',
    status: 'approved',
    content: '取消NOTAM A1200/23关于跑道施工的通知'
  }
])

const getTagType = (type: string) => {
  const types = {
    new: 'success',
    replace: 'warning',
    cancel: 'danger'
  }
  return types[type] || ''
}

const getStatusType = (status: string) => {
  const types = {
    published: 'success',
    pending: 'warning',
    approved: 'success',
    processing: 'info',
    cancelled: 'danger'
  }
  return types[status] || ''
}

const viewDetail = (row: any) => {
  currentDetail.value = row
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  // 实现编辑功能
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    t('common.confirm.delete', { id: row.notamId }),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm.yes'),
      cancelButtonText: t('common.confirm.no'),
      type: 'warning'
    }
  ).then(() => {
    // 实现删除功能
    ElMessage({
      type: 'success',
      message: t('common.success.delete')
    })
  }).catch(() => {
    // 取消删除
  })
}

const onRefresh = () => {
  // 实现刷新功能
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage({
      type: 'success',
      message: t('common.success.refresh')
    })
  }, 1000)
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // 重新加载数据
}

onMounted(() => {
  // 加载数据
})
</script>

<style scoped lang="scss">
.notams-list {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .detail-content {
    p {
      margin: 10px 0;
    }

    .content-text {
      white-space: pre-wrap;
      padding: 10px;
      background-color: var(--el-fill-color-light);
      border-radius: 4px;
    }
  }
}
</style> 