import { IpcHandlerType } from "@main/types";
import { app, BrowserWindow, ipcMain, shell } from "electron";


import { closeWindowByKey } from "@main/common/loading"

const controllerName = "loading";


const handlers: IpcHandlerType[] = [
    // 打开元素浏览器 url
    (prop) => {
        return {
            channel: `${controllerName}/closeCover`,
            async handle(key: number) {
                closeWindowByKey(key);
            },
        };
    },
];

export default handlers;
