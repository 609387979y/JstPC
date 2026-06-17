import { ipcMain, ipcRenderer, app, BrowserWindow } from "electron";
import {
  IpcHandlerType,
  EntryProps,
  EntryHandler,
  DefineHandler,
  IpcMainHandler,
} from "./types";
import vm from "vm";
import axios from "axios";
import axiosAdapter from "axios/lib/adapters/http";
import dayjs from "dayjs";
import urlLib from "url"
import path from "path"
/**
 * 初始化 ipc handler
 */
function initIpcHandler(props: EntryProps) {
  const handleModules = import.meta.globEager("./ipcHandlers/**/*.{js,ts}");
  let handlers: IpcHandlerType[] = [];

  for (const path in handleModules) {
    const module = handleModules[path];
    const defaultExport = module.default as Array<IpcHandlerType>;
    handlers = handlers.concat(defaultExport);
  }

  for (let handler of handlers) {
    // 初始化 handler
    let instance: IpcMainHandler | null = null;
    if (typeof handler === "function") {
      let func = handler as DefineHandler;
      instance = func(props);
    } else {
      instance = handler as IpcMainHandler;
    }

    // 调用setup 进行handler初始化
    if (instance.setup && typeof instance.setup === "function") {
      instance.setup(props);
    }

    if (instance.once === true) {
      ipcMain.handleOnce(instance.channel, (event, args) => {
        return instance!.handle(...args);
      });
    } else {
      ipcMain.handle(instance.channel, (event, args) => {
        return instance!.handle(...args);
      });
    }
  }
}


const devUrl = `http://${import.meta.env.VITE_DEV_HOST || "127.0.0.1"}:${import.meta.env.VITE_DEV_PORT
  }`;


const entry: EntryHandler = {
  async beforeEntry(props) {
    initIpcHandler(props);
  },
  async entry(props) {
    // 收到消息推送到页面
    props.wsMediator.event.on("onMessage", (msg) => {
      for (let window of BrowserWindow.getAllWindows()) {
        if (msg.type == "company/firstEntry") {
          // 通知到main renderer
          window.webContents.send("company/firstEntry", msg);
        }
        if (msg.type == "freightRate/inquire") {
          window.webContents.send("freightRate/inquire", msg);
        }
        if (msg.type == "cargotracking/inquire") {
          window.webContents.send("cargotracking/inquire", msg);
        }
        if (msg.type == "pay/amount") {
          // 金额发生了变化 通知界面进行更新
          window.webContents.send("pay/amount", msg);
        }
      }
    })

    // 重连的时候
    props.wsMediator.event.on("onReConnect", () => {
      // 进行websocket验证
      props.win.webContents.send("auth/setWebSocketToken");
    })


    props.win.webContents.on("did-navigate", async (event, url) => {
      // 主要界面url发生变化
      if (url.indexOf('/wxLogin') != -1) {
        let s = new urlLib.URL(url)
        let hashUrl = s.origin + s.hash.replace('#', '');
        let parseUrl = new urlLib.URL(hashUrl);




        if (app.isPackaged) {
          // 如果已经打包直接加载html文件
          await props.win.loadFile(path.join(__dirname, "../renderer/index.html"), {
            hash: "/loginHandle" + parseUrl.search
          });
        } else {
          await props.win.loadURL(devUrl + "/#/loginHandle" + parseUrl.search);
        }

      }
    })

  },
};

export default entry;
