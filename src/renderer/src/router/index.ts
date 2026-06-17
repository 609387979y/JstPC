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

// 外部布局 (/external)
const externalModules = import.meta.globEager("./external/**/*.{js,ts}");
let externalLayout = loadModules(externalModules);

// 内部布局 (/internal)
const internalModules = import.meta.globEager("./internal/**/*.{js,ts}");
let internalLayout = loadModules(internalModules);

// 运价布局 (/freight)
const freightModules = import.meta.globEager("./freight/**/*.{js,ts}");
let freightLayout = loadModules(freightModules);

// 舱单布局 (/manifest)
const manifestModules = import.meta.globEager("./manifest/**/*.{js,ts}");
let manifestLayout = loadModules(manifestModules);

// 船司资料布局 (/shippingfile)
const shippingfileModules = import.meta.globEager("./shippingfile/**/*.{js,ts}");
let shippingfileLayout = loadModules(shippingfileModules);

//箱货跟踪布局
const boxTrackModules = import.meta.globEager("./boxTrack/**/*.{js,ts}");
let boxTrackLayout = loadModules(boxTrackModules);
//船期查询布局
const shippingQueryModules = import.meta.globEager("./shippingQuery/**/*.{js,ts}");
let shippingQueryLayout = loadModules(shippingQueryModules);

//极速抢舱布局
const fastCargoModules = import.meta.globEager("./fastCargo/**/*.{js,ts}");
let fastCargoLayout = loadModules(fastCargoModules);

// 外部链接布局 (/ExternallLayout)
const ExternalWebModules = import.meta.globEager("./ExternalWeb/**/*.{js,ts}");
let ExternalWeb = loadModules(ExternalWebModules);


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
  ...externalLayout,
  {
    name: "internal",
    path: "/internal",
    component: () => import("@/views/InternalLayout.vue"),
    children: internalLayout,
  },
  {
    name: "freightLayout",
    path: "/freightLayout",
    component: () => import("@/views/freightLayout.vue"),
    children: freightLayout,
  },
  {
    name: "manifestLayout",
    path: "/manifestLayout",
    component: () => import("@/views/manifestLayout.vue"),
    children: manifestLayout,
  },
  {
    name: "shippingFileLayout",
    path: "/shippingFileLayout",
    component: () => import("@/views/shippingFileLayout.vue"),
    children: shippingfileLayout,
  },
  {
    name: 'boxTrackLayout',
    path: '/boxTrackLayout',
    component: () => import("@/views/boxTrackLayout.vue"),
    children: boxTrackLayout
  },
  {
    name: 'shippingQueryLayout',
    path: '/shippingQueryLayout',
    component: () => import("@/views/shippingQueryLayout.vue"),
    children: shippingQueryLayout
  },
  {
    name: 'fastCargoLayout',
    path: '/fastCargoLayout',
    component: () => import("@/views/fastCargoLayout.vue"),
    children: fastCargoLayout
  },


  {
    name: "ExternalWebLayout",
    path: "/ExternalWebLayout",
    component: () => import("@/views/external/ExternalWebLayout.vue"),
    children: ExternalWeb,
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
