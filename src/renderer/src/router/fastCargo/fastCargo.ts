import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: "fastCargoWorkbench",
    path: "/fastCargo/fastCargoWorkbench",
    component: () => import("@/views/internal/FastCargo/FastCargoWorkbenck.vue"),
    meta: {
      title: "抢舱工作台"
    },
  },
  {
    name: "fastCargoApiDetail",
    path: "/fastCargo/fastCargoApiDetail",
    component: () => import("@/views/internal/FastCargo/FastCargoApiDetail.vue"),
    meta: {
      title: "创建抢舱任务",
      lastPagePath: "/fastCargo/fastCargoWorkbench"
    },
  },
  {
    name: "fastCargoTaskManage",
    path: "/fastCargo/fastCargoTaskManage",
    component: () => import("@/views/internal/FastCargo/FastCargoTaskManage.vue"),
    meta: {
      title: "抢舱任务管理",
	  keepAlive: true
    },
  },
  {
    name: "FastCargoCostLog",
    path: "/fastCargo/FastCargoCostLog",
    component: () => import("@/views/internal/FastCargo/FastCargoCostLog.vue"),
    meta: {
      title: "消费记录",
    },
  }

  
];

export default routes;
