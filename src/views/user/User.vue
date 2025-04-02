<template>
  <div class="page-content user">
    <div class="content">
      <div class="left-wrap">
        <div class="user-wrap box-style">
          <img class="bg" src="@imgs/user/bg.png" />
          <img class="avatar" :src="userInfo.avatar" />
          <h2 class="name">{{ userInfo.username }}</h2>
          <p class="des">民航通告管理系统 - 专业的航行通告管理与分析平台</p>

          <div class="outer-info">
            <div>
              <i class="iconfont-sys">&#xe72e;</i>
              <span>{{ form.email }}</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe608;</i>
              <span>{{ form.position }}</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe736;</i>
              <span>{{ form.address }}</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe811;</i>
              <span>{{ form.department }}</span>
            </div>
          </div>

          <div class="lables">
            <h3>工作领域</h3>
            <div>
              <div v-for="item in lableList" :key="item">
                {{ item }}
              </div>
            </div>
          </div>
        </div>

        <div class="statistics box-style" style="margin-top: 20px">
          <h3>工作统计</h3>
          <div class="stats-list">
            <div class="stat-item">
              <p class="number">{{ statistics.totalNotams }}</p>
              <p class="label">处理NOTAM总数</p>
            </div>
            <div class="stat-item">
              <p class="number">{{ statistics.monthlyNotams }}</p>
              <p class="label">本月处理数量</p>
            </div>
            <div class="stat-item">
              <p class="number">{{ statistics.avgProcessTime }}分钟</p>
              <p class="label">平均处理时间</p>
            </div>
            <div class="stat-item">
              <p class="number">{{ statistics.accuracy }}%</p>
              <p class="label">处理准确率</p>
            </div>
          </div>
        </div>
      </div>
      <div class="right-wrap">
        <div class="info box-style">
          <h1 class="title">基本设置</h1>

          <el-form
            :model="form"
            class="form"
            ref="ruleFormRef"
            :rules="rules"
            label-width="86px"
            label-position="top"
          >
            <el-row>
              <el-form-item label="姓名" prop="realName">
                <el-input v-model="form.realName" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="工号" prop="employeeId" class="right-input">
                <el-input v-model="form.employeeId" disabled />
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="职位" prop="position">
                <el-input v-model="form.position" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="部门" prop="department" class="right-input">
                <el-input v-model="form.department" :disabled="!isEdit" />
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="手机" prop="mobile" class="right-input">
                <el-input v-model="form.mobile" :disabled="!isEdit" />
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="工作地点" prop="address">
                <el-input v-model="form.address" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="权限级别" prop="accessLevel" class="right-input">
                <el-select v-model="form.accessLevel" :disabled="!isEdit">
                  <el-option
                    v-for="item in accessLevelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-row>

            <el-form-item label="专业领域" prop="expertise" :style="{ height: '130px' }">
              <el-input type="textarea" :rows="4" v-model="form.expertise" :disabled="!isEdit" />
            </el-form-item>

            <div class="el-form-item-right">
              <el-button type="primary" style="width: 90px" v-ripple @click="edit">
                {{ isEdit ? '保存' : '编辑' }}
              </el-button>
            </div>
          </el-form>
        </div>

        <div class="info box-style" style="margin-top: 20px">
          <h1 class="title">安全设置</h1>

          <el-form :model="pwdForm" class="form" label-width="86px" label-position="top">
            <el-form-item label="当前密码" prop="password">
              <el-input v-model="pwdForm.password" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="pwdForm.newPassword" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="pwdForm.confirmPassword" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <div class="el-form-item-right">
              <el-button type="primary" style="width: 90px" v-ripple @click="editPwd">
                {{ isEditPwd ? '保存' : '编辑' }}
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store/modules/user'
  import { FormInstance, FormRules } from 'element-plus'

  const userStore = useUserStore()
  const userInfo = computed(() => userStore.getUserInfo)

  const isEdit = ref(false)
  const isEditPwd = ref(false)
  const date = ref('')
  
  // 模拟用户数据
  const form = reactive({
    realName: '张航空',
    employeeId: 'ATC10086',
    position: '高级航行通告分析师',
    department: '民航通告管理中心-分析部',
    email: 'zhang.air@civilaviation.com',
    mobile: '13800138000',
    address: '北京市顺义区民航总局',
    accessLevel: 'A2',
    expertise: '专注于航行通告分析与处理，具有10年空管工作经验。主要负责国内机场的NOTAM分析、处理和分发工作。熟悉ICAO标准和建议措施，精通航行通告管理系统的操作和维护。'
  })

  // 权限级别选项
  const accessLevelOptions = [
    { value: 'A1', label: 'A1 - 系统管理员' },
    { value: 'A2', label: 'A2 - 高级分析师' },
    { value: 'B1', label: 'B1 - 通告处理员' },
    { value: 'B2', label: 'B2 - 信息录入员' }
  ]

  // 工作统计数据
  const statistics = reactive({
    totalNotams: 2547,
    monthlyNotams: 156,
    avgProcessTime: 12,
    accuracy: 99.8
  })

  const pwdForm = reactive({
    password: '',
    newPassword: '',
    confirmPassword: ''
  })

  const ruleFormRef = ref<FormInstance>()

  const rules = reactive<FormRules>({
    realName: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
    department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ],
    address: [{ required: true, message: '请输入工作地点', trigger: 'blur' }],
    accessLevel: [{ required: true, message: '请选择权限级别', trigger: 'change' }]
  })

  // 工作领域标签
  const lableList: Array<string> = [
    'NOTAM分析',
    '空管专家',
    '系统管理',
    '流程优化',
    '培训讲师',
    '标准制定'
  ]

  onMounted(() => {
    getDate()
  })

  const getDate = () => {
    const d = new Date()
    const h = d.getHours()
    let text = ''

    if (h >= 6 && h < 9) {
      text = '早上好'
    } else if (h >= 9 && h < 11) {
      text = '上午好'
    } else if (h >= 11 && h < 13) {
      text = '中午好'
    } else if (h >= 13 && h < 18) {
      text = '下午好'
    } else if (h >= 18 && h < 24) {
      text = '晚上好'
    } else if (h >= 0 && h < 6) {
      text = '很晚了，早点睡'
    }

    date.value = text
  }

  const edit = () => {
    isEdit.value = !isEdit.value
  }

  const editPwd = () => {
    isEditPwd.value = !isEditPwd.value
  }
</script>

<style lang="scss">
  .user {
    .icon {
      width: 1.4em;
      height: 1.4em;
      overflow: hidden;
      vertical-align: -0.15em;
      fill: currentcolor;
    }
  }
</style>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;

    $box-radius: calc(var(--custom-radius) + 4px);

    .box-style {
      border: 1px solid var(--art-border-color);
      background: var(--art-main-bg-color);
      border-radius: $box-radius;
    }

    .content {
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      .left-wrap {
        width: 450px;
        margin-right: 25px;

        .user-wrap {
          position: relative;
          height: auto;
          padding: 35px 40px;
          overflow: hidden;
          text-align: center;

          .bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 200px;
            object-fit: cover;
          }

          .avatar {
            position: relative;
            z-index: 10;
            width: 80px;
            height: 80px;
            margin-top: 120px;
            object-fit: cover;
            border: 2px solid #fff;
            border-radius: 50%;
          }

          .name {
            margin-top: 20px;
            font-size: 22px;
            font-weight: 400;
          }

          .des {
            margin-top: 20px;
            font-size: 14px;
            color: var(--art-text-gray-600);
          }

          .outer-info {
            width: 300px;
            margin: auto;
            margin-top: 30px;
            text-align: left;

            > div {
              margin-top: 10px;

              span {
                margin-left: 8px;
                font-size: 14px;
              }
            }
          }

          .lables {
            margin-top: 40px;
            padding-bottom: 20px;

            h3 {
              font-size: 15px;
              font-weight: 500;
            }

            > div {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              margin-top: 15px;

              > div {
                padding: 3px 12px;
                margin: 0 10px 10px 0;
                font-size: 12px;
                color: var(--el-color-primary);
                background: var(--el-color-primary-light-9);
                border-radius: 12px;
              }
            }
          }
        }

        .statistics {
          padding: 20px;

          h3 {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 20px;
          }

          .stats-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;

            .stat-item {
              text-align: center;
              padding: 15px;
              background: var(--el-color-primary-light-9);
              border-radius: 8px;

              .number {
                font-size: 24px;
                font-weight: 600;
                color: var(--el-color-primary);
                margin-bottom: 8px;
              }

              .label {
                font-size: 14px;
                color: var(--art-text-gray-600);
              }
            }
          }
        }
      }

      .right-wrap {
        flex: 1;
        overflow: hidden;

        .info {
          .title {
            padding: 15px 25px;
            font-size: 20px;
            font-weight: 400;
            color: var(--art-text-gray-800);
            border-bottom: 1px solid var(--art-border-color);
          }

          .form {
            box-sizing: border-box;
            padding: 30px 25px;

            > .el-row {
              .el-form-item {
                width: calc(50% - 10px);
              }

              .el-input,
              .el-select {
                width: 100%;
              }
            }

            .right-input {
              margin-left: 20px;
            }

            .el-form-item-right {
              display: flex;
              align-items: center;
              justify-content: end;

              .el-button {
                width: 110px !important;
              }
            }
          }
        }
      }
    }
  }

  @media only screen and (max-width: $device-ipad-vertical) {
    .page-content {
      .content {
        display: block;
        margin-top: 5px;

        .left-wrap {
          width: 100%;
        }

        .right-wrap {
          width: 100%;
          margin-top: 15px;
        }
      }
    }
  }
</style>
