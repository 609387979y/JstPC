import { RouteRecordRaw } from "vue-router"







const routes:RouteRecordRaw[] = [
    {
        name: "workbench",
        path: "/workbench",
        component:()=>import("@/views/internal/Workbench.vue"),
        meta:{
            title:"工作台"
        }
    }
]



export default routes