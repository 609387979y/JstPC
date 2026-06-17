<template>
  <div class="freight-list-container" style="
      border: 1px solid #dcdfe6;
      padding: 0 8px;
      background-color: #ffffff;
    " v-loading="tableOption.loading">
    <AppVxeTable :rowId="'Id'" ref="freightListRef" :tableHeaderKey="'customerfreightSearchTable'" :toolbarConfig="true"
      class="vex-table-primary freight-table" :tableData="tableData" :tableOption="tableOption"
      @getTableList="sortTable(false)" v-if="constTableData.length" :tableHeight="'1000'">
      <template #leftBtnGroup>
        <div class="freight-search">
          <div class="freight-search-item">
            <div class="search-item-label">航线代码</div>
            <div class="search-item-content">
              <el-input placeholder="航线代码" v-model="secondSearch.LineCode"></el-input>
            </div>
          </div>
          <div class="freight-search-item">
            <div class="search-item-label">截关/开航</div>
            <div class="search-item-content">
              <el-select clearable v-model="secondSearch.CSTDate">
                <el-option v-for="item in weekCn" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <el-select clearable v-model="secondSearch.ETDDate" style="margin-left: 4px">
                <el-option v-for="item in weekCn" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="freight-search-item">
            <div class="search-item-label">中转/直达</div>
            <div class="search-item-content">
              <el-select @click="() => {
                LineType != 1 ? (secondSearch.PodPortId = '') : undefined;
              }
              " v-model="secondSearch.LineType">
                <el-option label="不限" :value="-1"></el-option>
                <el-option label="直达" :value="0"></el-option>
                <el-option label="中转" :value="1"></el-option>
              </el-select>
              <el-select v-model="secondSearch.PodPortId" style="margin-left: 4px" filterable clearable remote
                :remote-method="getPodPortList" placeholder="中转港" :disabled="secondSearch.LineType != 1">
                <el-option v-for="item in podPortList" :label="item.label" :value="item.CnPortName"></el-option>
              </el-select>
            </div>
          </div>
          <div class="freight-search-item">
            <div class="search-item-label">船公司</div>
            <div class="search-item-content">
              <!--   @change="sortTable()" -->
              <el-select class="second-query-inpt" v-model="secondSearch.ShippingCode" placeholder="船公司" clearable>
                <el-option v-for="item in shipList" :label="item" :value="item"></el-option>
              </el-select>
            </div>
          </div>
          <div class="search-btn" @click="sortTable()">筛选</div>
          <div class="search-btn default" @click="clear()">清空</div>
        </div>
      </template>
      <template #rightBtnGroup>
        <!-- <el-button icon="el-icon-refresh-right" class="left10 btn-mini-size" @click="getList()">刷新
        </el-button> -->
      </template>

      <vxe-column type="expand" title="更多" width="50">
        <template #default="{ row }">
          <span class="toggle-btn" @click="toggleExpand(row)">

            <el-icon class="toggle-icon" :class="row.expand ? 'expanded' : ''">
              <ArrowRight />
            </el-icon>

          </span>
        </template>
        <template #content="{ row, rowIndex }">
          <div class="row-expand-content" v-loading="row.loading">
            <el-tabs v-model="row.activeName" class="expend-tabs">
              <el-tab-pane label="海运附加费" name="hyf" v-if="row.feeDetailData?.length">
                <div class="tab-content">
                  <table class="fee-table" border="1">
                    <thead>
                      <tr>
                        <th>费用名称</th>
                        <th>费用明细</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in row.feeDetailData" :key="item.Id">
                        <td>{{ item.FeeCodeName }}</td>
                        <td>
                          {{ item.CurCode }}
                          <span v-if="item.CountWay == 1">
                            {{ item.Price20GP ? item.Price20GP : "--" }} /
                            {{ item.Price40GP ? item.Price40GP : "--" }} /
                            {{ item.Price40HQ ? item.Price40HQ : "--" }} /
                            {{ item.Price40NOR ? item.Price40NOR : "--" }} /
                            {{ item.Price45HQ ? item.Price45HQ : "--" }}
                          </span>
                          <span v-if="item.CountWay == 0">
                            单票 {{ item.OnePrice ? item.OnePrice : "--" }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </el-tab-pane>
              <el-tab-pane label="人民币附加费" name="rmb" v-if="row.rmbActive">
                <div class="tab-content">
                  <table class="fee-table" border="1">
                    <thead>
                      <tr>
                        <th>费用名称</th>
                        <th>费用明细</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="row.DcPrice20GP">
                        <td>订舱费20GP</td>
                        <td>{{ row.DcPrice20GP }}</td>
                      </tr>
                      <tr v-if="row.DcPrice40GP">
                        <td>订舱费40GP/HQ</td>
                        <td>{{ row.DcPrice40GP }}</td>
                      </tr>
                      <tr v-if="row.DcPrice45HQ">
                        <td>订舱费45HQ</td>
                        <td>{{ row.DcPrice45HQ }}</td>
                      </tr>
                      <tr v-if="row.YpPrice">
                        <td>预配发送费</td>
                        <td>{{ row.YpPrice }}</td>
                      </tr>
                      <tr v-if="row.DzxdPrice">
                        <td>电子装箱单费</td>
                        <td>{{ row.DzxdPrice }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </el-tab-pane>
              <el-tab-pane label="船期计划" name="SpecialRemark" v-if="row.SpecialRemark">
                <div class="tab-content">
                  {{ row.SpecialRemark }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="免用箱备注" name="BillRemark" v-if="row.BillRemark">
                <div class="tab-content">
                  {{ row.BillRemark }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="限重备注" name="WeightRemark" v-if="row.WeightRemark">
                <div class="tab-content">
                  {{ row.WeightRemark }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="目的港备注" name="DestRemark" v-if="row.DestRemark">
                <div class="tab-content">
                  {{ row.DestRemark }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="起运港备注" name="OtherRemark" v-if="row.OtherRemark">
                <div class="tab-content">
                  {{ row.OtherRemark }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="内部备注" name="InRemark" v-if="row.InRemark">
                <div class="tab-content">
                  {{ row.InRemark }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="挂靠码头备注" name="WharfRemark" v-if="row.WharfRemark">
                <div class="tab-content">
                  {{ row.WharfRemark }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="内托备注" name="NetoRemark" v-if="row.NetoRemark">
                <div class="tab-content">
                  {{ row.NetoRemark }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="SW/电放备注" name="SWRemark" v-if="row.SWRemark">
                <div class="tab-content">
                  {{ row.SWRemark }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="起运港免用箱备注" name="PolRemark" v-if="row.PolRemark">
                <div class="tab-content">
                  {{ row.PolRemark }}
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="UpdateTime" title="更新状态" sortable width="80" :resizable="true">
        <template #default="{ row }">
          <TimeTag v-if="row.isJETRate === true" custom customText="实时运价" customclassName="latest"
            :date="row.UpdateTime"></TimeTag>
          <TimeTag v-else :date="row.UpdateTime"></TimeTag>
        </template>
      </vxe-column>
      <vxe-column field="ShippingCode" title="船公司" sortable width="80" :resizable="true">
        <template #default="{ row }">
          {{ row.ShippingCode }}
          <!-- 船公司悬浮 -->
          <el-popover placement="right" trigger="hover">
            <template #reference>
              <img class="hover-img" src="@/assets/images/hover_img.png" />
            </template>
            <div class="FCL-hover">
              船司中文：{{ row.CnShippingName }}<br />
              船司英文：{{ row.EnShippingName }}
            </div>
          </el-popover>
        </template>
      </vxe-column>
      <vxe-column field="LineCode" title="航线" sortable width="60" :resizable="true" show-overflow>
        <template #default="{ row }">
          {{ row.LineCode }}
        </template>
      </vxe-column>
      <vxe-column field="DestEnPortName" title="目的港" sortable width="120" :resizable="true">
        <template #default="{ row }">
          <div class="mdg-block">
            <div class="mdg-text-hidden">{{ row.DestEnPortName }}</div>
            <!-- 目的港悬浮窗 -->
            <el-popover placement="right" trigger="hover">
              <template #reference>
                <img class="hover-img" src="@/assets/images/hover_img.png" style="position: relative; top: -3px" />
              </template>
              <div class="FCL-hover">
                中文名称：{{ row.DestCnPortName }}
                <br />

                英文名称：{{ row.DestEnPortName }}<br />

                所属国家：{{ row.DestPortCountry }}<br />

                所属航线：{{ row.LineName }}<br />

                航线明细：{{ row.LineDetailName }}<br />
              </div>
            </el-popover>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="LineName" title="所属航线" sortable width="80" :resizable="true" show-overflow>
        <template #default="{ row }">
          {{ row.LineName }}
        </template>
      </vxe-column>
      <vxe-column field="LineDetailName" title="所属细分" sortable width="80" :resizable="true" show-overflow>
        <template #default="{ row }">
          {{ row.LineDetailName ? row.LineDetailName : '无' }}
        </template>
      </vxe-column>
      <vxe-column field="PodEnPortName" title="中转" sortable width="80" :resizable="true" show-overflow>
        <template #default="{ row }">
          <span v-if="row.LineType == 0">直达</span>
          <span v-if="row.LineType == 1">{{ row.PodEnPortName }}</span>
        </template>
      </vxe-column>
      <vxe-column field="CnWharfName" sortable width="80" title="码头" :resizable="false">
        <template #default="{ row }">
          {{ row.CnWharfName }}
          <!-- 码头悬浮 -->
          <el-popover placement="right" trigger="hover">
            <template #reference>
              <img class="hover-img" src="@/assets/images/hover_img.png" />
            </template>
            <div class="FCL-hover">
              码头中文：{{ row.CnWharfName }}<br />
              码头英文：{{ row.EnWharfName }}
            </div>
          </el-popover>
        </template>
      </vxe-column>
      <vxe-column field="LineDay" sortable width="50" title="航程" :resizable="false">
        <template #default="{ row }">
          {{ row.LineDay ? row.LineDay + "天" : "-" }}
        </template>
      </vxe-column>
      <vxe-column field="CSTDate" title="截/开" sortable width="60" :resizable="false">
        <template #default="{ row }"> {{ row.CSTDate }}/{{ row.ETDDate }} </template>
      </vxe-column>
      <vxe-colgroup title="ALL-IN报价">
        <vxe-column width="200" title="ALL-IN报价">
          <template #header>
            <span class="price-head">20GP</span>
            <span class="price-head">40GP</span>
            <span class="price-head">40HQ</span>
          </template>
          <template #default="{ row }">
            <div>
              <span class="price-content">
                {{ row.AllOutPrice20GP ? row.AllOutPrice20GP : "- -" }}
              </span>
              <span class="price-content">
                {{ row.AllOutPrice40GP ? row.AllOutPrice40GP : "- -" }}
              </span>
              <span class="price-content">
                {{ row.AllOutPrice40HQ ? row.AllOutPrice40HQ : "- -" }}
              </span>
              <!-- <span class="price-content">
                  {{ scope.row.AllOutPrice45HQ ? scope.row.AllOutPrice45HQ : "- -" }}
                </span>
                <span class="price-content">
                  {{ scope.row.AllOutPrice40NOR ? scope.row.AllOutPrice40NOR : "- -" }}
                </span> -->
            </div>
          </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="申请幅度">
        <vxe-column width="200" title="申请幅度">
          <template #header>
            <span class="price-head">20GP</span>
            <span class="price-head">40GP</span>
            <span class="price-head">40HQ</span>
          </template>
          <template #default="{ row }">
            <!-- <div class="forbiden-freight" v-if="!row.AllInPriceVisiable">
              <div class="locked">幅度**</div>
              <div class="locked">幅度**</div>
              <div class="locked">幅度**</div>
            </div> -->
            <div class="discount-group">
              <div v-if="this.$store.state.auth.isUserAuth">
                <div class="discounts" v-if="row.Tag20GP">
                  <img src="@/assets/customWorkbench/green-arrow-down.svg" alt="" />
                  {{ row.Tag20GP }}
                </div>
                <div class="discounts-blank" v-else> </div>
              </div>
              <div class="discounts-blank" v-else @click="openUserAuth">
                <el-icon :size="16">
                  <View />
                </el-icon>
              </div>
              <div v-if="this.$store.state.auth.isUserAuth">
                <div class="discounts" v-if="row.Tag40GP">
                  <img src="@/assets/customWorkbench/green-arrow-down.svg" alt="" />
                  {{ row.Tag40GP }}
                </div>
                <div class="discounts-blank" v-else> </div>
              </div>
              <div class="discounts-blank" v-else @click="openUserAuth">
                <el-icon :size="16">
                  <View />
                </el-icon>
              </div>
              <div v-if="this.$store.state.auth.isUserAuth">
                <div class="discounts" v-if="row.Tag40HQ">
                  <img src="@/assets/customWorkbench/green-arrow-down.svg" alt="" />
                  {{ row.Tag40HQ }}
                </div>
                <div class="discounts-blank" v-else></div>
              </div>
              <div class="discounts-blank" v-else @click="openUserAuth">
                <el-icon :size="16">
                  <View />
                </el-icon>
              </div>
              <!-- <span class="price-content">
                  {{ scope.row.AllOutPrice45HQ ? scope.row.AllOutPrice45HQ : "- -" }}
                </span>
                <span class="price-content">
                  {{ scope.row.AllOutPrice40NOR ? scope.row.AllOutPrice40NOR : "- -" }}
                </span> -->
            </div>
          </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-column title="了解幅度" width="70">
        <template #default="{ row }">
          <!-- <div class="show-discount" v-if="!row.AllInPriceVisiable" @click="applyDiscount(row)">
            申请幅度
          </div> -->
          <div class="contact-price" @click="lockDiscount(row)">获取底价</div>
        </template>
      </vxe-column>
      <!-- <vxe-column field="CompanyName" title="所属服务商" width="100"> </vxe-column> -->

      <vxe-column field="StartTime" title="开始有效期" sortable width="90" :resizable="false">
        <template #default="{ row }">
          {{ row.StartTime ? row.StartTime.substring(0, 10) : "" }}
        </template>
      </vxe-column>
      <vxe-column field="EndTime" title="结束有效期" sortable width="90" :resizable="false">
        <template #default="{ row }">
          {{ row.EndTime ? row.EndTime.substring(0, 10) : "" }}
        </template>
      </vxe-column>
      <vxe-column title="船期计划" :resizable="true" width="300">
        <template #default="{ row }">
          <span class="weight-remark">
            {{ row.SpecialRemark ? row.SpecialRemark : "- -" }}
          </span>

          <el-popover placement="bottom" :width="400" trigger="hover" v-if="row.SpecialRemark">
            <template #reference>
              <img class="hover-img" style="position: relative; top: -2px" src="@/assets/images/hover_img.png" />
            </template>
            <div class="remark-hover">
              <div class="title">· 船期计划</div>
              <div class="content" style="white-space: pre-wrap">
                {{ row.SpecialRemark }}
              </div>
            </div>
          </el-popover>
        </template>
      </vxe-column>
      <vxe-column title="其他注意事项" :resizable="true" width="300">
        <template #default="{ row }">
          <span class="weight-remark">
            {{ row.WeightRemark ? row.WeightRemark : "- -" }}
          </span>
          <el-popover placement="bottom" :width="400" trigger="hover" v-if="row.WeightRemark">
            <template #reference>
              <img class="hover-img" style="position: relative; top: -2px" src="@/assets/images/hover_img.png" />
            </template>
            <div class="remark-hover">
              <div class="title">· 船期计划</div>
              <div class="content" style="white-space: pre-wrap">
                {{ row.WeightRemark }}
              </div>
            </div>
          </el-popover>
        </template>
      </vxe-column>
    </AppVxeTable>
    <div class="no-data" v-if="!constTableData.length && search.PolPortId && search.DestPortId && submited">
      <img src="@/assets/customWorkbench/none.svg" alt="" />
      <div class="no-data-describe">
        对不起，近期暂时没有您所需要的船期与价格。<br />
        <span @click="backToDestPort" class="backToDestPort">查看推荐港口</span>
        <!-- <br />若您拥有提供该价格的服务商信息，欢迎<span>告知服务商信息</span>，我们将会努力引入您的服务商 -->
      </div>
    </div>
    <div class="no-data" v-else-if="!constTableData.length">
      <img src="@/assets/customWorkbench/undraw_domain_names_re_0uun.svg" alt="" />
      <div class="no-data-describe">
        请至少输入 <span>起运港口 目的港</span> 后查询您所要了解的船期运价信息
      </div>
    </div>
  </div>
  <ApplyDiscountDialog ref="applyDiscountDialogRef2"></ApplyDiscountDialog>
  <el-dialog title="咨询底价" v-model="discountDialog" custom-class="discount-dialog" :rules="rules">
    <el-form :model="discountForm" ref="discountRef" label-width="120px">
      <el-form-item label="起运港">
        <el-input size="small" v-model="discountForm.PolEnPortName" disabled></el-input>
      </el-form-item>
      <el-form-item label="目的港">
        <el-input size="small" v-model="discountForm.DestEnPortName" disabled></el-input>
      </el-form-item>
      <el-form-item label="开始有效期">
        <el-input size="small" v-model="discountForm.StartTime" disabled></el-input>
      </el-form-item>
      <el-form-item label="结束有效期">
        <el-input size="small" v-model="discountForm.EndTime" disabled></el-input>
      </el-form-item>

      <div class="form-flex" style="display: flex;">
        <el-form-item label="箱型箱量" prop="Box" :rules="rules.Box" style="margin-right: 12px;">
          <el-select size="small" v-model="discountForm.Box" placeholder="选择箱型" clearable>
            <el-option label="20GP" value="20GP"></el-option>
            <el-option label="40GP" value="40GP"></el-option>
            <el-option label="40HQ" value="40HQ"></el-option>
          </el-select>

        </el-form-item>
        <el-form-item label-width="0" prop="BoxAmount" :rules="rules.BoxAmount">
          <el-input size="small" v-model="discountForm.BoxAmount" placeholder="输入箱量"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="备注" prop="SpecialRemark">
        <el-input type="textarea" v-model="discountForm.SpecialRemark" placeholder="根据点击的运价自动填写/（船名航次）"> </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <div style="text-align: center;">
        <el-button @click="discountDialog = false">取消</el-button>
        <el-button type="primary" @click="getPrice" class="contact-price-buttom">
          获取底价
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, ref, watch, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@/public/request";
import { ArrowRight, View } from "@element-plus/icons";
import AppDataPicker from "./AppDataPicker.vue";
import TimeTag from "@/views/internal/components/TimeTag.vue";
import AppVxeTable from "@/components/AppVxeTable.vue";
import FreightEvent from "@/views/internal/components/FreightEvent";
import ApplyDiscountDialog from "@/views/internal/components/ApplyDiscountDialog.vue";
import dayjs from "dayjs";
export default defineComponent({
  components: {
    ArrowRight,
    AppDataPicker,
    AppVxeTable,
    TimeTag,
    ApplyDiscountDialog,
    View
  },
  props: {
    search: {},
    hasCompany: { type: Boolean, default: false },
  },
  data() {
    return {
      visible: false,
      result: 3,
      tableData: [],
      constTableData: [],
      podPortList: [],
      dailogResult: 1,
      submited: false,
      // secondSearch: {
      //   LineCode: "",
      //   ETDDate: "",
      //   CSTDate: "",
      //   UpdateSTime: "",
      //   UpdateETime: "",
      //   shipSort: "",
      //   priceSort: "20GP",
      //   sortType: 1,
      // },
      secondSearch: {
        LineCode: '',
        CSTDate: '',
        ETDDate: '',
        LineType: '',
        PodPortId: '',
        ShippingCode: '',
      },
      tableOption: {
        page: 1,
        pageSize: -1,
        selectRecords: [],
        total: 0,
        isAllChecked: false,
        loading: false,
      },
      week: ["1", "2", "3", "4", "5", "6", "7"],
      weekCn: [
        { value: 1, name: "周一" },
        { value: 2, name: "周二" },
        { value: 3, name: "周三" },
        { value: 4, name: "周四" },
        { value: 5, name: "周五" },
        { value: 6, name: "周六" },
        { value: 7, name: "周日" },
      ],
      favPortList: [],
      portList: [],
      inputQueryListAll: [],
      discountDialog: false,
      discountForm: {},
      rules: {
        Box: [
          { required: true, message: "请选择箱型", trigger: "change" },
        ],
        BoxAmount: [
          { required: true, message: "请输入箱量", trigger: "blur" },
        ],
      }
      // hasCompany: false,
    };
  },
  computed: {
    // 当前登录用户
    currentAvatar() {
      // console.log(this.$store.state.auth, "this.$store.state.auth.user");
      if (this.currentUserIsLogin) {
        return this.$store.state.auth.user.Avatar;
      }
      return "";
    },
    isVipInfo() {
      if (this.$store.state.auth.VipInfo == null) {
        return false;
      }
      return true
    },
    // 剩余次数  如果是会员则不显示
    Frequency() {
      if (this.isVipInfo) {
        if (this.$store.state.auth.VipInfo.IsStatus) {
          return this.$store.state.auth.VipInfo.Frequency;
        }
      }
      return 'vip';
    },
  },

  methods: {
    FewFrequency() {
      if (this.Frequency != 'vip') {
        if (this.Frequency > 0 && this.Frequency <= 10) {
          ElMessage.warning("您的套餐次数余额不足，请购买套餐获得更多次数");
          this.$store.dispatch("renew/openPlanOptionDialog");
        }
      }
    },
    /**
     * 初始化筛选项
     */
    initSortItem() {
      //初始化船公司
      let shipList = [];
      this.tableData.forEach((item) => {
        item.expand = false;
        shipList.push(item.ShippingCode);
      });
      this.shipList = new Set(shipList);

      // let shipList=this.groupByItems(this.tableData,'ShippingCode')
    },
    sortChange(type) {
      this.secondSearch.sortType = type;
      this.sortTable();
    },
    /**
     * 筛选列表
     * @param {*} condition
     * @param {*} data
     */
    datafilter(condition, data) {
      return data.filter((item) => {
        return Object.keys(condition).every((key) => {
          return String(item[key])
            .toLowerCase()
            .includes(String(condition[key]).trim().toLowerCase());
        });
      });
    },
    /*
     * 筛选排序运价
     */
    clear() {
      this.secondSearch = {
        LineCode: '',
        CSTDate: '',
        ETDDate: '',
        LineType: '',
        PodPortId: '',
        ShippingCode: '',
      }
      let filteredData = JSON.parse(JSON.stringify(this.constTableData));
      // 更新总数
      this.tableOption.total = filteredData.length;
      this.tableOption.page = 1;
      this.tableOption.pageSize = -1;
      this.tableData = filteredData;
      this.LogStorage()
    },
    sortTable(isSearch = true) {
      let filteredData = JSON.parse(JSON.stringify(this.constTableData));
      // LineCode 模糊搜索
      if (this.secondSearch.LineCode) {
        filteredData = filteredData.filter(item =>
          item.LineCode.toLowerCase().includes(this.secondSearch.LineCode.toLowerCase())
        );
      }
      // 精确匹配其他条件
      if (this.secondSearch.CSTDate) {
        filteredData = filteredData.filter(item => item.CSTDate === this.secondSearch.CSTDate);
      }
      if (this.secondSearch.ETDDate) {
        filteredData = filteredData.filter(item => item.ETDDate === this.secondSearch.ETDDate);
      }
      if (this.secondSearch.LineType !== '' && this.secondSearch.LineType !== null && this.secondSearch.LineType !== -1) {
        filteredData = filteredData.filter(item => item.LineType === this.secondSearch.LineType);
      }
      if (this.secondSearch.PodPortId) {
        filteredData = filteredData.filter(item => item.PodPortId === this.secondSearch.PodPortId);
      }
      if (this.secondSearch.ShippingCode) {
        filteredData = filteredData.filter(item => item.ShippingCode === this.secondSearch.ShippingCode);
      }
      if (isSearch) {
        this.LogStorage()
      }
      // this.tableData = filteredData;
      // 更新总数
      this.tableOption.total = filteredData.length;
      // 分页处理
      const { page, pageSize } = this.tableOption;

      if (pageSize === -1) {
        this.tableData = filteredData;
      } else {
        let currentPage = page;
        const totalItems = filteredData.length;
        // 计算最大页码
        const maxPage = Math.max(1, Math.ceil(totalItems / pageSize));

        // 如果当前页码超出最大页码，则重置为最大页码（或第一页如果数据为空）
        if (currentPage > maxPage) {
          currentPage = maxPage;
        }
        // 更新 tableOption 中的页码，确保同步
        this.tableOption.page = currentPage;
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        this.tableData = filteredData.slice(startIndex, endIndex);
      }
    },
    async LogStorage() {
      const PolPort = this.getPortCode(this.search.PolPortId)
      const DestPort = this.getEndPortQueryCode(this.search.DestPortId)
      let res = await request.post("/api/CargoRate/CreateQueryStatisticalAnalysis", {
        PolPort,
        DestPort,
        Create: this.search.StartTime,
        End: this.search.EndTime,
        Source: 2,
        LineCode: this.secondSearch.LineCode,
        LineType: this.secondSearch.LineType,
        PodPort: this.secondSearch.PodPortId,
        Shipping: this.secondSearch.ShippingCode,
        CSTDate: this.secondSearch.CSTDate,
        ETDDate: this.secondSearch.ETDDate,
      });
    },
    async toggleExpand(row) {
      row.expand = !row.expand;
      this.$refs.freightListRef.xTable.toggleRowExpand(row);
      row.loading = true;


      if (row.RateId && row.RateId.toString().indexOf('jet') != -1) {
        row.activeName = "SpecialRemark"
        row.feeDetailData = row.FeeDetails;
        row.loading = false;
        return
      }

      let res = await request.get("/api/CargoRate/GetFeeCargoDetail", {
        Id: row.Id,
      });
      row.loading = false;
      row.feeDetailData = [];
      if (res && Array.isArray(res.FeeDetail) && res.FeeDetail.length > 0) {
        row.feeDetailData = res.FeeDetail;
        row.activeName = "hyf";
      } else if (
        row.DcPrice20GP ||
        row.DcPrice40GP ||
        row.DcPrice45HQ ||
        row.YpPrice ||
        row.DzxdPrice
      ) {
        row.rmbActive = true;
        row.activeName = "rmb";
      } else if (row.SpecialRemark) {
        row.activeName = "SpecialRemark";
      } else if (row.BillRemark) {
        row.activeName = "BillRemark";
      } else if (row.WeightRemark) {
        row.activeName = "WeightRemark";
      } else if (row.DestRemark) {
        row.activeName = "DestRemark";
      } else if (row.InRemark) {
        row.activeName = "InRemark";
      } else if (row.WharfRemark) {
        row.activeName = "WharfRemark";
      } else if (row.NetoRemark) {
        row.activeName = "NetoRemark";
      } else if (row.SWRemark) {
        row.activeName = "SWRemark";
      } else if (row.PolRemark) {
        row.activeName = "PolRemark";
      }
    },
    /**
     * 显示优惠幅度
     * @param {*} row
     */
    async applyDiscount(row) {
      let _this = this;

      // 请求这一行的幅度价格

      let res = await this.$http.get("/api/FRRate/GetFRRateInfoWithTag", {
        Id: row.Id
      })


      if (res.InDetail && res.InDetail.length > 0) {
        row.AllInPriceVisiable = true;
        row.Tag20GP = res.InDetail[0].Tag20GP
        row.Tag40GP = res.InDetail[0].Tag40GP
        row.Tag40HQ = res.InDetail[0].Tag40HQ
      } else {
        this.$message.warning("出现意外错误")
      }



    },
    /**
     * 锁定优惠幅度
     * @param {*} row
     */
    async lockDiscount(row) {
      this.discountForm = {
        PolEnPortName: row.PolEnPortName,
        DestEnPortName: row.DestEnPortName,
        PolPortId: row.PolPortId,
        DestPortId: row.DestPortId,
        PolCnPortName: row.PolCnPortName,
        DestCnPortName: row.DestCnPortName,
        StartTime: row.StartTime ? row.StartTime.substring(0, 10) : "",
        EndTime: row.EndTime ? row.EndTime.substring(0, 10) : "",
        Type: 1,
        RecordType: 2,
        RateId: row.Id,
        RateProviderCompanyId: row.CompanyId,
        SpecialRemark: row.SpecialRemark
      }

      this.discountDialog = true


      // let _this = this;
      // 判断是否已经认证过企业
      // if (!_this.hasCompany) {
      //   await _this.$store.dispatch("payplan/openPlanOptionDialog", 'company');
      //   return;
      // }
      // let res = await this.$http.post("/api/CargoRate/CreateInquiry", {
      //   RateId: row.Id,
      //   RateProviderCompanyId: row.CompanyId,
      //   InquiryType: 1
      // })
      // _this.$refs.applyDiscountDialogRef2.openDialog(2, row);
    },
    async openUserAuth() {
      console.log(11111111111111, "haswAuth");
      const haswAuth = await this.$store.dispatch("auth/getUserAuth")
      const payplan = await this.$store.dispatch("payplan/getPayPlan")
      console.log(payplan, "payplan");
      if (haswAuth) {
        ElMessage.warning("您已经完成职业认证，无需再次认证")
        return
      }
      await this.$store.dispatch("payplan/openPlanOptionDialog", 'user');
    },
    openDialog() {
      this.visible = true;
    },
    async getList(type) {
      /* if (!this.hasCompany) {
            await this.$store.dispatch("payplan/openPlanOptionDialog", 'company');
          return;
      } */
      if (type == 4) {
      } else if (type == 5) {
      } else if (!this.search.PolPortId || !this.search.DestPortId) {
        return this.$message.warning("请选择起运港和目的港");
      }
      // console.log(this.search, "this.search.");
      try {

        this.tableOption.page = 1
        this.tableOption.pageSize = -1
        // 航线代码换一个名称
        this.secondSearch.LineCode = this.search.hxdm;

        this.tableOption.loading = true;
        // /api/FRRateCus/GetRateCusList
        let res = await request.post("/api/CargoRate/SaleRateInfoList", {
          // Page: this.tableOption.page,
          // limit: this.tableOption.pageSize,
          ...this.search,
          // ...this.secondSearch,
        });
        // this.FewFrequency()
        this.$store.dispatch("auth/getVipInfo");
        if (!res.Status) {
          if (res.Data == 1) {
            this.$store.dispatch("renew/openPlanOptionDialog");
          }
          this.$message.warning(res.Message)
          return
        }
        this.submited = true;
        this.tableData = res.Data.Rows || [];
        this.constTableData = res.Data.Rows || [];
        this.tableOption.total = res.Data.Total;
        // 加载简达的运价 仅限第一页
        // if (this.tableOption.page == 1) {
        //   try {
        //     await this.getJETRate(this.secondSearch);
        //   } catch (e) {
        //     console.error(e)
        //   }
        // }
        this.initSortItem();
        // return res.Rows;
      } catch (error) {
        this.$message.warning("请先认证公司");
        this.tableOption.loading = false;
        // return [];
      } finally {
        this.secondSearch = {
          LineCode: '',
          CSTDate: '',
          ETDDate: '',
          LineType: '',
          PodPortId: '',
          ShippingCode: '',
        }
        this.tableOption.loading = false;
      }
    },
    async setSecondSearch(Id) {
      /*  if (!this.hasCompany) {
         await this.$store.dispatch("payplan/openPlanOptionDialog", 'company');
         return;
       } */
      // this.secondSearch = val;
      await this.getListById('', Id)
      this.tableData.forEach(item => {
        if (item.Id == Id) {
          this.toggleExpand(item)
          const $table = this.$refs.freightListRef.xTable;
          if ($table) {
            $table.toggleCheckboxRow(item)
            this.tableOption.selectRecords = [item]
          }
          return
        }
      })
    },
    async getListById(type, Id) {
      if (type == 4) {
      } else if (type == 5) {
      } else if (!this.search.PolPortId || !this.search.DestPortId) {
        return this.$message.warning("请选择起运港和目的港");
      }
      // console.log(this.search, "this.search.");
      try {

        this.tableOption.page = 1
        this.tableOption.pageSize = -1
        // 航线代码换一个名称
        this.secondSearch.LineCode = this.search.hxdm;

        this.tableOption.loading = true;
        // /api/FRRateCus/GetRateCusList
        let res = await request.get("/api/CargoRate/GetSaleRateCargoDteails", {
          Page: -1,
          limit: -1,
          RateId: Id,
          ...this.search,
          // ...this.secondSearch,
        });
        // this.FewFrequency()
        this.$store.dispatch("auth/getVipInfo");
        this.submited = true;
        this.tableData = res.Data.Rows || [];
        this.constTableData = res.Data.Rows || [];
        this.tableOption.total = res.Data.Total;
        // 加载简达的运价 仅限第一页
        // if (this.tableOption.page == 1) {
        //   try {
        //     await this.getJETRate(this.secondSearch);
        //   } catch (e) {
        //     console.error(e)
        //   }
        // }
        this.tableOption.loading = false;
        this.initSortItem();

        // return res.Rows;
      } catch (error) {
        this.$message.warning("请先认证公司");
        this.tableOption.loading = false;
        // return [];
      } finally {
        this.secondSearch = {
          LineCode: '',
          CSTDate: '',
          ETDDate: '',
          LineType: '',
          PodPortId: '',
          ShippingCode: '',
        }
        this.tableOption.loading = false;
      }
    },
    async getJETRate(secondSearch) {
      let res = await this.$http.get("/api/FRRateJetCus/QueryJETFreightRateList", {
        placeOfLoading: this.search.PolPortId,
        placeOfTarget: this.search.DestPortId,
        ...secondSearch
      })


      if (res && res.length > 0) {

        // 判断是否RateId重复
        let insert = []
        for (let item of res) {
          item.isJETRate = true
          let isRepeat = this.tableData.find(t => t.RateId == item.RateId)
          if (!isRepeat) {
            insert.push(item)
          }
        }
        this.tableData = this.tableData.concat(insert)
        this.constTableData = this.constTableData.concat(insert)
      }


    },
    //获取起运港
    async getPortList(e) {
      let keyword = e ?? "";
      let res = await request.get("/api/FRPort/GetFRPortList", {
        Page: 1,
        limit: -1,
        PortName: keyword,
        IsPol: true,
      });
      this.portList = res.Rows;
    },
    // 目的港查询
    async getEndPortQueryAll() {
      const res = await request.get("/api/FRPortalPort/GetPortToList", {
        EnPortName: "",
      });
      this.inputQueryListAll = res.Data;
    },
    getPortCode(Id) {
      let Code = ''
      this.portList.forEach((item) => {
        if (item.Id == Id) {
          Code = item.Code;
        }
      });
      return Code
    },
    getEndPortQueryCode(Id) {
      let Code = ''
      this.inputQueryListAll.forEach((line) => {
        line.gangkou.forEach((des) => {
          if (des.Id == Id) {
            Code = des.Code;
          }
        });
      });
      return Code
    },
    //获取中转港
    async getPodPortList(e) {
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
      console.log(list, 123333333333333)
      this.podPortList = list;
    },
    async showDiscount(row) {
      let _this = this;
      let dialogResult = FreightEvent.showDiscount(row, true);
      dialogResult.then((result) => {
        if (result) {
          _this.$refs.applyDiscountDialogRef2.openDialog(1);
        }
      });
    },

    /**
     * 格式化日期
     * @param {*} date
          */
    formatDateCh(date) {
      if (date) {
        return dayjs(date).format("YYYY年M月D日");
      } else {
        return "";
      }
    },

    // 返回推荐页面
    backToDestPort() {
      this.$emit("backToDestPort");
    },

    // 获取底价
    async getPrice() {
      const valid = await this.$refs.discountRef.validate()
      if (valid) {

        const res = await this.$http.post("/api/CargoRate/CreateBusinessDocuments", this.discountForm)
        if (!res.Status) {
          this.$message.error(res.Message)
          return
        }
        this.$message.success('成功')
        this.discountDialog = false
        this.getChatMenu()
      }
    },

    async getChatMenu() {

      let arr = []
      const res = await this.$http.get('/api/CargoRate/GroupByBusinessDocuments')
      let oldArr = []


      if (this.$store.state.menu.newList.length) {
        this.$store.state.menu.newList[this.$store.state.menu.newList.length - 1].info.forEach(item => {
          oldArr.push(item.url)
        })
      }
      let path, name, BusinessDocumentsId = ''
      console.log(oldArr)
      res.Data[res.Data.length - 1].info.forEach(item => {
        if (oldArr.indexOf("/internal/ChatWin" + item.Id) == -1) {
          console.log("/internal/ChatWin" + item.Id)
          path = "/internal/ChatWin" + item.Id
          name = 'ChatWin' + item.Id
          BusinessDocumentsId = item.Id
        }
      })
      console.log(path)
      this.$router.addRoute('internal', {
        name: name,
        path: path,
        component: () => import("@/views/internal/ChatWin.vue"),
        meta: {
          title: "聊天",
        },
      })
      res.Data.forEach((value, i) => {
        value.info.forEach(item => {
          arr[i] = arr[i] || {
            Time: value.Time.substring(0, 10),
            info: []
          }
          arr[i].info.push({
            name: item.PolEnPortName + '-' + item.DestEnPortName,
            url: "/internal/ChatWin" + item.Id,
            query: { BusinessDocumentsId: item.Id },
            icon: item.Type == 1 ? 'menu7.svg' : 'menu8.svg',
            iconActive: item.Type == 1 ? 'menu7Active.svg' : 'menu8Active.svg'
          })
        })

      })

      console.log(arr)

      this.$store.commit("menu/setNewList", arr);
      this.$router.push({ path: path, query: { BusinessDocumentsId: BusinessDocumentsId } })
    },
  },

  async mounted() {
    // this.hasCompany = await this.$store.dispatch("auth/checkAndTryChooseEmployee");
    // this.getList();
    this.getPodPortList();
    this.getPortList();
    this.getEndPortQueryAll();
  },
});
</script>

<style lang="scss" scoped>
@import "../customerFreight.scss";
@import "@/styles/FCLFreight/FCLFreight.scss";

--el-color-primary .freight-list-container {
  padding: 8px;
  background: #fff;
}

.freight-search {
  // background: #f8f8f8;
  padding: 8px 52px 8px 8px;
  display: flex;
  align-items: center;
  position: relative;
  // min-width: 1200px;
  box-sizing: border-box;

  .search-btn {
    background: #fd953e;
    border: 1px solid #fd953e;
    border-radius: 2px;
    //position: absolute;
    color: #fff;
    right: 8px;
    top: 8px;
    line-height: 22px;
    padding: 0 4px;
    cursor: pointer;
    margin-right: 5px;
  }

  .default {
    background-color: #fff;
    color: #666;
    border: 1px solid #dcdfe6;
  }

  .freight-search-item {
    display: flex;
    font-size: 12px;
    color: #303133;
    letter-spacing: -0.86px;
    align-items: center;
    height: 22px;

    .search-item-content {
      display: flex;
      padding: 0 4px;

      :deep(.el-input__inner) {
        height: 20px;
        line-height: 20px;
        padding: 0px 4px;
      }

      :deep(.el-input) {
        width: 80px;
      }

      :deep(.el-select-v2__wrapper) {
        height: 20px;
        line-height: 20px;
        padding: 0px 4px;
        font-size: 12px;
      }

      :deep(.el-select) {
        width: auto;
      }

      :deep(.el-select-v2) {
        width: 100%;
      }

      :deep(.el-select__caret) {
        line-height: 12px;
        min-height: 12px;
      }

      :deep(.el-input__suffix) {
        line-height: 18px;
        right: 0;
      }

      :deep(.el-range-separator) {
        line-height: 12px;
      }
    }
  }
}

.date-picker {
  width: 400px;

  :deep(.el-button) {
    height: 20px;
    line-height: 20px;
    min-height: 20px;
    font-size: 12px;
    padding: 0 5px;
  }

  :deep(.active-btn) {
    color: #ff7d14;
    border-color: #ff7d14;
  }
}

.mdg-block {
  height: 100%;

  // position: relative;
  .mdg-text-hidden {
    max-width: calc(100% - 20px);
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 11px;
  }

  // .hover-img {
  //   position: absolute !important;
  //   right: 0;
  //   top: 8px !important;
  // }
}

.discount-group {
  display: flex;
  // justify-content: center;
}

.locked {
  font-size: 14px;
  display: inline-block;
  font-weight: bold;
  width: 52px;
  margin-right: 4px;
  margin-left: 0;
  text-align: center;
  line-height: 20px;
  padding: 0 2px;
}

.discounts {
  font-size: 12px;
  display: inline-block;
  width: 52px;
  margin-right: 6px;
  margin-left: 0;
  text-align: center;
  line-height: 20px;
  padding: 0 2px;
  padding: 0 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
}

.discounts-blank {
  // font-size: 12px;
  // display: inline-block;
  width: 52px;
  // margin-right: 6px;
  // margin-left: 0;
  text-align: center;
  // line-height: 20px;
  // padding: 0 2px;
  // display: flex;
  // align-items: center;
  // height: 20px;
  // opacity: 0;
  font-size: 16px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  font-size: 12px;
  letter-spacing: -0.5px;
  font-weight: 600;
  margin-left: 4px;
  cursor: pointer;
}

.price-content {
  width: 56px;
}

.show-discount {
  background-image: linear-gradient(90deg, #ffa509 0%, #ff7800 100%);
  border: 1px solid #ff9914;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  line-height: 22px;
  cursor: pointer;
}

.contact-price {
  background-image: linear-gradient(-71deg, #ff7228 8%, #fa2d18 100%);
  border: 1px solid #ff9914;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  line-height: 22px;
  cursor: pointer;
}

:deep(.vxe-list-table) {
  .vxe-cell {
    height: 40px;
  }
}

.weight-remark {
  max-width: calc(100% - 20px);
}

.hidden-discount {
  color: #fb9251;
}

.price-head {
  width: 55px;
}

.no-data {
  padding: 80px 36px 120px;
  text-align: center;

  .no-data-describe {
    margin-top: 42px;
    font-size: 16px;
    color: #606266;

    span {
      color: #3b78ff;
    }
  }
}

.backToDestPort {
  cursor: pointer;
  text-decoration: underline;
  color: #fd953e !important;
}

.freight-table {
  :deep(.vxe-table--expanded) {
    display: none;
  }
}

.toggle-icon {
  transition: transform 0.18s ease;
  cursor: pointer;

  &.expanded {
    transform: rotate(90deg);
  }
}

.row-expand-content {
  background: #fdf6ed;
  border: 1px solid #e6a23d;
  margin: 1px;
}

// :deep()
:deep(.discount-dialog) {
  .el-input__inner {
    height: 24px;
    line-height: 24px;
  }
}

.contact-price-buttom {
  background-image: linear-gradient(-71deg, #ff7228 8%, #fa2d18 100%) !important;
  border: none !important;
}

:deep(.el-form-item__label) {
  text-align: left;
}

.form-flex {
  :deep(.el-select) {
    width: 100% !important;
  }
}
</style>
