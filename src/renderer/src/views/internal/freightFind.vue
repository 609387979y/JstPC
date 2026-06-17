<template>
  <div class="freight-find">
    <div :class="state.isFirst ? 'freight-search-card' : 'freight-search-card-result'">
      <template v-if="!state.isFirst">
        <el-tabs v-model="listType" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="运价查询" name="1"></el-tab-pane>
          <el-tab-pane label="我的关注" name="2"></el-tab-pane>
        </el-tabs>
      </template>
      <div :class="state.isFirst ? 'search-card' : 'search-card-content'">

        <!-- 搜索栏 -->
        <FreightSearchCompontent v-if="listType == 1 || state.isFirst" ref="freightSearchRef" @search="searchBtn"
          :search="state.search" :isFreightLayout="true" @backToDefault="() => { state.isFirst = false }">
        </FreightSearchCompontent>

        <!-- 关注 -->
        <FavFreightSearchComponent v-if="listType == 2 && !state.isFirst" ref="favSearch" @search="searchBtn"
          :search="state.search">
        </FavFreightSearchComponent>
      </div>
    </div>

    <!-- 热门港口 -->
    <template v-if="state.isFirst">
      <div class="interested-ports">
        <div class="title">您感兴趣的运价</div>
        <div class="refresh" @click="getFreightList">
          <el-icon>
            <RefreshRight />
          </el-icon>
          刷新
        </div>
      </div>
      <div class="recommend" v-loading="state.freightListloading">
        <div class="freight-list-container" :style="state.freightList.length < 1 ? 'justify-content: center;' : ''">
          <div v-for="item in state.freightList" :key="item.id" class="freight-item" @click="setFreightId(item)">
            <!-- 头部 -->
            <div class="freight-item-header">
              <div class="freight-header-box">
                <div class="freight-header-pol">
                  <div class="freight-header-port-main">{{ item.PolEnPortName }}</div>
                </div>
                <img class="freight-header-arrow" src="@/assets/newImages/freightFind/line.png" alt="" />
                <div class="freight-header-dest">
                  <div class="freight-header-port-main">{{ item.DestEnPortName }}</div>
                </div>
              </div>
              <div class="freight-header-time">
                <img src="@/assets/newImages/freightFind/time.png" alt="">
                <span>{{ item.CreateTime }}</span>
              </div>
            </div>
            <!-- 中间 -->
            <div class="freight-ship-price">
              <div class="freight-ship">
                <div class="freight-ship-img">
                  <img :src="item.ShippingLogo" alt="" />
                </div>
                <div>{{ item.ShippingCode }}</div>
              </div>
              <div class="freight-price-content">
                <div class="freight-price-type">
                  <div class="price-type">20GP</div>
                  <div class="price-type">40GP</div>
                  <div class="price-type">40HQ</div>
                </div>
                <div class="freight-price-group">
                  <div class="price-group">
                    <div class="freight-price">${{ item.AllOutPrice20GP }}</div>
                    <div class="freight-price">${{ item.AllOutPrice40GP }}</div>
                    <div class="freight-price">${{ item.AllOutPrice40HQ }}</div>
                  </div>
                  <!-- <div class="discount-group" v-if="!item.AllInPriceVisiable">
                    <div class="freight-discount">幅度**</div>
                    <div class="freight-discount">幅度**</div>
                    <div class="freight-discount">幅度**</div>
                  </div> -->
                  <div class="discount-group">
                    <div class="freight-has-discount freight-has-up" v-if="item.Tag20GP">
                      <img class="arrow-down-icon" src="@/assets/newImages/freightFind/top.png" alt="" />
                      {{ item.Tag20GP }}
                    </div>
                    <div class="discount-blank" v-else></div>
                    <div class="freight-has-discount" v-if="item.Tag40GP">
                      <img class="arrow-down-icon" src="@/assets/newImages/freightFind/under.png" alt="" />
                      {{ item.Tag40GP }}
                    </div>
                    <div class="discount-blank" v-else></div>
                    <div class="freight-has-discount" v-if="item.Tag40HQ">
                      <img class="arrow-down-icon" src="@/assets/customWorkbench/green-arrow-down.svg" alt="" />
                      {{ item.Tag40HQ }}
                    </div>
                    <div class="discount-blank" v-else></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 尾部 -->
            <div class="freight-other-info">
              <div class="shipping-day">
                <div class="top-day">
                  <div class="day-label">截/开：</div>
                  <div class="day-value">{{ item.CSTDate }}/{{ item.ETDDate }}</div>
                </div>
                <div class="top-day">
                  <div class="day-label">航线：</div>
                  <div class="day-value">{{ item.LineCode }}</div>
                </div>
              </div>
              <div class="shipping-day right">
                <div class="top-day">
                  <div class="day-label">航程：</div>
                  <div class="day-value">{{ item.LineDay }}天</div>
                </div>
                <div class="top-day">
                  <div class="day-label">中转：</div>
                  <div class="day-value">{{ item.LineType == 0 ? '直达' : item.LineType == 1 ? item.PodEnPortName : '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="state.freightList.length < 1" class="no-data-container">
            <img class="no-data-img" src="@/assets/customWorkbench/none.svg" alt="no data" />
            <div class="no-data-title">暂无更多运价</div>
          </div>
        </div>
      </div>
    </template>

    <!-- 关注 -->
    <div class="search-info" v-if="state.search.DestPortName && state.search.PolPortName && !state.isFirst">
      <div class="search-info-left">
        <img src="@/assets/images/port_02_orange.svg" alt="" />
        <div class="search-port">{{ state.search.PolPortName }}</div>
        <img src="@/assets/customWorkbench/single_right_arrow.svg" alt="" />
        <img src="@/assets/images/port_02_orange.svg" alt="" />
        <div class="search-port">{{ state.search.DestPortName }}</div>
        <div class="search-date">{{ formatDateCh(state.search.StartTime) }}</div>
        <div class="del-sub-btn" v-if="state.currentFav" @click="delFavPort(state.search.DestPortId)">
          <img src="@/assets/customWorkbench/del.svg" alt="" />
          删除关注
        </div>
        <div class="sub-port-btn" v-else @click="setFavoritePorts(state.search.DestPortId)">
          <img src="@/assets/customWorkbench/add.svg" alt="" />
          添加关注
        </div>
      </div>
    </div>
    <div style="height: 8px" v-else></div>

    <!-- 搜索列表 -->
    <template v-if="!state.isFirst">
      <FreightList ref="freightListRef" :search="state.search" @updateFavPort="updateFavPort"
        @backToDestPort="() => { state.isFirst = true }" :hasCompany="state.hasCompany">
      </FreightList>
    </template>

  </div>
</template>
<script setup>
import { nextTick, ref, watch, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@/public/request";
import dayjs from "dayjs";
import { useStore, Store } from "vuex";
import { ArrowLeft, ArrowRight, ArrowDown, RefreshRight } from "@element-plus/icons";
import FreightSearchCompontent from "@/views/internal/components/FreightSearchComponents.vue";
// import AppDestPortContent from "./components/AppDestPortContentDash.vue";
import FreightList from "@/views/internal/components/FreightList.vue";
import { throttle } from '@/utils/publicUtils'
import FavFreightSearchComponent from './components/FavFreightSearchComponent.vue'


const store = useStore();
const Route = useRoute();

const state = reactive({
  isFirst: true,
  activeName: "freight",
  search: {
    PolPortId: Route.query.PolPortId
      ? parseInt(Route.query.PolPortId)
      : 675,
    PolPortName: Route.query.PolPortName ?? "NINGBO,中国(宁波)",
    DestPortId: Route.query.DestPortId
      ? parseInt(Route.query.DestPortId)
      : "",
    DestPortName: Route.query.DestPortName ?? "",
    StartTime: Route.query.StartTime ?? "",
    EndTime: Route.query.EndTime ?? "",
  },
  destLoading: false,
  currentFav: true,//当前港口是否已关注
  freightList: [],//您感兴趣的运价列表
  favPortList: [],//关注的列表
  freightListloading: false,
  searchTabActive: 0,
  hasCompany: false,
})

const listType = ref('1')

const freightListRef = ref();
const freightSearchRef = ref()
const searchBtn = throttle(async (type) => {
  // await store.dispatch("payplan/checkShowPlanDialog")
  state.isFirst = false;
  nextTick(() => {
    freightListRef.value.getList(type ? type : "");
    state.destLoading = false;
  });
}, 1000)
const selectDesPort = (Id, item) => {
  state.isFirst = false;
  state.destLoading = true;
  state.search.podCode = item.Code;
  searchBtn();
}
const formatDateCh = (date) => {
  if (date) {
    return dayjs(date).format("YYYY年M月D日");
  } else {
    return "";
  }
}
const updateFavPort = () => {
  // freightSearchRef.value.getFavoritePorts();
}
const getFavoritePorts = async () => {
  const res = await request.get("/api/FRInquireFavoritePort/GetFavoritePorts");
  state.favPortList = res.DestPorts;
  currentIsFav();
}

// 您感兴趣的运价
const getFreightList = async () => {
  state.freightListloading = true
  const res = await request.get("/api/CargoRate/SelectLatest");
  state.freightListloading = false
  state.freightList = res || [];
}
const setFreightId = async (item) => {
  state.search.PolPortId = item.PolPortId
  state.search.PolPortName = `${item.PolEnPortName}(${item.PolCnPortName})`
  state.search.DestPortId = item.DestPortId
  state.search.DestPortName = item.DestPortName
  state.search.hxdm = item.hxdm
  // console.log(item);
  // let secondSearch = {
  //   LineCode: item.LineCode,
  //   ETDDate: item.ETDDate,
  //   CSTDate: item.CSTDate,
  //   LineType: item.LineType,
  //   PodPortId: item.LineType == 1 ? '' : item.PodPortId,
  //   shipSort: item.shipSort,
  //   priceSort: "20GP",
  //   sortType: 1,
  // }
  state.isFirst = false
  setTimeout(() => {
    freightListRef.value.setSecondSearch(item.Id)
  }, 500)
}
//是否已关注
const currentIsFav = () => {
  state.favPortList.filter((item) => {
    return item.PortId == state.search.DestPortId;
  }).length > 0
    ? (state.currentFav = true)
    : (state.currentFav = false);
}
const delFavPort = (Id) => {
  state.favPortList = state.favPortList.filter((item) => {
    return item.PortId !== Id;
  });
  setFavoritePorts("del");
}
const setFavoritePorts = async (setType) => {
  let destPort = [];
  if (state.search.DestPortId && setType != "del") {
    destPort.push(state.search.DestPortId);
  }
  state.favPortList.forEach((item) => {
    destPort.push(item.PortId);
  });
  destPort = [...new Set(destPort)];
  state.pageLoading = true;
  const res = await request.post("/api/FRInquireFavoritePort/SetFavoritePorts", {
    PortIdList: destPort,
  });
  state.pageLoading = false;
  getFavoritePorts();
  updateFavPort();
}
watch(() => state.search.DestPortId, (newVal, oldVal) => {
  currentIsFav()
});

onMounted(async () => {
  store.dispatch("auth/getUserAuth")
  state.hasCompany = await store.dispatch("auth/checkAndTryChooseEmployee");
  if (Route.query.PolPortId && Route.query.DestPortId) {
    setTimeout(() => {
      searchBtn()
    }, 500);
  }
  await getFavoritePorts()
  await getFreightList()
  if (Route.query.search) {
    state.search = JSON.parse(Route.query.search)
    console.log(state.search)
    setTimeout(() => {
      freightSearchRef.value.setDestPort()
      searchBtn()
    }, 500);
  }
})
</script>
<style lang="scss" scoped>
@import "./customerFreight.scss";

.search-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 36px;
  background-color: #f7f8fa;

  .search-info-left {
    font-size: 14px;
    color: #3c4144;
    display: flex;
    align-items: center;

    img {
      margin: 0 4px;
    }

    .search-port {
      margin: 0 4px;
    }

    .search-date {
      margin-left: 8px;
    }
  }

  .search-info-right {
    font-size: 14px;
    color: #3c4144;
    letter-spacing: 0;
    text-align: right;
    font-weight: 500;
    cursor: pointer;

    .arrow {
      margin-left: 8px;
      color: #cccccc;
      transition: 0.3s;
    }

    .turn-arrow {
      transform: rotate(180deg);
    }
  }
}

.sub-port-btn {
  margin-top: 8px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #fd953e;
  cursor: pointer;
  line-height: 13px;
  margin: 0 auto;
  width: 100px;

  img {
    height: 12px;
    margin-right: 4px;
    margin-bottom: 0;
  }
}

.freight-find {
  width: 100%;
  height: 100%;
  padding: 6px;
  background-color: #fff;
  box-sizing: border-box;
}

.freight-search-card {
  width: 100%;
  height: 360px;
  box-sizing: border-box;
  position: relative;
  background-image: url('@/assets/newImages/freightFind/banner.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  // border: 1px solid #e4e7ed;
  // border-radius: 4px;
  //   margin-bottom: 8px;
  .search-card {
    position: absolute;
    bottom: -12%;
    left: 50%;
    transform: translateX(-50%);
    min-width: 1100px;
    width: 85%;
  }



}

.freight-search-card-result {
  width: 100%;

  .search-card-content {
    min-width: 900px;
    width: 85%;
    margin: 0 auto;
  }
}


:deep(.el-tabs__nav-scroll) {
  padding: 0 16px;
}

.freight-search-container {
  background: #fd953e;
}

::v-deep .el-select-dropdown__item.selected {
  color: #fd953e;
}

.recommended-ports {
  width: 1200px;
  margin-top: 33px;
  font-weight: 600;
  font-size: 16px;
}

.interested-ports {
  margin-top: 33px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  .title {
    font-weight: 600;
    font-size: 16px;
  }

  .refresh {
    color: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;

    &:hover {
      color: #fd953e;
    }
  }
}

.recommended-dest-port {
  border: 1px solid #e4e7ed;
  background-color: #ffffff;

  ::v-deep .el-tabs__header {
    margin: 0;
  }

  ::v-deep .destport-list {
    padding: 7px !important;
    max-height: none !important
  }

  ::v-deep .destport-item:hover {
    background: #fcf1e7;
  }
}

.protbox {
  width: 1200px;
  margin: auto;
  height: 530px;
  position: relative;
  background-image: url('@/assets/newImages/freightFind/ditu.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;

  .circle-border {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #ff7f50;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;

    .circle {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #ff7f50;
    }
  }

  .absolute-card {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #ff7f50;
    display: flex;
    justify-content: center;
    align-items: center;
    // margin-bottom: 5px;
    position: absolute;
    cursor: pointer;
    transform: translate(-50%, -50%);

    .circle {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #ff7f50;
    }

    .price-box {
      border: 1px solid #ff7f50;
      border-radius: 4px;
      padding: 5px 15px;
      // margin-bottom: 5px;
      width: 125px;
      text-align: center;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      background-color: #ffeee6;

      .price-item {
        color: #ff7f50;
        font-size: 16px;
        margin-bottom: 5px;
      }
    }

    .route-info {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 157px;
      text-align: center;

      .arrow {
        color: #666666;
      }
    }

    .top {
      top: 15px;
    }

    .bottom {
      bottom: 15px;
    }
  }

  .orange-absolute-card {
    border: 1px solid #ff7f50;

    .circle {
      background-color: #ff7f50;
    }

    .price-box {
      border: 1px solid #ff7f50;
      background-color: #ffeee6;

      .price-item {
        color: #ff7f50;
      }
    }
  }

  .blue-absolute-card {
    border: 1px solid #3B78FF;

    .circle {
      background-color: #3B78FF;
    }

    .price-box {
      border: 1px solid #3B78FF;
      background-color: #e6f7ff;

      .price-item {
        color: #3B78FF;
      }
    }
  }

  .price-card {
    position: absolute;
    padding: 10px;
    width: 300px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .price-box {
      border: 1px solid #ff7f50;
      border-radius: 4px;
      padding: 5px 15px;
      margin-bottom: 5px;
      width: 125px;
      text-align: center;

      .price-item {
        color: #ff7f50;
        font-size: 16px;
        margin-bottom: 5px;
      }
    }

    .route-info {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);

      .arrow {
        color: #666666;
      }
    }
  }
}

.recommend {
  width: 100%;
  // height: 490px;

  .freight-list-container {
    // overflow-y: auto;
    // max-height: 500px; // Adjust as needed
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 24px;

    .freight-item {
      padding: 3px 13px;
      background: #ffffff;
      border: 1px solid #e4e7ed;
      border-radius: 16px;
      width: 30%;
      flex: 1;
      cursor: pointer;

      &:hover {
        border-color: #EF6B33;
      }

      // 头部
      .freight-item-header {
        // padding-bottom: 12px;
        border-bottom: 1px dashed #e1e1e1;
        display: flex;
        font-size: 16px;
        color: #212730;
        justify-content: space-between;
        align-items: center;

        .freight-header-box {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .freight-header-arrow {
            width: 24px;
            margin: 1px 4px 2px;
          }
        }

        .freight-header-time {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
        }

      }

      // 中间
      .freight-ship-price {
        display: flex;
        justify-content: space-between;
        padding-bottom: 5px;
        border-bottom: 1px dashed #e1e1e1;
        margin-bottom: 12px;

        .freight-ship {
          width: 110px;
          text-align: center;
          font-size: 16px;
          color: #2e3049;
          // font-weight: 550;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          .freight-ship-img {
            width: 100%;
            height: 56px;
            margin-top: 10px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            img {
              width: 100%;
            }
          }
        }

        .freight-price-content {
          // width: 255px;
          width: calc(100% - 110px - 16px);

          .freight-price-type {
            display: flex;
            justify-content: center;
            padding: 0px 16px;
            box-sizing: border-box;
            margin: 15px 0 5px;

            .price-type {
              text-align: center;
              width: 140px;
              font-size: 14px;
              color: #777777;
            }
          }

          .freight-price-group {
            background: #f8f8f8;
            padding: 8px 16px;

            .price-group {
              display: flex;
              justify-content: space-around;
              margin-bottom: 4px;

              .freight-price {
                font-size: 14px;
                color: #3c4144;
                // font-weight: 600;
                width: 140px;
                text-align: center;
              }
            }
          }
        }

        .discount-group {
          display: flex;
          justify-content: space-around;

          .freight-discount {
            // font-size: 24px;
            // line-height: 36px;
            color: #fe953e;
            background: #fdf6ed;
            border: 1px solid #fe953e;
            border-radius: 6px;
            // padding: 0 15px;
            width: 67px;
            box-sizing: border-box;
            text-align: center;
          }

          .freight-has-discount {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            background: #f0faea;
            border: 1px solid #67c23a;
            color: #67c23a;
            border-radius: 6px;
            padding: 0 4px;
            font-size: 14px;
            width: 57px;
            height: 30px;
          }

          .freight-has-up {
            border: 1px solid #EF4333;
            color: #EF4333;
            background-color: rgb(239, 67, 51, .1);
          }

          .arrow-down-icon {
            width: 14px;
          }

          .discount-blank {
            width: 67px;
            height: 32px;
          }
        }
      }

      // 尾部
      .freight-other-info {
        // margin-bottom: 14px;
        display: flex;
        text-align: left;

        .shipping-day {
          width: 50%;

          .top-day {
            display: flex;
            margin-bottom: 5px;

            .day-label {
              color: #969799;
            }
          }
        }

        .right {
          width: 50%;
        }
      }

    }


  }
}

.del-sub-btn {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #ef4333;
  cursor: pointer;

  img {
    margin-right: 4px;
  }
}

.sub-port-btn {
  margin-top: 8px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #fd953e;
  cursor: pointer;
  line-height: 13px;
  margin: 0 auto;
  width: 100px;

  img {
    height: 12px;
    margin-right: 4px;
    margin-bottom: 0;
  }
}

.search-card-first {
  width: 1100px;
  margin: 0 auto;
}

.searchTab-first {
  display: none;
}

.searchTab {
  display: flex;
  align-items: center;
  background-color: #fff;
  width: 175px;
  padding: 5px 5px;
  border-radius: 5px;
  margin-bottom: -4px;

  .LCL,
  .FCL {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px;
    cursor: pointer;
  }

  .active {
    border-radius: 5px;
    color: #fd953e;
    background-color: #ffefe2;
  }
}

.no-data-title {
  text-align: center;
}

:deep(.el-tabs__item) {
  &.is-active {
    color: #FD953E !important;
  }

  &:hover {
    color: #FD953E !important;
  }
}

:deep(.el-tabs__active-bar) {
  background-color: #FD953E;
}
</style>
