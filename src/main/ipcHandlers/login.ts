import { IpcHandlerType } from "@main/types";
import { ViewSize } from "@main/common/consts";
import { app, BrowserWindow } from "electron";
import mediator from "@main/websocket";

const controllerName = "login";
const handlers: IpcHandlerType[] = [
  (prop) => {
    return {
      channel: `${controllerName}/openLoginWindow`,
      async handle(url: string,size:string) {


        let width = 0;
        let height = 0;
        if(size === "small"){
          width = ViewSize.small.width;
          height = ViewSize.small.height;
        }else{
          width = ViewSize.normal.width;
          height = ViewSize.normal.height;
        }

        let newWin = new BrowserWindow({
          width: width,
          height: height,
        });
        newWin.loadURL(url);
        newWin.show();

        newWin.webContents.on("did-navigate-in-page", async (event, url) => {
          //对应操作
          if (url.endsWith("#/")) {
            // 读取token
            let token = await newWin.webContents.executeJavaScript(
              "localStorage.getItem('jst:token')"
            );
            newWin.close();
            // 销毁对象
            newWin.destroy();
            prop.win.webContents.send("login/loginSuccess", token);
          }
        });
      },
    };
  },
  // 设置登录token
  {

/*

-------------
自动登录
1. websocket 准备就绪
2. main 向renderer发送获得登录token请求 auth/setWebSocketToken
3. renderer 收到请求 调用main的 login/setLoginToken 向websocket发起登录请求
4. websocket 收到登录请求 向服务器进行登录
5. 服务器反馈成功 触发main的onAuthenticated
-------------
主动登录
1. 出现登录等操作
2. renderer 调用main的 login/setLoginToken 向websocket发起登录请求
3. websocket 收到登录请求 向服务器进行登录
4. 服务器反馈成功 触发main的onAuthenticated
-------------

*/

    channel: `${controllerName}/setLoginToken`,
    setup(prop){
      mediator.event.on("onOpen",()=>{
        prop.win.webContents.send("wsauth/login")
      })
    },
    async handle(token: string) {
      // 向web socket 发送token 进行登录
      mediator.send({
        type: "auth/login",
        content: token ?? "",
      });
    },
  },

  // 登出事件  关闭所有后续打开的窗口
  (prop) => {
    return {
      channel: `${controllerName}/logout`,
      async handle() {
        
        let allWindows = BrowserWindow.getAllWindows()
        allWindows.forEach(win=>{
          if(win.id != prop.win.id){
            // 关闭除了主窗口外的所有窗口
            win.close()
          }

        })

        if(prop.win.isMaximized()){
          prop.win.unmaximize()
        }

      },
    };
  },








];




export default handlers;
