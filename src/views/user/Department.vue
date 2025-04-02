<template>
  <div class="page-content">
    <el-row :gutter="20" class="search-bar">
      <el-col :xs="24" :sm="8" :lg="6">
        <el-input v-model="searchForm.name" placeholder="部门名称" clearable></el-input>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="6">
        <el-select v-model="searchForm.type" placeholder="部门类型" clearable style="width: 100%">
          <el-option
            v-for="item in departmentTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="6" class="operation-col">
        <el-button type="primary" @click="handleSearch" :loading="loading" v-ripple>搜索</el-button>
        <el-button @click="resetSearch" v-ripple>重置</el-button>
        <el-button type="success" @click="showDialog('add')" v-ripple>新增部门</el-button>
      </el-col>
    </el-row>

    <art-table :data="tableData" :loading="loading">
      <template #default>
        <el-table-column prop="name" label="部门名称" min-width="180" />
        <el-table-column prop="type" label="部门类型" min-width="120">
          <template #default="scope">
            <el-tag :type="getDepartmentTypeTag(scope.row.type)">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="manager" label="部门主管" min-width="120" />
        <el-table-column prop="contact" label="联系方式" min-width="150" />
        <el-table-column prop="sort" label="排序" width="80" sortable />
        <el-table-column label="状态" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'info'">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" sortable />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button-group>
              <el-button type="primary" link @click="showDialog('edit', scope.row)">编辑</el-button>
              <el-button type="danger" link @click="deleteDepartment(scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增部门' : '编辑部门'"
      width="500px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择部门类型" style="width: 100%">
            <el-option
              v-for="item in departmentTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门主管" prop="manager">
          <el-input v-model="formData.manager" placeholder="请输入部门主管姓名" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="formData.contact" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="1" :max="99" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="formData.status" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">
            {{ dialogType === 'add' ? '创建' : '保存' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const loading = ref(false)
const submitLoading = ref(false)
const dialogType = ref('add')
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()

// 部门类型选项
const departmentTypes = [
  { value: '空管部门', label: '空管部门' },
  { value: '情报部门', label: '情报部门' },
  { value: '运行部门', label: '运行部门' },
  { value: '安全部门', label: '安全部门' },
  { value: '技术部门', label: '技术部门' },
  { value: '管理部门', label: '管理部门' }
]

// 搜索表单
const searchForm = reactive({
  name: '',
  type: ''
})

// 表单数据
const formData = reactive({
  name: '',
  type: '',
  manager: '',
  contact: '',
  sort: 1,
  status: true,
  remark: ''
})

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择部门类型', trigger: 'change' }
  ],
  manager: [
    { required: true, message: '请输入部门主管姓名', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' }
  ]
})

// 模拟表格数据
const tableData = [
  {
    id: 1,
    name: '空中交通管制部',
    type: '空管部门',
    manager: '张三',
    contact: '13800138001',
    sort: 1,
    status: true,
    createTime: '2024-03-01 10:00:00',
    remark: '负责机场空中交通管制工作'
  },
  {
    id: 2,
    name: '航行情报服务部',
    type: '情报部门',
    manager: '李四',
    contact: '13800138002',
    sort: 2,
    status: true,
    createTime: '2024-03-02 11:00:00',
    remark: '负责航行通告和情报服务工作'
  },
  {
    id: 3,
    name: '机场运行管理部',
    type: '运行部门',
    manager: '王五',
    contact: '13800138003',
    sort: 3,
    status: true,
    createTime: '2024-03-03 12:00:00',
    remark: '负责机场日常运行管理工作'
  },
  {
    id: 4,
    name: '安全监察部',
    type: '安全部门',
    manager: '赵六',
    contact: '13800138004',
    sort: 4,
    status: true,
    createTime: '2024-03-04 13:00:00',
    remark: '负责机场安全监督检查工作'
  },
  {
    id: 5,
    name: '技术保障部',
    type: '技术部门',
    manager: '钱七',
    contact: '13800138005',
    sort: 5,
    status: true,
    createTime: '2024-03-05 14:00:00',
    remark: '负责机场技术设备保障工作'
  }
]

// 获取部门类型对应的标签类型
const getDepartmentTypeTag = (type: string) => {
  const typeMap = {
    '空管部门': 'danger',
    '情报部门': 'warning',
    '运行部门': 'success',
    '安全部门': 'primary',
    '技术部门': 'info',
    '管理部门': ''
  }
  return typeMap[type] || ''
}

// 搜索处理
const handleSearch = () => {
  loading.value = true
  // 实现搜索逻辑
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.type = ''
  handleSearch()
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    name: '',
    type: '',
    manager: '',
    contact: '',
    sort: 1,
    status: true,
    remark: ''
  })
}

// 显示对话框
const showDialog = (type: string, row?: any) => {
  dialogType.value = type
  dialogVisible.value = true

  if (type === 'edit' && row) {
    Object.assign(formData, row)
  } else {
    resetForm()
  }
}

// 删除部门
const deleteDepartment = (row: any) => {
  ElMessageBox.confirm('确定要删除该部门吗？此操作不可恢复', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      // 实现表单提交逻辑
      setTimeout(() => {
        ElMessage.success(dialogType.value === 'add' ? '创建成功' : '保存成功')
        dialogVisible.value = false
        submitLoading.value = false
      }, 500)
    }
  })
}
</script>

<style scoped lang="scss">
.page-content {
  padding: 20px;
  
  .search-bar {
    margin-bottom: 20px;
    
    .operation-col {
      display: flex;
      gap: 10px;
      
      @media screen and (max-width: 768px) {
        margin-top: 10px;
      }
    }
  }
}
</style>
