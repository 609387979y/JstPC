<template>
  <div class="main-container">
    <div class="header">
      <div class="left">
        <el-space>
          <div class="logo">
            <img src="@/assets/logo.svg" />
          </div>
          <div>全球货物，随你到处跑 | 极速抢舱</div>
        </el-space>
      </div>

      <div style="flex: 1; height: 100%" class="center center-area"></div>
      <div class="right">
        <div class="user-info-menu">
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
          favoritePorts.state.isCertification ||
          (favoritePorts.state.polPortList.length &&
            favoritePorts.state.desPortList.length)
        "
      >
        <el-aside v-if="menu.showSider" width="152px">
          <FastCargoMenu></FastCargoMenu>
        </el-aside>
        <el-main class="view">
          <el-scrollbar class="view-content" wrap-style="overflow-x:hidden;">
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
			  <div v-if="breadcrumb.currentBreadcrumb.length != 0" style="height: 33px;"></div>
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
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, computed, unref } from "vue";
import { Bell, StarFilled } from "@element-plus/icons";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import FastCargoMenu from "@/components/menu/FastCargoMenu.vue";
import { getElectronAgent } from "@share/agent";
import { useBreadcrumb } from "@/composables/useBreadcrumb";
import { Minus, Close } from "@element-plus/icons";
import UserInfoPopper from "./internal/internalComponents/UserInfoPopper.vue";
import request from "@/public/request";
import { ElMessage } from "element-plus";
import { useCompanyCertification } from "@/composables/user/certification";
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
    if (await certification.toUserAuth()) {
      visible.value = false;
    }
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
    desPortList: [],
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
  }
  onMounted(() => {
    certification();
    initFavoritePorts();
  });

  return reactive({
    state,
    getFavoritePorts,
    initFavoritePorts,
  });
}

export default defineComponent({
  components: {
    Bell,
    StarFilled,
    FastCargoMenu,
    Minus,
    Close,
    UserInfoPopper,
  },
  setup() {
    const store = useStore();
    const agent = getElectronAgent();

    const user = useUser();
    const menu = useMenu();
    const userAuth = useUserAuth(agent);

    const breadcrumb = useBreadcrumb();

    const favoritePorts = useFavoritePorts();

    if (agent != null) {
      agent.ipcRequest("fastCargo/setViewType", "normal");
    }

    function windowOpt(opt) {
      agent.ipcRequest("fastCargo/opt", opt);
    }

    onMounted(() => {
      store.dispatch("pay/refreshBalance");
      agent.ipcRequest("loading/closeCover",window._ELECTRON_WINDOW_ID_);
    });

    return {
      user,
      menu,
      userAuth,
      breadcrumb,
      windowOpt,
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
    padding: 16px;
	box-sizing: border-box;
	height: 100%;
	position: relative;
  }
  .breadcrumb {
    height: 33px;
    align-items: center;
    display: flex;
    padding-left: 16px;
    background-color: #fff;
	position: absolute;
	top: 0;
	left: 0;
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
$them-color: #ff9809;
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
.FCdatepicker{
	.el-date-picker__header-label:hover{
		color: $them-color;
	}
	.el-date-table td.today .el-date-table-cell__text {
	    color: $them-color;
	}
	.el-date-table td.available:hover{
		color: $them-color;
	}
	.el-date-table td.current:not(.disabled) .el-date-table-cell__text{
		background-color: $them-color;
		color: #FFFFFF;
	}
	.el-year-table td.current:not(.disabled) .cell{
		color: $them-color;
	}
	.el-year-table td .cell:hover{
		color: $them-color;
	}
	.el-month-table td.current:not(.disabled) .cell{
		color: $them-color;
	}
	.el-month-table td .cell:hover{
		color: $them-color;
	}
	.el-picker-panel__icon-btn:hover{
		color: $them-color;
	}
	.el-month-table td.today .cell{
		color: $them-color;
	}
	.el-time-panel__btn.confirm{
		color: $them-color;
	}
	.el-button--text{
		color: $them-color;
		display: none;
	}
	.el-button:hover{
		color: $them-color;
		border-color: $them-color;
	}
	.el-input__inner:focus{
		border-color: $them-color;
	}
}
</style>
