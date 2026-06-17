<template>
  <div class="vgm-container">
    <div class="title">新建VGM</div>
    <div class="btns">
      <div>
        <el-button @click="showPreview">
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
        <el-button @click="saveDraft">
          <el-icon>
            <folder /> </el-icon
          >保存草稿
        </el-button>

        <el-button @click="clickSaveAndSubmit" type="primary">
          <el-icon>
            <promotion /> </el-icon
          >保存并发送
        </el-button>
      </div>
      <div>
        <el-button @click="copy">
          <el-icon>
            <document-copy /> </el-icon
          >复制
        </el-button>
        <el-button @click="reset">
          <el-icon>
            <refresh-right /> </el-icon
          >重置
        </el-button>
      </div>
    </div>

    <VGMEditor ref="vgmEditor"></VGMEditor>
  </div>
  <VGMPreviewDialog
    @saveDraft="saveDraft"
    @submit="clickSaveAndSubmit"
    ref="previewDialog"
  ></VGMPreviewDialog>

  <VGMSendConfirmDialog
    @confirm="saveAndSubmit"
    ref="sendConfirmDialog"
  ></VGMSendConfirmDialog>
</template>

<script>
import { defineComponent } from "vue";
import VGMEditor from "./components/VGMEditor.vue";
import VGMPreviewDialog from "./components/VGMPreviewDialog.vue";
import {
  Edit,
  Folder,
  Clock,
  Promotion,
  Download,
  DocumentCopy,
  RefreshRight,
} from "@element-plus/icons";
import VGMSendConfirmDialog from "./components/VGMSendConfirmDialog.vue";
import * as types from "./components/types";
export default defineComponent({
  components: {
    VGMEditor,
    Edit,
    Folder,
    Clock,
    Promotion,
    Download,
    DocumentCopy,
    RefreshRight,
    VGMPreviewDialog,
    VGMSendConfirmDialog,
  },
  data() {
    return {
      manifestId: 0,
      timestamp: 0,
    };
  },
  methods: {
    reset() {
      this.$refs.vgmEditor.reset();
      this.$message.success("重置成功");
    },
    async copy() {
      this.$message.success("复制成功");
    },
    /**
     * 预览
     */
    async showPreview() {
      let res = await this.$refs.vgmEditor.save({ validate: false });
      this.$refs.previewDialog.openPreviewDialog(res);
    },
    /**
     * 保存草稿
     */
    async saveDraft() {
      let data = await this.$refs.vgmEditor.save({ validate: false });

      let res = await this.$http.post("/api/CargoEDISHVGMDraft/CreateDraft", data);
      if (!res.Status) {
        this.$message.error(res.Message ?? "失败");
        return;
      }
      this.$message.success("保存草稿成功");
      // 离开时重置数据
      this.$refs.vgmEditor.reset();
      this.$router.push({
        path: "/manifest/vgm/VGMNrafts",
      });
    },
    async clickSaveAndSubmit() {
      let data = await this.$refs.vgmEditor.save({ validate: true });
      this.$refs.sendConfirmDialog.showConfirmDialog(data);
    },
    /**
     * 保存并发送VGM
     */
    async saveAndSubmit() {
      let data = await this.$refs.vgmEditor.save({ validate: true });
      let res = await this.$http.post("/api/CargoEDISHVGM/CreateAndSendVGM", data);
      if (!res.Status) {
        this.$message.error(res.Message ?? "失败");
        return;
      }
      this.$message.success("成功");
      // 离开时重置数据
      this.$refs.vgmEditor.reset();
      this.$router.push({
        path: "/manifest/vgm/VGMSend",
      });
    },
    async loadManifestData(id) {
      await this.$refs.vgmEditor.reset();
      let res = await this.$http.get("/api/CargoEDISHManifest/GetInfo", {
        id: id,
      });
      if (!res.Status) {
        this.$message.error(res.Message ?? "失败");
        return;
      }

      let data = res.Data;

      let model = new types.CargoVGMModel();
      model.Id = 0;

      if (data.Type == 0) {
        // 港口
        model.Port = "上海";
        model.PortName = "上海";
      }
      // 船司
      model.Shipping = data.ShippingCode;
      model.ShippingName = data.ShippingName;
      // 提单号
      model.CGO_MBL_NO = data.CGO_MBL_NO;

      // 船名航次
      model.CGO_VES = data.CGO_VES;
      model.CGO_VOY = data.CGO_VOY;

      // 详情
      if (data.Details.length > 0) {
        model.OwnerBoxSign = data.Details[0].OwnerBoxSign;
        for (let detail of data.Details) {
          const item = new types.CargoEDI_VGMDetail();
          item.CGO_CNNO = detail.CGO_CNNO;
          // item.VGM = detail.CGO_WGT
          model.Details.push(item);
        }
      }

      await this.$refs.vgmEditor.load(model);
    },
  },
  activated() {
    // 有id则加载数据
    if (
      (this.$route.query.manifestId && this.$route.query.manifestId != this.manifestId) ||
      (this.$route.query.manifestId == this.manifestId &&
        this.$route.query.timestamp != this.timestamp)
    ) {
      this.manifestId = this.$route.query.manifestId;
      this.timestamp = this.$route.query.timestamp;
      this.loadManifestData(this.manifestId);
    }

    // 没有则判断timestamp是否相同
    if (this.$route.query.timestamp != this.timestamp) {
      this.timestamp = this.$route.query.timestamp;
      this.$refs.vgmEditor.reset();
    }
  },
});
</script>

<style lang="scss" scoped>
.vgm-container {
  // height: 100%;
  background-color: #fff;
  padding: 19px 24px;

  .title {
    font-size: 14px;
    color: #303133;
    letter-spacing: 0;
    font-weight: 500;
  }

  .btns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 17px;
    margin-top: 17px;

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
</style>
