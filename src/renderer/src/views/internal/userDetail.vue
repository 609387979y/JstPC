<template>
  <JstDetailHeader>
    <template #title>
      <div class="header-title">
        用户名称：{{ state.info.RealName }}
        <div class="header-status">
          身份认证：
          <div class="tableStatusBox" :class="setStatusClass(store.state.auth.isUserAuth, 1)">
            <div class="tablecircle"></div>
            <div class="tableStatusText">{{ setStatusClass(store.state.auth.isUserAuth, 2) }}</div>
          </div>
        </div>
        <div class="header-status">
          企业认证：
          <div class="tableStatusBox " :class="setStatusClass(state.companyStatus, 1)">
            <div class="tablecircle"></div>
            <div class="tableStatusText">{{ setStatusClass(state.companyStatus, 2) }}</div>
          </div>
        </div>
      </div>
    </template>
    <template #btns>
    </template>
    <div>
      <el-row>
        <!-- <el-col :span="8">
          <JstFormField main="value">
            <template #title>创建人：</template>
            {{ state.info.RealName }}
          </JstFormField>
        </el-col> -->
        <el-col :span="8">
          <JstFormField main="value">
            <template #title>入驻时间：</template>
            {{ state.info.CreateTime }}
          </JstFormField>
        </el-col>
      </el-row>
    </div>
    <div style="width: 100%;height: 20px;"></div>
  </JstDetailHeader>
  <div class="tabs-box">
    <el-tabs v-model="state.activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="基本资料" name="0"></el-tab-pane>
      <el-tab-pane label="安全认证" name="1"></el-tab-pane>
      <el-tab-pane label="账号绑定" name="2"></el-tab-pane>
    </el-tabs>
  </div>
  <div class="page-container" v-show="state.activeName == 0">
    <JstCardLayout border>
      <template #title>身份资料
      </template>
      <el-row>
        <div class="title-btn">
          <!-- <el-button v-if="!store.state.auth.isUserAuth" type="text" @click="openUserAuth">职业认证</el-button> -->
          <el-button type="text" @click="toEditUserInfo">编辑</el-button>
        </div>
      </el-row>
      <el-row style="margin-top: 14px;background-color:#f7f8fa;padding: 10px 5px 5px;">
        <el-col :span="24">
          <JstFormField>
            <template #title>用户Id：</template>
            {{ $utils.formatEmptyString(state.info.Id) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>用户号码：</template>
            {{ $utils.formatEmptyString(state.info.MobilePhone) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>姓名：</template>
            {{ $utils.formatEmptyString(state.info.RealName) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>用户企业：</template>
            {{ $utils.formatEmptyString(state.info.PersonnelSource) }}
          </JstFormField>
        </el-col>

        <el-col :span="12">
          <JstFormField>
            <template #title>邮箱：</template>
            {{ $utils.formatEmptyString(state.info.Email) }}
          </JstFormField>
        </el-col>

        <!-- <el-col :span="24">
          <JstFormField>
            <template #title>网址：</template>
            {{ $utils.formatEmptyString(state.info.CompanyCode) }}
          </JstFormField>
        </el-col>
        <el-col :span="24">
          <JstFormField>
            <template #title>地址：</template>
            {{ $utils.formatEmptyString(state.info.CompanyCode) }}
          </JstFormField>
        </el-col> -->
        <el-col :span="12">
          <JstFormField>
            <template #title>邀请人：</template>
            {{ $utils.formatEmptyString(state.info.InviterUserName) }}
            <span v-if="state.info.InviterUserMobilePhone">
              （{{ state.info.InviterUserMobilePhone }}）
            </span>
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>邀请人所在用户企业：</template>
            {{ $utils.formatEmptyString(state.info.InviterUserConmpanyName) }}
          </JstFormField>
        </el-col>
        <el-col :span="24">
          <JstFormField>
            <template #title>头像：</template>
            <el-image v-if="state.info.Avatar" style="width: 100px; height: 100px" :src="state.info.Avatar"
              :preview-src-list="[state.info.Avatar]"></el-image>
            <div class="no-img" v-else>
              暂未上传
            </div>
          </JstFormField>
        </el-col>
      </el-row>

    </JstCardLayout>
    <JstCardLayout border>
      <template #title>职业认证资料
      </template>
      <el-row>
        <div class="title-btn">
          <el-button v-if="!store.state.auth.isUserAuth" type="text" @click="openUserAuth">职业认证</el-button>
        </div>
      </el-row>
      <el-row style="margin-top: 14px;background-color:#f7f8fa;padding: 10px 5px 5px;">
        <el-col :span="12">
          <JstFormField>
            <template #title>认证企业：</template>
            {{ $utils.formatEmptyString(state.payPlanInfo.SubmitCompanyName) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>认证姓名：</template>
            {{ $utils.formatEmptyString(state.payPlanInfo.SubmitRealName) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>认证手机：</template>
            {{ $utils.formatEmptyString(state.payPlanInfo.SubmitMobilePhone) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>认证电话：</template>
            {{ $utils.formatEmptyString(state.payPlanInfo.SubmitTelephone) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>认证邮箱：</template>
            {{ $utils.formatEmptyString(state.payPlanInfo.SubmitEmail) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>认证职位：</template>
            {{ $utils.formatEmptyString(state.payPlanInfo.SubmitPosition) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>认证网址：</template>
            {{ $utils.formatEmptyString(state.payPlanInfo.SubmitWebsite) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>认证地址：</template>
            {{ $utils.formatEmptyString(state.payPlanInfo.SubmitAddress) }}
          </JstFormField>
        </el-col>
        <el-col :span="24">
          <JstFormField>
            <template #title>名片：</template>
            <el-image v-if="state.payPlanInfo.SubmitBusinessCardUrl" style="width: 100px; height: 100px"
              :src="state.payPlanInfo.SubmitBusinessCardUrl"
              :preview-src-list="[state.payPlanInfo.SubmitBusinessCardUrl]"></el-image>
            <div class="no-img" v-else>
              暂未上传
            </div>
          </JstFormField>
        </el-col>
      </el-row>

    </JstCardLayout>
    <JstCardLayout border>
      <template #title>企业认证资料</template>
      <el-row>
        <div class="title-btn">
          <el-button v-if="!state.hasCompany" type="text" @click="openUserCompany">企业认证</el-button>
          <el-button v-if="state.isCompanyAudit" type="text" @click="openCompanyAudit">认证进度</el-button>
          <!-- <el-button v-if="isAdmin" type="text" @click="toEditCompanyInfo">跳转企业管理编辑</el-button> -->
        </div>
      </el-row>
      <el-row style="margin-top: 14px;background-color:#f7f8fa;padding: 10px 5px 5px;">
        <el-col :span="12">
          <JstFormField>
            <template #title>企业名称：</template>
            {{ $utils.formatEmptyString(state.companyInfo.CompanyName) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>企业简称：</template>
            {{ $utils.formatEmptyString(state.companyInfo.CompanyShortName) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>企业代码：</template>
            {{ $utils.formatEmptyString(state.companyInfo.CompanyCode) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>企业Id：</template>
            {{ $utils.formatEmptyString(state.companyInfo.CompanyIdentifier) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>社会统一信用代码：</template>
            {{ $utils.formatEmptyString(state.companyInfo.BusinessLicense) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>营业执照有效期：</template>
            {{ $utils.formatEmptyString(state.companyInfo.BusinessLicenseRange) }}
          </JstFormField>
        </el-col>

        <el-col :span="12">
          <JstFormField>
            <template #title>企业法人：</template>
            {{ $utils.formatEmptyString(state.companyInfo.BusinessCorporation) }}
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>法人身份证：</template>
            {{ $utils.formatEmptyString(state.companyInfo.BusinessCorporationIdNo) }}
          </JstFormField>
        </el-col>

        <el-col :span="12">
          <JstFormField>
            <template #title>公司联系人：</template>
            {{ $utils.formatEmptyString(state.companyInfo.ContactName) }}&nbsp;&nbsp;&nbsp;({{
              $utils.formatEmptyString(state.companyInfo.ContactMobilePhone) }})
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>联系人邮箱：</template>
            {{ $utils.formatEmptyString(state.companyInfo.ContactMail) }}
          </JstFormField>
        </el-col>

        <el-col :span="12">
          <JstFormField>
            <template #title>企业地址：</template>
            {{ $utils.formatEmptyString(state.companyInfo.Address) }}
          </JstFormField>
        </el-col>
        <el-col>
          <JstFormField>
            <template #title>管理员名称：</template>
            {{ $utils.formatEmptyString(state.companyInfo.AdminName) }}&nbsp;&nbsp;&nbsp;({{
              $utils.formatEmptyString(state.companyInfo.AdminMobilePhone) }})
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>企业Logo：</template>
            <el-image v-if="state.companyInfo.CompanyLogo" style="width: 100px; height: 100px;border-radius: 50%;"
              :src="state.companyInfo.CompanyLogo" :preview-src-list="[state.companyInfo.CompanyLogo]"></el-image>
            <div class="no-img-circle" v-else>
              暂未上传
            </div>
          </JstFormField>
        </el-col>
        <el-col :span="12">
          <JstFormField>
            <template #title>营业执照：</template>
            <el-image v-if="state.companyInfo.BusinessLicenseImg" style="width: 100px; height: 100px"
              :src="state.companyInfo.BusinessLicenseImg"
              :preview-src-list="[state.companyInfo.BusinessLicenseImg]"></el-image>
            <div class="no-img" v-else>
              暂未上传
            </div>
          </JstFormField>
        </el-col>
      </el-row>
    </JstCardLayout>
  </div>
  <JstCardLayout v-show="state.activeName == 1">
    <SecurityConfig></SecurityConfig>
  </JstCardLayout>
  <JstCardLayout v-show="state.activeName == 2">
    <UserBind></UserBind>
  </JstCardLayout>
  <UserInfoDialog ref="userInfoDialogRef" @getInfo="getInfo"></UserInfoDialog>
  <CustomerInfoDialog ref="customerInfoDialogRef" @getInfo="getCompanyInfo"></CustomerInfoDialog>
</template>
<script setup>
import { defineComponent, ref, reactive, computed, onMounted, toRaw, nextTick, } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
// import 'ant-design-vue/lib/steps/style/index.css'
// import { Steps, Step } from "ant-design-vue"
import CustomerInfoDialog from "./components/CustomerInfoDialog.vue"
import { useTableOption } from "justom-share";
import request from "@/public/request";
import { ElMessage, ElMessageBox } from "element-plus";
import UserInfoDialog from './components/userInfoDialog.vue'
import SecurityConfig from "@/components/user/userSetting/SecurityConfig.vue"
import UserBind from "@/components/user/userSetting/UserBind.vue"

const route = useRoute();
const router = useRouter();
const store = useStore();

const state = reactive({
  id: 0,
  info: {},
  companyInfo: {},
  CompanyId: 0,
  activeName: 0,
  tableData: [],
  listInfo: {},
  userStatus: null,
  companyStatus: null,
  hasCompany: false,
  CompanyAuditInfo: null,
  auditSteps: {
    current: 0,
    steps: []
  },
  auditStepsInfo: {},
  isCompanyAudit: false,
  openCompanyAuditShow: false,
  payPlanInfo: {},
})
const customerInfoDialogRef = ref()
const userInfoDialogRef = ref()
const openCompanyAudit = () => {
  customerInfoDialogRef.value.open(state.auditStepsInfo)
  // state.openCompanyAuditShow = true
}
const toEditCompanyInfo = () => {
  // 跳转企业管理
  router.push("/workbench/userCompanyManage");
}
const toEditUserInfo = () => {
  userInfoDialogRef.value.open(state.info)
}
const getInfo = async () => {
  // let res = await request.get("/api/CurrentUser/Current");
  let res = await request.get("/api/User/GetUserInviter");
  state.info = res.Data || {}
}
const getCompanyAuditInfo = async () => {
  const res = await request.get("/api/CompanyAudit/SubmitUserCompanyData", {
    UserId: state.info.Id, // 使用实际的用户ID，测试时使用  ||state.info.Id
  });
  if (res.Status) {
    state.isCompanyAudit = true
    state.auditStepsInfo = res.Data
    // state.auditSteps = processAuditData(res.Data);
  } else {
    state.isCompanyAudit = false
  }
}
const GetCurrentUserPayPlan = async () => {
  const res = await request.get("/api/PayPlan/GetCurrentUserPayPlan", {
    UserId: state.info.Id,
  });
  state.payPlanInfo = res.Data || {}
}

// 处理审核数据，生成步骤信息
const processAuditData = (auditData) => {
  const stepNames = ['提交申请', '平台审核', '设置员工信息', '完成'];
  const steps = stepNames.map((name, index) => {
    const auditItem = auditData.find(item => item.StepIndex === index);

    if (auditItem) {
      return {
        title: name,
        status: auditItem.Pass ? 'finish' : 'error',
        description: auditItem.description,
        time: `${auditItem.Pass === false ? '已驳回' : ''} ${auditItem.EventTime}`,
        Pass: auditItem.Pass
      };
    } else {
      return {
        title: name,
        status: 'wait',
        description: '',
        time: ''
      };
    }
  });

  // 计算当前进度
  let currentStep = 0;
  const sortedAuditData = [...auditData].sort((a, b) => a.StepIndex - b.StepIndex);

  for (let item of sortedAuditData) {
    if (item.Pass) {
      currentStep = item.StepIndex + 1;
    } else {
      // 如果有驳回的步骤，当前步骤就是驳回的那一步
      currentStep = item.StepIndex;
      break;
    }
  }

  // 如果所有步骤都通过了，检查是否已完成
  if (currentStep >= stepNames.length) {
    currentStep = stepNames.length - 1;
  }

  return {
    current: currentStep,
    steps: steps
  };
}
// 获取用户状态和企业状态
/* const getUserAndCompanyStatus = async () => {
  try {
    const [userStatusRes, companyStatusRes] = await Promise.all([
      request.get("/api/CurrentUser/IsPayPlanInfo", { UserId: state.info.Id }),
      request.get("/api/CurrentEmployee/Current")
    ]);
    // 用户状态：res.Data是布尔值
    state.userStatus = userStatusRes ? true : false;
    // 企业状态：根据res.Data是否有值来赋值
    state.companyStatus = companyStatusRes.Data ? true : false;
  } catch (error) {
    state.userStatus = null;
    state.companyStatus = null;
  }
} */
const getUserAndCompanyStatus = async () => {
  try {
    const res = await request.get('/api/CurrentEmployee/Current');
    state.companyStatus = Boolean(res?.Data); // 直接赋值
  } catch {
    state.companyStatus = null;
  }
};
const employee = computed(() => {
  if (store.state.auth.employee) {
    return store.state.auth.employee;
  } else {
    return {};
  }
});
const getCompanyInfo = async () => {
  const res = await request.get("/api/Company/GetCompanyInfo", {
    companyId: employee.value.CompanyId,
  });
  state.companyInfo = res.Data || {};
}
const openUserAuth = async () => {
  const haswAuth = await store.dispatch("auth/getUserAuth")
  if (haswAuth) {
    ElMessage.warning("您已经完成职业认证，无需再次认证")
    return
  }
  await store.dispatch("payplan/openPlanOptionDialog", 'user');
}
const openUserCompany = async () => {
  state.hasCompany = await store.dispatch("auth/checkAndTryChooseEmployee")
  if (state.hasCompany) {
    ElMessage.warning("您已经完成企业认证，无需再次认证")
    return
  }
  await store.dispatch("payplan/openPlanOptionDialog", 'company');
}
// 当前员工是否是子管理员
const isAdmin = computed(() => store.getters["auth/isAdmin"]);
const setStatusClass = (i, type) => {
  let str = "";
  if (type == 1) {
    switch (i) {
      case false:
        str = "geryStatus";
        break;
      case true:
        str = "blueStatus";
        break;
      default:
        str = "geryStatus";
        break;
    }
    return str;
  }
  if (type == 2) {
    switch (i) {
      case false:
        str = "未认证";
        break;
      case true:
        str = "已认证";
        break;
      default:
        str = "未认证";
        break;
    }
    return str;
  }
}
onMounted(async () => {
  store.dispatch("auth/getUserAuth")
  state.hasCompany = await store.dispatch("auth/checkAndTryChooseEmployee");
  await getInfo()
  await getCompanyInfo()
  await getUserAndCompanyStatus()
  await getCompanyAuditInfo()
  await GetCurrentUserPayPlan()
})
</script>
<style lang="scss" scoped>
.header-title {
  display: flex;
  align-items: center;

  .header-status {
    font-size: 12px;
    display: flex;
    margin-left: 10px;
  }

  .edit-Btn {
    margin-left: 10px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #3B78FF;
    color: #3B78FF;
    height: 20px;
    line-height: 20px;
    padding: 0px 2px;
  }

  .company-status {
    margin-left: 10px;
    display: flex;
    align-items: center;
    font-size: 14px;

    span {
      height: 20px;
      line-height: 20px;
      padding: 2px 5px;
      border: 1px solid;
      margin-left: 5px;
    }
  }
}

:deep(.el-table__header) {
  th {
    background-color: #f7f8fa;
  }
}

.el-col {
  margin-bottom: 10px;
}

.tableStatusBox {
  display: flex;
  align-items: center;

  .tablecircle {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 5px;
  }

  .tableStatusText {
    color: rgba(0, 0, 0, 0.85);
    font-size: 12px;
    letter-spacing: 0px;
  }

  &.noStatus {
    display: none;
  }

  &.geryStatus {
    .tablecircle {
      background: rgba(217, 217, 217, 1);
    }
  }

  &.allgeryStatus {
    .tablecircle {
      background: rgba(216, 216, 216, 1);
    }

    .tableStatusText {
      color: rgba(150, 151, 153, 0.85);
    }
  }

  &.blueStatus {
    .tablecircle {
      background: rgba(59, 120, 255, 1);
    }
  }

  &.redStatus {
    .tablecircle {
      background: rgba(255, 0, 0, 1);
    }
  }

  &.deepgeryStatus {
    .tablecircle {
      background: rgba(150, 151, 153, 1);
    }
  }

  &.orangeStatus {
    .tablecircle {
      background: rgba(249, 168, 38, 1);
    }
  }

  &.greenStatus {
    .tablecircle {
      background: rgba(121, 180, 60, 1);
    }
  }
}

.tabs-box {
  padding: 0 33px;
  margin-top: -40px;
}

.title-btn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-top: -35px;

  .el-button {
    font-size: 14px;
  }
}

.audit-progress-container {
  padding: 0 33px;
}

.step-description {
  width: 200px;
  transform: translateX(-35px);
}
</style>