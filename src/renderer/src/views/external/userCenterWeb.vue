<template>
  <div>
    <webview id="userCenterView" :src="externalUrl" style="width: 100%; height: calc(100vh - 84px)">
    </webview>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { computed, reactive, onMounted } from "vue";
import { Minus, Close, Back, Refresh } from "@element-plus/icons";
import { getElectronAgent } from "@share/agent";
import { useRoute, useRouter } from "vue-router";
import tabRef from "@/composables/externalWebLayout/useTab";

import { useStore } from "vuex";
export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    // tab页
    const tab = tabRef(store, router);
    onMounted(() => {
      const webview = document.getElementById("userCenterView");
      webview.addEventListener("new-window", (e) => {
        // webview.src = e.url;
        if (e.url) {
          router.openTab(`/rechargeWeb`);
          store.dispatch("externalUrl/setRecharge", e.url);
        } else {
          webview.src = e.url;
        }
      });
      webview.addEventListener("page-title-updated", (e) => {
        route.meta.title = e.title
        tab.reFreshTab()
      });
    });

    return {};
  },
  components: {
    Minus,
    Close,
    Back,
    Refresh,
  },
  data() {
    return {
      externalUrl: "",
    };
  },
  methods: {
    go() {
      this.$router.openTab(`/rechargeWeb`);
    },
  },
  async mounted() {
    let url = "";
    let type = this.$route.query.type;
    switch (type) {
      case "personal":
        this.$route.meta.title = "个人中心";
        url = "/workbench/personal";
        break;
      case "companySignAuth":
        this.$route.meta.title = "企业认证";
        url = "/workbench/companySignAuth";
        break;
      case "userWallet":
        this.$route.meta.title = "充值记录";
        url = "/workbench/userWallet";
        break;
      case "userBill":
        this.$route.meta.title = "消费记录";
        url = "/workbench/userBill";
        break;
    }

    let res = await this.$http.get("/api/page/AuthRedirect", {
      url: url,
    });
    this.externalUrl = res;

    // this.externalUrl = 'http://localhost:3001/#/workbench/personal'
  },
});
</script>

<style lang="scss" scoped>
.main-container {
  background-color: #f7f8fa;
  height: 100%;

  .view {
    padding: 0px;
  }

  .view-content {
    padding: 8px;
    // min-width: 1400px;
    height: calc(100vh - 88px);
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

$header-height: 51px;

.header {
  height: $header-height;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 19px;
  background-color: #3694ff;
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
      background-color: #4a9df8;
    }
  }
}
</style>
