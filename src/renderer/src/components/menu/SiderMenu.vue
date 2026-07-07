<template>
  <div class="container">
    <div class="top">
      <div class="mb-2" style="padding-left: 20px;" v-if="menuType != 1">{{ menuType == 2 ? '企业中心' : '个人中心' }}</div>
      <el-menu :key="menuList" :default-active="this.$route.path" class="el-menu-vertical-demo" @open="handleOpen"
        @close="handleClose">

        <div>
          <div v-for="value, i in menuList" :key="i">
            <el-menu-item v-if="!value.children || !value.children.length" :index="value.url"
              @click="toPage(value.url)">
              <img :src="getImageUrl(value.icon)" v-if="value.icon && this.$route.path != value.url"
                style="margin-right: 5px;" />
              <img :src="getImageUrl(value.iconActive)" style="margin-right: 5px;"
                v-if="value.iconActive && this.$route.path == value.url">

              <span v-if="value.name != '企业商机'">{{ value.name }}</span>
              <el-badge v-else is-dot :hidden="unReadCount == 0" :max="99" type="danger">
                <span>{{ value.name }}</span>
              </el-badge>
            </el-menu-item>
            <el-sub-menu v-else :index="value.url">
              <template #title>
                <img :src="getImageUrl(value.icon)" v-if="value.icon && this.$route.path != value.url"
                  style="margin-right: 5px;" />
                <img :src="getImageUrl(value.iconActive)" v-if="value.iconActive && this.$route.path == value.url"
                  style="margin-right: 5px;" />
                <span>{{ value.name }}</span>
              </template>
              <el-menu-item v-for="item in value.children" :index="item.url" @click="toPage(item.url)">
                <span>{{ item.name }}</span>
              </el-menu-item>
            </el-sub-menu>
          </div>
        </div>
        <div v-if="chatList?.length && menuType == 1" style="margin-top: 24px;flex: 1;overflow-y: scroll;">
          <div v-for="value, i in chatList">
            <div class="son-title" style="margin-top: 0;" v-if="value.Time == getCurrentDate">新对话</div>
            <div class="son-title"
              v-if="value.Time != getCurrentDate && ((chatList[0].Time == getCurrentDate && i == 1) || (chatList[0].Time != getCurrentDate && i == 0))">
              历史记录</div>
            <div class="son-title" style="font-size: 10px;margin-top: 4px;line-height: 20px;"
              v-if="value.Time != getCurrentDate">{{ value.Time }}</div>
            <el-menu-item v-for="item, index in value.info" :index="item.url" :key="index"
              @click="toPage(item.url, item.query, item)">
              <img :src="getImageUrl(item.icon)" v-if="item.icon && this.$route.path != item.url"
                style="margin-right: 5px;" />
              <img :src="getImageUrl(item.iconActive)" v-if="item.iconActive && this.$route.path == item.url"
                style="margin-right: 5px;">
              <span style="width: 100%;overflow: hidden;text-overflow: ellipsis;flex: 1;">{{ item.name }}</span>
            </el-menu-item>
          </div>
        </div>

      </el-menu>
    </div>

    <div class="bottom">
      <el-dropdown placement="top-start" style="margin-right: 5px">
        <div class="login-icon">
          <div class="dot-item" style="margin-left: 10px">
            <div class="avatar-out">
              <el-avatar :size="32" :src="currentAvatar" style="margin-top: 4px;margin-right: 5px;">
                <img src="@/assets/default-avatar.svg" />
              </el-avatar>
            </div>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu split-button style="width: 180px">
            <el-dropdown-item @click="toWorkbench(3)" divided>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item @click="toWorkbench(menuType == 2 ? 1 : 2)" divided>
              {{ menuType == 2 ? "返回首页" : "企业客户" }}
            </el-dropdown-item>

            <!-- <el-dropdown-item @click="toWorkbench" divided>
            {{ $store.state.menu.isExternalWorkbench ? "工作台" : "管理后台" }}
          </el-dropdown-item> -->
            <!-- <el-dropdown-item @click="goWorkbench('/workbench/applications')" divided>
            企业客户
          </el-dropdown-item> -->

            <el-dropdown-item @click="openExternalUrl('https://www.port56.cn/admin/')" divided>
              企业官网
            </el-dropdown-item>
            <!-- <el-dropdown-item
            v-if="$store.state.auth.isMoreRole"
            @click="toLogin"
            class="user-dropdown-item"
          >
            切换角色
          </el-dropdown-item>

          <el-dropdown-item
            class="user-dropdown-item"
            v-if="$store.state.auth.multipleAccount"
            @click="toChooseCompany"
          >
            切换公司</el-dropdown-item> -->
            <el-dropdown-item class="user-dropdown-item" @click="logout" divided>
              退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
        <span class="user-name">
          <span class="login-text-mainPage" :title="currentUserName">{{
            currentUserName
          }}</span>
        </span>
      </el-dropdown>

      <img v-if="hasCompany" src="@/assets/images/sign-yes.svg" alt="" style="height: 21px;" />
      <img v-else src="@/assets/images/sign-no.svg" alt="" style="height: 21px;" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Menu, Setting, List } from "@element-plus/icons";
import MenuItem from "./MenuItem.vue";
export default defineComponent({
  components: {
    Menu,
    MenuItem,
    Setting,
    List,
  },
  props: {
    menuType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      nowDate: '',
      hasCompany: false,
    };
  },
  computed: {


  },
  methods: {
    async getUnreadCount() {
      let res = await this.$http.get("/api/Message/UnReadMessageCount", {
        onlyUser: this.onlyUser,
      });
      this.$store.commit("menu/setUnReadCount", res)
    },
    toPage(path, query = {}, isChat = false) {
      this.$router.push({ path: path, query: query });
      if (isChat) {
        this.$emit('selectChat', isChat.name)
      } else {
        this.$emit('selectChat', '')
      }
    },
    routeEqual(path) {
      return path.toLowerCase() === this.currentRoute;
    },
    getImageUrl(name) {
      return new URL(`../../assets/${name}`, import.meta.url).href
    },
    async toWorkbench(menuType) {
      // 判断是否登录员工账号 如果没员工账号前往 join/entry
      // if ((await this.$store.dispatch("auth/checkAndTryChooseEmployee")) == false) {
      //   this.$router.push("/join/entry");
      //   return;
      // }
      // // 防止重复跳转
      // if (this.$route.matched.find((t) => t.path == "/external/workbench")) {
      //   return;
      // }
      // this.$router.push(this.$store.getters["menu/workbenchPath"]);
      if (!this.hasCompany && menuType != 3) {
        await this.$store.dispatch("payplan/openPlanOptionDialog", 'company');
        return;
      }
      this.$emit('toWorkbench', menuType)
    },
    openExternalUrl(url) {
      this.$agent().ipcRequest("window/externalUrl", url);
    },
    async logout() {
      this.$agent().ipcRequest("login/logout")
      await this.$store.dispatch("auth/logout");
      // 返回到登录页
      this.$router.replace("/");

      // window.location.reload();
    },
  },
  computed: {
    unReadCount() {
      return this.$store.state.menu.unReadCount
    },
    currentRoute() {
      return this.$route.path.toLowerCase();
    },
    menuList() {
      return this.$store.state.menu.menuList;
    },
    newList() {
      return this.$store.state.menu.newList;
    },
    replyList() {
      return this.$store.state.menu.replyList;
    },
    chatList() {
      let arr = {}
      console.log(this.newList)
      this.newList.forEach(item => {
        this.replyList.forEach(item2 => {
          if (item.Time == item2.Time) {
            console.log(item.Time)
            arr[item.Time] = arr[item.Time] || []
            arr[item.Time] = [...item.info, ...item2.info]
          }
        })
      })
      this.newList.forEach(item => {
        if (!arr[item.Time]) {
          arr[item.Time] = []
          arr[item.Time] = item.info
        }
      })
      this.replyList.forEach(item => {
        if (!arr[item.Time]) {
          arr[item.Time] = []
          arr[item.Time] = item.info
        }
      })

      let newArr = []
      for (let key in arr) {
        newArr.push({ Time: key, info: arr[key], date: new Date(key) })
      }
      return newArr.sort((a, b) => {
        console.log(a.date - b.date)
        return b.date - a.date
      })
    },
    getCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始
      const day = String(now.getDate()).padStart(2, '0');
      console.log(`${year}-${month}-${day}`, '年月日')
      return `${year}-${month}-${day}`;
    },
    // 当前登录用户的名称
    currentAvatar() {
      if (this.currentUserIsLogin) {
        return this.$store.state.auth.user.Avatar;
      }
      return "";
    },

    // 当前登录用户的名称
    currentUserName() {
      console.log(1111111111, this.$store.state.auth.user)
      if (this.currentUserIsLogin) {
        return this.$store.state.auth.user.RealName;
      }
      return "";
    },

    // 当前用户是否登录
    currentUserIsLogin() {
      console.log(this.$store.state.auth.user, '用户')
      // console.log(this.$store.state.auth.user, 'this.$store.state.auth.user')
      if (this.$store.state.auth.user != null) {
        return true;
      }
      return false;
    },
  },
  created() { },
  async mounted() {
    this.hasCompany = await this.$store.dispatch("auth/checkAndTryChooseEmployee")
    this.getUnreadCount();
  }
});
</script>

<style lang="scss" scoped>
:root {
  // --el-aside-width:70px;
}



.container {
  background: #F7F8FA;
  box-shadow: 2px 0 2px 0 rgba(228, 231, 237, 0.35);
  height: calc(100% - 51px);
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  border: 1px solid #F2F3F5;
  box-sizing: border-box;
  // min-height: 500px;
}

.space {
  text-align: center;
  margin: 0 auto;

  :deep(.el-space__item) {
    width: 60px;
  }
}

.menu-item-selected {
  background: #f2f8fd;
  border: 1px solid #a0cfff !important;
  border-radius: 8px;
  padding: 4px 4px;
  width: 50px;
  height: 50px;
}

.menu-item {
  border: 1px solid #F7F8FA;
  border-radius: 8px;
  padding: 4px 4px;
  transition: 0.8s;
  width: 50px;
  height: 50px;
  box-sizing: content-box !important;
}

.top {
  padding-top: 16px;
  height: 92%;
  overflow-y: auto;
  overflow-x: hidden;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border-top: 1px solid #E0E1E2;

  :deep(.el-dropdown--small) {
    display: flex;
    align-items: center;
  }

  // padding-bottom:26px;
}

.menu-title {
  color: #3C4144;
  height: 18px;
}

.menu-icon {
  margin-bottom: 5px;
}

.menu-icon-container {
  height: 24px !important;
}

:root {}



.el-menu-item {
  height: 40px;
  line-height: 40px;
  display: flex;
  box-sizing: border-box;

  &.is-active {
    background-color: #fd953e !important;
    color: #fff;
  }

  &:hover {
    background-color: #FFF4EC;
  }
}

:deep(.el-sub-menu__title) {
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;

  &:hover {
    background-color: #FFF4EC;
  }
}

.son-title {
  padding-left: 20px;
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 24px;
}

.icon-active {
  width: 48px;
  height: 48px;
  /* 这里的颜色就是你想要的 SVG 颜色 */
  background-color: #3366ff;

  /* 核心：将 SVG 作为蒙版 (兼容性需加 -webkit- 前缀) */
  mask-image: url('./icon.svg');
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: url('./icon.svg');
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.login-icon {
  display: flex;
  align-items: center;
  transition: 0.5s;
}

.dot-item {
  :deep(.is-fixed) {
    position: absolute;
    top: 2px !important;
    right: 5px;
  }
}

.avatar-out {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  text-align: center;

  &:hover {
    background: rgba($color: #000000, $alpha: 0.15);
  }
}

.user-name {
  display: flex;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  line-height: 22px;
  font-weight: 400;
  margin: 0 5px;

  img {
    margin-left: 8px;
  }
}

:deep(.el-menu) {
  background-color: #F7f8fa !important;
  border: none !important;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mb-2 {
  font-size: 16px;
  font-weight: 600px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
}

:deep(.is-dot) {
  width: 5px;
  height: 5px;
  right: 0 !important;
  top: 12px;
}

:deep(.el-dropdown-menu__item) {
  &:first-child {
    border: none;
  }

}

.login-text-mainPage {
  overflow: hidden;
  white-space: nowrap;
  width: 40px;
  text-overflow: ellipsis;
}
</style>
