<template>
    <div class="container">
        <div v-if="!hideTitle" class="main-title">账号绑定</div>
        <JstField type="plain" optCenter>
            <template #prefix>
                <img class="logo" src="@/assets/wechat.png" />
            </template>
            <template #title>绑定微信</template>
            <template #remark>
                <template v-if="wechatInfo.isBind">
                    <span>已绑定微信号： {{ wechatInfo.NickName }}</span>
                </template>
                <template v-else>未绑定微信</template>
            </template>
            <template #opt>
                <el-popconfirm @confirm="unBind(100)" v-if="wechatInfo.isBind" title="是否解除绑定微信?">
                    <template #reference>
                        <el-button type="text">解除绑定</el-button>
                    </template>
                </el-popconfirm>

                <el-button v-else @click="toBind(100)" type="text">绑定</el-button>
            </template>
        </JstField>
    </div>
</template>

<script>
import { defineComponent } from "vue"
export default defineComponent({
    props: {
        hideTitle: {
            type: Boolean,
            default: false
        }
    },
    components: {

    },
    data() {
        return {
            bindList: []
        }
    },
    methods: {
        async getUserBindList() {
            this.bindList = await this.$http.get("/api/CurrentUser/getUserBindList")
        },
        /**
         * 解绑
         */
        async unBind(type) {
            let res = await this.$http.post("/api/CurrentUser/UserUnBind", {
                type: type
            })
            if (!res.Status) {
                this.$message.error(res.Message ?? '失败')
                return;
            }
            this.$message.success('解绑成功');
            this.getUserBindList();
        },
        // 前往绑定
        async toBind(type) {
            // 获得对应的绑定链接
            let link = await this.$http.get("/api/CurrentUser/GetBindLink", {
                type: type
            });

            let page = window.open(link)

            let loop = setInterval(() => {
                if (page.closed) {
                    clearInterval(loop);
                    this.getUserBindList();
                }
            }, 1000);


        }
    },
    created() {
        this.getUserBindList()
    },
    computed: {
        wechatInfo() {
            let item = this.bindList.find(t => t.BindType == 100);
            if (item == undefined) {
                return {
                    isBind: false
                }
            }

            return {
                isBind: true,
                ...item
            }

        }

    }
})
</script>

<style lang='scss' scoped>
.container {
    width: 100%;
}
.main-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    line-height: 22px;
    margin-bottom: 24px;
}
.current-company {
    display: flex;
}
.logo {
    width: 44px;
    height: 44px;
    margin-right: 20px;
}
</style>