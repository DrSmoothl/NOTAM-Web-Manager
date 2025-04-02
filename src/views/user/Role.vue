<template>
  <div class="page-content">
    <el-row :gutter="20" class="search-bar">
      <el-col :xs="24" :sm="8" :lg="6">
        <el-input v-model="searchForm.name" placeholder="角色名称" clearable></el-input>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="6">
        <el-select v-model="searchForm.type" placeholder="角色类型" clearable style="width: 100%">
          <el-option
            v-for="item in roleTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="6" class="operation-col">
        <el-button type="primary" @click="handleSearch" :loading="loading" v-ripple>搜索</el-button>
        <el-button @click="resetSearch" v-ripple>重置</el-button>
        <el-button type="success" @click="showDialog('add')" v-ripple>新增角色</el-button>
      </el-col>
    </el-row>

    <art-table :data="tableData" :loading="loading">
      <template #default>
        <el-table-column label="角色名称" prop="name" min-width="150" />
        <el-table-column label="角色类型" prop="type" min-width="120">
          <template #default="scope">
            <el-tag :type="getRoleTypeTag(scope.row.type)">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="权限范围" prop="scope" min-width="120" />
        <el-table-column label="描述" prop="description" min-width="200" show-overflow-tooltip />
        <el-table-column label="状态" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'info'">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="160" sortable />
        <el-table-column label="最后修改时间" prop="updateTime" min-width="160" sortable />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button-group>
              <el-button
                type="primary"
                link
                @click="showPermissionDialog(scope.row)"
                v-if="scope.row.type !== '系统管理员'"
              >
                权限配置
              </el-button>
              <el-button
                type="primary"
                link
                @click="showDialog('edit', scope.row)"
                v-if="scope.row.type !== '系统管理员'"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                link
                @click="handleDelete(scope.row)"
                v-if="scope.row.type !== '系统管理员'"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      width="500px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择角色类型" style="width: 100%">
            <el-option
              v-for="item in roleTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="权限范围" prop="scope">
          <el-select v-model="form.scope" placeholder="请选择权限范围" style="width: 100%">
            <el-option
              v-for="item in scopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
            {{ dialogType === 'add' ? '创建' : '保存' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="permissionDialog" title="权限配置" width="600px">
      <div class="permission-container">
        <div class="permission-header">
          <span class="module-title">功能模块权限</span>
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
        <el-divider />
        <div class="permission-content" :style="{ maxHeight: '500px', overflowY: 'auto' }">
          <el-tree
            ref="permissionTree"
            :data="permissionData"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            :default-checked-keys="defaultCheckedKeys"
            @check="handlePermissionCheck"
          />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="permissionDialog = false">取消</el-button>
          <el-button type="primary" @click="savePermissions" :loading="savePermissionLoading">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const loading = ref(false)
const submitLoading = ref(false)
const savePermissionLoading = ref(false)
const dialogVisible = ref(false)
const permissionDialog = ref(false)
const dialogType = ref('add')
const checkAll = ref(false)
const formRef = ref<FormInstance>()
const permissionTree = ref(null)

// 角色类型选项
const roleTypeOptions = [
  { value: '系统管理员', label: '系统管理员' },
  { value: '机场管理员', label: '机场管理员' },
  { value: 'NOTAM管理员', label: 'NOTAM管理员' },
  { value: '运行人员', label: '运行人员' },
  { value: '普通用户', label: '普通用户' }
]

// 权限范围选项
const scopeOptions = [
  { value: '全部数据', label: '全部数据' },
  { value: '本机场数据', label: '本机场数据' },
  { value: '本部门数据', label: '本部门数据' },
  { value: '个人数据', label: '个人数据' }
]

// 搜索表单
const searchForm = reactive({
  name: '',
  type: ''
})

// 表单数据
const form = reactive({
  name: '',
  type: '',
  scope: '',
  description: '',
  status: true
})

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择角色类型', trigger: 'change' }
  ],
  scope: [
    { required: true, message: '请选择权限范围', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' }
  ]
})

// 模拟表格数据
const tableData = [
  {
    id: 1,
    name: '系统超级管理员',
    type: '系统管理员',
    scope: '全部数据',
    description: '拥有系统所有功能和数据的操作权限',
    status: true,
    createTime: '2024-03-01 10:00:00',
    updateTime: '2024-03-22 15:30:00'
  },
  {
    id: 2,
    name: '首都机场NOTAM管理员',
    type: 'NOTAM管理员',
    scope: '本机场数据',
    description: '负责首都机场NOTAM的发布、审核和管理',
    status: true,
    createTime: '2024-03-05 09:00:00',
    updateTime: '2024-03-21 14:20:00'
  },
  {
    id: 3,
    name: '空管运行值班员',
    type: '运行人员',
    scope: '本部门数据',
    description: '负责空管运行相关的NOTAM处理和查询',
    status: true,
    createTime: '2024-03-10 11:00:00',
    updateTime: '2024-03-20 16:45:00'
  },
  {
    id: 4,
    name: '航行情报员',
    type: '运行人员',
    scope: '本部门数据',
    description: '负责航行情报相关的NOTAM处理和维护',
    status: true,
    createTime: '2024-03-15 13:30:00',
    updateTime: '2024-03-22 10:15:00'
  }
]

// 权限树数据
const permissionData = [
  {
    id: 1,
    label: 'NOTAM管理',
    children: [
      {
        id: 11,
        label: 'NOTAM发布',
        children: [
          { id: 111, label: '创建NOTAM' },
          { id: 112, label: '编辑NOTAM' },
          { id: 113, label: '删除NOTAM' }
        ]
      },
      {
        id: 12,
        label: 'NOTAM审核',
        children: [
          { id: 121, label: '审核NOTAM' },
          { id: 122, label: '驳回NOTAM' },
          { id: 123, label: '批量审核' }
        ]
      },
      {
        id: 13,
        label: 'NOTAM查询',
        children: [
          { id: 131, label: '基础查询' },
          { id: 132, label: '高级查询' },
          { id: 133, label: '导出数据' }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '系统管理',
    children: [
      {
        id: 21,
        label: '用户管理',
        children: [
          { id: 211, label: '查看用户' },
          { id: 212, label: '创建用户' },
          { id: 213, label: '编辑用户' },
          { id: 214, label: '删除用户' }
        ]
      },
      {
        id: 22,
        label: '角色管理',
        children: [
          { id: 221, label: '查看角色' },
          { id: 222, label: '创建角色' },
          { id: 223, label: '编辑角色' },
          { id: 224, label: '删除角色' }
        ]
      }
    ]
  }
]

const defaultProps = {
  children: 'children',
  label: 'label'
}

const defaultCheckedKeys = ref([])

// 获取角色类型对应的标签类型
const getRoleTypeTag = (type: string) => {
  const typeMap = {
    '系统管理员': 'danger',
    '机场管理员': 'warning',
    'NOTAM管理员': 'success',
    '运行人员': 'primary',
    '普通用户': 'info'
  }
  return typeMap[type] || 'info'
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

// 显示对话框
const showDialog = (type: string, row?: any) => {
  dialogVisible.value = true
  dialogType.value = type

  if (type === 'edit' && row) {
    Object.assign(form, row)
  } else {
    Object.assign(form, {
      name: '',
      type: '',
      scope: '',
      description: '',
      status: true
    })
  }
}

// 显示权限配置对话框
const showPermissionDialog = (row: any) => {
  permissionDialog.value = true
  // 模拟获取当前角色的权限
  defaultCheckedKeys.value = [111, 112, 131, 132, 211]
}

// 全选处理
const handleCheckAllChange = (val: boolean) => {
  const allKeys = getAllKeys(permissionData)
  defaultCheckedKeys.value = val ? allKeys : []
  permissionTree.value?.setCheckedKeys(defaultCheckedKeys.value)
}

// 获取所有节点的key
const getAllKeys = (data: any[]): number[] => {
  let keys: number[] = []
  data.forEach(item => {
    keys.push(item.id)
    if (item.children) {
      keys = keys.concat(getAllKeys(item.children))
    }
  })
  return keys
}

// 权限选择处理
const handlePermissionCheck = () => {
  const checkedKeys = permissionTree.value?.getCheckedKeys()
  const allKeys = getAllKeys(permissionData)
  checkAll.value = checkedKeys.length === allKeys.length
}

// 保存权限
const savePermissions = () => {
  savePermissionLoading.value = true
  const checkedKeys = permissionTree.value?.getCheckedKeys()
  // 实现保存权限逻辑
  setTimeout(() => {
    ElMessage.success('权限配置保存成功')
    permissionDialog.value = false
    savePermissionLoading.value = false
  }, 500)
}

// 提交表单
const handleSubmit = async () => {
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

// 删除角色
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除该角色吗？此操作不可恢复', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
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
  
  .permission-container {
    .permission-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      
      .module-title {
        font-size: 16px;
        font-weight: 500;
      }
    }
    
    .permission-content {
      padding: 20px;
    }
  }
}
</style>
