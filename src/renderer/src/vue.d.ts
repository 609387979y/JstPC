import { http } from "justom-share";
import { Store } from "vuex";
import { RootState } from "./store/types";
import { Router, RouteLocationNormalizedLoaded } from "vue-router";
import { Message } from "element-plus/lib/components/message/src/message";
import { ElMessageBoxShortcutMethod } from "element-plus/lib/components/message-box/src/message-box.type";
// import {
//   ILoadingOptions,
//   ILoadingInstance,
// } from "element-plus/lib/components/loading/src/loading.type";
import {PermissionSearch} from "@/store/modules/auth"
import * as utils from "justom-share/src/common/utils"

type Utils = typeof utils;

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
     * Element Plus Loading
     */
    // $loading: (options?: ILoadingOptions) => ILoadingInstance;

    
    $alert: ElMessageBoxShortcutMethod;
    $confirm:ElMessageBoxShortcutMethod,
    $prompt: ElMessageBoxShortcutMethod;

    /**
     * 获得业务权限值
     */
    $permission:(target:PermissionSearch)=>string | null;
  }
}

/**
 * 路由meta
 */
declare module "vue-router" {
  interface RouteMeta {
    /**
     * 页面标题
     */
    title?: string;
    /**
     * 是否允许未登录的情况下访问页面
     */
    allowLogout?: boolean;
    /**
     *  不需要头部 / 尾部布局 (由每个Layout单独进行控制隐藏)
     */
    externalWithoutLayout?: boolean;

    /**
     * 上一个页面的路径(面包屑用)
     */
    lastPagePath?: string;
  }

  interface Router {
    /**
     * push  带缓存
     * @param to 
     */
    pushWithCache(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>;
    /**
     * 切换
     * @param to
     */
    switch(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>;
    /**
     * 打开tab
     * @param to
     */
    openTab(
      to: RouteLocationRaw
    ): Promise<NavigationFailure | void | undefined>;
    /**
     * 关闭tab
     * @param path 需要关闭的tab 不传为当前tab
     */
    closeTab(path: string): void;

    /**
     * 关闭当前 然后前往并刷新一个地址
     * @param to
     */
    closeAndRefreshTab(
      to: RouteLocationRaw
    ): Promise<NavigationFailure | void | undefined>;

  }

  interface RouteLocationNormalizedLoaded {
    /**
     * 修改当前tab的标题
     * @param title
     */
    modifyCurrentTabTitle(title: string): void;
  }
}
