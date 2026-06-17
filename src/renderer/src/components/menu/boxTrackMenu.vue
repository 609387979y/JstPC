<template>
  <div class="container">
    <div class="top">
      <el-menu :default-active="this.$route.path" class="el-menu-vertical-demo" @select="handleOpen"
        @close="handleClose">
        <el-sub-menu index="1">
          <template #title>
            <img src="@/assets/boxTrack/ckcx.svg" alt="" style="margin-right:5px">
            <span>出口查询</span>
          </template>
          <el-menu-item-group title="">
            <el-menu-item index="/internal/exitQuery">宁波港</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item-group title="">
          <el-menu-item index="/internal/recycleLog">
            <template #title>
              <img src="@/assets/boxTrack/hsz.svg" alt="" style="margin-right:5px">
              <span>回收站</span>
            </template>
          </el-menu-item>
        </el-menu-item-group>
        <!-- <el-menu-item-group title="">
          <el-menu-item index="/internal/consumeLogs">
            <template #title>
              <img src="@/assets/boxTrack/xfjl.svg" alt="" style="margin-right:5px">
              <span>消费记录</span>
            </template>
          </el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="">
          <el-menu-item index="/internal/companyLogs">
            <template #title>
              <img src="@/assets/boxTrack/xfjl.svg" alt="" style="margin-right:5px">
              <span>公司管理</span>
            </template>
          </el-menu-item>
        </el-menu-item-group> -->
        <el-sub-menu index="2">
          <template #title>
            <img src="@/assets/boxTrack/xfjl.svg" alt="" style="margin-right:5px">
            <span>消费记录</span>
          </template>
          <el-menu-item-group title="">
            <el-menu-item index="/internal/consumeLogs">个人</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="" v-if="IsAdmin">
            <el-menu-item index="/internal/companyLogs">企业</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Menu, Setting, List } from "@element-plus/icons";
import MenuItem from "./MenuItem.vue";
import request from "@/public/request";
export default defineComponent({
  components: {
    Menu,
    MenuItem,
    Setting,
    List,
  },
  data() {
    return {
      getCount: null,
      IsAdmin: false
    };
  },
  methods: {
    toPage(path) {
      this.$router.push(path);
    },
    toPageCertify(path) {
      if (!this.$store.state.auth.certificationStatus) {
        this.$agent().ipcRequest("window/newWin", {
          type: "small",
          url: "/internalComponents/userAuthorization",
        });
        return this.$message.warning("请先进行企业认证");
      }
      this.$router.push(path);
    },
    routeEqual(path) {
      return path.toLowerCase() === this.currentRoute;
    },
    handleOpen(path) {
      this.$router.push(path)
    }
    // async getInquireNewCount() {
    //   const res = await this.$http.get("/api/FRInquireCustomer/GetInquireNewCount");
    //   console.log(res, "resr");
    //   if (res) {
    //     this.inquireCount = res.All;
    //   }
    // },
  },
  computed: {
    currentRoute() {
      return this.$route.path.toLowerCase();
    },
  },
  created() {
    request.get("/api/CurrentEmployee/Current", {}, "currentEmployee/current").then((res) => {
      this.IsAdmin = res.Data.IsAdmin;
    })
  },
  async mounted() {
    /*获取新报价数量*/
    await this.$store.dispatch("message/getUnReadMessageCount")
    this.getCount = setInterval(() => {
      this.$store.dispatch("message/getUnReadMessageCount")
    }, 30000);
    // this.getInquireNewCount();
  },
});
</script>

<style lang="scss" scoped>
.container {
  background-color: #ffffff;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  box-shadow: inset -2px 0 2px rgb(228 231 237 / 45%);

  // min-height: 500px;
}

.space {
  width: 100%;
}

.menu-item-selected {
  background: #EFF6FC;
  opacity: 1 !important;
}

.menu-item {
  line-height: 48px;
  padding: 4px;
  transition: 0.3s;
  color: #3C4144;

  &:hover {
    background: #EFF6FC;
    opacity: 1;
  }

  cursor: pointer;
  opacity: 0.65;
  display: flex;
  align-items: center;
  padding: 0 13px;

  img {
    margin-right: 8px;
  }
}

.top {
  padding-top: 10px;
}

.bottom {
  // padding-bottom:26px;
}

.inquire-Count {
  color: white;
  background: red;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  position: absolute;
  line-height: 18px;
  font-size: 10px;
  left: 124px;
  text-align: center;
  vertical-align: middle;
}

::v-deep .el-sub-menu__title {
  padding-left: 15px !important;
}

::v-deep .el-menu-item-group__title {
  padding: 0;
}

::v-deep .el-menu {
  border: none;
}

::v-deep .el-menu-item.is-active {
  background-color: #EFF6FC;
  opacity: 1 !important;
}

::v-depp .el-aside {
  overflow: hidden;
}

::v-deep .el-sub-menu .el-menu-item {
  min-width: 100%;
}
</style>
