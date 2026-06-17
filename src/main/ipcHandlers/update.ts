import { IpcHandlerType } from "@main/types";
import { autoUpdater } from "electron-updater";
import os from "os";
import env from "@share/env";
import { ipcMain, WebContents } from "electron";
import { AppVersionResult, CheckUpdateResult } from "@share/types/update";


const controllerName = "update";

const state = {
  info: <AppVersionResult | null>null,
  webContents: <WebContents | null>null,
};

autoUpdater.autoDownload = true;

const handlers: IpcHandlerType[] = [
  // 检查是否需要更新
  (prop) => {
    autoUpdater.on("error", function (error) {
      prop.win.webContents.send(`update/log`, "trigger:error " + error);
    });
    autoUpdater.on("checking-for-update", function () {
      prop.win.webContents.send(`update/log`, "trigger: checking-for-update");
    });
    autoUpdater.on("update-available", function (info) {
      prop.win.webContents.send(`update/log`, {"key":"update-available",value:info});
      prop.win.webContents.send(`update/available`, {"key":"update-available",value:info});
    });
    autoUpdater.on("update-not-available", function (info) {
      prop.win.webContents.send(`update/log`, {"key":"update-not-available",value:info});
    });
    autoUpdater.on("update-downloaded", function (info) {
      prop.win.webContents.send(`update/log`, {"key":"downloaded",value:info});
      prop.win.webContents.send(`update/downloaded`, {"key":"update-downloaded",value:info});
      // 下载完成
    });

    // 更新下载进度事件
    autoUpdater.on("download-progress", function (progressObj) {
      prop.win.webContents.send(`update/log`, {"key":"downloaded",value:progressObj});
      prop.win.webContents.send("update/progress", progressObj);
    });
    

    return {
      channel: `${controllerName}/checkUpdate`,
      async handle() {
        autoUpdater.checkForUpdates()

      },
    };
  },


  (prop)=>{
    return {
      channel:`${controllerName}/quitAndInstall`,
      async handle() {
        autoUpdater.quitAndInstall()
      },
    }
  }
];

export default handlers;
