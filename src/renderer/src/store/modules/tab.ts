import { Module } from "vuex";
import { RootState } from "../types";
import localStorage from "@/public/localStorage";
import { useRouter } from "vue-router";

const SAVE_TABS_KEY = "jst:tabs";
const SAVE_ACTIVE_MENU = "jst:activeMenu";

/**
 * tab信息
 */
export interface TabCache {
  /**
   * 标题
   */
  title?: string;
  /**
   * route 路径
   */
  route?: string;
}

/**
 * 身份验证相关state
 */
export interface TabStatus {
  /**
   * tabs  (缓存的tab)
   */
  tabs: Array<TabCache>;
}

/**
 * 更新Tab信息
 */
export interface UpdateTabInfo {
  /**
   * 旧Tab路径
   */
  oldTabRoute: string;
  /**
   * 新的信息
   */
  info: TabCache;
}

export interface ModifyTabTitle{
  // 路径
  path:string,
  // 新标题
  newTitle:string
}


const module: Module<TabStatus, RootState> = {
  namespaced: true,
  state: {
    tabs: [],
  },
  mutations: {
    updateTabs(state, tabs: Array<TabCache>) {
      state.tabs = tabs;
    },
  },
  actions: {
    /** 交换位置 */
    replacePosition({ commit, state },newArr:number[]) {

      let newTabs = []
      for(let idx of newArr){
        newTabs.push(state.tabs[idx])
      }
      commit("updateTabs",newTabs)
    },
    /**
     * 添加tab
     * @param param0
     * @param tab
     */
    addTab({ commit, state }, tab: TabCache) {

      if(tab.route == "/internal"){
        return;
      }
      let exist = state.tabs.find((t) => t.route == tab.route);
      if (exist == undefined) {
        // 不存在 则 新增
        state.tabs.push(tab);
      }
      commit("updateTabs", state.tabs);
    },
    /**
     * 删除tab
     * @param param0
     * @param tab
     */
    removeTab({ commit, state }, route: string) {
      let existIdx = state.tabs.findIndex((t) => t.route == route);
      if (existIdx != -1) {
        state.tabs.splice(existIdx, 1);
      }
      commit("updateTabs", state.tabs);
    },
    /**
     * 更新activeTab
     * @param param0
     * @param tab
     */
    updateActiveTabInfo({ commit, state }, request: UpdateTabInfo) {
      let old = state.tabs.find((t) => t.route == request.oldTabRoute);
      if (old) {
        old.route = request.info.route;
        old.title = request.info.title;
      }
      commit("updateTabs", state.tabs);
    },
    // 修改标题
    modifyTabTitle({ commit, state },request:ModifyTabTitle){
      let item = state.tabs.find((t) => t.route == request.path);
      if (item) {
        item.title = request.title;
      }
      commit("updateTabs", state.tabs);
    }
  },
};

export default module;
