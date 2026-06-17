import { Module } from "vuex";
import { RootState } from "../types";
import request from "@/public/request";



/**
 *  消息相关state
 */
export interface MessageState {
    /**
     * 未读消息数量
     */
    unReadMessageCount:number

    /**
     * 未读询价
     */
     unReadConsultPriceCount:number
}




const module: Module<MessageState, RootState> = {
  namespaced: true,
  state: {
    unReadMessageCount:0,
    unReadConsultPriceCount:0
  },
  getters: {

  },
  mutations: {
    setUnReadCount(state,count:number){
        state.unReadMessageCount = count
    },
    setNnReadConsultPriceCount(state,count:number){
      state.unReadConsultPriceCount=count
    }
  },
  actions: {
    /**
     * 获得未读消息数量
     * @param param0 
     */
    async getMessageCount({commit}){
        let res = await request.get("/api/Message/UnReadMessageCount", {

        });
        commit("setUnReadCount",res)
        return res;
    },
    /**
     * 获得未读询价消息数量
     * @param param0 
     */
     async getUnReadMessageCount({commit}){
      let res = await request.get("/api/FRInquireCustomer/GetInquireNewCount");
      commit("setNnReadConsultPriceCount",res.All)
      return res;
  }
  },
};

export default module;
