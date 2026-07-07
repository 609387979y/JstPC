import { Module } from "vuex";
import { RootState } from "../types";
import request from "@/public/request";
import { ElMessage } from "element-plus";
import { CompanyType } from "@/types/company"
import { storage } from "justom-share"
import env from "@share/env"
import { getElectronAgent } from "@share/agent"
const localStorage = storage.localStorage.default
const sessionStorage = storage.sessionStorage.default
/**
 * 权限配置项
 */
export interface PermissionItemValue {
  /**
   * 权限key
   */
  PermissionKey: string;
  /**
   * 配置项key
   */
  ItemKey: string;
  /**
   * 值
   */
  Value: string;
}
/**
 * 权限搜索
 */
export interface PermissionSearch {
  /**
   *  权限key PermissionKey
   */
  permission: string,
  /**
   * 配置项key ItemKey
   */
  item: string
}

export interface VIP {
  Id: number;
  UserId: number;
  MemberType: number;//会员类型 0普通 1体验 2正式会员 3会员到期
  Number: number;
  CreateTime: string;
  UpdateTime: string;
  Years: number | null;
  Days: string | null;
  ExpirationTime: string | null;
  Frequency: number | null;
}
/**
 * 身份验证相关state
 */
export interface AuthState {
  /**
   * token
   */
  token: string;
  /**
   * 所属企业资料
   */
  employee: Employee | null;
  /**
   * 当前用户账号
   */
  user: User | null;
  /**
   * 是否有多账号
   */
  multipleAccount: boolean

  /**
   * 是否经过企业认证
   */
  certificationStatus: boolean

  // 会员充值信息
  // VipInfo: VIP | null,
  VipInfo: VIP | null,
  /**
   * 当前用户是否职业认证
   */
  isUserAuth: boolean,
}
export interface Employee {
  /**
   * Id
   */
  Id: number;
  /**
   * 名称
   */
  RealName: string;
  /**
   * 手机号
   */
  MobilePhone: string;
  /**
   * 邮箱
   */
  Email: string;
  /**
   * 是否为企业管理员
   */
  IsAdmin: boolean;
  /**
   * 公司Id
   */
  CompanyId: number;
  /**
   * 组织Id
   */
  OrgId: number;
  /**
   * 权限配置项
   */
  PermissionItems: PermissionItemValue[];
  /**
   * 公司类型
   */
  CompanyType: CompanyType
}
export interface User {
  Id: number;
  /**
   * 名称
   */
  RealName: string;
  /**
   * 手机号
   */
  MobilePhone: string;
  /**
   * 邮箱
   */
  Email: string | null;
  /**
   * 头像
   */
  Avatar: string | null;
}
const agent = getElectronAgent()
const TOKEN_KEY: string = "jst:token";


const module: Module<AuthState, RootState> = {
  namespaced: true,
  state: {
    token:
      localStorage.getItem(TOKEN_KEY) ??
      sessionStorage.getItem(TOKEN_KEY) ??
      "",
    employee: null,
    user: null,
    multipleAccount: false,
    certificationStatus: false,
    VipInfo: null,
    isUserAuth: false,
  },
  mutations: {
    /**
     *  设置token
     * @param state
     * @param req token string    rememberMe 是否保存到localStorage
     */
    setToken(state, req: { token: string; rememberMe: boolean }) {
      if (!req.token) {
        state.employee = null;
      }
      state.token = req.token;
      localStorage.saveItem(TOKEN_KEY, req.token);
      if (window._ELECTRON_WINDOW_NAME_ == "main") {
        agent?.ipcRequest("login/setLoginToken", req.token)
      }
    },
    /**
     * 设置企业账号信息
     * @param state
     * @param emp
     */
    setEmployee(state, emp: Employee) {
      state.employee = emp;
    },
    /**
     * 设置企业账号信息
     * @param state
     * @param user
     */
    setUser(state, user: User) {
      state.user = user;

    },
    /**
     * 设置是否有多账号
     * @param state 
     * @param multipleAccount 
     */
    setMultipleAccount(state, multipleAccount: boolean) {
      state.multipleAccount = multipleAccount
    },

    /**
     * 设置是否经过企业认证
     * @param state 
     * @param multipleAccount 
     */
    setCertification(state, certificationStatus: boolean) {
      state.certificationStatus = certificationStatus
    },

    setVipInfo(state, VipInfo: VIP) {
      state.VipInfo = VipInfo
    },

    /**
 * 设置用户职业认证状态
 * @param state 
 * @param isAuth 
 */
    setUserAuth(state, isAuth: boolean) {
      state.isUserAuth = isAuth
    }
  },
  actions: {
    logout({ commit }) {
      commit("setToken", "");
      commit("setEmployee", null);
      commit("setUser", null);

      // 清空内容
      localStorage.clear();
      sessionStorage.clear();


    },
    /**
     * 设置token并获得用户/员工信息
     */
    async setTokenAndGetInfo({ commit, dispatch, state }, token: string) {
      commit("setToken", { token: token, rememberMe: true });
      if (!state.token) {
        console.error("TOKEN 赋值失败", state.token)
      }
      await dispatch("getCurrentLoggedInfo");
    },
    /**
     * 获得当前员工信息
     * @param param0
     * @returns
     */
    async getCurrentEmployeeInfo({ commit, dispatch, rootState }) {
      let employeeRes = await request.get("/api/CurrentEmployee/Current", {}, "currentEmployee/current");
      if (!employeeRes) {
        commit("setEmployee", null);
        return null;
      }
      if (employeeRes.Status == false) {
        return;
      }
      commit("setEmployee", employeeRes.Data);

      // TODO: 客户端暂无菜单相关的操作
      // await dispatch("menu/getCurrentEmployeeMenuTree", {}, { root: true });
      return employeeRes.Data;
    },
    /**
     * 获得当前用户信息
     */
    async getCurrentUserInfo({ commit }) {
      let userRes = await request.get("/api/CurrentUser/Current", {}, "CurrentUser/Current");
      if (!userRes) {
        return;
      }
      commit("setUser", userRes);
      return userRes;
    },

    /**
     * 获得当前用户 / 员工的信息
     * @param param0
     */
    async getCurrentLoggedInfo({ dispatch, commit }) {

      await Promise.allSettled([
        dispatch("getCurrentUserInfo"),
        // 尝试登录员工
        dispatch("getCurrentEmployeeInfo"),
        dispatch("getVipInfo"),
        dispatch("getUserAuth"),
      ]);


    },
    /**
     * 检查当前是不是登录了员工
     * 登录了 -> true
     * 未登录 -> 尝试调用接口登录一个默认员工 -> true/false
     * @param param0
     */
    async checkAndTryChooseEmployee({ commit, dispatch, state }) {

      if (state.employee) {
        return true;
      }

      // 指定客户进行登录
      let res = await request.post("/api/AuthUser/TryChooseDefaultEmployee", { type: 1 });
      // 验证是否经过企业认证
      commit("setCertification", res.Status)
      if (res.Status) {
        commit("setToken", { token: res.Data, rememberMe: true });
        await dispatch("getCurrentEmployeeInfo");

        dispatch("pay/refreshBalance", {}, { root: true })


        return true;
      }
      return false;
    },

    // 获取会员信息
    async getVipInfo({ commit }) {
      let res = await request.get("/api/CargoRate/SelectVIP", { Type: 1 }, "Vip/GetVipInfo");
      if (res.Status == false) {
        return;
      }
      console.log(res.Data, "会员信息");
      commit("setVipInfo", res.Data)
      return res.Data
    },

    /**
 * 获取当前用户职业认证状态
 * @param param0 
 * @returns 
 */
    async getUserAuth({ commit }) {
      let res = await request.get("/api/PayPlan/GetCurrentUserPayPlan", {});
      if (res.Status) {
        // 认证状态为 已认证
        if (res.Data.ValidateStatus === true) {
          commit("setUserAuth", true);
          return true;
        }
      }
      commit("setUserAuth", false);
      return false;
    }
  },
  getters: {
    /**
 * 是否是子管理员
 * @param state 
 * @returns 
 */
    isAdmin: function (state) {
      if (state.employee && state.employee.IsAdmin == true) {
        return true
      }
      return false
    },
    /**
     * 获得权限
     * @param state 
     * @returns 值
     * 
     * 使用方法 $store.auth.getter.getPermission({key})
     */
    getPermission: function (state) {
      //返回一个函数用于接收
      return function (target: PermissionSearch): string | null {

        if (!state.employee) {
          return null;
        }

        let item = state.employee.PermissionItems.find(
          (t) =>
            t.ItemKey == target.item && t.PermissionKey == target.permission
        );

        if (item) {
          return item.Value;
        }
        return null;
      };
    },
  },
};



export default module;
