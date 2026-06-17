<template>
  <el-dialog
    @closed="dialogClose(2)"
    v-model="state.upVisible"
    title="提交托书"
    width="800px"
  >
    <JstNotice type="warning" style="margin-bottom: 15px">
      <template #title>
        为了保证托书的有效性，以下信息必须提供：收发通信息、货物信息、付款方式、箱型箱量、船公司、开航日期
      </template>
    </JstNotice>
    <BaseUploadBox
      ref="uplaodBox"
      v-show="state.files.length <= 0"
      @upload="uploadFile"
      accept=".xlsx,.xls,.jpg,.jpeg,.png,.pdf,.doc,.docx"
    ></BaseUploadBox>
    <div v-show="state.files.length > 0">
      <table class="files-table">
        <tr v-for="(item, i) in state.files" :key="i">
          <td class="name">{{ item.name }}</td>
          <td class="size">{{ (item.size / 1024).toFixed(2) }}kbs</td>
          <td class="handle">
            <el-button @click="reUpload(i)" type="text" style="color:#fd953e">重新上传</el-button>
            <el-button @click="remFile(i)" type="text" style="color:#fd953e">删除</el-button>
          </td>
        </tr>
      </table>
      <!-- <div @click="conUpload" class="upload-box">+ 继续上传</div>
      <el-button style="margin-top: 15px" @click="remFile()">
        清空文件
      </el-button> -->
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.upVisible = false">取消</el-button>
        <el-button
          type="warning"
          :disabled="state.files.length <= 0"
          @click="submit"
          :loading="state.submitLoading"
          style="--el-button-bg-color:#fd953e;"
        >
          上传
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, unref } from "vue";
import BaseUploadBox from "./BaseUploadBox.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@/public/request";
export default {
  components: { BaseUploadBox },
  emits: ["uploadSuccess"],
  setup(props, { emit }) {
    const uplaodBox = ref(null);
    const state = reactive({
      upVisible: false,
      InquireInfoId: "",
      form: {
        year: "" + new Date().getFullYear(),
        month: "",
        ShippingDateId: "",
        Remark: "",
      },
      files: [],
      submitLoading: false,
    });
    const dialogClose = (type) => {};

    const openDialog = (Id) => {
      state.InquireInfoId = Id;
      state.upVisible = true;
    };

    const uploadFile = (files) => {
      console.log(files,"files")
      files = Array.from(files);
      files.forEach((ele) => {
        state.files.push(ele);
      });
    };
    // 继续上传
    const conUpload = () => {
      unref(uplaodBox).triggerUploadDialog();
    };
    // 重新上传
    const reUpload = (i) => {
      conUpload();
      state.files=[];
    };
    // 删除上传的文件
    const remFile = (i) => {
      ElMessageBox.confirm("是否删除", "提示")
        .then(() => {
          state.files=[];
        })
        .catch(() => {});
    };
    /* 提交文件 */
    const submit = async () => {
      const formData = new FormData();
      state.files.forEach((e) => {
        formData.append(e.name, e);
      });
      const res = await request.postFile("/api/File/Upload", formData);
      if (!res.Status) {
        ElMessage.error(res.Message);
        return;
      }
      const upRes = await request.post(
        "/api/FRInquireCustomer/UploadBookingOrderFile",
        { InquireInfoId: state.InquireInfoId, BookingOrderFile: res.Data }
      );
      if (!upRes.Status) {
        ElMessage.error(upRes.Message);
        return;
      }
      state.upVisible = false;
      ElMessage.success("成功");
      emit("uploadSuccess", res);
    };
    return {
      state,
      openDialog,
      uploadFile,
      uplaodBox,
      conUpload,
      reUpload,
      remFile,
      submit,
      dialogClose,
    };
  },
};
</script>

<style lang="scss" scoped>
.upload-box {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border: 1px dashed #409eff;
  color: #409eff;

  cursor: pointer;
}
.files-table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;

  table,
  tr,
  td {
    border: 1px solid #bbb;
  }
  tr {
    height: 40px;
    line-height: 40px;
  }
  td {
    padding-left: 20px;
  }
  .handle {
    width: 110px;
  }
}
</style>