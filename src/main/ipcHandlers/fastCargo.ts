import { IpcHandlerType } from "@main/types";
import { ViewSize } from "@main/common/consts";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as path from "path";
import { createLoadingCover } from "@main/common/loading";
import remoteMain from "@electron/remote/main";

const controllerName = "fastCargo";

type ViewType = "small" | "normal";

// 新窗口参数
type NewWinPropType = {
    type: ViewType;
    url: string;
};

let fastCargoWin: BrowserWindow | null = null
const handlers: IpcHandlerType[] = [
    // 修改主窗口大小
    (prop) => {
        return {
            channel: `${controllerName}/setViewType`,
            async handle(type: ViewType) {
                if (type === "small") {
                    fastCargoWin?.setMinimumSize(
                        ViewSize.small.minWidth,
                        ViewSize.small.minHeight
                    );
                    fastCargoWin?.setSize(ViewSize.small.width, ViewSize.small.height);
                } else {
                    fastCargoWin?.setMinimumSize(
                        ViewSize.normal.minWidth,
                        ViewSize.normal.minHeight
                    );
                    fastCargoWin?.setSize(ViewSize.normal.width, ViewSize.normal.height);
                }
                let position = prop.win.getPosition()
                fastCargoWin?.setPosition(position[0]+50,position[1]+50);
                return true;
            },
        };
    },
    // dev tools
    (prop) => {
        return {
            channel: `${controllerName}/devTool`,
            async handle(type: ViewType) {
                fastCargoWin?.webContents.openDevTools();
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
                        fastCargoWin?.close();
                        fastCargoWin = null
                        break;
                    case "max":
                        if (fastCargoWin?.isMaximized() == false) {
                            fastCargoWin?.maximize();
                        } else {
                            fastCargoWin?.unmaximize();
                        }

                        break;
                    case "min":
                        fastCargoWin?.minimize();
                        break;
                }

                return true;
            },
        };
    },
    // 打开弹窗
    (prop) => {
        return {
            channel: `${controllerName}/fastCargo`,
            async handle(url: string) {
                if (fastCargoWin && fastCargoWin.isDestroyed() == false) {
                    fastCargoWin.focus() // 存在 则聚焦
                    return
                }
                let newfastCargoWin = new BrowserWindow({
                    frame: false,
                    webPreferences: {
                        devTools: true,
                        preload: path.join(__dirname, "../preload/index.cjs"),
                    },
                    width: ViewSize.normal.width,
                    height: ViewSize.normal.height,
                    minWidth: ViewSize.normal.minWidth,
                    minHeight: ViewSize.normal.minHeight,
                    center:true,
                    show:false
                });
                fastCargoWin = newfastCargoWin
                remoteMain.enable(fastCargoWin.webContents);

                // let loading = await createLoadingCover(fastCargoWin.id);
                // // 当加载界面被关闭时 显示界面
                // loading.onClose = ()=>{
                //     fastCargoWin?.center();
                //     fastCargoWin?.show();
                // }

                fastCargoWin?.center();
                fastCargoWin?.show();
                if (app.isPackaged) {

                    // 如果已经打包直接加载html文件
                    await fastCargoWin.loadFile(
                        path.join(__dirname, `../renderer/index.html`),{
                            hash:url
                        }
                    );
                } else {
                    const devUrl = `http://${import.meta.env.VITE_DEV_HOST || "127.0.0.1"
                        }:${import.meta.env.VITE_DEV_PORT}`;
                    await fastCargoWin.loadURL(devUrl + "#" + url);
                    fastCargoWin.webContents.openDevTools();
                }
                return true;
            },
        };
    },
    (prop) => {
        return {
            channel: `${controllerName}/close`,
            async handle(url: string) {
                fastCargoWin?.close();
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
	(prop) => {
	  return {
	    channel: `${controllerName}/downloadUrl`,
	    async handle(url: string) {
	      prop.win.webContents.downloadURL(url);
	    },
	  };
	},
];

export default handlers;
