<template>
  <div class="container drafts">
    <div class="title">已发送</div>

    <manifestSearchForm
      @reset="reset"
      submitAfterReset
      @submit="getList"
      labelWidth="80px"
    >
      <el-row class="el-row1">
        <el-form-item label="编号查询">
          <el-select
            class="cgxselect"
            v-model="search.NoType"
            placeholder="请选择提单号类型"
            size="mini"
          >
            <el-option label="提单号" value="0"></el-option>
            <el-option label="箱号" value="1"></el-option>
          </el-select>
          <el-input
            size="mini"
            v-model="search.No"
            class="searchinput2"
            placeholder="请输入单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="发送日期">
          <JstDateRange
            size="mini"
            v-model:start="search.SendTimeStart"
            v-model:end="search.SendTimeEnd"
          >
          </JstDateRange>
        </el-form-item>
        <el-form-item label="船名航次">
          <el-input
            size="mini"
            style="width: 100px"
            v-model="search.CGO_VES"
            class="searchinput2"
            placeholder="请输入船名"
          >
          </el-input>
          <el-input
            size="mini"
            style="width: 100px; margin-left: 4px"
            v-model="search.CGO_VOY"
            class="searchinput2"
            placeholder="请输入航次"
          ></el-input>
        </el-form-item>
        <el-form-item label="接收方">
          <el-select
            v-model="search.Shipping"
            filterable
            clearable
            size="mini"
            placeholder="请选择接收方"
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
      </el-row>
    </manifestSearchForm>

    <div class="btnbox">
      <el-button size="mini" @click="exportexcel">
        <el-icon> <edit /> </el-icon>导出
      </el-button>
      <el-button @click="copyListItem" size="mini">
        <el-icon> <document-copy /> </el-icon>复制
      </el-button>
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
      <el-table-column
        show-overflow-tooltip
        prop="TradeNumber"
        label="流水号"
      ></el-table-column>
      <el-table-column prop="CGO_MBL_NO" label="提单号">
        <template #default="scope">
          <el-button @click="toDetail(scope.row.Id)" type="text">{{
            scope.row.CGO_MBL_NO
          }}</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="CGO_CNNO" width="130px" label="箱号">
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
      <el-table-column prop="VGM" label="回执状态" width="70px">
        <template #default="scope">
          <div class="tdhlist">
            <div class="tdhitem" v-for="item in scope.row.Details">
              <VGMSendStatus :info="scope.row" :item="item"></VGMSendStatus>
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
      <el-table-column prop="remark" label="操作" width="200px" fixed="right">
        <template #default="scope">
          <div class="tablebtn">
            <span @click="openPreview(scope.row.Id)" class="green">预览</span>

            <span @click="exportById(scope.row.Id)" class="green">下载</span>

            <span @click="copyAndCreate(scope.row.Id, true)" class="green"
              >复制创建</span
            >

            <!-- 未发送过并且状态是失败的 可以编辑 / 删除 -->
            <span
              v-if="
                (scope.row.Identifier == '' || scope.row.Identifier == null) &&
                scope.row.Status === 2
              "
              @click="toEdit(scope.row.Id)"
              class="green"
              >修改</span
            >

            <el-popconfirm
              v-if="
                (scope.row.Identifier == '' || scope.row.Identifier == null) &&
                scope.row.Status === 2
              "
              @confirm="cancelVGM(scope.row.Id)"
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
    <VGMPreviewDialog hideBtn ref="previewDialog"></VGMPreviewDialog>
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
import { Edit, Delete, DocumentCopy } from "@element-plus/icons";
import {
  useEditorOptions,
  useAutoComplete,
} from "../components/editor/useEditorOptions";
import env from "@share/env";
import { getElectronAgent } from "@share/agent";
import VGMSendStatus from "./components/VGMSendStatus.vue";
import VGMPreviewDialog from "./components/VGMPreviewDialog.vue";
export default defineComponent({
  components: {
    manifestTips,
    manifestSearchForm,
    Edit,
    Delete,
    DocumentCopy,
    VGMSendStatus,
    VGMPreviewDialog,
  },
  methods: {
    /**
     * 打开预览
     * @param {} id
     */
    async openPreview(id) {
      let res = await this.$http.get("/api/CargoEDISHVGM/GetVGMInfo", {
        id: id,
      });
      if (!res.Status) {
        this.$message.error(res.Message ?? "失败");
        return;
      }
      this.$refs.previewDialog.openPreviewDialog(res.Data);
    },
  },
  setup() {
    const router = useRouter();

    const editorOptions = useEditorOptions();

    const search = ref({
      /**
       * 发送时间开始
       */
      SendTimeStart: "",
      /**
       * 发送时间结束
       */
      SendTimeEnd: "",
      /**
       * 单号类型    0 提单号  1 箱号
       */
      NoType: "0",
      /**
       * 单号 跟随单号类型变化
       */
      No: "",
      /**
       * -1 全部  0发送中  1失败  2成功
       */
      Status: -1,
      /**
       * 船名
       */
      CGO_VES: "",
      /**
       * 航次
       */
      CGO_VOY: "",
      // 船司 (接收方)
      Shipping: "",
      // 持箱人 COC / SOC / "" -> 全部
      OwnerBoxSign: "",
    });

    const data = ref([]);

    const tableOption = useTableOption({
      selectFilter(item) {
        return item.Id;
      },
    });

    async function getList() {
      tableOption.loading = true;
      let res = await request.get("/api/CargoEDISHVGM/GetList", {
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

    // 编辑
    function toEdit(id) {
      router.push({
        path: "/manifest/vgm/VGMSendEdit",
        query: {
          vgmId: id,
          timestamp: Date.now(),
        },
      });
    }

    // 详情
    function toDetail(id) {
      router.push({
        path: "/manifest/vgm/VGMSendDetail",
        query: {
          vgmId: id,
          timestamp: Date.now(),
        },
      });
    }

    /**
     * 复制并创建
     * @param {*} id
     */
    async function copyAndCreate(id, gotoEdit) {
      let res = await request.post("/api/CargoEDISHVGM/CopyVGMInfo", {
        id: id,
      });
      if (res.Status == false) {
        ElMessage.error(res.Message);
        return;
      }

      if (gotoEdit === true) {
        router.push({
          path: "/manifest/vgm/VGMNraftsEdit",
          query: {
            draftId: res.Data,
            timestamp: Date.now(),
          },
        });
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
          "/api/CargoEDISHVGM/ExportVGM?idList=" +
          tableOption.selected.join(",")
      );
    }
    /**
     * 导出单条
     * @param {*} id
     */
    async function exportById(id) {
      agent?.ipcRequest(
        "window/downloadUrl",
        import.meta.env.VITE_AXIOS_HOST +
          "/api/CargoEDISHVGM/ExportVGM?idList=" +
          id
      );
    }

    // 删除
    async function cancelVGM(id) {
      let res = await request.post("/api/CargoEDISHVGM/CancelFailVGM", {
        id: id,
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
        /**
         * 发送时间开始
         */
        SendTimeStart: "",
        /**
         * 发送时间结束
         */
        SendTimeEnd: "",
        /**
         * 单号类型    0 提单号  1 箱号
         */
        NoType: "0",
        /**
         * 单号 跟随单号类型变化
         */
        No: "",
        /**
         * -1 全部  0发送中  1失败  2成功
         */
        Status: -1,
        /**
         * 船名
         */
        CGO_VES: "",
        /**
         * 航次
         */
        CGO_VOY: "",
        // 船司 (接收方)
        Shipping: "",
        // 持箱人 COC / SOC / "" -> 全部
        OwnerBoxSign: "",
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
      toDetail,
      getList,
      reset,
      copyAndCreate,
      cancelVGM,
      copyListItem,
      exportexcel,
      exportById,
      autoComplete: useAutoComplete(),
    };
  },
});
</script>

<style lang="scss" scoped>
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
</style>
