import { RouteRecordRaw } from "vue-router"







const routes:RouteRecordRaw[] = [
    {
        name: "userSetting",
        path: "/user/setting",
        component:()=>import("@/views/internal/user/UserSettingPage.vue"),
        meta:{
            title:"个人设置",
            lastPagePath: "/internal/home"
        }
    }
]



export default routes