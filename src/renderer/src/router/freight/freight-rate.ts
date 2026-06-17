import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: "freightRatePriceQuery",
    path: "/freightRate/PriceQuery",
    component: () => import("@/views/internal/FreightRate/PriceQuery.vue"),
    meta: {
      title: "推荐运价",
      keepAlive:true
    },
  },
    {
      name: "FreightSearch",
      path: "/freightRate/FreightSearch",
      component: () => import("@/views/internal/FreightRate/FreightSearch.vue"),
      meta: {
        title: "搜索运价",
        keepAlive:true
      },
    },
    {
      name: "ConsultPrice",
      path: "/freightRate/ConsultPrice",
      component: () => import("@/views/internal/FreightRate/ConsultPrice.vue"),
      meta: {
        title: "询价沟通",
        keepAlive:true
      },
    },
];

export default routes;
