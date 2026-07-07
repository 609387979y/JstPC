import { IpcHandlerType } from "@main/types";
import { ViewSize } from "@main/common/consts";
import { app, BrowserWindow, ipcMain, shell, Menu } from "electron";
import * as path from "path";
import os from "os";
import mediator from "@main/websocket";
const controllerName = "window";

type ViewType = "small" | "normal";

// 新窗口参数
type NewWinPropType = {
  type: ViewType;
  url: string;
};

const handlers: IpcHandlerType[] = [
  // 修改主窗口大小
  (prop) => {
    return {
      channel: `${controllerName}/setViewType`,
      async handle(type: ViewType) {
        if (type === "small") {
          prop.win.setMinimumSize(
            ViewSize.small.minWidth,
            ViewSize.small.minHeight
          );
          prop.win.setMaximizable(false);
          prop.win.setSize(ViewSize.small.width, ViewSize.small.height);
        } else {
          prop.win.setMinimumSize(
            ViewSize.normal.minWidth,
            ViewSize.normal.minHeight
          );
          prop.win.setMaximizable(true);
          prop.win.setSize(ViewSize.normal.width, ViewSize.normal.height);
        }
        prop.win.center();
        return true;
      },
    };
  },
  // dev tools
  (prop) => {
    return {
      channel: `${controllerName}/devTool`,
      async handle(type: ViewType) {
        prop.win.webContents.openDevTools();
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
            if (os.platform() == "darwin") {
              app.quit();
            } else {
              // 缩小到托盘 隐藏
              prop.win.hide();
              // 隐藏所有到托盘
              for (let window of BrowserWindow.getAllWindows()) {
                if (window.isDestroyed() == false) {
                  window.hide();
                }
              }

              prop.getTray().displayBalloon({
                iconType: "none",
                title: "及时通",
                content: "已缩小到托盘"
              })
            }

            break;
          case "max":
            if (prop.win.isMaximized() == false) {
              prop.win.maximize();
            } else {
              prop.win.unmaximize();
            }

            break;
          case "min":
            prop.win.minimize();
            break;
        }

        return true;
      },
    };
  },
  // 打开弹窗
  (prop) => {
    return {
      channel: `${controllerName}/newWin`,
      async handle({ type, url }: NewWinPropType) {
        let newWin = new BrowserWindow({
          parent: prop.win,
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
          const devUrl = `http://${import.meta.env.VITE_DEV_HOST || "127.0.0.1"
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
  // 用外部链接打开内置弹窗
  (prop) => {
    return {
      channel: `${controllerName}/newExternalWin`,
      async handle({ type, url }: NewWinPropType) {
        let newWin = new BrowserWindow({
          parent: prop.win,
          width: 1480,
          height: 900,
          frame: true,
          webPreferences: {
            devTools: true,
            preload: path.join(__dirname, "../preload/index.cjs"),
          },
        });
        newWin.setMenu(null);
        await newWin.loadURL(url);
        if (app.isPackaged) {
        } else {
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
  // 打开元素浏览器 url
  (prop) => {
    return {
      channel: `${controllerName}/externalUrl`,
      async handle(url: string) {
        shell.openExternal(url);
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
  // 打开窗口内页面
  (prop) => {
    return {
      channel: `${controllerName}/internalUrl`,
      async handle(url: string) {
        if (url) {
          prop.win.webContents.send("window/internalLink", url);
          prop.win.focus()
        }
      },
    };
  }

];

export default handlers;
