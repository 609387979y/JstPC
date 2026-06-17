import { IpcHandlerType } from "@main/types";
import { ViewSize } from "@main/common/consts";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as path from "path";
import { createLoadingCover } from "@main/common/loading";
import remoteMain from "@electron/remote/main";

const controllerName = "external";

type ViewType = "small" | "normal";

// 新窗口参数
type NewWinPropType = {
    type: ViewType;
    url: string;
};

let externalWin: BrowserWindow | null = null
const handlers: IpcHandlerType[] = [
    // 修改主窗口大小
    (prop) => {
        return {
            channel: `${controllerName}/setViewType`,
            async handle(type: ViewType) {
                if (type === "small") {
                    externalWin?.setMinimumSize(
                        ViewSize.small.minWidth,
                        ViewSize.small.minHeight
                    );
                    externalWin?.setSize(ViewSize.small.width, ViewSize.small.height);
                } else {
                    externalWin?.setMinimumSize(
                        ViewSize.normal.minWidth,
                        ViewSize.normal.minHeight
                    );
                    externalWin?.setSize(1480, ViewSize.normal.height);
                }
                let position = prop.win.getPosition()
                externalWin?.setPosition(position[0] + 50, position[1] + 50);
                return true;
            },
        };
    },
    // dev tools
    (prop) => {
        return {
            channel: `${controllerName}/devTool`,
            async handle(type: ViewType) {
                externalWin?.webContents.openDevTools();
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
                        externalWin?.close();
                        externalWin = null
                        break;
                    case "max":
                        if (externalWin?.isMaximized() == false) {
                            externalWin?.maximize();
                        } else {
                            externalWin?.unmaximize();
                        }

                        break;
                    case "min":
                        externalWin?.minimize();
                        break;
                }

                return true;
            },
        };
    },
    // 打开弹窗
    (prop) => {
        return {
            channel: `${controllerName}/external`,
            async handle(url: string) {
               
                if (externalWin && externalWin.isDestroyed() == false) {
                    externalWin.webContents.send("externalweb/newtab", url);
                    externalWin.focus() // 存在 则聚焦
                    return
                }
                let newexternalWin = new BrowserWindow({
                    frame: false,
                    webPreferences: {
                        webviewTag: true,
                        devTools: true,
                        preload: path.join(__dirname, "../preload/index.cjs"),
                    },
                    width: 1480,
                    height: ViewSize.normal.height,
                    minWidth: ViewSize.normal.minWidth,
                    minHeight: ViewSize.normal.minHeight,
                    center: true,
                    show: false
                });
                externalWin = newexternalWin
                remoteMain.enable(externalWin.webContents);
                externalWin?.center();
                externalWin?.show();
                if (app.isPackaged) {
                    // 如果已经打包直接加载html文件
                    await externalWin.loadFile(
                        path.join(__dirname, `../renderer/index.html`), {
                        hash: url
                    }
                    );
                }
                else {
                    
                    const devUrl = `http://${import.meta.env.VITE_DEV_HOST || "127.0.0.1"
                        }:${import.meta.env.VITE_DEV_PORT}`;
                    await externalWin.loadURL(devUrl + "#" + url);
                    externalWin.webContents.openDevTools();
                }
                return true;
            },
        };
    },
    (prop) => {
        return {
            channel: `${controllerName}/close`,
            async handle(url: string) {
                externalWin?.close();
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
];

export default handlers;
