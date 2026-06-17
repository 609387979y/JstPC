<template>
  <template v-if="currentUserIsLogin">
    <div>
      <span :class="isWhiteText ? '' : 'text-black'" class="user-name">
        <!-- <span :class="typeFrom == 'mainpage' ? 'login-text-mainPage' : ''">{{
          currentUserName
        }}</span> -->
        <img v-if="hasCompany" src="@/assets/images/sign-yes.svg" alt="" style="height: 21px;" />
        <img v-else src="@/assets/images/sign-no.svg" alt="" style="height: 21px;" />

      </span>
    </div>
    <div class="vip-pay">
      <!-- <el-popover placement="bottom" :width="240" trigger="click">
        <template #reference>
          <div class="fixed-item">
            <div class="fixed-item-title">
              <img v-if="!isVipAndFree" src="@/assets/newImages/renewVip/unVip.png" alt="" />
              <img v-else src="@/assets/newImages/renewVip/Vip.png" alt="" />
            </div>
          </div>
        </template>
        <div class="bottom-qrcode">
          <div class="qrcode-box">
            <div class="qrcode-img"><el-icon color="#fd953e" size="16">
                <CircleCheck />
              </el-icon></div>
            <div class="qrcode-text">搜运价</div>
          </div>
          <div class="qrcode-box">
            <div class="qrcode-img"><el-icon color="#fd953e" size="16">
                <CircleCheck />
              </el-icon></div>
            <div class="qrcode-text">找舱位</div>
          </div>
          <div class="qrcode-box">
            <div class="qrcode-img"><el-icon color="#fd953e" size="16">
                <CircleCheck />
              </el-icon></div>
            <div class="qrcode-text">查船期</div>
          </div>
          <div class="qrcode-box">
            <div class="qrcode-img"><el-icon color="#fd953e" size="16">
                <CircleCheck />
              </el-icon></div>
            <div class="qrcode-text">卖舱位</div>
          </div>
          <div class="qrcode-box">
            <div class="qrcode-img"><el-icon color="#fd953e" size="16">
                <CircleCheck />
              </el-icon></div>
            <div class="qrcode-text">箱跟踪</div>
          </div>
          <div class="qrcode-box" style="width: 63px;">
          </div>
        </div>
        <div class="openVipBtn" @click="openVip()">{{ isVipAndFree ? '续费会员' : '充值会员' }}</div>
      </el-popover> -->
    </div>

    <MessageIcon style="margin-right: -5px" :isWhite="isWhiteText ? true : false" :typeFrom="typeFrom"></MessageIcon>
    <el-dropdown style="margin-right: 5px">
      <div class="login-icon">
        <div class="dot-item" style="margin-left: 10px">
          <el-badge is-dot :hidden="unReadMessageCount == 0 || unReadMessageCount == null" :value="unReadMessageCount"
            :max="99" class="item">
            <div class="avatar-out">
              <el-avatar :size="32" :src="currentAvatar" style="margin-top: 4px">
                <img src="@/assets/default-avatar.svg" />
              </el-avatar>
            </div>
          </el-badge>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu style="width: 180px">
          <el-dropdown-item class="user-dropdown-item" @click="toMain">
            <el-avatar :size="32" :src="currentAvatar">
              <img src="@/assets/default-avatar.svg" />
            </el-avatar>
            <span class="name">{{ currentUserName }}</span>
          </el-dropdown-item>
          <el-dropdown-item @click="toWorkbench(menuType == 2 ? 1 : 2)" divided>
            {{ menuType == 2 ? "普通客户" : "企业客户" }}
          </el-dropdown-item>
          <!-- <el-dropdown-item @click="toWorkbench" divided>
            {{ $store.state.menu.isExternalWorkbench ? "工作台" : "管理后台" }}
          </el-dropdown-item> -->
          <!-- <el-dropdown-item @click="goWorkbench('/workbench/applications')" divided>
            企业客户
          </el-dropdown-item> -->
          <el-dropdown-item @click="toWorkbench(3)" divided>
            个人中心
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
    </el-dropdown>
  </template>
  <template v-else>
    <div class="not-login">
      <span @click="toLogin" :class="isWhiteText ? '' : 'isWhiteText'">注册/登录</span>
      <img style="width: 24px" class="logo-img" src="@/assets/customerImg/00头像.svg" v-show="isWhiteText" alt="" />
      <img style="width: 24px" class="logo-img" src="@/assets/customerImg/01头像.svg" v-show="!isWhiteText" alt="" />
      <div class="lang-change" :class="isWhiteText ? '' : 'isWhiteText'">CN</div>
    </div>
    <!-- <button class="login" :class="isNewMh?'blue-bg':''" @click="toLogin">登录</button> -->
  </template>
  <span :class="isWhiteText ? '' : 'text-black'" class="user-name">
    <span :class="typeFrom == 'mainpage' ? 'login-text-mainPage' : ''">{{
      currentUserName
    }}</span>
  </span>
  <!-- <UserLoginDialog @success="loginSuccess" ref="userDialog"></UserLoginDialog> -->
</template>

<script>
import { defineComponent } from "vue";
// import UserLoginDialog from "@/components/UserLoginDialog.vue";
import MessageIcon from "@/components/message/MessageIconCustomer.vue";
import { ArrowDown, CircleCheck } from "@element-plus/icons";
export default defineComponent({
  props: {
    isWhiteText: {
      type: Boolean,
      default: false,
    },
    isNewMh: {
      type: Boolean,
      default: false,
    },
    menuType: {
      type: Number,
      default: 1
    }
  },
  components: {
    ArrowDown,
    MessageIcon,
    CircleCheck,
  },
  data() {
    return {
      hasCompany: false,
    };
  },
  methods: {
    async loginSuccess() {
      this.$message.success("登录成功");
      // 判断有没有账号 没有就前往申请账号的页面(方舟只显示联系方式不提供申请)
      await this.$store.dispatch("auth/getCurrentLoggedInfo");
      if (this.$store.state.auth.employee == null) {
        this.$router.push("/join/entry");
      } else {
        await this.$store.dispatch("menu/getCurrentEmployeeMenuTree");
        // 然后该去哪去哪
        this.$router.push(this.$store.getters["menu/workbenchPath"]);
      }
    },
    async logout() {
      this.$message.success("登出成功");
      await this.$store.dispatch("auth/logout");
      window.location.href = "/"

      // window.location.reload();
    },
    /**
     * 前往工作台
     */
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
      if (!this.hasCompany) {
        await this.$store.dispatch("payplan/openPlanOptionDialog", 'company');
        return;
      }
      this.$emit('toWorkbench', menuType)
    },

    /**
     * 选择公司
     */
    toChooseCompany() {
      this.$router.push("/chooseCompany");
    },
    toMessageManage() {
      this.$router.push("/system/message");
    },
    async goWorkbench(path) {
      if (!path) return this.$message.warning('功能未开通')
      if (!this.hasCompany) {
        await this.$store.dispatch("payplan/openPlanOptionDialog", 'company');
        return;
      }
      /* this.$router.push("/workbench/applications"); */
      let page = this.$router.resolve({
        path,
      })
      window.open(page.href, '_blank');
    },
    // 用户设置
    toUserSetting() {
      this.$router.push("/manage/userSetting");
    },
    toLogin() {
      if (this.currentUserIsLogin) {
        return;
      }
      this.$router.push('/loginDms')
    },
    /**
     * 获得消息数量
     */
    async getMessageCount() {
      await this.$store.dispatch("message/getMessageCount", true);
    },
    openVip() {
      this.$store.dispatch("renew/openPlanOptionDialog");
    },
  },
  async mounted() {
    // 监听用户登录

    this.getMessageCount();
    await this.$store.dispatch("auth/getCurrentLoggedInfo");

    if (this.$route.query.showLogin) {
      this.$router.replace({
        query: {},
      });
      this.$router.push('/loginDms')
    }
    this.hasCompany = await this.$store.dispatch("auth/checkAndTryChooseEmployee")
  },
  computed: {
    /**
     * 当前员工是否是平台
     */
    currentEmployeeIsPlatform() {
      if (this.$store.state.auth.employee == null) {
        return false;
      }

      return this.$store.state.auth.employee.CompanyType == 0;
    },
    // 当前用户是否登录
    currentUserIsLogin() {
      // console.log(this.$store.state.auth.user, 'this.$store.state.auth.user')
      if (this.$store.state.auth.user != null) {
        return true;
      }
      return false;
    },
    // 当前员工是否已经登录
    currentEmployeeIsLogin() {
      if (this.$store.state.auth.employee != null) {
        return true;
      }
      return false;
    },
    // 当前登录用户的名称
    currentUserName() {
      if (this.currentUserIsLogin) {
        return this.$store.state.auth.user.RealName;
      }
      return "";
    },
    // 当前登录用户的名称
    currentAvatar() {
      if (this.currentUserIsLogin) {
        return this.$store.state.auth.user.Avatar;
      }
      return "";
    },
    // 未读消息数量
    unReadMessageCount() {
      if (this.$store.state.message.unReadMessageCount == null) {
        return 0;
      }
      return this.$store.state.message.unReadMessageCount;
    },
    // 是不是会员
    isVipInfo() {
      console.log(this.$store.state.auth.VipInfo, "this.$store.state.auth.VipInfo");
      if (this.$store.state.auth.VipInfo == null) {
        return false;
      }
      return true
    },
    isVip() {
      if (this.isVipInfo) {
        // store.state.auth.VipInfo
        return this.$store.state.auth.VipInfo.MemberType == 1 || this.$store.state.auth.VipInfo.MemberType == 2;
      }
      return false;
    },
    currentEmployee() {
      let emp = this.$store.state.auth.VipInfo;
      if (emp == null) {
        return {}
      }
      return emp;
    },
    // 是会员并且是畅享版
    isVipAndFree() {
      if (this.isVipInfo) {
        // 检查是否已过期
        const expirationTime = this.currentEmployee.ExpirationTime;
        if (!expirationTime) {
          return false;
        }

        const now = new Date();
        const expirationDate = new Date(expirationTime);

        // 如果当前时间小于到期时间，说明未过期
        return now < expirationDate;
      }
      return false;
    },
  },
});
</script>

<style lang="scss" scoped>
.login-btn {
  cursor: pointer;
}

.blue-bg {
  background: #409eff !important;
}

.login-icon {
  display: flex;
  align-items: center;
  transition: 0.5s;
}

.login-text {
  margin-right: 16px;
  color: #606266;
  cursor: pointer;

  &:hover {
    color: #409eff;
  }
}

.active-color {
  color: white;
}

// ::v-deep .el-icon {
//   color: #ffffff;
// }

.login {
  width: 84px;
  height: 40px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 500;
  border: 1px solid transparent;
  outline: 0;
  cursor: pointer;
  transition: all 0.35s;
  background: var(--theme-btn);
  box-shadow: var(--primary-btn-shadow);
  color: #fff;
}

.login:hover {
  background-color: var(--theme-light-2);
}

.text-black {
  color: #000 !important;
}

.not-login {
  color: #ffffff;
  display: flex;
  align-items: center;

  span {
    font-size: 14px;

    letter-spacing: 0;
    line-height: 16px;
    font-weight: 500;
    cursor: pointer;
  }

  .logo-img {
    margin: 0 8px;
  }

  .lang-change {
    cursor: pointer;
    margin-left: 24px;
    background: rgba(220, 223, 230, 0.25);
    border: 1px solid #e4e7ed;
    border-radius: 2px;
    line-height: 24px;
    padding: 0 8px;
  }

  .isWhiteText {
    color: #5a5d6e;
  }
}

.user-name {
  display: flex;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #FFFFFF;
  line-height: 22px;
  font-weight: 400;

  img {
    margin-left: 8px;
  }
}

.login-btn {
  cursor: pointer;
  width: 30px;
}



.login-icon {
  display: flex;
  align-items: center;
  transition: 0.5s;
}

.login-text {
  margin-right: 16px;
  color: #606266;
  cursor: pointer;

  &:hover {
    color: #409eff;
  }
}

.login-text-mainPage {
  color: #fafaff;
}


:deep(.el-dropdown-menu__item) {
  //   padding: 9px;
  opacity: 0.65;
  font-size: 14px;
  color: #3c4144;
  font-weight: 400;

  .user-dropdown-icon {
    width: 14px;
    height: 14px;
    margin-right: 10px;
    // background: #ccc;
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

.vip-pay {
  display: flex;
  height: 100%;
  align-items: center;
  margin-left: 5px;

  .fixed-item {
    height: 22px;

  }

  .fixed-item-title {
    cursor: pointer;

    img {
      height: 22px;
    }
  }



}


.bottom-qrcode {
  display: flex;
  width: 240px;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: space-evenly;

  .qrcode-box {
    display: flex;

    .qrcode-img {
      display: flex;
      align-items: center;
    }

    .qrcode-text {
      margin-left: 5px;
    }
  }

}

.openVipBtn {
  padding: 7px;
  border-radius: 5px;
  cursor: pointer;
  box-sizing: border-box;
  margin: 15px auto 0;
  font-size: 16px;
  width: 100%;
  text-align: center;
  color: #fff;
  background-image: linear-gradient(116deg, #e6a23c 8%, #f56c6c 100%);
}

:deep(.is-fixed) {
  position: absolute;
  top: -10px;
  right: 5px;
}

.dot-item {
  :deep(.is-fixed) {
    position: absolute;
    top: 2px !important;
    right: 5px;
  }
}
</style>
