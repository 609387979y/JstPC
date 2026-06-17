import { IpcHandlerType } from "@main/types";
import { ViewSize } from "@main/common/consts";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as path from "path";
import remoteMain from "@electron/remote/main";
import { createLoadingCover } from "@main/common/loading";

const controllerName = "shippingfile";

type ViewType = "small" | "normal";

// 新窗口参数
type NewWinPropType = {
  type: ViewType;
  url: string;
};

let shippingfileWin: BrowserWindow | null = null;

const handlers: IpcHandlerType[] = [
  // 修改主窗口大小
  (prop) => {
    return {
      channel: `${controllerName}/setViewType`,
      async handle(type: ViewType) {
        if (type === "small") {
          shippingfileWin?.setMinimumSize(
            ViewSize.small.minWidth,
            ViewSize.small.minHeight
          );
          shippingfileWin?.setSize(ViewSize.small.width, ViewSize.small.height);
        } else {
          shippingfileWin?.setMinimumSize(
            ViewSize.normal.minWidth,
            ViewSize.normal.minHeight
          );
          shippingfileWin?.setSize(ViewSize.normal.width, ViewSize.normal.height);
        }
        let position = prop.win.getPosition();
        shippingfileWin?.setPosition(position[0] + 50, position[1] + 50);
        return true;
      },
    };
  },
  // dev tools
  (prop) => {
    return {
      channel: `${controllerName}/devTool`,
      async handle(type: ViewType) {
        shippingfileWin?.webContents.openDevTools();
        return true;
      },
    };
  },
  // 最小最大关闭
  (prop) => {
    return {
      channel: `${controllerName}/opt`,
      async handle(optType: "close" | "min" | "max") {
        switch (optType) {
          case "close":
            shippingfileWin?.close();
            shippingfileWin = null;
            break;
          case "max":
            if (shippingfileWin?.isMaximized() == false) {
              shippingfileWin?.maximize();
            } else {
              shippingfileWin?.unmaximize();
            }

            break;
          case "min":
            shippingfileWin?.minimize();
            break;
        }

        return true;
      },
    };
  },
  // 打开弹窗
  (prop) => {
    return {
      channel: `${controllerName}/shippingfile`,
      async handle(url: string) {
        // 窗口已创建并且未被销毁

        if (shippingfileWin && shippingfileWin.isDestroyed() == false) {
          shippingfileWin.focus(); // 存在 则聚焦
          return;
        }

        let newshippingfileWin = new BrowserWindow({
          frame: false,
          webPreferences: {
            devTools: true,
            preload: path.join(__dirname, "../preload/index.cjs"),
          },
          width: ViewSize.normal.width,
          height: ViewSize.normal.height,
          minWidth: ViewSize.normal.minWidth,
          minHeight: ViewSize.normal.minHeight,
          center: true,
          show: false,
        });
        remoteMain.enable(newshippingfileWin.webContents);
        shippingfileWin = newshippingfileWin;
        shippingfileWin?.center();
        shippingfileWin?.show();
 

        if (app.isPackaged) {
          // 如果已经打包直接加载html文件
          await shippingfileWin.loadFile(
            path.join(__dirname, `../renderer/index.html`),
            {
              hash: url,
            }
          );
        } else {
          const devUrl = `http://${
            import.meta.env.VITE_DEV_HOST || "127.0.0.1"
          }:${import.meta.env.VITE_DEV_PORT}`;
          await shippingfileWin.loadURL(devUrl + "#" + url);
          shippingfileWin.webContents.openDevTools();
        }

        return true;
      },
    };
  },
  // 打开元素浏览器 url
  (prop) => {
    return {
      channel: `${controllerName}/externalUrl`,
      async handle(url: string) {
        shell.openExternal(url);
      },
    };
  },
];

export default handlers;
