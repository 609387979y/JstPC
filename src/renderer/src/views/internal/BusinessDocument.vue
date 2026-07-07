<template>
    <div class="main-body">
        <div class="title">询价记录</div>
        <searchComp @searchFun="searchFun" :form="search" @clearFun="clearFun" :searchList="searchList"></searchComp>
        <AppVxeTable :rowId="'Id'" ref="businessRef" :tableHeaderKey="'businessTable'" :key="tableData"
            :toolbarConfig="true" class="vex-table-primary freight-table" :tableData="tableData"
            :tableOption="tableOption" @getTableList="getList()" :tableHeight="'1000'" :columnList="columnList">
            <vxe-column type="expand" title="更多" width="50">
                <template #default="{ row }">
                    <span class="toggle-btn" @click="toggleExpand(row)">

                        <el-icon class="toggle-icon" :class="row.expand ? 'expanded' : ''">
                            <ArrowRight />
                        </el-icon>

                    </span>
                </template>
                <template #content="{ row, rowIndex }">
                    <div class="row-expand-content">
                        <sonTable :BusinessDocumentsId="row.Id" Type="1" :tableData="tableData[rowIndex].sonTable"
                            :sonColumnList="sonColumnList"></sonTable>
                    </div>
                </template>
            </vxe-column>

            <template #cz="{ row }" v-if="!nobtn">
                <div class="text-btn" @click="goChat(row)">查看聊天</div>
            </template>

            <template #Type="{ row }">
                <div>
                    {{ row.Type == 1 ? '询价' : '询盘' }}
                </div>
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
import sonTable from './components/sonTable.vue';
import { ArrowRight } from "@element-plus/icons";
import { useRouter } from "vue-router";
const router = useRouter()

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
    search.value = {}
    getList()
}


// 列表
const tableData = ref([])
const columnList = reactive([
    {
        title: '操作',
        field: 'cz',
        type: 'slot',
        slotName: 'cz',
        width: 120
    },
    {
        title: '业务类型',
        field: 'Type',
        type: 'slot',
        slotName: 'Type',
        width: 120
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
        title: '箱型箱量',
        field: 'box',
        type: 'slot',
        slotName: 'box',
        width: 140
    },
    {
        title: '备注',
        field: 'SpecialRemark',
        width: 200
    },
    {
        title: '询价时间',
        field: 'CreateTime',
        width: 140
    },
])
const tableOption = reactive({
    page: 1,
    pageSize: -1,
    total: 0,
    loading: false,
})

const sonColumnList = reactive([
    {
        title: '供应商',
        field: 'CompanyName',
        width: 120
    },
    {
        title: '报价',
        field: 'Price',
        width: 120
    },
    {
        title: '备注',
        field: 'Remark'
    },
    {
        title: '回复时间',
        field: 'CreateTime',
        width: 200
    },
])


const search = ref({})


const getList = async () => {
    try {
        tableOption.loading = true
        let pd = JSON.parse(JSON.stringify(search.value))
        pd.Page = tableOption.page
        pd.Limit = tableOption.pageSize
        if (pd.date) {
            pd.StartTime = pd.date[0]
            pd.EndTime = pd.date[1]
            delete pd.date
        }
        const res = await request.post('/api/CargoRate/SelectBusinessDocuments', pd)
        tableData.value = res.Rows
        tableOption.total = res.Total
        console.log(res)
    } catch (error) {

    } finally {
        tableOption.loading = false
    }
}

const goChat = (row) => {
    const path = '/internal/ChatWin' + row.Id
    router.push({ path: path, query: { BusinessDocumentsId: row.Id, Type: '1' } })
}

const businessRef = ref(null)
const toggleExpand = async (row) => {
    row.expand = row.expand || false
    row.expand = !row.expand;
    businessRef.value.xTable.toggleRowExpand(row);
    row.loading = true;

    let res = await request.get("/api/CargoRate/PriceComparison", {
        BusinessDocumentsId: row.Id,
    });
    row.loading = false;
    row.sonTable = res.Data
    console.log(row.sonTable)
}

onMounted(async () => {
    await getList()
})

</script>

<style lang="scss" scoped>
.main-body {
    padding: 8px;
    background-color: #fff;
    min-width: 900px;
    height: 100%;
    box-sizing: border-box;

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

:deep(.vxe-table--expanded) {
    display: none;
}

.expanded {
    transform: rotate(90deg);
}

:deep(.vxe-table--body-wrapper) {
    min-height: calc(100vh - 320px);
}
</style>