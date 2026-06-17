import { Module } from "vuex";
import { RootState } from "../types";
import request from "@/public/request";
import { ElMessage } from "element-plus";
import { CompanyType } from "@/types/company"
import { storage} from "justom-share"
import env from "@share/env"
import { getElectronAgent } from "@share/agent"
const localStorage = storage.localStorage.default
const sessionStorage = storage.sessionStorage.default



const agent = getElectronAgent()
const TOKEN_KEY: string = "jst:token";
export interface UrlState {
    /**
     * 外部链接
     */
     userCenterUrl: String;
     rechargeUrl:String;
  
  }

const module: Module<UrlState, RootState> = {
  namespaced: true,
  state: {
    userCenterUrl:'',
    rechargeUrl:''
  },
  mutations: {
       /**
     *  设置外部链接
     * @param state
     * @param req token string    rememberMe 是否保存到localStorage
     */
        setUserCenterUrl(state,url) {
            state.userCenterUrl=url
      },
      setRechargeUrl(state,url) {
        state.rechargeUrl=url
  },
    
  },
  actions: {
    // setExternalUrl({ state, commit, dispatch }) {
    //     state.externalUrl=url
    // }
     /**
     * 添加url
     * @param 
     * @param url
     */
      setUserCenter({ commit, state }, url:String) {
     
        commit("setUserCenterUrl",url);
      },
      setRecharge({ commit, state }, url:String){
        commit("setRechargeUrl",url);
      }
  },
  getters: {
    
  },
};



export default module;
