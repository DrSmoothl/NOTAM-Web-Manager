<template>
  <div class="page-content">
    <table-bar
      :showTop="false"
      @search="search"
      @reset="resetForm(searchFormRef)"
      @changeColumn="changeColumn"
      :columns="columns"
    >
      <template #top>
        <el-form :model="searchForm" ref="searchFormRef" label-width="82px">
          <el-row :gutter="20">
            <form-input label="用户名" prop="name" v-model="searchForm.name" />
            <form-input label="工号" prop="employeeId" v-model="searchForm.employeeId" />
            <form-input label="邮箱" prop="email" v-model="searchForm.email" />
            <form-select
              label="用户角色"
              prop="role"
              v-model="searchForm.role"
              :options="roleOptions"
            />
          </el-row>
          <el-row :gutter="20">
            <form-select
              label="所属机场"
              prop="airport"
              v-model="searchForm.airport"
              :options="airportOptions"
            />
            <form-select
              label="部门"
              prop="department"
              v-model="searchForm.department"
              :options="departmentOptions"
            />
            <form-select
              label="状态"
              prop="status"
              v-model="searchForm.status"
              :options="statusOptions"
            />
          </el-row>
        </el-form>
      </template>
      <template #bottom>
        <el-button @click="showDialog('add')" v-ripple>添加用户</el-button>
      </template>
    </table-bar>

    <art-table :data="tableData" selection :currentPage="1" :pageSize="10" :total="50">
      <template #default>
        <el-table-column
          label="用户信息"
          prop="avatar"
          #default="scope"
          width="300px"
          v-if="columns[0].show"
        >
          <div class="user" style="display: flex; align-items: center">
            <img class="avatar" :src="scope.row.avatar" />
            <div>
              <p class="user-name">{{ scope.row.username }}</p>
              <p class="employee-id">工号：{{ scope.row.employeeId }}</p>
              <p class="email">{{ scope.row.email }}</p>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="所属机场" prop="airport" v-if="columns[1].show" />
        <el-table-column label="部门" prop="department" v-if="columns[2].show" />
        <el-table-column label="用户角色" prop="role" v-if="columns[3].show" />
        <el-table-column
          label="状态"
          prop="status"
          :filters="[
            { text: '在线', value: '1' },
            { text: '离线', value: '2' },
            { text: '休假', value: '3' },
            { text: '停用', value: '4' }
          ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
          v-if="columns[4].show"
        >
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.status)">
              {{ buildTagText(scope.row.status) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="最近登录" prop="last_login" sortable v-if="columns[5].show" />
        <el-table-column label="创建日期" prop="create_time" sortable v-if="columns[6].show" />
        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <button-table type="edit" @click="showDialog('edit', scope.row)" />
            <button-table type="delete" @click="deleteUser" />
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="40%"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="工号" prop="employeeId">
          <el-input v-model="formData.employeeId" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="所属机场" prop="airport">
          <el-select v-model="formData.airport" placeholder="请选择所属机场">
            <el-option
              v-for="item in airportOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="formData.department" placeholder="请选择部门">
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择用户角色">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { FormInstance } from 'element-plus'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormRules } from 'element-plus'

const dialogType = ref('add')
const dialogVisible = ref(false)

const formData = reactive({
  username: '',
  employeeId: '',
  email: '',
  airport: '',
  department: '',
  role: ''
})

// 机场选项
const airportOptions = [
  { value: 'ZBAA', label: '北京首都国际机场' },
  { value: 'ZBAD', label: '北京大兴国际机场' },
  { value: 'ZSPD', label: '上海浦东国际机场' },
  { value: 'ZSSS', label: '上海虹桥国际机场' },
  { value: 'ZGGG', label: '广州白云国际机场' },
  { value: 'ZUUU', label: '成都双流国际机场' },
  { value: 'ZPPP', label: '昆明长水国际机场' },
  { value: 'ZHHH', label: '武汉天河国际机场' }
]

// 部门选项
const departmentOptions = [
  { value: 'atc', label: '空中交通管制部' },
  { value: 'ais', label: '航行情报服务部' },
  { value: 'ops', label: '机场运行管理部' },
  { value: 'safety', label: '安全监察部' },
  { value: 'tech', label: '技术保障部' },
  { value: 'plan', label: '规划发展部' },
  { value: 'emergency', label: '应急指挥部' }
]

// 用户角色选项
const roleOptions = [
  { value: 'system_admin', label: '系统管理员' },
  { value: 'airport_admin', label: '机场管理员' },
  { value: 'notam_admin', label: 'NOTAM管理员' },
  { value: 'notam_publisher', label: 'NOTAM发布员' },
  { value: 'notam_reviewer', label: 'NOTAM审核员' },
  { value: 'atc_operator', label: '管制运行员' },
  { value: 'ops_operator', label: '机场运行员' },
  { value: 'readonly_user', label: '只读用户' }
]

// 状态选项
const statusOptions = [
  { value: '1', label: '在线', type: 'success' },
  { value: '2', label: '离线', type: 'info' },
  { value: '3', label: '休假', type: 'warning' },
  { value: '4', label: '停用', type: 'danger' }
]

const columns = reactive([
  { name: '用户信息', show: true },
  { name: '所属机场', show: true },
  { name: '部门', show: true },
  { name: '用户角色', show: true },
  { name: '状态', show: true },
  { name: '最近登录', show: true },
  { name: '创建日期', show: true }
])

const searchFormRef = ref<FormInstance>()
const searchForm = reactive({
  name: '',
  employeeId: '',
  email: '',
  role: '',
  airport: '',
  department: '',
  status: ''
})

// 模拟表格数据
const tableData = [
  {
    id: 1,
    username: '张三',
    employeeId: 'ATC001',
    email: 'zhangsan@atc.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    airport: '北京首都国际机场',
    department: '空中交通管制部',
    role: 'NOTAM管理员',
    status: '1',
    last_login: '2024-03-22 08:30:00',
    create_time: '2023-12-01'
  },
  {
    id: 2,
    username: '李四',
    employeeId: 'AIS002',
    email: 'lisi@ais.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    airport: '上海浦东国际机场',
    department: '航行情报服务部',
    role: 'NOTAM发布员',
    status: '1',
    last_login: '2024-03-22 09:15:00',
    create_time: '2023-12-02'
  },
  {
    id: 3,
    username: '王五',
    employeeId: 'OPS003',
    email: 'wangwu@ops.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    airport: '广州白云国际机场',
    department: '机场运行管理部',
    role: 'NOTAM审核员',
    status: '2',
    last_login: '2024-03-21 17:45:00',
    create_time: '2023-12-03'
  },
  {
    id: 4,
    username: '赵六',
    employeeId: 'ATC004',
    email: 'zhaoliu@atc.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    airport: '成都双流国际机场',
    department: '空中交通管制部',
    role: '管制运行员',
    status: '3',
    last_login: '2024-03-20 16:30:00',
    create_time: '2023-12-04'
  }
]

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const showDialog = (type: string, row?: any) => {
  dialogVisible.value = true
  dialogType.value = type

  if (type === 'edit' && row) {
    formData.username = row.username
    formData.employeeId = row.employeeId
    formData.email = row.email
    formData.airport = row.airport
    formData.department = row.department
    formData.role = row.role
  } else {
    formData.username = ''
    formData.employeeId = ''
    formData.email = ''
    formData.airport = ''
    formData.department = ''
    formData.role = ''
  }
}

const deleteUser = () => {
  ElMessageBox.confirm('确定要停用该用户吗？', '停用用户', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('停用成功')
  })
}

const search = () => {
  // 实现搜索逻辑
}

const changeColumn = (list: any) => {
  columns.values = list
}

const filterTag = (value: string, row: any) => {
  return row.status === value
}

const getTagType = (status: string) => {
  const statusMap = statusOptions.find(item => item.value === status)
  return statusMap ? statusMap.type : ''
}

const buildTagText = (status: string) => {
  const statusMap = statusOptions.find(item => item.value === status)
  return statusMap ? statusMap.label : ''
}

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  employeeId: [
    { required: true, message: '请输入工号', trigger: 'blur' },
    { pattern: /^ATC\d{3}$/, message: '工号格式为ATC加3位数字', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  airport: [
    { required: true, message: '请选择所属机场', trigger: 'change' }
  ],
  department: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ]
}

const handleSubmit = () => {
  // 实现表单提交逻辑
  ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
  dialogVisible.value = false
}
</script>

<style scoped lang="scss">
.page-content {
  padding: 20px;
  
  .user {
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 12px;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      margin: 0;
      line-height: 1.5;
    }

    .employee-id {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin: 2px 0;
    }

    .email {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin: 0;
    }
  }
}
</style>
