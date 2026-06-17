<template>
    <div v-show="true" class="freight-search-card">
        <el-tabs v-model="state.activeName" @tab-click="activeChange" class="page-card-tabs">
            <el-tab-pane :label="`待处理${state.activeName == '0' ? `(${state.totalWait})` : ''}`" name="0"></el-tab-pane>
            <el-tab-pane :label="`已处理${state.activeName == '1' ? `(${state.totalDone})` : ''}`" name="1">
            </el-tab-pane>
            <el-tab-pane :label="`商机设置`" name="2"></el-tab-pane>
        </el-tabs>
        <div class="white-bg-container-inquiery">
            <AppSearchFormMini @reset="reset" @submit="getList" label-width="80px" v-if="state.activeName != 2">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="船公司">
                            <el-autocomplete @keydown.enter.native="initList" size="mini" style="width: 100%" debounce
                                clearable :trigger-on-focus="false" v-model="state.search.ShippingId"
                                :fetch-suggestions="getShipList" placeholder="请选择船公司">
                                <template #default="{ item }">
                                    <span class="select-lable">{{ item.label }}</span>
                                    <span class="select-value">{{ item.CnShippingName }}</span>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="航线代码">
                            <el-input placeholder="航线代码" v-model="state.search.LineCode"></el-input>
                        </el-form-item>
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
                        <el-select v-model="state.search.PodPortId" style="margin-left: 4px" filterable clearable remote
                            :remote-method="getPodPortList" placeholder="中转港" :disabled="state.search.LineType != 1">
                            <el-option v-for="item in state.podPortList" :label="item.label"
                                :value="item.CnPortName"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="起运港">
                            <el-select v-model="state.search.PolPortId" style="width: 100%" filterable clearable
                                placeholder="请选择起始港" popper-class="freight-select-dropdown2"
                                :filter-method="getPortList">
                                <el-option v-for="item in state.portList" :key="item.value" :label="item.label"
                                    :value="item.label" @click.native="PolPortIDSet(item)">
                                    <span class="select-lable">{{ item.label }}</span>
                                    <span class="select-value">{{ item.CnPortName }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的港">
                            <el-select v-model="state.search.DestPortId" style="width: 100%" filterable clearable
                                placeholder="请选择目的港" popper-class="freight-select-dropdown2"
                                :filter-method="getPortDetail">
                                <el-option v-for="item in state.portDetailList" :key="item.Id" :label="item.CnPortName"
                                    :value="item.Id">
                                    <span class="select-lable">{{ item.EnPortName }}</span>
                                    <span class="select-value">{{ item.CnPortName }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="state.activeName == '1'">
                        <el-form-item label="询价人">
                            <el-input placeholder="询价人" v-model="state.search.InquiryUserName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="state.activeName == '1'">
                        <el-form-item label="询价公司">
                            <el-input placeholder="询价公司" v-model="state.search.InquiryCompanyName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商机类型">
                            <el-select v-model="state.search.InquiryType" clearable
                                popper-class="freight-select-dropdown2" style="width:100%">
                                <el-option label="询价商机" :value="1" />
                                <el-option label="询舱商机" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="询价时间">
                            <div class="search-port-daterange">
                                <el-date-picker v-model="state.search.InquiryStartTime" style="width: 50%" type="date"
                                    clearable placeholder="开始日期" value-format="YYYY-MM-DD"
                                    :popper-class="isFreightLayout ? 'data-picker-freight-primary' : ''"></el-date-picker><span>&nbsp;</span>
                                <el-date-picker v-model="state.search.InquiryEndTime" style="width: 50%" type="date"
                                    clearable placeholder="结束日期" value-format="YYYY-MM-DD"
                                    :popper-class="isFreightLayout ? 'data-picker-freight-primary' : ''"></el-date-picker>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="state.activeName == '1'">
                        <el-form-item label="处理时间">
                            <div class="search-port-daterange">
                                <el-date-picker v-model="state.search.OperatingStartTime" style="width: 50%" type="date"
                                    clearable placeholder="开始日期" value-format="YYYY-MM-DD"
                                    :popper-class="isFreightLayout ? 'data-picker-freight-primary' : ''"></el-date-picker><span>&nbsp;</span>
                                <el-date-picker v-model="state.search.OperatingEndTime" style="width: 50%" type="date"
                                    clearable placeholder="结束日期" value-format="YYYY-MM-DD"
                                    :popper-class="isFreightLayout ? 'data-picker-freight-primary' : ''"></el-date-picker>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" style="margin-bottom: 6px;">
                        <el-button icon="el-icon-search" type="primary" @click="getList" size="mini"
                            style="margin-left: 10px;">查询
                        </el-button>
                        <el-button type="text" class="clean" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </AppSearchFormMini>
            <template v-if="state.activeName == 0">
                <InquiryWait ref="inquiryWaitRef" :search="state.search" @setTotal="(num) => { state.totalWait = num }">
                </InquiryWait>
            </template>
            <template v-if="state.activeName == 1">
                <InquiryDone ref="inquiryDoneRef" :search="state.search" @setTotal="(num) => { state.totalDone = num }">
                </InquiryDone>
            </template>
            <template v-if="state.activeName == 2">
                <BusinessSettings ref="businessSettingsRef"></BusinessSettings>
            </template>
        </div>
    </div>
    <div class="no-permission-card" v-show="false">
        <div class="permission-content">
            <h2 class="permission-title">抱歉,你无权访问该页面</h2>
            <p class="permission-desc">若想要查看该页面，可通过开通企业权益进行操作。</p>
        </div>
    </div>
</template>
<script setup>
import { nextTick, ref, watch, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@/public/request";
import tools from "@/utils/Utils";
import dayjs from "dayjs";
import { useStore, Store } from "vuex";
import { ArrowLeft, ArrowRight, ArrowDown } from "@element-plus/icons";
import InquiryDone from "./components/InquiryDone.vue";
import InquiryWait from "./components/InquiryWait.vue";
import BusinessSettings from "./components/BusinessSettings.vue";

import AppSearchFormMini from "@/components/AppSearchFormMini.vue";
const store = useStore();
const Route = useRoute();
const state = reactive({
    totalWait: 0,
    totalDone: 0,
    activeName: 0,
    search: {
        ShippingId: '',
        LineCode: '',
        CSTDate: '',
        ETDDate: '',
        LineType: -1,
        PodPortId: '',
        PolPortId: '',
        DestPortId: '',
        InquiryType: '',
        InquiryUserName: '',
        InquiryCompanyName: '',
        InquiryStartTime: "",
        InquiryEndTime: "",
        OperatingStartTime: "",
        OperatingEndTime: "",
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
});
const inquiryDoneRef = ref()
const inquiryWaitRef = ref()
const businessSettingsRef = ref()
const getList = () => {
    if (state.activeName == 0) {

        inquiryWaitRef.value.getList()
    }
    if (state.activeName == 1) {
        inquiryDoneRef.value.getList()
    }
}
const activeChange = () => {
    if (state.activeName == 0) {
        nextTick(() => {
            inquiryWaitRef.value.getList()
        })
    }
    if (state.activeName == 1) {
        nextTick(() => {
            inquiryDoneRef.value.getList()
        })
    }
    if (state.activeName == 2) {
        nextTick(() => {
            businessSettingsRef.value.getList()
        })
    }

}
const reset = () => {
    state.search.ShippingId = ''
    state.search.LineCode = ''
    state.search.CSTDate = ''
    state.search.ETDDate = ''
    state.search.LineType = -1
    state.search.PodPortId = ''
    state.search.PolPortId = ''
    state.search.DestPortId = ''
    state.search.InquiryType = ''
    state.search.InquiryUserName = ''
    state.search.InquiryCompanyName = ''
    state.search.InquiryStartTime = ''
    state.search.InquiryEndTime = ''
    state.search.OperatingStartTime = ''
    state.search.OperatingEndTime = ''
    getList()
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
        item.value = item.CnPortName;
        item.CnPortName = item.CnPortName;
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
onMounted(() => {
    getList()
    getShipList();
    getPodPortList();
    getPortList();
    getPortDetail();
});
</script>
<style lang="scss" scoped>
.freight-search-card {
    background: #ffffff;
    // border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 6px;
    // height: 100%;
    width: 100%;
    box-sizing: border-box;
    //   margin-bottom: 8px;
}

.page-card-tabs {
    padding: 10px 0;
}

.search-port-daterange {
    display: flex;
    flex-wrap: nowrap;
}

:deep(.el-form-item) {
    margin-bottom: 6px;
}

:deep(.el-input__inner) {
    font-size: 14px;
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
</style>