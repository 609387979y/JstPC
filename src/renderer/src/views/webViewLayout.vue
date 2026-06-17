<template>
    <div class="main-container">
        <div class="header">
            <div class="left">
                <el-button type="info" @click="reLoad">刷新</el-button>
                <div style="margin-left:15px">船定位</div>
            </div>

            <div style="flex: 1; height: 100%" class="center center-area"></div>
            <div class="right">
                <div class="user-info-menu">
                    <div class="window-btns">
                        <div @click="windowOpt('min')" class="btns">
                            <el-icon :size="18">
                                <minus />
                            </el-icon>
                        </div>
                        <div @click="windowOpt('max')" style="padding-bottom: 9px" class="btns">
                            <el-icon :size="18">
                                <img src="@/assets/maximize-1.svg" style="width:14px;height:14px;margin-top:3px" />
                            </el-icon>
                        </div>
                        <div @click="windowOpt('close')" class="btns">
                            <el-icon :size="18">
                                <Close />
                            </el-icon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="view-content">
            <webview id="shippingWebView" :src="iframe" style="width: 100%; height: calc(100vh - 66px)"></webview>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, computed, unref, nextTick } from "vue";
import { Bell, StarFilled } from "@element-plus/icons";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import shippingQueryMenu from "@/components/menu/shippingQueryMenu.vue";
import { getElectronAgent } from "@share/agent";
import { useBreadcrumb } from "@/composables/useBreadcrumb";
import { Minus, Close } from "@element-plus/icons";
import UserInfoPopper from "./internal/internalComponents/UserInfoPopper.vue";
import request from "@/public/request";
import { ElMessage } from "element-plus";
import { useCompanyCertification } from "@/composables/user/certification";
import FirstGuide from "./internal/FreightRate/FirstGuide.vue";
function useUser() {
    const store = useStore();
    const router = useRouter();
    const userInfo = computed(() => {
        if (store.state.auth.user) {
            return store.state.auth.user;
        } else {
            return {};
        }
    });

    // 是否登录了员工账号
    const isEmployeeLogin = computed(() => {
        if (store.state.auth.employee) {
            return true;
        } else {
            return false;
        }
    });
    const companyName = computed(() => {
        if (isEmployeeLogin.value) {
            return store.state.auth.employee.CompanyName;
        } else {
            return "";
        }
    });

    /**
     * 登出
     */
    async function logout() {
        await store.dispatch("auth/logout");
        // 返回到登录页
        router.replace("/");
    }

    const showUnReadMessage = computed(() => {
        return store.state.message.unReadMessageCount > 0 ? true : false;
    });

    onMounted(() => {
        store.dispatch("auth/checkAndTryChooseEmployee");
    });

    return reactive({
        userInfo,
        logout,
        isEmployeeLogin,
        companyName,
        showUnReadMessage,
    });
}

function useMenu() {
    const route = useRoute();

    // 是否显示侧边菜单
    const showSider = computed(() => {
        if (route.meta.hideSider === true) {
            return false;
        }
        return true;
    });

    return reactive({
        showSider,
    });
}

// 角色认证
function useUserAuth(agent) {
    let visible = ref(false);
    const store = useStore();
    const certification = useCompanyCertification();
    // 打开认证窗口
    async function toUserAuth() {
        if (await certification.toUserAuth()) {
            visible.value = false;
        }
    }

    //关闭认证popper
    const closePopper = () => {
        visible.value = false;
    };

    return reactive({
        toUserAuth,
        closePopper,
        visible,
    });
}

//初次引导
function useFavoritePorts() {
    const state = reactive({
        polPortList: [],
        desPortList: [],
        isCertification: false,
    });
    // const priceList = usePriceList();
    async function getFavoritePorts() {
        let res = await request.get("/api/FRInquireFavoritePort/GetFavoritePorts");
        return res;
    }
    const store = useStore();
    async function certification() {
        await store.dispatch("auth/checkAndTryChooseEmployee");
        state.isCertification = store.state.auth.certificationStatus;
    }
    async function initFavoritePorts() {
        let res = await getFavoritePorts();
        state.polPortList = res.PolPorts;
        state.desPortList = res.DestPorts;
    }
    onMounted(() => {
        certification();
        initFavoritePorts();
    });

    return reactive({
        state,
        getFavoritePorts,
        initFavoritePorts,
    });
}

export default defineComponent({
    components: {
        Bell,
        StarFilled,
        shippingQueryMenu,
        Minus,
        Close,
        UserInfoPopper,
        FirstGuide,
    },
    setup() {
        const store = useStore();
        const agent = getElectronAgent();
        const route = useRoute()
        const user = useUser();
        const menu = useMenu();
        const userAuth = useUserAuth(agent);

        const breadcrumb = useBreadcrumb();

        const favoritePorts = useFavoritePorts();

        if (agent != null) {
            agent.ipcRequest("shippingWebView/setViewType", "normal");
        }

        function windowOpt(opt) {
            agent.ipcRequest("shippingWebView/opt", opt);
        }
        let iframe = ref('');
        let vessel = ref('');
        function init() {
            iframe.value = route.query.iframe;
            vessel.value = route.query.vessel;
            console.log(vessel.value);
        }
        function deCode(base64) {

            // 对base64转编码

            var decode = atob(base64);

            // 编码转字符串

            var str = decodeURI(decode);

            return str;

        }
        function reLoad() {
            window.location.reload()
        }

        onMounted(() => {
            store.dispatch("pay/refreshBalance");
            agent.ipcRequest("loading/closeCover", window._ELECTRON_WINDOW_ID_);
            nextTick(() => {
                init();
                let shippingWebView = document.getElementById('shippingWebView')
                shippingWebView.addEventListener('dom-ready', (e) => {
                    shippingWebView.executeJavaScript(`
                document.getElementById('searchinputv').value='${vessel.value}'
                `)
                })




            })
        });

        return {
            user,
            menu,
            userAuth,
            breadcrumb,
            windowOpt,
            favoritePorts,
            iframe,
            reLoad
        };
    },
});
</script>

<style lang="scss" scoped>
$header-height: 51px;

.header {
    height: $header-height;
    color: #909399;
    box-shadow: 0 1px 0px 0 #ebebeb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 19px;
    background-color: #ebebeb;
    position: relative;

    .left {
        -webkit-app-region: no-drag;
        display: flex;
        align-items: center;
        font-size: 14px;
    }

    .right {
        -webkit-app-region: no-drag;
    }
}

.user-info-menu {
    display: flex;

    align-items: center;

    .menu {
        margin-left: 24px;
    }
}

.avatar {
    cursor: pointer;
}

.main-container {
    background-color: #f7f8fa;
    height: 100%;

    .view {
        padding: 0px;
    }

    .view-content {
        // min-width: 1400px;
        padding: 0;
        height: calc(100vh - 51px);
        overflow: hidden;
        overflow: auto;
    }

    .breadcrumb {
        height: 33px;
        align-items: center;
        display: flex;
        padding-left: 8px;
        background-color: #fff;
    }
}

.logo {
    // cursor: pointer;
}

.main-content {
    height: calc(100vh - $header-height);
}

:deep(.el-breadcrumb__item .el-breadcrumb__inner) {
    font-size: 12px;
    color: #969799;
    letter-spacing: 0;
    line-height: 17px;
    font-weight: 400;

    &:hover {
        color: #3c4144;
    }
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
    font-size: 12px;
    color: #3c4144;
    letter-spacing: 0;
    line-height: 17px;
    font-weight: 500;
}

.window-btns {
    display: flex;

    // position: relative;
    .btns {
        cursor: pointer;
        align-items: center;
        display: flex;
        margin-left: 10px;
        padding: 5px;

        &:hover {
            background-color: #dedfe0;
        }
    }
}

.center-area {
    position: relative;
    -webkit-app-region: drag;
}

.user-auth-no {
    background: linear-gradient(#ffffff, #e6e6e6);
    color: #969799;
    padding: 2px 8px;
    border-radius: 10px;
}

.user-auth-yes {
    background: linear-gradient(#ffe6ac, #fdd36c);
    color: #bb6d00;
    padding: 2px 8px;
    border-radius: 10px;
}

.message-icon {
    cursor: pointer;
    margin-top: 7px;
    margin-right: 5px;
}
</style>

<style lang="scss">
.user-info-auth.el-popper.is-light {
    background: rgba(21, 22, 23, 0.8);
    color: #ffffff;
}

.user-info-auth.el-popover.el-popper {
    border: unset;
}

.user-info.el-popover.el-popper {
    padding: 0;
}

iframe {
    outline: none;
    border: none;
    width: 100%;
    padding: 0;
    margin: 0;
    height: 100%;
}
</style>
