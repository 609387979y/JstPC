<template>
  <div v-loading="drawer.loading">
    <el-scrollbar
      class="drawer-container-scroll"
      :style="drawer.detailData.Info&&drawer.detailData.Info.IsShow&&(!drawer.detailData.ZdTotalAmountCNY && !drawer.detailData.ZdTotalAmountUSD)?'height:200px;':`height:calc( 100% - 220px)`"
    >
      <div class="drawer-container">
        <div v-if="drawer.detailData.Info" class="right">
          <!-- <div class="close-btn" @click="drawer.closeDrawer">X</div> -->
          <div class="port">
            <div class="title">
              有效期：{{ drawer.detailData.Info.StartTime.substring(0, 10) }}
              -
              {{ drawer.detailData.Info.EndTime.substring(0, 10) }}
            </div>
            <div class="title2">
              <!-- 船司信息 -->
              <span
                ><img
                  class="ship-logo"
                  :src="drawer.detailData.Info.ShippingLogo"
                  alt=""
                />
                &nbsp;&nbsp;</span
              >
              <!-- <span>{{ drawer.detailData.Info.CnShippingName }}</span> -->
              <span>{{ drawer.detailData.Info.ShippingCode }} &nbsp;&nbsp;</span>
              <span>
                截关开航：{{ drawer.weekCn[drawer.detailData.Info.CSTDate - 1] }}/{{
                  drawer.weekCn[drawer.detailData.Info.ETDDate - 1]
                }}
              </span>
            </div>
            <div class="city">
              <div class="name" style="text-align: end">
                <div>{{ drawer.detailData.Info.PolEnPortName }}</div>
                <div>{{ drawer.detailData.Info.PolCnPortName }}</div>
              </div>
              <div class="bar">
                <div style="text-align: center">
                  {{ drawer.detailData.Info.LineDay }} 天
                </div>
                <div>
                  <div class="plugin-icon">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <el-popover placement="bottom" trigger="hover">
                  <template #reference>
                    <div class="podPort">
                      {{ drawer.detailData.Info.PodEnPortName }}
                    </div>
                  </template>
                  <div class="FCL-hover">
                    英文名称：{{ drawer.detailData.Info.PodEnPortName }}
                  </div>
                  <div class="FCL-hover">
                    中文名称：{{ drawer.detailData.Info.PodCnPortName }}
                  </div>
                </el-popover>
              </div>
              <div class="name">
                <div>{{ drawer.detailData.Info.DestEnPortName }}</div>
                <div>{{ drawer.detailData.Info.DestCnPortName }}</div>
              </div>
            </div>
            <div class="cost" v-if="drawer.detailData.Info.IsShow == false || (drawer.detailData.ZdTotalAmountUSD || drawer.detailData.ZdTotalAmountCNY)">
              <div
                style="border-bottom: 2px dashed #e4e7ed"
                v-show="drawer.sumFreightUSD || drawer.sumFreightCNY"
              >
                <el-collapse v-model="collapse.collapse.cost1" class="freight-collapse">
                  <el-collapse-item title="基础海运费" name="1">
                    <template #title>
                      <div class="cost-title">
                        <div class="title-item">基础海运费</div>
                        <div class="title-item2">
                          <span
                            v-show="drawer.sumLowFreightUSD"
                            :class="drawer.sumLowFreightUSD ? 'low-price-sum' : ''"
                          >
                            USD
                            {{ $utils.formatAmount(drawer.sumLowFreightUSD) }}
                          </span>
                          <span
                            v-show="drawer.sumFreightUSD && drawer.detailData.Info.IsShow == false"
                            :class="drawer.sumLowFreightUSD ? 'before-price-sum' : ''"
                          >
                            USD
                            {{ $utils.formatAmount(drawer.sumFreightUSD) }}
                          </span>
                        </div>
                      </div>
                    </template>
                    <div v-if="drawer.detailData.Count20GP" class="cost-body">
                      <div>20GP x {{ drawer.detailData.Count20GP }}</div>
                      <div v-if="drawer.detailData.Price20GP">
                        <span class="new-price"
                          >USD
                          {{ $utils.formatAmount(drawer.detailData.Price20GP) }}</span
                        >
                        <span class="line-through"
                          v-show="drawer.detailData.Info.IsShow == false"
                          >USD
                          {{
                            $utils.formatAmount(drawer.detailData.Info.OutPrice20GP)
                          }}</span
                        >
                        x
                        {{ drawer.detailData.Count20GP }}
                      </div>
                      <div v-else>
                        USD
                        {{ $utils.formatAmount(drawer.detailData.Info.OutPrice20GP) }} x
                        {{ drawer.detailData.Count20GP }}
                      </div>
                    </div>

                    <div
                      v-if="drawer.detailData.Count40GP"
                      class="cost-body"
                    >
                      <div>40GP x {{ drawer.detailData.Count40GP }}</div>
                      <div v-if="drawer.detailData.Price40GP">
                        <span class="new-price"
                          >USD
                          {{ $utils.formatAmount(drawer.detailData.Price40GP) }}</span
                        >
                        <span class="line-through"
                          v-show="drawer.detailData.Info.IsShow == false"
                          >USD
                          {{
                            $utils.formatAmount(drawer.detailData.Info.OutPrice40GP)
                          }}</span
                        >
                        x
                        {{ drawer.detailData.Count40GP }}
                      </div>
                      <div v-else>
                        USD
                        {{ $utils.formatAmount(drawer.detailData.Info.OutPrice40GP) }} x
                        {{ drawer.detailData.Count40GP }}
                      </div>
                    </div>

                    <div
                      v-if="drawer.detailData.Count40HQ"
                      class="cost-body"
                    >
                      <div>40HQ x {{ drawer.detailData.Count40HQ }}</div>
                      <div v-if="drawer.detailData.Price40HQ">
                        <span class="new-price"
                          >USD
                          {{ $utils.formatAmount(drawer.detailData.Price40HQ) }}</span
                        >
                        <span class="line-through"
                          v-show="drawer.detailData.Info.IsShow == false"
                          >USD
                          {{
                            $utils.formatAmount(drawer.detailData.Info.OutPrice40HQ)
                          }}</span
                        >
                        x
                        {{ drawer.detailData.Count40HQ }}
                      </div>
                      <div v-else>
                        USD
                        {{ $utils.formatAmount(drawer.detailData.Info.OutPrice40HQ) }} x
                        {{ drawer.detailData.Count40HQ }}
                      </div> 
                    </div>

                    <div
                      v-if="drawer.detailData.CountTzx20RF"
                      class="cost-body"
                    >
                      <div>20RF x {{ drawer.detailData.CountTzx20RF }}</div>
                      <div v-if="drawer.detailData.PriceTzx20RF">
                        <span class="new-price"
                          >USD
                          {{ $utils.formatAmount(drawer.detailData.PriceTzx20RF) }}</span
                        >
                        <span class="line-through"
                          v-show="drawer.detailData.Info.IsShow == false"
                          >USD
                          {{
                            $utils.formatAmount(drawer.detailData.Info.TzxPrice20RF)
                          }}</span
                        >
                        x
                        {{ drawer.detailData.CountTzx20RF }}
                      </div>
                      <div v-else>
                        USD
                        {{ $utils.formatAmount(drawer.detailData.Info.TzxPrice20RF) }} x
                        {{ drawer.detailData.CountTzx20RF }}
                      </div> 
                    </div>
                   

                    <div
                      v-if="drawer.detailData.CountTzx40NOR"
                      class="cost-body"
                    >
                      <div>40NOR x {{ drawer.detailData.CountTzx40NOR }}</div>
                      <div v-if="drawer.detailData.PriceTzx40NOR">
                        <span class="new-price"
                          >USD
                          {{ $utils.formatAmount(drawer.detailData.PriceTzx40NOR) }}</span
                        >
                        <span class="line-through"
                          v-show="drawer.detailData.Info.IsShow == false"
                          >USD
                          {{
                            $utils.formatAmount(drawer.detailData.Info.TzxPrice40NOR)
                          }}</span
                        >
                        x
                        {{ drawer.detailData.CountTzx40NOR }}
                      </div>
                      <div v-else>
                        USD
                        {{ $utils.formatAmount(drawer.detailData.Info.TzxPrice40NOR) }} x
                        {{ drawer.detailData.CountTzx40NOR }}
                      </div> 
                    </div>
                    

                    <div
                      v-if="drawer.detailData.CountTzx40RF"
                      class="cost-body"
                    >
                      <div>40RF x {{ drawer.detailData.CountTzx40RF }}</div>
                      <div v-if="drawer.detailData.PriceTzx40RF">
                        <span class="new-price"
                          >USD
                          {{ $utils.formatAmount(drawer.detailData.PriceTzx40RF) }}</span
                        >
                        <span class="line-through"
                          v-show="drawer.detailData.Info.IsShow == false"
                          >USD
                          {{
                            $utils.formatAmount(drawer.detailData.Info.TzxPrice40RF)
                          }}</span
                        >
                        x
                        {{ drawer.detailData.CountTzx40RF }}
                      </div>
                      <div v-else>
                        USD
                        {{ $utils.formatAmount(drawer.detailData.Info.TzxPrice40RF) }} x
                        {{ drawer.detailData.CountTzx40RF }}
                      </div> 
                    </div>
                    

                    <div
                      v-show="drawer.detailData.CountTzx45HQ"
                      class="cost-body"
                    >
                      <div>45HQ x {{ drawer.detailData.CountTzx45HQ }}</div>
                      <div v-if="drawer.detailData.PriceTzx45HQ">
                        <span class="new-price"
                          >USD
                          {{ $utils.formatAmount(drawer.detailData.PriceTzx45HQ) }}</span
                        >
                        <span class="line-through"
                          v-show="drawer.detailData.Info.IsShow == false"
                          >USD
                          {{
                            $utils.formatAmount(drawer.detailData.Info.TzxPrice45HQ)
                          }}</span
                        >
                        x
                        {{ drawer.detailData.CountTzx45HQ }}
                      </div>
                      <div v-else>
                        USD
                        {{ $utils.formatAmount(drawer.detailData.Info.TzxPrice45HQ) }} x
                        {{ drawer.detailData.CountTzx45HQ }}
                      </div> 
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div
                style="border-bottom: 2px dashed #e4e7ed"
                v-if="drawer.feeSumUSD || drawer.feeSumCNY"
              >
                <el-collapse v-model="collapse.collapse.cost2" class="feeDetail-collapse">
                  <el-collapse-item title="海运附加费" name="1">
                    <template #title>
                      <div class="cost-title">
                        <div class="title-item">海运附加费</div>
                        <div class="title-item2">
                          <span v-if="drawer.feeSumUSD">
                            USD {{ $utils.formatAmount(drawer.feeSumUSD) }}</span
                          >
                          <span
                            class="price-and"
                            v-if="drawer.feeSumUSD && drawer.feeSumCNY"
                            >&</span
                          >
                          <span v-if="drawer.feeSumCNY">CNY {{ drawer.feeSumCNY }}</span>
                        </div>
                      </div>
                    </template>
                    <div class="cost-body" v-for="item in drawer.countFeeList">
                      <div>{{ item.feeName }}</div>
                      <div>{{ item.fee }}</div>
                    </div>
                    <!-- <div class="cost-body">
                      <div>旺季附加费*1</div>
                      <div>USD 69*1</div>
                    </div> -->
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div v-if="drawer.locFeeSumCNY">
                <el-collapse
                  v-model="collapse.collapse.cost3"
                  class="locFeeDetail-collapse"
                >
                  <el-collapse-item title="人民币费" name="1">
                    <template #title>
                      <div class="cost-title">
                        <div class="title-item">人民币费</div>
                        <div class="title-item2">
                          CNY
                          {{ drawer.locFeeSumCNY }}
                        </div>
                      </div>
                    </template>
                    <div class="cost-body" v-for="item in drawer.countLocFeeList">
                      <div>{{ item.feeName }}</div>
                      <div>{{ item.fee }}</div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div v-if="drawer.detailData.Info.AMS" style="padding: 14px 0 0 0">
                <div class="cost-title">
                  <div class="title-item">AMS/ENS(不在ALL IN价内)</div>
                  <div class="title-item2">
                    USD
                    {{ $utils.formatAmount(drawer.detailData.Info.AMS) }}/票
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <div class="pad-bottom" ref="drawerBottom">
      <div class="sum-price">
        <div v-if="drawer.detailData.Info&&drawer.detailData.Info.IsShow == false" :class="drawer.InfoType == 3 ? 'text-through-line sum-fs-14' : ''">
          <span class="items1">预计总价：</span>
          <span class="items2" v-if="drawer.detailData.YgTotalAmountUSD">USD&ensp;</span>
          <span class="items3" v-if="drawer.detailData.YgTotalAmountUSD">{{
            $utils.formatAmount(drawer.detailData.YgTotalAmountUSD)
          }}</span>
          <span
            class="items1"
            v-if="
              drawer.detailData.YgTotalAmountUSD && drawer.detailData.YgTotalAmountCNY
            "
          >
            &ensp;& &ensp;</span
          >
          <span class="items2" v-if="drawer.detailData.YgTotalAmountCNY">CNY&ensp;</span>
          <span class="items3" v-if="drawer.detailData.YgTotalAmountCNY">{{
            drawer.detailData.YgTotalAmountCNY
          }}</span>
        </div>

        <div v-if="drawer.detailData.Info && drawer.detailData.Info.IsShow == true && (!drawer.detailData.ZdTotalAmountUSD && !drawer.detailData.ZdTotalAmountCNY)" :class="drawer.detailData.Status == 1 ? 'text-line  sum-fs-14' : ''">
          <span class="items1">预计总价：</span>
          <span class="dpqr-true">该运价需要单票确认</span>
        </div>

        <div :class="drawer.InfoType == 3 ? 'text-red' : ''" v-if="(drawer.detailData.ZdTotalAmountUSD || drawer.detailData.ZdTotalAmountCNY) && drawer.InfoType == 3">
          <span class="items1" v-if="drawer.detailData.ZdTotalAmountUSD">底价：</span>
          <span class="items2" v-if="drawer.detailData.ZdTotalAmountUSD">USD&ensp;</span>
          <span class="items3">{{
            $utils.formatAmount(drawer.detailData.ZdTotalAmountUSD)
          }}</span>
          <span
            class="items1"
            v-if="
              drawer.detailData.ZdTotalAmountUSD && drawer.detailData.ZdTotalAmountCNY
            "
          >
            &ensp;& &ensp;</span
          >
          <span class="items2" v-if="drawer.detailData.ZdTotalAmountCNY">CNY&ensp;</span>
          <span class="items3" v-if="drawer.detailData.ZdTotalAmountCNY">{{
            drawer.detailData.ZdTotalAmountCNY
          }}</span>
        </div>
      </div>
      <div class="consult-price">
        <div class="price-alert reload-alert" v-if="drawer.InfoType != 3">
          <el-alert title="success alert" type="info" show-icon :closable="false">
            <template #title>
              <div class="alert-title alert-title2">获取底价后可查看承运人信息</div>
            </template>
          </el-alert>
        </div>
        <div class="company">
          <div>
            <!-- 该价格由 <span>{{ drawer.detailData.ProviderCompanyName }}</span> 公司提供 -->
            该价格由
            <span v-if="drawer.InfoType == 3"
              ><img
                style="width: 15px; height: 15px; margin: 0 8px"
                :src="drawer.detailData.ProviderCompanyLogo"
                alt=""
              />{{ drawer.detailData.ProviderCompanyName }} </span
            ><img
              v-else
              style="width: 100px; margin: 0 8px"
              src="@/assets/images/company-mohu.png"
              alt=""
            />
            公司提供
          </div>
        </div>
      </div>
    </div>
    <!-- <el-dialog v-model="state.show" title: width="800px">
    <div class="btn-group-center">
      <el-button >放弃修改</el-button>
      <div
        type="primary"
        class="freight-primary-btn"
        style="margin-left: 6px"
      >
        保存关注
      </div>
    </div>
  </el-dialog> -->
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import { InfoFilled, Check } from "@element-plus/icons";
import inquiryPriceDialog from "./ConsultPriceDialog.vue";
import offerPriceDialog from "./OfferPriceDialog.vue";
import lowestPriceDialog from "./GetLowestPrice.vue";
import request from "@/public/request";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { useTimeCountDown } from "@/utils/nowOrder";
/*表单相关*/
function tables() {
  const tableData = [{}, {}];
  return reactive({
    tableData,
  });
}

/*折叠菜单相关*/
function collapses() {
  let collapse = reactive({
    matters: "1",
    specialRemark: "",
    cost2: "",
    cost3: "",
  });
  return reactive({
    collapse,
  });
}

/*唤起子组件报价dialog*/
function childrenDialogs() {
  let childrenDialoRef = ref("");
  function openchildrenDialog() {
    childrenDialoRef.value.dialog.handleOpen();
  }
  return reactive({
    childrenDialoRef,
    openchildrenDialog,
  });
}
/*唤起给客户报价dialog*/
function offerDialogs() {
  let offerDialogRef = ref("");
  function openOfferDialog(Id) {
    offerDialogRef.value.dialog.handleOpen(Id);
  }
  return reactive({
    offerDialogRef,
    openOfferDialog,
  });
}
const drawer = drawers();
/*唤起最低报价dialog*/
function lowestPriceDialogs() {
  let lowestPriceDialogRef = ref("");
  async function openLowestPriceDialog(drawer) {
    let detailData = drawer.detailData;
    if (
      !detailData.Count20GP &&
      detailData.Count40GP &&
      detailData.Count40HQ &&
      drawer.tzxType
    ) {
      return ElMessage.warning("请输入箱子数量");
    }
    let form = {
      FRRateInfoId: detailData.Info.Id,
      Count20GP: detailData.Count20GP,
      Count40GP: detailData.Count40GP,
      Count40HQ: detailData.Count40HQ,
      Count45HQ: detailData.Count45HQ,
      Count40NOR: detailData.Count40NOR,
      CountTzx20RF: drawer.tzxType == "20RF" ? 1 : "",
      CountTzx40RF: drawer.tzxType == "40RF" ? 1 : "",
      CountTzx40NOR: drawer.tzxType == "40NOR" ? 1 : "",
      CountTzx45HQ: drawer.tzxType == "45HQ" ? 1 : "",
      CargoType: detailData.CargoType,
      DeliveryDate: detailData.DeliveryDate,
    };
    let res = await request.post("/api/FRInquireCustomer/CreateInquire", form);
    if (res.Status) {
      lowestPriceDialogRef.value.dialog.handleOpen(detailData, res.Data);
    } else {
      ElMessage.warning(res.Message);
    }
  }
  return reactive({
    lowestPriceDialogRef,
    openLowestPriceDialog,
  });
}

/*唤起&关闭抽屉*/
function drawers(drawerBottom) {
  let drawer = ref(false);
  /* 询价ID */
  const inquireInfoId = ref(null);
  const loading = ref(false);
  const tzxType = ref();
  const weekCn = reactive(["周一", "周二", "周三", "周四", "周五", "周六", "周日"]);
  /* 注意事项条数 */
  const remarkNum = ref(0);
  const countFeeList = ref([]);
  const countLocFeeList = ref([]);
  const feeSumUSD = ref(0);
  const feeSumCNY = ref(0);
  const locFeeSumUSD = ref(0);
  const locFeeSumCNY = ref(0);
  const drawerBottomHeight = ref(0);
  //type:1运价详情  type:2询价详情
  async function openDrawer(Id, type) {
    drawer.value = true;
    inquireInfoId.value = Id;
    await getDetail(type);
    setTimeout(() => {
      drawerBottomHeight.value = drawerBottom.value.offsetHeight;
    }, 300);
  }

  function closeDrawer() {
    drawer.value = false;
  }

  function closed() {
    inquireInfoId.value = null;
  }

  const detailData = ref({});
  const timeCountDown = useTimeCountDown();
  //InfoType:1 运价详情  type:2 询价详情
  const InfoType = ref(null);
  async function initLastTime() {
    const time = detailData.value.CreateTime;
    let nowTime = await request.get("/api/System/GetSystemDate");
    nowTime = nowTime.replace(/\//g, "-");
    let lastTime = timeCountDown.startByCreateTime(time, 30 * 60, nowTime);
    detailData.value.lastTime = lastTime;
  }
  async function getDetail(type) {
    loading.value = true;
    //type:1运价详情  type:2询价详情
    let res;
    InfoType.value = type;
    countFeeList.value = [];
    countLocFeeList.value = [];
    locFeeSumUSD.value = 0;
    locFeeSumCNY.value = 0;
    remarkNum.value = 0;
    if (type == 1) {
      res = await request.get("/api/FRInquireCustomer/GetRateInfo", {
        rateId: inquireInfoId.value,
      });
    } else if (type == 2 || type == 3) {
      res = await request.get("/api/FRInquireCustomer/GetInquireInfo", {
        inquireInfoId: inquireInfoId.value,
      });
    }
    //计算其他注意事项条数
    res.Data.Info.WeightRemark ? remarkNum.value++ : "";
    res.Data.Info.BillRemark ? remarkNum.value++ : "";
    res.Data.Info.OtherRemark ? remarkNum.value++ : "";
    res.Data.Info.DestRemark ? remarkNum.value++ : "";
    res.Data.Info.InRemark ? remarkNum.value++ : "";
    res.Data.Info.WharfRemark ? remarkNum.value++ : "";
    res.Data.Info.NetoRemark ? remarkNum.value++ : "";
    res.Data.Info.SWRemark ? remarkNum.value++ : "";

    detailData.value = res.Data;
    if (type == 1) {
      detailData.value.CargoType = "普货";
    }

    detailData.value.DeliveryDate = dayjs().format("YYYY-MM-DD");
    initLastTime();
    countChange();
    loading.value = false;
  }
  const sumFreightUSD = ref(0);
  const sumFreightCNY = ref(0);
  const sumLowFreightUSD = ref(0);
  async function countChange() {
    loading.value = true;
    let res;
    if (InfoType.value == 1) {
      res = await request.get("/api/FRInquireCustomer/GetRateInfo", {
        rateId: inquireInfoId.value,
        Count20GP: detailData.value.Count20GP,
        Count40GP: detailData.value.Count40GP,
        Count40HQ: detailData.value.Count40HQ,
        Count45HQ: detailData.value.Count45HQ,
        Count40NOR: detailData.value.Count40NOR,
      });
    } else if (InfoType.value == 2 || InfoType.value == 3) {
      res = await request.get("/api/FRInquireCustomer/GetInquireInfo", {
        inquireInfoId: inquireInfoId.value,
        Count20GP: detailData.value.Count20GP,
        Count40GP: detailData.value.Count40GP,
        Count40HQ: detailData.value.Count40HQ,
        Count45HQ: detailData.value.Count45HQ,
        Count40NOR: detailData.value.Count40NOR,
      });
    }
    detailData.value.Info = res.Data.Info;
    detailData.value.YgTotalAmountUSD = res.Data.YgTotalAmountUSD;
    detailData.value.YgTotalAmountCNY = res.Data.YgTotalAmountCNY;
    detailData.value.ZdTotalAmountUSD = res.Data.ZdTotalAmountUSD;
    detailData.value.ZdTotalAmountCNY = res.Data.ZdTotalAmountCNY;

    if(detailData.value.IsShow == false){
      sumFreightUSD.value =
      detailData.value.Info.OutPrice20GP * detailData.value.Count20GP +
      detailData.value.Count40GP * detailData.value.Info.OutPrice40GP +
      detailData.value.Count40HQ * detailData.value.Info.OutPrice40HQ +
       detailData.value.CountTzx20RF * detailData.value.Info.TzxPrice20RF +
      detailData.value.CountTzx40NOR * detailData.value.Info.TzxPrice40NOR +
      detailData.value.CountTzx40RF * detailData.value.Info.TzxPrice40RF +
      detailData.value.CountTzx45HQ * detailData.value.Info.TzxPrice45HQ;
    }else{
      sumFreightUSD.value =
      detailData.value.Price20GP * detailData.value.Count20GP +
      detailData.value.Count40GP * detailData.value.Price40GP +
      detailData.value.Count40HQ * detailData.value.Price40HQ +
       detailData.value.CountTzx20RF * detailData.value.PriceTzx20RF +
      detailData.value.CountTzx40NOR * detailData.value.PriceTzx40NOR +
      detailData.value.CountTzx40RF * detailData.value.PriceTzx40RF +
      detailData.value.CountTzx45HQ * detailData.value.PriceTzx45HQ;
    }

    sumLowFreightUSD.value =
      detailData.value.Count20GP * detailData.value.Price20GP +
      detailData.value.Count40GP * detailData.value.Price40GP +
      detailData.value.Count40HQ * detailData.value.Price40HQ +
      detailData.value.CountTzx20RF * detailData.value.PriceTzx20RF +
      detailData.value.CountTzx40NOR * detailData.value.PriceTzx40NOR +
      detailData.value.CountTzx40RF * detailData.value.PriceTzx40RF +
      detailData.value.CountTzx45HQ * detailData.value.PriceTzx45HQ;

    // sumFreightCNY.value =
    //   detailData.value.CountTzx20RF * detailData.value.Info.TzxPrice20RF +
    //   detailData.value.CountTzx40NOR * detailData.value.Info.TzxPrice40NOR +
    //   detailData.value.CountTzx40RF * detailData.value.Info.TzxPrice40RF +
    //   detailData.value.CountTzx45HQ * detailData.value.Info.TzxPrice45HQ;
    countFeeDetail();
    countLocFeeDetail();
    loading.value = false;
  }
  //计算海运附加费
  function countFeeDetail() {
    let countFeeListTem = [];

    let sumUSD = 0;
    let sumCNY = 0;
    detailData.value.FeeDetail.forEach((element) => {
      let countFeeItem = {
        feeName: "",
        fee: "",
      };

      if (element.CountWay == 0) {
        let feeName = `${element.FeeCodeName} 单票`;
        let fee = `${element.CurCode} ${element.OnePrice} x 1`;
        countFeeItem = { feeName, fee };
        countFeeListTem.push(countFeeItem);
        element.CurCode == "USD"
          ? (sumUSD = sumUSD + element.OnePrice)
          : (sumCNY = sumCNY + element.OnePrice);
        return;
      }
      if (detailData.value.Count20GP && element.Price20GP) {
        let feeName = `${element.FeeCodeName} 20GP x ${detailData.value.Count20GP}`;
        let fee = `${element.CurCode} ${element.Price20GP} x ${detailData.value.Count20GP}`;
        countFeeItem = {
          feeName,
          fee,
        };
        let eleSum = element.Price20GP * detailData.value.Count20GP;
        element.CurCode == "USD"
          ? (sumUSD = sumUSD + eleSum)
          : (sumCNY = sumCNY + eleSum);
        countFeeListTem.push(countFeeItem);
      }
      if (detailData.value.Count40GP && element.Price40GP) {
        let feeName = `${element.FeeCodeName} 40GP x ${detailData.value.Count40GP}`;
        let fee = `${element.CurCode} ${element.Price40GP} x ${detailData.value.Count40GP}`;
        countFeeItem = {
          feeName,
          fee,
        };
        let eleSum = element.Price40GP * detailData.value.Count40GP;
        element.CurCode == "USD"
          ? (sumUSD = sumUSD + eleSum)
          : (sumCNY = sumCNY + eleSum);
        countFeeListTem.push(countFeeItem);
      }
      if (detailData.value.Count40HQ && element.Price40HQ) {
        let feeName = `${element.FeeCodeName} 40HQ x ${detailData.value.Count40HQ}`;
        let fee = `${element.CurCode} ${element.Price40HQ} x ${detailData.value.Count40HQ}`;
        countFeeItem = {
          feeName,
          fee,
        };
        let eleSum = element.Price40HQ * detailData.value.Count40HQ;
        element.CurCode == "USD"
          ? (sumUSD = sumUSD + eleSum)
          : (sumCNY = sumCNY + eleSum);
        countFeeListTem.push(countFeeItem);
      }
      if (detailData.value.Count45HQ && element.Price45HQ) {
        let feeName = `${element.FeeCodeName} 45HQ x ${detailData.value.Count45HQ}`;
        let fee = `${element.CurCode} ${element.Price45HQ} x ${detailData.value.Count45HQ}`;
        countFeeItem = {
          feeName,
          fee,
        };
        let eleSum = element.Price45HQ * detailData.value.Count45HQ;
        element.CurCode == "USD"
          ? (sumUSD = sumUSD + eleSum)
          : (sumCNY = sumCNY + eleSum);
        countFeeListTem.push(countFeeItem);
      }
      if (detailData.value.Count40NOR && element.Price40NOR) {
        let feeName = `${element.FeeCodeName} 40NOR x ${detailData.value.Count40NOR}`;
        let fee = `${element.CurCode} ${element.Price40NOR} x ${detailData.value.Count40NOR}`;
        countFeeItem = {
          feeName,
          fee,
        };
        let eleSum = element.Price40NOR * detailData.value.Count40NOR;
        element.CurCode == "USD"
          ? (sumUSD = sumUSD + eleSum)
          : (sumCNY = sumCNY + eleSum);
        countFeeListTem.push(countFeeItem);
      }
    });
    feeSumUSD.value = sumUSD;
    feeSumCNY.value = sumCNY;
    countFeeList.value = countFeeListTem;
  }
  //计算本地附加费
  function countLocFeeDetail() {
    let countFeeListTem = [];
    let sumCNY = 0;
    let detailInfo = detailData.value.Info;
    if (detailInfo.FilePrice) {
      countFeeListTem.push({
        feeName: "单票",
        fee: `CNY ${detailInfo.FilePrice} x 1`,
      });
      sumCNY = sumCNY + detailInfo.FilePrice;
    }
    if (detailInfo.XdPrice1 && detailData.value.Count20GP) {
      countFeeListTem.push({
        feeName: `箱单费 小柜20GP x ${detailData.value.Count20GP}`,
        fee: `CNY ${detailInfo.XdPrice1} x ${detailData.value.Count20GP}`,
      });
      sumCNY = sumCNY + detailInfo.XdPrice1 * detailData.value.Count20GP;
    }
    if (detailInfo.XdPrice1 && detailData.value.Count40GP) {
      countFeeListTem.push({
        feeName: `箱单费 小柜40GP x ${detailData.value.Count40GP}`,
        fee: `CNY ${detailInfo.XdPrice1} x ${detailData.value.Count40GP}`,
      });
      sumCNY = sumCNY + detailInfo.XdPrice1 * detailData.value.Count40GP;
    }
    if (detailInfo.XdPrice2 && detailData.value.Count40HQ) {
      countFeeListTem.push({
        feeName: `箱单费 高柜 x ${detailData.value.Count40HQ}`,
        fee: `CNY ${detailInfo.XdPrice2} x ${detailData.value.Count40HQ}`,
      });
      sumCNY = sumCNY + detailInfo.XdPrice2 * detailData.value.Count40HQ;
    }
    if (detailInfo.THCPrice20GP && detailData.value.Count20GP) {
      countFeeListTem.push({
        feeName: `THC 20GP x  ${detailData.value.Count20GP}`,
        fee: `CNY ${detailInfo.THCPrice20GP} x ${detailData.value.Count20GP}`,
      });
      sumCNY = sumCNY + detailInfo.THCPrice20GP * detailData.value.Count20GP;
    }
    if (detailInfo.THCPrice40GP && detailData.value.Count40GP) {
      countFeeListTem.push({
        feeName: `THC 40GP x  ${detailData.value.Count40GP}`,
        fee: `CNY ${detailInfo.THCPrice40GP} x ${detailData.value.Count40GP}`,
      });
      sumCNY = sumCNY + detailInfo.THCPrice40GP * detailData.value.Count40GP;
    }
    if (detailInfo.THCPrice40GP && detailData.value.Count40HQ) {
      countFeeListTem.push({
        feeName: `THC 40HQ x  ${detailData.value.Count40HQ}`,
        fee: `CNY ${detailInfo.THCPrice40GP} x ${detailData.value.Count40HQ}`,
      });
      sumCNY = sumCNY + detailInfo.THCPrice40GP * detailData.value.Count40HQ;
    }
    if (detailInfo.THCPrice45HQ && detailData.value.CountTzx45HQ) {
      countFeeListTem.push({
        feeName: `THC 45HQ x  ${detailData.value.CountTzx45HQ}`,
        fee: `CNY ${detailInfo.THCPrice45HQ} x ${detailData.value.CountTzx45HQ}`,
      });
      sumCNY = sumCNY + detailInfo.THCPrice45HQ * detailData.value.CountTzx45HQ;
    }
    if (detailInfo.THCPrice45NOR && detailData.value.CountTzx40NOR) {
      countFeeListTem.push({
        feeName: `THC 40NOR x  ${detailData.value.CountTzx40NOR}`,
        fee: `CNY ${detailInfo.THCPrice45NOR} x ${detailData.value.CountTzx40NOR}`,
      });
      sumCNY = sumCNY + detailInfo.THCPrice45NOR * detailData.value.CountTzx40NOR;
    }
    if (detailInfo.THCPrice20RF && detailData.value.CountTzx20RF) {
      countFeeListTem.push({
        feeName: `THC 20RF x  ${detailData.value.CountTzx20RF}`,
        fee: `CNY ${detailInfo.THCPrice20RF} x ${detailData.value.CountTzx20RF}`,
      });
      sumCNY = sumCNY + detailInfo.THCPrice20RF * detailData.value.CountTzx20RF;
    }
    if (detailInfo.THCPrice45RF && detailData.value.CountTzx40RF) {
      countFeeListTem.push({
        feeName: `THC 40RF x  ${detailData.value.CountTzx40RF}`,
        fee: `CNY ${detailInfo.THCPrice45RF} x ${detailData.value.CountTzx40RF}`,
      });
      sumCNY = sumCNY + detailInfo.THCPrice45RF * detailData.value.CountTzx40RF;
    }

    locFeeSumCNY.value = sumCNY;
    countLocFeeList.value = countFeeListTem;
  }
  return reactive({
    tzxType,
    drawer,
    weekCn,
    remarkNum,
    countFeeList,
    countLocFeeList,
    feeSumUSD,
    feeSumCNY,
    locFeeSumUSD,
    locFeeSumCNY,
    loading,
    detailData,
    InfoType,
    closed,
    openDrawer,
    closeDrawer,
    countChange,
    getDetail,
    sumFreightUSD,
    sumFreightCNY,
    sumLowFreightUSD,
    drawerBottomHeight,
  });
}

/*计数器相关*/
function numbers() {
  let initNumber = reactive({
    gp20: 1,
    gp40: 2,
    hq40: 3,
    hq45: 4,
    nor45: 5,
  });
  return reactive({
    initNumber,
  });
}

export default defineComponent({
  name: "inquiryPriceDrawer",
  components: {
    InfoFilled,
    inquiryPriceDialog,
    offerPriceDialog,
    lowestPriceDialog,
    Check,
  },
  props: {
    id: "",
  },
  setup(props, ctx) {
    const drawerBottom = ref(null);
    const drawer = drawers(drawerBottom);
    const collapse = collapses();
    const table = tables();
    const childrenDialog = childrenDialogs();
    const offerDialog = offerDialogs();
    const lowestPriceDialog = lowestPriceDialogs();
    const number = numbers();
    onMounted(async () => {});
    return {
      drawer,
      collapse,
      number,
      table,
      childrenDialog,
      offerDialog,
      lowestPriceDialog,
      drawerBottom,
    };
  },
});
</script>

<style scoped lang="scss">
.drawer-scroll-container {
}
.drawer {
  width: 1200px;
}
.drawer-container-scroll {
  background: #f9fafb;
  min-width:280px;
}
.drawer-container {
  // overflow: auto;
  // height:calc(100vh - 40px);
  width: 100%;
  display: flex;
  box-sizing: border-box;
  .left {
    width: 800px;
    padding: 16px;
    box-sizing: border-box;
    .title {
      width: 100%;
      background: #fff8f2;
      border-radius: 4px;
      height: 35px;
      box-shadow: 0 2px 0 0 #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      box-sizing: border-box;
      .warn {
        display: flex;
        align-items: center;
        :nth-child(1) {
          color: #ff7d14;
        }
        :nth-child(2) {
          color: #ff7d14;
          margin-left: 5px;
        }
        :nth-child(3) {
          font-size: 12px;
          color: #969799;
          letter-spacing: -1.03px;
          font-weight: 500;
        }
      }
      .all {
        font-size: 10px;
        color: #409eff;
        letter-spacing: -0.86px;
      }
    }
    .price {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #3c4144;
      font-weight: 500;
      div {
        width: 144px;
        display: flex;
        :nth-child(1) {
          width: 36px;
          font-weight: 700;
          white-space: nowrap;
        }
        :nth-child(2) {
          width: auto;
          font-weight: 700;
        }
        :nth-child(3) {
          width: auto;
        }
      }
    }
    .from {
      width: 100%;
      margin-top: 24px;
      :nth-child(1) {
        font-size: 14px;
      }
      :nth-child(2) {
        width: 100%;
        margin-top: 8px;
      }
    }
  }
  .right {
    width: 100%;
    background: #f9fafb;
    padding-right: 5px;
    .port {
      // width: calc(100% - 20px);
      box-sizing: border-box;
      width: 100%;
      padding: 20px;
      .title {
        text-align: center;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
      }
      .title2 {
        font-size: 12px;
        color: #8fa4b2;
        text-align: center;
        margin-top: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .city {
        display: flex;
        justify-content: space-around;
        margin-top: 24px;
        font-size: 14px;
        color: #3c4144;
        font-weight: 500;
        .bar {
          width: 33%;
        }
        .podPort {
          text-align: center;
          font-size: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .name {
          width: 33%;
          div {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            height: 25px;
            line-height: 25px;
            padding: 0 10px;
          }
        }
      }
      .cost {
        width: 100%;
        margin-top: 28px;
        box-sizing: border-box;
        padding: 0 0 24px 0;
        border-top: 1px solid #e4e7ed;
        border-bottom: 1px solid #e4e7ed;
      }
      .consult-info {
        display: flex;
        margin-top: 10px;
        justify-content: space-between;
        .consult-info-cargo {
          width: 80px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: inline-block;
        }
        img {
          margin-right: 3px;
        }
        div {
          display: flex;
          align-items: center;
          margin-right: 4px;
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }
}
.collapse {
  margin-top: 8px;
  padding-left: 8px;
  background: #e6f7ff;
  box-shadow: 0 2px 4px 0 #dee4e7;
  border-radius: 4px;
}
::v-deep .collapse .el-icon-arrow-right:before {
  content: "查看全部";
  color: #409eff;
}
// ::v-deep .collapse .el-collapse-item__arrow.is-active {
//   transform: none;
// }
// ::v-deep .collapse .el-collapse-item__arrow.is-active:before {
//   content: "收起";
//   font-size: 12px;
//   color: #409eff;
// }
::v-deep .collapse .el-collapse-item__content {
  padding-bottom: 10px;
}
::v-deep .collapse .el-collapse-item__wrap {
  border: none;
  background: #e6f7ff;
  padding-left: 18px;
}
::v-deep .collapse .el-collapse-item__header {
  border: none;
  background: #e6f7ff;
}
.special-collapse {
  padding-left: 8px;
  background: #fff8f2 !important;
  box-shadow: 0 2px 4px 0 #dee4e7;
  border-radius: 4px;
}
::v-deep .special-collapse .el-collapse-item__content {
  padding-bottom: 10px;
}
::v-deep .special-collapse .el-collapse-item__content {
  padding-bottom: 10px;
}
::v-deep .special-collapse .el-collapse-item__wrap {
  border: none;
  background: #fff8f2;
  padding-left: 95px;
  // box-shadow: 0 2px 0 0 #f0f0f0;
}
::v-deep .special-collapse .el-collapse-item__header {
  border: none;
  height: 36px;
  background: #fff8f2;
}
.hidden-title {
  color: #969799;
  display: inline-block;
  width: calc(100% - 156px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.collapse-item {
  display: flex;
  align-items: baseline;

  .yq {
    color: #409eff;
    white-space: nowrap;
  }
  .hz {
    font-size: 12px;
    color: #969799;
    margin-top: 2px;
    padding-right: 8px;
    white-space: normal;
    word-break: break-all;
  }
}
.predict {
  display: flex;
  align-items: center;
  margin-top: 24px;
  height: 20px;
  font-size: 12px;
  .cargo-type {
    width: 110px;
    span {
      font-weight: bold;
    }
  }

  .delivery-date {
    width: 150px;
    span {
      font-weight: bold;
    }
  }
  .blue-text-btn {
    cursor: pointer;
    color: #409eff !important;
    font-size: 12px;
  }
  .oringe-text-btn {
    cursor: pointer;
    color: #ff7d14 !important;
    font-size: 12px;
  }
  div {
    margin-right: 10px;
  }
}
.alert {
  margin-top: 8px;
}
::v-deep .alert .el-alert--info.is-light {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #409eff;
}
::v-deep .alert .el-alert__title {
  font-size: 12px;
  color: #606266;
}
.cargo-type-select {
  position: absolute;
  width: 150px !important;
  left: 95px;
  opacity: 0;
  z-index: 10;
}
.input-number {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  div {
    display: flex;
    align-items: center;
    :nth-child(1) {
      margin-right: 5px;
      font-size: 14px;
      color: #303133;
      font-weight: 500;
    }
  }
}
::v-deep .input-number .el-input--small {
  height: 25px;
  line-height: 26px;
}
::v-deep .input-number .el-input-number--small {
  width: 90px;
  height: 25px;
  line-height: 23px;
}
::v-deep .input-number .el-input-number--small .el-input-number__increase {
  width: 25px;
  height: 24px;
}
::v-deep .input-number .el-input-number--small .el-input-number__decrease {
  width: 25px;
  height: 24px;
}
::v-deep .input-number .el-input--small .el-input__inner {
  height: 26px;
  padding-left: 30px;
  padding-right: 30px;
}
::v-deep .from .el-table th.el-table__cell {
  background: #e9eff6;
  color: #999999;
  font-size: 14px;
}
.from-color {
  font-size: 14px;
  color: #3c4144;
}
.fontweight {
  font-weight: 700;
}
.plugin-icon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  div:nth-child(1) {
    width: 7px;
    height: 7px;
    border: 1px solid #fd953e; /*var(--freight-layout-primary-color)*/
    border-radius: 50%;
  }
  div:nth-child(2) {
    height: 0;
    border: 1px solid #fd953e;
    width: 75%;
  }
  div:nth-child(3) {
    width: 7px;
    height: 7px;
    border: 1px solid #fd953e; /*var(--freight-layout-primary-color)*/
    border-radius: 50%;
  }
}
.cost-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
::v-deep .cost .el-collapse {
  border-top: none;
  border-bottom: none;
}
::v-deep .cost .el-collapse-item__header {
  background-color: #f9fafb;
  border-bottom: none;
}
::v-deep .cost .el-collapse-item__content {
  background-color: #f9fafb;
  padding-bottom: 8px;
}
::v-deep .cost .el-collapse-item__wrap {
  border-bottom: none;
}
.cost-body {
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-left: 3px solid #b4c4d6;
  padding-left: 8px;
  box-sizing: border-box;
  .line-through {
    text-decoration: line-through;
    font-size: 12px !important;
    opacity: 0.8;
    color: #606266 !important;
    margin-right: 4px;
  }
  .new-price {
    color: #ef4333 !important;
    margin-right: 4px;
  }
  div:nth-child(1) {
    font-size: 12px;
    color: #8ba0b0;
  }
  div:nth-child(2) {
    font-size: 14px;
    color: #aaafb3;
    span {
      font-size: 14px;
      color: #8ba0b0;
    }
  }
}
.title-item {
  font-size: 14px;
  color: #606266;
}
.title-item2 {
  font-size: 14px;
  color: #3c4144;
  font-weight: 700;
  .low-price-sum {
    color: #ef4333;
    margin-right: 4px;
  }
  .before-price-sum {
    text-decoration: line-through;
    font-size: 12px !important;
    opacity: 0.8;
    color: #606266 !important;
    font-weight: 400;
  }
}
.sum-price {
  border-bottom: 1px solid #e4e7ed;
  width: 100%;
  padding: 18px 0;
  div {
    text-align: end;
    padding: 6px 0;
    align-items: baseline;
    white-space: nowrap;
    .items1 {
      font-size: 14px;
      color: #606266;
      font-weight: 500;
    }

    .items2 {
      font-size: 14px;
      color: #606266;
      font-weight: 700;
    }
    .items3 {
      font-size: 24px;
      color: #606266;
      font-weight: 700;
    }
  }
  .text-red {
    span {
      color: #ef4333;
    }
  }
}
.consult-price {
  width: 100%;
  padding: 12px 0 12px 0;
  border-bottom: 1px solid #e4e7ed;
  .company {
    margin-top: 8px;
    font-size: 14px;
    color: #8ba0b0;
    font-weight: 500;
    div {
      display: flex;
    }
  }
}
.alert-title {
  letter-spacing: -1px;
  font-size: 12px;
  color: #606266;
}

::v-deep .price-alert .el-alert {
  padding: 5px 0 5px 5px;
  border: 1px solid #ef4333;
  background-color: #fef0f0;
}
::v-deep .reload-alert .el-alert {
  border: 1px solid #f4b88d;
}
::v-deep .reload-alert .el-alert {
  background-color: #fff8f2;
}
::v-deep .price-alert .el-alert__content {
  padding: 0 0 0 5px;
}
::v-deep .price-alert .el-alert__icon {
  color: #ef4333;
}
.reload-alert {
  margin-top: 8px;
}
.alert-title2 {
  color: #ff7d14;
}
::v-deep .reload-alert .el-alert__icon {
  color: #ff7d14;
}
::v-deep .reload-alert .el-alert__icon {
  color: #ff7d14;
}
.query-price {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  div {
    margin: 0 10px;
    border-radius: 2px;
    width: 140px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid #e4e7ed;
    &.primary {
      background: #fd953e;
      color: #ffffff;
    }
    &.red-btn {
      background: #ef4333;
      color: #ffffff;
    }
    img {
      margin-right: 5px;
    }
  }
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 16px;
  color: #3c4144;
  cursor: pointer;
}
.ship-logo {
  width: 70px;
}
.text-red-price {
  color: #ef4333;
  font-size: 13px;
  font-weight: bold;
  margin-left: 6px;
}
.sum-fs-14 {
  opacity: 0.65;
  .items3 {
    font-size: 14px !important;
  }
}
.text-through-line {
  text-decoration: line-through;
}
::v-deep .cargo-select-dropdown {
  background: #303133;
}
:deep(.el-drawer__body) {
  background: #f2f3f5;
  padding: 0;
}
.drawer-card {
  padding: 16px;
  background-image: linear-gradient(180deg, #f6fbff 0%, #ffffff 32%, #ffffff 100%);
  border: 1px solid #f2f3f5;
  box-shadow: 0 2px 4px 0 #dee4e7;
  border-radius: 6px;
  margin-top: 8px;
  display: flex;
  .drawer-card-left {
    width: 230px;
    img {
      width: 100%;
    }
    .drawer-card-title {
      font-size: 20px;
      color: rgba(250, 100, 0, 0.8);
      letter-spacing: -0.9px;
      line-height: 24px;
      font-weight: 500;
      margin-top: 8px;
      margin-bottom: 50px;
    }
  }

  .drawer-card-right {
    width: 495px;
    .drawer-card-info {
      width: 100%;
      margin-top: 8px;
      background: #ffffff;
      box-shadow: 0 2px 8px 0 #f1f1f1;
      border-radius: 4px;
      padding: 8px;
      height: 146px;
      .drawer-card-cargo-title {
        font-size: 14px;
        color: #3c4144;
        letter-spacing: -0.63px;
        font-weight: 500;
        margin-bottom: 8px;
      }
      .drawer-card-form-item {
        display: flex;
        line-height: 28px;
        padding-left: 34px;
        margin-bottom: 14px;
        position: relative;
        .item-title {
          font-size: 12px;
          color: #969799;
        }
        .item-content {
          margin-left: 12px;
          width: 354px;
          font-size: 14px;
          color: #ff7d14;
          letter-spacing: -0.7px;
          font-weight: 500;
          border-bottom: 1px solid #e4e7ed;
        }
        .item-cargo-type {
        }
      }
    }
    .drawer-card-cargo {
      width: 100%;
      margin-top: 8px;
      background: #ffffff;
      box-shadow: 0 2px 8px 0 #f1f1f1;
      border-radius: 4px;
      padding: 8px;
      height: 256px;

      .drawer-card-cargo-title {
        font-size: 14px;
        color: #3c4144;
        letter-spacing: -0.63px;
        font-weight: 500;
        margin-bottom: 8px;
      }
      .drawer-card-cargo-describe {
        font-size: 12px;
        color: #969799;
        letter-spacing: -0.54px;
        line-height: 17px;
        font-weight: 400;
        margin-bottom: 16px;
        .select-text {
          color: #ff7d14;
          margin-right: 4px;
        }
      }
      .cargo-item {
        border-radius: 4px;
        border: 1px solid #dde4ed;
        padding: 8px;
        position: relative;
        overflow: hidden;
        height: 90px;
        .cargo-single-price {
          font-size: 12px;
          color: #ff7d14;
          font-weight: 500;
          margin-bottom: 8px;
        }
        :deep(.el-input--mini .el-input__inner) {
          height: 24px;
          line-height: 22px;
        }
        :deep(.el-input-number__increase) {
          width: 22px;
          top: 3px;
          line-height: 22px;
        }
        :deep(.el-input-number__decrease) {
          width: 22px;
          top: 3px;
          line-height: 22px;
        }
        :deep(.el-input-number--mini) {
          line-height: 24px;
        }
        .active-tag {
          // background:#ff7d14 ;

          position: absolute;
          right: 0;
          bottom: 0;
          border-bottom: 20px solid #ff7d14;
          border-left: 20px solid transparent;
          width: 0;
        }
        .active-icon {
          position: absolute;
          right: -1px;
          bottom: -1px;
        }
        .input-number {
          width: 80px;
          margin-bottom: 12px;
        }
      }
      .active {
        border: 1px solid #ff7d14;
      }
    }
    .mgl-8 {
      margin-left: 8px;
    }
    .mgt-8 {
      margin-top: 8px;
    }
  }
}
.freight-collapse {
  position: relative;
  :deep(.el-collapse-item__arrow) {
    font-size: 16px;
    position: absolute;
    left: 76px;
    top: 16px;
    color: #ff9540;
  }
}
.feeDetail-collapse {
  position: relative;
  :deep(.el-collapse-item__arrow) {
    font-size: 16px;
    position: absolute;
    left: 74px;
    top: 16px;
    color: #ff9540;
  }
}
.locFeeDetail-collapse {
  position: relative;
  :deep(.el-collapse-item__arrow) {
    font-size: 16px;
    position: absolute;
    left: 60px;
    top: 16px;
    color: #ff9540;
  }
}
.price-and {
  margin: 0 8px;
}
</style>
<style lang="scss">
.freight-select-dropdown .selected {
  color: #ff7d14;
}
.drawe-alert {
  &.el-alert {
    padding-left: 6px;
  }
  .el-alert__content {
    padding: 0 4px;
  }
}
.pad-bottom {
  padding: 0 20px 20px 20px;
  background: #f9fafb;
  min-width: 280px;
}
.dpqr-true{
  display: inline-block;
  font-size: 14px;
  color: #98999B;
  background: #F2F3F5;
  padding: 4px;
  border-radius: 3px;
}
</style>
