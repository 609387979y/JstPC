import { RouteRecordRaw } from "vue-router"





const routes: RouteRecordRaw[] = [
    {
        name: "userCenterWeb",
        path: "/userCenterWeb",
        component: () => import("@/views/external/userCenterWeb.vue"),
        meta: {
            title: "个人中心 - 及时通",
            keepAlive: true,
        },
    },
    {
        name: "rechargeWeb",
        path: "/rechargeWeb",
        component: () => import("@/views/external/rechargeWeb.vue"),
        meta: {
            title: "支付中心 - 及时通",
            keepAlive: true,
        },
    }
]



export default routes