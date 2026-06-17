<template>
  <!-- 用户认证/未认证页面 -->
  <div class="user-info">
    <div :class="user.isEmployeeLogin ? 'auth-bg-yes' : 'auth-bg-no'" class="header">
      <!-- <span @click="user.logout" class="logout">退出</span>
      <el-space size="large">
        <div>
          <el-avatar :src="user.userInfo.Avatar" class="avatar" :size="36">
            <img src="@/assets/default-avatar.svg" />
          </el-avatar>
        </div>
        <div>
          <div>
            <span style="
                color: #3c4144;
                font-size: 14px;
                font-weight: 500;
                margin-right: 5px;
              ">{{ user.userInfo.RealName }}</span>
            <span v-if="user.isEmployeeLogin === false" class="user-auth-no">账号未认证</span>
          </div>
          <div v-if="user.isEmployeeLogin">
            <span style="font-size: 12px; color: #969799; text-align: left">{{ user.employee.CompanyName }}</span>
          </div>
          <div v-else>
            <span style="font-size: 12px; color: #969799; text-align: left">暂未入驻企业</span>
            &ensp;
            <span @click="user.certification.toUserAuth" style="
                color: #409eff;
                font-size: 12px;
                text-decoration: underline;
                cursor: pointer;
              ">去认证</span>
          </div>
        </div>
      </el-space>
      <div class="residue">
        <span style="color: #606266">及时币余额：</span>
        <span style="color: #ec3333; font-size: 28px; font-weight: 500">{{ wallet.balance }}</span>
        <span @click="openWebPageAndCheck('recharge')" class="pay-btn">充值</span>
      </div> -->
    </div>

    <div class="main">
      <el-avatar :size="32" :src="user.userInfo.Avatar">
        <img src="@/assets/default-avatar.svg" />
      </el-avatar>
      <!-- <el-row>
        <el-col :span="6">
          <div @click="openWebPage('personal')" class="exe-btn">
            <div class="exe-btn-circle">
              <el-icon>
                <UserFilled />
              </el-icon>
            </div>
            <div class="btn-text">个人中心</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div @click="openWebPageAndCheck('companySignAuth')" class="exe-btn">
            <div class="exe-btn-circle">
              <el-icon>
                <OfficeBuilding />
              </el-icon>
            </div>
            <div class="btn-text">企业认证</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div @click="openWebPageAndCheck('userWallet')" class="exe-btn">
            <div class="exe-btn-circle">
              <el-icon>
                <CreditCard />
              </el-icon>
            </div>
            <div class="btn-text">充值记录</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div @click="openWebPageAndCheck('userBill')" class="exe-btn">
            <div class="exe-btn-circle">
              <el-icon>
                <ShoppingCart />
              </el-icon>
            </div>
            <div class="btn-text">消费记录</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div @click="openInternalUrl('/system/message')" class="exe-btn">
            <div class="exe-btn-circle">
              <el-icon>
                <BellFilled />
              </el-icon>
            </div>
            <div class="btn-text">消息中心</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div @click="openInternalUrl('/user/setting')" class="exe-btn">
            <div class="exe-btn-circle">
              <el-icon>
                <Setting />
              </el-icon>
            </div>
            <div class="btn-text">账号设置</div>
          </div>
        </el-col>
      </el-row> -->
    </div>
    <!-- <div class="footer">
      <div @click="openExternalUrl('http://www.jstower.cn/')" class="footer-btn">
        及时通官网
        <div class="first"></div>
      </div>
      <div @click="openExternalUrl('http://www.jstower.cn/#/manageLogin')" class="footer-btn">我是供应商</div>
    </div> -->
  </div>
</template>

<script>
import { computed, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  OfficeBuilding,
  CreditCard,
  UserFilled,
  ShoppingCart,
  BellFilled,
  Setting,
} from "@element-plus/icons";
import { useCompanyCertification } from "@/composables/user/certification"
import { ElMessage } from "element-plus";
import request from "@/public/request"
import { getElectronAgent } from "@share/agent";
import { useWallet } from "@/composables/pay/useWallet"


function useUser() {
  const store = useStore();
  const router = useRouter();
  const agent = getElectronAgent()
  const certification = useCompanyCertification();
  const userInfo = computed(() => {
    if (store.state.auth.user) {
      return store.state.auth.user;
    } else {
      return {};
    }
  });

  const employee = computed(() => {
    if (store.state.auth.employee) {
      return store.state.auth.employee;
    } else {
      return {};
    }
  });

  // 是否登录了员工账号
  const isEmployeeLogin = computed(() => {
    if (store.state.auth.employee) {
      return true;
    } else {
      return false;
    }
  });


  /**
   * 登出
   */
  async function logout() {
    agent.ipcRequest("login/logout")
    await store.dispatch("auth/logout");
    // 返回到登录页
    router.replace("/");
  }

  onMounted(() => {
    store.dispatch("auth/getCurrentUserInfo");
  });

  return reactive({
    userInfo,
    logout,
    isEmployeeLogin,
    employee,
    certification
  });
}
export default {
  components: {
    CreditCard,
    OfficeBuilding,
    UserFilled,
    ShoppingCart,
    BellFilled,
    Setting,
  },
  setup() {
    const user = useUser();
    const agent = getElectronAgent();
    const wallet = useWallet()
    const store = useStore();
    async function openWebPage(urlType) {
      // let res = await request.get("/api/page/AuthRedirect", {
      //   url: url
      // })
      // agent?.ipcRequest("external/external", `/ExternalUseCenter?url=${encodeURIComponent(res)}`)
      if (urlType == 'recharge') {
        agent?.ipcRequest("external/external", `/rechargeWeb?type=${urlType}`)
        return
      }

      agent?.ipcRequest("external/external", `/userCenterWeb?type=${urlType}`)
      // store.commit("externalUrl/setUserCenterUrl", 'http://localhost:3001/#/workbench/personal')
      // store.dispatch("externalUrl/setUserCenter",'http://localhost:3001/#/workbench/personal')

      //  agent?.ipcRequest("external/external", `/ExternalUseCenter?url=${encodeURIComponent('http://localhost:3001/#/workbench/personal')}`)
    }
    // async function openWebPage(url) {
    //   let res = await request.get("/api/page/AuthRedirect", {
    //     url: url
    //   })
    //   agent?.ipcRequest("external/external", `/ExternalUseCenter?url=${encodeURIComponent(res)}`)
    // }


    async function openWebPageAndCheck(url) {
      if (user.isEmployeeLogin) {
        openWebPage(url)
      } else {
        ElMessage.warning('请先进行企业认证')
        certification.toUserAuth();
      }
    }

    function openExternalUrl(url) {
      agent.ipcRequest("window/externalUrl", url);
    }
    function openInternalUrl(url) {
      agent.ipcRequest("window/internalUrl", url);
    }

    return {
      user,
      openWebPage,
      openWebPageAndCheck,
      openInternalUrl,
      wallet,
      openExternalUrl
    };
  },
};
</script>

<style lang="scss" scoped>
.user-info {
  width: 100%;
}

.header {
  padding: 15px;
  box-sizing: border-box;
}

.auth-bg-yes {
  background: linear-gradient(#ffe9b7, #feedc8, #ffe9b7);
}

.auth-bg-no {
  background-color: #e5f0ff;
}

.user-auth-no {
  display: inline-block;
  background: linear-gradient(#ffffff, #e6e6e6);
  color: #969799;
  padding: 2px 8px;
  border-radius: 10px;
}

.logout {
  cursor: pointer;
  float: right;
}

.main {
  padding: 15px 15px 0 15px;
  box-sizing: border-box;
}

.exe-btn {
  margin: 0 auto;
  width: 48px;
  margin-bottom: 15px;
  cursor: pointer;

  .exe-btn-circle {
    margin: 0 auto;

    width: 36px;
    height: 36px;
    border-radius: 18px;
    border: 1px solid #dcdfe6;
    background-color: #f8f8f8;
    line-height: 36px;
    text-align: center;
  }

  .btn-text {
    font-size: 12px;
    color: #969799;
    letter-spacing: -0.86px;
    font-weight: 400;
    padding: 5px 0;
  }
}

.footer {
  border-top: 1px solid #e4e7ed;
  font-size: 12px;

  .footer-btn {
    display: inline-block;
    width: 50%;
    text-align: center;
    height: 49px;
    line-height: 49px;
    cursor: pointer;
    position: relative;
  }

  .footer-btn .first {
    height: 28px;
    width: 100%;
    position: absolute;
    top: 10px;

    border-right: 1px solid #e4e7ed;
  }
}

.residue {
  padding: 15px 0;
  width: 100%;
  line-height: 32px;
  position: relative;

  .pay-btn {
    display: inline-block;
    width: 61px;
    height: 29px;
    line-height: 29px;
    text-align: center;
    border-radius: 16px;
    background: linear-gradient(#74cdff, #409eff);
    color: #ffffff;
    position: absolute;
    right: 0;
    bottom: 19px;

    cursor: pointer;
  }
}
</style>