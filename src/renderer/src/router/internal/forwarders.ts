import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: "ForwardersList",
    path: "/forwarders/list",
    component: () => import("@/views/internal/Forwarders/ForwardersList.vue"),
    meta: {
      title: "找货代",
    },
  },
  {
    name: "ForwardersDetail",
    path: "/forwarders/detail",
    component: () => import("@/views/internal/Forwarders/ForwardersDetail.vue"),
    meta: {
      title: "货代详情",
      lastPagePath:"/forwarders/list"
    },
  }

];

export default routes;
