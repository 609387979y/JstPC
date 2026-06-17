<template>
    <div class="vgm-container">
        <manifestTipsVue hidebtn v-if="infoData.Status === 2" tiptype="error" title="失败" :content="infoData.FailReason">
        </manifestTipsVue>

        <div class="title">编辑VGM</div>
        <div class="btns">
            <div>
                <el-button @click="showPreview">
                    <el-icon><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                            <path fill="currentColor"
                                d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z">
                            </path>
                        </svg></el-icon>
                    预览
                </el-button>


                <el-button @click="saveAndSubmit" type="primary">
                    <el-icon>
                        <promotion />
                    </el-icon>保存并发送
                </el-button>
            </div>
            <div>
                <el-button @click="reset">
                    <el-icon>
                        <refresh-right />
                    </el-icon>重置
                </el-button>
            </div>
        </div>

        <VGMEditor disableEditDetail ref="vgmEditor"></VGMEditor>
    </div>
    <VGMPreviewDialog @saveDraft="saveDraft" @submit="clickSaveAndSubmit" ref="previewDialog"></VGMPreviewDialog>

</template>

<script>
import { defineComponent } from "vue"
import VGMEditor from "./components/VGMEditor.vue"
import VGMPreviewDialog from "./components/VGMPreviewDialog.vue"
import {
    Edit,
    Folder,
    Clock,
    Promotion,
    Download,
    DocumentCopy,
    RefreshRight
} from "@element-plus/icons"
import VGMSendConfirmDialog from "./components/VGMSendConfirmDialog.vue"
import manifestTipsVue from "../components/manifestTips.vue"
export default defineComponent({
    components: {
        VGMEditor,
        Edit,
        Folder,
        Clock,
        Promotion,
        Download,
        DocumentCopy,
        RefreshRight,
        VGMPreviewDialog,
        VGMSendConfirmDialog,
        manifestTipsVue
    },
    data() {
        return {
            vgmId: 0,
            timestamp: 0,
            infoData: {}
        }
    },
    methods: {
        async getData() {
            await this.$refs.vgmEditor.reset();
            let res = await this.$http.get("/api/CargoEDISHVGM/GetVGMInfo", {
                id: this.vgmId
            })
            if (!res.Status) {
                this.$message.error(res.Message ?? '失败')
                return;
            }
            this.infoData = res.Data;
            await this.$refs.vgmEditor.load(res.Data);

        },
        async reset() {
            await this.getData()
            this.$message.success("重置成功");
        },

        /**
         * 预览
         */
        async showPreview() {
            let res = await this.$refs.vgmEditor.save({ validate: false })
            this.$refs.previewDialog.openPreviewDialog(res)
        },

        /**
         * 保存并发送VGM
         */
        async saveAndSubmit() {
            await this.$confirm(
                '是否确定保存并发送?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )

            let data = await this.$refs.vgmEditor.save({ validate: true }).catch(() => {
                this.$message.warning("请检查数据是否正确")
            })
            data.Id = this.vgmId
            // 保存并发送
            let res = await this.$http.post("/api/CargoEDISHVGM/UpdateAndSendVGM", data)
            if (!res.Status) {
                this.$message.error(res.Message ?? '失败')
                return;
            }
            this.$message.success('成功');


            // 离开时重置数据
            this.$refs.vgmEditor.reset();
            this.$router.push({
                path: "/manifest/vgm/VGMSend"
            })
        }
    },
    activated() {
        if (this.vgmId != this.$route.query.vgmId) {
            this.vgmId = this.$route.query.vgmId
            this.getData()
        } else {
            // 相等的情况下 判断时间戳是否相等  不相等重新加载数据
            if (this.timestamp != this.$route.query.timestamp) {
                this.timestamp = this.$route.query.timestamp;
                this.getData()
            }
        }
    }
})
</script>

<style lang='scss' scoped>
.vgm-container {
    // height: 100%;
    background-color: #fff;
    padding: 19px 24px;


    .title {

        font-size: 14px;
        color: #303133;
        letter-spacing: 0;
        font-weight: 500;
    }



    .btns {
        display: flex;
        justify-content: space-between;
        margin-bottom: 17px;
        margin-top: 17px;

        :deep(.el-button) {
            min-height: 25px;
            height: 25px;
            line-height: 25px;
            padding: 0px 15px;

            &.el-button--primary {
                background: #8dce6c;
                border-color: #8dce6c;

                &:hover {
                    opacity: 0.7;
                }
            }

            i {
                margin-right: 4px;
            }
        }
    }
}
</style>