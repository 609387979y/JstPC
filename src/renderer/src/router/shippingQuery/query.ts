import { RouteRecordRaw } from "vue-router"







const routes: RouteRecordRaw[] = [
    {
        name: "shippingQuery",
        path: "/internal/shippingQuery",
        component: () => import("@/views/internal/shippingQuery/shippingQuery.vue"),
        meta: {
            title: "船期查询"
        }
    }
]



export default routes