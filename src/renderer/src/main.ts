import { createApp } from "vue";
import App from "./App.vue";
import request from "@/public/request";
import store from "@/store";
import router from "@/router";
import justom, { utils } from "justom-share";
import { getElectronAgent } from "@share/agent";

import element from "element-plus";
// import "element-plus/dist/index.css";
import "./styles/element-cover.scss";
import composition from "./composition";
import env from "@share/env";
import database from "./database";
// sentry 错误监控
import * as Sentry from "@sentry/electron";
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

const DEV_HOST = import.meta.env.VITE_DEV_HOST;
if (DEV_HOST === undefined) {
  // 打包模式 监听错误
  Sentry.init({
    dsn: "https://a6bec2d99ab34014921e35f192167a06@o1170863.ingest.sentry.io/6270218",
  });
}

const agent = getElectronAgent();
if (agent !== null) {
  // 在electron环境下运行
  // 初始化agent
  agent.setup({
    http: request,
  });
  env.inElectron = true;
  env.platform = window.__PLATFORM__;
}

const app = createApp(App);

function useTable(app: App) {
  app.use(VXETable)

  // 给 vue 实例挂载内部对象，例如：
  // app.config.globalProperties.$XModal = VXETable.modal
  // app.config.globalProperties.$XPrint = VXETable.print
  // app.config.globalProperties.$XSaveFile = VXETable.saveFile
  // app.config.globalProperties.$XReadFile = VXETable.readFile
}

app.use(useTable)
app.use(store);
app.use(router);

// $http
app.config.globalProperties.$http = request;
// $utils
app.config.globalProperties.$utils = utils;
// $agent
app.config.globalProperties.$agent = getElectronAgent;
// IndexedDB
app.config.globalProperties.$db = database;

// element plus
app.use(element, { size: "small" });

// 及时通 公共库
app.use(justom);

composition({
  app,
  router,
  store,
  httpInstance: request,
});

app.mount("#app");