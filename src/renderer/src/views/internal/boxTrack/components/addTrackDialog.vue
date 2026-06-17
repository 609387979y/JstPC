<template>
    <div class="addTrack">
        <el-dialog v-model="state.dialogVisible" title="跟踪费用信息" width="600px" :before-close="handleClose">
            <div style="font-size: 12px;
color: #3C4144;font-weight:500">订阅跟踪清单</div>
            <div class="table-container">
                <el-table :data="state.tableData" border style="width: 100%" size="mini" max-height="300px">
                    <el-table-column type="index" label="序号" min-width="50" align="center" />
                    <el-table-column label="提单号" min-width="100" align="left">
                        <template #default="{ row }">
                            <div class="cell-div">{{ row.billNo }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="箱号" min-width="100" align="left">
                        <template #default="{ row }">
                            <div class="cell-div">{{ row.containerNo }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="价格" min-width="40" align="center">
                        <template #default="{ row }">
                            <div class="jsb"><img src="@/assets/boxTrack/jsb.svg" alt="">{{ row.Amount }}</div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="sumPrice">
                    <div>共计消费</div>
                    <div class="jsb sum-font" style="justify-content: right;font-size: 20px;padding-right: 18px;"><img
                            src="@/assets/boxTrack/jsb.svg" alt=""> {{ state.sumPrice }}</div>
                </div>
            </div>
            <div class="tooltip">
                <div>提示说明：</div>
                <div>请谨慎核对提单号，确认后将扣除相应费用；同个订单号订阅将不再重复扣费。</div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submit" :loading="state.btnLoading">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue"
import request from "@/public/request";
import { ElMessage } from 'element-plus';
export default defineComponent({
    setup(props, context) {
        let state = reactive({
            dialogVisible: false,
            /* 结算列表 */
            tableData: [] as object[],
            /* 总价格 */
            sumPrice: 0,
            btnLoading: false
        })
        let params = reactive({
        }) as any
        /* 取消跟踪，数据置空，关闭对话框 */
        function handleClose() {
            state.dialogVisible = false;
            state.tableData = [];
            state.sumPrice = 0;
        }
        /*打开对话框,计算费用 */
        async function handleOpen(Data: object[]) {
            console.log(Data);

            const result = await request.post('/api/CT_TrackOcean/CalcSendAmount', Data);
            if (!result.Status) return ElMessage.error(result.Message);
            params = Data;
            state.dialogVisible = true;
            state.sumPrice = result.Data.TotalAmount;
            state.tableData = result.Data.Items;
        }
        /* 确认跟踪*/
        async function submit() {
            state.btnLoading = true;
            params.forEach((t: any) => {
                t.BillNo = t.BillNo.trim()
                t.containerNo = t.containerNo.trim()
            })
            const result = await request.post('/api/CT_TrackOcean/Subscribe', params);
            state.btnLoading = false
            if (!result.Status) return ElMessage.error(result.Message);
            ElMessage.success(result.Message);
            handleClose();
            /* initSubmit为刷新订阅列表数据，reset则是清空查询项,rulesTs是校验推送 */
            context.emit('initSubmit');
            context.emit('reset');
            context.emit('rulesTs', result)
        }
        return {
            state,
            handleClose,
            handleOpen,
            submit,
        }
    },
})
</script>

<style lang="scss">
.addTrack .el-dialog__header {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.addTrack .el-dialog__body {
    padding: 0 16px 16px 16px;
}

.addTrack .el-dialog__headerbtn {
    position: relative;
    top: 0;
    right: 0;
    height: 16px;
}

.addTrack .el-dialog__header .el-dialog__title {
    font-size: 14px;
    color: #3C4144;
    font-weight: 500;
}

.addTrack .el-dialog__footer {
    padding: 20px;
    text-align: center;
}

.addTrack .el-table--border th.el-table__cell {
    border-right: none;
}


.addTrack .el-table--border th.el-table__cell {
    background: #F8F8F8 !important;
}

.addTrack .el-table th.el-table__cell>.cell {
    font-size: 12px;
    color: #969799 !important;
}

.addTrack .el-table .cell {
    padding: 0 8px !important;
}
</style>
<style scoped>
.cell-div {
    padding: 2px 0;
    font-size: 12px;
    color: #000000;
    font-weight: 500;
}

.sumPrice {
    width: calc(100% - 2px);
    display: flex;
    border: 1px solid #EBEEF5;
    border-top: none;
    font-size: 12px;
    color: #3C4144 !important;
}

.sumPrice div {
    flex: 1;
    text-align: center;
    height: 40px;
    line-height: 40px;
}

.sumPrice div:nth-child(1) {
    flex: 2;
    border-right: 1px solid #E4E7ED;
    text-align: right;
    padding-right: 8px;
}

.sumPrice:nth-child(1) {
    border-bottom: none;
}

.tooltip {
    margin-top: 16px;
    font-size: 14px;
    color: #969799;
    line-height: 25px;
    margin-bottom: 10px;
}

.tooltip div:nth-child(2) {
    font-size: 12px;
}

.table-container {
    margin-top: 4px
}

.jsb {
    display: flex;
    align-items: center;
    justify-content: center;
}

.jsb img {
    margin-right: 4px;
}

.sum-font {
    font-size: 28px;
    color: #FA6400;
    font-weight: 500;
}

.dialog-footer .el-button--small {
    padding: 9px 35px !important;
    font-size: 14px;
}
</style>