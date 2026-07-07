import {
  createRouter,
  createWebHashHistory,
  Router,
  RouteRecordRaw,
} from "vue-router";
import { useStore } from "vuex";

const store = useStore()
console.log(store)

/**
 * 加载路由
 * @param modules
 * @returns
 */
function loadModules(modules: any) {
  let moduleRoutes: Array<RouteRecordRaw> = [];
  for (const path in modules) {
    const module = modules[path];
    const defaultExport = module.default as Array<RouteRecordRaw>;
    moduleRoutes = moduleRoutes.concat(defaultExport);
  }
  return moduleRoutes;
}

// 内部布局 (/internal)
const internalModules = import.meta.globEager("./internal/**/*.{js,ts}");
let internalLayout = loadModules(internalModules);

// 动态载入modules
let routes: Array<RouteRecordRaw> = [
  // 入口
  {
    name: "entry",
    path: "/",
    component: () => import("@/views/Entry.vue"),
    meta: {
      title: "登录"
    },
  },
  //外部个人中心
  {
    name: "ExternalUseCenter",
    path: "/ExternalUseCenter",
    component: () => import("@/views/external/ExternalUseCenter.vue"),
  },
  {
    name: "internal",
    path: "/internal",
    component: () => import("@/views/InternalLayout.vue"),
    children: internalLayout,
  },
  {
    name: 'hxgj',
    path: '/internal/hxgj',
    component: () => import("@/views/iframeLayout.vue"),
    meta: {
      title: "航线轨迹"
    }
  },
  {
    name: 'cdw',
    path: '/internal/cdw',
    component: () => import("@/views/webViewLayout.vue"),
    meta: {
      title: "船定位"
    }
  }

];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});



export default router;
