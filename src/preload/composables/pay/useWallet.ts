import { reactive, ref, computed,inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import request from "@/public/request"
import { useCompanyCertification } from "@/composables/user/certification"
/**
 * 企业钱包
 */
export function useWallet() {
  const store = useStore();
  const router = useRouter();
  const certification = useCompanyCertification();
  const balance = computed(() => {
    return store.state.pay.balance != ""?store.state.pay.balance:0;
  });

  const isBindCompany = computed(()=>{
    return store.state.auth.employee != null
  });



  /**
   * 打开充值页面
   * @returns 
   */
  function openRecharge(){
    if(isBindCompany.value == false){
      certification.toUserAuth()
      return
    }
    let res = router.resolve("/workbench/recharge")
    window.open(res.href)
  }
  /**
   * 前往消费记录页面
   * @returns
   */
  function toTradeRecordList() {
    if(isBindCompany.value == false){
      certification.toUserAuth()
      return
    }
    router.push({
      path: "/workbench/userBill"
    })
  }
  /**
   * 前往充值记录 / 订单记录
   * @returns 
   */
  function toOrderList() {
    if(isBindCompany.value == false){
      certification.toUserAuth()
      return
    }
    router.push({
      path: "/workbench/userWallet"
    })
  }


  return reactive({
    openRecharge,
    toTradeRecordList,
    toOrderList,
    balance
  })
}
