<template>
  <div class="main-container">
    <div class="header">
      <div class="container">
        <div class="items">
          <div>
            <img class="logo" @click="toWorkbench('1')" src="@/assets/logo.svg" />
          </div>
          <span class="logo-text">|</span>
          &ensp;
          <span class="logo-text weight">集运宝</span>

          <!-- <el-button @click="testCreatePayOrder" type="primary">一键回收工资</el-button> -->
        </div>
        <div class="items login-group">
          <UserDropDownCustomer :key="menuType" :menuType="menuType" @toWorkbench="toWorkbench" :isWhiteText="true">
          </UserDropDownCustomer>
        </div>
      </div>
    </div>
    <div class="main-content">


      <el-container style="height: 100%">
        <el-aside v-if="menu.showSider" width="180px">
          <SiderMenu :menuType="menuType"></SiderMenu>
        </el-aside>
        <el-main class="view">
          <el-breadcrumb v-if="breadcrumb.currentBreadcrumb.length != 0" class="breadcrumb" separator="/">
            <el-breadcrumb-item v-for="item in breadcrumb.currentBreadcrumb" :key="item.route"
              :to="{ path: item.route }">{{
                item.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="view-content">
            <router-view :key="$route.fullPath"></router-view>
            <!-- <BaseJstInfoFooter style="margin-top:20px"></BaseJstInfoFooter> -->
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
  <PayPlanDialog></PayPlanDialog>
  <RenewDialog></RenewDialog>
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
import PayPlanDialog from "@/components/PayPlan/PayPlanDialog.vue";
import RenewDialog from "@/components/PayPlan/RenewDialog.vue";
import { Bell, StarFilled } from "@element-plus/icons";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import SiderMenu from "@/components/menu/SiderMenu.vue";
import { getElectronAgent } from "@share/agent";
import { useBreadcrumb } from "@/composables/useBreadcrumb";
import { Minus, Close } from "@element-plus/icons";
import UserInfoPopper from "./internal/internalComponents/UserInfoPopper.vue";
import request from "@/public/request"
import { ElMessage } from "element-plus"
import { useCompanyCertification } from "@/composables/user/certification"
import BaseJstInfoFooter from "./internal/internalComponents/BaseJstInfoFooter.vue"
import UserDropDownCustomer from "@/components/UserDropDownCustomer.vue";
import routes from '@/router/internal/applicationMenu.ts'


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
    if (route.meta.hideSider === true) {
      return false;
    }
    return true;
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

export default defineComponent({
  components: {
    Bell,
    StarFilled,
    SiderMenu,
    Minus,
    Close,
    UserInfoPopper,
    BaseJstInfoFooter,
    PayPlanDialog,
    RenewDialog,
    UserDropDownCustomer
  },
  setup() {
    const store = useStore()
    const agent = getElectronAgent();
    const user = useUser();
    const menu = useMenu();
    const userAuth = useUserAuth(agent);
    const router = useRouter();

    const breadcrumb = useBreadcrumb();

    if (agent != null) {
      agent.ipcRequest("window/setViewType", "normal");
    }

    function windowOpt(opt) {
      agent.ipcRequest("window/opt", opt);
    }
    let routeListener = null
    const goWorkbench = async () => {
      if (hasCompany.value) {
        await store.dispatch("payplan/openPlanOptionDialog", 'company');
        return;
      }
    }

    const menuType = ref('1')
    const toWorkbench = (value) => {
      menuType.value = value
      let arr = []
      if (menuType.value == 2) {
        arr = [
          {
            name: "工作台",
            url: "/internal/myApplications",
          },
          {
            name: "企业设置",
            url: "/internal/companyList",
          },
          // {
          //   name: "企业权益",
          //   url: "/internal/freightFind",
          //   icon: "/src/assets/images/商城.svg"
          // },
          {
            name: "企业商机",
            icon: "menu5.svg",
            url: "/instant",
            children: [
              {
                name: "询价/询盘商机",
                url: "/internal/businessSee",
                icon: "/src/assets/images/application.svg"
              },
              // {
              //   name: "现舱商机",
              //   url: "/internal/home",
              //   icon: "/src/assets/images/application.svg"
              // },
              {
                name: "推送设置",
                url: "/internal/pushSetting",
                icon: "/src/assets/images/application.svg"
              },
              {
                name: "优势航线",
                url: "/internal/advantageousRoute",
                icon: "/src/assets/images/application.svg"
              }
            ]
          },
          {
            name: "企业数据",
            url: "/internal/data",
            icon: "menu2.svg",
            iconActive: "menu2Active.svg",
            children: [
              {
                name: "企业运价",
                url: "/internal/publishedPrice",
                icon: "/src/assets/images/renz.svg",
              }
            ]
          }
        ]
      } else if (menuType.value == 1) {


        if (!hasCompany.value) {
          arr = [
            {
              name: "新对话",
              url: "/internal/home",
              icon: "menu1.svg",
              iconActive: "menu1Active.svg"
            },
            {
              name: "运价查询",
              url: "/internal/freightFind",
              icon: "menu2.svg",
              iconActive: "menu2Active.svg"
            },
            {
              name: "即时询价",
              url: "/internal/instant",
              icon: "menu3.svg",
              iconActive: "menu3Active.svg"
            },
            {
              name: "业务单据",
              url: "/internal/BusinessDocument",
              icon: "menu5.svg",
              iconActive: "menu5Active.svg"
            }
          ]
        } else {
          arr = [
            {
              name: "新对话",
              url: "/internal/home",
              icon: "menu1.svg",
              iconActive: "menu1Active.svg"
            },
            {
              name: "运价查询",
              url: "/internal/freightFind",
              icon: "menu2.svg",
              iconActive: "menu2Active.svg"
            },
            {
              name: "即时询价",
              url: "/internal/instant",
              icon: "menu3.svg",
              iconActive: "menu3Active.svg"
            },
            {
              name: "企业商机",
              url: "/internal/business",
              icon: "menu5.svg",
              iconActive: "menu5Active.svg"
            },
            {
              name: "业务单据",
              url: "/internal/BusinessDocument",
              icon: "menu5.svg",
              iconActive: "menu5Active.svg"
            }
          ]
        }
      } else {
        arr = [
          {
            name: "个人设置",
            url: "/internal/userDetail",
            icon: "menu1.svg",
            iconActive: "menu1Active.svg"
          }
        ]
      }

      store.commit("menu/setMenuList", arr);
      router.push(arr[0].url)
    }

    const getChatMenu = async () => {
      let arr = []
      const res = await request.get('/api/CargoRate/GroupByBusinessDocuments')
      res.Data.forEach((value, i) => {
        value.info.forEach(item => {
          arr[i] = arr[i]?.Time ? arr[i] : {
            Time: value.Time.substring(0, 10),
            info: []
          }
          console.log(i, arr[i])
          arr[i].info.push({
            name: item.PolEnPortName + '-' + item.DestEnPortName,
            url: "/internal/ChatWin" + item.Id,
            query: { BusinessDocumentsId: item.Id, Type: '1' },
            icon: item.Type == 1 ? 'menu7.svg' : 'menu8.svg',
            iconActive: item.Type == 1 ? 'menu7Active.svg' : 'menu8Active.svg'
          })
          router.addRoute('internal', {
            name: 'ChatWin' + item.Id,
            path: "/internal/ChatWin" + item.Id,
            component: () => import("@/views/internal/ChatWin.vue"),
            meta: {
              title: "聊天",
            },
          })

        })

      })

      console.log(arr)

      console.log(arr[0]?.Time)

      store.commit("menu/setNewList", arr);
      console.log(res)
    }

    const hasCompany = ref(false)

    const getChatMenuTwo = async () => {
      let arr2 = []
      const res = await request.get('/api/CargoRate/GroupByBusinessDocumentsDetails')
      res.Data.forEach((value, i) => {
        value.info.forEach(item => {
          arr2[i] = arr2[i] || {
            Time: value.Time.substring(0, 10),
            info: []
          }
          arr2[i].info.push({
            name: item.PolEnPortName + '-' + item.DestEnPortName,
            url: "/internal/ChatWin" + item.Id + '1',
            query: { BusinessDocumentsId: item.Id, Type: '2' },
            icon: item.Type == 1 ? 'menu7.svg' : 'menu8.svg',
            iconActive: item.Type == 1 ? 'menu7Active.svg' : 'menu8Active.svg'
          })
          router.addRoute('internal', {
            name: 'ChatWin' + item.Id + '1',
            path: "/internal/ChatWin" + item.Id + '1',
            component: () => import("@/views/internal/ChatWin.vue"),
            meta: {
              title: "聊天",
            },
          })

        })

      })

      console.log(arr2)

      store.commit("menu/setReplyList", arr2);
      console.log(res)
    }

    onMounted(async () => {
      console.log(routes)
      hasCompany.value = await store.dispatch("auth/checkAndTryChooseEmployee");
      getChatMenu()
      getChatMenuTwo()
      toWorkbench('1')
      store.dispatch("pay/refreshBalance")
      routeListener = window.$ipc.on("window/internalLink", (_, url) => {
        router.push(url)
      });
    })
    onUnmounted(() => {
      routeListener = null
    })

    return {
      user,
      menu,
      userAuth,
      breadcrumb,
      windowOpt,
      goWorkbench,
      toWorkbench,
      menuType
    };
  },
});
</script>

<style lang='scss' scoped>
:deep(.el-aside) {
  overflow: hidden;
  overflow-y: auto;
  margin-bottom: 5px;
}

$header-height: 51px;

.header {
  width: 100%;
  height: 51px;
  // height: 64px;
  position: relative;
  align-items: center;
  background-color: #fd953e;
  // box-shadow: 0px 2px 4px 0px rgba(220, 223, 230, 0.5);
  // z-index: 3000;
  // background-image: linear-gradient(42deg, #457FFF 1%, #3775FF 99%);
  // box-shadow: 0 1px 0 0 #2B6DB0;
  box-shadow: 0 1px 0 0 rgba(220, 223, 230, 0.5);

  .items {
    width: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
    /* 垂直居中 */
  }

  .login-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;

    .login-btn {
      font-size: 30px;
      cursor: pointer;
      color: #606266;
    }

    .item-btn {
      color: #ffffff;
      margin: 0 16px;
      cursor: pointer;
      font-size: 14px;
    }
  }

  .logo {
    cursor: pointer;
    margin-right: 8px;
  }

  .logo-text {
    font-size: 14px;
    color: #f7f8fa;
  }

  .weight {
    font-family: PingFangSC-Medium;
    letter-spacing: 0;
    font-weight: 500;
    color: #ffffff;
  }

  .container {
    height: 100%;
    margin: 0 16px;
    display: flex;
    justify-content: space-evenly;
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
    background-color: #fff;
    position: relative;
  }

  .view-content {
    max-width: 1473px;
    margin: 0 auto;
    height: 100%;
    min-width: 900px;
    background-color: #f5f5f5;
    padding: 8px;
    box-sizing: border-box;
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
    font-size: 18px;

    &:hover {
      background-color: #4a9df8;
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

.user-info-auth {
  .el-popper__arrow::before {
    border-color: transparent !important;
    background: rgba(21, 22, 23, 0.8) !important;
  }
}

.name {
  display: inline-block;
  width: 100px;
  overflow: hidden;
  padding-left: 5px;
  text-overflow: ellipsis;
  white-space: no-warp;

}
</style>