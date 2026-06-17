<template>
  <div class="main-container">
    <div class="header">
      <div class="left">
        <el-space>
          <div class="logo">
            <img src="@/assets/logo.svg" />
          </div>
          <div>全球货物，随你到处跑 | 整箱运价</div>
        </el-space>
      </div>

      <div style="flex: 1; height: 100%" class="center center-area"></div>
      <div class="right">
        <div class="user-info-menu">
          <template v-if="user.isEmployeeLogin === false">
            <!-- 未认证弹框 start-->
            <el-popover
              ref="popoverRef"
              popper-class="user-info-auth"
              placement="bottom-end"
              :width="200"
              trigger="hover"
              v-model:visible="userAuth.visible"
            >
              <template #reference>
                <div><img src="@/assets/images/未认证.svg" /></div>
              </template>
              <el-icon
                @click="userAuth.closePopper"
                style="float: right; cursor: pointer"
              >
                <Close />
              </el-icon>
              <div style="padding: 0 10px">
                <span
                  >根据当前的注册级别，您在及时通上将无法使用现舱/运价等商品下单，现在完成认证，即可解锁全部商品。</span
                >
              </div>
              <div
                style="float: right; text-decoration: underline; cursor: pointer"
                @click="userAuth.toUserAuth"
              >
                去认证 >
              </div>
              <!-- @click="user.userAuth" -->
            </el-popover>
          </template>
          <template v-else>
            <!-- 未认证弹框 end-->
            <div><img src="@/assets/images/已认证.svg" /></div>
          </template>
          <div style="margin-left: 15px">
            <el-badge
              @click="openInternalUrl('/system/message')"
              is-dot
              :hidden="!user.showUnReadMessage"
              class="message-icon"
            >
              <el-icon :size="12">
                <bell style="font-size: 18px" />
              </el-icon>
            </el-badge>
          </div>
          <div class="menu">
            <el-popover
              placement="bottom-end"
              :width="340"
              trigger="hover"
              popper-class="user-info"
            >
              <template #reference>
                <el-space>
                  <div style="color: #fff">{{ user.userInfo.RealName }}</div>
                  <div>
                    <el-avatar :src="user.userInfo.Avatar" class="avatar" :size="32">
                      <img src="@/assets/default-avatar.svg" />
                    </el-avatar>
                  </div>
                </el-space>
              </template>
              <UserInfoPopper></UserInfoPopper>
            </el-popover>
          </div>
          <div class="window-btns">
            <div @click="windowOpt('min')" class="btns">
              <el-icon :size="18">
                <minus />
              </el-icon>
            </div>
            <div @click="windowOpt('max')" style="padding-bottom: 5px" class="btns">
              <el-icon :size="18">
                <img src="@/assets/maximize.svg" />
              </el-icon>
            </div>
            <div @click="windowOpt('close')" class="btns">
              <el-icon :size="18">
                <Close />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-content">
      <el-container
        style="height: 100%"
        v-if="
          favoritePorts.state.isCertification || favoritePorts.state.desPortList.length
        "
      >
        <el-aside v-if="menu.showSider" width="152px">
          <FreightMenu></FreightMenu>
        </el-aside>
        <el-main class="view">
          <el-breadcrumb
            v-if="breadcrumb.currentBreadcrumb.length != 0"
            class="breadcrumb"
            separator="/"
          >
            <el-breadcrumb-item
              v-for="item in breadcrumb.currentBreadcrumb"
              :key="item.route"
              :to="{ path: item.route }"
              >{{ item.title }}</el-breadcrumb-item
            >
          </el-breadcrumb>
          <el-scrollbar class="view-content">
            <router-view v-slot="{ Component, route }">
              <keep-alive>
                <component
                  :key="route.fullPath"
                  :is="Component"
                  v-if="$route.meta.keepAlive"
                />
              </keep-alive>
              <component
                :key="route.fullPath"
                :is="Component"
                v-if="!$route.meta.keepAlive"
              />
            </router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
      <FirstGuide v-else @setPort="favoritePorts.initFavoritePorts"></FirstGuide>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  computed,
  unref,
  onUnmounted,
} from "vue";
// import { ipcMain, ipcRenderer, app, BrowserWindow } from "electron";
import { Bell, StarFilled } from "@element-plus/icons";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import FreightMenu from "@/components/menu/FreightMenu.vue";
import { getElectronAgent } from "@share/agent";
import { useBreadcrumb } from "@/composables/useBreadcrumb";
import { Minus, Close } from "@element-plus/icons";
import UserInfoPopper from "./internal/internalComponents/UserInfoPopper.vue";
import request from "@/public/request";
import { ElMessage } from "element-plus";
import { useCompanyCertification } from "@/composables/user/certification";
import FirstGuide from "./internal/FreightRate/FirstGuide.vue";

function useUser() {
  const store = useStore();
  const router = useRouter();

  const userInfo = computed(() => {
    if (store.state.auth.user) {
      return store.state.auth.user;
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
  const companyName = computed(() => {
    if (isEmployeeLogin.value) {
      return store.state.auth.employee.CompanyName;
    } else {
      return "";
    }
  });

  /**
   * 登出
   */
  async function logout() {
    await store.dispatch("auth/logout");
    // 返回到登录页
    router.replace("/");
  }

  const showUnReadMessage = computed(() => {
    return store.state.message.unReadMessageCount > 0 ? true : false;
  });

  onMounted(() => {
    store.dispatch("auth/checkAndTryChooseEmployee");
  });

  return reactive({
    userInfo,
    logout,
    isEmployeeLogin,
    companyName,
    showUnReadMessage,
  });
}

function useMenu() {
  const route = useRoute();

  // 是否显示侧边菜单
  const showSider = computed(() => {
    if (route.meta.hideSider === true) {
      return false;
    }
    return true;
  });

  return reactive({
    showSider,
  });
}

// 角色认证
function useUserAuth(agent) {
  let visible = ref(false);
  const store = useStore();
  const certification = useCompanyCertification();
  // 打开认证窗口
  async function toUserAuth() {
    let res = await certification.toUserAuth();
    if (res) {
      visible.value = false;
    }
    return res;
  }

  //关闭认证popper
  const closePopper = () => {
    visible.value = false;
  };

  return reactive({
    toUserAuth,
    closePopper,
    visible,
  });
}

//初次引导
function useFavoritePorts() {
  const state = reactive({
    polPortList: [],
    desPortList: [""],
    isCertification: false,
  });
  // const priceList = usePriceList();
  async function getFavoritePorts() {
    let res = await request.get("/api/FRInquireFavoritePort/GetFavoritePorts");
    return res;
  }
  const store = useStore();
  async function certification() {
    await store.dispatch("auth/checkAndTryChooseEmployee");
    state.isCertification = store.state.auth.certificationStatus;
  }
  async function initFavoritePorts() {
    let res = await getFavoritePorts();
    state.polPortList = res.PolPorts;
    state.desPortList = res.DestPorts;
    return;
  }
  onMounted(() => {});

  return reactive({
    state,
    getFavoritePorts,
    initFavoritePorts,
    certification,
  });
}

export default defineComponent({
  components: {
    Bell,
    StarFilled,
    FreightMenu,
    Minus,
    Close,
    UserInfoPopper,
    FirstGuide,
  },
  setup() {
    const store = useStore();
    const agent = getElectronAgent();

    const user = useUser();
    const menu = useMenu();
    const userAuth = useUserAuth(agent);

    const breadcrumb = useBreadcrumb();

    const favoritePorts = useFavoritePorts();

    const loading = ref(true);

    if (agent != null) {
      agent.ipcRequest("freight/setViewType", "normal");
    }

    function windowOpt(opt) {
      agent.ipcRequest("freight/opt", opt);
    }

    function openInternalUrl(url) {
      agent.ipcRequest("window/internalUrl", url);
    }
    let messageCountListener = null;
    let firstEntryListener = null;
    onMounted(() => {
      loading.value = true;
      store.dispatch("pay/refreshBalance");
      // console.log(BrowserWindow.getAllWindows())

      agent.ipcRequest("loading/closeCover", window._ELECTRON_WINDOW_ID_);
      messageCountListener = window.$ipc.on("freightRate/inquire", (_, msg) => {
        store.dispatch("message/getUnReadMessageCount");
      });

      firstEntryListener = window.$ipc.on("company/firstEntry", async (_, data) => {
        await store.dispatch("auth/checkAndTryChooseEmployee");

        let emp = store.state.auth.employee;
        if (emp == null) {
          return;
        }

        // 触发 打开界面
        agent?.ipcRequest("freight/newWin", {
          type: "authorization",
          url:
            "/internalComponents/userAuthorization?success=" +
            data.content +
            "&companyName=" +
            emp.CompanyName,
        });
        window.location.reload();
      });

      let getAll = Promise.all([
        favoritePorts.certification(),
        favoritePorts.initFavoritePorts(),
      ]);
      getAll.then(function () {
        loading.value = false;
      });
    });
    onUnmounted(() => {
      messageCountListener = null;
      firstEntryListener = null;
    });

    return {
      user,
      menu,
      loading,
      userAuth,
      breadcrumb,
      windowOpt,
      openInternalUrl,
      favoritePorts,
    };
  },
});
</script>

<style lang="scss" scoped>
$header-height: 51px;
.header {
  height: $header-height;
  color: #fff;
  box-shadow: 0 1px 0px 0 #b0782b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 19px;
  background-color: #fd953e;
  position: relative;

  .left {
    -webkit-app-region: no-drag;
  }
  .right {
    -webkit-app-region: no-drag;
  }
}
.user-info-menu {
  display: flex;

  align-items: center;
  .menu {
    margin-left: 24px;
  }
}

.avatar {
  cursor: pointer;
}
.main-container {
  background-color: #f7f8fa;
  height: 100%;

  .view {
    padding: 0px;
  }
  .view-content {
    padding: 8px;
    // min-width: 1400px;
    height: calc(100vh - 67px);
    overflow: hidden;
    overflow: auto;
  }
  .breadcrumb {
    height: 33px;
    align-items: center;
    display: flex;
    padding-left: 8px;
    background-color: #fff;
  }
}
.logo {
  // cursor: pointer;
}
.main-content {
  height: calc(100vh - $header-height);
}
:deep(.el-breadcrumb__item .el-breadcrumb__inner) {
  font-size: 12px;
  color: #969799;
  letter-spacing: 0;
  line-height: 17px;
  font-weight: 400;
  &:hover {
    color: #3c4144;
  }
}
:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  font-size: 12px;
  color: #3c4144;
  letter-spacing: 0;
  line-height: 17px;
  font-weight: 500;
}
.window-btns {
  display: flex;
  // position: relative;
  .btns {
    cursor: pointer;
    align-items: center;
    display: flex;
    margin-left: 10px;
    padding: 5px;
    font-size: 18px;

    &:hover {
      background-color: #b0782b;
    }
  }
}

.center-area {
  position: relative;
  -webkit-app-region: drag;
}

.user-auth-no {
  background: linear-gradient(#ffffff, #e6e6e6);
  color: #969799;
  padding: 2px 8px;
  border-radius: 10px;
}
.user-auth-yes {
  background: linear-gradient(#ffe6ac, #fdd36c);
  color: #bb6d00;
  padding: 2px 8px;
  border-radius: 10px;
}
.message-icon {
  cursor: pointer;
  margin-top: 7px;
  margin-right: 5px;
}
:deep(.el-select-dropdown__item) {
}
</style>

<style lang="scss">
.user-info-auth.el-popper.is-light {
  background: rgba(21, 22, 23, 0.8);
  color: #ffffff;
}
.user-info-auth.el-popover.el-popper {
  border: unset;
}
.user-info.el-popover.el-popper {
  padding: 0;
}
</style>
