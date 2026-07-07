import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: "mainPage",
    path: "/internal/home",
    component: () => import("@/views/internal/Home.vue"),
    meta: {
      title: "新对话",
    },
  },
  {
    name: "freightFind",
    path: "/internal/freightFind",
    component: () => import("@/views/internal/freightFind.vue"),
    meta: {
      title: "运价查询",
    },
  },
  {
    name: "instant",
    path: "/internal/instant",
    component: () => import("@/views/internal/instant.vue"),
    meta: {
      title: "即时询价",
    },
  },
  {
    name: "business",
    path: "/internal/business",
    component: () => import("@/views/internal/business.vue"),
    meta: {
      title: "企业商机",
    },
  },

  {
    name: "BusinessDocument",
    path: "/internal/BusinessDocument",
    component: () => import("@/views/internal/BusinessDocument.vue"),
    meta: {
      title: "询价记录",
    },
  },
  {
    name: "ChatWin",
    path: "/internal/ChatWin",
    component: () => import("@/views/internal/ChatWin.vue"),
    meta: {
      title: "聊天",
    },
  },
  {
    name: "companyList",
    path: "/internal/companyList",
    component: () => import("@/views/internal/companyList.vue"),
    meta: {
      title: "企业设置",
    },
  },
  {
    name: "businessSee",
    path: "/internal/businessSee",
    component: () => import("@/views/internal/businessSee.vue"),
    meta: {
      title: "询价/询盘商机",
    },
  },
  {
    name: "pushSetting",
    path: "/internal/pushSetting",
    component: () => import("@/views/internal/pushSetting.vue"),
    meta: {
      title: "推送设置",
    },
  },
  {
    name: "companyRights",
    path: "/internal/companyRights",
    component: () => import("@/views/internal/companyRights.vue"),
    meta: {
      title: "企业权益",
    },
  },
  {
    name: "userDetail",
    path: "/internal/userDetail",
    component: () => import("@/views/internal/userDetail.vue"),
    meta: {
      title: "个人设置",
    },
  },
  {
    name: "myApplication",
    path: "/internal/myApplications",
    component: () => import("@/views/internal/MyApplications.vue"),
    meta: {
      title: "工作台",
    },
  },
  {
    path: "/workbench/WorkbenchMenuEdit",
    name: "WorkbenchMenuEdit",
    component: () => import("@/views/internal/WorkbenchMenuEdit.vue"),
    meta: {
      title: "工作台导航",
    },
  },

  {
    path: "/internal/publishedPrice",
    name: "publishedPrice",
    component: () => import("@/views/internal/publishedPrice.vue"),
    meta: {
      title: "企业运价",
    },
  },

  {
    path: "/internal/businessList",
    name: "businessList",
    component: () => import("@/views/internal/businessList.vue"),
    meta: {
      title: "我的商机",
      keepAlive: true,
    },
  },

  {
    path: "/internal/advantageousRoute",
    name: "advantageousRoute",
    component: () => import("@/views/internal/advantageousRoute.vue"),
    meta: {
      title: "优势航线",
      keepAlive: true,
    },
  },
  {
    name: "systemMessage",
    path: "/system/message",
    component: () => import("@/views/internal/system/message/Message.vue"),
    meta: {
      title: "消息管理",
      lastPagePath: "/internal/home"
    }
  },


  // {
  //   name: "applicationDetail",
  //   path: "/internal/applicationDetail",
  //   component: () => import("@/views/internal/ApplicationDetail.vue"),
  //   meta: {
  //     title: "应用介绍",
  //     lastPagePath: "/internal/applicationMenu"
  //   },
  // },

  // {
  //   name: "newsDetail",
  //   path: "/internal/news/newsDetail",
  //   component: () => import("@/views/internal/news/NewsDetail.vue"),
  //   meta: {
  //     title: "新闻详情",
  //     lastPagePath: "/internal/home"
  //   },
  // },
  // {
  //   name: "NewsSearch",
  //   path: "/internal/news/newsSearch",
  //   component: () => import("@/views/internal/news/NewsSearch.vue"),
  //   meta: {
  //     title: "新闻",
  //     lastPagePath: "/internal/home"
  //   },
  // }
];

export default routes;
