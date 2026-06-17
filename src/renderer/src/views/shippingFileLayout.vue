<template>
  <div class="main-container manifest">
    <div class="header">
      <div class="left">
        <el-space>
          <div @click="$router.push('/workbench')" class="logo">
            <img src="@/assets/logo.svg" />
          </div>
          <div>全球货物，随你到处跑</div>
          <div> | <span>船司资料下载</span> </div>
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
            <div @click="windowOpt('max')" style="padding-bottom: 9px" class="btns">
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



      <el-container style="height: 100%">
        <el-main class="view">
          <el-breadcrumb v-if="breadcrumb.currentBreadcrumb.length != 0" class="breadcrumb" separator="/">
            <el-breadcrumb-item v-for="item in breadcrumb.currentBreadcrumb" :key="item.route"
              :to="{ path: item.route }">{{ item.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="view-content" :class="breadcrumb.currentBreadcrumb.length != 0 ? 'newheight' : ''">

            <router-view v-slot="{Component,route }">
              <keep-alive>
                <component :key="route.path" :is="Component"></component>
              </keep-alive>
            </router-view>

          </div>
        </el-main>
      </el-container>


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
} from "vue";
import { Bell, StarFilled } from "@element-plus/icons";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { getElectronAgent } from "@share/agent";
import { useBreadcrumb } from "@/composables/useBreadcrumb";
import { Minus, Close } from "@element-plus/icons";
import UserInfoPopper from "./internal/internalComponents/UserInfoPopper.vue";
import request from "@/public/request"
import { ElMessage } from "element-plus"
import { useCompanyCertification } from "@/composables/user/certification"
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
  })

  onMounted(() => {
    store.dispatch("auth/checkAndTryChooseEmployee");
  });

  return reactive({
    userInfo,
    logout,
    isEmployeeLogin,
    companyName,
    showUnReadMessage
  });
}

function useMenu() {
  const route = useRoute();

  // 是否显示侧边菜单
  const showSider = computed(() => {
    return false
  });

  return reactive({
    showSider
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

/**
 * 右上角的菜单
 */
function useTopMenu() {

  // manifest / vgm 
  // 当前菜单
  const router = useRouter();
  const route = useRoute();


  const lastEntryPath = {
    vgm:"",
    manifest:""
  };

  function switchMenu(value) {

    let target = value.props.name;
    if (target == "vgm") {
      if(lastEntryPath.vgm == ""){
          router.push("/manifest/vgm/VGMNrafts")
      }else{
        router.push(lastEntryPath.vgm)
      }

    }else{
      if(lastEntryPath.manifest == ""){
          router.push("/manifest/NewManifest")
      }else{
        router.push(lastEntryPath.manifest)
      }
    }
  }

  // 当前菜单
  const currentMenu = computed(()=>{
    if(route.path.toLocaleLowerCase().startsWith("/manifest/vgm")){
      lastEntryPath.vgm = route.fullPath;
      return "vgm"
    }else{
      lastEntryPath.manifest = route.fullPath;
      return "manifest"
    }
  })



  return reactive({
    currentMenu,
    switchMenu
  })
}

export default defineComponent({
  components: {
    Bell,
    StarFilled,
    Minus,
    Close,
    UserInfoPopper
  },
  setup() {
    const store = useStore()
    const agent = getElectronAgent();

    const user = useUser();
    const menu = useMenu();
    const userAuth = useUserAuth(agent);

    const breadcrumb = useBreadcrumb();
    const topMenu = useTopMenu()


    if (agent != null) {
      agent.ipcRequest("shippingfile/setViewType", "normal");
    }

    function windowOpt(opt) {
      agent.ipcRequest("shippingfile/opt", opt);
    }

    onMounted(() => {
      store.dispatch("pay/refreshBalance")
      agent.ipcRequest("loading/closeCover",window._ELECTRON_WINDOW_ID_);
    
    })

    return {
      user,
      menu,
      userAuth,
      breadcrumb,
      windowOpt,
      topMenu
    };
  },
});
</script>

<style lang='scss' scoped>
$header-height: 51px;
$manifest-bgcolor: #5380EB;

.header {
  height: $header-height;
  color: #fff;
  box-shadow: 0 1px 0 0 $manifest-bgcolor;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 19px;
  background-color: $manifest-bgcolor;
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
  // :deep(.el-input__inner:focus){
  //   border-color:#8dce6c;
  // }
  // :deep(.el-button.el-button--default:focus){
  //   background-color: #f0f9ea;
  //   border-color: #8dce6c;
  //   color:#8dce6c;
  // }
  // :deep(.el-button.el-button--default:hover){
  //       background-color: #f0f9ea;
  //   border-color: #8dce6c;
  //   color:#8dce6c;
  // }
  // :deep(.el-button--primary:hover){
  //   color:#fff;
  // }


  .view {
    padding: 8px;
  }

  .view-content {
    // min-width: 1400px;
    height: calc(100vh - 67px);
    /* overflow: hidden; */
    overflow: auto;
  }

  .newheight {
    height: calc(100vh - 100px);
  }

  .view-content::-webkit-scrollbar {
    width: 4px;
  }

  .view-content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }

  .view-content::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
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
  cursor: pointer;
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

    &:hover {
      background-color: #B0782B;
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

:deep(.el-select-dropdown__item) {}

.manifest {
  .view-content {
    :deep(.manifesttable) {
      .el-table {
        .el-table__header th {
          height: 32px;
          background-color: #F0F9EA !important;
        }

        .cell {
          line-height: 16px;
        }

        .el-checkbox.el-checkbox--small {
          height: 14px;
        }

        th.el-table__cell>.cell {
          color: #000000;
          letter-spacing: -0.86px;
          font-weight: 600;
          font-size: 12px;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: $manifest-bgcolor;
          border-color: $manifest-bgcolor;
        }

        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: $manifest-bgcolor;
          border-color: $manifest-bgcolor;
        }

        .el-checkbox__input.is-focus .el-checkbox__inner {
          border-color: $manifest-bgcolor;
        }

        .el-checkbox__inner:hover {
          border-color: $manifest-bgcolor;
        }

        .el-table__body tr.hover-row>td.el-table__cell {
          background-color: #FFF1CB;
        }

      }

      .el-table--border,
      .el-table--group {
        border: 1px solid #E4E7ED;
      }

      .el-table--border {
        border-right: none;
        border-bottom: none;
      }

      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: $manifest-bgcolor;
        color: #FFFFFF;
      }
    }

    :deep(.el-row1) {
      .el-col {
        margin: 0px;
        padding: 0px;
        height: 35px;
      }
    }

    /* :deep(.el-button:focus){
			color: #67C23A;
			border-color: #b3e19d;
			background-color: #f0f9eb;
		}
		:deep(.el-button:hover){
			color: #67C23A;
			border-color: #b3e19d;
			background-color: #f0f9eb;
		} */
    :deep(.el-button.el-button--primary) {
      background: #8dce6c;
      border-color: #8dce6c;

      &:hover {
        opacity: 0.7;
      }
    }
  }
}


.top-menu {
  margin-top: 12px;
  margin-right: 42px;

  .top-menu-tabs {

    :deep(.el-tabs__item) {
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      font-weight: 400;
      height: 38px;

      &:hover {
        opacity: 0.7;
      }
    }

    :deep(.el-tabs__nav-wrap::after) {
      background-color: #8DCE6C;
    }

    :deep(.el-tabs__active-bar) {
      background-color: #fff;
    }
  }

}
</style>

<style lang="scss">
/*
element-plus 变量
*/
:root {
  --el-color-primary: #8dce6c;
  --el-color-primary-light-7: #8dce6c;
  --el-color-primary-light-9: #f0f9ea;
  --el-button-border-color: #8dce6c;
}
.el-button--primary.is-plain{
    --el-button-border-color: #8dce6c;
}

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