import { Module } from "vuex";
import { RootState } from "../types";
import request from "@/public/request";
import { i } from "mathjs";
import { Facet } from "@antv/g2plot";
import { ElMessage } from "element-plus";

/**
* 用户计划状态
*/
export interface UserPlanStatus {
    /** 是否可以访问运价等功能 */
    Pass: boolean;
    /** 是否允许开启7天体验 */
    CanSubmitUserTrial: boolean;
    /**
     * 是否允许提交企业审核
     */
    CanSubmitCompanyAudit: number,
    /** 配置的时间是否已经过期 */
    Expired: boolean;
    /** 过期时间，可能为 null */
    ExpireTime: Date | null;
    /** 计划名称 */
    PlanName: string;
    /** 角色 */
    Role: string;
    /** 消息 */
    Message: string;
}

/**
 * 身份验证相关state
 */
export interface PayPlanState {
    // 付费计划状态
    status: UserPlanStatus | null,
    /**
     * dialog组件 实例
     */
    dialogRef: any


}
const module: Module<PayPlanState, RootState> = {
    namespaced: true,
    state: {
        status: null,
        dialogRef: null
    },
    getters: {

        /**
         * 是否可以提交试用请求
         * @param state 
         * @returns 
         */
        canSubmitUserTrial(state): boolean {
            if (state.status) {
                return state.status.CanSubmitUserTrial
            }
            return false
        },
        /**
         * 是否可以提交企业审核
         * @param state 
         * @returns 
         */
        canSubmitCompanyAudit(state): number {
            if (state.status) {
                return state.status.CanSubmitCompanyAudit ? 1 : (!state.status.CanSubmitCompanyAudit && state.status.Role == "Company" && state.status.Pass) ? 2 : 0
            }
            return 0
        },
        planInfo(state): UserPlanStatus {
            // 当null的时候返回空值
            if (state.status) {
                return state.status
            }
            return {
                Pass: false,
                CanSubmitUserTrial: false,
                CanSubmitCompanyAudit: 0,
                Expired: false,
                ExpireTime: null,
                PlanName: "",
                Role: "User",
                Message: ""
            };
        }
    },
    mutations: {
        setStatus(state, status: UserPlanStatus) {
            state.status = status
        },
        setDialogRef(state, ref: any) {
            state.dialogRef = ref;
        }
    },
    actions: {
        getDialogRef(ctx) {
            return ctx.state.dialogRef
        },
        /**
         * 获得/更新 付费计划
         */
        async getPayPlan(ctx) {
            await ctx.dispatch("auth/checkAndTryChooseEmployee", {}, {
                root: true
            })

            let res = await request.get("/api/PayPlan/CheckPlanStatus")

            ctx.commit("setStatus", res)
        },
        // 检查是否需要弹窗
        // companyOnly 只有公司才能用的功能
        async checkShowPlanDialog(ctx, companyOnly) {
            await ctx.dispatch("getPayPlan")
            let visiable = ctx.state.status?.Pass

            if (visiable === true) {
                // 限定公司才能用的功能判断
                if (companyOnly && ctx.state.status?.Role == "User") {
                    // 显示弹窗
                    ctx.state.dialogRef.openPlanDetailDialog('company')
                    return Promise.reject()
                }


                // 可以使用
                return Promise.resolve()
            } else {
                // 显示弹窗
                ctx.state.dialogRef.openPlanOptionDialog()
                return Promise.reject()
            }
        },
        /**
         * 打开付费计划弹窗
         * @param ctx 
         */
        openPlanOptionDialog(ctx, type) {
            let dialogRef = ctx.state.dialogRef
            if (dialogRef && !type) {
                dialogRef.openPlanOptionDialog()
            }
            if (dialogRef && type) {
                dialogRef.openPlanDetailDialog(type);
            }
        },
        /**
         * 打开付费计划详情弹窗
         * @param ctx 
         * @param type  company/user 企业/个人
         */
        async openPlanDetailDialog(ctx, type) {
            let dialogRef = ctx.state.dialogRef
            if (dialogRef) {
                dialogRef.openPlanDetailDialog(type)
            }
        },
        /**
         * 提交用户试用申请
         * @param ctx 
         */
        async submitUserPayPlan(ctx) {
            // 先验证是否已经开通
            await ctx.dispatch("getPayPlan")

            if (ctx.state.status!.CanSubmitUserTrial == false) {
                ElMessage.error("状态发送了变化,请刷新页面后重试")
                return false;
            }

            let res = await request.post("/api/PayPlan/StartFreeTrail")
            if (res.Status) {
                // 成功
                await ctx.dispatch("getPayPlan")
                ElMessage.success("开通成功")
                return true;
            } else {
                ElMessage.error(res.Message)
                return false;
            }
        }
    },
};

export default module;
