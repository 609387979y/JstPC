<template>
    <div class="main-body">
        <div class="title">优势航线</div>

        <el-button type="primary" class="btn-class" size="mini" @click="save">保存</el-button>
        <AppVxeTable :rowId="'Id'" v-loading ref="businessRef" :tableHeaderKey="'businessTable'" :toolbarConfig="true"
            :tableOption="tableOption" class="vex-table-primary freight-table" :tableData="tableData"
            @getTableList="getList()" :tableHeight="'1000'" :columnList="columnList">
            <template #name="{ row }">
                <el-checkbox @change="(e) => { changeLine(row) }" v-model="row.isCheck" :label="row.LineName"
                    :value="row.LineName" size="large" />
            </template>
            <template #son="{ row }">
                <el-checkbox v-for="value in row.LineDetail" @change="(e) => { change(e, row) }" v-model="value.isCheck"
                    :key="value.Id" :label="value.Id">
                    <span>{{
                        value.LineDetailName }}</span>
                </el-checkbox>
            </template>
        </AppVxeTable>
    </div>

</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import AppVxeTable from "@/components/AppVxeTable.vue";
import request from "@/public/request";
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex'

const store = useStore();

const tableOption = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
})

const tableData = ref([
    {
        name: '中东红海',
        son: [
            '红海',
            '中东'
        ]
    }
])

const getList = async () => {
    tableOption.loading = true
    try {
        const res = await request.get("/api/FRLine/GetLineList");
        res.Rows.forEach(item => {
            item.isCheck = false
            item.LineDetail.forEach(son => {
                son.isCheck = false
            })
        })
        tableData.value = res.Rows
        getChek()
    } catch (error) {

    } finally {
        tableOption.loading = false
    }
}

const getChek = async () => {
    const res = await request.get("/api/CargoRate/SelectLineInfo", { CompanyId: employee.value.CompanyId })
    if (res && res.Data && res.Data instanceof Array) {
        try {
            res.Data.forEach(item => {
                tableData.value.forEach(table => {
                    if (item.LineId == table.Id) {
                        table.isCheck = true
                        item.LineDetails.forEach(son => {
                            table.LineDetail.forEach(son2 => {
                                if (son.LineDetailId == son2.Id) {
                                    son2.isCheck = true
                                }
                            })
                        })
                    }
                })
            })
        } catch (error) {
            console.log(error)
        }

    }
}


const change = (e, row) => {
    console.log(row)
    let sonCheck = false
    row.LineDetail.forEach(item => {
        console.log(item.isCheck)
        if (item.isCheck) {
            sonCheck = true
        }
    })

    if (sonCheck) {
        row.isCheck = true
    } else {
        row.isCheck = false
    }
    // selectLine.value = []
    // e.forEach(item => {
    //     selectLine.value.push({
    //         LineId,
    //         LineDetaiId: item
    //     })
    // })
    // console.log(selectLine.value)
}

const changeLine = (row) => {
    row.LineDetail.forEach((item) => {
        item.isCheck = row.isCheck
    })
}

const employee = computed(() => {
    if (store.state.auth.employee) {
        return store.state.auth.employee;
    } else {
        return {};
    }
});

const save = async () => {
    let pd = []
    tableData.value.forEach(item => {
        item.LineDetail.forEach(son => {
            if (son.isCheck) {
                pd.push({
                    CompanyId: employee.value.CompanyId,
                    LineId: item.Id,
                    LineDetaiId: son.Id
                })
            }
        })
    })

    console.log(pd)

    const res = await request.post('/api/CargoRate/CreateAdvantageLine', pd)
    if (!res.Status) return ElMessage.error(res.Message)

    ElMessage.success('成功')
    getList()
}

onMounted(() => {
    getList()
})

const columnList = [
    {
        title: '航线名称',
        type: 'slot',
        slotName: 'name',
        field: 'name',
        width: 150
    },
    {
        title: '细分航线',
        type: 'slot',
        slotName: 'son',
        field: 'son'
    }
]

</script>

<style lang="scss" scoped>
.main-body {
    padding: 8px;
    background-color: #fff;
    min-width: 900px;

    .title {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 8px;
    }

}
</style>