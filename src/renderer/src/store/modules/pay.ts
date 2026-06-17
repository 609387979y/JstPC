import { Module } from "vuex";
import { RootState } from "../types";
import request from "@/public/request";
import { getElectronAgent } from "@share/agent"
const agent = getElectronAgent()
/**
 * 身份验证相关state
 */
export interface PayState {
    /**
     * 余额
     */
    balance: string;

}
const module: Module<PayState, RootState> = {
  namespaced: true,
  state: {
    balance:""
  },
  getters: {},
  mutations: {
    // 设置余额
    setBalance(state, balance: string) {
        state.balance = balance
    }
  },
  actions: {
    /**
     * 刷新余额
     * @param param0 
     */
    async refreshBalance({ commit }) {

      try{
        let res = await request.get("/api/PayWallet/GetWalletBalance");
        if(res.Status){
          commit("setBalance",res.Data);
        }else{
          commit("setBalance",0)
        }
      }catch{
        commit("setBalance",0)
      }

    }
  },
};



export default module;
