<template>
  <JstCardLayout>
    <template #title>
      <div class="fast-cargo-card-title">消费记录</div>
    </template>
    <div class="page-search-form">
      <el-row>
        <el-col :span="8" class="page-search-form-item">
          <div class="page-search-form-lable">用户</div>
          <div class="page-search-form-content">
            <el-input size="mini" v-model="state.search.EmployeeName"> </el-input>
          </div>
        </el-col>
        <el-col :span="8" class="page-search-form-item">
          <div class="page-search-form-lable">业务编号</div>
          <div class="page-search-form-content">
            <el-input size="mini" v-model="state.search.TradeNumber"> </el-input>
          </div>
        </el-col>
        <el-col :span="8" class="page-search-form-item">
          <div class="page-search-form-lable">消费类型</div>
          <div class="page-search-form-content">
            <el-input size="mini" v-model="state.search.TradeAction"> </el-input>
          </div>
        </el-col>
        <el-col :span="24" class="page-search-form-item">
          <div class="page-search-form-lable">消费时间</div>
          <div class="page-search-form-content">
            <DateRange v-model:start="state.search.StartTime" v-model:end="state.search.EndTime" :datetype="2"></DateRange>
            <el-button size="mini" class="search-btn" color="#FF9809" type="primary" @click="search()">查询</el-button>
            <span class="text-btn" @click="reset()">清空筛选条件</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <JstPageTable @change="getList" :data="data" :option="tableOption">
      <el-table-column label="业务编号" prop="TradeNumber" min-width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名称" prop="EmployeeName" min-width="120px"></el-table-column>
      <el-table-column label="购买服务" prop="TradeType" min-width="100px"></el-table-column>
      <el-table-column label="服务详情" prop="Remark" min-width="365px" show-overflow-tooltip></el-table-column>
      <el-table-column label="消费类型" prop="TradeAction" min-width="120px" show-overflow-tooltip></el-table-column>
      <el-table-column label="数量" prop="Amount" width="120px">
        <template #default="scope">
          <div class="count">
            <img style="margin-right: 4px" src="@/assets/images/jst-hb.svg" alt srcset />
            <span :class="scope.row.Amount > 0 ? 'green' : 'red'">{{ scope.row.Amount > 0 ? '+' + scope.row.Amount :
                scope.row.Amount
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="消费时间" prop="CreateTime" min-width="150px"></el-table-column>
    </JstPageTable>
  </JstCardLayout>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { getElectronAgent } from "@share/agent";
import { useCompanyCertification } from "@/composables/user/certification";
import { VideoPlay, VideoPause, DocumentCopy, Delete, Clock } from "@element-plus/icons";
import ApplicationEntryVue from "@/components/ApplicationEntry.vue";
import { utils, useTableOption } from "justom-share";
import request from "@/public/request";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import DateRange from "./components/DateRange.vue";

export default defineComponent({
  components: {
    ApplicationEntryVue,
    VideoPlay,
    VideoPause,
    DocumentCopy,
    Delete,
    Clock,
	DateRange
  },
  setup() {
    const agent = getElectronAgent();
    const certification = useCompanyCertification();
    const cargoTabName = ref("0");

    const state = reactive({
      search: {
        TradeNumber: '',
        StartTime: '',
        EndTime: '',
        TradeType: '极速抢舱',
        TradeAction: '',
        EmployeeName: ''
      }
    })

    const data = ref([]);

    const tableOption = useTableOption({
      selectFilter(item) {
        return item.Id
      }
    })

    // 获取消费记录
    async function getList() {
      tableOption.loading = true
      let res = await request.get("/api/PayTradeRecord/GetCurrentCompanyRecordList", {
        Page: tableOption.page,
        Limit: tableOption.pageSize,
        ...state.search
      })

      tableOption.total = res.Total;
      data.value = res.Rows;
      tableOption.loading = false;
    }
    // 查询
    function search() {
      tableOption.Page = 1;
      getList();
    }
    // 重置
    function reset() {
      state.search.TradeNumber = "";
      state.search.StartTime = "";
      state.search.EndTime = "";
      state.search.TradeAction = "";
      state.search.EmployeeName = "";
    }

    onMounted(() => {
      getList();
    })

    return {
      agent,
      state,
      certification,
      cargoTabName,
      tableOption,
      getList,
      search,
      reset,
      data
    };
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    back() {
      this.$router.back();
    },
    entry() { },
  },
  mounted() { },
});
</script>

<style lang="scss" scoped>
@import "./FastCargoStyle.scss";
$lable-width: 70px;

.page-search-form {
  padding: 8px;
  background: #f8f8f8;
  margin-bottom: 15px;

  .page-search-form-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    .page-search-form-lable {
      width: $lable-width;
      text-align: end;
    }

    .page-search-form-content {
      display: flex;
      padding-left: 8px;
      width: calc(100% - $lable-width);

      :deep(.el-input__inner) {
        height: 24px !important;
        line-height: 24px !important;
      }

      :deep(.options .option) {
        height: 24px !important;
        line-height: 24px !important;
      }

      :deep(.mid) {
        height: 24px !important;
        line-height: 24px !important;
      }

      :deep(.choose) {
        border: 1px solid #ff9809;
        color: #ff9809;
      }

      :deep(.option:hover) {
        border: 1px solid #ff9809;
        color: #ff9809;
      }

      .text-btn {
        line-height: 24px !important;
        color: #ff9809;
        cursor: pointer;
        margin-left: 8px;
      }

      .search-btn {
        min-height: 24px;
        height: 24px;
        line-height: 0px;
        margin-left: 8px;
      }
    }
  }
}

.task-manage-bar {
  display: flex;

  .task-manage-btn {
    background: #f2f3f5;
    border: 1px solid #f2f3f5;
    border-radius: 2px;
    font-size: 12px;
    color: #3c4144;
    padding: 3px 8px;
    margin-left: 8px;
    cursor: pointer;
  }

  :hover {
    border: 1px solid #ff9809;
    background: #ffedd3;
  }

  .active {
    border: 1px solid #ff9809;
    background: #ffedd3;
  }
}

.cargo-tabs {
  margin-top: 8px;

  :deep(.el-tabs__item.is-active) {
    color: #ff9809;
  }

  :deep(.el-tabs__item:hover) {
    color: #ff9809;
  }
}

.fast-cargo-card-title {
  font-size: 14px;
  color: #3C4144;
  font-weight: 400;
}

.count {
  display: flex;
  align-items: center;

  img {
    width: 12px;
  }

  .red {
    color: #EF4333;
  }

  .green {
    color: #67C23A;
  }
}

:deep(.app_page_table .el-table__header th) {
  background-color: #FFEDD3 !important;
  color: #3C4144;
  padding: 5px 0px;
}

:deep(.el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell) {
  border-bottom: 1px solid #E4E7ED;
}

:deep(.el-table--border .el-table__cell) {
  border-right: 1px solid #E4E7ED;
}

:deep(.el-table--group, .el-table--border) {
  border: 1px solid #E4E7ED;
}
</style>
