<template>
    <div class="check-status">
        <el-icon v-if="item.CheckStatus === 2" class="icon" title="验证通过" style="color:#52C41A;">
            <success-filled />
        </el-icon>
        <el-icon @click="openDialog" v-else-if="item.CheckStatus === 1" class="icon" title="存在警告"
            style="color:#FAB253;">
            <warning-filled />
        </el-icon>
        <el-icon @click="openDialog" v-else-if="item.CheckStatus === 0" class="icon" title="验证失败"
            style="color:#F5222D;">

            <circle-close-filled />
        </el-icon>
        <el-dialog v-model="showDialog" width="520px">
            <template #title>
                <div class="dialog-title">提示</div>
            </template>
            <div style="margin-bottom: 30px;" class="message">存在以下校验不通过，请按要求修改：</div>

            <el-table border :data="item.Errors">
                <el-table-column label="校验字段" prop="PropName"></el-table-column>
                <el-table-column label="校验对象" prop="Value"></el-table-column>
                <el-table-column label="校验结果" prop="Msg">
                    <template #default="scope">
                        <div style="margin-left:10px">
                            <el-icon v-if="item.CheckStatus === 2" title="验证通过" style="color:#52C41A;font-size:12px">
                                <success-filled />
                            </el-icon>
                            <el-icon v-else-if="item.CheckStatus === 1" title="存在警告"
                                style="color:#FAB253;font-size:12px">
                                <warning-filled />
                            </el-icon>
                            <el-icon v-else-if="item.CheckStatus === 0" title="验证失败"
                                style="color:#F5222D;font-size:12px">

                                <circle-close-filled />
                            </el-icon>
                            {{ scope.row.Msg }}
                        </div>

                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>

</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { SuccessFilled, WarningFilled, CircleCloseFilled } from "@element-plus/icons"
interface CheckError {
    /**
     * 数组下标
     */
    ArrIdx: number,
    /**
     * 错误等级  0->错误  1->警告   2->成功
     */
    Level: number,
    /**
     * 错误信息
     */
    Msg: string,
    /**
     * 字段
     */
    Prop: string,
    /**
     * 字段名
     */
    PropName: string,
    /**
     * 值
     */
    Value: string
}
interface CheckState {
    /**
     * 箱号
     */
    CGO_CNNO: string,
    /**
     * 错误状态  0->错误  1->警告   2->成功
     */
    CheckStatus: number,
    /**
     * 错误信息
     */
    Errors: CheckError[],
    /**
     * VGM
     */
    VGM: number
}
export default defineComponent({
    components: {
        SuccessFilled,
        WarningFilled,
        CircleCloseFilled
    },
    props: {
        item: {
            type: Object as PropType<CheckState>,
            required: true
        }
    },
    data() {
        return {
            showDialog: false,
        }
    },
    methods: {
        openDialog() {
            this.showDialog = true
        }
    },
    created() {

    }
})
</script>

<style lang='scss' scoped>
.icon {
    cursor: pointer;
    font-size: 16px;
}

.dialog-title {

    font-size: 16px;
    color: #3C4144;
    letter-spacing: 0;
    font-weight: 500;
    text-align: center;
}

.check-status {
    height: 16px;
    text-align: center;
    :deep(.el-dialog__header) {
        opacity: 0.69;
        background: #F0F9EA;
        padding-top: 11px;
        padding-bottom: 11px;
    }

    :deep(.el-dialog__headerbtn) {
        top: 11px;
    }

    .message {

        font-size: 14px;
        color: #3C4144;
        letter-spacing: 0;
        font-weight: 500;
    }
}
</style>