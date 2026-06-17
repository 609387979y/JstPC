<template>
    <JstCardLayout>
        <JstPageTable @change="getList" :data="state.tableData" :option="state.option" :height="clientHeight">
            <el-table-column width="110" show-overflow-tooltip sortable prop="OrderNumber1"
                label="询价公司"></el-table-column>
            <el-table-column width="110" show-overflow-tooltip sortable prop="OrderNumber1"
                label="询价人"></el-table-column>
            <el-table-column width="110" show-overflow-tooltip sortable prop="OrderNumber1"
                label="商机类型"></el-table-column>
            <el-table-column width="110" show-overflow-tooltip sortable prop="CSTDate1" label="询价时间"></el-table-column>
            <el-table-column width="110" show-overflow-tooltip sortable prop="OrderNumber1"
                label="服务商"></el-table-column>
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
            <el-table-column width="110" show-overflow-tooltip sortable prop="PodEnPortName" label="中转">
                <template #default="{ row }">
                    <span v-if="row.LineType == 0">直达</span>
                    <span v-if="row.LineType == 1">{{ row.PodEnPortName }}</span>
                </template>
            </el-table-column>
            <el-table-column width="110" show-overflow-tooltip sortable prop="ShippingCode" label="船公司">
                <template #default="scope">
                    {{ scope.row.ShippingCode }}
                </template>
            </el-table-column>
            <el-table-column width="130" show-overflow-tooltip sortable prop="LineName" label="所属航线"></el-table-column>
            <el-table-column width="110" show-overflow-tooltip sortable prop="LineDay" label="航程">
                <template #default="{ row }">
                    {{ row.LineDay ? row.LineDay + "天" : "-" }}
                </template>
            </el-table-column>
            <el-table-column width="110" show-overflow-tooltip sortable prop="CSTDate" label="截/开">
                <template #default="{ row }"> {{ row.CSTDate }}/{{ row.ETDDate }} </template>
            </el-table-column>
            <el-table-column label="ALL-IN报价" align="center">
                <el-table-column prop="AllOutPrice20GP" sortable label="20GP" width="90">
                    <template #default="{ row }"> {{ row.AllOutPrice20GP ? row.AllOutPrice20GP : "- -" }} </template>
                </el-table-column>
                <el-table-column prop="AllOutPrice40GP" sortable label="40GP" width="90">
                    <template #default="{ row }"> {{ row.AllOutPrice40GP ? row.AllOutPrice40GP : "- -" }} </template>
                </el-table-column>
                <el-table-column prop="AllOutPrice40GP" sortable label="40HQ" width="90">
                    <template #default="{ row }"> {{ row.AllOutPrice40HQ ? row.AllOutPrice40HQ : "- -" }} </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="申请幅度" align="center">
                <el-table-column prop="20GP" sortable label="20GP" width="90">
                    <template #default="{ row }">
                        <!-- <div class="forbiden-freight" v-if="!row.AllInPriceVisiable">
                            <div class="locked">幅度**</div>
                        </div> -->
                        <div class="discounts">
                            <img src="@/assets/customWorkbench/green-arrow-down.svg" alt="" />
                            {{ row.Tag20GP }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="40GP" sortable label="40GP" width="90">
                    <template #default="{ row }">
                        <!-- <div class="forbiden-freight" v-if="!row.AllInPriceVisiable">
                            <div class="locked">幅度**</div>
                        </div> -->
                        <div class="discounts">
                            <img src="@/assets/customWorkbench/green-arrow-down.svg" alt="" />
                            {{ row.Tag40GP }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="40HQ" sortable label="40HQ" width="90">
                    <template #default="{ row }">
                        <!-- <div class="forbiden-freight" v-if="!row.AllInPriceVisiable">
                            <div class="locked">幅度**</div>
                        </div> -->
                        <div class="discounts">
                            <img src="@/assets/customWorkbench/green-arrow-down.svg" alt="" />
                            {{ row.Tag40HQ }}
                        </div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column width="110" show-overflow-tooltip sortable prop="CSTDate1" label="扣除Q点"></el-table-column>
            <el-table-column width="110" show-overflow-tooltip sortable prop="CSTDate1" label="操作人"></el-table-column>
            <el-table-column width="110" show-overflow-tooltip sortable prop="CSTDate1" label="处理时间"></el-table-column>

        </JstPageTable>
        <div class="success-data">
            <div class="success-data-header">
                <div class="success-data-title">当前：询价公司-询价人</div>
                <div class="success-data-subtitle">具体明细
                    <div class="success-data-line"></div>
                </div>
            </div>
            <SuccessData :isList="true"></SuccessData>
        </div>
    </JstCardLayout>
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
import AppVxeTable from "@/components/AppVxeTable.vue";
import SuccessData from "./SuccessData.vue"

import { useTableOption, utils } from "justom-share"
const props = defineProps({
    search: {
        type: Object,
        default: () => {
        }
    }
})

const store = useStore();
const Route = useRoute();
const emits = defineEmits(['setTotal',]);

const state = reactive({
    clientHeight: document.body.clientHeight - 548,
    option: useTableOption({}),
    tableData: [],
});
const getList = async () => {
    state.option.loading = true
    state.option.loading = false
    let res = await request.get("/api/FRRate/GetSaleRateList", {
        page: state.option.page,
        limit: state.option.pageSize,
        IsNewEffective: 1,
        ...props.search,
    })
    state.option.loading = false
    state.option.total = res.Total;
    emits("setTotal", state.option.total);
    state.tableData = res.Rows;
};
defineExpose({
    getList,
});
</script>
<style lang="scss" scoped>
:deep(.el-table) thead.is-group th.el-table__cell {
    font-size: 12px;
    background: var(--el-background-color-base) !important;
}

.app_page_table {
    // height: 100vh;
}

.mdg-block {
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;

    .mdg-text-hidden {
        width: calc(100% - 12px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .hover-img {
        width: 6px;
        height: 7px;
        padding-left: 4px;
    }
}

.FCL-hover {
    font-size: 12px;
    line-height: 20px;
    color: #303133;
}

:deep(.app_page_table) {
    height: 400px;
}

:deep(.el-table--group) {
    height: calc(400px - 32px);
}

:deep(.el-table__body-wrapper) {
    height: calc(400px - 114px);
    overflow: auto;
}

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
</style>