import { RouteRecordRaw } from "vue-router"







const routes: RouteRecordRaw[] = [
  {
    name: "exitQuery",
    path: "/internal/exitQuery",
    component: () => import("@/views/internal/boxTrack/exitQuery.vue"),
    meta: {
      title: "出口查询"
    }
  },
  {
    name: "exitQueryDetailInfo",
    path: "/internal/exitQueryDetailInfo",
    component: () => import("@/views/internal/boxTrack/exitQueryDetailInfo.vue"),
    meta: {
      title: "跟踪详情"
    }
  },
  {
    name: "consumeLogs",
    path: "/internal/consumeLogs",
    component: () => import("@/views/internal/boxTrack/consumeLogs.vue"),
    meta: {
      title: "消费记录"
    }
  },
  {
    name: "companyLogs",
    path: "/internal/companyLogs",
    component: () => import("@/views/internal/boxTrack/companyLogs.vue"),
    meta: {
      title: "公司管理"
    }
  },
  {
    name: "recycleLog",
    path: "/internal/recycleLog",
    component: () => import("@/views/internal/boxTrack/recycleLog.vue"),
    meta: {
      title: "回收站"
    }
  }
]



export default routes