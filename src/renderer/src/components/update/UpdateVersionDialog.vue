<template>
  <el-dialog v-model="show" title="更新版本" width="381px">
    <div>版本:{{ latestVersion }}</div>
    <div v-html="updateRemark"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show = false">暂不升级</el-button>
        <el-button @click="quitAndInstall" type="primary">立即更新</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="jsx">
import { defineComponent, h, resolveComponent, computed, onMounted } from "vue";
import env from "@share/env";
import { useStore } from "vuex";
import { ElNotification, ElProgress } from "element-plus";
import updateStore from "@/store/modules/update";

const processComponent = defineComponent({
  props: {
    content: String,
  },
  data: () => {
    return {
      progress: 0,
    };
  },
  created() {
    window.$ipc.on("update/progress", (_, arg) => {
      this.progress = parseInt(arg.percent);
    });
  },
  render() {
    const processCom = ElProgress;
    return h(
      "div",
      {
        style: {
          width: "321px",
        },
      },
      [
        h("div", {}, this.content),
        h(
          processCom,
          {
            percentage: this.progress,
          },
          ""
        ),
      ]
    );
  },
});

export default defineComponent({
  components: {},
  data() {
    return {
      show: false,
      updateRemark: "",
      notifyInstance:null
    };
  },

  methods: {
    async fetchLatestVersionInfo() {
      let res = await this.$http.get("/api/WayApp/GetAppUpdateInfo", {
        platform: env.platform,
        version: this.latestVersion,
      });
      if (res.Status == false) {
        console.error(res.Message);
        return;
      }
      this.updateRemark = res.Data.Description;
    },

    async showDialog() {
      this.show = true;
      if(this.notifyInstance != null){
        this.notifyInstance.close();
      }
    },
    quitAndInstall() {
      this.$agent().ipcRequest("update/quitAndInstall");
    },
    openNotify(content) {
      if (this.show) {
        // 有弹窗出来了就不显示了
        return;
      }
      //ElProgress
      const processCom = processComponent;

      this.notifyInstance = ElNotification({
        title: "版本更新 " + this.$store.state.update.latestVersion,
        duration: 0,
        message: h(processCom, {
          content: content,
        }),
      });

    
    },
  },
  computed: {
    latestVersion() {
      return this.$store.state.update.latestVersion;
    },
    progress() {
      return this.$store.state.update.progress;
    },
  },
  mounted() {
    const agent = this.$agent();
    if (agent != null && window._ELECTRON_WINDOW_NAME_ == "main") {
      window.$ipc.on("update/log", (_, args) => {
        console.log(args);
      });
      window.$ipc.on("update/progress", (_, arg) => {
        this.$store.commit("update/setProgress", arg.percent);
      });

      window.$ipc.on("update/available", async (_, arg) => {
        // 最新版本
        this.$store.commit("update/setLatestVersion", arg.value.version);
        await this.fetchLatestVersionInfo();
        setTimeout(()=>{
          this.openNotify(this.updateRemark);
        },1000)

      });

      window.$ipc.on("update/downloaded", async (_, arg) => {
        // 完成下载
        this.$store.commit("update/setLatestVersion", arg.value.version);
        await this.fetchLatestVersionInfo();
        this.showDialog();
      });

      agent.ipcRequest("update/checkUpdate");

    }
  },
});
</script>

<style lang="scss" scoped></style>
