import { RouteRecordRaw } from "vue-router"



const routes: RouteRecordRaw[] = [
    {
        name: "systemSetting",
        path: "/system/setting",
        component: () => import("@/views/internal/system/Setting.vue"),
        meta: {
            title: "版本更新"
        }
    },
    {
        name: "systemMessage",
        path: "/system/message",
        component: () => import("@/views/internal/system/message/Message.vue"),
        meta: {
            title: "消息管理",
            lastPagePath: "/internal/home"
        }
    },
    {
        name: "systemMessageDetail",
        path: "/system/messageDetail",
        component: () => import("@/views/internal/system/message/MessageDetail.vue"),
        meta: {
            title: "消息详情",
            lastPagePath: "/system/message"
        }
    }
]



export default routes