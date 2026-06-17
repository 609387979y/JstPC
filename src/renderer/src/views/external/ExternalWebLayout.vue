<template>
  <div class="main-container">
    <div class="header">
      <div class="left">
        <div @click="goBackWebView" class="btns left-btn">
          <el-icon :size="18"><ArrowLeft /></el-icon>
        </div>
        <div @click="goForWordWebView" class="btns left-btn">
          <el-icon :size="18"><ArrowRight /></el-icon>
        </div>
        <div @click="reloadWebView" class="btns left-btn">
          <el-icon :size="18"><Refresh /></el-icon>
        </div>
      </div>

      <div style="flex: 1; height: 100%" class="center center-area"></div>
      <div class="right">
        <div class="user-info-menu">
          <div class="window-btns"></div>
          <!-- <div class="window-btns">
            <div @click="$router.go(0)" class="btns">
              返回首页
            </div>
            </div> -->

          <div style="font-size: 18px" class="window-btns">
            <div @click="windowOpt('min')" class="btns">
              <el-icon :size="18">
                <minus />
              </el-icon>
            </div>
            <div @click="windowOpt('max')" style="padding-bottom: 5px" class="btns">
              <el-icon :size="18">
                <img style="width: 14px" src="@/assets/maximize-1.svg" />
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
    <!-- tab栏 start -->
    <div class="tab-bar">
      <el-tabs
        v-model="tab.activeTab"
        size="small"
        type="card"
        class="outer-tab"

        :ref="(v) => (tab.tabRef = v)"
      >
        <el-tab-pane
          v-for="(tabItem, idx) in tab.tabs"
          :label="tabItem.title"
          :name="tabItem.route"
        >
          <template #label>
            <v-contextmenu :ref="tabItem.route">
              <v-contextmenu-item @click="(ev) => tab.onTabRemove(tabItem.route, ev)"
                >关闭</v-contextmenu-item
              >
              <v-contextmenu-item @click="(ev) => tab.closeOtherTabs(tabItem.route, ev)"
                >关闭其他菜单</v-contextmenu-item
              >
              <v-contextmenu-item @click="(ev) => tab.closeRightTabs(tabItem.route, ev)"
                >关闭右侧菜单</v-contextmenu-item
              >
            </v-contextmenu>
            <span @click="tab.tabClick(tabItem)" class="tab-dragable-item" :idx="idx" v-contextmenu:[tabItem.route]>
              {{ tabItem.title }}
            </span>
            
              <span @click="(ev) => tab.onTabRemove(tabItem.route, ev)">
                <el-icon><Close :size="14" /></el-icon>
              </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- tab栏 end -->
    <div class="main-content">
      <el-container style="height: 100%">
        <el-main class="view">
          <el-scrollbar class="view-content">
            <router-view v-slot="{ Component, route }">
              <keep-alive>
                <component
                  :key="route.fullPath"
                  :is="Component"
                  v-if="$route.meta.keepAlive"
                />
              </keep-alive>
              <component
                :key="route.fullPath"
                :is="Component"
                v-if="!$route.meta.keepAlive"
              />
            </router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { computed, reactive, onMounted } from "vue";
import { Minus, Close, Back, Refresh, ArrowLeft, ArrowRight } from "@element-plus/icons";
import { getElectronAgent } from "@share/agent";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import tabRef from "@/composables/externalWebLayout/useTab";
import { directive, Contextmenu, ContextmenuItem } from "v-contextmenu";
import "v-contextmenu/dist/themes/default.css";
export default defineComponent({
  setup() {
    const store = useStore();
    const agent = getElectronAgent();
    const router = useRouter();
    // tab页相关
    const tab = tabRef(store, router);
    if (agent != null) {
      agent.ipcRequest("external/setViewType", "normal");
    }

    function windowOpt(opt) {
      if (opt == "close") {
        tab.closeAllTabs();
      }
      agent.ipcRequest("external/opt", opt);
    }
    let listener = null;
    onMounted(() => {
      store.dispatch("pay/refreshBalance");
      agent.ipcRequest("loading/closeCover", window._ELECTRON_WINDOW_ID_);
      listener = window.$ipc.on("externalweb/newtab", (_, url) => {
        router.openTab(url)
      });
    });

    return {
      windowOpt,
      tab,
    };
  },
  directives: {
    contextmenu: directive,
  },
  components: {
    Minus,
    Close,
    Back,
    Refresh,
    ArrowLeft,
    ArrowRight,
    [Contextmenu.name]: Contextmenu,
    [ContextmenuItem.name]: ContextmenuItem,
  },
  data() {
    return {};
  },
  methods: {
    reloadWebView() {
      const webview = document.getElementById("userCenterView");
      webview.reload();
    },
    goBackWebView() {
      const webview = document.getElementById("userCenterView");
      webview.goBack();
    },
    goForWordWebView() {
      const webview = document.getElementById("userCenterView");
      webview.goForward();
    },
  },
  mounted() {
    // this.externalUrl=this.$route.query.url
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
.center-area {
  position: relative;
  -webkit-app-region: drag;
}

$header-height: 51px;
.header {
  height: $header-height;
  color: #808080;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 19px;
  background-color: #ebebeb;
  position: relative;

  .left {
    -webkit-app-region: no-drag;
    display: flex;
    .left-btn {
      margin-right: 18px;
      cursor: pointer;
    }
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
      background-color: #e2e2e2;
    }
  }
}
.outer-tab {
  width: 100%;
  height: 28px;
  background-color: #ebebeb;
  overflow: hidden;
  ::v-deep(.el-tabs__item) {
    color: rgb(78, 78, 78);
    background: #e6e6e6;
    // border:1px solid #0066da;
  }
  ::v-deep(.el-tabs__item, .el-tabs__item:last-child) {
    height: 29px;
    line-height: 29px;
    // width:85px;
    padding: 0 10px !important;
    text-align: center !important;
  }
  ::v-deep(.is-active) {
    background: #f7f8fa;
    color: #808080;
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
  ::v-deep(.el-tabs__nav-scroll) {
    padding: 0 17px;
  }
  ::v-deep(.el-tabs__nav-next) {
    line-height: 30px;
  }
  ::v-deep(.el-tabs__nav-prev) {
    line-height: 30px;
  }
  ::v-deep(.el-icon-close) {
    width: 14px !important;
  }
}
.tab-bar {
  :deep(.el-tabs__nav-scroll) {
    padding-left: 15px;
  }
  :deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
    border-bottom-color: rgba(255, 255, 255, 0);
  }
  :deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
    border-top-color: rgba(255, 255, 255, 0);
  }
  :deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
    border-left-color: rgba(255, 255, 255, 0);
    border-right-color: rgba(255, 255, 255, 0);
  }

  :deep(.el-tabs__item) {
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
    &.is-active {
      opacity: 1;
    }
  }
}
</style>
