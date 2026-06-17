<template>
  <div class="manifest-content">
    <manifestTipsVue
      v-if="type == 'fail'"
      tiptype="error"
      title="校验失败"
      :content="infoData.FailReason"
    ></manifestTipsVue>

    <div class="btns">
      <div>
        <el-button @click="openPreviewDialog">
          <el-icon
            ><svg
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              data-v-ba633cb8=""
            >
              <path
                fill="currentColor"
                d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"
              ></path></svg
          ></el-icon>
          预览
        </el-button>
        <el-button v-if="type == 'fail'" @click="save">
          <el-icon> <folder /> </el-icon>保存
        </el-button>
        <el-button @click="saveAndSend" type="primary">
          <el-icon> <promotion /> </el-icon>{{ submitAndSendText }}
        </el-button>
      </div>
      <div>
        <el-button @click="loadData">
          <el-icon> <refresh-right /> </el-icon>重置
        </el-button>
      </div>
    </div>

    <ManifestEditor
      :disableProps="disableProps"
      autoValidate
      :key="editorKey"
      ref="editor"
    ></ManifestEditor>
    <ManifestPreviewDialog ref="previewDialog"></ManifestPreviewDialog>
    <ManifestJxDialog ref="JxDialog" @jxsave="jxsetmodel"></ManifestJxDialog>
  </div>
  <JstActionBar>
    <el-button @click="openPreviewDialog">
      <el-icon
        ><svg
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          data-v-ba633cb8=""
        >
          <path
            fill="currentColor"
            d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"
          ></path></svg
      ></el-icon>
      预览
    </el-button>
    <!-- 只有失败的时候可以临时保存 -->
    <el-button v-if="type == 'fail'" @click="save">
      <el-icon> <folder /> </el-icon>保存
    </el-button>
    <el-button @click="saveAndSend" type="primary">
      <el-icon> <promotion /> </el-icon>{{ submitAndSendText }}
    </el-button>
  </JstActionBar>
    <SendConfirmDialog @confirm="sendModify" ref="sendConfirmDialog"></SendConfirmDialog>
  
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import ManifestEditor from "./components/ManifestEditor.vue";
import * as types from "./components/types";
import { ElMessage } from "element-plus";
import ManifestPreviewDialog from "./components/ManifestPreviewDialog.vue";
import manifestTipsVue from "./components/manifestTips.vue";
import ManifestJxDialog from "./components/ManifestJxDialog.vue";
import SendConfirmDialog from "./components/SendConfirmDialog.vue"
import {
  Download,
  Edit,
  Clock,
  Folder,
  Promotion,
  RefreshRight,
  DocumentCopy,
} from "@element-plus/icons";

export default defineComponent({
  components: {
    ManifestEditor,
    ManifestPreviewDialog,
    manifestTipsVue,
    ManifestJxDialog,
    Download,
    Edit,
    Clock,
    Folder,
    Promotion,
    RefreshRight,
    DocumentCopy,
    SendConfirmDialog
  },
  data() {
    return {
      editorKey: 0,
      id: 0,
      infoData: {},
      timestamp: 0,
      type: "fail", // modify -> 发送修改报文 /  fail -> 编辑错误
      modifyModel:{}
    };
  },
  computed: {
    disableProps() {
      if (this.type == "fail") {
        return {
          CGO_MBL_NO: true,
          CGO_VES: false,
          CGO_VOY: false,
          ShippingCode: false,
          ShipAgentCode:false,
          DetailCGO_MBL_NO: true,
          DetailCGO_DESC: false,
          DetailCGO_CNNO: false,
          DetailCGO_SEALNO: false,
        };
      } else {
        return {
          CGO_MBL_NO: true,
          CGO_VES: true,
          CGO_VOY: true,
          ShippingCode: true,
          ShipAgentCode:true,
          DetailCGO_MBL_NO: true,
          DetailCGO_DESC: true,
          DetailCGO_CNNO: true,
          DetailCGO_SEALNO: true,
        };
      }
    },
    submitAndSendText() {
      if (this.type == "fail") {
        return "提交发送";
      } else {
        return "发送修改舱单";
      }
    },
  },
  methods: {
    /**
     * 打开preview
     */
    async openPreviewDialog() {
      let model = await this.$refs.editor.save({
        validate: false,
      });

      this.$refs.previewDialog.openPreviewDialog(model);
    },

    openJxDialog() {
      this.$refs.JxDialog.openJxDialog();
    },
    jxsetmodel(res) {
      this.$refs.editor.load(res.Data);
    },

    /**
     * 加载数据
     */
    async loadData() {
      let res = await this.$http.get("/api/CargoEDISHManifest/GetInfo", {
        id: this.id,
      });
      if (!res.Status) {
        this.$message.error(res.Message ?? "失败");
        return;
      }
      this.infoData = res.Data;
      this.$refs.editor.load(res.Data);
    },
    /**
     * 保存
     */
    async save() {
      let model = await this.$refs.editor.save({
        validate: false,
      });

      model.Id = this.id;
      let res = await this.$http.post("/api/CargoEDISHManifest/UpdateSendFail", model);

      if (!res.Status) {
        this.$message.error(res.Message ?? "失败");
        return;
      }
      this.$message.success("保存成功");
    },
    /**
     * 保存并发送
     */
    async saveAndSend() {
      let model = await this.$refs.editor.save({
        validate: true,
      });

      if (model == null) {
        this.$message.warning("验证失败");
        return;
      }
      model.Id = this.id;
      if (this.type == "fail") {
        let res = await this.$http.post(
            "/api/CargoEDISHManifest/UpdateSendFailAndSubmit",
            model
        );
        if (!res.Status) {
            this.$message.error(res.Message ?? "失败");
            return;
        }
        this.$message.success("成功");
        this.$router.push("/manifest/Hasbeensent");
      }else{
        this.modifyModel = model;

        this.$refs.sendConfirmDialog.showConfirmDialogModifyOrDelete(model.Id,1)
      }

    },
    async sendModify(){

        // 修改报文的时候 先弹窗
        let res = await this.$http.post(
            "/api/CargoEDISHManifest/CreateModifyManifest",
            this.modifyModel
        );
        if (!res.Status) {
            this.$message.error(res.Message ?? "失败");
            return;
        }
        this.$message.success("已发送修改报文,请等待回执");
        this.$router.push("/manifest/Hasbeensent");
    }
  },
  activated() {
    this.type = this.$route.query.type;

    if (this.id != this.$route.query.id) {
      this.id = this.$route.query.id;
      this.loadData();
    } else {
      if (this.timestamp != this.$route.query.timestamp) {
        this.timestamp = this.$route.query.timestamp;
        this.loadData();
      }
    }
  },
});
</script>
<style lang="scss" scoped>
.manifest-content {
  background-color: #fff;
  padding: 16px 10px;

  .btns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 17px;

    :deep(.el-button) {
      min-height: 25px;
      height: 25px;
      line-height: 25px;
      padding: 0px 15px;

      &.el-button--primary {
        background: #8dce6c;
        border-color: #8dce6c;

        &:hover {
          opacity: 0.7;
        }
      }

      i {
        margin-right: 4px;
      }
    }
  }
}

.title {
  font-size: 14px;
  color: #303133;
  letter-spacing: 0;
  font-weight: 500;
}
</style>
