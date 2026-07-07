<template>
    <div class="main-body">
        <div class="title">运价商机</div>
        <searchComp @searchFun="searchFun" :form="search" @clearFun="clearFun" :searchList="searchList"></searchComp>
        <statisticsCom class="statistics">
            <div class="statistics-item">该条件下全部商机：<span>{{ tableOption.total }}</span></div>
            <div class="statistics-item">待受理商机：<span>{{ AllNum.NotCount }}</span></div>
            <div class="statistics-item">已受理商机：<span>{{ AllNum.InCount }}</span></div>
        </statisticsCom>
        <AppVxeTable :tableHeightMin="'calc(100% - 300px)'" :rowId="'Id'" ref="businessRef"
            :tableHeaderKey="'businessTable'" :toolbarConfig="true" class="vex-table-primary freight-table"
            :tableData="tableData" :tableOption="tableOption" @getTableList="getList()" :tableHeight="'1000'"
            :columnList="columnList">

            <template #OperatingStatus="{ row }">
                <div :class="row.OperatingStatus ? 'sure-class' : ''">
                    <span class="dot"></span>{{ !row.OperatingStatus ? '未受理' : '已受理' }}
                </div>
            </template>


            <template #Type="{ row }">
                <div>
                    {{ row.Type == 1 ? '询价' : '询盘' }}
                </div>
            </template>

            <template #User="{ row }">
                <div v-if="row.OperatingStatus">
                    {{ row.UserRealName }}<span v-if="row.UserMobilePhone">（{{ row.UserMobilePhone }}）</span>
                </div>
                <div v-else>******</div>
            </template>

            <template #box="{ row }">
                <div>
                    {{ row.Box + "*" + row.BoxAmount }}
                </div>
            </template>
        </AppVxeTable>
    </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import searchComp from '@/components/searchComp.vue';
import request from "@/public/request";
import AppVxeTable from "@/components/AppVxeTable.vue";
import statisticsCom from '@/components/statisticsCom.vue';
import { useStore } from "vuex";

const store = useStore();

const listType = ref('1')
const handleClick = () => {

}

const searchList = reactive([
    {
        label: '业务类型',
        type: 'select',
        placeholder: "请选择业务类型",
        prop: 'Type',
        dataLabel: 'label',
        value: 'value',
        data: [
            {
                value: '1',
                label: '询价'
            },
            {
                value: '2',
                label: '询盘'
            }
        ]
    },
    {
        label: '起运港',
        type: 'Pol'
    },
    {
        label: '目的港',
        type: 'destPort'
    },
    {
        label: '有效时间',
        type: 'daterange',
        prop: 'date'
    },
    {
        label: '箱型',
        type: 'select',
        placeholder: "请选择箱型",
        prop: 'Box',
        dataLabel: 'value',
        value: 'value',
        data: [
            {
                value: '20GP'
            },
            {
                value: '40GP'
            },
            {
                value: '40HQ'
            }
        ]
    },
])



// 搜索
const searchFun = (form) => {
    search.value = form
    getList()
}

const clearFun = (form) => {
    search.value = form
    getList()
}

// 列表
const tableData = ref([])
const columnList = reactive([
    {
        title: '商机状态',
        field: 'OperatingStatus',
        type: 'slot',
        slotName: 'OperatingStatus',
        width: 120
    },
    {
        title: '商机类型',
        field: 'Type',
        type: 'slot',
        slotName: 'Type',
        width: 120
    },
    {
        title: '询价时间',
        field: 'CreateTime',
        width: 200
    },

    {
        title: '询价人',
        field: 'User',
        type: 'slot',
        slotName: 'User',
        width: 200
    },
    {
        title: '受理人',
        field: 'OperatingEmployeeName',
        width: 200
    },
    {
        title: '起运港',
        field: 'PolEnPortName',
        width: 120
    },
    {
        title: '目的港',
        field: 'DestEnPortName',
        width: 120
    },
    {
        title: '开始有效期',
        field: 'StartTime',
        width: 140
    },
    {
        title: '结束有效期',
        field: 'EndTime',
        width: 140
    },
    {
        title: '备注',
        field: 'SpecialRemark',
        minWidth: 200
    }
])
const tableOption = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
})
const search = ref({})
const getList = async () => {
    try {
        tableOption.loading = true
        let pd = JSON.parse(JSON.stringify(search.value))
        pd.Page = tableOption.page
        pd.Limit = tableOption.pageSize
        // pd.RateProviderCompanyId = store.state.auth.employee.CompanyId
        if (pd.date) {
            pd.StartTime = pd.date[0]
            pd.EndTime = pd.date[1]
            delete pd.date
        }
        pd.CompanyId = store.state.auth.employee.CompanyId
        const res = await request.post('/api/CargoRate/SelectCompanyBusinessDocuments', pd)
        tableData.value = res.Rows
        tableOption.total = res.Total
        console.log(res)
    } catch (error) {
        console.log(error)
    } finally {
        tableOption.loading = false
    }
}

const AllNum = ref({
    NotCount: 0,
    InCount: 0
})
const getAll = async () => {
    try {
        let pd = {}
        pd.Page = tableOption.page
        pd.Limit = tableOption.pageSize
        pd.CompanyId = store.state.auth.employee.CompanyId
        const res = await request.post('/api/CargoRate/SelectCompanyBusinessDocuments', pd)
        if (res.Rows && res.Rows.length) {
            console.log(res.Rows[0].InCount)
            AllNum.value.NotCount = res.Rows[0].NotCount
            AllNum.value.InCount = res.Rows[0].InCount
        }
        console.log(res)
    } catch (error) {
        console.log(error)
    } finally {
    }
}

onMounted(async () => {
    await getList()
    await getAll()
})
</script>

<style lang="scss" scoped>
.main-body {
    padding: 8px;
    background-color: #fff;
    min-width: 900px;

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

    :deep(.el-tabs__nav-scroll) {
        display: flex;
        justify-content: center;
    }

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #DCDCDC;
        display: inline-block;
        margin-right: 3px;
    }

    .sure-class {
        .dot {
            background-color: #FD953E;
        }
    }
}

.title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
}

.text-btn {
    color: #FD953E;
    cursor: pointer;
}

.handleDialog-title {
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
    margin-top: 24px;
    border-bottom: 1px solid #DCDFE6;
    color: #323233;
}

.handleDialog-info {
    margin-top: 8px;
    font-size: 12px;
    line-height: 20px;
    color: #323233;

    :deep(.el-input__inner) {
        height: 24px;
        line-height: 24px;
    }

    :deep(.el-form-item__label) {
        font-size: 12px;
        color: #000;
    }
}

.row-expand-content {
    padding: 0 1px;
}

.statistics {
    margin: 8px 0;

    .statistics-item {
        margin-right: 6px;

        span {
            color: #3B78FF;
        }
    }

}

:deep(.vxe-table--body-wrapper) {
    min-height: calc(100vh - 370px);
}
</style>