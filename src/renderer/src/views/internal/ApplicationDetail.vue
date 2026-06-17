<template>
    <div class="app-detail-container">
        <!-- <el-button @click="back">返回</el-button> -->
        <div class="main">
            <div class="info">
                <div>
                    <img class="image" :src="currentApp.iconSrc" />
                </div>
                <div class="info-text">
                    <div class="title">{{ currentApp.title }}</div>
                    <div class="description">{{ currentApp.description }}</div>
                    <div class="btn">
                        <el-button size="mini" v-if="!isCollected" @click="collect" type="primary">添加应用</el-button>


                        <el-button size="mini" plain type="primary" v-else @click="entry">进入应用</el-button>
                    </div>
                </div>
            </div>
        </div>
        <el-divider />


        <div class="main-content">
            <div class="sub-title">应用描述</div>
            <div class="detail">{{ currentApp.description }}</div>
            <el-divider />
            <div class="sub-title">使用说明</div>
            <div class="detail" v-html="currentApp.detailContent"></div>
        </div>

    </div>

    <ApplicationEntryVue ref="applicationEntry"></ApplicationEntryVue>
</template>

<script >
import { defineComponent } from "vue"
import { applications } from "@/components/menu/ApplicationMenu"
import { getElectronAgent } from "@share/agent"
import { useCompanyCertification } from "@/composables/user/certification"
import ApplicationEntryVue from "@/components/ApplicationEntry.vue";
export default defineComponent({
    components: {
        ApplicationEntryVue
    },
    setup() {
        const agent = getElectronAgent();
        const certification = useCompanyCertification()
        return {
            agent,
            certification
        }
    },
    data() {
        return {
            code: "",
            isCollected: false,
            currentApp: {

            },
        }
    },
    computed: {

    },
    methods: {
        back() {
            this.$router.back()
        },
        /**
         * 收藏
         */
        async collect() {
            let res = await this.$http.post("/api/UserCollectionApp/CollectApplication", {
                code: this.code
            })
            if (res.Status) {
                this.$message.success("添加成功")
                this.getIsCollected()
            } else {
                this.$message.error(res.Message)
            }

        },
        /**
         * 取消收藏
         */
        async unCollect() {
            let res = await this.$http.post("/api/UserCollectionApp/UnCollect", {
                code: this.code
            })
            if (res.Status) {
                this.$message.success("成功")
                this.getIsCollected()
            } else {
                this.$message.error(res.Message)
            }
        },
        /**
         * 获得是否已经收藏过了
         */
        async getIsCollected() {
            this.isCollected = await this.$http.get("/api/UserCollectionApp/IsCollected", {
                code: this.code
            })
        },
        entry() {
            this.$refs.applicationEntry.entry(this.code)
        }
    },
    mounted() {
        this.code = this.$route.query.code
        this.getIsCollected()
        this.currentApp = applications.find(t => t.code == this.code) ?? {}
    }
})
</script>

<style lang='scss' scoped>
.app-detail-container {
    background-color: #fff;
    height: 100%;
    // padding: 10px;

    padding: 8px;
    :deep(.el-divider--horizontal){
        border-color:#F2F3F5;
    }
    
.image {
    width: 56px;
    height: 56px;
}

.main {
    display: flex;
    justify-content: space-between;
    margin-top: 47px;
}


.info {
    display: flex;

    .info-text {
        margin-left: 10px;
    }

    .title {

        font-size: 16px;
        color: #606266;
        letter-spacing: 0;
        font-weight: bold;
    }

    .description {
        font-size: 14px;
        color: #969799;
        letter-spacing: 0;
        font-weight: 400;
        margin-top: 6px;
    }
}

.btn {
    margin-top: 8px;


    :deep(.el-button) {
        border-radius: 2px;
        width:84px;
        height:24px;
    }
}

.sub-title {
    font-size: 16px;
    color: #303133;
    letter-spacing: 0;
    font-weight: bold;
}

.detail {
    margin-top: 10px;

font-size: 14px;
color: #606266;
letter-spacing: 0;
font-weight: 400;
}
}

</style>