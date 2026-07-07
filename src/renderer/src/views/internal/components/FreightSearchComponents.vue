<template>
  <div class="freight-search-container">
    <div class="search-group">
      <div class="search-group-item">
        <div class="search-group-item-title">起运港</div>
        <!-- <img
          src="@/assets/images/port_02_blue.svg"
          alt=""
        /> -->
        <img src="@/assets/images/port_02_orange.svg" alt="" class="select-icon" />
        <el-select class="search-port-select" filterable v-model="search.PolPortId" placeholder="请选择起运港"
          :popper-class="isFreightLayout ? 'freight-select-dropdown' : ''">
          <el-option v-for="item in state.portList" :key="item.Id"
            :label="`${item.EnPortName},${item.Country}(${item.CnPortName})`" @click="setPol(item)"
            :value="item.Id"></el-option>
        </el-select>
      </div>
      <div class="search-group-item">
        <div class="search-group-item-title">目的港</div>
        <!-- <img
          v-if="state.search.DestPortId"
          src="@/assets/images/port_02_blue.svg"
          alt=""
        /> -->
        <img v-if="state.search.DestPortId" src="@/assets/images/port_02_orange.svg" class="select-icon" alt="" />
        <img v-else src="@/assets/images/port_01_blue.svg" alt="" class="select-icon" />
        <!-- @click="state.destPortVisible = true" -->
        <div class="desPort-selectde-content">
          <el-popover width="600px" trigger="click" v-model:visible="state.destPortVisible" class="el-popover">
            <template #reference>
              <el-input class="dest-port-select" size="mini" v-model="state._search.destPortName" clearable
                placeholder="请选择目的港" @input="watchInput"></el-input>
            </template>
            <div class="inputQuery" v-if="state._search.destPortName.length">
              <div class="inputQuery-header" :class="isFreightLayout ? 'inputQuery-header-freight' : ''">
                <div>支持中英文输入</div>
                <div>航线</div>
              </div>
              <el-scrollbar max-height="330px">
                <div class="inputQuery-container" v-for="(items1, index) in inputQueryList" :key="index">
                  <div :class="isFreightLayout ? 'container-items-freight' : 'container-items'
                    " v-for="(items2, index2) in items1.gangkou" :key="index2"
                    @click="confirmQuery(items2.Id, items2.EnPortName, items2.CnPortName)">
                    <div>
                      {{ items2.CnPortName }}&nbsp;{{ items2.EnPortName }}&nbsp;{{
                        items2.EnChauName
                      }}
                    </div>
                    <div>{{ items1.LineName }}</div>
                  </div>
                </div>
                <div v-if="!inputQueryList.length" style="padding: 5px 10px">
                  暂无港口
                </div>
              </el-scrollbar>
            </div>
            <!-- style="padding: 14px 12px" -->
            <AppDestPortContent v-else @selectPort="selectDesPort" :isHistory="false" :type="1"
              :class="isFreightLayout ? 'freight-destport' : ''">
            </AppDestPortContent>

            <!-- <AppDestport
                        :visible="state.destPortVisible"
                        :type="1"
                        :btnType="1"
                        @selectPort="selectDesPort"
                      ></AppDestport> -->
          </el-popover>
          <!-- <div
                  v-if="!state.destPortName"
                  style="color: #c0c4cc; font-size: 13px"
                >
                  请选择目的港
                </div>
                <div
                  v-if="state.destPortName"
                  style="color: #606266; font-size: 13px"
                >
                  {{ state.destPortName }}({{ state.destPortCnName }})
                </div> -->
        </div>
      </div>
      <div class="search-group-item">
        <div class="search-group-item-title" style="margin-left: 11px;">开航日期(ETD)</div>
        <div class="search-port-daterange">
          <el-date-picker v-model="search.StartTime" style="width: 50%" type="date" clearable placeholder="开航日期"
            value-format="YYYY-MM-DD"
            :popper-class="isFreightLayout ? 'data-picker-freight-primary' : ''"></el-date-picker><span>至</span>
          <el-date-picker v-model="search.EndTime" style="width: 50%" type="date" clearable placeholder="结束日期"
            value-format="YYYY-MM-DD"
            :popper-class="isFreightLayout ? 'data-picker-freight-primary' : ''"></el-date-picker>
        </div>
      </div>

      <div class="search-group-item box-search" v-if="isInquiry">
        <div class="search-group-item-title" style="margin-left: 11px;">箱型箱量</div>
        <div class="search-port-daterange" style="min-width: 90px;">
          <el-select class="search-port-select" v-model="search.Box" placeholder="请选择箱型">
            <el-option label="20GP" value="20GP"></el-option>
            <el-option label="40GP" value="40GP"></el-option>
            <el-option label="40HQ" value="40HQ"></el-option>
          </el-select>
          <el-input class="box-num" v-model="search.BoxAmount" placeholder="请输入箱量"></el-input>
        </div>
      </div>
      <!-- <div></div> -->
    </div>
    <div class="search-Btn-group">
      <div class="search-Btn-item" @click="searchBtn" style="position: relative;">
        <img class="search-icon" src="@/assets/images/search-icon.svg" alt="" />
        查询 
      </div>
      <!-- <div class="search-Btn-item xiancang">
        <img class="search-icon" src="@/assets/newImages/freightFind/xiancang.png" alt="" />
        现舱
      </div> -->
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@/public/request";
import tools from "@/utils/Utils";
import { useStore, Store } from "vuex";
import { ArrowRight } from "@element-plus/icons";
// import AppDestPortContent from "@/components/AppDestPortContentDash.vue";
import AppDestPortContent from "@/components/AppDestPortContentDashTwo.vue";
import AppDataPicker from "./AppDataPicker.vue";
export default defineComponent({
  components: {
    ArrowRight,
    AppDestPortContent,
    AppDataPicker,
  },
  props: {
    search: {
      type: Object,
      default: () => { },
    },
    isFreightLayout: {
      type: Boolean,
      default: false,
    },
    isInquiry: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {},
  created() { },
  computed: {
    // 是不是会员
    isVipInfo() {
      if (this.$store.state.auth.VipInfo == null) {
        return false;
      }
      return true
    },
    // 剩余次数  如果是会员则不显示
    Frequency() {
      console.log(this.$store.state.auth.VipInfo, "会员信息");
      if (this.isVipInfo) {
        /* const validMemberTypes = [0, 1, 3];
        if (validMemberTypes.includes(this.$store.state.auth.VipInfo.MemberType)) {
          return this.$store.state.auth.VipInfo.Frequency;
        } */
        if (this.$store.state.auth.VipInfo.IsStatus) {
          return this.$store.state.auth.VipInfo.Frequency;
        }
      }
      return 'vip';
    },
  },
  setup(props, context) {
    var date = new Date();
    const Route = useRoute();
    const Router = useRouter();
    const store = useStore();

    const state = reactive({
      activeName: "shipping",

      search: {
        // 起运港Id
        PolPortId: Route.query.PolPortId ? Route.query.PolPortId : 675,
        // 码头Id
        WharfId: "",
        // 目的港Id
        DestPortId: Route.query.DestPortId ? Route.query.DestPortId : "",
        // 船公司Id
        ShippingId: [],
        // 航线Id
        LineId: "",
        // 航线细分Id
        LineDetailId: [],
        //中转港ID
        PodPortId: [],
        //航线类型 0:直达 1:中转
        LineType: -1,
        // 修改开始时间
        UpdateSTime: "",
        // 修改结束时间
        UpdateETime: "",
        //有效期开始时间
        StartTime: "",
        //有效期结束时间
        EndTime: "",
        // 航线代码
        LineCode: "",
        // 开航期 1-7
        ETDDate: [],
        // 截关期 1-7
        CSTDate: [],
        // 发布状态 -1:全部 0:未发布 1:发布
        IsRelease: 1,
        // 推荐状态 -1:全部 0:未推荐 1:推荐
        IsRecommend: "",
        // -1:全部 0:过期 1:有效
        IsEffective: 1,
        //排序方式
        SortKey: 0,
        //排序字段
        SortValue: "20GP",
        //修改人Id
        UpdateEmployeeId: [],
        //显示外部价 0:显示 1:不显示
        IsShowOutPrice: "",
        //显示内部价 0:显示 1:不显示
        IsShowInPrice: "",
        //显示单票确认 0:显示 1:不显示
        IsShowOnePrice: "",
        // 数据来源：1 小程序 2 客户端
        Source: 2,
        DateRange: [],
      },
      _search: {
        // 船公司
        ShippingId: "船公司",
        // 航线类型 -1不限 0:直达 1:中转
        LineType: "直达/中转",
        // 开航日
        ETDDate: "班期",
        destPortName: Route.query.DestPortName ? Route.query.DestPortName : "",
      },
      weekQuery: [
        { label: "周一", value: "1" },
        { label: "周二", value: "2" },
        { label: "周三", value: "3" },
        { label: "周四", value: "4" },
        { label: "周五", value: "5" },
        { label: "周六", value: "6" },
        { label: "周日", value: "7" },
      ],

      week: [
        {
          label: "周一",
          value: 1,
        },
        {
          label: "周二",
          value: 2,
        },
        {
          label: "周三",
          value: 3,
        },
        {
          label: "周四",
          value: 4,
        },
        {
          label: "周五",
          value: 5,
        },
        {
          label: "周六",
          value: 6,
        },
        {
          label: "周日",
          value: 7,
        },
      ],
    });
    const queryTime = ref([new Date()]);
    const week = reactive(["1", "2", "3", "4", "5", "6", "7"]);
    const weekCn = reactive(["周一", "周二", "周三", "周四", "周五", "周六", "周日"]);

    //初始化历史记录
    function initHistoryList() {
      let historyList = localStorage.getItem("historyPortList");
      console.log(historyList, "初始化历史记录");
      if (historyList) {
        historyList = JSON.parse(historyList);
        state.historyPortList = historyList;
        state.historyPortList[0].isActive = false;
      } else {
        state.historyPortList = [];
      }
    }

    //设置历史查询
    function setHistoryPort() {
      console.log("开始保存历史");
      let historyPortList = state.historyPortList;
      let polPortName = "";
      let destPortName = state.destPortName;
      state.portList.forEach((pol) => {
        if (pol.Id == state.search.PolPortId) {
          polPortName = pol.EnPortName;
        }
      });
      if (!polPortName || !destPortName) {
        return;
      }
      let item = {
        polPortName: polPortName,
        polPortId: state.search.PolPortId,
        desPortName: destPortName,
        desPortId: state.search.DestPortId,
        isActive: true,
      };
      if (historyPortList.length > 0) {
        historyPortList.forEach((obj, index) => {
          if (obj.polPortId == item.polPortId && obj.desPortId == item.desPortId) {
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
      console.log(historyPortList, "保存历史完成");
      localStorage.setItem("historyPortList", JSON.stringify(historyPortList));
    }

    //选择目的港
    function selectDesPort(id, item) {
      props.search.DestPortId = item.Id;
      state.search.DestPortId = item.Id;
      state._search.destPortName = item.EnPortName;
      state.destPortName = item.EnPortName;
      state.destPortCnName = item.CnPortName;
      watchInput();
      state.destPortVisible = false;
    }

    //监听目的港查询输入
    function watchInput() {
      if (state._search.destPortName == "") {
        props.search.DestPortId = "";
        props.search.DestPortName = "";
        state.search.DestPortId = "";
        context.emit("backToDefault");
        state.destPortVisible = false;
        // return (state.destPortVisible = true);
        return;
      }
      state.destPortVisible = true;
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

    const inputQueryListAll = ref([]);
    // 目的港查询
    async function getEndPortQueryAll() {
      const res = await request.get("/api/FRPortalPort/GetPortToList", {
        EnPortName: "",
      });
      inputQueryListAll.value = res.Data;
    }

    function confirmQuery(Id, value, Cnvalue) {
      state.destPortVisible = false;
      state.search.DestPortId = Id;
      props.search.DestPortId = Id;
      props.search.CnDestPortName = Cnvalue;
      state._search.destPortName = value;
      state.destPortName = value;
    }
    //回车触发列表刷新
    document.onkeydown = function (e) {
      var key = window.event.keyCode;
      if (key == 13) {
        getList();
      }
    };

    function reset() {
      state.shipTagList = [];
      state.ETDDateTagList = [];
      state.LineTypeTagList = [];
      state.search.LineType = -1;
      getList();
    }

    //日期选择
    function toggleKhDate(type) {
      state.xgTimeType = type;
      if (type === "today") {
        state.search.UpdateSTime = tools.getDate();
        state.search.UpdateETime = tools.getDate();
      } else if (type === "yesterday") {
        state.search.UpdateSTime = tools.getDate(-1);
        state.search.UpdateETime = tools.getDate();
      } else if (type === "seven") {
        state.search.UpdateSTime = tools.getDate(-7);
        state.search.UpdateETime = tools.getDate();
      } else if (type === "thirty") {
        state.search.UpdateSTime = tools.getDate(-30);
        state.search.UpdateETime = tools.getDate();
      }
    }

    //获取起运港
    async function getPortList(e) {
      let keyword = e ?? "";
      let res = await request.get("/api/FRPort/GetFRPortList", {
        Page: 1,
        limit: -1,
        PortName: keyword,
        IsPol: true,
      });
      let list = res.Rows;
      for (let item of list) {
        item.label = item.EnPortName;
        item.value = item.Id;
      }
      state.portList = list;
    }


    function setPol(value) {
      console.log(value)
      props.search.CnPolPortName = value.CnPortName
    }

    //获取中转港
    async function getPodPortList(e) {
      let keyword;
      e ? (keyword = e) : (keyword = "");
      let res = await request.get("/api/FRPort/GetFRPortList", {
        Page: -1,
        limit: -1,
        PortName: keyword,
      });
      let list = res.Rows;
      for (let item of list) {
        item.label = item.EnPortName;
        item.CnPortName = item.CnPortName;
        item.value = item.Id;
      }
      state.podPortList = list;
    }

    //获取船公司
    async function getShipList(e) {
      let keyword;
      e ? (keyword = e) : (keyword = "");
      let res = await request.get("/api/FRShipping/GetShippingList", {
        Page: 1,
        limit: -1,
        ShippingSimName: keyword,
      });
      let list = res.Rows;
      for (let item of list) {
        item.label = item.Code;
        item.CnShippingName = item.CnShippingName;
        item.value = item.Id;
      }
      state.shipList = list;
    }

    //获取航线
    async function getLineList(e) {
      let keyword;
      e ? (keyword = e) : (keyword = "");
      let res = await request.get("/api/FRLine/GetLineList", {
        Page: -1,
        limit: -1,
        keyword: keyword,
      });
      // let list = res.Rows;
      state.lineList = res.Rows;
    }

    async function getFRLineList() {
      let res = await request.get("/api/FRPort/GetFRLineList", {
        Page: -1,
        limit: -1,
      });
      state.FRlineList = res.Rows;
    }

    //获取运价列表搜索航线细分
    async function getLineDetail() {
      if (state.search.LineId) {
        let res = await request.get("/api/FRPort/GetFRLineDetailList", {
          Page: -1,
          limit: -1,
          lineId: state.search.LineId,
        });
        state.lineDetailList = res.Rows;
      }
    }

    //获取运价列表搜索港口细分
    async function getPortDetail(e) {
      state.listLoading = true;
      let keyword;
      e ? (keyword = e) : (keyword = "");
      let res = await request.get("/api/FRPort/GetFRPortList", {
        Page: -1,
        limit: -1,
        PortName: keyword,
      });
      let list = res.Rows;
      state.portDetailList = list.map((item) => ({
        value: item.Id,
        label: item.EnPortName,
        CnPortName: item.CnPortName,
      }));
      state.listLoading = false;
    }

    function quicksearch(e) {
      let keyword = e.ShippingCode + " " + e.DestEnPortName;
      window.open(`#/quickSearch?keyword=${keyword}`);
    }
    function searchBtn() {
      context.emit("search");
    }
    const setDestPort = () => {
      console.log(props.search.DestPortId)
      state.search.DestPortId = props.search.DestPortId;
      state._search.destPortName = props.search.DestPortName;
    };
    watch(
      () => props.search.PolPortId,
      () => {
        if (state.portList && state.portList.length)
          state.portList.forEach((pol) => {
            if (pol.Id == props.search.PolPortId) {
              props.search.PolPortName = `${pol.EnPortName},${pol.Country}(${pol.CnPortName})`;
            }
          });
      }
    );

    watch(
      () => props.search.DestPortId,
      async () => {
        inputQueryListAll.value.forEach((line) => {
          line.gangkou.forEach((des) => {
            if (des.Id == props.search.DestPortId) {
              props.search.DestPortName = `${des.EnPortName}(${des.CnPortName})`;
              state.search.DestPortId = props.search.DestPortId;
              state._search.destPortName = props.search.DestPortName;
            }
          });
        });
        // context.emit("search");
      }
    );
    watch(
      () => props.search.StartTime,
      async () => {
        // context.emit("search");
      }
    );
    watch(
      () => props.search.EndTime,
      async () => {
        // context.emit("search");
      }
    );
    onMounted(() => {
      state.searchLoading = true;
      let getAll = Promise.all([
        getPortList(),
        // getPodPortList(),
        // getPortDetail(),
        // getShipList(),
        // getFRLineList(),
        getEndPortQuery(),
        getEndPortQueryAll(),
        // getEmployee(),
        // initHistoryList(),
      ]);
      getAll.then(function () {
        if (props.search.PolPortId) {
          state.portList.forEach((pol) => {
            if (pol.Id == props.search.PolPortId) {
              props.search.PolPortName = `${pol.EnPortName},${pol.Country}(${pol.CnPortName})`;
            }
          });
        }

        state.searchLoading = false;
      });
    });

    return {
      state,
      queryTime,
      week,
      weekCn,
      inputQueryList,
      setDestPort,
      watchInput,
      confirmQuery,
      selectDesPort,
      searchBtn,
      toggleKhDate,
      getPortList,
      getPortDetail,
      getPodPortList,
      setPol
    };
  },
});
</script>

<style lang="scss" scoped>
.box-search {
  :deep(.el-input__inner) {
    padding: 0 !important;
    padding-left: 29px !important;

    &:first-child {}
  }

  .box-num {
    :deep(.el-input__inner) {
      // padding-left: 0 !important;
    }
  }
}

.dashbord-title {
  font-size: 14px;
  color: #000000;
  letter-spacing: -1px;
  font-weight: 400;
  line-height: 32px;
}

.freight-search-container {
  margin: 9px auto 24px;
  background: #fd953e;
  border-radius: 4px;
  height: 70px;
  display: flex;
  width: 80%;

  .search-group {
    background: white;
    height: 64px;
    margin-top: 3px;
    margin-left: 3px;
    display: flex;
    width: calc(100% - 100px);

    .search-group-item {
      padding: 8px 16px;
      position: relative;

      img {
        position: absolute;
        top: 33px;
        left: 14px;
        z-index: 10;
      }

      .search-group-item-title {
        font-size: 12px;
        color: #969799;
      }

      .desPort-selectde-content {
        width: 140px;
        width: 100%;

        :deep(.el-input__inner) {
          border: none;
          // height: 25px;
          font-size: 14px;
          // font-weight: bold;
          padding-left: 22px;
        }

        :deep(.el-input__icon) {
          height: 22px;
          line-height: 22px;
        }

        :deep(.el-icon) {
          // display: none;
        }
      }

      .search-port-select {
        width: 140px;
        width: 100%;

        :deep(.el-input__inner) {
          border: none;
          // height: 25px;
          font-size: 14px;
          // font-weight: bold;
          padding-left: 22px;
        }

        :deep(.el-input__icon) {
          height: 22px;
          line-height: 22px;
        }

        :deep(.el-icon) {
          display: none;
        }
      }

      .search-port-daterange {
        // width: 180px;
        min-width: 240px;
        display: flex;
        align-items: center;

        span {
          font-size: 12px;
          color: #606266;
        }

        :deep(.el-input__inner) {
          border: none !important;
          // height: 25px !important;
          font-size: 14px;
          // font-weight: bold;
          padding: 0 29px;
          // padding: 0 22px !important;
        }

        :deep(.el-range-separator) {
          color: white;
        }

        :deep(.el-icon) {
          display: none;
        }
      }

      .dest-port-select {
        :deep(.el-input__inner) {
          font-size: 14px;
          // font-weight: bold;
          padding: 0 22px;
        }
      }
    }
  }

  .desPort-selectde-content {
    :deep(.el-input--mini) {
      line-height: 32px !important;
    }

  }

  .search-Btn-group {
    background: white;
    height: 64px;
    margin-top: 3px;
    margin-left: -2px;
    margin-right: 3px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding: 0 5px;

    .search-Btn-item {
      width: 97px;
      height: 44px;
      background-color: #fd953e;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      gap: 5px;
      border-radius: 5px;
      border: 2px solid transparent;
      box-sizing: border-box;

      .search-icon {
        width: 20px;
        // height: 34px;
      }

      .frequency {
        position: absolute;
        font-size: 12px;
        color: #EFD933;
        background-color: #262626;
        top: -10px;
        right: 0px;
        padding: 2px;
        border-radius: 5px;
      }
    }

    .xiancang {
      margin-left: 5px;
      color: #fd953e;
      background-color: #fff;
      border: 2px solid #fd953e;
    }
  }

}

.inputQuery {
  overflow: auto;
  padding: 0;

  .inputQuery-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    background: #3b78ff;
    color: white;
    padding: 6px 10px;
  }

  .inputQuery-header-freight {
    background-color: #fd953e;
  }

  .container-items {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
    cursor: pointer;
    padding: 0 10px;
  }

  .container-items:hover {
    background-color: #e6f5ff;
  }

  .container-items-freight {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
    cursor: pointer;
    padding: 0 10px;
  }

  .container-items-freight:hover {
    background: #fcf1e7;
  }
}

.inputQuery::-webkit-scrollbar {
  display: none;
}

:deep(.is-group tr th) {
  background-color: #1a90fe !important;
  color: #ffffff;
}

:deep(.el-input__inner) {
  border: none;
}

.freight-destport {
  :deep(.el-tabs__item.is-active) {
    color: #ff7d14;
  }

  :deep(.el-tabs__item:hover) {
    color: #ff7d14;
  }

  :deep(.el-tabs__active-bar) {
    background-color: #fd953e;
  }

  :deep(.tab-item-selected) {
    background-color: #ff7d14 !important;
  }

  :deep(.destport-blue) {
    background-color: #ff7d14 !important;
  }

  :deep(.destport-item:hover) {
    background: #fcf1e7;
  }
}

.select-icon {
  width: 13px;
  height: 13px;
}
</style>
<style lang="scss">
.select-port-popper {
  padding: 0 !important;

  .el-popper__arrow {
    display: none;
  }
}
</style>
