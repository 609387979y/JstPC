import { RouteRecordRaw } from "vue-router"







const routes:RouteRecordRaw[] = [
    {
        name: "test",
        path: "/test",
        component:()=>import("@/views/external/test.vue"),
    },
    {
        name: "LoginHandle",
        path: "/loginHandle",
        component:()=>import("@/views/external/LoginHandle.vue"),
    }
]



export default routes