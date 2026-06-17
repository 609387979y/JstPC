<template>
  <div class="main-container">
    <div class="header">
      <div class="left">
        <div @click="goBackWebView" class="btns left-btn"><el-icon  :size="18"><ArrowLeft /></el-icon> </div>
        <div @click="goForWordWebView" class="btns left-btn"><el-icon  :size="18"><ArrowRight /></el-icon> </div>
          <div @click="reloadWebView" class="btns left-btn"><el-icon  :size="18"><Refresh /></el-icon> </div>
            
      </div>

      <div style="flex: 1; height: 100%" class="center center-area"></div>
      <div class="right">
        <div class="user-info-menu">
          <div class="window-btns">
            
            
          </div>
          <!-- <div class="window-btns">
            <div @click="$router.go(0)" class="btns">
              返回首页
            </div>
            </div> -->

          <div style="font-size:18px;" class="window-btns">
            <div @click="windowOpt('min')" class="btns">
              <el-icon :size="18">
                <minus />
              </el-icon>
            </div>
            <div @click="windowOpt('max')" style="padding-bottom: 5px" class="btns">
              <el-icon :size="18">
                <img style="width:14px" src="@/assets/maximize-1.svg" />
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
    <div class="main-content">
      <el-container style="height: 100%">
        <el-main class="view">
          <el-scrollbar class="view-content">
            <webview
              id="userCenterView"
              :src="externalUrl"
              style="width: 100%; height: calc(100vh - 66px)"
            >
            </webview>
          </el-scrollbar>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { computed, reactive, onMounted } from "vue";
import { Minus, Close ,Back,Refresh,ArrowLeft,ArrowRight} from "@element-plus/icons";
import { getElectronAgent } from "@share/agent";
import { useStore } from "vuex";
export default defineComponent({
  setup() {
    const store = useStore();
    const agent = getElectronAgent();
    if (agent != null) {
      agent.ipcRequest("external/setViewType", "normal");
    }

    function windowOpt(opt) {
      agent.ipcRequest("external/opt", opt);
    }
    
    onMounted(() => {
      store.dispatch("pay/refreshBalance");
      agent.ipcRequest("loading/closeCover", window._ELECTRON_WINDOW_ID_);
    });

    return {
      windowOpt,
    };
  },
  components: {
    Minus,
    Close,
    Back,
    Refresh,
    ArrowLeft,
    ArrowRight,
  },
  data() {
    return {
      externalUrl: "",
    };
  },
  methods: {
    reloadWebView(){
        const webview = document.getElementById("userCenterView");
        webview.reload()
    },
    goBackWebView(){
         const webview = document.getElementById("userCenterView");
        webview.goBack()
    },
    goForWordWebView(){
        const webview = document.getElementById("userCenterView");
        webview.goForward()
    }
  },
  mounted() {
    // this.externalUrl=this.$route.query.url
    this.externalUrl = this.$route.query.url;
    const webview = document.getElementById("userCenterView");
    webview.addEventListener("new-window", (e) => {
      webview.src = e.url;
    });
    
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
    height: calc(100vh - 67px);
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
    .left-btn{
      margin-right:18px;cursor: pointer;
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
      // color:white
    }
  }
}
</style>
