<template>
    <div class="main-body">
        <div class="title">企业商机</div>
        <el-tabs v-model="listType" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="未受理" name="1"></el-tab-pane>
            <el-tab-pane label="已受理" name="2"></el-tab-pane>
        </el-tabs>
        <searchComp @searchFun="searchFun" :searchList="searchList"></searchComp>
        <AppVxeTable v-loading="loading" :tableHeightMin="'calc(100% - 300px)'" :key="tableData" :rowId="'Id'"
            ref="businessRef" :tableHeaderKey="'businessTable'" :toolbarConfig="true"
            class="vex-table-primary freight-table" :tableData="tableData" :tableOption="tableOption"
            @getTableList="getList()" :tableHeight="'1000'" :columnList="columnList">
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
                        <sonTable :BusinessDocumentsId="row.Id" Type="2" :tableData="tableData[rowIndex].sonTable"
                            :sonColumnList="sonColumnList"></sonTable>
                    </div>
                </template>
            </vxe-column>

            <vxe-column title="操作" sortable width="120" :resizable="true">
                <template #default="{ row }">
                    <div class="text-btn" @click="handleFun(row)">{{ !row.OperatingStatus ? '受理' : '查看详情' }}</div>
                </template>
            </vxe-column>


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

            <template #User="{ row }" v-if="listType != 1 && !loading">
                <div>
                    {{ row.UserRealName }}<span v-if="row.UserMobilePhone">（{{ row.UserMobilePhone }}）</span>
                </div>
            </template>
            <template #User="{ row }" v-else>
                <div>
                    ******
                </div>
            </template>
        </AppVxeTable>
    </div>
    <el-dialog v-model="handleDialog" title="受理商机">
        <div class="handleDialog-title">询价信息</div>
        <div class="handleDialog-info">
            <div class="handleDialog-info-item">
                起运港: NINGBO 宁波
            </div>
            <div class="handleDialog-info-item">
                目的港: FELIXSTOWE 弗利克斯托
            </div>
            <div class="handleDialog-info-item">
                开始有效期：2023-09-12
            </div>
            <div class="handleDialog-info-item">
                结束有效期：2023-09-12
            </div>
            <div class="handleDialog-info-item">
                箱型箱量：40GP*1
            </div>
            <div class="handleDialog-info-item">
                备注：船名航次：AEU5 6.11 EVER GLOBE 1404W
            </div>

        </div>

        <div class="handleDialog-title">处理商机</div>
        <div class="handleDialog-info">
            <el-form :model="handleForm" ref="handleFormRef" :rules="rules">
                <el-form-item label="报价（USD）" prop="OperatingRate">
                    <el-input v-model="handleForm.OperatingRate"></el-input>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input v-model="handleForm.OperatingRateRemark"></el-input>
                </el-form-item>
            </el-form>
        </div>

        <template #footer>
            <div style="text-align: center;">
                <el-button @click="handleDialog = false">取消</el-button>
                <el-button type="primary" @click="sureFun" class="contact-price-buttom">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
    <chatDetail :key="dialogKey" :dialog="chatDialog"></chatDetail>
</template>

<script setup>
import { useStore } from "vuex";
import { nextTick, onMounted, reactive, ref, computed } from 'vue';
import searchComp from '@/components/searchComp.vue';
import request from "@/public/request";
import AppVxeTable from "@/components/AppVxeTable.vue";
import sonTable from './components/sonTable.vue';
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import chatDetail from "./components/chatDetail.vue";
import { ArrowRight } from "@element-plus/icons";

const router = useRouter()

const listType = ref('1')

const handleClick = () => {
    loading.value = true
    search.value.OperatingStatus = listType.value != 1
    getList()
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

// 列表
const tableData = ref([])
const columnList = reactive([
    {
        title: '商机类型',
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
        title: '询价人',
        field: 'User',
        type: 'slot',
        slotName: 'User',
        width: 200
    },
    {
        title: '专属客服',
        field: 'ExclusiveSalesName',
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
        width: 200
    }
])
const tableOption = reactive({
    page: 1,
    pageSize: -1,
    total: 0,
    loading: false,
})

// 搜索
const searchFun = (form) => {
    search.value = form
    search.value.OperatingStatus = listType.value != 1
    getList()
}

const sonColumnList = reactive([
    {
        title: '操作',
        field: 'cz',
        type: 'slot',
        slotName: 'cz',
        width: 120
    },
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

const employee = computed(() => {
    return store.state.auth.employee
});

const chatDialog = ref(false)

// 受理
const dialogKey = ref(false)
const handleFun = (row) => {
    if (!employee.value) return ElMessage.warning('请先进行职业认证')
    if (row.OperatingStatus) {
        if (row.OperatingEmployeeId == employee.value.Id) {
            router.push({ path: '/internal/ChatWin' + row.Id + '1', query: { BusinessDocumentsId: row.Id, Type: 2 } })
        } else {
            chatDialog.value = true
            dialogKey.value = !dialogKey.value
        }
        return
    }

    if(row.ExclusiveSalesId && row.ExclusiveSalesId !=employee.value.Id){
        ElMessage.warning('请联系专属销售处理')
    }
    handleDialog.value = true
    handleForm.OperatingRate = ''
    handleForm.OperatingRateRemark = ''
    handleForm.Id = row.OperatingDetailsId
    nextTick(() => {
        handleFormRef.value.clearValidate()
    })
}
const handleDialog = ref(false)
const handleForm = reactive({})
const rules = reactive({
    OperatingRate: [{ required: true, message: "请填写报价", trigger: "blur" }]
});

// 确定
const handleFormRef = ref(null)
const sureFun = async () => {
    const valid = await handleFormRef.value.validate()
    if (!valid) return
    try {
        handleForm.OperatingStatus = true
        const res = await request.post('/api/CargoRate/BusinessDocumentsStatus', handleForm)
        if (!res.Status) return ElMessage.error(res.Message)
        ElMessage.success('成功')
        getList()
        getChatMenuTwo()
    } catch (error) {

    }
    console.log(valid)
}

const getChatMenuTwo = async () => {
    let arr = []
    const res = await request.get('/api/CargoRate/GroupByBusinessDocumentsDetails')
    let oldArr = []


    if (store.state.menu.replyList.length) {
        store.state.menu.replyList[store.state.menu.replyList.length - 1].info.forEach(item => {
            oldArr.push(item.url)
        })
    }
    let path, name, BusinessDocumentsId = ''
    res.Data[res.Data.length - 1].info.forEach(item => {
        if (oldArr.indexOf("/internal/ChatWin" + item.Id) == -1) {
            path = "/internal/ChatWin" + item.Id + '1'
            name = 'ChatWin' + item.Id + '1'
            BusinessDocumentsId = item.Id
        }
    })
    router.addRoute('internal', {
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
                url: "/internal/ChatWin" + item.Id + '1',
                query: { BusinessDocumentsId: item.Id, Type: '2' },
                icon: item.Type == 1 ? 'menu7.svg' : 'menu8.svg',
                iconActive: item.Type == 1 ? 'menu7Active.svg' : 'menu8Active.svg'
            })
        })

    })

    console.log(arr)

    store.commit("menu/setReplyList", arr);
    router.push({ path: path, query: { BusinessDocumentsId: BusinessDocumentsId, Type: '2' } })
}

const search = ref({
    OperatingStatus: false
})

const store = useStore();

const loading = ref(false)

const getList = async () => {
    loading.value = true
    try {
        let pd = JSON.parse(JSON.stringify(search.value))
        pd.Page = tableOption.page
        pd.Limit = tableOption.pageSize
        pd.CompanyId = store.state.auth.employee.CompanyId
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
        console.log(error)
    } finally {
        setTimeout(() => {
            loading.value = false
        }, 300)

    }
}
const businessRef = ref(null)
const toggleExpand = async (row) => {
    row.expand = row.expand || false
    row.expand = !row.expand;
    businessRef.value.xTable.toggleRowExpand(row);
    row.loading = true;

    let res = await request.get("/api/CargoRate/PriceComparison", {
        BusinessDocumentsId: row.Id,
        BusinessDocumentsDetailsId: row.OperatingDetailsId
    });
    row.loading = false;
    row.sonTable = res.Data
    console.log(res)
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
    min-height: calc(100vh - 370px);
}
</style>