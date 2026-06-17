<template>
  <div class="entry" v-if="showLogin">
    <div class="header">
      <div class="logo">
        <img src="@/assets/logo.png" />
      </div>
      <div class="drag">

      </div>
      <div>
        <div class="window-btns">
          <div @click="windowOpt('min')" class="btns">
            <el-icon style="font-size:20px">
              <minus />
            </el-icon>
          </div>
          <div @click="windowOpt('close')" class="btns">
            <el-icon style="font-size:20px">
              <Close />
            </el-icon>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="ad">

        <el-carousel arrow="always" height="360px">
          <el-carousel-item>
            <div class="ad-item">
              <div class="text">
                <div class="main">整箱运价</div>
                <div class="sub">覆盖国际物流海运整箱优势航线资源</div>
              </div>
              <img src="@/assets/login-ad/整箱运价.png" />
            </div>

          </el-carousel-item>
          <el-carousel-item class="ad-item">
            <div class="ad-item">
              <div class="text">
                <div class="main">现舱特价</div>
                <div class="sub">连接订舱货代现舱资源，提供注册会员服务</div>
              </div>
              <img src="@/assets/login-ad/现舱特价.png" />
            </div>


          </el-carousel-item>
          <el-carousel-item class="ad-item">
            <div class="ad-item">
              <div class="text">
                <div class="main">船期查询</div>
                <div class="sub">覆盖国际物流海运整箱优势航线资源</div>
              </div>
              <img src="@/assets/login-ad/船期查询.png" />
            </div>

          </el-carousel-item>
          <el-carousel-item class="ad-item">
            <div class="ad-item">
              <div class="text">
                <div class="main">货箱跟踪</div>
                <div class="sub">全球数据源获取，提供订阅查询服务</div>
              </div>
              <img src="@/assets/login-ad/货箱跟踪.png" />
            </div>
          </el-carousel-item>
        </el-carousel>

      </div>
      <div class="login-container">
        <div class="login-title">{{ login.title }}</div>
        <div class="login">
          <UserLogin :ref="(r) => login.loginRef = r" @success="login.successEvent"></UserLogin>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, pushScopeId } from "vue"
import { useRouter } from "vue-router"
import UserLogin from "@/components/login/UserLogin.vue"
import { useStore } from "vuex"
import { ElLoading } from "element-plus"
import { getElectronAgent } from "@share/agent"
import { Minus, Close } from "@element-plus/icons"
function useLogin() {

  /*
      password-login 密码登录
      vercode-login 验证码登录
      wechat-login 微信登录
      register 注册
  */
  const router = useRouter();
  const loginRef = ref(null);

  const type = ref("password-login")

  const title = computed(() => {
    if (loginRef.value == null) {
      return "";
    }
    return loginRef.value.title;
  });


  function successEvent() {


    router.push("/internal/home")


  }

  return reactive({
    type,
    title,
    loginRef,
    successEvent
  })
}

export default defineComponent({
  components: {
    UserLogin,
    Minus,
    Close
  },
  setup(props, context) {

    const store = useStore();
    const router = useRouter();

    const login = useLogin();


    // 是否显示登录
    const showLogin = ref(false)



    async function getUserInfo() {
      let userInfo = await store.dispatch("auth/getCurrentUserInfo")
    }

    function windowOpt(opt: string) {
      getElectronAgent()?.ipcRequest("window/opt", opt);
    }

    onMounted(async () => {
      const loading = ElLoading.service({
        lock: true
      })
      try {

        const agent = getElectronAgent()
        if (agent != null) {
          await agent.ipcRequest("window/setViewType", "small");
        }

        await getUserInfo()

        router.push("/internal/home")
      } catch {

        showLogin.value = true

      } finally {
        loading.close();
      }

    })





    return {
      login,
      showLogin,
      windowOpt
    }
  }
})
</script>

<style lang='scss' scoped>
.login {
  padding: 30px;
}

.drag {
  flex: 1;
  -webkit-app-region: drag;
  height: 100%;
}

.login-title {
  font-size: 23px;
  color: #303133;
  text-align: left;
  padding-top: 20px;
  -webkit-app-region: drag;
  margin-left: 30px;
  // padding: 10px 20px 10px 20px;
}

.entry {
  background-color: #fff;
  height: 100%;
}

.logo {
  padding-left: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  height: 45px;
  align-items: center;
  background-color: #F1F4F7;
}

.window-btns {
  display: flex;
  margin-right: 24px;

  .btns {
    cursor: pointer;
    align-items: center;
    display: flex;
    margin-left: 10px;
    padding: 5px;

    &:hover {
      background-color: rgba(33, 33, 36, 0.1);
    }
  }
}

.content {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.ad {
  width: 50%;
  margin-top: 20px;

  .ad-item {
    text-align: center;

    .text {
      margin-bottom: 50px;

      .main {
        color: #2D211C;
        font-size: 16px;
        margin-bottom: 15px;
      }

      .sub {

        color: #A0A0A0;
        font-size: 14px;
      }
    }
  }


  :deep(.el-carousel__arrow.el-carousel__arrow--right) {
    display: none;
  }

  :deep(.el-carousel__arrow.el-carousel__arrow--left) {
    display: none;
  }

  :deep(.el-carousel__button) {
    background-color: #000;
    border-radius: 50%;
    width: 10px;
    height: 10px;
  }
}

.login-container {
  width: 50%;
}
</style>