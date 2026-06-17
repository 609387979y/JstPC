<template>
  <div class="container drafts">
    <div class="title">草稿箱</div>
    <!-- <manifestTips title="出口方行新规" tiptype="error" :content="content"></manifestTips>
		<manifestTips title="垃圾舱单" tiptype="error" :content="content2"></manifestTips>
		<manifestTips title="异常问题客服" tiptype="warning" :content="content"></manifestTips> -->

    <manifestSearchForm
      @reset="reset"
      submitAfterReset
      @submit="getList"
      labelWidth="80px"
    >
      <el-row class="el-row1">
        <el-col :span="6">
          <el-form-item label="接收人">
            <el-select
              v-model="search.Shipping"
              filterable
              clearable
              size="mini"
              placeholder="请选择船公司"
            >
              <el-option
                :label="`${item.Code} - ${item.Name}`"
                :value="item.Code"
                v-for="item in editorOptions.VGM_ShippingList"
                :key="item.Code"
              >
                <div style="display: flex; justify-content: space-between">
                  <div>{{ item.Code }}</div>
                  <div style="color: #909399">{{ item.Name }}</div>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="持箱人">
            <el-select
              v-model="search.OwnerBoxSign"
              filterable
              clearable
              size="mini"
              placeholder="请选择船公司"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="COC" value="COC"></el-option>
              <el-option label="SOC" value="SOC"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="提单号">
            <el-input
              size="small"
              v-model="search.CGO_MBL_NO"
              placeholder="请输入提单号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="箱号">
            <el-input
              size="small"
              v-model="search.CGO_CNNO"
              placeholder="请输入箱号"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </manifestSearchForm>

    <div class="btnbox">
      <div>
        <el-button @click="toNewVGM" type="primary" size="mini">
          <el-icon>
            <plus /> </el-icon
          >新增VGM
        </el-button>

        <el-button @click="openJxDialog" size="mini">
          <el-icon>
            <edit /> </el-icon
          >导入
        </el-button>
        <el-button @click="copyListItem" size="mini">
          <el-icon>
            <document-copy /> </el-icon
          >复制
        </el-button>

        <el-button class="submit-btn" @click="clickSaveAndSubmit" size="mini">
          <el-icon>
            <promotion /> </el-icon
          >提交发送
        </el-button>

        <el-button size="mini" @click="exportexcel">
          <el-icon>
            <edit /> </el-icon
          >导出
        </el-button>

        <el-popconfirm
          @confirm="deleteDraft(null)"
          title="是否确定删除选定数据?"
        >
          <template #reference>
            <el-button size="mini">
              <el-icon>
                <delete /> </el-icon
              >删除
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>

    <JstPageTable
      @change="getList"
      :data="data"
      :option="tableOption"
      class="manifesttable"
      :rowClassName="tableRowClassName"
    >
      <el-table-column
        type="selection"
        width="40px"
        fixed="left"
      ></el-table-column>
      <el-table-column prop="PortName" label="口岸"></el-table-column>
      <el-table-column prop="CGO_MBL_NO" label="提单号"></el-table-column>

      <el-table-column width="130px" prop="CGO_CNNO" label="箱号">
        <template #default="scope">
          <div class="tdhlist">
            <div class="tdhitem" v-for="item in scope.row.Details">
              {{ item.CGO_CNNO }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="110px" prop="VGM" label="VGM重量(KGS)">
        <template #default="scope">
          <div class="tdhlist">
            <div class="tdhitem" v-for="item in scope.row.Details">
              {{ item.VGM }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="VGM" label="校验状态" width="70px">
        <template #default="scope">
          <div class="tdhlist">
            <div class="tdhitem" v-for="item in scope.row.Details">
              <VGMCheckStatus :item="item"></VGMCheckStatus>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="ShippingName"
        label="船公司"
        width="130px"
      ></el-table-column>
      <el-table-column
        prop="OwnerBoxSign"
        label="持箱人"
        width="120px"
      ></el-table-column>
      <el-table-column prop="CutOffDay" label="截VGM日期" width="100px">
      </el-table-column>
      <el-table-column
        prop="CGO_VES"
        label="船名"
        width="100px"
      ></el-table-column>
      <el-table-column
        prop="CGO_VOY"
        label="航次"
        width="90px"
      ></el-table-column>
      <el-table-column
        prop="CGO_WHARF_NAME"
        label="码头"
        width="150px"
      ></el-table-column>
      <el-table-column
        prop="UpdateTime"
        label="最后编辑时间"
        width="150px"
      ></el-table-column>
      <el-table-column prop="remark" label="操作" width="136px" fixed="right">
        <template #default="scope">
          <div class="tablebtn">
            <span @click="toEdit(scope.row.Id)" class="green">编辑</span>
            <span @click="copyAndCreate(scope.row.Id, true)" class="green"
              >复制创建</span
            >

            <el-popconfirm
              @confirm="deleteDraft(scope.row.Id)"
              title="是否确定删除?"
            >
              <template #reference>
                <span class="red">删除</span>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </JstPageTable>
    <VGMJxDialog @jxsave="getList" ref="jxDialog"></VGMJxDialog>
    <VGMSendConfirmDialog
      @confirm="saveAndSubmit"
      ref="sendConfirmDialog"
    ></VGMSendConfirmDialog>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  onActivated,
  computed,
  watch,
} from "vue";
import request from "@/public/request";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { utils, useTableOption } from "justom-share";
import manifestTips from "../components/manifestTips.vue";
import manifestSearchForm from "../components/manifestSearchForm.vue";
import {
  Plus,
  Edit,
  Delete,
  DocumentCopy,
  Download,
  Promotion,
} from "@element-plus/icons";
import {
  useEditorOptions,
  useAutoComplete,
} from "../components/editor/useEditorOptions";
import env from "@share/env";
import { getElectronAgent } from "@share/agent";
import VGMCheckStatus from "./components/VGMCheckStatus.vue";
import VGMJxDialog from "./components/VGMJxDialog.vue";
import VGMSendConfirmDialog from "./components/VGMSendConfirmDialog.vue";
export default defineComponent({
  components: {
    manifestTips,
    manifestSearchForm,
    Edit,
    Delete,
    DocumentCopy,
    VGMCheckStatus,
    Download,
    VGMJxDialog,
    Plus,
    Promotion,
    VGMSendConfirmDialog,
  },
  data() {
    return {
      chooseData: { Details: [] },
    };
  },
  methods: {
    // 打开解析弹窗
    openJxDialog() {
      this.$refs.jxDialog.openJxDialog();
    },
    async clickSaveAndSubmit() {
      if (this.tableOption.selected.length == 0) {
        this.$message.warning("请选择一条数据");
        return null;
      }
      if (this.tableOption.selected.length > 1) {
        this.$message.warning("只能选择一条数据");
        return null;
      }

      let res = await this.$http.get("/api/CargoEDISHVGMDraft/GetDraftInfo", {
        id: this.tableOption.selected[0],
      });
      if (!res.Status) {
        this.$message.error(res.Message ?? "失败");
        return null;
      }
      this.chooseData = res.Data;
      this.$refs.sendConfirmDialog.showConfirmDialog(res.Data);
    },
    /**
     * 保存并发送VGM
     */
    async saveAndSubmit() {
      let res = await this.$http.post(
        "/api/CargoEDISHVGM/CreateAndSendVGM",
        this.chooseData
      );
      if (!res.Status) {
        this.$message.error(res.Message ?? "失败");
        return;
      }
      // 删除这个草稿
      await this.$http.post("/api/CargoEDISHVGMDraft/DeleteDrafts", {
        idList: [this.chooseData.Id],
      });

      this.$message.success("成功");
      // 离开时重置数据
      this.chooseData = { Details: [] };

      this.getList();
      this.$router.push({
        path: "/manifest/vgm/VGMSend",
      });
    },
    toNewVGM() {
      this.$router.push({
        path: "/manifest/vgm/NewVGM",
        query: {
          timestamp: Date.now(),
        },
      });
    },
  },
  setup() {
    const router = useRouter();

    const editorOptions = useEditorOptions();

    const search = ref({
      // 船司 (接收方)
      Shipping: "",
      // 持箱人 COC / SOC / "" -> 全部
      OwnerBoxSign: "",
      // 提单号
      CGO_MBL_NO: "",
      // 箱号
      CGO_CNNO: "",
    });

    const data = ref([]);

    const tableOption = useTableOption({
      selectFilter(item) {
        return item.Id;
      },
    });

    async function getList() {
      tableOption.loading = true;
      let res = await request.get("/api/CargoEDISHVGMDraft/GetDraftList", {
        Page: tableOption.page,
        Limit: tableOption.pageSize,
        ...search.value,
      });
      for (let item of res.Rows) {
        item.CutOffDay = utils.formatDateTime(item.CutOffDay, "YYYY-MM-DD");
      }

      tableOption.total = res.Total;
      data.value = res.Rows;
      tableOption.loading = false;
    }

    function tableRowClassName({ row, rowIndex }) {
      let color = "";
      for (let item of tableOption.selected.values()) {
        if (item === row.id) color = "table-SelectedRow-bgcolor";
      }
      return color;
    }

    // 编辑/ 提交草稿
    function toEdit(draftId) {
      router.push({
        path: "/manifest/vgm/VGMNraftsEdit",
        query: {
          draftId: draftId,
          timestamp: Date.now(),
        },
      });
    }

    /**
     * 复制并创建
     * @param {*} id
     */
    async function copyAndCreate(id, gotoEdit) {
      let res = await request.post("/api/CargoEDISHVGMDraft/CopyDraft", {
        draftId: id,
      });
      if (res.Status == false) {
        ElMessage.error(res.Message);
        return;
      }

      if (gotoEdit === true) {
        toEdit(res.Data);
      }
    }

    async function copyListItem() {
      if (tableOption.selected.length == 0) {
        ElMessage.warning("请选中一条");
        return;
      }
      await copyAndCreate(tableOption.selected[0], true);
      getList();
    }

    const agent = getElectronAgent();

    // 导出
    async function exportexcel() {
      if (tableOption.selected.length == 0) {
        ElMessage.warning("请选中一条");
        return;
      }

      agent?.ipcRequest(
        "window/downloadUrl",
        import.meta.env.VITE_AXIOS_HOST +
          "/api/CargoEDISHVGMDraft/ExportVGMDraft?idList=" +
          tableOption.selected.join(",")
      );
    }

    // 删除
    async function deleteDraft(id) {
      let ids = [];
      if (id != null && id != undefined) {
        ids = [id];
      } else {
        if (tableOption.selected.length == 0) {
          ElMessage.warning("请选择要删除的数据");
          return;
        }
        ids = tableOption.selected;
      }
      let res = await request.post("/api/CargoEDISHVGMDraft/DeleteDrafts", {
        idList: ids,
      });
      if (res.Status == false) {
        ElMessage.error(res.Message);
        return;
      }
      getList();
      ElMessage.success("删除成功");
    }

    function reset() {
      search.value = {
        // 船司 (接收方)
        Shipping: "",
        // 持箱人 COC / SOC / "" -> 全部
        OwnerBoxSign: "",
        // 提单号
        CGO_MBL_NO: "",
        // 箱号
        CGO_CNNO: "",
      };
    }

    onActivated(async () => {
      getList();
    });
    return {
      search,
      data,
      tableOption,
      tableRowClassName,
      editorOptions,
      toEdit,
      getList,
      reset,
      copyAndCreate,
      deleteDraft,
      copyListItem,
      exportexcel,
      autoComplete: useAutoComplete(),
    };
  },
});
</script>

<style lang='scss' scoped>
.container {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
  padding: 16px 24px;

  .title {
    font-size: 14px;
    color: #303133;
    letter-spacing: 0;
    font-weight: bold;
    line-height: 20px;
    margin-bottom: 8px;
  }
}

.searchinput {
  width: 49%;
  margin-right: 2px;
}

.cgxselect {
  width: 100px;
  margin-right: 2px;
}

.searchinput2 {
  width: calc(100% - 102px);
}

.btnbox {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    i {
      margin-right: 2px;
    }
  }
}

.tablebtn {
  width: 100%;
  display: flex;
  align-items: center;

  span {
    display: inline-block;
    float: left;
    cursor: pointer;
    letter-spacing: -0.86px;
  }

  .green {
    color: #8dce6c;
    margin-right: 5px;

    &:hover {
      opacity: 0.7;
    }
  }

  .red {
    margin-left: 15px;
    color: #ef4333;

    &:hover {
      opacity: 0.7;
    }
  }
}

.tdhitem {
  padding: 8px;
  border-bottom: 1px solid #ebeef5;
}

.tdhitem:first-child {
  padding-top: 0;
}

.tdhitem:last-child {
  padding-bottom: 0;
  border: none;
}

.drafts {
  :deep(.manifesttable) {
    .el-table {
      .el-table__body {
        .el-table__row {
          td:nth-child(3) {
            .cell {
              padding: 0;
            }
          }
        }
      }
    }
  }
}

:deep(.table-SelectedRow-bgcolor) {
  td.el-table__cell {
    background-color: #fff1cb !important;
  }
}

:deep(.submit-btn.el-button) {
  color: #8dce6c;
  border-color: #8dce6c;
}
</style>
