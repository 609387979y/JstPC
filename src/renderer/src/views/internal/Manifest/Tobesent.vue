<template>
  <div class="container drafts">
    <div class="title">待发送</div>
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
        <el-col :span="8">
          <el-form-item label="船名航次">
            <el-input
              v-model="search.cm"
              placeholder="请输入船名"
              class="searchinput"
              size="mini"
            ></el-input>
            <el-input
              size="mini"
              v-model="search.hc"
              class="searchinput"
              placeholder="请输入航次"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="船公司">
            <el-select
              v-model="search.shipping"
              filterable
              clearable
              size="mini"
              placeholder="请选择船公司"
            >
              <el-option
                :label="`${item.Code} - ${item.Name}`"
                :value="item.Code"
                v-for="item in editorOptions.SHIPPINGList"
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
        <el-col :span="8">
          <el-form-item label="船代">
            <el-select
              v-model="search.shipAgent"
              filterable
              clearable
              placeholder="请选择船代"
              size="mini"
            >
              <el-option
                :label="item.Name"
                :value="item.Code"
                v-for="item in editorOptions.SHIP_AGENTList"
                :key="item.Code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="el-row1">
        <el-col :span="8">
          <el-form-item label="编号查询">
            <el-select
              class="cgxselect"
              v-model="search.tdhtype"
              placeholder="请选择提单号类型"
              size="mini"
            >
              <el-option label="主提单号" value="0"></el-option>
              <el-option label="提单号" value="1"></el-option>
            </el-select>
            <el-input
              size="mini"
              v-model="search.tdh"
              class="searchinput2"
              placeholder="请输入提单号"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </manifestSearchForm>

    <div class="btnbox">
      <el-button size="mini" @click="sendConfirm" type="primary">
        <el-icon> <promotion /> </el-icon>提交发送
      </el-button>
      <el-button size="mini" @click="exportexcel">
        <el-icon> <edit /> </el-icon>导出
      </el-button>
      <el-button @click="copyListItem" size="mini">
        <el-icon> <document-copy /> </el-icon>复制
      </el-button>

      <el-popconfirm @confirm="deleteDraft(null)" title="是否确定删除选定数据?">
        <template #reference>
          <el-button size="mini">
            <el-icon> <delete /> </el-icon>删除
          </el-button>
        </template>
      </el-popconfirm>
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
      <el-table-column prop="EDIType" label="报文类型">
        <template #default="scope">
          {{ common.convertEDITypeText(scope.row.EDIType) }}
        </template>
      </el-table-column>
      <el-table-column prop="CGO_MBL_NO" label="主提单号" width="130px">
        <template #default="scope">
          <el-button @click="toDetail(scope.row.Id)" type="text">{{
            scope.row.CGO_MBL_NO
          }}</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="tdh" label="提单号" class="123123">
        <template #default="scope">
          <div class="tdhlist">
            <div class="tdhitem" v-for="item in scope.row.DetailCGO_MBL_NO">
              {{ item.CGO_MBL_NO }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="CGO_VES"
        label="船名"
        width="130px"
      ></el-table-column>
      <el-table-column
        prop="CGO_VOY"
        label="航次"
        width="120px"
      ></el-table-column>
      <el-table-column
        prop="ShippingName"
        label="船司"
        width="100px"
      ></el-table-column>
      <el-table-column
        prop="ShipAgentName"
        label="船代"
        width="100px"
      ></el-table-column>
      <el-table-column
        prop="TotalNUM"
        label="总件数"
        width="90px"
      ></el-table-column>
      <el-table-column
        prop="TotalWGT"
        label="总毛重(KGS)"
        width="90px"
      ></el-table-column>
      <el-table-column
        prop="TotalMEAS"
        label="总体积(CBM)"
        width="90px"
      ></el-table-column>
      <el-table-column
        prop="UpdateTime"
        label="最后编辑时间"
        width="150px"
      ></el-table-column>
      <el-table-column prop="remark" label="操作" width="200px" fixed="right">
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
  </div>
  <SendConfirmDialog
    @confirm="saveAndSend"
    ref="sendConfirmDialog"
  ></SendConfirmDialog>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  onActivated,
  computed,
  watch,
} from "vue";
import request from "@/public/request";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { utils, useTableOption } from "justom-share";
import manifestTips from "./components/manifestTips.vue";
import manifestSearchForm from "./components/manifestSearchForm.vue";
import { Edit, Delete, DocumentCopy } from "@element-plus/icons";
import { useEditorOptions } from "./components/editor/useEditorOptions";
import env from "@share/env";
import SendConfirmDialog from "./components/SendConfirmDialog.vue";
import { getElectronAgent } from "@share/agent";
import { Promotion } from "@element-plus/icons";
import * as common from "./components/common";
export default defineComponent({
  components: {
    manifestTips,
    manifestSearchForm,
    Edit,
    Delete,
    DocumentCopy,
    SendConfirmDialog,
    Promotion,
  },
  setup() {
    const router = useRouter();

    const editorOptions = useEditorOptions();

    const content = ref(
      "上海海关172号令在近期切换放行条件，凭“装载舱单”回执向码头传输海放信息，请客户报关完成后自行关注装载舱单状态，异常情况及时联系客服确认。届时，拼箱内冗余舱单未及时删除、落货不及时、放行后加拼不规范、舱单数据修改不成功、混拼、提单号在两年内重复使用都会"
    );
    const content2 = ref(
      "1. 垃圾舱单海关严令禁止！根据海关规定，每一票预配舱单，必须对应一票实际的出运货物。舱单发送后，如果您的货物未出运（未赶上船、出货计划变更等原因），该票舱单111111111111111"
    );

    const search = ref({
      cm: "",
      hc: "",
      // 0-> 主提单号  1-> 详情提单号
      tdhtype: "0",
      tdh: "",
      // 船代
      shipAgent: "",
      // 船司
      shipping: "",
    });

    const data = ref([]);

    const tableOption = useTableOption({
      selectFilter(item) {
        return item.Id;
      },
    });

    async function getList() {
      tableOption.loading = true;
      let res = await request.get("/api/CargoEDISHManifest/GetList", {
        page: tableOption.page,
        limit: tableOption.pageSize,
        CGO_VES: search.value.cm,
        CGO_VOY: search.value.hc,
        CGO_MBL_NO: search.value.tdh,
        shipAgent: search.value.shipAgent,
        shipping: search.value.shipping,
        status: 0,
      });
      for (let item of res.Rows) {
        // item.UpdateTime = utils.formatDateTime(item.UpdateTime)
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
    function toEdit(id) {
      router.push({
        path: "/manifest/UnSendEdit",
        query: {
          id: id,
          timestamp: Date.now(),
        },
      });
    }

    // 详情
    function toDetail(id) {
      router.push({
        path: "/manifest/toBeSentDetail",
        query: {
          id: id,
        },
      });
    }

    const agent = getElectronAgent();

    // 导出
    async function exportexcel() {
      if (tableOption.selected.length == 0) {
        ElMessage.warning("请选中一条");
        return;
      }
      if (tableOption.selected.length > 1) {
        ElMessage.warning("只能选择一条导出");
        return;
      }

      agent?.ipcRequest(
        "window/downloadUrl",
        import.meta.env.VITE_AXIOS_HOST +
          "/api/CargoEDISHManifest/ExportManifest?id=" +
          tableOption.selected[0]
      );
    }

    /**
     * 复制并创建
     * @param {*} id
     */
    async function copyAndCreate(id, gotoEdit) {
      let res = await request.post("/api/CargoEDISHManifest/CopyFromOther", {
        id: id,
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
      ElMessage.success("复制成功");
    }

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
      let res = await request.post("/api/CargoEDISHManifest/DeleteList", {
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
        cm: "",
        hc: "",
        // 0-> 主提单号  1-> 详情提单号
        tdhtype: "0",
        tdh: "",
        // 船代
        shipAgent: "",
        // 船司
        shipping: "",
      };
    }

    const confirmId = ref(0);
    const sendConfirmDialog = ref();
    // 提交并发送的确认
    async function sendConfirm() {
      if (tableOption.selected.length == 0) {
        ElMessage.warning("请选择一条进行发送");
        return;
      }
      if (tableOption.selected.length > 1) {
        ElMessage.warning("只能选中一条舱单信息");
        return;
      }

      let id = tableOption.selected[0];

      let res = await request.get("/api/CargoEDISHManifest/GetInfo", {
        id: id,
      });

      if (!res.Status) {
        ElMessage.error(res.Message ?? "失败");
        return;
      }
      confirmId.value = id;

      sendConfirmDialog.value.showConfirmDialog(res.Data);
    }
    /**
     * 保存并发送
     */
    async function saveAndSend() {
      let res = await request.post("/api/CargoEDISHManifest/SendManifest", {
        id: confirmId.value,
      });
      if (!res.Status) {
        ElMessage.error(res.Message ?? "失败");
        return;
      }
      ElMessage.success("成功");
      getList();
      router.push("/manifest/Hasbeensent");
    }

    onActivated(async () => {
      getList();
    });
    return {
      common,
      content,
      content2,
      search,
      data,
      tableOption,
      tableRowClassName,
      editorOptions,
      sendConfirmDialog,
      toEdit,
      toDetail,
      getList,
      reset,
      copyAndCreate,
      deleteDraft,
      copyListItem,
      exportexcel,
      saveAndSend,
      sendConfirm,
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
    font-weight: 500;
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
