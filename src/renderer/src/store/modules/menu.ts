import { Module } from "vuex";
import { RootState } from "../types";
import env from "@share/env";
import { getElectronAgent } from "@share/agent";
export interface MenuState {
  name: string,
  url: string,
  icon?: string,
  query?: object,
  iconActive?: string
}
export interface newListState {
  Time: string,
  info: MenuState
}

export interface UpdateState {
  // 进度条
  menuList: Array<MenuState>
  newList: Array<newListState>,
  replyList: Array<newListState>
}

const module: Module<UpdateState, RootState> = {
  namespaced: true,
  state: {
    menuList: [
      {
        name: "新对话",
        url: "/internal/home",
        icon: "menu1.svg",
        iconActive: "menu1Active.svg"
      },
      {
        name: "运价查询",
        url: "/internal/freightFind",
        icon: "menu2.svg",
        iconActive: "menu2Active.svg"

      },
      {
        name: "即时询价",
        url: "/internal/instant",
        icon: "menu3.svg",
        iconActive: "menu3Active.svg"
      },
      {
        name: "企业商机",
        url: "/internal/business",
        icon: "menu5.svg",
        iconActive: "menu5Active.svg"
      },
      {
        name: "业务单据",
        url: "/internal/BusinessDocument",
        icon: "menu5.svg",
        iconActive: "menu5Active.svg"
      }
    ],
    newList: [

    ],
    replyList: []
  },

  mutations: {

    setMenuList(state, menu: Array<MenuState>) {
      state.menuList = menu
    },
    setNewList(state, menu: Array<newListState>) {
      state.newList = menu
    },
    setReplyList(state, menu: Array<newListState>) {
      state.replyList = menu
    },
  },
  actions: {



  },
  getters: {

  },
};

export default module;
