import { ElectronAgent, ElectronAgentSetupProps } from "@share/agent";
import axios from "axios";
import { contextBridge, ipcRenderer } from "electron";
import axiosAdapter from "axios/lib/adapters/http"

/**
 * 初始化配置
 * @param instance
 * @param props
 */
async function setupAgent(
  instance: ElectronAgent,
  props: ElectronAgentSetupProps
) {
  // 替换 axios的默认请求实现
  axios.defaults.adapter = axiosAdapter;

  // 请求头添加 jst-electron 标记当前是electron
  axios.interceptors.request.use(
    (config) => {
        if(config && config.headers){
            config.headers["jst-electron"] = "true";
        }

        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
  );
}

export function createAgent(): ElectronAgent {
  let agent: ElectronAgent = {
    async setup(props) {
      await setupAgent(this, props);
    },
    ipcRequest(channel, ...args) {
      return ipcRenderer.invoke(channel, args);
    },
    renderer:ipcRenderer
  };


  return agent;
}

