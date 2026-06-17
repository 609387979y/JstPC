import { RouteRecordRaw } from "vue-router"





const routes:RouteRecordRaw[] = [
    {
        name: "test2",
        path: "/test2",
        component:()=>import("@/views/external/test2.vue"),
    }
]



export default routes