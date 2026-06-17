<template>
    <div class="list-container" v-show="true">
        <JstListLayout>
            <!-- 订单明细 -->
            <template #search>
                <JstSearchForm @submit="getList" @reset="reset" style="margin-top: -16px;">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="起运港">
                                <el-select v-model="state.search.PolPortId" style="width: 100%" filterable clearable
                                    remote placeholder="请选择起始港" popper-class="freight-select-dropdown2"
                                    :filter-method="getPortList">
                                    <el-option v-for="item in state.portList" :key="item.value" :label="item.label"
                                        :value="item.value" @click.native="PolPortIDSet(item)">
                                        <span class="select-lable">{{ item.CnPortName }}</span>
                                        <span class="select-value">{{ item.label }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="目的港">
                                <el-select v-model="state.search.DestPortId" style="width: 100%" filterable clearable
                                    placeholder="请选择目的港" popper-class="freight-select-dropdown2"
                                    :filter-method="getPortDetail">
                                    <el-option v-for="item in state.portDetailList" :key="item.Id"
                                        :label="item.CnPortName" :value="item.Id">
                                        <span class="select-lable">{{ item.CnPortName }}</span>
                                        <span class="select-value">{{ item.EnPortName }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="船公司">
                                <el-autocomplete @keydown.enter.native="initList" size="mini" style="width: 100%"
                                    debounce clearable :trigger-on-focus="true" v-model="state.search.ShippingId"
                                    :fetch-suggestions="getShipList" placeholder="请选择船公司">
                                    <template #default="{ item }">
                                        <span class="select-lable">{{ item.label }}</span>
                                        <span class="select-value">{{ item.CnShippingName }}</span>
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属航线">
                                <el-input v-model="state.search.LineId" placeholder="请输入所属航线">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="航线代码">
                                <el-input placeholder="航线代码" v-model="state.search.LineCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item label="中转/直达">
                                <div class="item-flex">
                                    <el-select @click="
                                        () => {
                                            state.search.LineType != 1
                                                ? (state.search.PodPortId = '')
                                                : undefined;
                                        }
                                    " v-model="state.search.LineType" popper-class="freight-select-dropdown2">
                                        <el-option label="不限" :value="-1"></el-option>
                                        <el-option label="直达" :value="0"></el-option>
                                        <el-option label="中转" :value="1"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-select v-model="state.search.PodPortId" style="margin-left: 4px" filterable clearable
                                remote :remote-method="getPodPortList" placeholder="中转港"
                                :disabled="state.search.LineType != 1">
                                <el-option v-for="item in state.podPortList" :label="item.label"
                                    :value="item.CnPortName"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="截关/开航">
                                <div class="flex-item" style="display: flex;">
                                    <el-select v-model="state.search.CSTDate" clearable collapse-tags
                                        popper-class="freight-select-dropdown2">
                                        <el-option v-for="item in state.week" :key="item.value" :value="item.value"
                                            :label="item.label">
                                        </el-option>
                                    </el-select>
                                    &ensp;
                                    <el-select v-model="state.search.ETDDate" clearable collapse-tags
                                        popper-class="freight-select-dropdown2">
                                        <el-option v-for="item in state.week" :key="item.value" :value="item.value"
                                            :label="item.label">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="排序字段">
                                <div class="flex-item" style="display: flex;">
                                    <el-select v-model="state.search.SortValue" clearable
                                        popper-class="freight-select-dropdown2" @clear="
                                            () => { state.search.SortKey = '' }">
                                        <el-option value="20GP" label="20GP"></el-option>
                                        <el-option value="40GP" label="40GP"></el-option>
                                        <el-option value="40HQ" label="40HQ"></el-option>
                                    </el-select>
                                    &ensp;
                                    <el-select v-model="state.search.SortKey" :disabled="!state.search.SortValue"
                                        clearable popper-class="freight-select-dropdown2">
                                        <el-option label="升序" :value="0" />
                                        <el-option label="降序" :value="1" />
                                    </el-select>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="18">
                            <el-form-item label="有效时间">
                                <JstDateRange v-model:start="state.search.StartTime" v-model:end="state.search.EndTime">
                                </JstDateRange>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </JstSearchForm>
            </template>
            <template #table>
                <AppPageTable @change="getList" :fixedHeight="state.fixedHeight" :data="state.tableData"
                    :option="state.option">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column width="110" show-overflow-tooltip sortable prop="PolEnPortName" label="起运港">
                        <template #default="{ row }">
                            <div>{{ row.PolEnPortName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column width="110" show-overflow-tooltip sortable prop="DestEnPortName" label="目的港">
                        <template #default="{ row }">
                            <div class="mdg-block">
                                <div class="mdg-text-hidden">{{ row.DestEnPortName }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="110" sortable show-overflow-tooltip prop="ShippingCode" label="船公司">
                        <template #default="scope">
                            {{ scope.row.ShippingCode }}
                        </template>
                    </el-table-column>
                    <el-table-column width="110" show-overflow-tooltip sortable prop="LineCode"
                        label="航线"></el-table-column>
                    <el-table-column width="110" show-overflow-tooltip sortable prop="PodEnPortName" label="中转">
                        <template #default="{ row }">
                            <span v-if="row.LineType == 0">直达</span>
                            <span v-if="row.LineType == 1">{{ row.PodEnPortName }}</span>
                        </template>
                    </el-table-column>
                    <!-- 码头 -->
                    <el-table-column width="110" sortable show-overflow-tooltip prop="CnWharfName" label="码头">
                        <template #default="scope">
                            {{ scope.row.CnWharfName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="基础运价" align="center">
                        <el-table-column prop="AllOutPrice20GP" sortable label="20GP" width="90">
                            <template #default="{ row }">
                                <span class="orange-text">{{ row.AllOutPrice20GP ? row.AllOutPrice20GP : "- -" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="AllOutPrice40GP" sortable label="40GP" width="90">
                            <template #default="{ row }">
                                <span class="orange-text">{{ row.AllOutPrice40GP ? row.AllOutPrice40GP : "- -" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="AllOutPrice40HQ" sortable label="40HQ" width="90">
                            <template #default="{ row }">
                                <span class="orange-text">{{ row.AllOutPrice40HQ ? row.AllOutPrice40HQ : "- -" }}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="最低运价" align="center">
                        <el-table-column prop="AllInPrice20GP" sortable label="20GP" width="90">
                            <template #default="{ row }">
                                <span class="green-text"> {{ row.AllInPrice20GP ? row.AllInPrice20GP : "- -" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="AllInPrice40GP" sortable label="40GP" width="90">
                            <template #default="{ row }">
                                <span class="green-text">{{ row.AllInPrice40GP ? row.AllInPrice40GP : "- -" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="AllInPrice40HQ" sortable label="40HQ" width="90">
                            <template #default="{ row }">
                                <span class="green-text">{{ row.AllInPrice40HQ ? row.AllInPrice40HQ : "- -" }}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="预估运价" align="center">
                        <el-table-column prop="AllPrice20GP" sortable label="20GP" width="90">
                            <template #default="{ row }"> {{ row.AllPrice20GP ? row.AllPrice20GP : "- -" }} </template>
                        </el-table-column>
                        <el-table-column prop="AllPrice40GP" sortable label="40GP" width="90">
                            <template #default="{ row }"> {{ row.AllPrice40GP ? row.AllPrice40GP : "- -" }} </template>
                        </el-table-column>
                        <el-table-column prop="AllPrice40HQ" sortable label="40HQ" width="90">
                            <template #default="{ row }"> {{ row.AllPrice40HQ ? row.AllPrice40HQ : "- -" }} </template>
                        </el-table-column>
                    </el-table-column>
                    <!-- 特种箱 Ams 附加费-->
                    <el-table-column width="130" show-overflow-tooltip sortable prop="TzxPrice45HQ" label="特种箱">
                        <template #default="{ row }">
                            {{ formatTwoFields(row.TzxPrice45HQ, row.TzxPrice40NOR) }}
                        </template>
                    </el-table-column>
                    <el-table-column width="150" show-overflow-tooltip sortable prop="AMS" label="AMS/AMS备注">
                        <template #default="{ row }">
                            {{ formatTwoFields(row.AMS, row.AMSRemark) }}
                        </template>
                    </el-table-column>
                    <el-table-column width="130" show-overflow-tooltip sortable prop="LineName1" label="附加费">
                        <template #default="{ row }"><el-popover width="900" placement="bottom" @show="showThisFee(row)"
                                trigger="hover">
                                <template #reference>
                                    <span class="fee-btn">
                                        附加费
                                        <img class="hover-img" style="position: relative; top: -1px; left: 0px"
                                            src="@/assets/images/hover_img.png" />
                                    </span>
                                </template>
                                <div class="FCL-hover" v-loading="state.feeLoading">
                                    <div v-if="state.feeDetailData.length > 0">
                                        <div v-for="(item, index) in state.feeDetailData" :key="index">
                                            {{ item.FeeCodeName }}：{{ item.CurCode }}&ensp;{{
                                                item.OnePrice ? item.OnePrice : ""
                                            }}{{ item.Price20GP ? item.Price20GP : ""
                                            }}{{ item.Price40GP ? "/" + item.Price40GP : ""
                                            }}{{ item.Price40HQ ? "/" + item.Price40HQ : ""
                                            }}{{ item.Price45HQ ? "/" + item.Price45HQ : ""
                                            }}{{ item.Price40NOR ? "/" + item.Price40NOR : "" }}
                                        </div>
                                    </div>
                                    <div style="text-align: center" v-show="state.feeDetailData <= 0">
                                        <span style="font-size: 12px; color: #909399">暂无数据</span>
                                    </div>
                                </div>
                            </el-popover></template>
                    </el-table-column>
                    <el-table-column width="110" show-overflow-tooltip sortable prop="CSTDate" label="截/开">
                        <template #default="{ row }">
                            {{ formatTwoFields(row.CSTDate, row.ETDDate) }}
                        </template>
                    </el-table-column>
                    <el-table-column width="110" show-overflow-tooltip sortable prop="LineDay" label="航程">
                        <template #default="{ row }">
                            {{ row.LineDay ? row.LineDay + "天" : "-" }}
                        </template>
                    </el-table-column>
                    <el-table-column width="130" show-overflow-tooltip sortable prop="StartTime" label="开始有效期">
                        <template #default="{ row }">
                            {{ row.StartTime ? row.StartTime.substring(0, 10) : "" }}
                        </template>
                    </el-table-column>

                    <!-- 开始有效期 -->
                    <!-- 舱位 船期计划 其他注意事项  -->
                    <el-table-column width="75" show-overflow-tooltip sortable prop="LineName1" label="舱位">
                        <template #default="{ row }">
                            <div class="table-group-color">
                                <span class="greenBox" v-if="row.SpaceSituation == 2">充足</span>
                                <span class="grey" v-if="row.SpaceSituation == 3">{{ row.SpaceSituationContent }}</span>
                                <span class="yellowBox" v-if="row.SpaceSituation == 1">紧张</span>
                                <span class="redBox" v-if="row.SpaceSituation == 0">爆仓</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="130" show-overflow-tooltip sortable prop="SpecialRemark"
                        label="船期计划"></el-table-column>
                    <el-table-column width="130" show-overflow-tooltip sortable prop="LineName1" label="其他注意事项">
                        <template #default="{ row }">
                            <span class="weight-remark">{{
                                row.WharfRemark
                                    ? row.WharfRemark
                                    : row.NetoRemark
                                        ? row.NetoRemark
                                        : row.WeightRemark
                                            ? row.WeightRemark
                                            : row.DestRemark
                                                ? row.DestRemark
                                                : row.BillRemark
                                                    ? row.BillRemark
                                                    : row.OtherRemark
                                                        ? row.OtherRemark
                                                        : row.PolRemark
                                                            ? row.PolRemark
                                                            : row.SWRemark
                                                                ? row.SWRemark
                                                                : "- -"
                            }}</span>
                            <el-popover placement="bottom" :width="400" trigger="hover" v-if="
                                row.WeightRemark ||
                                row.WharfRemark ||
                                row.NetoRemark ||
                                row.DestRemark ||
                                row.BillRemark ||
                                row.OtherRemark ||
                                row.PolRemark ||
                                row.SWRemark
                            ">
                                <template #reference>
                                    <img class="hover-img" style="position: relative; top: -2px"
                                        src="@/assets/images/hover_img.png" />
                                </template>

                                <div class="remark-hover" v-if="row.WharfRemark">
                                    <div class="title">· 挂靠码头</div>
                                    <div class="content" style="white-space: pre-wrap">
                                        {{ row.WharfRemark }}
                                    </div>
                                </div>
                                <div class="remark-hover" v-if="row.NetoRemark">
                                    <div class="title">· 内托重量</div>
                                    <div class="content" style="white-space: pre-wrap">
                                        {{ row.NetoRemark }}
                                    </div>
                                </div>
                                <div class="remark-main-hover" v-if="row.WeightRemark">
                                    <div class="title">· 限重备注</div>
                                    <div class="content" style="white-space: pre-wrap">
                                        {{ row.WeightRemark }}
                                    </div>
                                </div>
                                <div class="remark-hover" v-if="row.DestRemark">
                                    <div class="title">· 目的港备注</div>
                                    <div class="content" style="white-space: pre-wrap">
                                        {{ row.DestRemark }}
                                    </div>
                                </div>
                                <div class="remark-hover" v-if="row.BillRemark">
                                    <div class="title">· 目的港免用箱</div>
                                    <div class="content" style="white-space: pre-wrap">
                                        {{ row.BillRemark }}
                                    </div>
                                </div>
                                <div class="remark-hover" v-if="row.OtherRemark">
                                    <div class="title">· 起运港备注</div>
                                    <div class="content" style="white-space: pre-wrap">
                                        {{ row.OtherRemark }}
                                    </div>
                                </div>
                                <div class="remark-hover" v-if="row.PolRemark">
                                    <div class="title">· 起运港免用箱</div>
                                    <div class="content" style="white-space: pre-wrap">
                                        {{ row.PolRemark }}
                                    </div>
                                </div>
                                <div class="remark-hover" v-if="row.SWRemark">
                                    <div class="title">· SW/电放</div>
                                    <div class="content" style="white-space: pre-wrap">
                                        {{ row.SWRemark }}
                                    </div>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="人民币费率" align="center">
                        <el-table-column prop="FilePrice" sortable label="文件" width="90">
                            <template #default="{ row }"> {{ row.FilePrice ? row.FilePrice : "- -" }} </template>
                        </el-table-column>
                        <el-table-column prop="XdPrice1" sortable label="箱单" width="90">
                            <template #default="{ row }">
                                {{ formatTwoFields(row.XdPrice1, row.XdPrice2) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="40HQ" sortable label="THC" width="90">
                            <template #default="{ row }">
                                <div class="flex-item" style="justify-content: center" v-if="
                                    row.THCPrice20GP ||
                                    row.THCPrice40GP ||
                                    row.THCPrice45HQ ||
                                    row.THCPrice45NOR ||
                                    row.THCPrice20RF ||
                                    row.THCPrice45RF
                                ">
                                    <span class="thc-text">
                                        {{ formatPriorityFields(row) }}
                                        <!-- {{ row.THCPrice20GP ? row.THCPrice20GP : "- -" }}/{{
                                    row.THCPrice40GP ? row.THCPrice40GP : "- -"
                                }} -->
                                    </span>

                                    <el-popover placement="right" trigger="hover">
                                        <template #reference>
                                            <img class="hover-img" src="@/assets/images/hover_img.png" />
                                        </template>
                                        <div class="FCL-hover">
                                            20GP:{{ row.THCPrice20GP ? row.THCPrice20GP : "- -" }}
                                            <br />

                                            40GP/HQ:{{ row.THCPrice40GP ? row.THCPrice40GP : "- -" }}
                                            <br />

                                            45HQ:{{ row.THCPrice45HQ ? row.THCPrice45HQ : "- -" }}
                                            <br />

                                            40NOR:{{ row.THCPrice45NOR ? row.THCPrice45NOR : "- -" }}
                                            <br />

                                            20RF:{{ row.THCPrice20RF ? row.THCPrice20RF : "- -" }}
                                            <br />

                                            40RF:{{ row.THCPrice45RF ? row.THCPrice45RF : "- -" }}
                                        </div>
                                    </el-popover>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="人民币费率2" align="center">
                        <el-table-column prop="YpPrice" sortable label="预配发送费" width="115">
                            <template #default="{ row }"> {{ row.YpPrice ? row.YpPrice : "- -" }} </template>
                        </el-table-column>
                        <el-table-column prop="DzxdPrice" sortable label="电子装箱单费" width="140">
                            <template #default="{ row }"> {{ row.DzxdPrice ? row.DzxdPrice : "- -" }} </template>
                        </el-table-column>
                        <el-table-column prop="40HQ" sortable label="订舱费" width="90">
                            <template #default="{ row }">
                                <div class="flex-item" style="justify-content: center"
                                    v-if="row.DcPrice20GP || row.DcPrice40GP || row.DcPrice45HQ">
                                    <span class="thc-text">
                                        {{ row.DcPrice20GP ? row.DcPrice20GP : "- -" }}/{{
                                            row.DcPrice40GP ? row.DcPrice40GP : "- -"
                                        }}
                                    </span>

                                    <el-popover placement="right" trigger="hover">
                                        <template #reference>
                                            <img class="hover-img" src="@/assets/images/hover_img.png" />
                                        </template>
                                        <div class="FCL-hover">
                                            20GP:{{ row.DcPrice20GP ? row.DcPrice20GP : "- -" }}
                                            <br />

                                            40GP/HQ:{{ row.DcPrice40GP ? row.DcPrice40GP : "- -" }}
                                            <br />

                                            45HQ:{{ row.DcPrice45HQ ? row.DcPrice45HQ : "- -" }}
                                        </div>
                                    </el-popover>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <!-- 航程航程  -->
                    <el-table-column width="100" show-overflow-tooltip sortable prop="LineId" label="运价状态">
                        <template #default="{ row }">
                            <div class="tableStatusBox" :class="setStatusClass(row.IsRelease, 1)">
                                <div class="tablecircle"></div>
                                <div class="tableStatusText">
                                    {{ setStatusClass(row.IsRelease, 2) }}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="130" sortable show-overflow-tooltip prop="CnShippingName"
                        label="服务商"></el-table-column>
                    <el-table-column width="150" show-overflow-tooltip sortable prop="UpdateTime" label="上架时间">
                        <template #default="{ row }">
                            {{ row.UpdateTime ? row.UpdateTime.substring(5) : "" }}
                        </template>
                    </el-table-column>
                    <el-table-column width="150" sortable show-overflow-tooltip prop="EndTime"
                        label="下架时间"></el-table-column>
                </AppPageTable>
            </template>

        </JstListLayout>
    </div>
    <div class="no-permission-card" v-show="false">
        <div class="permission-content">
            <h2 class="permission-title">抱歉,你无权访问该页面</h2>
            <p class="permission-desc">若想要查看该页面，可通过开通企业权益进行操作。</p>
        </div>
    </div>
</template>

<script setup>
import { nextTick, ref, watch, reactive, computed, onMounted, onActivated, onUnmounted, onBeforeMount } from "vue";
import { useTableOption } from "justom-share"
import request from "@/public/request";
import { ElMessage, ElMessageBox } from 'element-plus'
import AppPageTable from "@/components/AppPageTable/AppPageTable.vue";

const state = reactive({
    activeName: 0,
    option: useTableOption(),
    tableData: [],
    feeDetailData: [],

    search: {
        PolPortId: '',
        DestPortId: '',
        ShippingId: '',
        LineId: '',
        LineCode: '',
        LineType: -1,
        PodPortId: '',
        CSTDate: '',
        ETDDate: '',
        SortValue: '',
        SortKey: '',
        StartTime: '',
        EndTime: '',
        IsRelease: 1,
    },
    shipList: [],
    podPortList: [],
    listLoading: false,
    portList: [],
    // 存储对应的目的港和起运港id
    polPortIDValue: "",
    podPortIDValue: "",
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
    fixedHeight: '400px',
});
const formatTwoFields = (field1, field2) => {
    if (field1 || field2) {
        const val1 = field1 !== null && field1 !== undefined ? field1 : '- -';
        const val2 = field2 !== null && field2 !== undefined ? field2 : '- -';
        return `${val1}/${val2}`;
    } else {
        return '- -';
    }
}
const formatPriorityFields = (row) => {
    const fields = [
        row.THCPrice20GP,
        row.THCPrice40GP,
        row.THCPrice45HQ,
        row.THCPrice45NOR,
        row.THCPrice20RF,
        row.THCPrice45RF
    ];
    const validFields = fields.filter(value => value !== null && value !== undefined);
    if (validFields.length >= 2) {
        return `${validFields[0]}/${validFields[1]}`;
    }
    else if (validFields.length === 1) {
        return validFields[0];
    }
    else {
        return '- -';
    }
}
const getList = async () => {
    let res = await request.get("/api/CargoRate/ProviderRateInfo", {
        Page: state.option.page,
        Limit: state.option.pageSize,
        ...state.search,
        LineType: state.search.LineType == -1 ? null : state.search.LineType
    })
    state.option.total = res.Total
    state.tableData = res.Rows;
};
const reset = async () => {
    state.search = {
        PolPortId: '',
        DestPortId: '',
        ShippingId: '',
        LineId: '',
        LineCode: '',
        LineType: -1,
        PodPortId: '',
        CSTDate: '',
        ETDDate: '',
        SortValue: '',
        SortKey: '',
        StartTime: '',
        EndTime: '',
        IsRelease: 1,
    };
    getList();
};

async function showThisFee(row) {
    state.feeLoading = true;
    let res = await request.get("/api/CargoRate/GetFeeCargoDetail", {
        Id: row.Id,
    });
    state.feeLoading = false;
    state.feeDetailData = res || [];
}
async function getShipList(e, cb) {
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
        item.value = item.Code;
    }
    cb(list);
    state.shipList = list;
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
//获取起运港
async function getPortList(e) {
    let keyword;
    e ? (keyword = e) : (keyword = "");
    let res = await request.get("/api/FRPort/GetFRPortList", {
        Page: 1,
        limit: -1,
        PortName: keyword,
        IsPol: true,
    });
    let list = res.Rows;
    for (let item of list) {
        item.label = item.EnPortName;
        item.CnPortName = item.CnPortName;
        item.value = item.Id;
    }
    state.portList = list;
}
//获取运价列表搜索港口细分
async function getPortDetail(e) {
    let keyword;
    e ? (keyword = e) : (keyword = "");
    state.listLoading = true;
    let res = await request.get("/api/FRPort/GetFRPortList", {
        Page: 1,
        limit: 30,
        PortName: keyword,
    });
    state.portDetailList = res.Rows;
    state.listLoading = false;
}

// 设置当前选择起运港的
function PolPortIDSet(item) {
    state.polPortIDValue = item.Id;
}
// 设置当前选择目的港的
function polPortSet(item) {
    state.podPortIDValue = item.Id;
}
const getfixedHeight = () => {
    // 180搜索框高度 其余固定高度75 108 合计362
    // 屏幕最小高度 575
    // 获取当前屏幕高度
    const screenHeight = window.innerHeight;
    // 计算固定高度
    const fixedHeight = screenHeight - 362;
    return Math.max(fixedHeight, 213) + 'px';
}
// 定义一个函数来计算容器的高度
const calculateContainerHeight = () => {
    const screenHeight = window.innerHeight;
    const fixedElementsHeight = 330 // 固定元素的总高度
    const minContainerHeight = 213; // 容器的最小高度
    const calculatedHeight = screenHeight - fixedElementsHeight;
    const finalHeight = Math.max(calculatedHeight, minContainerHeight);
    state.fixedHeight = `${finalHeight}px`;
};
const setStatusClass = (i, type) => {
    let str = "";
    if (type == 1) {
        switch (i) {
            case true:
                str = "greenStatus";
                break;
            case false:
                str = "redStatus";
            default:
                break;
        }
        return str;
    }
    if (type == 2) {
        switch (i) {
            case true:
                str = "上架";
                break;
            case false:
                str = "下架";
            default:
                break;
        }
        return str;
    }
}
onBeforeMount(() => {
    calculateContainerHeight();
})

onMounted(() => {
    getList()
    getPodPortList();
    getPortList();
    getPortDetail()
    // 添加窗口大小变化的监听器
    window.addEventListener('resize', calculateContainerHeight);
});

// 在组件卸载时移除监听器
onUnmounted(() => {
    window.removeEventListener('resize', calculateContainerHeight);
});
onActivated(() => {
    getList()
})
</script>

<style lang="scss" scoped>
@import "@/styles/FCLFreight/FCLFreight.scss";

.list-container {
    // width: calc(100vw - 235px);
    min-width: 1160px;
    box-sizing: border-box;

}

.select-lable {
    float: left;
}

.select-value {
    float: right;
    color: #8492a6;
    font-size: 13px;
}

.weight-remark {
    max-width: 70px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 11px;
    padding-right: 2px;
}

.hover-img {
    width: 6px;
    height: 7px;
    padding-left: 4px;
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


.remark-main-hover {
    padding: 12px 16px;
    background: #fdf6ed;
    letter-spacing: -0.8px;

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

.flex-item {
    display: flex;
    align-items: center;
}

:deep(.el-table__empty-block) {
    width: 100% !important;
    position: sticky;
    left: 0;
}

:deep(.el-form-item) {
    margin-bottom: 6px;
}

:deep(.list-layout-container) {
    padding: 6px;
    // padding: 16px 24px 12px 24px;
}

.orange-text {
    color: #EF6B33;
}

.green-text {
    color: #11B16A;
}

.tableStatusBox {
    display: flex;
    align-items: center;

    .tablecircle {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 5px;
    }

    .tableStatusText {
        color: rgba(0, 0, 0, 0.85);
        font-size: 12px;
        letter-spacing: 0px;
    }

    &.noStatus {
        display: none;
    }

    &.geryStatus {
        .tablecircle {
            background: rgba(217, 217, 217, 1);
        }
    }

    &.allgeryStatus {
        .tablecircle {
            background: rgba(216, 216, 216, 1);
        }

        .tableStatusText {
            color: rgba(150, 151, 153, 0.85);
        }
    }

    &.blueStatus {
        .tablecircle {
            background: rgba(59, 120, 255, 1);
        }
    }

    &.redStatus {
        .tablecircle {
            background: rgba(255, 0, 0, 1);
        }
    }

    &.deepgeryStatus {
        .tablecircle {
            background: rgba(150, 151, 153, 1);
        }
    }

    &.orangeStatus {
        .tablecircle {
            background: rgba(249, 168, 38, 1);
        }
    }

    &.greenStatus {
        .tablecircle {
            background: rgba(121, 180, 60, 1);
        }
    }
}

.no-permission-card {
    background: #ffffff;
    border-radius: 4px;
    padding: 6px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    .permission-content {
        text-align: center;
    }

    .permission-title {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin-bottom: 16px;
        margin-top: 0;
    }

    .permission-desc {
        font-size: 16px;
        color: #666;
        margin-bottom: 32px;
        line-height: 1.5;
    }

    .open-membership-btn {
        background: linear-gradient(90deg, #fd953e 0%, #ff6b9d 100%);
        border: none;
        padding: 12px 32px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 6px;
        color: #fff;
        width: 100%;

        &:hover {
            background: linear-gradient(90deg, #e88535 0%, #e55a8a 100%);
        }
    }
}

:deep(.el-table__header-wrapper) {
    width: max-content;
}

:deep(.el-table__body-wrapper) {
    width: max-content;
}

:deep(.el-table) {
    overflow: auto;
}
</style>