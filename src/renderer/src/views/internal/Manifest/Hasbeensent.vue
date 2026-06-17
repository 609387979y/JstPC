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
              <el-option label="发送编号" value="2"></el-option>
            </el-select>
            <el-input
              size="mini"
              v-model="search.tdh"
              class="searchinput2"
              placeholder="请输入提单号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发送状态">
            <el-select
              v-model="search.status"
              placeholder="发送状态"
              size="mini"
            >
              <el-option label="全部" :value="-2"></el-option>
              <el-option label="发送中" :value="1"></el-option>
              <el-option label="等待回执" :value="2"></el-option>
              <el-option label="发送失败" :value="3"></el-option>
              <el-option label="回执成功" :value="4"></el-option>
              <el-option label="取消" :value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报文类型">
            <el-select
              v-model="search.ediType"
              placeholder="报文类型"
              size="mini"
            >
              <el-option label="全部" :value="-1"></el-option>
              <el-option label="原始" :value="0"></el-option>
              <el-option label="修改" :value="1"></el-option>
              <el-option label="删除" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="发送时间">
        <JstDateRange
          size="mini"
          v-model:start="search.sendTimeStart"
          v-model:end="search.sendTimeEnd"
        >
        </JstDateRange>
      </el-form-item>
    </manifestSearchForm>

    <div class="btnbox">
      <el-button @click="exportExcel" size="mini">
        <el-icon> <edit /> </el-icon>导出
      </el-button>
      <el-button @click="copyListItem" size="mini">
        <el-icon> <document-copy /> </el-icon>复制
      </el-button>

      <el-button @click="sendModifyManifest(null)" type="primary" size="mini">
        <el-icon> <delete /> </el-icon>发送修改报文
      </el-button>
      <el-button @click="sendDelete(null)" type="danger" size="mini">
        <el-icon> <delete /> </el-icon>发送删除报文
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
      <el-table-column prop="EDIType" label="报文类型">
        <template #default="scope">
          {{ common.convertEDITypeText(scope.row.EDIType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="SendNo"
        label="发送编号"
        width="130px"
      ></el-table-column>
      <el-table-column prop="CGO_MBL_NO" label="主提单号" width="130px">
        <template #default="scope">
          <el-button @click="toDetail(scope.row.Id)" type="text">{{
            scope.row.CGO_MBL_NO
          }}</el-button>
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
      <el-table-column prop="tdh" min-width="200px" label="提单号">
        <template #default="scope">
          <div class="tdhlist">
            <div class="tdhitem" v-for="item in scope.row.DetailCGO_MBL_NO">
              <span>{{ item.CGO_MBL_NO }}</span>
              <span v-if="scope.row.Status != 5" style="margin-left: 15px">
                <span v-if="item.Status === 0" class="status-info info"
                  >等待回执</span
                >
                <span v-else-if="item.Status === 1" class="status-info error"
                  >回执失败</span
                >
                <span v-else-if="item.Status === 2" class="status-info success"
                  >回执成功</span
                >
              </span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="Status" label="状态">
        <template #default="scope">
          <span v-if="scope.row.Status === 1" class="status-info info"
            >发送中</span
          >
          <span v-else-if="scope.row.Status == 2" class="status-info info"
            >发送中</span
          >
          <span v-else-if="scope.row.Status === 3" class="status-info error"
            >出现错误</span
          >
          <span v-else-if="scope.row.Status === 4" class="status-info success"
            >发送成功</span
          >
          <span v-else-if="scope.row.Status === 5" class="status-info error"
            >已取消</span
          >
          <span v-else-if="scope.row.Status === 6" class="status-info error"
            >已删单</span
          >
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="FailReason"
        label="回执内容"
        width="90px"
      >
        <template #default="scope">
          <template
            v-if="
              scope.row.Status == 3 ||
              scope.row.Status == 4 ||
              scope.row.Status == 6
            "
            >{{ $utils.formatEmptyString(scope.row.FailReason) }}</template
          >
          <template v-else-if="scope.row.Status == 2">
            <span class="status-info info">等待回执中.</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="SendTime" label="发送时间" width="150px">
        <template #default="scope">{{
          $utils.formatEmptyString(scope.row.SendTime)
        }}</template>
      </el-table-column>
      <el-table-column prop="remark" label="操作" width="260px" fixed="right">
        <template #default="scope">
          <div class="tablebtn">
            <span @click="toSendVGM(scope.row.Id)" class="green">发VGM</span>

            <!-- 没有发送成功的时候 -->
            <span
              v-if="scope.row.Status == 3"
              @click="toEdit(scope.row.Id)"
              class="green"
              >编辑</span
            >

            <span @click="copyAndCreate(scope.row.Id, true)" class="green"
              >复制创建</span
            >

            <!-- 只有没发通的时候可以取消 -->
            <span
              v-if="scope.row.Status == 3"
              @click="cancelManifest(scope.row.Id)"
              class="red"
              >取消</span
            >
          </div>
        </template>
      </el-table-column>
    </JstPageTable>
  </div>

  <SendConfirmDialog
    @confirm="sendDeleteConfirm"
    ref="sendDeleteConfirmDialogRef"
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
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { utils, useTableOption } from "justom-share";
import manifestTips from "./components/manifestTips.vue";
import manifestSearchForm from "./components/manifestSearchForm.vue";
import { Edit, Delete, DocumentCopy } from "@element-plus/icons";
import { useEditorOptions } from "./components/editor/useEditorOptions";
import { getElectronAgent } from "@share/agent";
import * as common from "./components/common";
import SendConfirmDialog from "./components/SendConfirmDialog.vue";

/**
 * 删除报文相关
 */
function useDelete(tableOption, getList) {
  const chooseDeleteId = ref(0);
  const sendDeleteConfirmDialogRef = ref();
  /**
   * 发送删除报文
   */
  async function sendDelete(id) {
    let chooseId = 0;
    if (id != null && id != undefined) {
      chooseId = id;
    } else {
      if (tableOption.selected.length == 0) {
        ElMessage.warning("请选择要删除的数据");
        return;
      }
      if (tableOption.selected.length > 1) {
        ElMessage.warning("只能选择一条数据");
        return;
      }
      chooseId = tableOption.selected[0];
    }

    let checkRes = await request.get(
      "/api/CargoEDISHManifest/CheckManifestCanSendDelete",
      {
        manifestId: chooseId,
      }
    );
    if (!checkRes.Status) {
      ElMessage.error(checkRes.Message ?? "失败");
      return;
    }

    await ElMessageBox.confirm("是否确定发送删除报文?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "error",
    });

    chooseDeleteId.value = chooseId;
    sendDeleteConfirmDialogRef.value.showConfirmDialogModifyOrDelete(
      chooseId,
      2
    );
  }

  async function sendDeleteConfirm() {
    let res = await request.post("/api/CargoEDISHManifest/DeleteSentManifest", {
      manifestId: chooseDeleteId.value,
    });
    if (res.Status == false) {
      ElMessage.error(res.Message);
      return;
    }
    ElMessage.success("发送删除报文成功");
    getList();
  }
  return {
    sendDeleteConfirmDialogRef,
    sendDelete,
    sendDeleteConfirm,
  };
}

export default defineComponent({
  components: {
    manifestTips,
    manifestSearchForm,
    Edit,
    Delete,
    DocumentCopy,
    SendConfirmDialog,
  },
  methods: {
    /**
     * 前往发送VGM
     * @param {*} id
     */
    toSendVGM(id) {
      this.$router.push({
        path: "/manifest/vgm/NewVGM",
        query: {
          manifestId: id,
          timestamp: Date.now(),
        },
      });
    },
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
      // 0-> 主提单号  1-> 详情提单号   2-> 发送号
      tdhtype: "0",
      tdh: "",
      // 船代
      shipAgent: "",
      // 船司
      shipping: "",
      // 发送时间 开始
      sendTimeStart: "",
      // 发送时间 结束
      sendTimeEnd: "",
      // 状态  -2已发送的全部  -1全部  0未发送 1发送中 2等待回执 3发送失败  4回执成功   5取消
      status: -2,
      // 报文类型 -1全部  0原始 1修改 2删除
      ediType: -1,
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
        sendTimeStart: search.value.sendTimeStart,
        sendTimeEnd: search.value.sendTimeEnd,
        status: search.value.status,
        noType: search.value.tdhtype,
        ediType: search.value.ediType,
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
        path: "/manifest/SentEdit",
        query: {
          id: id,
          timestamp: Date.now(),
          type: "fail",
        },
      });
    }

    // 修改报文
    function toUpdateEdit(id) {
      router.push({
        path: "/manifest/SentEdit",
        query: {
          id: id,
          timestamp: Date.now(),
          type: "modify",
        },
      });
    }

    // 详情
    function toDetail(id) {
      router.push({
        path: "/manifest/sentDetail",
        query: {
          id: id,
        },
      });
    }
    // 取消
    async function cancelManifest(id) {
      let { value } = await ElMessageBox.prompt("请输入取消原因", "取消", {
        confirmButtonText: "确定取消",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "不能为空",
      });

      let res = await request.post("/api/CargoEDISHManifest/CancelManifest", {
        id: id,
        reason: value,
      });
      if (!res.Status) {
        ElMessage.error(res.Message ?? "失败");
        return;
      }
      ElMessage.success("成功");
      await getList();
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
        router.push({
          path: "/manifest/UnSendEdit",
          query: {
            id: id,
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

    /**
     * 前往发送修改报文
     */
    async function sendModifyManifest(id) {
      let chooseId = 0;
      if (id != null && id != undefined) {
        chooseId = id;
      } else {
        if (tableOption.selected.length == 0) {
          ElMessage.warning("请选择要更新的数据");
          return;
        }
        if (tableOption.selected.length > 1) {
          ElMessage.warning("只能选择一条数据");
          return;
        }
        chooseId = tableOption.selected[0];
      }

      let res = await request.get(
        "/api/CargoEDISHManifest/CheckManifestCanSendModify",
        {
          manifestId: chooseId,
        }
      );
      if (!res.Status) {
        ElMessage.error(res.Message ?? "失败");
        return;
      }

      // 前往待发送
      router.push({
        path: "/manifest/SentEdit",
        query: {
          id: chooseId,
          timestamp: Date.now(),
          type: "modify",
        },
      });
    }

    function reset() {
      search.value = {
        cm: "",
        hc: "",
        // 0-> 主提单号  1-> 详情提单号   2-> 发送号
        tdhtype: "0",
        tdh: "",
        // 船代
        shipAgent: "",
        // 船司
        shipping: "",
        // 发送时间 开始
        sendTimeStart: "",
        // 发送时间 结束
        sendTimeEnd: "",
        // 状态  -2已发送的全部  -1全部  0未发送 1发送中 2等待回执 3发送失败  4回执成功   5取消
        status: -2,
        // 报文类型 -1全部  0原始 1修改 2删除
        ediType: -1,
      };
    }

    const agent = getElectronAgent();

    function exportExcel() {
      if (tableOption.selected.length == 0) {
        ElMessage.warning("请选择一条");
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

    const { sendDeleteConfirmDialogRef, sendDelete, sendDeleteConfirm } =
      useDelete(tableOption, getList);

    onActivated(async () => {
      getList();
    });
    return {
      content,
      content2,
      search,
      data,
      tableOption,
      tableRowClassName,
      editorOptions,
      toEdit,
      toUpdateEdit,
      toDetail,
      getList,
      reset,
      copyAndCreate,
      sendDelete,
      copyListItem,
      cancelManifest,
      exportExcel,
      common,
      sendModifyManifest,
      sendDeleteConfirm,
      sendDeleteConfirmDialogRef,
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

.status-info {
  &.success {
    color: #67c23a;
  }

  &.error {
    color: #ef4333;
  }

  &.info {
    color: #969799;
  }
}
</style>
