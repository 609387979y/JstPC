import { ElectronAgent } from "@share/agent";
import { http } from "justom-share";
import { Store } from "vuex";
import { RootState } from "./store/types";
import { Router, RouteLocationNormalizedLoaded } from "vue-router";
import { Message } from "element-plus/lib/components/message/src/message";
import { ElMessageBoxShortcutMethod } from "element-plus/lib/components/message-box/src/message-box.type";
import {
  ILoadingOptions,
  ILoadingInstance,
} from "element-plus/lib/components/loading/src/loading.type";
import * as utils from "justom-share/src/common/utils";
import database from "@/database"
import { IpcRendererEvent } from "electron"

type Utils = typeof utils;
type Database = typeof database

declare global {
  interface Window {
    // 由 preload 暴露到这边的api
    electron_agent?: ElectronAgent;
    /**
     * 平台 
     */
    __PLATFORM__:string;
    /**
     * electron 创建出来的窗口名
     */
    _ELECTRON_WINDOW_NAME_:undefined | "main";
    /**
     * 当前BrowserWindow的ID
     */
    _ELECTRON_WINDOW_ID_:undefined | number;

    /**
     * 接收main process的消息
     * @param channel 
     * @param listener 
     */
    $ipc:{
      /**
       * 接收
       * @param channel 
       * @param listener 
       */
      on(channel:string,listener: (event: IpcRendererEvent, ...args: any[]) => void):Function
    }
}

/**
 * 挂载在vue上的实例
 */
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    /**
     * http请求(axios)
     */
    $http: http.AxiosRequest;
    /**
     * 公共方法
     */
    $utils: Utils;
    /**
     * IndexedDB 数据库
     */
    $db:Database;
    /**
     *  vuex
     */
    $store: Store<RootState>;
    /**
     * 路由
     */
    $router: Router;
    /**
     * 当前路由
     */
    $route: RouteLocationNormalizedLoaded;
    /**
     * Element Plus 消息提醒
     */
    $message: Message;
    /**
     * electron agent
     */
    $agent(): ElectronAgent | null;

    /**
     * Element Plus Loading
     */
    $loading: (options?: ILoadingOptions) => ILoadingInstance;

    $alert: ElMessageBoxShortcutMethod;
    $confirm: ElMessageBoxShortcutMethod;
    $prompt: ElMessageBoxShortcutMethod;
  }
}


declare module "vue-router" {
  interface RouteMeta {
    /**
     * 页面标题
     */
    title?: string;


    /**
     * 是否显示 左侧菜单栏
     */
    hideSider?:boolean

    
    /**
     * 上一个页面的路径(面包屑用)
     */
     lastPagePath?: string;
  }
}

