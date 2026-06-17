<template>
  <div class="user-login-container">
    <!-- 密码登录 -->
    <template v-if="type == 'password-login'">
      <el-form :ref="(e) => (loginByPassword.formRef = e)" :rules="loginByPassword.rules" :model="loginByPassword.data">
        <el-form-item prop="MobilePhone" style="margin-bottom: 24px">
          <div class="field">
            <el-input size="large" v-model="loginByPassword.data.MobilePhone" placeholder="手机号"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="Password" style="margin-bottom: 24px">
          <div class="field">
            <el-input size="large" v-model="loginByPassword.data.Password" type="password" placeholder="密码"></el-input>
          </div>
        </el-form-item>

        <div class="field" style="margin-bottom: 15px">
          <span class="checkbox-group" style="display: flex; align-items: center">
            <!-- <el-checkbox
                            style="color:#606266"
                            v-model="loginByPassword.data.rememberMe"
                        ></el-checkbox>
                        <span
                            class="text"
                            @click="loginByPassword.data.rememberMe = !loginByPassword.data.rememberMe"
                        >30天内自动登录</span> -->
          </span>
        </div>
        <div class="field">
          <el-button @click="loginByPassword.login" style="width: 100%; height: 20px" type="primary" class="login-btn">登
            录</el-button>
        </div>
      </el-form>
      <div v-if="!hideRegister" class="field toRegister">
        <div class="toRegister" style="font-size: 12px">
          <div>还没有账号？</div>
          <div style="margin-left: 4px">
            <el-button @click="openRegister" size="large" type="text">
              <div style="display: flex; align-items: center; font-size: 12px">
                <div>立即注册</div>
                <div>
                  <img style="margin-left: 13px" src="@/assets/images/vector.svg" />
                </div>
              </div>
            </el-button>
          </div>
        </div>
      </div>
    </template>

    <!-- 验证码登录 -->
    <template v-if="type == 'vercode-login'">
      <el-form :ref="(e) => (loginByVerCode.formRef = e)" :rules="loginByVerCode.rules" :model="loginByVerCode.data">
        <el-form-item prop="MobilePhone" style="margin-bottom: 24px">
          <div class="field">
            <el-input size="large" v-model="loginByVerCode.data.MobilePhone" placeholder="手机号"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="Vercode" style="margin-bottom: 24px">
          <div class="flex">
            <el-input size="large" v-model="loginByVerCode.data.Vercode" placeholder="验证码"
              style="width: 177px"></el-input>
            <el-button @click="loginByVerCode.sendVerCode" :disabled="loginByVerCode.disabledSendBtn"
              class="send-vercode-btn" type="primary" size="mini">
              <template v-if="loginByVerCode.countTime <= 0">发送验证码</template>
              <template v-else>重新发送 ({{ loginByVerCode.countTime }})</template>
            </el-button>
          </div>
        </el-form-item>

        <div class="field" style="margin-bottom: 15px">
          <span class="checkbox-group">
            <!-- <el-checkbox v-model="loginByVerCode.data.rememberMe"></el-checkbox>
                        <span
                            class="text"
                            @click="loginByVerCode.data.rememberMe = !loginByVerCode.data.rememberMe"
                        >30天内自动登录</span> -->
          </span>
        </div>
        <div class="field">
          <el-button @click="loginByVerCode.login"
            style="width: 100%; height: 30px; border-radius: 4px; font-size: 14px" type="primary" class="login-btn">登
            录</el-button>
        </div>
      </el-form>
      <div v-if="!hideRegister" class="field toRegister">
        <div class="toRegister" style="font-size: 12px">
          <div>还没有账号？</div>
          <div style="margin-left: 4px">
            <el-button @click="openRegister" size="large" type="text">
              <div style="display: flex; align-items: center; font-size: 12px">
                <div>立即注册</div>
                <div>
                  <img style="margin-left: 13px" src="@/assets/images/vector.svg" />
                </div>
              </div>
            </el-button>
          </div>
        </div>
      </div>
    </template>

    <!-- 微信登录 -->
    <template v-if="type == 'wechat-login'">
      <div class="wechat-title">
        <div>
          <img src="@/assets/images/login-wechat.svg" />
        </div>
        <div class="wechat-text">微信扫码登录</div>
      </div>
      <div id="wx-login-container"></div>
    </template>

    <div class="switcher">
      <div class="switcher-type" v-if="type != 'password-login'">
        <el-button @click="switchType('password-login')" size="large" type="text">
          <div class="login-type">
            <div class="img">
              <img src="@/assets/images/login-password.svg" />
            </div>
            <div>密码登录</div>
          </div>
        </el-button>
      </div>
      <div class="switcher-type" v-if="type != 'vercode-login'">
        <el-button @click="switchType('vercode-login')" size="large" type="text">
          <div class="login-type">
            <div class="img">
              <img src="@/assets/images/login-vercode.svg" />
            </div>
            <div>验证码登录</div>
          </div>
        </el-button>
      </div>

      <div class="switcher-type" v-if="type != 'wechat-login'">
        <el-button @click="switchType('wechat-login')" size="large" type="text">
          <div class="login-type">
            <div class="img">
              <img src="@/assets/images/login-wechat.svg" />
            </div>
            <div>微信登录</div>
          </div>
        </el-button>
      </div>
    </div>
    <div class="permission">
      点击登录即标识您已同意
      <div>
        <span>
          <el-link @click="openPrivacyPolicy" type="primary">《及时通隐私政策》</el-link>
        </span>
        <span>
          <el-link @click="openUserService" type="primary">《及时通用户服务协议》</el-link>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// 用户登录框 (包含注册)
import {
  computed,
  defineComponent,
  reactive,
  ref,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { ElMessage, ElLoading } from "element-plus";
import { useUserRegisterMobilePhone } from "@/composables/user/userRegister";
import { useRouter } from "vue-router";
import { utils } from "justom-share";
import request from "@/public/request";
import { useStore } from "vuex";
import WxLogin from "@/public/wxLogin";
import env from "@share/env";
import { getElectronAgent } from "@share/agent";
function loginByPasswordRef(store, success) {
  const formRef = ref(null);
  const data = ref({
    MobilePhone: "",
    Vercode: "",
    Password: "",
    LoginByPassword: true,
    rememberMe: false,
  });
  const rules = reactive({
    MobilePhone: [
      { required: true, message: "请输入11位手机号", trigger: "blur" },
      {
        message: "请输入正确的手机号",
        pattern: utils.checkMobilePhoneRegex,
        trigger: "blur",
      },
    ],
    Password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  });

  /**
   * 登录
   */
  async function login() {
    await formRef.value.validate();

    const loading = ElLoading.service({
      lock: true,
    });
    let res = await request.post("/api/AuthUser/Login", {
      ...data.value,
      // 客户端只能登录 公司类型为客户的
      CompanyType: 1,
    });

    if (!res.Status) {
      ElMessage.error(res.Message);
      loading.close();
      return;
    }
    await store.dispatch("auth/setTokenAndGetInfo", res.Data).catch(() => { });
    loading.close();
    if (success) {
      success();
    }
  }

  return reactive({
    formRef,
    data,
    rules,
    login,
  });
}

function loginByVerCodeRef(store, success) {
  const router = useRouter();
  const formRef = ref(null);
  const data = ref({
    MobilePhone: "",
    Vercode: "",
    Password: "",
    LoginByPassword: false,
    rememberMe: false,
  });
  // 是否禁用发送验证码
  const disabledSendBtn = ref(true);

  // 验证码冷却时间
  const countTime = ref(-1);

  const rules = reactive({
    MobilePhone: [
      {
        message: "请输入正确的手机号",
        validator: (rule, value, callback) => {
          if (utils.checkMobilePhone(value)) {
            callback();
            if (disabledSendBtn.value == true && countTime.value < 0) {
              disabledSendBtn.value = false;
            }
          } else {
            callback(new Error("请输入正确的手机号"));
            disabledSendBtn.value = true;
          }
        },
        trigger: "change",
      },
    ],
    Vercode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  });

  // 发送验证码
  async function sendVerCode() {
    if (utils.checkMobilePhone(data.value.MobilePhone) == false) {
      ElMessage.warning("请输入正确的手机号");
      return;
    }

    disabledSendBtn.value = true;

    // 检查手机号是否注册
    let isRegister = await request.get("/api/User/GetUserBaseInfoByMobilePhone", {
      mobilePhone: data.value.MobilePhone,
    });
    if (isRegister.Status == false) {
      // 未注册
      ElMessage.error(isRegister.Message);
      disabledSendBtn.value = false;
    } else {
      // 已注册
      let res = await request.post("/api/UserVerCode/SendVerCode", {
        mobilePhone: data.value.MobilePhone,
        type: 0,
      });
      if (res.Status) {
        ElMessage.success("验证码发送成功");

        countTime.value = 60;
        let intervalId = setInterval(() => {
          countTime.value -= 1;
          if (countTime.value <= 0) {
            clearInterval(intervalId);
            countTime.value = -1;
            // 一分钟后解锁
            disabledSendBtn.value = false;
          }
        }, 1000);
      } else {
        ElMessage.error(res.Message);
        // 出现错误 马上解锁
        disabledSendBtn.value = false;
      }
    }
  }

  /**
   * 登录
   */
  async function login() {
    await formRef.value.validate();

    const loading = ElLoading.service({
      lock: true,
    });

    // 检查手机号是否注册
    let isRegister = await request.get("/api/User/GetUserBaseInfoByMobilePhone", {
      mobilePhone: data.value.MobilePhone,
    });
    if (isRegister.Status == false) {
      // 未注册

      ElMessage.warning(isRegister.Message);
      loading.close();
    } else {
      // 已注册
      let res = await request.post("/api/AuthUser/Login", {
        ...data.value,
        // 客户端只能登录 公司类型为客户的
        CompanyType: 1,
      });

      if (!res.Status) {
        ElMessage.error(res.Message);
        loading.close();
        return;
      }
      await store.dispatch("auth/setTokenAndGetInfo", res.Data).catch(() => { });
      loading.close();
      if (success) {
        success();
      }
    }
  }

  return reactive({
    formRef,
    data,
    rules,
    login,
    sendVerCode,
    disabledSendBtn,
    countTime,
  });
}

export default defineComponent({
  props: {
    hideRegister: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["success"],
  setup(props, context) {
    const store = useStore();

    /*
        password-login 密码登录
        vercode-login 验证码登录
        wechat-login 微信登录
        register 注册
        
        */

    const type = ref("password-login");
    const title = computed(() => {
      let text = "";
      switch (type.value) {
        case "password-login":
          text = "密码登录";
          break;
        case "vercode-login":
          text = "验证码登录";
          break;
        case "wechat-login":
          text = "";
          break;
        case "register":
          text = "手机注册";
          break;
        default:
          break;
      }

      return text;
    });

    async function success() {
      // 登录成功后触发
      await store.dispatch("auth/getCurrentLoggedInfo");
      context.emit("success");
    }

    const loginByPassword = loginByPasswordRef(store, success);
    const loginByVerCode = loginByVerCodeRef(store, success);

    async function switchType(target) {
      type.value = target;
      if (target === "wechat-login") {
        nextTick(async () => {
          let style = `
                    .loginPanel .title{
                        display:none;
                    }
                    .info{
                        display:none;
                    }
                    .qrcode{
                        width:148px !important;
                        height:148px !important;
                    }
                    `;

          let res = await request.get("/api/Wechat/GetWechatConfig");

          // 根据当前页面情况替换https
          if (window.location.protocol == "https:" && res.Host.startsWith("http:")) {
            res.Host = res.Host.replace("http:", "https:");
          }

          // 微信登录
          WxLogin({
            self_redirect: false,
            id: "wx-login-container",
            appid: res.AppId,
            scope: "snsapi_login",
            redirect_uri: res.Host + "/api/AuthUser/WxLoginOrRegister?WxLoginOrRegister=",
            state: "customer",
            style: "",
            href: "data:text/css;base64," + window.btoa(style),
          });
        });
      }
    }

    function openRegister() {
      // let loginWindow = window.open(`${env.host}/#/register`, '', 'width=1440px,height=800px');
      // loginWindow.onbeforeunload = function () {
      //     // 关闭窗口时触发
      //     switchType("password-login")
      // }
      getElectronAgent().ipcRequest("login/openLoginWindow", `${env.host}/#/register`);
    }

    let loginListener = null;
    onMounted(() => {
      // 监听来自main process的登录成功消息
      loginListener = window.$ipc.on("login/loginSuccess", async (event, data) => {
        console.log("received login success message from main process", data);
        await store.dispatch("auth/setTokenAndGetInfo", data).catch(() => { });
        if (success) {
          success();
        }
      });
    });

    onUnmounted(() => {
      // 离开页面的时候取消监听
      if (loginListener != null) {
        loginListener();
      }
    });

    return {
      type,
      title,
      loginByPassword,
      loginByVerCode,
      switchType,
      openRegister,
    };
  },
  methods: {
    openPrivacyPolicy() {
      this.$agent().ipcRequest("window/newExternalWin", {
        url: import.meta.env.VITE_AXIOS_HOST + "/#/agreement/privacyPolicy?fromClient=true",
      });
    },
    openUserService() {
      this.$agent().ipcRequest("window/newExternalWin", {
        url: import.meta.env.VITE_AXIOS_HOST + "/#/agreement/userService?fromClient=true",
      });
    }

  }
});
</script>

<style lang="scss">
.user-login-container {
  .el-dialog__header {
    padding-top: 24px;
    font-size: 20px;
    font-weight: 500;
    color: #3c4144;
    line-height: 28px;
    padding-left: 32px;
    padding-right: 32px;
  }

  .el-dialog__body {
    padding-top: 14px;
    padding-left: 32px;
    padding-right: 32px;
    padding-bottom: 32px;
  }

  .el-input__inner {
    height: 34px;
    background-color: #f5f7fa;
  }
}
</style>
<style lang="scss" scoped>
.field {
  display: flex;
  justify-content: space-between;
}

.flex {
  display: flex;
}

.toRegister {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  line-height: 48px;
  font-size: 12px;
}

.toLogin {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  line-height: 40px;
}

.switcher {
  margin-top: 33px;
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
  width: 140px;
  height: 30px;
}

.login-type {
  height: 16px;
  line-height: 18px;
  display: flex;
  color: #909399;
  margin-right: 10px;

  &:hover {
    color: #409eff;
  }

  .img {
    margin-right: 8px;
  }
}

.main-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  border-radius: 4px;
}

.send-vercode-btn {
  width: 165px;
  margin-left: 8px;
  border-radius: 4px;
  border-radius: 4px;
  font-size: 14px;
}

.login-btn {
  font-size: 14px;
}

.checkbox-group {
  .text {
    cursor: pointer;
    margin-left: 4px;
  }
}

.switcher-type:first-child {
  // margin-right: 34px;
}

#wx-login-container {
  height: 197px;
  text-align: center;
  overflow: hidden;
}

.wechat-title {
  display: flex;
  justify-content: center;
  position: relative;

  // top: 24px;
  // left: 131px;
  img {
    $size: 24px;
    width: $size;
    height: $size;
    margin-top: 2px;
  }

  .wechat-text {
    font-size: 20px;
    color: #3c4144;
    margin-left: 8px;
  }

  .wechat-title-content {
    display: flex;
  }
}

.permission {
  margin-top: 20px;
  color: #A3A6AD;
  font-size: 11px;
  text-align: center;

  :deep(.el-link) {
    font-size: 11px;
  }
}
</style>
