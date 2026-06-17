import { App } from "@vue/runtime-core";
import { Router, useRoute } from "vue-router";
import { Store } from "vuex";
import { http } from "justom-share";
import { RootState } from "./store/types";
import { WsMessage } from "@share/types/websocket";
import { getElectronAgent } from "@share/agent";
import request from "@/public/request"
import env from "@share/env"
interface Components {
  app: App;
  router: Router;
  store: Store<RootState>;
  httpInstance: http.AxiosRequest;
}

/**
 * axios 拦截器
 * @param components
 */
function axiosInterceptors(components: Components) {
  const { httpInstance, store, router } = components;
  // http
  // 将每次请求都附上 jwt token
  httpInstance.axios.interceptors.request.use(
    (config) => {
      config.headers["JstInfo"] = `type:client|version:${env.version}`;
      let token = store.state.auth.token;

      config.headers["Authorization"] = "Bearer " + (token ?? "");
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  // response
  httpInstance.axios.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      switch (error.response && error.response.status) {
        case 401:
          store.commit("auth/setToken", "");

          // 如果 未匹配到路由 或者是 标记了allowLogout的路由 不弹出登出
          if (
            router.currentRoute.value.matched.length == 0 ||
            router.currentRoute.value.meta.allowLogout
          ) {
            // 如果当前界面允许未登录访问 不进行任何操作
            return;
          }

          if (store.state.AccountMode === "employee") {
            router.push("/employeeLogin");
          } else {
            // 出现401 打回到登录界面
            // TODO: 401处理
          }

          break;
        case 403:
          // 查看是否有新的token写入
          for (let key in error.response.headers) {
            if (key.toLocaleLowerCase() == "loginaccesstoken") {
              await store.dispatch(
                "auth/setTokenAndGetInfo",
                error.response.headers[key]
              );
              break;
            }
          }
          break;
      }

      return Promise.reject(error);
    }
  );
}

/**
 * 路由守护
 * @param components
 */
function routerGuard(components: Components) {
  const { router, store } = components;

  // router
  router.beforeEach(async (to, from, next) => {
    // 修改标题
    document.title = `${to.meta.title ?? ""} - ${store.state.systemName}`;
    next();
  });
}

/**
 *  组合/关联 各个组件
 * @param app
 * @param router
 * @param store
 * @param httpInstance
 */
export default function composition(components: Components) {
  // router
  routerGuard(components);
  // http
  axiosInterceptors(components);

  const agent = getElectronAgent();


  if (window._ELECTRON_WINDOW_NAME_ == "main") {

    window.$ipc.on("v", async () => {
      components.store.commit("auth/setToken", { token: components.store.state.auth.token, rememberMe: true })
    });

    window.$ipc.on("company/firstEntry", async (_, data: WsMessage) => {
      await components.store.dispatch("auth/checkAndTryChooseEmployee")

      let emp = components.store.state.auth.employee
      if (emp == null) {
        return
      }

      // 触发 打开界面
      agent?.ipcRequest("window/newWin", {
        type: "authorization",
        url: "/internalComponents/userAuthorization?success=" + data.content + "&companyName=" + emp.CompanyName,
      });

    });
    // 触发 打开界面
    // agent?.ipcRequest("window/newWin", {
    //   type: "authorization",
    //   url: "/internalComponents/userAuthorization?success=" + 1 + "&companyName=" + "及时通测试",
    // });

    window.$ipc.on("pay/amount", () => {
      components.store.dispatch("pay/refreshBalance");
    })

    // 断线重连
    window.$ipc.on("auth/setWebSocketToken", () => {
      components.store.commit("auth/setToken",{token:components.store.state.auth.token,rememberMe:true});
    })

  }
}
