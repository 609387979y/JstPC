<template>
  <div class="dialog-container">
    <el-dialog
      v-model="dialog.dialogVisible"
      title="Tips"
      width="600px"
      :before-close="dialog.handleClose"
    >
      <template #title>
        <div class="dialog-title">
          <div>给客户报价</div>
        </div>
      </template>
      <div class="body">
        <el-input v-model="dialog.offerPirceText" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea"> </el-input>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button class="freight-default-button" @click="dialog.dialogVisible = false">取消</el-button>
        <el-button @click="dialog.copyText" style="background: #FD953E;" type="warning">复制文本</el-button>

      </span>
    </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import request from "@/public/request.ts";
import copy from "copy-to-clipboard";
import { ElMessage } from "element-plus";
/*唤起&关闭对话框*/
function dialogs() {
  const dialogVisible = ref(false);
  const offerPirceText = ref(null);
  const inquireInfoId = ref(null);
  function handleClose() {
    dialogVisible.value = false;
  }
  function handleOpen(Id) {
      getData(Id)
    dialogVisible.value = true;
  }
  async function getData(Id) {
        const res = await request.get("/api/FRRateCus/GetCusRateString", {
      RateId: Id,
    });
    offerPirceText.value=res.Data
  }
  function copyText(){
      copy(offerPirceText.value);
        ElMessage.success("复制成功！");
  }
  return reactive({
    offerPirceText,
    dialogVisible,
    handleClose,
    handleOpen,
    copyText,
  });
}
export default defineComponent({
  name: "inquiryPriceDialog",
  setup() {
    const dialog = dialogs();
    return {
      dialog,
    };
  },
});
</script>

<style scoped lang="scss">
.dialog-title {
  font-size: 14px;
  color: #303133;
  font-weight: bold;
}
.body {
  margin-top: -20px;
}
</style>
