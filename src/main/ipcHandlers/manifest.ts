import { IpcHandlerType } from "@main/types";
import { ViewSize } from "@main/common/consts";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as path from "path";
import remoteMain from "@electron/remote/main";
import { createLoadingCover } from "@main/common/loading";

const controllerName = "manifest";

type ViewType = "small" | "normal";

// 新窗口参数
type NewWinPropType = {
  type: ViewType;
  url: string;
};

let manifestWin: BrowserWindow | null = null;

const handlers: IpcHandlerType[] = [
  // 修改主窗口大小
  (prop) => {
    return {
      channel: `${controllerName}/setViewType`,
      async handle(type: ViewType) {
        if (type === "small") {
          manifestWin?.setMinimumSize(
            ViewSize.small.minWidth,
            ViewSize.small.minHeight
          );
          manifestWin?.setSize(ViewSize.small.width, ViewSize.small.height);
        } else {
          manifestWin?.setMinimumSize(
            ViewSize.normal.minWidth,
            ViewSize.normal.minHeight
          );
          manifestWin?.setSize(ViewSize.normal.width, ViewSize.normal.height);
        }
        let position = prop.win.getPosition();
        manifestWin?.setPosition(position[0] + 50, position[1] + 50);
        return true;
      },
    };
  },
  // dev tools
  (prop) => {
    return {
      channel: `${controllerName}/devTool`,
      async handle(type: ViewType) {
        manifestWin?.webContents.openDevTools();
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
            manifestWin?.close();
            manifestWin = null;
            break;
          case "max":
            if (manifestWin?.isMaximized() == false) {
              manifestWin?.maximize();
            } else {
              manifestWin?.unmaximize();
            }

            break;
          case "min":
            manifestWin?.minimize();
            break;
        }

        return true;
      },
    };
  },
  // 打开弹窗
  (prop) => {
    return {
      channel: `${controllerName}/manifest`,
      async handle(url: string) {
        // 窗口已创建并且未被销毁

        if (manifestWin && manifestWin.isDestroyed() == false) {
          manifestWin.focus(); // 存在 则聚焦
          return;
        }

        let newManifestWin = new BrowserWindow({
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
        remoteMain.enable(newManifestWin.webContents);
        manifestWin = newManifestWin;
        // let loading = await createLoadingCover(manifestWin.id);
        // // 当加载界面被关闭时 显示界面
        // loading.onClose = ()=>{
        //     manifestWin?.center();
        //     manifestWin?.show();
        // }

        manifestWin?.show();
        manifestWin?.center();

        if (app.isPackaged) {
          // 如果已经打包直接加载html文件
          await manifestWin.loadFile(
            path.join(__dirname, `../renderer/index.html`),
            {
              hash: url,
            }
          );
        } else {
          const devUrl = `http://${
            import.meta.env.VITE_DEV_HOST || "127.0.0.1"
          }:${import.meta.env.VITE_DEV_PORT}`;
          await manifestWin.loadURL(devUrl + "#" + url);
          manifestWin.webContents.openDevTools();
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
