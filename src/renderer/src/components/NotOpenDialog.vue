<template>
    <el-dialog custom-class="jst-not-open-dialog" :show-close="false" v-model="show" width="336px">
        <div class="dialog-header">
            <div></div>
            <div>
                <el-icon @click="closeDialog" class="close-btn">
                    <Close />
                </el-icon>
            </div>
        </div>

        <template v-if="type === 'default'">
            <div class="content">
                <img src="@/assets/jst-not-open.svg" />
                <div style="margin-top:20px" class="title">很抱歉，该功能暂未开放</div>
                <div style="margin-top: 4px;" class="info">详细信息请致电客服进行了解</div>
                <div class="btn">
                    <el-button
                        @click="closeDialog"
                        style="width: 100px;"
                        size="large"
                        type="primary"
                    >确认</el-button>
                </div>
            </div>
        </template>
        <template v-else-if="type === 'manifest'">
            <div class="content">
                <img src="@/assets/manifest-not-open.svg" />
                <div style="margin-top:20px" class="title">很抱歉，该功能暂未开放</div>
                <div style="margin-top: 4px;" class="info">详细信息请致电客服进行了解</div>
                <div class="btn manifest">
                    <el-button
                        @click="closeDialog"
                        style="width: 100px;"
                        size="large"
                        type="primary"
                    >确认</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { defineComponent } from "vue"
import { Close } from "@element-plus/icons"
export default defineComponent({
    components: {
        Close
    },
    props: {
        type: {
            type: String,
            default: "default" // default / manifest
        }
    },
    data() {
        return {
            show: false
        }
    },
    methods: {
        showDialog() {
            this.show = true;
        },
        closeDialog() {
            this.show = false
        }
    },
    created() {

    }
})
</script>

<style lang='scss' >
.jst-not-open-dialog {
    .el-dialog__header {
        padding: 0px;
    }
    // .el-dialog__body{
    //     padding: 0px;
    // }

    .dialog-header {
        display: flex;
        justify-content: space-between;
    }
    .close-btn {
        cursor: pointer;
        font-size: 20px;
    }
    .content {
        text-align: center;

        .title {
            font-size: 14px;
            color: #3c4144;
            letter-spacing: 0;
            font-weight: 500;
        }
        .info {
            font-size: 10px;
            color: #969799;
            letter-spacing: 0;
            font-weight: 400;
        }
        .btn {
            margin-top: 25px;
        }
        .el-button {
            border-radius: 2;
        }
        .manifest{
            .el-button{
                background-color: #67C23A;
                border:#67C23A;
                &:hover{
                    opacity: 0.7;
                }
            }
        }
    }
}
</style>

