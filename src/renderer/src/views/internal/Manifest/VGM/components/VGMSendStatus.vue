<template>
    <div class="check-status">
        <template v-if="info.Status === 2">
            <!-- 主单发送失败 -->

            <el-popover title="失败" :width="200" trigger="hover" :content="info.FailReason">
                <template #reference>
                    <el-icon class="icon" title="失败" style="color:#F56C6C;">
                        <circle-close-filled />
                    </el-icon>
                </template>
            </el-popover>

        </template>
        <template v-else>
            <el-icon v-if="item.Status === 2" class="icon" title="成功" style="color:#67C23A;">
                <success-filled />
            </el-icon>


            <el-popover v-else-if="item.Status === 1" title="失败" :width="200" trigger="hover"
                :content="item.FailReason">
                <template #reference>

                    <el-icon class="icon" title="失败" style="color:#F56C6C;">
                        <circle-close-filled />
                    </el-icon>

                </template>
            </el-popover>


            <el-icon v-else-if="item.Status == 0" class="icon" title="等待回执中" style="color:#E4E7ED;">
                <remove-filled />
            </el-icon>
        </template>


    </div>

</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { SuccessFilled, WarningFilled, CircleCloseFilled, RemoveFilled } from "@element-plus/icons"

interface SendStatus {
    /**
     * VGM
     */
    VGM: string
    /**
     * 箱号
     */
    CGO_CNNO: string
    /**
     * 错误状态  0->还没接收到状态  1->失败   2->成功
     */
    Status: number
    /**
     * 失败原因
     */
    FailReason: string

}

export default defineComponent({
    components: {
        SuccessFilled,
        WarningFilled,
        CircleCloseFilled,
        RemoveFilled
    },
    props: {
        item: {
            type: Object as PropType<SendStatus>,
            required: true
        },
        info: {
            type: Object as PropType<any>,
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