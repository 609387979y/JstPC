<template>
  <JstCardLayout v-if="message.hasRight" style="margin: 5px 5px 0 5px">
    <div class="top-query-title">
      <span>询价沟通</span>
    </div>
    <div class="select-container">
      <div class="tabs">
        <div
          style="margin-left: 0px"
          @click="
            () => {
              message.query.Type = -1;
              message.getMessageList();
            }
          "
          :class="message.query.Type === -1 ? 'tabsActive' : ''"
        >
          全部询价
        </div>
        <div
          @click="
            () => {
              message.query.Type = 0;
              message.getMessageList();
            }
          "
          :class="message.query.Type === 0 ? 'tabsActive' : ''"
        >
          待报价
        </div>
        <div
          @click="
            () => {
              message.query.Type = 1;
              message.getMessageList();
            }
          "
          :class="message.query.Type === 1 ? 'tabsActive' : ''"
        >
          新报价
          <span
            class="inquire-Count"
            v-if="$store.state.message.unReadConsultPriceCount"
            >({{ $store.state.message.unReadConsultPriceCount }})
            <span></span>
          </span>
        </div>
        <div
          @click="
            () => {
              message.query.Type = 2;
              message.getMessageList();
            }
          "
          :class="message.query.Type === 2 ? 'tabsActive' : ''"
        >
          已联系
        </div>
        <div
          @click="
            () => {
              message.query.Type = 3;
              message.getMessageList();
            }
          "
          :class="message.query.Type === 3 ? 'tabsActive' : ''"
          style="margin-left: 24px"
        >
          不合适
        </div>
        <div
          @click="
            () => {
              message.query.Type = 4;
              message.getMessageList();
            }
          "
          :class="message.query.Type === 4 ? 'tabsActive' : ''"
          style="margin-left: 24px"
        >
          收藏
        </div>
      </div>
      <!-- <div class="consult-lowest">
        没有获得满意的价格？获取更多运价
        <span>去问底价</span>
      </div> -->
    </div>
    <div class="select-container">
      <div class="select-left">
        <div class="evaluate">
          共 <span>{{ message.mesData.length }}</span> 条询价
        </div>
        <div class="select-width">
          <el-row :gutter="10">
            <el-col :span="4">
              <el-select
                v-model="handleSelect.data._shipping"
                class="m-2 freight-primary-select"
                placeholder="船公司"
                size="mini"
                @change="
                  (e) => {
                    handleSelect.addShipOptions(e);
                    message.getMessageList();
                  }
                "
              >
                <el-option
                  v-for="item in handleSelect.shipList"
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
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="handleSelect.data._CargoTypeList"
                class="m-2 freight-primary-select"
                placeholder="货物类型"
                size="mini"
                @change="
                  (e) => {
                    handleSelect.addTypeOptions(e);
                    message.getMessageList();
                  }
                "
              >
                <el-option
                  v-for="item in handleSelect.typeOptions"
                  :key="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <!-- <el-col :span="4">
              <el-select
                v-model="handleSelect.data._lineType"
                class="m-2 freight-primary-select"
                placeholder="直达/中转"
                size="mini"
                @change="
                  (e) => {
                    handleSelect.addZzzdOptions(e);
                    message.getMessageList();
                  }
                "
              >
                <el-option
                  v-for="item in handleSelect.zzzdOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col> -->
            <el-col :span="5">
              <el-select
                filterable
                class="m-2 freight-primary-select"
                size="mini"
                v-model="message._query.StartTime"
                placeholder="计划出运日"
              >
                <el-option label="计划出运日" value="计划出运日"></el-option>
              </el-select>
              <el-date-picker
                v-model="message.dateRange"
                type="daterange"
                style="
                  width: 133px;
                  position: absolute;
                  left: 203px;
                  opacity: 0;
                  z-index: 2;
                  cursor: pointer;
                "
                popper-class="data-picker-freight-primary"
                value-format="YYYY-MM-DD"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                class="m-2"
                size="mini"
                @change="message.getMessageList"
              >
              </el-date-picker>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- <div class="select-right">
        <el-select
          v-model="message.query.SortBy"
          @change="message.getMessageList"
          class="m-2"
          popper-class="freight-select-dropdown"
          size="mini"
        >
          <el-option
            v-for="item in handleSelect.priceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div> -->
    </div>
    <div class="tag-container">
      <div class="query-tag-group">
        <div
          class="query-tag-title"
          v-if="message._query.ShippingIdList.length"
        >
          船公司:
        </div>
        <div class="" v-if="message._query.ShippingIdList.length">
          <el-tag
            class="ml-2 query-tag"
            closable
            type="warning"
            v-for="item in message._query.ShippingIdList"
            :key="item"
            @close="
              () => {
                handleSelect.delShipOptions(item);
                message.getMessageList();
              }
            "
            >{{ handleSelect.shipList.find((e) => e.Id == item).Code }}
          </el-tag>
          <!--          <el-tag class="mx-1" closable type="warning">OOCL</el-tag>
          <el-tag class="mx-1" closable type="warning">CMA</el-tag>-->
        </div>
      </div>
      <div class="query-tag-group">
        <div class="query-tag-title" v-if="message._query.CargoTypeList.length">
          货物类型:
        </div>
        <div class="" v-if="message._query.CargoTypeList.length">
          <el-tag
            class="ml-2 query-tag"
            closable
            type="warning"
            v-for="item in message._query.CargoTypeList"
            :key="item"
            @close="
              () => {
                handleSelect.delTypeOptions();
                message.getMessageList();
              }
            "
            >{{ handleSelect.typeOptions.find((e) => e.value == item).value }}
          </el-tag>
        </div>
      </div>
      <div class="query-tag-group">
        <div class="query-tag-title" v-if="handleSelect.zzzdTags.length">
          直达/中转:
        </div>
        <div class="" v-if="handleSelect.zzzdTags.length">
          <el-tag
            class="ml-2 query-tag"
            closable
            type="warning"
            v-for="item in handleSelect.zzzdTags"
            :key="item"
            @close="
              () => {
                handleSelect.delZzzyOptions();
                message.getMessageList();
              }
            "
          >
            {{ handleSelect.zzzdOptions.find((e) => e.value === item).label }}
          </el-tag>
        </div>
      </div>
      <div class="query-tag-group">
        <div
          class="query-tag-title"
          v-show="
            message.query.DeliveryDateStart && message.query.DeliveryDateEnd
          "
        >
          计划出运日:
        </div>
        <div
          class=""
          v-show="
            message.query.DeliveryDateStart && message.query.DeliveryDateEnd
          "
        >
          <el-tag
            class="ml-2 query-tag"
            closable
            type="warning"
            @close="
              () => {
                message.query.DeliveryDateStart = '';
                message.query.DeliveryDateEnd = '';
                message.getMessageList();
              }
            "
          >
            {{ message.query.DeliveryDateStart }}/{{
              message.query.DeliveryDateEnd
            }}
          </el-tag>
        </div>
      </div>
      <div
        class="primary"
        @click="handleSelect.clearTags"
        v-show="
          message._query.ShippingIdList.length ||
          message._query.CargoTypeList.length ||
          handleSelect.zzzdTags.length
        "
      >
        清除条件
      </div>
    </div>

    <div class="card-container">
      <div class="card-left">
        <div class="card-title">
          <el-checkbox
            v-model="message.isNoRead"
            class="freight-primary-checkbox"
            >未读消息</el-checkbox
          >
        </div>
        <el-scrollbar
          class="left-body"
          ref="leftList"
          v-loading="message.listLoading"
        >
          <NotMessage
            @click="
              () => {
                message.getMesDetail(item);
                message.getInquireNewCount();
                item.UnReadCount = 0;
                drawer.togglePad = false;
              }
            "
            v-for="item in message.mesData"
            :key="item.Id"
            :data="item"
            :isTop="item.FixedTop"
            :isActive="message.mesDetail.Id == item.Id"
            :isShow="item.UnReadCount > 0 || !message.isNoRead"
          ></NotMessage>
          <div
            style="
              font-size: 12px;
              color: #969799;
              letter-spacing: -0.86px;
              text-align: center;
            "
            v-if="message.mesData.length"
          >
            到底啦，没有更多了～
          </div>
          <div
            v-if="!message.mesData.length"
            style="
              font-size: 12px;
              color: #969799;
              letter-spacing: -0.86px;
              text-align: center;
            "
          >
            暂无询价
          </div>
        </el-scrollbar>
      </div>
      <div class="card-right">
        <div v-if="!message.mesDetail.Id"></div>
        <div v-else>
          <div class="card-title title-container">
            <div class="price">
              <div>询价沟通</div>
            </div>
            <div class="star">
              <div>
                <img
                  v-if="!message.mesDetail.Collection"
                  @click="
                    message.setInquireTag(
                      message.mesDetail.Id,
                      'Collection',
                      true
                    )
                  "
                  src="@/assets/consultPrice/star.svg"
                  style=""
                  alt=""
                />
                <img
                  v-if="message.mesDetail.Collection"
                  @click="
                    message.setInquireTag(
                      message.mesDetail.Id,
                      'Collection',
                      false
                    )
                  "
                  src="@/assets/consultPrice/star-select.svg"
                  style=""
                  alt=""
                />
              </div>
              <div
                v-if="!message.mesDetail.FixedTop"
                @click="
                  message.setInquireTag(message.mesDetail.Id, 'FixedTop', true)
                "
              >
                <img src="../../../assets/consultPrice/canselect.svg" alt="" />
              </div>
              <div
                v-if="message.mesDetail.FixedTop"
                @click="
                  message.setInquireTag(message.mesDetail.Id, 'FixedTop', false)
                "
              >
                <img
                  src="../../../assets/consultPrice/canselect-select.svg"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div class="toggle-pad" :class="drawer.togglePad ? 'widh-55' : ''">
            <div class="company">

              <div class="note-port">
                <img :src="message.mesDetail.ShippingLogo" alt="" />
                <div class="city" style="text-align: end">
                  {{ message.mesDetail.PolPortEnName }}
                </div>
                <div
                  class="bar"
                  style="width: 60px; display: flex; align-items: center"
                >
                  <div class="plugin-icon">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <div class="city">{{ message.mesDetail.DestPortEnName }}</div>
              </div>
              <div
                class="price"
                v-if="
                  !(
                    message.mesDetail.ZdTotalAmountUSD ||
                    message.mesDetail.ZdTotalAmountCNY
                  )
                "
              >
                底价：
                <div v-if="message.mesDetail.time">
                  在 {{ message.mesDetail.time }} 内获取
                </div>
                <div v-else>即将报价</div>
              </div>
              <div v-else>
                <span>底价：</span>
                <span class="red" v-if="message.mesDetail.ZdTotalAmountUSD">
                  USD
                  {{ $utils.formatAmount(message.mesDetail.ZdTotalAmountUSD) }}
                </span>
                <span
                  v-if="
                    message.mesDetail.ZdTotalAmountUSD &&
                    message.mesDetail.ZdTotalAmountCNY
                  "
                >
                  &
                </span>
                <span class="red" v-if="message.mesDetail.ZdTotalAmountCNY">
                  CNY
                  {{
                    $utils.formatEmptyString(message.mesDetail.ZdTotalAmountCNY)
                  }}
                </span>
              </div>
              <div class="expend-btn" @click="drawer.openDrawer()">
                <el-icon
                  class="arrow-icon"
                  :class="drawer.togglePad ? 'icon-turn' : ''"
                  ><ArrowLeft
                /></el-icon>
              </div>
            </div>
            <div class="not-suitable-message" v-if="message.notSuitable">
              <div style="display: flex; align-items: center">
                <el-icon style="margin-right: 3px"><InfoFilled /></el-icon>
                已设置为不感兴趣，将不再提示这条运价的消息
              </div>
              <div
                class="change-suitable"
                @click="
                  message.setInquireTag(
                    message.mesDetail.Id,
                    'NotSuitable',
                    false
                  )
                "
              >
                改为合适
              </div>
            </div>
            <el-scrollbar
              class="right-body"
              ref="rightBody"
              v-loading="message.cardLoading"
            >
              <ConsultPriceCard
                @toOffer="drawer.openDrawer(3)"
                @toConsult="drawer.openDrawer(2)"
                @openOrderFile="message.openFile()"
                @submitBookingFile="message.submitBookingOrderFile"
                @askContact="message.askAllContact"
                @urge="message.urge"
                :data="message.mesDetail.Data"
              ></ConsultPriceCard>
            </el-scrollbar>

            <div class="footer">
              <div class="left">
                <div
                  @click="message.openFile"
                  v-if="message.mesDetail.BookingOrderFile"
                >
                  <img src="@/assets/consultPrice/xzts.svg" alt="" />
                  &nbsp;&nbsp;下载托书
                </div>
                <el-popover
                  placement="top"
                  trigger="hover"
                  v-else-if="message.mesDetail.Status == 0"
                >
                  <template #reference>
                    <div style="opacity: 0.6">
                      <img src="@/assets/consultPrice/qts.svg" alt="" />
                      &nbsp;&nbsp;提交托书
                    </div>
                  </template>
                  <div>获取底价后即可提交托书</div>
                </el-popover>
                <div
                  @click="message.submitBookingOrderFile"
                  v-else-if="message.mesDetail.Status == 1"
                >
                  <img src="@/assets/consultPrice/qts.svg" alt="" />
                  &nbsp;&nbsp;提交托书
                </div>

                <el-popover
                  placement="top"
                  trigger="hover"
                  v-if="message.mesDetail.Status == 0"
                >
                  <template #reference>
                    <div style="opacity: 0.6">
                      <img src="@/assets/consultPrice/tel.svg" alt="" />
                      &nbsp;&nbsp;联系电话
                    </div>
                  </template>
                  <div>获取底价后即可查询承运人电话</div>
                </el-popover>
                <div
                  @click="message.askContact(100)"
                  v-if="message.mesDetail.Status == 1"
                >
                  <img src="@/assets/consultPrice/tel.svg" alt="" />
                  &nbsp;&nbsp;联系电话
                </div>

                <el-popover
                  placement="top"
                  trigger="hover"
                  v-if="message.mesDetail.Status == 0"
                >
                  <template #reference>
                    <div style="opacity: 0.6">
                      <img src="@/assets/consultPrice/qq.svg" alt="" />
                      &nbsp;&nbsp;联系QQ
                    </div>
                  </template>
                  <div>获取底价后即可查询承运人QQ</div>
                </el-popover>
                <div
                  @click="message.askContact(101)"
                  v-if="message.mesDetail.Status == 1"
                >
                  <img src="@/assets/consultPrice/qq.svg" alt="" />
                  &nbsp;&nbsp;联系QQ
                </div>
              </div>
              <div class="right">
                <div
                  style=""
                  v-if="!message.mesDetail.NotSuitable"
                  @click="
                    message.setInquireTag(
                      message.mesDetail.Id,
                      'NotSuitable',
                      true
                    )
                  "
                >
                  <img src="@/assets/consultPrice/not.svg" alt="" />&nbsp;不合适
                </div>
                <div
                  style="color: #fd953e"
                  v-if="message.mesDetail.NotSuitable"
                  @click="
                    message.setInquireTag(
                      message.mesDetail.Id,
                      'NotSuitable',
                      false
                    )
                  "
                >
                  <img
                    src="@/assets/consultPrice/not-select.svg"
                    alt=""
                  />&nbsp;不合适
                </div>
              </div>
            </div>
          </div>
          <ConsultPricePad
            class="toggle-consult-pad"
            :class="drawer.togglePad ? 'widh-45' : ''"
            :ref="(e) => (drawer.drawerRef = e)"
            @urge="message.urge"
            @submitBookingFile="message.submitBookingOrderFile"
            @askPhone="message.askContact(100)"
            @askQQ="message.askContact(101)"
          ></ConsultPricePad>
        </div>
      </div>
    </div>
    <!--    抽屉-->
    <!-- <ConsultPriceDrawer
      @urge="message.urge"
      @submitBookingFile="message.submitBookingOrderFile"
      @askPhone="message.askContact(100)"
      @askQQ="message.askContact(101)"
      :ref="(e) => (drawer.drawerRef = e)"
    ></ConsultPriceDrawer> -->
    <UploadBookingFileDialog
      :ref="(e) => (message.uploadRef = e)"
      @uploadSuccess="message.getMessageList"
    ></UploadBookingFileDialog>
  </JstCardLayout>
  <JstCardLayout v-else>
    <div class="no-data">
      <img src="@/assets/images/no-data-2.png" />
      <div>哎呀，请先进行企业认证才能询价沟通呢。</div>
    </div>
  </JstCardLayout>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
  computed,
  onMounted,
  unref,
  onBeforeUnmount,
} from "vue";
import { Star, StarFilled, ArrowLeft, InfoFilled } from "@element-plus/icons";
import NotMessage from "./components/NotsMessage.vue";
import ConsultPriceCard from "./components/ConsultPriceCard.vue";
import ConsultPriceDrawer from "./components/ConsultPriceDrawer.vue";
import UploadBookingFileDialog from "./components/UploadBookingFileDialog.vue";
import ConsultPricePad from "./components/ConsultPricePad.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import request from "@/public/request";
import { ElMessage } from "element-plus";
import { useTimeCountDown } from "@/utils/nowOrder";
import { getElectronAgent } from "@share/agent";
import dayjs from "dayjs";
/*active相关*/
function setAcitve() {
  let tabsActive = 0;
  return reactive({
    tabsActive,
  });
}

/*select相关*/
function handleSelects({ query, _query, message }) {
  /* 默认加载所有船公司 */
  let shipList = ref([]);
  async function getShipping(key) {
    const res = await request.get("/api/FRShipping/GetShippingList", {
      page: 1,
      limit: -1,
      ShippingSimName: key,
    });
    shipList.value = res.Rows;
    // shipList.value = res.Rows.map((e) => ({
    //   value: e.Id,
    //   label: e.CnShippingName,
    // }));
  }
  const data = ref({
    _shipping: "船公司",
    _CargoTypeList: "货物类型",
    _lineType: "直达/中转",
  });
  function addShipOptions(Id) {
    data.value._shipping = "船公司";
    if (!Id) {
      return;
    }
    _query.ShippingIdList.push(Id);
    _query.ShippingIdList = [...new Set(_query.ShippingIdList)];
    message.getMessageList();
  }
  function delShipOptions(Id) {
    _query.ShippingIdList.splice(_query.ShippingIdList.indexOf(Id), 1);
    message.getMessageList();
  }

  let typeOptions = ref([
    { value: "普货" },
    { value: "电子产品" },
    { value: "药品" },
    { value: "挂衣" },
    { value: "危险品" },
  ]);

  function addTypeOptions(val) {
    data.value._CargoTypeList = "货物类型";
    if (!val) {
      return;
    }
    _query.CargoTypeList.push(val);
    _query.CargoTypeList = [...new Set(_query.CargoTypeList)];
    message.getMessageList();
  }
  function delTypeOptions(val) {
    let length = _query.CargoTypeList.indexOf(val);
    _query.CargoTypeList.splice(length, 1);
    message.getMessageList();
  }

  let zzzdOptions = ref([
    { value: 1, label: "中转" },
    { value: 0, label: "直达" },
  ]);
  let zzzdTags = ref([]);
  function addZzzdOptions(val) {
    data.value._lineType = "直达/中转";
    if (val !== 0 && val !== 1) {
      return;
    }
    zzzdTags.value.push(val);
    zzzdTags.value = [...new Set(zzzdTags.value)];
    if (zzzdTags.value.length >= 2) {
      query.LineType = -1;
    } else {
      query.LineType = val;
    }
    message.getMessageList();
  }
  function delZzzyOptions(val) {
    let length = zzzdTags.value.indexOf(val);
    zzzdTags.value.splice(length, 1);
    if (zzzdTags.value.length >= 1) {
      query.LineType = zzzdTags.value[0];
    } else {
      query.LineType = -1;
    }
    message.getMessageList();
  }
  let timesOptions = ref([{ value: "2022-03-07", label: "2022-03-07" }]);
  let priceOptions = ref([
    { value: "20GP", label: "20GP价格最低优先" },
    { value: "40GP", label: "40GP价格最低优先" },
    { value: "40HQ", label: "40HQ价格最低优先" },
  ]);
  function clearTags() {
    query.ShippingIdList = [];
    _query.ShippingIdList = [];
    _query.CargoTypeList = [];
    query.CargoTypeList = "";
    query.DeliveryDateStart = "";
    query.DeliveryDateEnd = "";
    zzzdTags.value = [];
    query.LineType = "";
    message.getMessageList();
  }

  onMounted(() => {
    getShipping();
  });
  return reactive({
    data,
    shipList,
    typeOptions,
    zzzdOptions,
    timesOptions,
    priceOptions,

    zzzdTags,

    delShipOptions,
    delTypeOptions,
    delZzzyOptions,

    addShipOptions,
    addTypeOptions,
    addZzzdOptions,

    clearTags,
  });
}

function useMessage({ rightBody, leftList }) {
  const hasRight = ref(true);
  const cardLoading = ref(true);
  const listLoading = ref(true);
  const query = ref({
    Type: -1,
    ShippingIdList: "",
    CargoTypeList: "",
    DeliveryDateStart: "",
    DeliveryDateEnd: "",
    SortBy: "20GP",
    page: 1,
    limit: -1,
    isNoRead: false,
  });
  const route = useRoute();
  const _query = ref({
    shipName: "船公司",
    CargoTypeList: "货物类型",
    StartTime: "计划出运日",
    lineType: "直达/中转",
    CargoTypeList: [],
    ShippingIdList: [],
  });
  const dateRange = computed({
    get: () => {
      return [query.value.DeliveryDateStart, query.value.DeliveryDateEnd];
    },
    set: (e) => {
      if (e) {
        query.value.DeliveryDateStart = e[0];
        query.value.DeliveryDateEnd = e[1];
      } else {
        query.value.DeliveryDateStart = "";
        query.value.DeliveryDateEnd = "";
      }
    },
  });

  /* 获取咨询信息列表 */
  const mesData = ref([]);
  const timeCountDown = useTimeCountDown();
  async function getMessageList(isInterval) {
    //循环请求不显示加载动画
    if (!isInterval) {
      listLoading.value = true;
    }
    query.value.ShippingIdList = _query.value.ShippingIdList.join(",");
    query.value.CargoTypeList = _query.value.CargoTypeList.join(",");
    const res = await request.get(
      "/api/FRInquireCustomer/GetInquireList",
      query.value
    );

    mesData.value = res.Rows;

    if (mesData.value.length) {
      //设置倒计时
      mesData.value.forEach(async (item) => {
        if (!item.ZdTotalAmountCNY && !item.ZdTotalAmountUSD) {
          const time = item.CreateTime;
          let nowTime = await request.get("/api/System/GetSystemDate");
          nowTime = nowTime.replace(/\//g, "-");
          let showTime = timeCountDown.startByCreateTime(time, 30 * 60, nowTime);
          item.time = showTime;
        }
      });

      //循环请求时详情定位
      if (inquireInfoId.value) {
        mesData.value.forEach((item) => {
          if (item.Id == inquireInfoId.value) {
            getMesDetail(item, isInterval);
          }
        });
      } else if (route.query.id) {
        mesData.value.forEach((item) => {
          if (item.Id == route.query.id) {
            getMesDetail(item, isInterval);
          }
        });
      } else {
        getMesDetail(mesData.value[0], isInterval);
      }
    }
    listLoading.value = false;
    setTimeout(() => {
      leftList.value.update();
    }, 100);
  }

  /* 获取咨询信息详情 */
  const mesDetail = ref({
    Data: [],
  });
  const filePath = ref(null);
  const inquireInfoId = ref(null);
  const notSuitable = ref(false);
  async function getMesDetail(row, isInterval) {
    //循环请求不显示加载动画
    if (!isInterval) {
      cardLoading.value = true;
    }
    inquireInfoId.value = row.Id;
    const res = await request.get("/api/FRInquireCustomer/GetInquireDetail", {
      inquireInfoId: row.Id,
    });
    await getInquireNewCount();
    //时间相同时隐藏
    res.Data.forEach((item, index) => {
      if (index > 0) {
        if (
          res.Data[index - 1].CreateTime.substring(0, 16) ==
          item.CreateTime.substring(0, 16)
        ) {
          item.hideTime = true;
        } else {
          item.hideTime = false;
        }
      }
      item.isReply = false;
      item.isUpLoad = false;
      if (item.Type == 1) {
        res.Data.find((item2) => item2.Type == 0).isReply = true;
      }
      if (item.Type == 3) {
        res.Data.find((item3) => item3.Type == 1).isUpLoad = true;
      }
    });
    

    //
    mesDetail.value = {
      ...row,
      Data: res.Data,
    };

    if (!mesDetail.value.ZdTotalAmountCNY && !mesDetail.value.ZdTotalAmountUSD) {
      const time = mesDetail.value.CreateTime;
      let nowTime = await request.get("/api/System/GetSystemDate");
      nowTime = nowTime.replace(/\//g, "-");
      let showTime = timeCountDown.startByCreateTime(time, 30 * 60, nowTime);
      mesDetail.value.time = showTime;
    }

    const res2 = await request.get("/api/FRInquireCustomer/GetInquireInfo", {
      inquireInfoId: row.Id,
    });
    filePath.value = res2.Data.BookingOrderFile;
    notSuitable.value = res2.Data.NotSuitable;
    if (!isInterval) {
      scrollDown();
    }
    cardLoading.value = false;

    setTimeout(() => {
      rightBody.value.update();
    }, 100);
  }
  const agent = getElectronAgent();
  // 打开托书
  function openFile() {
    agent.ipcRequest(
      "window/downloadUrl",
      import.meta.env.VITE_AXIOS_HOST + filePath.value
    );
  }
  /* 上传拖书 */
  const uploadRef = ref(null);
  function submitBookingOrderFile() {
    if (mesDetail.value.BookingOrderFile) {
      ElMessage.warning("托书已上传，请勿重复上传");
      return;
    }
    if (mesDetail.value.Id) {
      unref(uploadRef).openDialog(mesDetail.value.Id);
    }

    // const res = request.get(
    //   "/api/FRInquireCustomer/UploadBookingOrderFile"
    // );
    // console.log(res);
  }

  /* 索要联系方式 type:100 联系电话 type:101 索要 qq */
  async function askContact(type) {
    let form = {
      InquireInfoId: mesDetail.value.Id,
      ActionType: type,
    };
    const res = await request.post("/api/FRInquireCustomer/AskContact", form);
    query.value.Type = 2;
    getMessageList();
    getMesDetail(mesDetail.value);
  }
  async function askAllContact() {
    askContact(100);
    askContact(101);
  }
  //催一下
  async function urge() {
    const res = await request.post("/api/FRInquireCustomer/UrgeProviderReply", {
      inquireInfoId: mesDetail.value.Id,
    });
    if (res.Status) {
      getMesDetail(mesDetail.value);
    } else {
      await getMesDetail(mesDetail.value);
      let message = {
        message: res.Message,
        Type: "message",
        CreateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };
      mesDetail.value.Data.push(message);
    }
  }

  /*获取新报价数量*/
  const store = useStore();
  async function getInquireNewCount() {
    /*获取新报价数量*/
    await store.dispatch("message/getUnReadMessageCount");
  }

  async function setInquireTag(id, type, status) {
    let form = { InquireInfoId: id };
    switch (type) {
      case "FixedTop":
        form.FixedTop = status;
        break;
      case "Collection":
        form.Collection = status;
        break;
      case "NotSuitable":
        form.NotSuitable = status;
        break;
    }

    const res = await request.post(
      "/api/FRInquireCustomer/SetInquireEmployeeTag",
      form
    );
    if (res.Status) {
      ElMessage.success(res.Message);
      form.NotSuitable === true ? (query.value.Type = 3) : "";
      getMessageList();
      getMesDetail(mesDetail.value);
    } else {
      ElMessage.warning(res.Message);
    }
  }

  //自动滚到底
  function scrollDown() {
    rightBody.value.wrap$.scrollTop = rightBody.value.wrap$.scrollHeight;
  }

  // let requestList = null;
  let listener = null;
  onMounted(() => {
    getInquireNewCount();
    getMessageList();
    listener = window.$ipc.on("freightRate/inquire", (_, msg) => {
      getMessageList(true);
      getMesDetail(mesDetail.value);
    });
    // requestList = setInterval(() => {
    //   getMessageList(true);
    //   console.log("间隔30S请求");
    // }, 30000);
  });
  onBeforeUnmount(() => {
    // clearInterval(requestList);
  });
  return reactive({
    hasRight,
    query,
    _query,
    dateRange,
    mesData,
    mesDetail,
    uploadRef,
    setInquireTag,
    getMessageList,
    getInquireNewCount,
    getMesDetail,
    openFile,
    submitBookingOrderFile,
    askContact,
    askAllContact,
    urge,
    notSuitable,
    cardLoading,
    listLoading,
  });
}

/*唤起子组件的抽屉*/
function drawers({ message }) {
  const drawerRef = ref("");
  const togglePad = ref(false);
  /*type:2 询价详情 type：3 报价详情*/
  function openDrawer() {
    if (message.mesDetail.Id) {
      //询价详情
      let type;
      if (message.mesDetail.Status == 0) {
        type = 2;
      } else {
        type = 3;
      }
      togglePad.value = !togglePad.value;
      if (togglePad.value) {
        drawerRef.value.drawer.openDrawer(message.mesDetail.Id, type);
      }
    }
  }
  return reactive({
    drawerRef,
    openDrawer,
    togglePad,
  });
}

export default defineComponent({
  components: {
    Star,
    StarFilled,
    ArrowLeft,
    InfoFilled,
    NotMessage,
    ConsultPriceCard,
    ConsultPriceDrawer,
    UploadBookingFileDialog,
    ConsultPricePad,
  },
  setup() {
    const leftList = ref(null);
    const router = useRouter();
    const rightBody = ref(null);
    const message = useMessage({ rightBody, leftList });
    const setActive = setAcitve();
    const handleSelect = handleSelects({
      query: message.query,
      _query: message._query,
      message,
    });
    const drawer = drawers({ message });

    onMounted(() => {});
    return {
      leftList,
      rightBody,
      setActive,
      handleSelect,
      drawer,
      message,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  margin: 8px;
  .title {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
  }
}
.tabs {
  height: 29px;
  display: flex;
  justify-content: space-between;
  div {
    padding: 0 16px;
    display: flex;
    margin-left: 10px;
    align-items: center;
    background-color: #f2f3f5;
    color: #969799;
    cursor: pointer;
  }
  .inquire-Count {
    position: relative;
    span {
      display: block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      position: absolute;
      right: -5px;
      top: 0;
      background: red;
    }
  }
}
.tabsActive {
  background-color: #fcf1e7 !important;
  color: #fd953e !important;
}
.select-container {
  display: flex;
  justify-content: space-between;
  margin-top: 28px;
  .select-left {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    .select-width {
      display: flex;
      // justify-content: space-between;
    }
  }
  .consult-lowest {
    background: #fcf1e7;
    border-radius: 4px;
    padding: 6px 8px;
    font-size: 12px;
    span {
      border: 1px solid #fd953e;
      border-radius: 10px;
      background: #fcf1e7;
      font-size: 12px;
      color: #fd953e;
      cursor: pointer;
      padding: 1px 8px;
    }
  }
}
::v-deep .select-width .el-select--mini {
  // width: 115px !important;
}
::v-deep .select-right .el-select--mini {
  // height: 29px;
  // line-height: 29px;
  // background: #fcf1e7;

  padding: 0 10px;
  border: none;
}
::v-deep .select-right .el-select .el-input__inner {
  background-color: #fcf1e7 !important;
  color: #fd953e;
  border: none;
}
/*placeholder颜色*/
::v-deep .select-right .el-select .el-input__inner::-webkit-input-placeholder {
  color: #fd953e !important;
}
// :deep(.selected){
//   color:#fd953e !important
// }
.evaluate {
  font-size: 12px;
  color: #969799;
  margin-right: 16px;
  span {
    color: #fd953e;
  }
}
.tag-container {
  display: flex;
  align-items: center;
  color: #606266;
  margin-top: 13px;
  width: 100%;
  div {
    display: flex;
    align-items: center;
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
.tag-btn {
  min-width: 80px;
  padding-right: 16px;
}
::v-deep .tag-btn span {
  margin-left: 5px;
  font-size: 12px;
}
.primary {
  color: #409eff;
  cursor: pointer;
}
// ::-webkit-scrollbar {
//   width: 0;
//   height: 0;
//   background-color: rgba(240, 240, 240, 1);
// }
.card-container {
  margin-top: 25px;
  width: 100%;
  display: flex;
  border: 1px solid #f1f2f4;
  .card-left {
    width: 30%;
    min-width: 375px;
    border-right: 1px solid #f1f2f4;
    z-index: 1;
    box-shadow: 0 2px 4px 0 #dee4e7;
    .left-body {
      padding: 9px;
      height: calc(100vh - 374px);
      background: #f8f8f8;
      overflow: auto;
    }
  }
  .card-right {
    width: 70%;
    position: relative;
    .toggle-pad {
      transition: width 0.2s;
      width: 100%;
      z-index: 5;
    }
    .toggle-consult-pad {
      transition: width 0.2s;
      position: absolute;
      right: 0;
      top: 46px;
      width: 0%;
      // opacity: 0;
      height: calc(100% - 24px);
      z-index: 4;
    }
    .company {
      padding-left: 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      border-bottom: 1px solid #f1f2f4;
      box-shadow: 0 1px 2px 0 rgba(60, 65, 68, 0.15);
      height: 47px;
      color: #3c4144;
      padding-right: 16px;
      position: relative;
      .inquiry {
        margin-left: 5px;
        color: #8ba0b0;
      }
      img {
        height: 17px;
        margin: 0 6px;
      }
      .note-port {
        display: flex;
        .city {
          font-size: 14px;
          font-weight: 600;
          max-width: 160px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .bar {
          width: 100px;
        }
      }
      .price {
        display: flex;
        align-items: center;
        div {
          padding: 5px;
          background: #fef0f0;
          border-radius: 4px;
        }
      }
      .red {
        color: #ef4333;
        font-weight: 600;
      }
    }
    .right-body {
      height: calc(100vh - 452px);
      width: 100%;
      overflow: auto;
      position: relative;
    }
    .footer {
      height: 47px;
      width: 100%;
      border-top: 1px solid #f1f2f4;
      display: flex;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        div {
          height: 25px;
          display: flex;
          align-items: center;
          border-right: 1px solid #f1f2f4;
          padding: 0 24px;
          color: #606266;
          font-weight: 400;
          cursor: pointer;
        }
      }
      .ponter-forbid {
        cursor: not-allowed;
        div {
          pointer-events: none;
        }
      }
      .right {
        display: flex;
        align-items: center;
        div {
          display: flex;
          align-items: center;
          padding-right: 16px;
          color: #606266;
          font-weight: 400;
          cursor: pointer;
        }
      }
    }
  }
}
.card-title {
  height: 45px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  border-bottom: 1px solid #f1f2f4;
}
.title-container {
  justify-content: space-between;
  align-items: center;
  .price {
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 2px 2px 0 0;
      width: 64px;
      height: 32px;
      margin-top: 14px;
      margin-left: 17px;
      padding: 0 8px;
      border: 1px solid #f1f2f4;
      border-bottom: none;
      background-color: #ffffff;
      color: #fd953e;
      font-size: 12px;
    }
  }
  .star {
    margin-right: 30px;
    width: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
.top-query-title {
  font-size: 14px;
  color: #303133;
  font-weight: bold;
  margin-bottom: 8px;
}
.plugin-icon {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 4px;
  div:nth-child(1) {
    width: 7px;
    height: 7px;
    border: 1px solid #969799; /*var(--freight-layout-primary-color)*/
    border-radius: 50%;
  }
  div:nth-child(2) {
    height: 0;
    border: 1px solid #969799;
    width: 60%;
    margin: 0 4px;
  }
  div:nth-child(3) {
    width: 7px;
    height: 7px;
    border: 1px solid #969799; /*var(--freight-layout-primary-color)*/
    border-radius: 50%;
  }
}
.not-suitable-message {
  background: #fef0f0;
  padding: 4px 12px;
  display: flex;
  justify-content: space-between;
  color: #ef4333;
  .change-suitable {
    background: #ef4333;
    color: white;
    padding: 1px 8px;
    border-radius: 10px;
    cursor: pointer;
  }
}
.expend-btn {
  background: #fd953e;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  color: white;
  width: 8px;
  height: 16px;
  padding: 2px 1px;
  position: absolute;
  right: 0;
  top: 14px;
  cursor: pointer;
}
.arrow-icon {
  transition: 0.3s;
  font-size: 12px;
  margin-top: 2px;
  margin-left: -1px;
}
.icon-turn {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}
.widh-55 {
  width: 59% !important;
}
.widh-45 {
  width: 41% !important;
  // opacity: 1!important;
}
:deep(.el-select .el-input__inner) {
  padding-right: 24px;
}
</style>
