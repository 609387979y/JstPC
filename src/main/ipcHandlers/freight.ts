import { IpcHandlerType } from "@main/types";
import { ViewSize } from "@main/common/consts";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as path from "path";
import { createLoadingCover } from "@main/common/loading";
import remoteMain from "@electron/remote/main";

const controllerName = "freight";

type ViewType = "small" | "normal";

// 新窗口参数
type NewWinPropType = {
    type: ViewType;
    url: string;
};

let freightWin: BrowserWindow | null = null
const handlers: IpcHandlerType[] = [
    // 修改主窗口大小
    (prop) => {
        return {
            channel: `${controllerName}/setViewType`,
            async handle(type: ViewType) {
                if (type === "small") {
                    freightWin?.setMinimumSize(
                        ViewSize.small.minWidth,
                        ViewSize.small.minHeight
                    );
                    freightWin?.setSize(ViewSize.small.width, ViewSize.small.height);
                } else {
                    freightWin?.setMinimumSize(
                        ViewSize.normal.minWidth,
                        ViewSize.normal.minHeight
                    );
                    freightWin?.setSize(ViewSize.normal.width, ViewSize.normal.height);
                }
                let position = prop.win.getPosition()
                freightWin?.setPosition(position[0] + 50, position[1] + 50);
                return true;
            },
        };
    },
    // dev tools
    (prop) => {
        return {
            channel: `${controllerName}/devTool`,
            async handle(type: ViewType) {
                freightWin?.webContents.openDevTools();
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
                        freightWin?.close();
                        freightWin = null
                        break;
                    case "max":
                        if (freightWin?.isMaximized() == false) {
                            freightWin?.maximize();
                        } else {
                            freightWin?.unmaximize();
                        }

                        break;
                    case "min":
                        freightWin?.minimize();
                        break;
                }

                return true;
            },
        };
    },
    // 打开弹窗
    (prop) => {
        return {
            channel: `${controllerName}/freight`,
            async handle(url: string) {
                if (freightWin && freightWin.isDestroyed() == false) {
                    freightWin.focus() // 存在 则聚焦
                    return
                }
                let newFreightWin = new BrowserWindow({
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
                    show: false
                });
                freightWin = newFreightWin
                remoteMain.enable(freightWin.webContents);

                // let loading = await createLoadingCover(freightWin.id);
                // // 当加载界面被关闭时 显示界面
                // loading.onClose = ()=>{
                //     freightWin?.center();
                //     freightWin?.show();
                // }

                freightWin?.center();
                freightWin?.show();
                if (app.isPackaged) {

                    // 如果已经打包直接加载html文件
                    await freightWin.loadFile(
                        path.join(__dirname, `../renderer/index.html`), {
                        hash: url
                    }
                    );
                } else {
                    const devUrl = `http://${import.meta.env.VITE_DEV_HOST || "127.0.0.1"
                        }:${import.meta.env.VITE_DEV_PORT}`;
                    await freightWin.loadURL(devUrl + "#" + url);
                    freightWin.webContents.openDevTools();
                }
                return true;
            },
        };
    },
    (prop) => {
        return {
            channel: `${controllerName}/close`,
            async handle(url: string) {
                freightWin?.close();
            },
        };
    },
    // 打开元素浏览器 url
    (prop) => {
        return {
            channel: `${controllerName}/externalUrl`,
            async handle(url: string) {

                shell.openExternal(url)

            },
        };
    },
    // 打开弹窗
  (prop) => {
    return {
      channel: `${controllerName}/newWin`,
      async handle({ type, url }: NewWinPropType) {
        let newWin = new BrowserWindow({
          parent: freightWin,
          frame: false,
          ...ViewSize[type],
          webPreferences: {
            devTools: true,
            preload: path.join(__dirname, "../preload/index.cjs"),
          },
        });

        if (app.isPackaged) {
          // 如果已经打包直接加载html文件
          await newWin.loadFile(
            path.join(__dirname, `../renderer/index.html`),
            {
              hash: url, 
            }
          );
        } else { 
          const devUrl = `http://${
            import.meta.env.VITE_DEV_HOST || "127.0.0.1"
          }:${import.meta.env.VITE_DEV_PORT}`;
          await newWin.loadURL(devUrl + "#" + url);
          newWin.webContents.openDevTools();
        }
        newWin.show();
        ipcMain.handleOnce("newWin/close", (event, ...arg) => {
          newWin.close();
        });
        newWin.on("closed", () => {
          ipcMain.removeHandler("newWin/close");
        });
        return true;
      },
    };
  },
];

export default handlers;
