import { RouteRecordRaw } from "vue-router"







const routes:RouteRecordRaw[] = [
    {
      name: "userAuthorization",
      path: "/internalComponents/userAuthorization",
      component:()=>import("@/views/internal/internalComponents/UserAuthorization.vue"),
      meta:{
          title:"角色认证"
      }
  }
]



export default routes