<template>
  <div class="price-card-layout" style="margin-bottom: 8px">
    <div class="search-container">
      <div class="search-group">
        <div class="search-group-item">
          <div class="search-group-item-title">起运港</div>
          <img src="@/assets/images/port_02.svg" alt="" />
          <el-select
            class="search-port-select"
            filterable
            v-model="priceList.state.search.PolPortId"
            placeholder="请选择起运港"
            popper-class="freight-select-dropdown"
          >
            <el-option
              v-for="item in priceList.state.polPortList"
              :key="item.Id"
              :label="`${item.EnPortName},${item.Country}(${item.CnPortName})`"
              :value="item.Id"
            ></el-option>
          </el-select>
        </div>
        <div class="search-group-item">
          <div class="search-group-item-title">目的港</div>
          <img
            v-if="priceList.state.search.DestPortId"
            src="@/assets/images/port_02.svg"
            alt=""
          />
          <img v-else src="@/assets/images/port_01.svg" alt="" />
          <div
            class="desPort-selectde-content"
            @click="priceList.state.destPortVisible = true"
          >
            <el-popover
              width="600px"
              trigger="click"
              v-model:visible="priceList.state.destPortVisible"
              class="el-popover"
              popper-class="el-popover-class"
            >
              <template #reference>
                <el-input
                  class="dest-port-select"
                  size="mini"
                  v-model="priceList.state._search.destPortName"
                  placeholder="请选择目的港"
                  @input="priceList.watchInput"
                ></el-input>
              </template>
              <div
                class="inputQuery"
                v-if="priceList.state._search.destPortName.length"
              >
                <div class="inputQuery-header">
                  <div>支持中英文输入</div>
                  <div>航线</div>
                </div>
                <div
                  class="inputQuery-container"
                  v-for="(items1, index) in priceList.inputQueryList"
                  :key="index"
                >
                  <div
                    class="container-items"
                    v-for="(items2, index2) in items1.gangkou"
                    :key="index2"
                    @click="
                      priceList.confirmQuery(items2.Id, items2.EnPortName)
                    "
                  >
                    <div>
                      {{ items2.CnPortName }}&nbsp;{{ items2.EnPortName }}
                    </div>
                    <div>{{ items1.LineName }}</div>
                  </div>
                </div>
                <div
                  v-if="!priceList.inputQueryList.length"
                  style="padding: 5px 10px"
                >
                  暂无港口
                </div>
              </div>
              <AppDestPortContent
                v-else
                style="padding: 14px 12px"
                @selectPort="priceList.selectDesPort"
                :isHistory="false"
                :type="1"
              ></AppDestPortContent>

              <!-- <AppDestport
                    :visible="priceList.state.destPortVisible"
                    :type="1"
                    :btnType="1"
                    @selectPort="priceList.selectDesPort"
                  ></AppDestport> -->
            </el-popover>
            <!-- <div
              v-if="!priceList.state.destPortName"
              style="color: #c0c4cc; font-size: 13px"
            >
              请选择目的港
            </div>
            <div
              v-if="priceList.state.destPortName"
              style="color: #606266; font-size: 13px"
            >
              {{ priceList.state.destPortName }}({{ priceList.state.destPortCnName }})
            </div> -->
          </div>
        </div>
        <div class="search-group-item">
          <div class="search-group-item-title">有效期</div>
          <div class="search-port-daterange">
            <el-date-picker
              clearable
              v-model="priceList.state.search.DateRange"
              popper-class="data-picker-freight-primary"
              type="daterange"
              range-separator="至"
              start-placeholder="请选择有效期开始时间"
              end-placeholder="请选择有效期结束时间"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </div>
        </div>
        <div></div>
      </div>
      <img
        class="search-icon"
        @click="priceList.getList"
        src="@/assets/images/search-icon.svg"
        alt=""
      />
    </div>
    <div class="search-history" v-if="priceList.state.historyPortList.length">
      <div class="search-history-title">历史搜索：</div>
      <div class="search-history-content">
        <div
          v-for="item in priceList.state.historyPortList"
          class="search-history-item"
          @click="priceList.historySearchList(item)"
          :key="item"
        >
          {{ item.polPortName }} - {{ item.desPortName }}
          <Close
            class="del-history"
            @click.stop="priceList.delHistory(item)"
          ></Close>
        </div>
      </div>
    </div>
  </div>
  <div class="price-card-layout price-card-content">
    <!-- <div class="fixed-top-query-title">
      <span style="margin-left: -4px">推荐运价</span>
    </div> -->
    <!-- <div class="attention-line">
      <div style="margin-bottom: 6px">关注线路：</div>
      <el-select
        class="attention-port-select"
        filterable
        v-model="priceList.state.search.PolPortId"
        placeholder="请选择起运港"
      >
        <el-option
          v-for="item in favoritePorts.state.polPortList"
          :key="item.PortId"
          :label="`${item.EnPortName},${item.Code}(${item.CnPortName})`"
          :value="item.PortId"
        ></el-option>
      </el-select>
      <img src="@/assets/images/right-arrow.svg" alt="" />

      <div class="port-item-group">
        <div class="port-item active" @click="priceList.getList">
          {{ priceList.state.selectedFavoriteDesPort.EnPortName }},{{
            priceList.state.selectedFavoriteDesPort.Code
          }}
        </div>
        <div
          class="port-item"
          v-show="priceList.state.selectedFavoriteDesPort.EnPortName != item.EnPortName"
          v-for="item in favoritePorts.state.desPortList"
          @click="selectFavorateDesPort(item)"
          :key="item.PortId"
        >
          {{ item.EnPortName }},{{ item.Code }}
        </div>
        <el-button type="text" @click="favoritePorts.state.show = true"
          >管理关注</el-button
        >
      </div>
    </div> -->
    <div class="query-group">
      <div class="query-group-left">
        <div class="query-totle">
          共 <span>{{ priceList.state.total }}</span> 条运价
        </div>
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
            :key="item.value"
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
            :key="item.value"
          ></el-option>
        </el-select>
        <!-- <div class="query-date-picker">
            <el-date-picker
              style="width: 265px"
              v-model="priceList.state.search.DateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD"
              @change="priceList.getList"
            >
            </el-date-picker>
          </div> -->
      </div>
      <div class="query-group-right">
        <el-select
          class="attention-port-select"
          filterable
          size="mini"
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
      <div
        class="query-tag-title"
        v-if="priceList.state.LineTypeTagList.length"
      >
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
      <!-- <div class="query-tag-title" v-if="priceList.state.search.DateRange.length">开航时间：</div>
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
        > -->
      <el-button
        type="text"
        @click="priceList.reset"
        v-if="
          priceList.state.LineTypeTagList.length ||
          priceList.state.ETDDateTagList.length ||
          priceList.state.shipTagList.length
        "
        >清除条件</el-button
      >
    </div>
    <div class="scroll-content">
      <AppInfiniteScroll
        :loading="priceList.state.fallLoading"
        :nomore="priceList.state.nomore"
        @loadBottom="priceList.loadMore"
        style="margin-bottom: 80px"
        v-loading="priceList.state.loading"
      >
        <FreightListGroup
          :data="priceList.state.tableData"
          :loading="priceList.state.loading"
          :isCertification="$store.state.auth.certificationStatus"
          @openDrawer="openDrawer"
        ></FreightListGroup>
        <!-- <template #nomore>暂无更多数据……</template> -->
      </AppInfiniteScroll>
    </div>
    <InquiryPriceDrawer
      :ref="(e) => (drawer.drawerRef = e)"
    ></InquiryPriceDrawer>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  computed,
  watch,
} from "vue";
import AppInfiniteScroll from "@/components/AppInfiniteScroll.vue";
import { useTableOption } from "justom-share";
import request from "@/public/request";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { InfoFilled, Close } from "@element-plus/icons";
import dayjs from "dayjs";
import FirstGuide from "./FirstGuide.vue";
import InquiryPriceDrawer from "./components/ConsultPriceDrawer.vue";
import FreightListGroup from "./components/NewFreightListGroup.vue";
import AppDestport from "@/components/AppDestPort.vue";
import AppDestPortContent from "@/components/AppDestPortContent.vue";
import { getElectronAgent } from "@share/agent";
import { useStore } from "vuex";
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
  const store = useStore();
  const agent = getElectronAgent();
  function openDrawer(Id, type) {
    if (!store.state.auth.certificationStatus) {
      agent.ipcRequest("freight/newWin", {
        type: "small",
        url: "/internalComponents/userAuthorization?type=freight",
      });
      return ElMessage.warning("请先进行企业认证");
    }
    drawerRef.value.drawer.openDrawer(Id, type);
  }
  return reactive({
    drawerRef,
    openDrawer,
  });
}
function useShipping() {
  const state = reactive({
    // 全部船公司
    allShippings: [],
  });

  async function getAllShipping() {
    let res = await request.get("/api/FreightBaseShipping/GetList", {
      page: -1,
    });
    state.allShippings = res.Rows;
  }

  onMounted(() => {
    getAllShipping();
  });

  return reactive({
    state,
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
      PolPortId: 675,
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
      // 船公司
      ShippingId: "船公司",
      // 航线类型 -1不限 0:直达 1:中转
      LineType: "直达/中转",
      // 开航日
      ETDDate: "班期",

      destPortName: "",
    },
    //起运港名称
    polPortName: "",
    //显示在搜索框里的目的港名称
    destPortName: "",
    destPortCnName: "",
    // 数据
    tableData: [],
    // 列表页数相关配置
    tableOption: useTableOption({}),
    total: 0,
    // 触碰底部加载
    fallLoading: false,
    // 加载
    loading: false,
    // 没有更多
    nomore: false,
    // 更多搜索条件
    searchAdvance: false,
    //船公司列表
    shipList: [],
    //起运港列表
    polPortList: [],
    historyPortList: [],
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
    destPortVisible: false,
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
    if (state.search.PolPortId && state.search.DestPortId) {
      setHistoryPort();
    }
  }
  // 获得列表数据
  async function getListData() {
    state.search.ShippingId = "";
    state.search.ETDDate = "";
    if (state.search.DateRange != null) {
      state.search.StartTime = state.search.DateRange[0];
      state.search.EndTime = state.search.DateRange[1];
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
    state.shipTagList = [];
    state.ETDDateTagList = [];
    state.LineTypeTagList = [];
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

  //选择船公司
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

  //删除船公司
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
  //选择班期
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
  //删除班期
  function closeWeekTag(index) {
    state.ETDDateTagList.splice(index, 1);
    getList();
  }

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
  function closeLineTypeTag(index) {
    state.LineTypeTagList.splice(index, 1);
    if (state.LineTypeTagList.length == 1) {
      state.search.LineType = state.LineTypeTagList[0];
    } else {
      query.LineType = -1;
    }
    getList();
  }
  //初始化历史记录
  function initHistoryList() {
    let historyList = localStorage.getItem("historyPortList");
    if (historyList) {
      historyList = JSON.parse(historyList);
      state.historyPortList = historyList;
    } else {
      state.historyPortList = [];
    }
  }

  //设置历史查询
  function setHistoryPort() {
    console.log("开始保存历史");
    let historyPortList = state.historyPortList;
    let polPortName = "";
    state.polPortList.forEach((pol) => {
      if (pol.Id == state.search.PolPortId) {
        polPortName = pol.EnPortName;
      }
    });
    let item = {
      polPortName: polPortName,
      polPortId: state.search.PolPortId,
      desPortName: state.destPortName,
      desPortId: state.search.DestPortId,
      isActive: true,
    };
    if (historyPortList.length > 0) {
      historyPortList.forEach((obj, index) => {
        if (
          obj.polPortId == item.polPortId &&
          obj.desPortId == item.desPortId
        ) {
          historyPortList.splice(index, 1);
        }
        obj.isActive = false;
      });
    }

    historyPortList.unshift(item);
    if (historyPortList.length > 10) {
      historyPortList.pop();
    }
    state.historyPortList = historyPortList;
    localStorage.setItem("historyPortList", JSON.stringify(historyPortList));
  }

  async function getPolPortList() {
    let res = await request.get("/api/FRPort/GetFRPortList", {
      Page: -1,
      Limit: -1,
      IsPol: true,
    });
    state.polPortList = res.Rows;
  }

  //用历史记录查询
  function historySearchList(item) {
    state.search.DestPortId = item.desPortId;
    state.search.PolPortId = item.polPortId;
    state.destPortName = item.desPortName;
    state._search.destPortName = item.desPortName;
    state.historyPortList.forEach((history) => {
      history.isActive = false;
    });

    getList();
    // item.isActive=true
  }
  function delHistory(item) {
    console.log(item);
    state.historyPortList.forEach((history, index) => {
      if (
        history.polPortId == item.polPortId &&
        history.desPortId == item.desPortId
      ) {
        console.log(item, index);
        state.historyPortList.splice(index, 1);
        localStorage.setItem(
          "historyPortList",
          JSON.stringify(state.historyPortList)
        );
      }
    });
  }
  //选择目的港
  function selectDesPort(item) {
    state.destPortVisible = false;
    state.search.DestPortId = item.Id;
    state._search.destPortName = item.EnPortName;
    state.destPortName = item.EnPortName;
    state.destPortCnName = item.CnPortName;
  }

  //监听目的港查询输入
  function watchInput() {
    if (state._search.destPortName == "") {
      state.search.DestPortId = "";
      return (state.destPortVisible = true);
    }
    getEndPortQuery();
  }

  //获取目的港模糊查询数据
  const inputQueryList = ref([]);
  async function getEndPortQuery() {
    const res = await request.get("/api/FRPortalPort/GetPortToList", {
      EnPortName: state._search.destPortName,
    });
    inputQueryList.value = res.Data;
  }
  function confirmQuery(Id, value) {
    state.destPortVisible = false;
    state.search.DestPortId = Id;
    state._search.destPortName = value;
    state.destPortName = value;
  }
  onMounted(() => {
    // getList();
    getShippingList();
    getPolPortList();
    initHistoryList();
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
    selectShip,
    closeShipTag,
    selectETDdate,
    weekQuery,
    closeWeekTag,
    selectLineType,
    closeLineTypeTag,
    initHistoryList,
    setHistoryPort,
    getPolPortList,
    selectDesPort,
    historySearchList,
    delHistory,
    watchInput,
    inputQueryList,
    confirmQuery,
  });
}

export default defineComponent({
  components: {
    AppInfiniteScroll,
    FirstGuide,
    InquiryPriceDrawer,
    AppDestport,
    AppDestPortContent,
    InfoFilled,
    FreightListGroup,
    Close,
  },
  setup() {
    const weekCn = reactive([
      "周一",
      "周二",
      "周三",
      "周四",
      "周五",
      "周六",
      "周日",
    ]);

    const shipping = useShipping();
    const priceList = usePriceList();
    const tools = useTools();
    const drawer = drawers();
    // 询价
    const openDrawer = (Id, type) => {
      drawer.openDrawer(Id, type);
    };

    onMounted(async () => {});

    return {
      priceList,
      shipping,
      weekCn,
      tools,
      openDrawer,
      drawer,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/mainifest/mainifestStyle.scss";
@import "@/styles/FCLFreight/FCLFreight.scss";
@import "@/styles/FCLFreight/FCLFreightFallList.scss";
.scroll-content {
  height: calc(100vh - 282px);
}
.desPort-selectde-content {
  padding: 3px 0 3px 20px;
  width: 160px;
  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.dest-port-btn {
  width: 120px;
  position: absolute;
  left: 0;
  opacity: 0;
  cursor: pointer;
  top: 16px;
}
.price-card-content {
  height: calc(100vh - 206px);
}
.price-card-layout {
  background: white;
  padding: 24px;
  border: 1px solid #f2f3f5;

  .fixed-top-query-title {
    font-size: 14px;
    color: #303133;
    font-weight: bold;
    margin-bottom: 8px;
  }
}
.no-data {
  text-align: center;
  margin: 28px 0;
  div {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    margin-top: 30px;
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

.fall-list-group {
  border-left: none;
  border-right: none;
  .fall-list-item:nth-child(odd) {
    background-color: #fff;
  }
  .fall-list-title {
    border-left: 1px solid #e1e1e1;
    border-right: 1px solid #e1e1e1;
  }
  .fall-list-item {
    background-color: #fff;
    margin-top: 17px;
    &:hover {
      background-color: #fff9f5;
    }
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
  align-items: center;
  font-size: 14px;
  margin-bottom: 12px;
  line-height: 50px;
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
  .port-item {
    background: #f2f3f5;
    border-radius: 2px;
    padding: 4px 14px;
    font-size: 14px;
    color: #3c4144;
    line-height: 22px;
    margin-right: 8px;
    cursor: pointer;
  }
  .active {
    background: #fcf1e7;
    color: #fd953e;
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
      margin-left: 8px;
      width: 114px;
      :deep(.el-input) {
        width: 114px;
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
.search-container {
  width: 950px;
  margin: 50px auto 20px;
  background: #fd953e;
  border-radius: 4px;
  height: 60px;
  display: flex;
  .search-group {
    background: white;
    height: 54px;
    margin-top: 3px;
    margin-left: 3px;
    width: 850px;
    display: flex;
    .search-group-item {
      padding: 10px 16px;
      position: relative;
      img {
        position: absolute;
        top: 30px;
        left: 14px;
        z-index: 10;
      }
      .search-group-item-title {
        font-size: 12px;
        color: #969799;
      }
      .search-port-select {
        width: 180px;
        :deep(.el-input__inner) {
          border: none;
          height: 25px;
          padding: 0 22px;
        }
        :deep(.el-icon) {
          display: none;
        }
      }
      .search-port-daterange {
        width: 180px;
        :deep(.el-input__inner) {
          border: none !important;
          height: 25px !important;
          padding-left: 0;
        }
        :deep(.el-range-separator) {
          color: white;
        }
        :deep(.el-range__icon) {
          display: none;
        }
      }
    }
  }
  .search-icon {
    width: 97px;
    height: 34px;
    padding: 12px 0;
    cursor: pointer;
  }
}
.search-history {
  display: flex;
  align-items: baseline;
  .search-history-title {
    width: 80px;
    font-size: 14px;
  }
  .search-history-content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: calc(100% - 80px);
    .del-history {
      margin-left: 5px;
      width: 12px;
      height: 12px;
      padding: 2px;
      &:hover {
        border-radius: 50%;
        background: #e6a23d;
        color: white;
      }
    }
    .search-history-item {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      background: #f2f3f5;
      border-radius: 2px;
      padding: 4px 4px 4px 14px;
      font-size: 14px;
      color: #3c4144;
      line-height: 22px;
      margin-right: 8px;
      cursor: pointer;
      margin-bottom: 8px;
      &:hover {
        background: #fcf1e7;
      }
    }
    .active {
      color: #fd953e;
    }
  }
}
.dest-port-select {
  :deep(.el-input__inner) {
    border: none;
    height: 20px;

    padding-left: 2px;
  }
}

.inputQuery {
  max-height: 330px;
  overflow: auto;
  padding: 0;
  .inputQuery-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    background: #fd953e;
    color: white;
    padding: 6px 10px;
  }
  .container-items {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
    cursor: pointer;
    padding: 0 10px;
  }
  .container-items:hover {
    background-color: #fcf1e7;
  }
}
.inputQuery::-webkit-scrollbar {
  display: none;
}
</style>
