<template>
    <JstListLayout>
        <template #search>
            <JstSearchForm @reset="reset" submitAfterReset @submit="getList">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="业务编号">
                            <el-input v-model="state.query.OrderNumber" placeholder="请输入业务编号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="服务商名称">
                            <el-input v-model="state.query.CompanyName" placeholder="请输入公司名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="操作账号">
                            <el-input v-model="state.query.EmployeeName" placeholder="请输入消费员工"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="充值Q点">
                            <div style="display: flex">
                                <el-input v-model.number="state.query.MinAmount" placeholder="最小金额"></el-input>-
                                <el-input v-model.number="state.query.MaxAmount" placeholder="最大金额"></el-input>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-form-item label="充值时间">
                        <JstDateRange v-model:start="state.query.StartTime" v-model:end="state.query.EndTime">
                        </JstDateRange>
                    </el-form-item>
                </el-row>
            </JstSearchForm>
        </template>
        <template #table>
            <div class="statistics-info">
                <div class="statistics-info-box">
                    该条件下累计充值Q点：
                    <span v-if="state.tableData.length">{{ state.tableData[0].SumAmount }}</span>
                </div>
            </div>
            <AppPageTable ref="tableRef" @change="getList" :data="state.tableData" :option="state.option"
                @singleClick="toDetail" :singleHighLight="true" :tableHeight="400">
                <el-table-column width="210" prop="OrderNumber" label="业务编号">
                </el-table-column>
                <el-table-column prop="CompanyName" label="服务商名称"></el-table-column>
                <el-table-column prop="ProductInfo" label="购买商品"></el-table-column>
                <el-table-column prop="Amount" label="充值Q点"></el-table-column>
                <el-table-column prop="RawAmount" label="充值花费金额"></el-table-column>
                <el-table-column prop="CreateEmployeeName" label="操作账户">
                    <template #default="{ row }">
                        {{ formatNameAndPhone(row.CreateEmployeeName, row.CreateUserMobilePhone) }}
                    </template>
                </el-table-column>
                <el-table-column prop="PayTime" label="充值时间"></el-table-column>
                <el-table-column prop="Remark" label="备注" show-overflow-tooltip></el-table-column>
            </AppPageTable>
        </template>
        <el-collapse-transition>
            <div class="success-data" v-show="state.singleRow">
                <div v-loading="state.loading">
                    <div class="success-data-header">
                        <div class="success-data-title" v-if="state.singleRow">当前：{{ state.singleRow.OrderNumber }}
                        </div>
                        <div class="success-data-subtitle">具体明细
                            <div class="success-data-line"></div>
                        </div>
                    </div>
                    <SuccessData :isList="true" ref="successDataRef"></SuccessData>
                </div>
            </div>
        </el-collapse-transition>
    </JstListLayout>
    <!-- <rechargeDialog ref="rechargeDialogRef" @getInfo="getList"></rechargeDialog> -->
</template>

<script setup>
import { nextTick, ref, watch, reactive, computed, onMounted, defineExpose } from 'vue'
import { useTableOption, utils } from "justom-share"
import request from "@/public/request";
import SuccessData from "./components/rechargeData.vue";
import AppPageTable from "@/components/AppPageTable/AppPageTable.vue";
// import { replacePayWayText } from "@/composables/pay/usePay"
// import rechargeDialog from './components/rechargeDialog.vue';
import { ElMessage } from 'element-plus'
const state = reactive({
    option: useTableOption(),
    tableData: [],
    query: {
        OrderNumber: "",//业务编号
        CompanyName: "",// 服务商名称
        EmployeeName: "",//消费员工 
        MinAmount: "",//消费Q点 Min
        MaxAmount: "",//消费Q点 Max
        StartTime: "",//消费时间 
        EndTime: "",//充值金额 
    },
    headSearch: {
        timeValue: 0,
        tabActive: 0,
    },
    loading: false,
    singleRow: null,
})
const tableRef = ref()
const successDataRef = ref()
const rechargeDialogRef = ref()
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
        OrderNumber: "",//业务编号
        CompanyName: "",// 服务商名称
        EmployeeName: "",//消费员工 
        MinAmount: "",//消费Q点 Min
        MaxAmount: "",//消费Q点 Max
        StartTime: "",//消费时间 
        EndTime: "",//充值金额 
    }
}
const getList = async () => {
    let res = await request.get("/api/PayOrder/GetCurrentCompanyOrderList", {
        page: state.option.page,
        limit: state.option.pageSize,
        ...state.query
    })
    state.option.total = res.Total;
    state.singleRow = null
    for (let row of res.Rows) {
        // row.PayWayText = row.PayWay
        //  replacePayWayText(row.PayWay)
        row.PayTime = utils.formatDateTime(row.PayTime)
        switch (row.PayWay) {
            case 0:
                row.PayWayText = "支付宝"
                break;
            case 1:
                row.PayWayText = "微信"
                break;
            case 2:
                row.PayWayText = "线下"
                break;
        }
    }
    state.tableData = res.Rows;
}
const openRechargeDialog = () => {
    if (!state.singleRow) {
        ElMessage.warning("请选择要充值的服务商")
        return;
    }
    rechargeDialogRef.value.openDialog(state.singleRow)
}
const toDetail = async (row) => {
    state.loading = true;
    state.singleRow = row
    successDataRef.value.getInfo(row);
    setTimeout(() => {
        state.loading = false
    }, 100)
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

.table-btn {
    padding: 0 0px 5px;
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