<template>
  <div class="container">
    <div class="top">
      <div
        @click="toPage('/fastCargo/fastCargoWorkbench')"
        :selected="routeEqual('/fastCargo/fastCargoWorkbench')"
        class="menu-item"
        :class="routeEqual('/fastCargo/fastCargoWorkbench') ? 'menu-item-selected' : ''"
      >
        <img
          v-if="routeEqual('/fastCargo/fastCargoWorkbench')"
          src="@/assets/menu/fast-cargo-workbench.svg"
        />
        <img v-else src="@/assets/menu/fast-cargo-workbench.svg" />
        抢舱工作台
      </div>
      <div
        @click="toPage('/fastCargo/fastCargoTaskManage')"
        class="menu-item"
        :class="routeEqual('/fastCargo/fastCargoTaskManage') ? 'menu-item-selected' : ''"
      >
        <img
          v-if="routeEqual('/fastCargo/fastCargoTaskManage')"
          src="@/assets/menu/fast-cargo-managent.svg"
        />
        <img v-else src="@/assets/menu/fast-cargo-managent.svg" />
        抢舱任务管理
      </div>
      <div
        @click="toPageCertify('/fastCargo/FastCargoCostLog')"
        class="menu-item"
        :class="routeEqual('/fastCargo/FastCargoCostLog') ? 'menu-item-selected' : ''"
      >
        <img
          v-if="routeEqual('/fastCargo/FastCargoCostLog')"
          src="@/assets/menu/fast-cargo-consume.svg"
        />
        <img v-else src="@/assets/menu/fast-cargo-consume.svg" />
        消费记录
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Menu, Setting, List } from "@element-plus/icons";
import MenuItem from "./MenuItem.vue";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    Menu,
    MenuItem,
    Setting,
    List,
  },
  data() {
    return {
      getCount:null
    };
  },
  methods: {
    toPage(path) {
      this.$router.push(path);
    },
    toPageCertify(path){
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

  },
  computed: {
    currentRoute() {
      return this.$route.path.toLowerCase();
    },
  },
  created() {},
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
  background-color: #fff;
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
  background: #FFEDD3;
  opacity: 1 !important;
}
.menu-item {
  line-height: 48px;
  padding: 4px;
  transition: 0.3s;
  color: #333;
  &:hover {
    background: #FFEDD3;
    opacity: 1;
  }
  cursor: pointer;
  opacity: 0.7;
  display: flex;
  align-items: center;
  padding: 0 13px;
  img {
    margin-right: 8px;
  }
}
.top {
  padding-top: 26px;
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
</style>
