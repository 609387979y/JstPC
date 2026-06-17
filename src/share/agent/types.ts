import { http } from "justom-share";

import { IpcRenderer } from "electron"



/**
 * electron 代理 setup 需要的参数
 */
export interface ElectronAgentSetupProps{
    http:http.AxiosRequest
}


/**
 * electron 代理  (被注入到页面的代理)
 */
export interface ElectronAgent{

    // 初始化
    setup(props: ElectronAgentSetupProps ):Promise<void>

    /**
     * ipcRenderer
     */
    renderer:IpcRenderer

    /**
     * ipc请求
     * @param channel 
     * @param args 
     */
    ipcRequest<TResponse = any>(channel:string,...args:any[]):Promise<TResponse>


}
