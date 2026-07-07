<template>

    <JstListLayout>
        <template #search>
            <searchComp @searchFun="searchFun" :form="state.query" @clearFun="clearFun" :searchList="searchList"
                style="margin-bottom: 12px;">
                <template #Amount>
                    <div style="display: flex">
                        <el-input v-model.number="state.query.MinAmount" placeholder="最小金额"></el-input>-
                        <el-input v-model.number="state.query.MaxAmount" placeholder="最大金额"></el-input>
                    </div>
                </template>
            </searchComp>
        </template>
        <template #table>
            <div class="statistics-info">
                <div class="statistics-info-box">
                    该条件下累计消费Q点：
                    <span v-if="state.tableData.length">{{ state.tableData[0].SumAmount }}</span>
                </div>
            </div>
            <AppPageTable ref="tableRef" :tableHeight="400" @change="getList" :data="state.tableData"
                :option="state.option" @singleClick="toDetail" :singleHighLight="true">
                <el-table-column width="210" prop="TradeNumber" label="业务编号">
                </el-table-column>
                <el-table-column prop="CompanyName" label="服务商名称"></el-table-column>
                <el-table-column prop="TradeAction" label="消费类型"></el-table-column>
                <el-table-column prop="Amount" label="消费Q点金额"></el-table-column>
                <!-- <el-table-column prop="Amount" label="应付Q点"></el-table-column> -->
                <el-table-column prop="AfterBalance" label="消费后剩余Q点余额"></el-table-column>
                <el-table-column prop="EmployeeName" label="消费账号">
                    <template #default="{ row }">
                        {{ formatNameAndPhone(row.EmployeeName, row.CreateUserMobilePhone) }}
                    </template>
                </el-table-column>
                <el-table-column prop="CreateTime" label="消费时间"></el-table-column>
            </AppPageTable>
        </template>
        <el-collapse-transition>
            <div class="success-data" v-show="state.singleRow">
                <div v-loading="state.loading">
                    <div class="success-data-header">
                        <div class="success-data-title" v-if="state.singleRow">当前：{{ state.singleRow.InquiryCompanyName
                            }}-{{
                                state.singleRow.InquiryUserRealName }}</div>
                        <div class="success-data-subtitle">具体明细
                            <div class="success-data-line"></div>
                        </div>
                    </div>
                    <expenseData :isList="true" ref="expenseDataRef"></expenseData>
                </div>
            </div>
        </el-collapse-transition>
    </JstListLayout>

</template>

<script setup>
import { nextTick, ref, watch, reactive, computed, onMounted, defineExpose } from 'vue'
import { useTableOption, utils } from "justom-share"
import request from "@/public/request";
import expenseData from "./components/expenseData.vue";
import AppPageTable from "@/components/AppPageTable/AppPageTable.vue";
import searchComp from '@/components/searchComp.vue';
const state = reactive({
    option: useTableOption(),
    tableData: [],
    query: {
        TradeNumber: "",//业务编号
        CompanyName: "",// 服务商名称
        EmployeeName: "",//消费员工 
        MinAmount: "",//消费Q点 Min
        MaxAmount: "",//消费Q点 Max
        StartTime: "",//消费时间 
        EndTime: "",//充值金额 
        TradeAction: "询价商机,询舱商机",//消费类型 
    },
    headSearch: {
        timeValue: 0,
        tabActive: 0,
    },
    loading: false,
    singleRow: null,
})

const searchFun = (form) => {
    if (form.date && form.date.length) {
        form.StartTime = form.date[0]
        form.EndTime = form.date[1]
    }

    state.query = form
    getList()
}

const clearFun = (form) => {

    state.query = {}
    getList()
}

const searchList = computed(() => {
    return [
        {
            type: 'input',
            label: '业务编号',
            prop: 'TradeNumber',
            placeholder: '请输入业务编号'
        },
        {
            type: 'input',
            label: '服务商名称',
            prop: 'CompanyName',
            placeholder: '请输入公司名称'
        },
        {
            type: 'input',
            label: '消费账号',
            prop: 'EmployeeName',
            placeholder: '请输入消费员工'
        },
        {
            type: 'slot',
            slotName: 'Amount',
            label: '消费Q点'
        },
        {
            label: '消费类型',
            type: 'select',
            placeholder: "请选择所属角色",
            prop: 'TradeAction',
            dataLabel: 'label',
            value: 'value',
            data: [
                { label: '全部', value: "询价商机,询舱商机" },
                { label: '询价商机', value: "询价商机" },
                { label: '询舱商机', value: "询舱商机" },
            ]
        },
        {
            label: '消费时间',
            type: 'daterange',
            prop: 'date',
            width: 'calc(50% - 8px)',
            btn: true
        },

    ]
})
const tableRef = ref()
const expenseDataRef = ref()
const formatNameAndPhone = (name, phone) => {
    if (name && phone) {
        return `${name}(${phone})`;
    } else if (name || phone) {
        return name || phone;
    } else {
        return '- -';
    }
}
const reset = () => {
    state.query = {
        TradeNumber: "",//业务编号
        CompanyName: "",// 服务商名称
        EmployeeName: "",//消费员工 
        MinAmount: "",//消费Q点 Min
        MaxAmount: "",//消费Q点 Max
        StartTime: "",//消费时间 
        EndTime: "",//充值金额 
        TradeAction: "询价商机,询舱商机",//消费类型 
    }
}
const getList = async () => {
    let res = await request.get("/api/PayTradeRecord/GetCurrentCompanyRecordList", {
        page: state.option.page,
        limit: state.option.pageSize,
        ...state.query
    })
    state.singleRow = null
    state.option.total = res.Total;
    for (let row of res.Rows) {
        row.CreateTime = utils.formatDateTime(row.CreateTime);
    }
    state.tableData = res.Rows;
}
const toDetail = async (row) => {
    state.loading = true;
    state.singleRow = row
    let res = await request.get("/api/CargoRate/ProviderInquiry", { InquiryId: row.TradeParams })
    state.singleRow = { ...row, ...res.Rows[0] }
    state.loading = false;
    expenseDataRef.value.getInfo({ ...row, ...res.Rows[0] });
}
onMounted(() => {
    // getList();
})
defineExpose({
    getList,
});
</script>

<style lang="scss" scoped>
.success-data {
    .success-data-header {
        display: flex;
        border-bottom: 2px solid #ebeef5;
        margin-bottom: 10px;

        .success-data-title {
            padding: 5px;
        }

        .success-data-subtitle {
            padding: 5px;
            color: #fd953e;
            position: relative;
            margin-left: 10px;

            .success-data-line {
                width: 60px;
                height: 2px;
                background-color: #fd953e;
                position: absolute;
                bottom: -2px;
                left: 3px;
            }
        }
    }
}

.statistics-info {
    padding: 5px;
    font-size: 12px;
    border: 1px solid #FFE58F;
    background-color: #FFFBE6;
    display: flex;
    gap: 5px;
    margin-bottom: 5px;

    .statistics-info-box {
        span {
            color: #3B78FF;
        }
    }
}
</style>