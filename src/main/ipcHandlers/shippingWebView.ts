import { IpcHandlerType } from "@main/types";
import { ViewSize } from "@main/common/consts";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as path from "path";
import { createLoadingCover } from "@main/common/loading";
import remoteMain from "@electron/remote/main";

const controllerName = "shippingWebView";

type ViewType = "small" | "normal";

// 新窗口参数
type NewWinPropType = {
    type: ViewType;
    url: string;
};

let shippingQueryWin: BrowserWindow | null = null
const handlers: IpcHandlerType[] = [
    // 修改主窗口大小
    (prop) => {
        return {
            channel: `${controllerName}/setViewType`,
            async handle(type: ViewType) {
                if (type === "small") {
                    shippingQueryWin?.setMinimumSize(
                        ViewSize.small.minWidth,
                        ViewSize.small.minHeight
                    );
                    shippingQueryWin?.setSize(ViewSize.small.width, ViewSize.small.height);
                } else {
                    shippingQueryWin?.setMinimumSize(
                        ViewSize.normal.minWidth,
                        ViewSize.normal.minHeight
                    );
                    shippingQueryWin?.setSize(ViewSize.normal.width, ViewSize.normal.height);
                }
                let position = prop.win.getPosition()
                shippingQueryWin?.setPosition(position[0] + 50, position[1] + 50);
                return true;
            },
        };
    },
    // dev tools
    (prop) => {
        return {
            channel: `${controllerName}/devTool`,
            async handle(type: ViewType) {
                shippingQueryWin?.webContents.openDevTools();
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
                        shippingQueryWin?.close();
                        shippingQueryWin = null
                        break;
                    case "max":
                        if (shippingQueryWin?.isMaximized() == false) {
                            shippingQueryWin?.maximize();
                        } else {
                            shippingQueryWin?.unmaximize();
                        }

                        break;
                    case "min":
                        shippingQueryWin?.minimize();
                        break;
                }

                return true;
            },
        };
    },
    // 打开弹窗
    (prop) => {
        return {
            channel: `${controllerName}/shippingWebView`,
            async handle(url: string) {
                if (shippingQueryWin && shippingQueryWin.isDestroyed() == false) {
                    shippingQueryWin.focus() // 存在 则聚焦
                    return
                }

                let newFreightWin = new BrowserWindow({
                    frame: false,
                    webPreferences: {
                        devTools: true,
                        preload: path.join(__dirname, "../preload/index.cjs"),
                        webviewTag: true
                    },
                    width: ViewSize.normal.width,
                    height: ViewSize.normal.height,
                    minWidth: ViewSize.normal.minWidth,
                    minHeight: ViewSize.normal.minHeight,
                    center: true,
                    show: false
                });
                shippingQueryWin = newFreightWin
                remoteMain.enable(shippingQueryWin.webContents);

                let loading = await createLoadingCover(shippingQueryWin.id);
                // 当加载界面被关闭时 显示界面
                loading.onClose = () => {
                    shippingQueryWin?.center();
                    shippingQueryWin?.show();
                }

                if (app.isPackaged) {

                    // 如果已经打包直接加载html文件
                    await shippingQueryWin.loadFile(
                        path.join(__dirname, `../renderer/index.html`), {
                        hash: url
                    }
                    );
                } else {
                    const devUrl = `http://${import.meta.env.VITE_DEV_HOST || "127.0.0.1"
                        }:${import.meta.env.VITE_DEV_PORT}`;
                    await shippingQueryWin.loadURL(devUrl + "#" + url);
                    shippingQueryWin.webContents.openDevTools();
                }
                return true;
            },
        };
    },
    (prop) => {
        return {
            channel: `${controllerName}/close`,
            async handle(url: string) {
                shippingQueryWin?.close();
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
