import { Module } from "vuex";
import { RootState } from "../types";
import env from "@share/env";
import { getElectronAgent } from "@share/agent";
export interface UpdateState {
  // 进度条
  progress:number,
  // 最新版本
  latestVersion:string,
}

const module: Module<UpdateState, RootState> = {
  namespaced: true,
  state: {
    progress:0,
    latestVersion:env.version
  },

  mutations: {
    setProgress(state,progress:number){
      state.progress = Math.floor(progress)
    },
    setLatestVersion(state,version:string){
      state.latestVersion = version
    }
  },
  actions: {



  },
  getters: {
    available(state){
      // 已经是最新版本
      if(state.latestVersion > env.version){
        return true;
      }
      return false
    }
  },
};

export default module;
