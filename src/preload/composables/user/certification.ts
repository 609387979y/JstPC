import request from "@/public/request";
import { useStore } from "vuex";
import { getElectronAgent } from "@share/agent";
import { ElMessage } from "element-plus";
import { onMounted, onUnmounted, reactive, ref } from "vue";


const agent = getElectronAgent();




export function useCompanyCertification() {
  const store = useStore();

  /**
   * 前往用户企业认证
   * @returns true => 成功打开界面
   */
  async function toUserAuth(): Promise<boolean> {
    
    // 进入前判断 审核是否已经通过
    if (await store.dispatch("auth/checkAndTryChooseEmployee")) {
      // 审核已通过
      return false;
    }

    let auditRes = await request.get("/api/CompanyAudit/CheckHasRunningAudit");
    if (auditRes.Status) {
      ElMessage.info("审核正在进行中，请稍后");
      return true;
    }
    // 审核是否还在进行中

    if (agent != null) {
      agent.ipcRequest("window/newWin", {
        type: "small",
        url: "/internalComponents/userAuthorization",
      });
      return true;
    }
    return false;
  }

  return reactive({
    toUserAuth,
  });
}
