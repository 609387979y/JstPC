<template>
  <div>
    <div class="search">
      <div>
        <el-space :size="6">
          <div>
            <el-select filterable v-model="state.search.carrierCode" placeholder="船公司">
              <el-option
                v-for="item in shipping.list"
                :label="`${item.ShippingSimName}(${item.Code})`"
                :value="item.Code"
              ></el-option>
            </el-select>
          </div>
          <div>
            <el-select v-model="state.search.type">
              <el-option label="提单号" value="billNo"></el-option>
              <el-option label="箱号" value="containerNo"></el-option>
            </el-select>
          </div>
          <div>
            <el-input
              style="width: 266px;"
              v-model="state.search.searchValue"
              :suffix-icon="Search"
              placeholder="请输入相应的单号进行搜索"
              clearable
            ></el-input>
          </div>
        </el-space>
      </div>
      <div>
        <el-button @click="subscribe" type="primary">订阅</el-button>
      </div>
    </div>
    <div class="list-info">已订阅跟踪，共{{ state.list.total }}条</div>
    <el-card shadow="nerver" class="record-card">
      <template #header>
        <div class="record-card-header">
          <div>
            <div class="order-by-list">
              <div
                class="order-by"
                @click="chooseOrderBy(QueryOrderBy.AddTime)"
                :class="state.list.query.Order == QueryOrderBy.AddTime ? 'choose' : ''"
              >按新增日</div>
              <div
                class="order-by"
                @click="chooseOrderBy(QueryOrderBy.LeaveTime)"
                :class="state.list.query.Order == QueryOrderBy.LeaveTime ? 'choose' : ''"
              >按离港日</div>
              <div
                class="order-by"
                @click="chooseOrderBy(QueryOrderBy.ArrivalTime)"
                :class="state.list.query.Order == QueryOrderBy.ArrivalTime ? 'choose' : ''"
              >按到港日</div>
            </div>
          </div>
          <div>
            <el-input
              style="width: 266px;margin-right: 14px;"
              v-model="state.list.query.No"
              :suffix-icon="Search"
              placeholder="请输入相应的单号进行搜索"
              clearable
              @change="resetAndGetList"
            ></el-input>
          </div>
        </div>
      </template>
      <div v-loading="state.list.loading" class="record-list">
        <template v-if="state.list.data.length != 0">
          <template v-for="(item,idx) in state.list.data" :key="item.Id">
            <TrackOceanRecord @reload="resetAndGetList" class="record-item" :data="item"></TrackOceanRecord>
            <el-divider class="split" v-if="idx != state.list.data.length - 1"></el-divider>
          </template>
        </template>
        <template v-else>
          <div class="empty">
            <div>
              <img src="@/assets/images/no-data.svg" />
            </div>
            <div style=" margin-top: 30px;">暂无数据</div>
          </div>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watchEffect } from "vue"
import { Search } from "@element-plus/icons"
import { ShippingInfo } from "@/types/freight-base"
import request from "@/public/request"
import { ElMessage, ElLoading } from "element-plus"
import TrackOceanRecord from "@/components/trackOcean/TrackOceanRecord.vue"
import { utils } from "justom-share"
import { useRoute } from "vue-router"


// 搜索类型
type SearchType = "billNo" | "containerNo"
enum QueryOrderType {
  // 升序
  ASC = 0,
  // 降序
  DESC = 1,
}
enum QueryOrderBy {
  // 新增日期
  AddTime = 0,
  // 离港日期
  LeaveTime = 1,
  // 到港日期
  ArrivalTime = 2,
}

const route = useRoute()
const state = reactive({
  search: {
    carrierCode: "",
    // 单号
    searchValue: "",
    type: <SearchType>"billNo"
  },
  // 数据列表
  list: {
    query: {
      page: -1,
      limit: 10,
      // 单号
      No: "",
      //  0-> 新增日期  1-> 离港日期  2->到港日期
      Order: QueryOrderBy.AddTime,
      // asc / desc
      OrderType: QueryOrderType.DESC,

    },
    loading: false,
    // 总数
    total: 0,
    data: <any[]>[]
  }
})



/**
 * 船公司相关
 */
function useShipping() {
  const list = ref<ShippingInfo[]>([])
  async function getAllShipping() {
    let res = await request.get("/api/FreightBaseShipping/GetList", {
      page: -1
    })
    list.value = res.Rows
  }

  // 通过提单号获得 船公司
  const getShippingByBillNo = utils.debounce(async () => {
    let res = await request.get("/api/FreightBaseShipping/GetShippingCodeByBillNo", {
      billNo: state.search.searchValue
    })
    if (res.Status) {
      state.search.carrierCode = res.Data;
    }
  })

  watchEffect(() => {
    if (state.search.searchValue == "" || state.search.type == "containerNo") {
      return;
    }
    getShippingByBillNo()
  })



  onMounted(async () => {
    await getAllShipping()
  })



  return reactive({
    list
  })
}
const shipping = useShipping()


/**
 * 根据query 请求 已订阅的数据
 */
async function requestList() {
  state.list.loading = true
  let res = await request.get("/api/CT_TrackOcean/GetList", {
    ...state.list.query
  })
  state.list.total = res.Total
  state.list.data = state.list.data.concat(res.Rows)
  state.list.loading = false
}
// 回到第一页
function resetAndGetList() {
  state.list.data = []
  state.list.query.page = -1;
  requestList()
}


function chooseOrderBy(by: QueryOrderBy) {
  if (by == state.list.query.Order) {
    return;
  }
  state.list.query.Order = by
  resetAndGetList()
}

onMounted(() => {
  if (route.query.carrierCode) {
    state.search.carrierCode = route.query.carrierCode as string;
  }
  if (route.query.searchValue) {
    state.search.searchValue = route.query.searchValue as string;
  }
  if (route.query.type == "billNo" || route.query.type == "containerNo") {
    state.search.type = route.query.type as SearchType;;
  }
  if (route.query.searchValue && route.query.carrierCode) {
    subscribe()
  }




  resetAndGetList()
})

/**
 * 订阅
 */
async function subscribe() {
  if (!state.search.carrierCode) {
    ElMessage.warning("请选择船公司")
    return
  }

  if (!state.search.searchValue) {
    ElMessage.warning("请输入" + (state.search.type === "billNo" ? "提单号" : "箱号"))
    return
  }

  const loading = ElLoading.service({
    lock: true,
  })
  let req = {
    billNo: "",
    containerNo: "",
    carrierCode: state.search.carrierCode,
  }
  if (state.search.type === "billNo") {
    req.billNo = state.search.searchValue
  } else {
    req.containerNo = state.search.searchValue
  }
  try {
    let res = await request.post("/api/CT_TrackOcean/Subscribe", req)

    if (res.Status) {
      ElMessage.success(res.Message)
    } else {
      ElMessage.error(res.Message)
    }

    resetAndGetList();
  } catch {


  } finally {
    loading.close()
  }

}









</script>

<style lang='scss' scoped>
.search {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 16px 0px 8px;
}
.suffix-icon {
  line-height: 32px;
}

.record-list {
  background-color: #fff;
}
.list-info {
  font-size: 12px;
  color: #969799;
  letter-spacing: 0;
  font-weight: 400;
  padding: 8px 0px;
}
.record-card {
  :deep(.el-card__header) {
    padding: 0px;
  }
  :deep(.el-card__body) {
    padding: 0px;
  }
  .record-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
  }
  .record-item {
    padding: 9px 24px;
    &:hover {
      background-color: #f7f8fa;
    }
  }
  .split {
    margin: 0px;
  }
}

.order-by-list {
  display: flex;
  margin-left: 24px;
  .order-by {
    margin-right: 64px;
    cursor: pointer;
    font-size: 12px;
    color: #303133;
    letter-spacing: 0;
    font-weight: 500;
    &.choose {
      color: #409eff;
    }
  }
}
.empty {
    text-align: center;
    font-size: 14px;
    color: #909399;
    margin-top: 10px;
}
</style>