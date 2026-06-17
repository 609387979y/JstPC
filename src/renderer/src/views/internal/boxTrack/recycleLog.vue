<template>
    <JstCardLayout>
        <template #title>
            <div class="fast-cargo-card-title">回收站</div>
        </template>
        <el-tabs v-model="state.activeName" type="card" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="宁波港" name="ningbo"></el-tab-pane>
            <div class="table-title">
                <el-button type="primary" @click="batchRestore">还原</el-button>
                <div class="right body-input demo-input-suffix">
                    <el-select v-model="state.search.Type" class="m-2" placeholder="Select" size="small"
                        @change="initSearch">
                        <el-option v-for="item in state.typeList" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <el-input v-model="state.search.No" :placeholder="inputTip" clearable>
                        <template #suffix>
                            <el-icon class="el-input__icon">
                                <Search @click="initSearch" style="cursor: pointer;" />
                            </el-icon>
                        </template>
                    </el-input>
                </div>
            </div>
            <div class="table-body">
                <JstPageTable @change="getList" :data="data" :option="tableOption">
                    <el-table-column type="selection" width="40px"></el-table-column>
                    <el-table-column label="港口" prop="polName" min-width="150px" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="提单号" prop="billNo" min-width="120px"></el-table-column>
                    <el-table-column label="箱号" prop="containerNo" min-width="120px"></el-table-column>
                    <el-table-column label="船公司" prop="carrierCode" min-width="100px"></el-table-column>
                    <el-table-column label="船名/航次" prop="CreateTime" min-width="150px">
                        <template #default="{ row }">
                            <div v-if="row.vessel && row.voyage">{{ row.vessel }}/{{ row.voyage }}</div>
                            <div v-else>--</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="CreateTime" width="100px" align="center">
                        <template #default="{ row }">
                            <el-button type="text" size="mini" @click="restore(row.Id)">还原</el-button>
                        </template>
                    </el-table-column>
                </JstPageTable>
            </div>
        </el-tabs>
    </JstCardLayout>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, computed } from "vue";
import { Search } from '@element-plus/icons';
import { utils, useTableOption } from "justom-share";
import request from "@/public/request";
import { ElMessage, ElMessageBox } from "element-plus";
export default defineComponent({
    components: {
        Search
    },
    setup() {
        const tableOption = useTableOption({
            selectFilter(item) {
                return item.Id
            }
        })
        const state = reactive({
            activeName: 'ningbo',
            input1: '',
            typeList: [{ label: '全部', value: 0 }, { label: '按箱号显示', value: 2 }, { label: '按提单显示', value: 1 }],
            search: {
                No: '',
                Type: 0
            }
        })
        const inputTip = computed(() => {
            let tip = {
                0: '请输入提单号或箱号查询',
                2: '请输入箱号查询',
                1: '请输入提单号查询'
            }
            return tip[state.search.Type]
        })
        const data = ref([]);
        async function getList() {
            tableOption.loading = true;
            state.search.No = state.search.No ? state.search.No.trim() : ''
            let res = await request.get("/api/CT_TrackOcean/GetDeleteList", {
                Page: tableOption.page,
                Limit: tableOption.pageSize,
                ...state.search
            })
            tableOption.total = res.Total;
            data.value = res.Rows;
            tableOption.loading = false;
        }
        function initSearch() {
            tableOption.Page = 1;
            getList();
        }
        async function batchRestore() {
            if (tableOption.selected.length == 0) return ElMessage.warning('请至少选择一项数据')
            console.log(tableOption.selected);
            const check = await ElMessageBox.confirm(
                '确定要继续跟踪该提单吗?',
                '还原提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            if (!check) return
            const res = await request.post('/api/CT_TrackOcean/Restore', { idList: tableOption.selected });
            if (!res.Status) return ElMessage.console.error(res.Message)
            ElMessage.success(res.Message)
            initSearch()
        }
        async function restore(id) {
            const check = await ElMessageBox.confirm(
                '确定要继续跟踪该提单吗?',
                '还原提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            if (!check) return
            const res = await request.post('/api/CT_TrackOcean/Restore', { idList: [id] });
            if (!res.Status) return ElMessage.console.error(res.Message)
            ElMessage.success(res.Message)
            initSearch()
        }
        function handleClick() {
        }
        onMounted(() => {
            getList();
        })
        return {
            state,
            handleClick,
            tableOption,
            getList,
            initSearch,
            data,
            batchRestore,
            restore,
            inputTip
        }
    },
})
</script>

<style lang="scss" scoped>
.fast-cargo-card-title {
    font-size: 14px;
    color: #3C4144;
    font-weight: 400;
}

/* tabs样式 */
:deep(.el-tabs--card>.el-tabs__header .el-tabs__item) {
    height: 35px;
    line-height: 35px;
}

.table-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .right {
        width: 400px;
        display: flex;
    }
}

.table-body {
    margin-top: 15px;
}

:deep(.app_page_table .el-table__header th) {
    background-color: #d9ecff !important;
    color: #3C4144;
    padding: 0px 0px;
}

:deep(.el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell) {
    border-bottom: 1px solid #E4E7ED;
}

:deep(.el-table--border .el-table__cell) {
    border-right: 1px solid #E4E7ED;
}

:deep(.el-table--group, .el-table--border) {
    border: 1px solid #E4E7ED;
}

:deep(.el-table--small .el-table__cell) {
    padding: 4px 0;
}

:deep(.el-select--small) {
    width: 180px;
    margin-right: 10px
}
</style>
<style>
.el-message-box__btns button:nth-child(2) {
    background-color: #409EFF !important;
    color: white;
}
</style>