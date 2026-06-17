<template>
    <div>
        <JstCardLayout>
            <div v-loading="!isLoadOver" class="view">
                <el-row>
                    <el-col :span="6">
                        <div class="left-menu menu-list">
                            <div class="menu-item" :class="currentSelect == 'editUserInfo'?'active':''" @click="chooseMenu('editUserInfo')" v-if="isUserLogin" >
                                <div>基本设置</div>
                            </div>
                            <div class="menu-item" :class="currentSelect == 'securityConfig'?'active':''" @click="chooseMenu('securityConfig')" v-if="isUserLogin" >
                                <div>安全设置</div>
                            </div>
                            <div class="menu-item" :class="currentSelect == 'userBind'?'active':''"  @click="chooseMenu('userBind')" v-if="isUserLogin" >
                                <div>账号绑定</div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="18">
                        <div v-if="isLoadOver" class="content">
                            <template v-if="currentSelect == 'editUserInfo'">
                                <EditUserInfo></EditUserInfo>
                            </template>
                            <template v-if="currentSelect == 'securityConfig'">
                                <SecurityConfig></SecurityConfig>
                            </template>
                            <template v-if="currentSelect == 'userBind'">
                                <UserBind></UserBind>
                            </template>
                            <!-- <template v-if="currentSelect == 'messageConfig'">
                                <MessageConfig></MessageConfig>
                            </template> -->
                        </div>
                    </el-col>
                </el-row>
            </div>
        </JstCardLayout>
    </div>
</template>

<script>
import { defineComponent } from "vue"
import EditUserInfo from "./EditUserInfo.vue"
import SecurityConfig from "./SecurityConfig.vue"
import MessageConfig from "./MessageConfig.vue"
import UserBind from "./UserBind.vue"
export default defineComponent({
    components: {

        EditUserInfo,
        SecurityConfig,
        MessageConfig,
        UserBind
    },
    data() {
        return {
            selectMenu: "editUserInfo",
            isLoadOver: false,

        }
    },
    methods: {
        chooseMenu(code){
            this.selectMenu = code
        }
    },
    async mounted() {


        await this.$store.dispatch("auth/getCurrentUserInfo")
        this.isLoadOver = true;



        if (this.$route.query.type) {
            this.selectMenu = this.$route.query.type
        }
        if (this.selectMenu.length == 0 && this.isUserLogin) {
            this.selectMenu = "editUserInfo"
        }




    },
    computed: {
        currentSelect() {
            return this.selectMenu
        },

        /**
         * 用户是否已经登录
         */
        isUserLogin() {
            return this.$store.state.auth.user != null;
        }
    }

})
</script>

<style lang='scss' scoped>
.view {
    // display: flex;
}

.page-container {
    ::v-deep(.el-card__body) {
        padding-left: 0px;
    }
}

.left-menu {
    width: 228px;
    height: 100%;

    ::v-deep(.ant-menu-item) {
        padding-right: 0px;
    }
}

.content {
    margin-left: 30px;
}







.menu-list {
    border-right: 1px solid #f0f0f0;

    .menu-item {
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        padding-left: 20px;

        position: relative;

        font-size: 14px;
        font-variant: tabular-nums;
        font-feature-settings: "tnum";



        &:hover {
            color: #1890ff;
        }

        &.active {
            color: #1890ff;
            background-color: #e6f7ff;

            ::after {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                border-right: 3px solid #1890ff;
                transform: scaleY(1);
                opacity: 1;
                transition: transform .15s cubic-bezier(.645, .045, .355, 1), opacity .15s cubic-bezier(.645, .045, .355, 1);
                content: "";
            }
        }
    }
}
</style>