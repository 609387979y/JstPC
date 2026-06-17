<template>
    <div class="manifest-content">
        <div class="btns">
            <div>
                <el-button @click="openJxDialog">
                    <el-icon>
                        <edit />
                    </el-icon>解析舱单
                </el-button>
                <el-button @click="openPreviewDialog">
                    <el-icon><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                            <path fill="currentColor"
                                d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z">
                            </path>
                        </svg></el-icon>
                    预览
                </el-button>
                <el-button @click="saveDraft">
                    <el-icon>
                        <folder />
                    </el-icon>保存草稿
                </el-button>
                <el-button @click="sendConfirm" type="primary">
                    <el-icon>
                        <promotion />
                    </el-icon>提交发送
                </el-button>
            </div>
            <div>
                <el-button @click="downexcel">
                    <el-icon>
                        <download />
                    </el-icon>下载解析模板
                </el-button>
                <el-button @click="copySelf">
                    <el-icon>
                        <document-copy />
                    </el-icon>复制
                </el-button>
                <el-button @click="reset">
                    <el-icon>
                        <refresh-right />
                    </el-icon>重置
                </el-button>
            </div>
        </div>

        <ManifestEditor autoValidate :key="editorKey" ref="editor"></ManifestEditor>
        <SendConfirmDialog @confirm="saveAndSend" ref="sendConfirmDialog"></SendConfirmDialog>
        <ManifestPreviewDialog ref="previewDialog"></ManifestPreviewDialog>
        <ManifestJxDialog ref="JxDialog" @jxsave="jxsetmodel"></ManifestJxDialog>
    </div>
    <JstActionBar>
        <el-button @click="openPreviewDialog">
            <el-icon><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                    <path fill="currentColor"
                        d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z">
                    </path>
                </svg></el-icon>
            预览
        </el-button>
        <el-button @click="saveDraft">
            <el-icon>
                <folder />
            </el-icon>保存草稿
        </el-button>
        <el-button @click="sendConfirm" type="primary">
            <el-icon>
                <promotion />
            </el-icon>提交发送
        </el-button>
    </JstActionBar>
</template>

<script >
import {
    defineComponent,
    ref,
    reactive
} from "vue";
import ManifestEditor from "./components/ManifestEditor.vue";
import * as types from "./components/types"
import SendConfirmDialog from "./components/SendConfirmDialog.vue";
import { ElMessage } from "element-plus";
import ManifestPreviewDialog from "./components/ManifestPreviewDialog.vue";
import ManifestJxDialog from "./components/ManifestJxDialog.vue";
import { Download, Edit, Clock, Folder, Promotion, RefreshRight, DocumentCopy } from "@element-plus/icons";

export default defineComponent({
    components: {
        ManifestEditor,
        SendConfirmDialog,
        ManifestPreviewDialog,
        ManifestJxDialog,
        Download, Edit, Clock, Folder, Promotion, RefreshRight, DocumentCopy
    },
    data() {
        return {
            editorKey: 0,
            id: 0,
            timestamp:0
        }
    },
    methods: {
        async reset(){
            await this.loadData()
            this.$message.success("重置成功")
        },
        /**
         * 打开preview 
         */
        async openPreviewDialog() {
            let model = await this.$refs.editor.save({
                validate: false
            });

            this.$refs.previewDialog.openPreviewDialog(model);
        },
        /**
         * 下载解析模板
         */
        downexcel() {
            this.$agent().ipcRequest("window/downloadUrl", import.meta.env.VITE_AXIOS_HOST + '/Files/%E4%B8%8A%E6%B5%B7%E8%88%B1%E5%8D%95%E6%A8%A1%E6%9D%BF.xlsx');

        },
        /**
         * 复制
         */
        async copySelf() {
            await this.saveDraft();
            let res = await this.$http.post("/api/CargoEDISHManifestDraft/CopyFromOtherDraft", {
                copyId: this.id
            })
            if (res.Status == false) {
                ElMessage.error(res.Message)
                return
            }

            this.id = res.Data
            this.$router.replace({
                query: {
                    id: this.id
                }
            })
        },

        openJxDialog() {
            this.$refs.JxDialog.openJxDialog();
        },
        jxsetmodel(res) {
            this.$refs.editor.load(res.Data);
        },

        /**
         * 加载数据
         */
        async loadData() {
            let res = await this.$http.get("/api/CargoEDISHManifest/GetInfo", {
                id: this.id
            })
            if (!res.Status) {
                this.$message.error(res.Message ?? '失败')
                return;
            }
            this.$refs.editor.load(res.Data)
        },
        /**
         * 保存草稿
         */
        async saveDraft() {
            let model = await this.$refs.editor.save({
                validate: false
            });

            let res = await this.$http.post("/api/CargoEDISHManifestDraft/CreateDraft", model)

            if (!res.Status) {
                this.$message.error(res.Message ?? '失败')
                return;
            }
            this.$message.success('保存草稿成功');
        },
        // 提交并发送的确认
        async sendConfirm() {
            let model = await this.$refs.editor.save({
                validate: true
            });

            if (model == null) {
                this.$message.warning("验证失败")
                return;
            }

            this.$refs.sendConfirmDialog.showConfirmDialog(model)
        },
        /**
         * 保存并发送
         */
        async saveAndSend() {
            let model = await this.$refs.editor.save({
                validate: true
            });

            if (model == null) {
                this.$message.warning("验证失败")
                return;
            }
            model.Id = this.id
            let res = await this.$http.post("/api/CargoEDISHManifest/CreateAndSendManifest", model)
            if (!res.Status) {
                this.$message.error(res.Message ?? '失败')
                return;
            }
            this.$message.success('成功');
            this.$router.push("/manifest/Hasbeensent")
        }
    },
    activated() {
        if (this.id != this.$route.query.id) {
            this.id = this.$route.query.id
            this.loadData()
        }else{
            // 相等的情况下 判断时间戳是否相等  不相等重新加载数据
            if(this.timestamp != this.$route.query.timestamp){
                this.timestamp = this.$route.query.timestamp;
                this.loadData()
            }   
        }
    }

});
</script>
<style lang="scss" scoped>
.manifest-content {
    background-color: #fff;
    padding: 16px 10px;

    .btns {
        display: flex;
        justify-content: space-between;
        margin-bottom: 17px;

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

.title {
    font-size: 14px;
    color: #303133;
    letter-spacing: 0;
    font-weight: 500;
}
</style>