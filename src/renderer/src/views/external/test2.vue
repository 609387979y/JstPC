<template>
  <div class="main-container">
    <div class="header">
      <div class="left"></div>

      <div style="flex: 1; height: 100%" class="center center-area"></div>
      <div class="right">
        <div class="user-info-menu">
          <div class="window-btns">
            <div @click="reloadWebView" class="btns"><el-icon  :size="18" style="margin-right:8px"><Refresh /></el-icon> 刷新</div>
            <div @click="goBackWebView" class="btns"><el-icon  :size="18" style="margin-right:8px"><Back /></el-icon> 返回</div>
            
          </div>
          <!-- <div class="window-btns">
            <div @click="$router.go(0)" class="btns">
              返回首页
            </div>
            </div> -->

          <div class="window-btns">
            <div @click="windowOpt('min')" class="btns">
              <el-icon :size="18">
                <minus />
              </el-icon>
            </div>
            <div @click="windowOpt('max')" style="padding-bottom: 9px" class="btns">
              <el-icon :size="18">
                <img src="@/assets/maximize.svg" />
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
import { Minus, Close ,Back,Refresh} from "@element-plus/icons";
import { getElectronAgent } from "@share/agent";
import { useStore } from "vuex";
export default defineComponent({
  setup() {
    const store = useStore();
    console.log(store.state.auth);
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
    padding: 8px;
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
