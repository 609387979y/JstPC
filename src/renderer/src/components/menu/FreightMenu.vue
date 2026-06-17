<template>
  <div class="container">
    <div class="top">
      <div
        @click="toPage('/freightRate/PriceQuery')"
        :selected="routeEqual('/freightRate/PriceQuery')"
        class="menu-item"
        :class="routeEqual('/freightRate/PriceQuery') ? 'menu-item-selected' : ''"
      >
        <img
          v-if="routeEqual('/freightRate/PriceQuery')"
          src="@/assets/menu/price-query-selected.svg"
        />
        <img v-else src="@/assets/menu/price-query.svg" />
        推荐运价
      </div>
      <div
        @click="toPage('/freightRate/FreightSearch')"
        class="menu-item"
        :class="routeEqual('/freightRate/FreightSearch') ? 'menu-item-selected' : ''"
      >
        <img
          v-if="routeEqual('/freightRate/FreightSearch')"
          src="@/assets/menu/freight-search-selected.svg"
        />
        <img v-else src="@/assets/menu/freight-search.svg" />
        搜索运价
      </div>
      <div
        @click="toPageCertify('/freightRate/ConsultPrice')"
        class="menu-item"
        :class="routeEqual('/freightRate/ConsultPrice') ? 'menu-item-selected' : ''"
      >
        <img
          v-if="routeEqual('/freightRate/ConsultPrice')"
          src="@/assets/menu/consult-price-selected.svg"
        />
        <img v-else src="@/assets/menu/consult-price.svg" />
        询价沟通
        <span class="inquire-Count" v-if="$store.state.message.unReadConsultPriceCount">{{ $store.state.message.unReadConsultPriceCount }} </span>
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
        this.$agent().ipcRequest("freight/newWin", {
          type: "small",
          url: "/internalComponents/userAuthorization?type=freight",
        });
        return this.$message.warning("请先进行企业认证");
      }
      this.$router.push(path);
    },
    routeEqual(path) {
      return path.toLowerCase() === this.currentRoute;
    },
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
  created() {},
  async mounted() {
    /*获取新报价数量*/
    await this.$store.dispatch("message/getUnReadMessageCount")
    //  this.getCount = setInterval(() => {
    //   this.$store.dispatch("message/getUnReadMessageCount")
    // }, 30000);
    // this.getInquireNewCount();
  },
});
</script>

<style lang="scss" scoped>
.container {
  background-color: #292720;
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
  background: #44413b;
  opacity: 1 !important;
}
.menu-item {
  line-height: 48px;
  padding: 4px;
  transition: 0.3s;
  color: white;
  &:hover {
    background: #44413b;
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
