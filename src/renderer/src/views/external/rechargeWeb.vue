<template>
  <div>
    <webview
      id="userCenterView"
      :src="externalUrl"
      style="width: 100%; height: calc(100vh - 84px)"
    >
    </webview>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { computed, reactive, onMounted } from "vue";
import { Minus, Close, Back, Refresh } from "@element-plus/icons";
import { getElectronAgent } from "@share/agent";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import tabRef from "@/composables/externalWebLayout/useTab";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const tab = tabRef(store, router);
    onMounted(() => {
      const webview = document.getElementById("userCenterView");
      webview.addEventListener("new-window", (e) => {
        webview.src = e.url;
      });
      webview.addEventListener("close", () => {
        tab.removeTab(route.fullPath);
      });
      webview.addEventListener("page-title-updated", (e) => {
        route.meta.title = e.title;
        tab.reFreshTab();
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
  methods: {},
  async mounted() {
    let type = this.$route.query.type;
    if (type == "recharge") {
      let res = await this.$http.get("/api/page/AuthRedirect", {
        url: "/workbench/recharge",
      });
      this.externalUrl = res;
    } else {
      this.externalUrl = this.$store.state.externalUrl.rechargeUrl;
    }
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
