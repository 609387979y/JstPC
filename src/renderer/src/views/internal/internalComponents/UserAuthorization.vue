<template>
<div class="auth-container" v-loading="loading">
  <div v-if="step == 1" class="user-auth">
    <div class="header">
      <div></div>
      <div class="close" @click="closeWin">
        <el-icon>
          <Close></Close>
        </el-icon>
      </div>
    </div>
    <div class="main">
      <div class="title">企业认证</div>
      <div v-if="freight" class="freight-text">完成企业认证后即可查看运价</div>
      <div v-else class="all-text">完成认证即可享受运价查询，舱单服务</div>
      
      <el-form
        :ref="(e) => form.formRef = e"
        :rules="form.rules"
        :model="form.state"
        label-position="top"
      >
        <el-form-item prop="CompanyName" label="公司名称">
          <el-autocomplete
            size="default"
            v-model="form.state.CompanyName"
            :fetch-suggestions="form.querySearch"
            :trigger-on-focus="false"
            placeholder="请输入您的公司名称"
            @select="form.handleSelect"
          />

          <div v-if="form.isSelectedCompany" class="be-exist">
            <span style="font-weight: 600">公司信息确认</span>
             <span>公司名：{{ form.state.choose.CompanyName ?? "" }}</span>
            <span>统一社会信用代码：{{ form.state.choose.BusinessLicense ?? "" }}</span>
            <span>法定代表人：{{ form.state.choose.ContactName ?? "" }}</span>
          </div>
        </el-form-item>
        <el-form-item prop="ChooseRoleList" label="所属职位">
          <el-input size="default" v-model="form.state.ChooseRoleList" placeholder="请输入您所在公司所属职位"></el-input>
        </el-form-item>
        <div style="padding-bottom: 10px;margin-top:48px;font-size: 12px;color: #3C4144;">请确认以上信息为您公司信息，即可进行认证</div>
        <el-button @click="form.submit" style="width: 100%;margin-bottom:48px;" type="primary" size="default">提交</el-button>
      </el-form>
    </div>
    <BaseJstInfoFooter></BaseJstInfoFooter>
  </div>
  <div v-if="step == 2">
    <div class="header">
      <div></div>
      <div class="close" @click="closeWin">
        <el-icon>
          <Close></Close>
        </el-icon>
      </div>
    </div>
    <div style="text-align: center">
      <img src="../../../assets/images/sign.svg" srcset />
    </div>
    <div
      style="font-size: 22px; color: #3c4144; font-weight: 500; padding: 5px 0"
      class="center"
    >加入企业申请提交成功</div>
    <div
      style="color: #969799; font-size: 14px; padding: 5px 0"
      class="center"
    >已通知您所在公司的管理员尽快帮您进行审核...</div>
    <div class="center btn-group">
      <div class="btn">
        <el-button @click="openWebPage('/workbench/personal')" class="btn" type="primary">进入及时通用户中心</el-button>
      </div>
      <div class="btn">
        <el-button @click="closeWin" class="btn">先去逛逛</el-button>
      </div>
      <div class="btn">
        <el-button class="btn" type="text">发起线下申请，由平台销售协助进行申请</el-button>
      </div>
    </div>
    <BaseJstQRCodeFooter></BaseJstQRCodeFooter>
  </div>

  <div v-if="step == 3 || step == 4">
    <div class="header">
      <div></div>
      <div class="close" @click="closeWin">
        <el-icon>
          <Close></Close>
        </el-icon>
      </div>
    </div>
    <div style="text-align: center;font-size: 79px;">
      <el-icon :size="50" color="#67C23A">
        <circle-check-filled />
      </el-icon>
    </div>
    <div
      style="font-size: 22px; color: #67C23A; font-weight: 500; padding: 5px 0"
      class="center"
    >
    <template v-if="step == 3">
       您的企业已经入驻成功！
    </template>
    <template v-else>
    {{$route.query.companyName ?? ''}}
成功邀请您加入企业
    </template>
 
    
    </div>
    <div style="color: #969799; font-size: 14px; padding: 5px 0" class="center">现在开启您新的业务旅程</div>
    <div class="center btn-group">
      <div class="btn">
        <el-button @click="closeWin" class="btn" type="primary">进入及时通</el-button>
      </div>
      <div class="btn">
        <el-button @click="openWebPage('/workbench/personal')" class="btn" type="text">查看企业认证信息</el-button>
      </div>
    </div>
    <BaseJstQRCodeFooter></BaseJstQRCodeFooter>
  </div>
</div>
</template>

<script lang="ts">
import { getElectronAgent } from "@share/agent";
import { Close } from "@element-plus/icons";
import { defineComponent, reactive, ref, computed, onMounted } from "vue";
import BaseJstInfoFooter from "./BaseJstInfoFooter.vue";
import BaseJstQRCodeFooter from "./BaseJstQRCodeFooter.vue";
import request from "@/public/request";
import { ElMessage } from "element-plus"
import { useRoute } from "vue-router"
import { CircleCheckFilled } from "@element-plus/icons"
import { useStore } from "vuex";


interface SearchCompanyItem {
  // 公司名
  value: string,
  // 公司名
  CompanyName: string,
  // id
  Id: number,
  // 统一社会信用代码
  BusinessLicense?: string,
  // 联系人名称
  ContactName?: string
}

function useForm(toSuccess: Function) {

  const state = reactive({
    // 公司名称
    CompanyName: "",
    // 职位
    ChooseRoleList: "",

    choose: <SearchCompanyItem>{
      value: "",
      CompanyName: "",
      Id: 0,
    }
  })

  const rules = {
    CompanyName: [
      {
        required: true,
        message: "请输入公司名称",
        trigger: "blur",
      },
    ],
    ChooseRoleList: [
      {
        required: true,
        message: "请输入所在公司所属职位",
        trigger: "blur",
      },
    ],
  };
  const formRef = ref<any>(null);

  // 是否选中了公司
  const isSelectedCompany = computed(() => {
    return state.CompanyName != "" && state.choose.CompanyName === state.CompanyName;
  });

  // 查询
  async function querySearch(queryString: string, cb: Function) {
    let res = await request.get("/api/Company/SearchCompany", {
      keyword: queryString
    })
    res = res.map((item: any) => {
      return {
        value: item.CompanyName,
        CompanyName: item.CompanyName,
        Id: item.Id
      }
    })
    // 默认选择第一个公司
    // if(queryString ==)
    let existCompany = res.find(t=>t.CompanyName == queryString);
    if(existCompany){
      handleSelect(existCompany)
    }
    cb(res)
  }
  // 选择公司
  async function handleSelect(item: SearchCompanyItem) {
    let res = await request.get("/api/Company/GetCompanyInfo", { companyId: item.Id })
    if (res.Status) {
      state.choose = item
      state.choose.BusinessLicense = res.Data.BusinessLicense
      state.choose.ContactName = res.Data.ContactName
    }
  }




  async function submit() {
    await formRef.value.validate();
    let res: { Status: boolean, Message: string } | null = null;

    if (isSelectedCompany.value) {
      // 绑定企业
      res = await request.post("/api/CompanyAudit/SubmitBindCompany", {
        CompanyId: state.choose.Id,
        // 岗位
        ChooseRoleList: state.ChooseRoleList
      })
    } else {
      // 企业入驻
      res = await request.post("/api/CompanyAudit/SubmitCreateCompany", {
        // 公司名称
        CompanyName: state.CompanyName,
        // 岗位
        ChooseRoleList: state.ChooseRoleList,
        // 客户
        CompanyType: 1
      })
    }

    if (res == null) {
      ElMessage.error("出现未知错误")
      return
    }

    if (res.Status) {
      // 成功
      toSuccess();
    } else {
      ElMessage.error(res.Message)
    }
  }


  return reactive({
    state,
    rules,
    querySearch,
    handleSelect,
    isSelectedCompany,
    formRef,
    submit
  })
}





export default defineComponent({
  components: { Close, BaseJstInfoFooter, BaseJstQRCodeFooter, CircleCheckFilled },
  setup() {
    const agent = getElectronAgent();
    const store = useStore()


    let step = ref(1);
    function closeWin() {
      if (agent) {
        window.close();
      }
    }
    function toSuccess() {
      step.value = 2;
    }


    const form = useForm(toSuccess);


    async function openWebPage(url: string) {
      let res = await request.get("/api/page/AuthRedirect", {
        url: url
      })
      agent?.ipcRequest("window/externalUrl", res)
    }
    const loading = ref(true)
    async function isCertificat(){
      loading.value=true
      let auditRes = await request.get("/api/CompanyAudit/CheckHasRunningAudit");
      loading.value=false
      if (auditRes.Status) {
      toSuccess()
      
    }
    }

    const freight = ref(false)
    const route = useRoute()
    onMounted(() => {
      if (route.query.success == "0") {
        step.value = 3;
      } else if (route.query.success == "1") {
        step.value = 4;
      }
      if(route.query.type == 'freight'){
        freight.value = true
      }
      isCertificat()
    })


    return {
      closeWin,
      form,
      step,
      freight,
      loading,
      openWebPage
    };
  },
});
</script>

<style lang="scss" scoped>
.auth-container{
  padding: 16px;
}
.user-auth {
  width: 100%;
  height: 100%;
  :deep(.el-autocomplete) {
    width: 100%;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  -webkit-app-region: drag;
  .close {
    cursor: pointer;
    -webkit-app-region: no-drag;
    font-size: 12px;
  }
}
.title {
  font-size: 22px;
  font-weight: 400;
  padding: 0 0 8px 0;
}
.main {
  padding: 16px;
}
.be-exist {
  background-color: #f2f3f5;
  padding: 10px;
  margin-top: 10px;
  span {
    display: block;
    line-height: 24px;
    height: 24px;
  }
}
.btn-group {
  margin: 0 auto;
  width: 200px;
  .btn {
    padding: 5px 0;
    width: 100%;
  }
}
.center {
  margin: 0 auto;
  text-align: center;
}
.freight-text{
  color:#fd953e;
  margin-bottom:32px
}
.all-text{
  margin-bottom:32px
}
// .auth-input{
//   ::deep(.el-input--small .el-input__inner){
//     height: 40px;
//   }
// }
</style>