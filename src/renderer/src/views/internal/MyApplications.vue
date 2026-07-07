<template>
  <div class="workbench-container" v-loading="pageLoading">
    <div class="workbench-content">
      <el-row :gutter="8">
        <el-col :span="appList != null && allAppList != null ? 12 : 24" v-if="appList != null">
          <div class="workbench-card content-card">
            <div class="card-title">
              <div>业务导航</div>
              <!-- <el-button type="text" @click="editMenu">导航管理</el-button> -->
              <div class="table-text-btn view-all-btn" @click="editMenu(10)">导航管理</div>
            </div>
            <template v-if="appList.length == 0">
              <el-empty :image-size="100" description="暂无菜单" style="height: 205px;" />
            </template>
            <div class="menu-group" v-else>
              <div class="menu-item" :key="item.Id" v-for="item in appList" @click="openMyApp(item.Path)">
                <img :src="getLogo(item.Icon)" alt="" />
                <div class="menu-item-title">{{ item.MenuName }}</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="appList != null && allAppList != null ? 12 : 24" v-if="allAppList != null">
          <div class="workbench-card content-card">
            <div class="card-title">
              <div>应用导航</div>
              <div class="table-text-btn view-all-btn" @click="editMenu(20)">导航管理</div>
            </div>
            <template v-if="allAppList.length == 0">
              <el-empty :image-size="100" description="暂无菜单" style="height: 205px;" />
            </template>
            <div class="menu-group" v-else>
              <div class="menu-item" :key="item.Id" v-for="item in allAppList" @click="openApp(item.AppCode, item.Id)">
                <img :src="getLogo(item.Logo)" alt="" />
                <div class="menu-item-title">{{ item.AppName }}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="8" style="margin-top: 8px;">
        <el-col :span="24">
          <div class="workbench-card content-card">
            <div class="card-title"
              style="display: flex; justify-content: space-between; align-items: center;border: none; margin-bottom: 0; padding-bottom: 0;">
              <div style="display: flex; align-items: center;">
                <el-select class="workbench-select" v-model="dateRange" placeholder="请选择"
                  @change="handleDateRangeChange">
                  <el-option label="今日" value="today"></el-option>
                  <el-option label="近三天" value="threeDays"></el-option>
                  <el-option label="近七天" value="sevenDays"></el-option>
                  <el-option label="近30天" value="thirtyDays"></el-option>
                </el-select>
                <div style="margin-left: 10px; color: #969799; font-size: 14px;">更新于 {{ displayDate }}</div>
              </div>
              <!-- <el-button type="text" @click="showCustomizeDialog">自定义工作台</el-button> -->
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <template v-for="(moduleId, index) in selectedWorkbenchModules" :key="moduleId">
          <el-col :span="24" v-if="moduleComponents[moduleId]">
            <component style="width: 100%;" :is="moduleComponents[moduleId].component" :ref="moduleId + 'Ref'"
              :search="search" />
          </el-col>
        </template>
      </el-row>
    </div>
    <div class="workbench-right">
      <div class="user-content">
        <div class="user-welcom">欢迎回来，{{ $store.state.auth.user?.RealName }}！</div>
        <div class="user-info">
          <div class="user-avatar">
            <el-avatar :size="45" :src="currentAvatar" style="margin-top: 4px">
              <img src="@/assets/default-avatar.svg" />
            </el-avatar>
          </div>
          <div class="user-detail">
            <div class="user-name">{{ $store.state.auth.user?.RealName }}</div>
            <div>
              电话：{{ $store.state.auth.user?.MobilePhone }} <span></span>
            </div>
            <div>邮箱：{{ $store.state.auth.user?.Email }}</div>
          </div>
        </div>
      </div>
      <div class="company-content">
        <div class="company-name">
          {{ currentPersonnelSource }}

          <img v-if="hasCompany" src="@/assets/images/sign-yes.svg" alt="" />
          <img v-else src="@/assets/images/sign-no.svg" alt="" />
        </div>
        <div class="company-item">
          <div class="item-lable">创建时间：</div>
          <div class="item-content">{{ $store.state.auth.user?.CreateTime }}</div>
        </div>
        <div style="height: 27px;"></div>
        <!-- <div class="menu-group" style="height: auto;">
          <div class="menu-item" @click="goPage('workbenchNewPersonal')">
            <img src="@/assets/applications-logo/personalCenter.svg" alt="">
            <div class="menu-item-title">个人中心</div>
          </div>
          <div class="menu-item" v-if="isAdmin" @click="goPage('workbenchUserCompanyManage')">
            <img src="@/assets/applications-logo/businessManagement.svg" alt="">
            <div class="menu-item-title">企业管理</div>
          </div>
        </div> -->
      </div>
      <div class="workbench-card content-card" style="max-height: 820px">
        <el-tabs v-model="activeRightTab" class="member-tabs">
          <el-tab-pane label="公司成员" name="companyMembers">
            <div class="employee-list">
              <div class="employee-item" v-for="item in employeeList" :key="item.Id">
                <el-avatar :size="45" :src="item?.Avatar" style="margin-top: 4px">
                  <img src="@/assets/default-avatar.svg" />
                </el-avatar>
                <div class="employee-info">
                  <div class="employee-name">{{ item?.RealName }} <el-tag v-if="item.IsAdmin"
                      type="primary">子管理员</el-tag>
                  </div>
                  <div class="employee-role">
                    {{ item.RoleNameText }}
                    {{ item?.MobilePhone }}
                  </div>
                </div>
              </div>
              <el-empty v-if="employeeList.length === 0" style="min-height: 675px;" :image-size="100"
                description="暂无成员" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="消息通知" name="messageNotifications">

            <div class="message-list">
              <MessageListItem v-for="item in messageList" :key="item.Id" :title="item.msgTitle"
                :description="item.msgDescription" :time="item.time" :isRead="item.IsRead" @click="chooseMessage(item)">
              </MessageListItem>
              <div class="card-title" v-if="messageList.length !== 0"
                style="display: flex; justify-content: center; align-items: center;">
                <div class="table-text-btn view-all-btn" @click="viewAllMessages">查看全部</div>
              </div>
              <el-empty style="min-height: 675px;" v-if="messageList.length === 0" :image-size="100"
                description="暂无消息" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog v-model="contactShow" :show-close="false" custom-class="mail-dialog" width="400px">
      <ContactDialog :cardTitle="contactTitle"></ContactDialog>
    </el-dialog>
    <!-- 自定义工作台弹窗 -->
    <CustomizeWorkbenchDialog :visible="customizeDialogVisible" @update:visible="customizeDialogVisible = $event"
      :initialSelectedModuleIds="selectedWorkbenchModules" @confirm="handleCustomizeConfirm"
      @cancel="handleCustomizeCancel" />
  </div>
</template>

<script>
import OpportunityOverview from './components/OpportunityOverview.vue';
import NotOpenDialogVue from '@/components/NotOpenDialog.vue';
import ContactDialog from './components/ContactDialog.vue';
import ConsumptionOverview from './components/ConsumptionOverview.vue';
import MessageListItem from '@/components/message/MessageListItem.vue';
import { defineComponent } from "vue";
import { ElMessage } from 'element-plus';
import CustomizeWorkbenchDialog from './components/CustomizeWorkbenchDialog.vue';

export default defineComponent({
  components: {
    OpportunityOverview,
    NotOpenDialogVue,
    ContactDialog,
    ConsumptionOverview,
    MessageListItem,
    CustomizeWorkbenchDialog,
  },
  props: {},
  data() {
    return {
      pageLoading: false,
      appList: [],
      allAppList: [],
      contactShow: false,
      contactTitle: "",
      employeeList: [],
      hasCompany: false,
      dateRange: "sevenDays",
      displayDate: "",
      search: {
        startDate: "",
        endDate: "",
      },
      activeRightTab: "companyMembers",
      messageList: [],
      customizeDialogVisible: false,
      selectedWorkbenchModules: [],
      moduleComponents: {
        opportunityOverview: { component: OpportunityOverview, name: '商机概况' }
        // 在这里可以添加更多模块的映射
      },
      ExternalId: 0,
    };
  },
  watch: {
    // 监听 selectedWorkbenchModules 的变化，当模块选择改变时重新加载数据
    selectedWorkbenchModules: {
      deep: true,
      immediate: true, // 确保在组件初始化时立即执行一次 handler
      handler() {
        this.$nextTick(() => {
          this.handleDateRangeChange();
        });
      },
    },
  },
  computed: {
    // 当前用户是否登录
    currentUserIsLogin() {
      // console.log(this.$store.state.auth.user, 'this.$store.state.auth.user')
      if (this.$store.state.auth.user != null) {
        return true;
      }
      return false;
    },
    // 当前登录用户
    currentAvatar() {
      if (this.currentUserIsLogin) {
        return this.$store.state.auth.user.Avatar;
      }
      return "";
    },
    currentPersonnelSource() {
      if (this.$store.state.auth.employee != null) {
        return this.$store.state.auth.employee.CompanyName;
      } else {
        return this.$store.state.auth.user?.PersonnelSource
      }
    },
    isAdmin() {
      return this.$store.getters["auth/isAdmin"];
    }
  },
  methods: {
    editMenu(tabType) {
      this.$router.push({
        name: "WorkbenchMenuEdit",
        query: {
          tabType,
        },
      });
    },
    // 公司成员列表
    async getEmployeeList() {
      let res = await this.$http.get("/api/Employee/GetEmployeeInCompany", {
        page: -1,
        limit: -1,
        OnlyBind: true,
      });
      for (let row of res.Rows) {
        // RoleName
        if (row.RoleName) {
          row.RoleNameText = row.RoleName.join(',')
        }
        if (row.IsAdmin) {
          row.RoleNameText = "子管理员"
        }
        if (row.EmployeeBindUserInfoList && row.EmployeeBindUserInfoList.length > 0) {
          row.UserId = row.EmployeeBindUserInfoList[0].UserId;
          row.UserMobilePhone = row.EmployeeBindUserInfoList[0].MobilePhone;
          row.UserRealName = row.EmployeeBindUserInfoList[0].RealName;
          row.UserAvatar = row.EmployeeBindUserInfoList[0].Avatar;
        }
      }
      this.employeeList = res.Rows;
    },
    async getApp() {
      const PATH = "EXTERNAL_MENU";
      const MenuNames = ["工作台", "个人中心", "企业管理",]
      let menus = await this.$store.dispatch("menu/getCurrentEmployeeMenuTree");
      let externalMenu = menus.find((t) => t.Path == PATH).Children;

      const extractInnermostChildren = (items) => {
        let result = [];
        items.forEach(item => {
          if (item.Children && item.Children.length > 0) {
            result = result.concat(extractInnermostChildren(item.Children));
          } else {
            result.push(item);
          }
        });
        return result;
      };
      const innermostChildren = extractInnermostChildren(externalMenu);
      this.appList = innermostChildren.filter(item => !MenuNames.includes(item.MenuName));
    },
    async getAllApp() {
      // const appNames = ["市场运价", "电商运价", "在舱运价",] 
      // let res = await this.$http.get("/api/Application/GetAllApplications");
      try {
        let res = await this.$http.get("/api/CargoRate/EmployeeMenuShortcut");
        this.appList = res.Data.Menu
        this.allAppList = res.Data.Info
      } catch (error) {
        console.log(error)
      }
      // .filter(item => { return !appNames.includes(item.AppName) });
    },
    openMyApp(path) {
      this.$router.push(path);
    },
    async openApp(code, appId) {
      let res = await this.$http.get(
        "/api/Application/CanAccessAppWithReason",
        {
          appId,
        },
      );
      if (!res.Status) {
        // this.$message.warning("暂无权限进入该应用");
        this.contactShow = true;
        this.contactTitle = res.Message;
        return;
      }
      let path = "";
      switch (code) {
        case "APPLICATION_WEBSITE":
          path = "/application/website/WebsiteWorkbench";
          break;
        case "APPLICATION_FREIGHTRATE":
          path = "/freightRateApp/frightRateManage";
          break;
        case "APPLICATION_PROMOTION":
          path = "/application/MailWorkbench";
          break;
        case "APPLICATION_WEAPP":
          path = "/WeApplication/Layout";
          break;
        case "MULTISEAFREIGHT":
          path = "/moreFeight/BoxMaintain";
          break;
        case "CARGOTRACK":
          path = "/cargoTrackApplication/boxStatus";
          break;
        case "BUSINESSCARD":
          path = "/application/BusinessCardManagement";
          break;
        case "CustomerManagement":
          path = "/application/BusinessUser";
          break;
        case "APPLICATION_SH_MANIFEST":
          path = "/manifest/CreateManifestPage";
          break;
        case "APPLICATION_PDF_EXPORT":
          path = "/application/pdfExport";
          break;
        case "APPLICATION_FREIGHTINQUIRY":
          path = "/application/FreightInquiry";
          break;
        case "APPLICATION_FREIGHT_ZDP":
          path = "/application/FreightZDPSearch";
          break;
        case "ECOMMERCERATES":
          path = "/application/OnlineRetailers";
          break;
        default:
          break;
      }
      if (path) {
        let res2 = this.$router.resolve(path);
        window.open(res2.href);
      }
    },
    getLogo(logoName) {
      return new URL(`../../../../assets/applications-logo/${logoName}`, import.meta.url)
        .href;
    },
    notOpen() {
      this.$refs.notOpenDialog.showDialog();
    },
    // 打开上海舱单
    openManifest() {
      let res = this.$router.resolve("/manifest/manifestSendingRecord");
      window.open(res.href);
    },
    // 打开运价
    openFreightRate() {
      let res = this.$router.resolve("/freightRate/freightSearch");
      window.open(res.href);
    },
    openPortal() {
      let res = this.$router.resolve("/application/website/WebsiteWorkbench");
      window.open(res.href);
    },
    //打开抢箱
    openGrabBox() {
      let res = this.$router.resolve("/grabBox/GrabBoxWorkbench");
      window.open(res.href);
    },
    handleDateRangeChange() {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 将时间设置为当天的开始，避免时区问题导致日期错误
      let startDate;
      let endDate = new Date(today);

      switch (this.dateRange) {
        case 'today':
          startDate = new Date(today);
          break;
        case 'threeDays':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 2);
          break;
        case 'sevenDays':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 6);
          break;
        case 'thirtyDays':
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 1);
          break;
        default:
          startDate = new Date(today);
      }

      const format = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      this.search.startDate = format(startDate);
      this.search.endDate = format(endDate);
      // 确保组件存在后再调用其方法，并根据新的渲染方式调整
      this.selectedWorkbenchModules.forEach(moduleId => {
        const refName = moduleId + 'Ref';
        if (this.$refs[refName]) {
          // 如果ref是数组，需要遍历，这里假设单个ref
          if (Array.isArray(this.$refs[refName])) {
            this.$refs[refName][0].getList();
          } else {
            this.$refs[refName].getList();
          }
        }
      });
    },
    // 获取系统消息
    async getSystemMessages() {
      try {
        let res = await this.$http.get("/api/Message/GetSystemMessages", {
          Page: 1,
          Limit: 15,
          status: -1,
          onlyUser: false, // 根据需求调整
        });
        this.messageList = res.Rows.map(msg => ({
          Id: msg.Id,
          msgTitle: `${msg.GroupName} - ${msg.ItemName}`,
          msgDescription: msg.Title,
          time: msg.CreateTime,
          IsRead: msg.IsRead,
        }));
      } catch (error) {
        console.error("获取消息通知失败:", error);
        // ElMessage.error("获取消息通知失败");
      }
    },
    // 处理消息点击
    async chooseMessage(msg) {
      await this.$http.post("/api/Message/SetReadStatus", {
        msgId: msg.Id
      })
      let res = await this.$http.get("/api/Message/UnReadMessageCount", {
        onlyUser: this.onlyUser,
      });
      this.$store.commit("menu/setUnReadCount", res)
      msg.IsRead = true;
      // 跳转到详情页
      // this.$router.push({
      //   path: "/system/messageDetail",
      //   query: {
      //     id: msg.Id
      //   }
      // })
      // this.$router.openTab({
      //   path: "/system/messageDetail",
      //   query: {
      //     id: msg.Id
      //   }
      // })
    },
    // 查看全部消息
    viewAllMessages() {
      this.$router.push('/manage/message'); // 假设跳转到消息管理页面
    },
    showCustomizeDialog() {
      this.customizeDialogVisible = true;
    },
    async handleCustomizeConfirm(selectedModules) {
      this.selectedWorkbenchModules = selectedModules;
      // localStorage.setItem('selectedWorkbenchModules', JSON.stringify(selectedModules)); // 保存到本地存储
      const res = await this.$http.post('/api/CargoRate/CreateExternalInfo', {
        Id: this.ExternalId,
        Description: selectedModules.join(','),
      })
      if (!res.Status) {
        this.$message.error(res.Message);
        return
      }
      this.$message.success('保存成功');
      this.getEmployeeMenuList()
      this.customizeDialogVisible = false;
    },
    handleCustomizeCancel() {
      this.customizeDialogVisible = false;
    },
    // 跳转
    goPage(name) {
      this.$router.push({
        name,
      });
    },
    // 个人名片
    goCard(path) {
      this.$http.get('/api/BrowsingHistory/GetBaseBrowsingCard').then(res => {
        if (!res.Status) {
          this.$message.info(res.Message)
          // this.$store.dispatch("payplan/openPlanOptionDialog", 'user');
          return
        }
        let page = this.$router.resolve({
          path,
        })
        window.open(page.href, '_blank');
      })
    },
    getModuleSpan(index) {
      const len = this.selectedWorkbenchModules.length;
      if (len === 1) {
        return 24;
      } else if (len % 2 === 0) {
        return 12;
      } else { // 奇数
        if (index === len - 1) { // 最后一个模块占24
          return 24;
        } else {
          return 12;
        }
      }
    },
    async getEmployeeMenuList() {
      const workbench = ['opportunityOverview', 'consumptionOverview']
      const res = await this.$http.get("/api/CargoRate/ExternalInfo");

      if (res && res.Description !== null) { // 确保 res 存在且 Description 不为 null
        let modules = res.Description.split(",");
        // 只保留 workbench 中包含的模块
        let filteredModules = modules.filter(item => workbench.includes(item));
        if (filteredModules.length > 0) { // 如果过滤后有模块，则使用过滤后的
          this.selectedWorkbenchModules = filteredModules;
        } else { // 如果过滤后没有模块，则使用默认的 workbench 模块
          this.selectedWorkbenchModules = workbench;
        }
        this.ExternalId = res.Id;
      } else { // 如果 res 或 res.Description 为 null/undefined
        this.ExternalId = res ? res.Id : 0; // 确保 ExternalId 有默认值，避免 res 为 null 时的报错
        this.selectedWorkbenchModules = workbench; // 使用默认的 workbench 模块
      }
    },
  },
  async created() {
    // const savedModules = localStorage.getItem('selectedWorkbenchModules');
    // if (savedModules) {
    //   this.selectedWorkbenchModules = JSON.parse(savedModules);
    // } else {
    //   // 默认显示所有模块
    //   this.selectedWorkbenchModules = ['opportunityOverview', 'consumptionOverview'];
    // }



    this.getEmployeeList();
    // this.getApp()
    this.getAllApp()
    this.displayDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
    this.hasCompany = await this.$store.dispatch("auth/checkAndTryChooseEmployee");
    this.getSystemMessages(); // 获取消息通知
    this.getEmployeeMenuList()
  },

  async mounted() {
  },
});
</script>


<style lang="scss">
.mail-dialog {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__footer {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }
}

.recever-popover {
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.workbench-container {
  // margin: 16px;
  min-width: 1160px;
  display: flex;
  gap: 8px;

  .workbench-content {
    width: calc(100% - 394px);
  }

  .workbench-right {
    width: 378px;
    flex: 1;
  }
}

.workbench-card {
  padding: 16px;
  // border-radius: 6px;
  // box-shadow: 0px 1px 2px 0px #0000001a;
  background-color: #ffffff;
  // margin-bottom: 8px;

  .menu-title {
    font-size: 16px;
    padding-bottom: 10px;
    color: #303133;
  }
}

.content-card {
  padding: 8px 16px;
  // height: calc(100% - 16px);

  .card-title {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0%;
    color: #000000e5;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .section-title {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 8px;

    .section-title-word {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0%;
    }

    .divide-line {
      border-bottom: 1px dashed #e7e7e7;
      width: calc(50% - 50px);
    }
  }
}

.header-title {
  display: flex;
  justify-content: space-between;
  font-family: PingFang SC;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0%;
  color: #000000e5;

  span {
    font-size: 14px;
  }

  .blue-logo {
    height: 28px;
  }
}

.menu-group {
  display: flex;
  flex-wrap: wrap;
  gap: 34px;
  height: 205px;
  overflow: auto;
}

.menu-item {
  width: 84px;
  height: 64px;
  border-radius: 16px;
  padding: 10px 0;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: linear-gradient(180deg, #edf4f7 0%, #f1f1f5 100%);

    .menu-item-title {
      color: #3b78ffe5;
    }
  }

  img {
    width: 34px;
    height: 34px;
    margin-bottom: 6px;
  }

  .menu-item-title {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    letter-spacing: 0%;
    text-align: center;
  }

  .menu-item-describe {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0%;
    color: #00000066;
  }
}

.workbench-user-card {
  background: linear-gradient(180deg, #0052d9 0%, #002b73 100%);
  box-shadow: 0px 1px 2px 0px #0000001a;
  padding: 32px;
  // border-radius: 6px;
  margin-bottom: 16px;

  .user-name {
    font-family: PingFang SC;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    letter-spacing: 0%;
    color: #ffffffe5;
    margin-bottom: 8px;
  }

  .user-role {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    color: #ffffffe5;
  }
}

.employee-list {
  overflow-y: auto;
  // height: 675px;
  height: 730px;
  // scrollbar-width: none;

  .employee-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #EBEEF5;

    &:last-child {
      border-bottom: none;
    }

    .employee-info {
      margin-left: 10px;

      .employee-name {
        font-size: 14px;
        font-weight: bold;
        color: #303133;
      }

      .employee-role {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}

.message-list {
  max-height: 730px;
  overflow-y: auto;
}

.member-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 0;
  }

  :deep(.el-tabs__item.is-active) {
    font-weight: bold;
    color: #409EFF;
  }

  :deep(.el-tabs__item) {
    padding: 0 10px;
  }
}

.user-content {
  // background-image: linear-gradient(180deg, #68a6ff 0%, #1c70ff 100%);
  // background-color: #fd953e;
  background-image: linear-gradient(180deg, #FFAB6C 0%, #FF700A 100%);
  // border-radius: 4px;
  padding: 16px;
  box-shadow: 0 1px 4px 0 rgba(220, 223, 230, 0.65);

  .user-welcom {
    font-size: 16px;
    color: #ffffff;
    letter-spacing: -1px;
    font-weight: 500;
    margin-bottom: 18px;
    margin-left: 8px;
  }

  .user-info {
    display: flex;
    margin-bottom: 8px;

    .user-avatar {
      margin-right: 8px;
    }

    .user-detail {
      font-size: 12px;
      color: #ffffff;
      letter-spacing: -0.8px;

      div {
        margin-bottom: 2px;
      }

      span {
        display: inline-block;
        width: 32px;
      }

      .user-name {
        font-size: 16px;
        color: #ffffff;
        letter-spacing: -1px;
        font-weight: 500;
        margin-bottom: 4px;
      }
    }
  }
}

.company-content {
  padding: 16px 16px 8px;
  background-color: #fff;
  margin-bottom: 8px;

  .company-name {
    font-size: 14px;
    color: #3c4144;
    line-height: 22px;
    font-weight: 500;
    margin-bottom: 16px;
    display: flex;
    align-items: center;

    img {
      margin-left: 4px;
    }
  }

  .company-item {
    display: flex;
    margin-bottom: 9px;

    .item-lable {
      text-align: end;
      font-size: 14px;
      color: #737475;
      line-height: 22px;
      width: 70px;
    }

    .item-content {
      color: #606266;
      line-height: 22px;
    }
  }
}

.view-all-btn {
  color: #fd953e;
  cursor: pointer;
  font-size: 14px;
}

.workbench-select {
  width: 100px;

  :deep(.el-input__inner) {
    border: none;
  }

  :deep(.el-input__suffix) {
    right: 20px;
  }
}
</style>
