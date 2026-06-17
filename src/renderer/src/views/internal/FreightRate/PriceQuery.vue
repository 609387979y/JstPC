<template>
  <div v-loading="priceList.state.isLoading">
     <div v-if="
        favoritePorts.state.desPortList.length
      ">
      <div class="price-card-layout" style="padding-bottom: 8px">
        <div class="fixed-top-query-title">
          <span style="margin-left: -4px">推荐运价</span>
        </div>
        <div class="attention-line">
          <!-- <div style="margin-bottom: 6px">关注线路：</div>
          <el-select
            class="attention-port-select"
            filterable
            v-model="priceList.state.search.PolPortId"
            placeholder="请选择起运港"
            popper-class="freight-select-dropdown"
          >
            <el-option
              v-for="item in favoritePorts.state.polPortList"
              :key="item.PortId"
              :label="`${item.EnPortName},${item.Code}(${item.CnPortName})`"
              :value="item.PortId"
            ></el-option>
          </el-select>
          <img src="@/assets/images/right-arrow.svg" alt="" /> -->

          <div class="port-item-out">
            <!-- <div class="port-item active" @click="priceList.getList">
            {{ priceList.state.selectedFavoriteDesPort.EnPortName }},{{
              priceList.state.selectedFavoriteDesPort.Code
            }}
          </div> -->
            <!-- <div
              class="port-item"
              v-for="item in favoritePorts.state.desPortList"
              @click="selectFavorateDesPort(item)"
              :key="item.PortId"desPortList
              :class="item.isActive ? 'active' : ''"
            >
              {{ item.EnPortName }},{{ item.Code }}
            </div> -->
            <SelectFavorateDesPort ref="selectFavorateDesPortRef" :desPortList="favoritePorts.state.desPortList" @selectFavorateDesPort="selectFavorateDesPort"></SelectFavorateDesPort>
            <el-button type="text" style="margin-left:10px" @click="favoritePorts.state.show = true">管理关注</el-button>
          </div>
        </div>
        <div class="query-group">
          <div class="query-group-left">
            <div class="query-totle">
              共 <span>{{ priceList.state.total }}</span> 条运价
            </div>
          <el-select
           size="mini"
            class="freight-primary-select"
            filterable
            v-model="priceList.state._search.PolPortId"
            @change="priceList.selectPol"
            style="width:100px;"
            popper-class="freight-select-dropdown"
          >
            <el-option
              v-for="item in priceList.state.polPortList"
              :key="item.Id"
              :label="item.EnPortName"
              :value="item.Id"
            ></el-option>
          </el-select>
            <el-select
              size="mini"
              class="query-item freight-primary-select"
              filterable
              v-model="priceList.state._search.ShippingId"
              @change="priceList.selectShip"
            >
              <el-option
                v-for="item in priceList.state.shipList"
                :key="item.Id"
                :label="item.Code"
                :value="item.Id"
              >
                <span style="float: left">{{ item.CnShippingName }}</span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                  "
                  >{{ item.Code }}</span
                >
              </el-option>
            </el-select>
            <el-select
              size="mini"
              class="query-item freight-primary-select"
              filterable
              v-model="priceList.state._search.ETDDate"
              placeholder="请选择班期"
              @change="priceList.selectETDdate"
            >
              <el-option
                v-for="item in priceList.weekQuery"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              size="mini"
              class="query-item freight-primary-select"
              filterable
              v-model="priceList.state._search.LineType"
              @change="priceList.selectLineType"
              placeholder="直达/中转"
            >
              <el-option
                v-for="item in priceList.state.LineTypeOption"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <div class="query-date-picker">
              <el-select
                size="mini"
                class="query-item freight-primary-select"
                filterable
                v-model="priceList.state._search.StartTime"
                placeholder="计划出运日"
              >
                <el-option label="计划出运日" value="计划出运日"></el-option>
              </el-select>
              <el-date-picker
                class="abs-picker"
                style="
                  width: 123px;
                  position: absolute;
                  left: 523px;
                  opacity: 0;
                  z-index: 10;
                  cursor: pointer;
                "
                size="mini"
                popper-class="data-picker-freight-primary"
                v-model="priceList.state.search.DateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD"
                @change="priceList.getList"
              >
              </el-date-picker>
            </div>
            <el-select
              size="mini"
              class="query-item freight-primary-select"
              style="margin-left: 16px"
              filterable
              v-model="priceList.state._search.IsTzx"
              placeholder="特种箱"
            >
              <el-option
                @click="priceList.selectIsTzx"
                label="显示特种箱"
                value="显示特种箱"
              ></el-option>
            </el-select>
          </div>
          <div class="query-group-right">
            <el-select
              class="attention-port-select"
              filterable
              v-model="priceList.state.search.SortValue"
              @change="priceList.getList"
              popper-class="freight-select-dropdown"
            >
              <el-option :label="'20GP价格最低优先'" :value="'20GP'"></el-option>
              <el-option :label="'40GP价格最低优先'" :value="'40GP'"></el-option>
              <el-option :label="'40HQ价格最低优先'" :value="'40HQ'"></el-option>
              <!-- <el-option :label="'45HQ价格最低优先'" :value="'45HQ'"></el-option>
              <el-option :label="'40NOR价格最低优先'" :value="'40NOR'"></el-option> -->
            </el-select>
          </div>
        </div>
        <div class="query-tag-group">
          <div class="query-tag-title" v-if="priceList.state.polTagList.length">
            起运港：
          </div>
           <el-tag
            v-for="(item, index) in priceList.state.polTagList"
            :key="item.Id"
            class="ml-2 query-tag"
            type=""
            closable
            @close="priceList.closePolTag(index)"
            >{{ item.EnPortName }}</el-tag
          >
          <div class="query-tag-title" v-if="priceList.state.shipTagList.length">
            船公司：
          </div>

          <el-tag
            v-for="(item, index) in priceList.state.shipTagList"
            :key="item.Id"
            class="ml-2 query-tag"
            type=""
            closable
            @close="priceList.closeShipTag(index)"
            >{{ item.Code }}</el-tag
          >
          <div class="query-tag-title" v-if="priceList.state.ETDDateTagList.length">
            班期：
          </div>

          <el-tag
            v-for="(item, index) in priceList.state.ETDDateTagList"
            :key="item.value"
            class="ml-2 query-tag"
            type=""
            @close="priceList.closeWeekTag(index)"
            closable
            >{{ item.label }}</el-tag
          >
          <div class="query-tag-title" v-if="priceList.state.LineTypeTagList.length">
            直达/中转：
          </div>

          <el-tag
            class="ml-2 query-tag"
            closable
            type="warning"
            v-for="(item, index) in priceList.state.LineTypeTagList"
            :key="item"
            @close="priceList.closeLineTypeTag(index)"
          >
            {{ priceList.state.LineTypeOption.find((e) => e.value === item).label }}
          </el-tag>
          <div class="query-tag-title" v-if="priceList.state.search.DateRange.length">
            开航时间：
          </div>
          <el-tag
            class="ml-2 query-tag"
            v-if="priceList.state.search.DateRange.length"
            type=""
            closable
            @close="
              () => {
                priceList.state.search.DateRange = [];
                priceList.state.search.StartTime = '';
                priceList.state.search.EndTime = '';
              }
            "
            >{{ priceList.state.search.DateRange[0] }} -
            {{ priceList.state.search.DateRange[1] }}</el-tag
          >
          <div class="query-tag-title" v-if="priceList.state.search.IsTzx == 1">
            特种箱：
          </div>
          <el-tag
            class="ml-2 query-tag"
            v-if="priceList.state.search.IsTzx == 1"
            type=""
            closable
            @close="
              () => {
                priceList.state.search.IsTzx = -1;
                priceList.getList();
              }
            "
            >查看特种箱</el-tag
          >
          <el-button
            type="text"
            @click="priceList.reset"
            v-if="
              priceList.state.polTagList.length ||
              priceList.state.search.DateRange.length ||
              priceList.state.LineTypeTagList.length ||
              priceList.state.ETDDateTagList.length ||
              priceList.state.shipTagList.length
            "
            >清除条件</el-button
          >
        </div>
        <!-- <div class="fall-list-title">
        <div class="float-title">
          <div style="width: 35%" class="float-title-ship">
            <div class="title-ship">所属公司</div>
            <div style="width: 33.33%"></div>
          </div>
          <div style="width: 65%">航程</div>
        </div>
        <div class="fixed-title">
          <div class="fixed-title-price">20GP</div>
          <div class="fixed-title-price">40GP</div>
          <div class="fixed-title-price">40HQ</div>
          <div class="fixed-title-price">45HQ</div>
          <div class="fixed-title-price">40NOR</div>
          <div style="width: 100px">截关/开航</div>
          <div style="width: 200px; text-align: end">操作</div>
        </div>
      </div> -->
      </div>
      <div style="padding-bottom: 8px">
        
        <div class="scroll-content" id="priceScroll">
          <AppInfiniteScroll
            :loading="priceList.state.fallLoading"
            :nomore="priceList.state.nomore"
            @loadBottom="priceList.loadMore"
            v-loading="priceList.state.loading"
          >
            <FreightListGroup
              :data="priceList.state.tableData"
              :loading="priceList.state.loading"
              :isCertification="favoritePorts.state.isCertification"
              @openDrawer="openDrawer"
            ></FreightListGroup>
            <!-- <template #nomore>暂无更多数据……</template> -->
          </AppInfiniteScroll>
        </div>
      </div>
    </div>
    <!-- <FirstGuide
      v-else
      @setPort="initFavoritePort"
    ></FirstGuide> -->
   

    <el-dialog
      title="管理关注"
      v-model="favoritePorts.state.show"
      width="800px"
      @close="initFavoritePort()"
    >
      <ManageFavoritePort></ManageFavoritePort>
      <template #footer>
        <el-button
          class="freight-default-button"
          @click="(favoritePorts.state.show = false), initFavoritePort(),updateScroll()"
          >关闭</el-button
        >
      </template>
    </el-dialog>

    <InquiryPriceDrawer :ref="(e) => (drawer.drawerRef = e)"></InquiryPriceDrawer>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, computed, watch } from "vue";
import AppInfiniteScroll from "@/components/AppInfiniteScroll.vue";
import { useTableOption } from "justom-share";
import request from "@/public/request";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import dayjs from "dayjs";
import { InfoFilled } from "@element-plus/icons";
import FirstGuide from "./FirstGuide.vue";
import FreightListGroup from "./components/NewFreightListGroup.vue";
import InquiryPriceDrawer from "./components/ConsultPriceDrawer.vue";
// import ManageFavoritePort from "./ManageFavoritePort.vue";
import { getElectronAgent } from "@share/agent";
import SelectFavorateDesPort from "./components/SelectFavorateDesPort.vue"
import ManageFavoritePort from "./components/ManageFavoritePort.vue";

function useTools() {
  function replaceHg(e) {
    let text = dayjs(e).format("YYYY/MM/DD");
    return text;
  }
  return reactive({
    replaceHg,
  });
}
/*唤起子组件的抽屉*/
function drawers() {
  const drawerRef = ref("");
  function openDrawer(Id, type, LogId) {
    drawerRef.value.drawer.openDrawer(Id, type, LogId);
  }
  return reactive({
    drawerRef,
    openDrawer,
  });
}

/**
 * 运价查询
 */
function usePriceList() {
  const state = reactive({
    selectedFavoriteDesPort: {},
    search: {
      // 起运港
      PolPortId: "",
      // 目的港
      DestPortId: "",
      // 船公司
      ShippingId: "",
      // 航线类型 -1不限 0:直达 1:中转
      LineType: "",
      // 截关日
      CSTDate: "",
      // 开航日
      ETDDate: "",
      //0开航，1进港
      TimeType: 0,
      // 范围
      DateRange: [],
      // 排序值 20GP;40GP;40HQ;45HQ;40NOR
      SortValue: "20GP",
      // 排序方式 0:升序 1:降序
      SortKey: "0",
      //开航日期
      StartTime: "",
      EndTime: "",
    },
    _search: {
      //起运港
      PolPortId:"起运港",
      // 船公司
      ShippingId: "船公司",
      // 航线类型 -1不限 0:直达 1:中转
      LineType: "直达/中转",
      // 开航日
      ETDDate: "班期",
      //开航时间
      StartTime: "开航时间",
      IsTzx: "特种箱",
    },
    ShippingName: "",
    ETDDateName: "",
    // 数据
    tableData: [],
    // 列表页数相关配置
    tableOption: useTableOption({}),
    // 触碰底部加载
    fallLoading: false,
    // 加载
    loading: false,
    // 没有更多
    nomore: false,
    // 更多搜索条件
    searchAdvance: false,
    polTagList:[],
    //船公司列表
    shipList: [],
    shipTagList: [],
    ETDDateTagList: [],
    LineTypeOption: [
      {
        label: "直达",
        value: 0,
      },
      {
        label: "中转",
        value: 1,
      },
    ],
    LineTypeTagList: [],
    isLoading: true,
  });

  /**
   * 加载更多
   */
  async function loadMore() {
    if (!state.nomore) {
      state.tableOption.page++;
      state.fallLoading = true;
      let res = await getListData();
      for (let item of res.Rows) {
        state.tableData.push(item);
      }
      state.fallLoading = false;
      if (state.total == state.tableData.length) {
        state.nomore = true;
      } else {
        state.nomore = false;
      }
    }
  }

  // 获得列表
  async function getList() {
    state.tableOption.page = 1;
    state.loading = true;
    let res = await getListData();
    state.tableData = res.Rows;
    state.total = res.Total;
    state.loading = false;
    state.isLoading = false;
  }

  // 获得列表数据
  async function getListData() {
    state.search.ShippingId = "";
    state.search.ETDDate = "";
    if (state.search.DateRange != null) {
      state.search.StartTime = state.search.DateRange[0];
      state.search.EndTime = state.search.DateRange[1];
    }
    let polIdList = [];
    if (state.polTagList.length) {
      state.polTagList.forEach((pol) => {
        polIdList.push(pol.Id);
      });

      state.search.PolPortId = polIdList.join(",");
    }
    let shipIdList = [];
    if (state.shipTagList.length) {
      state.shipTagList.forEach((ship) => {
        shipIdList.push(ship.Id);
      });

      state.search.ShippingId = shipIdList.join(",");
    }

    let ETDDateTagList = [];
    if (state.ETDDateTagList.length) {
      state.ETDDateTagList.forEach((day) => {
        ETDDateTagList.push(day.value);
      });
      state.search.ETDDate = ETDDateTagList.join(",");
    }
    let res = await request.get("/api/FRRateCus/GetRateCusList", {
      Page: state.tableOption.page,
      limit: state.tableOption.pageSize,
      ...state.search,
    });
    return res;
  }

  function reset() {
    state.search = {
      // 起运港
      PolPortId: state.search.PolPortId,
      // 目的港
      DestPortId: state.search.DestPortId,
      // 船公司
      ShippingId: "",
      // 航线类型 -1不限 0:直达 1:中转
      LineType: "",
      // 截关日
      CSTDate: "",
      // 开航日
      ETDDate: "",
      TimeType: 0,
      // 范围
      DateRange: [],
      // 排序值 20GP;40GP;40HQ;45HQ;40NOR
      SortValue: "20GP",
      // 排序方式 0:升序 1:降序
      SortKey: "0",
      //开航日期
      StartTime: "",
      EndTime: "",
    };
    state.polTagList=[];
    state.shipTagList = [];
    state.ETDDateTagList = [];
    state.LineTypeTagList = [];
    state.ShippingName = "";
    state.ETDDateName = "";
    getList();
  }

  const popoverState = reactive({
    feeLoading: false,
    feeDetailData: [],
    LocFeeDetailData: [],
  });

  async function showThisFee(row) {
    popoverState.feeLoading = true;
    let res = await request.get("/api/FRRate/GetFRRateFeeDetail", {
      Id: row.Id,
    });
    popoverState.feeLoading = false;
    popoverState.feeDetailData = res.FeeDetail;
  }

  async function showThisLocFee(row) {
    state.feeLoading = true;
    let res = await request.get("/api/FRRate/GetLocFRRateFeeDetail", {
      Id: row.Id,
    });
    popoverState.feeLoading = false;
    popoverState.LocFeeDetailData = res.LocFeeDetail;
  }

  /**
   * 设置上架/下架状态
   * @param {*} id id
   * @param {*} isRelease true:上架 false:下架
   */
  async function setReleaseRateStatus(id, isRelease) {
    let res = await request.get("/api/FRRate/ReleaseRate", {
      Id: id,
      IsRelease: isRelease,
    });
    if (res.Status == false) {
      ElMessage.error(res.Message);
      return;
    }
    ElMessage.success("操作成功");
    getList();
  }

  async function getShippingList() {
    let res = await request.get("/api/FRShipping/GetShippingList", {
      Page: -1,
      Limit: -1,
    });
    state.shipList = res.Rows;
  }
  // 选择起运港
   function selectPol(Id) {
    state._search.PolPortId = "起运港";
    state.polPortList.forEach((pushPol) => {
      if(Id==pushPol.Id){
         state.polTagList.push(pushPol)
      }
    })
    state.polTagList = [...new Set(state.polTagList)];
    getList();
  }
  // 关闭起运港Tag
  function closePolTag(index) {
    state.polTagList.splice(index, 1);
    getList();
  }
  // 选择船公司
  function selectShip(Id) {
    state._search.ShippingId = "船公司";
    state.shipList.forEach((pushShip) => {
      if (pushShip.Id == Id) {
        if (state.shipTagList.length == 0) {
          state.shipTagList.push(pushShip);
        } else {
          let findStatus = false;
          state.shipTagList.forEach((ship) => {
            if (ship.Id == Id) {
              // Elmessage
              findStatus = true;
            }
          });
          if (!findStatus) {
            state.shipTagList.push(pushShip);
          }
        }
      }
    });
    getList();
  }

  // 关闭船公司Tag
  function closeShipTag(index) {
    state.shipTagList.splice(index, 1);
    getList();
  }

  const weekQuery = reactive([
    { label: "周一", value: "1" },
    { label: "周二", value: "2" },
    { label: "周三", value: "3" },
    { label: "周四", value: "4" },
    { label: "周五", value: "5" },
    { label: "周六", value: "6" },
    { label: "周日", value: "7" },
  ]);

  // 选择班期
  function selectETDdate(val) {
    state._search.ETDDate = "班期";
    weekQuery.forEach((pushWeek) => {
      if (pushWeek.value == val) {
        if (state.ETDDateTagList.length == 0) {
          state.ETDDateTagList.push(pushWeek);
        } else {
          let findStatus = false;
          state.ETDDateTagList.forEach((week) => {
            if (week.value == val) {
              // Elmessage
              findStatus = true;
            }
          });
          if (!findStatus) {
            state.ETDDateTagList.push(pushWeek);
          }
        }
      }
    });
    getList();
  }

  // 关闭班期tag
  function closeWeekTag(index) {
    state.ETDDateTagList.splice(index, 1);
    getList();
  }

  // 航线类型tag
  function selectLineType(val) {
    state._search.LineType = "直达/中转";
    if (val !== 0 && val !== 1) {
      return;
    }
    state.LineTypeTagList.push(val);
    state.LineTypeTagList = [...new Set(state.LineTypeTagList)];
    if (state.LineTypeTagList.length >= 2) {
      state.search.LineType = -1;
    } else {
      state.search.LineType = val;
    }
    getList();
  }
  function selectIsTzx(val) {
    state._search.IsTzx = "特种箱";
    state.search.IsTzx = 1;
    getList();
  }
  function closeLineTypeTag(index) {
    state.LineTypeTagList.splice(index, 1);
    if (state.LineTypeTagList.length == 1) {
      state.search.LineType = state.LineTypeTagList[0];
    } else {
      query.LineType = -1;
    }
    getList();
  }

  onMounted(() => {
    getShippingList();
  });

  return reactive({
    state,
    loadMore,
    getList,
    popoverState,
    getShippingList,
    showThisFee,
    showThisLocFee,
    reset,
    setReleaseRateStatus,
    selectPol,
    closePolTag,
    selectShip,
    closeShipTag,
    selectETDdate,
    selectLineType,
    selectIsTzx,
    closeLineTypeTag,
    weekQuery,
    closeWeekTag,
  });
}

function useFavoritePorts() {
  const state = reactive({
    polPortList: [],
    desPortList: [],
    show: false,
    isCertification: false,
  });
  // const priceList = usePriceList();
  async function getFavoritePorts() {
    let res = await request.get("/api/FRInquireFavoritePort/GetFavoritePorts");
    return res;
  }
  const store = useStore();
  //验证是否经过企业认证
  async function certification() {
    await store.dispatch("auth/checkAndTryChooseEmployee");
    state.isCertification = store.state.auth.certificationStatus;
  }

  onMounted(() => {
    certification();
  });

  return reactive({
    state,
    getFavoritePorts,
    certification,
  });
}

export default defineComponent({
  components: {
    AppInfiniteScroll,
    FirstGuide,
    ManageFavoritePort,
    InquiryPriceDrawer,
    InfoFilled,
    FreightListGroup,
    SelectFavorateDesPort,
  },
  setup() {
    const weekCn = reactive(["周一", "周二", "周三", "周四", "周五", "周六", "周日"]);
    const priceList = usePriceList();
    const tools = useTools();
    const favoritePorts = useFavoritePorts();
    const drawer = drawers();
    const agent = getElectronAgent();
    const selectFavorateDesPortRef = ref(null)
    /**
     * 选择筛选的目的港
     * @param {*} item {PortId,EnPortName,Code}
     */
    const selectFavorateDesPort = (item) => {
      
      //初始化关注目的港isActive状态
      favoritePorts.state.desPortList.forEach((dest) => {
        dest.isActive = false;
      });
      item.isActive = true;

      //查询项赋值请求
      priceList.state.search.DestPortId = item.PortId;
      priceList.state.selectedFavoriteDesPort.EnPortName = item.EnPortName;
      priceList.state.selectedFavoriteDesPort.Code = item.Code;
      priceList.getList();
    };

    //关闭管理关注弹窗
    const closeFavoritePortDialog = async () => {
      await initFavoritePort();
      priceList.getList();
      favoritePorts.state.show = false;
    };
    async function getPolPortList() {
    let res = await request.get("/api/FRPort/GetFRPortList", {
      Page: -1,
      Limit: -1,
      IsPol: true,
    });
    priceList.state.polPortList = res.Rows;
  }
    //初始化关注线路
    const initFavoritePort = async () => {
      let res = await favoritePorts.getFavoritePorts();
      if (res.PolPorts.length || res.DestPorts.length) {
        // favoritePorts.state.polPortList = res.PolPorts;
        favoritePorts.state.desPortList = res.DestPorts;

        //初始化active状态
        favoritePorts.state.desPortList.forEach((item) => {
          item.isActive = false;
        });

        //查询项赋值
        // if (!priceList.state.search.PolPortId) {
        //   priceList.state.search.PolPortId = res.PolPorts[0].PortId;
        // }
        if (!priceList.state.search.DestPortId) {
          priceList.state.search.DestPortId = res.DestPorts[0].PortId;
        }
        favoritePorts.state.desPortList[0].isActive = true;
        priceList.state.selectedFavoriteDesPort.EnPortName = res.DestPorts[0].EnPortName;
        priceList.state.selectedFavoriteDesPort.Code = res.DestPorts[0].Code;
      }
    };

    // 询价
    const openDrawer = (Id, type, LogId) => {
      if (!favoritePorts.state.isCertification) {
        agent.ipcRequest("freight/newWin", {
          type: "small",
          url: "/internalComponents/userAuthorization?type=freight",
        });
        return ElMessage.warning("请先进行企业认证");
      }
      drawer.openDrawer(Id, type, LogId);
    };
    function updateScroll(){
    selectFavorateDesPortRef.value.updateScroll()
  }
    onMounted(async () => {
      //获取起运港
      await getPolPortList()
      //初始化关注线路
      await initFavoritePort();
      //获取列表
      priceList.getList();
    });

    return {
      priceList,
      weekCn,
      tools,
      favoritePorts,
      closeFavoritePortDialog,
      selectFavorateDesPort,
      initFavoritePort,
      drawer,
      openDrawer,
      selectFavorateDesPortRef,
      updateScroll,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/mainifest/mainifestStyle.scss";
@import "@/styles/FCLFreight/FCLFreight.scss";
@import "@/styles/FCLFreight/FCLFreightFallList.scss";
.query-top-fixed {
  // position: fixed;
  // width: calc(100% - 234px);
  // z-index: 10;
}
.scroll-content {
  height: calc(100vh - 265px);
}
.price-card-layout {
  background: white;
  padding: 24px;
  border: 1px solid #E4E7ED;
  border-radius: 4px;
  .fixed-top-query-title {
    font-size: 14px;
    color: #303133;
    font-weight: bold;
    margin-bottom: 8px;
  }
}

.manifest_config_container {
  padding: 10px;
  .btns {
    margin-bottom: 10px;
  }
}
.dialog-input-item {
  display: flex;
  display: flex;
  align-items: center;
  .dialog-input-lable {
    width: 140px;
    text-align: end;
    padding: 0 10px;
  }
}
.text-blue {
  color: #409eff;
  cursor: pointer;
}
.button-group-flex {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
}
.search-time-item {
  :deep(.el-form-item__content) {
    display: flex;
  }

  .quick-btns {
    display: flex;
    margin-left: 5px;

    .btn {
      padding: 0 5px;
      font-size: 12px;
      color: #dcdee0;
      border: 1px solid #dcdee0;
      margin-right: 2px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;

      &.active {
        color: #1f8efa;
        border-color: #1f8efa;
      }
    }
  }
}

.remark-main-hover {
  padding: 12px 16px;
  background: #fdf6ed;
  .title {
    font-size: 12px;
    color: #e6a23d;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .content {
    font-size: 12px;
    color: #909399;
  }
}
.remark-hover {
  padding: 12px 16px;
  background: #edf4ff;
  margin-top: 8px;
  .title {
    font-size: 12px;
    color: #409eff;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .content {
    font-size: 12px;
    color: #909399;
  }
}

:deep(.el-checkbox) {
  margin-right: 10px;
}
:deep(.el-select-dropdown__option-item span) {
  display: flex;
  justify-content: space-between;
}

:deep(.el-form-item__label) {
  font-size: 12px;
}
:deep(.div-3) {
  max-width: 11%;
}
:deep(.el-input__inner) {
  // padding: 0 5px;
}
:deep(.el-select-v2__popper > .el-select-dropdown) {
  width: 300px !important;
}
:deep(.el-form-item__label) {
  padding: 0 5px 0 0;
}
:deep(.el-select-v2__placeholder) {
  font-size: 12px;
}
:deep(.el-form-item--mini.el-form-item) {
  margin-bottom: 10px;
}
:deep(.el-range-separator) {
  line-height: 26px;
  font-size: 12px;
}
/* el-select */
.mutiple-input {
  & :deep(.el-icon-arrow-up) {
    display: none;
  }
}
.fee-table {
  th,
  td {
    padding: 0 10px;
    text-align: center;
  }
}

.search {
  background-color: #fff;
  padding: 10px;
  display: flex;
  :deep(.el-form-item--small.el-form-item) {
    margin-bottom: 0px;
  }
  // display: flex;
  // align-items: center;
}
.summary {
  color: #969799;
  display: flex;
  justify-content: space-between;
  margin: 8px 0px;
}
.attention-line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  font-size: 14px;
  // margin-bottom: 12px;
  .attention-port-select {
    width: 168px;
    margin-bottom: 6px;
    :deep(.el-input__inner) {
      height: 29px;
      line-height: 29px;
      background: #fcf1e7;
      color: #fd953e;
      padding: 0 10px;
      border: none;
    }
    :deep(.el-icon) {
      color: rgba(253, 149, 62, 0.45);
    }
    :deep(.el-input__suffix) {
      right: -1px;
    }
  }
  .port-item-out {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    font-size: 14px;
    margin-bottom: 12px;
    width: 100%;
  }

  img {
    width: 28px;
    height: 16px;
    margin: 0 8px;
  }
}
.query-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  .query-group-left {
    display: flex;
    align-items: center;
    .query-totle {
      margin-right: 8px;
      span {
        color: #fd953e;
      }
    }
    .query-item {
      width: 96px;
      margin-left: 8px;
    }
    .query-date-picker {
      // margin-left: 8px;
      width: 114px;
      :deep(.el-input) {
        width: 114px;
      }
      .abs-picker {
        width: 123px;
        position: absolute;
        left: 429px;
        opacity: 0;
        z-index: 10;
        cursor: pointer;
      }
    }
  }
  .query-group-right {
    .attention-port-select {
      width: 168px;
      :deep(.el-input__inner) {
        height: 29px;
        line-height: 29px;
        background: #fcf1e7;
        color: #fd953e;
        padding: 0 10px;
        border: none;
      }
      :deep(.el-icon) {
        color: rgba(253, 149, 62, 0.45);
      }
    }
  }
}
.query-tag-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .query-tag-title {
    margin-right: 8px;
  }
  .query-tag {
    margin-right: 8px;
    background: #fcf1e7;
    color: #fd953e;
    border: none;
    :deep(.el-tag__close) {
      color: #fd953e;
      &:hover {
        background: #fa7b13;
        color: white;
      }
    }
  }
}
</style>
<style>
body {
  overflow: visible !important;
}
.el-overlay-dialog {
  position: relative;
}
.el-select-v2__popper .el-select-dropdown__list {
  min-width: 300px;
}
/* el-select */
.poppertest {
  display: none;
}
.float-content-hc-group {
  display: flex;
}
</style>
