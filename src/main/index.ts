import path from "path";
import { app, BrowserWindow, Menu, session, shell, Tray } from "electron";
import entryInstance from "@main/entry";
import { EntryProps } from "./types";
import { ViewSize } from "@main/common/consts";
import env from "@share/env";
import os from "os";
// sentry 错误监控
import * as Sentry from "@sentry/electron/main";
import wsMediator from "./websocket/mediator";
import remoteMain from "@electron/remote/main";
remoteMain.initialize();

const DEV_HOST = import.meta.env.VITE_DEV_HOST;
if (DEV_HOST === undefined) {
  // 打包模式 监听错误
  Sentry.init({
    dsn: "https://a6bec2d99ab34014921e35f192167a06@o1170863.ingest.sentry.io/6270218",
  });
}

console.log(os.platform());
// 避免某些电脑可能会触发 (gpu_data_manager_impl_private.cc:414: GPU process isn't usable. Goodbye.) 的错误
app.commandLine.appendSwitch("no-sandbox");

app.disableHardwareAcceleration();
if (app.isPackaged && os.platform() == "win32") {
  Menu.setApplicationMenu(null);
}
// mac系统支持
if (os.platform() == "darwin") {
  const appMenu = [
    {
      label: "编辑",
      submenu: [
        { label: "剪切", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "复制", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "粘贴", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "全选", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
        { label: "撤销", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(appMenu);
  Menu.setApplicationMenu(menu);
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

export let win: BrowserWindow | null = null;
// 还没打包就连接到vite显示界面
const devUrl = `http://${import.meta.env.VITE_DEV_HOST || "127.0.0.1"}:${
  import.meta.env.VITE_DEV_PORT
}`;







let tray: Tray;
async function bootstrap() {
  //  /api/file/xxxxx 开头的文件在打包后会 变成 file:///盘符:/api/file/xxxxx 所以需要把file转化为http请求 拼接上host url
  session.defaultSession.webRequest.onBeforeRequest(
    {
      urls: ["file://*"],
    },
    (details, callback) => {
      let url = details.url;
      let idx = url.toLowerCase().indexOf("/api");
      if (idx !== -1) {
        let newUrl = url.substring(idx);
        callback({ redirectURL: env.host + newUrl });
      } else {
        callback({});
      }
    }
  );

  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.cjs"),
      webSecurity: false,
      nodeIntegration: true,
      webviewTag:true
    },
    // 刚进入是个加载界面
    width: ViewSize.small.width,
    height: ViewSize.small.height,
    show: false,
    frame: false,
    transparent: false,
    maximizable:false
  });
  remoteMain.enable(win.webContents);

  win.on("ready-to-show", function () {
    win?.show(); // 初始化后再显示
    win?.focus();
  });





  const props: EntryProps = {
    win,
    wsMediator,
    getTray(){
      return tray;
    }
  };

  // 打开界面前
  await entryInstance.beforeEntry(props);

  if (app.isPackaged) {
    // 如果已经打包直接加载html文件
    await win.loadFile(path.join(__dirname, "../renderer/index.html"));
  } else {
    await win.loadURL(devUrl);
  }
  if (app.isPackaged == false) {
    win.webContents.openDevTools();
  }

  // 打开界面后
  entryInstance.entry(props);
}

app.whenReady().then(bootstrap);

const trayContextMenu = Menu.buildFromTemplate([
  {
    label: "版本更新",
    click() {
      // 前往更新设置界面
      win?.webContents.executeJavaScript(
        `window.location.hash = '/system/setting' `
      );
      if (win?.isVisible() == false) {
        showAllHideWindow()
      }
      win?.focus();
    },
  },
  {
    label: "退出",
    role: "quit",
    click() {
      app.quit();
    },
  },
]);

function showAllHideWindow() {
  // 把所有隐藏的界面显示出来
  for (let window of BrowserWindow.getAllWindows()) {
    if (window.isDestroyed() == false) {
      window.show();
    }
  }
}

app.on("ready", async () => {
  if (os.platform() === "win32") {
    // 设置托盘
    tray = new Tray(path.join(__dirname, "../../build/icon.ico"));

    tray.setToolTip("及时通");
    tray.on("click", () => {
      showAllHideWindow();
    });

    // 设置鼠标右键键事件
    tray.on("right-click", () => {
      tray.popUpContextMenu(trayContextMenu);
    });
    
  }
});

// 关闭
app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// 第二个实例
app.on("second-instance", () => {
  if (win) {
    // 如果运行了第二个实例，则将第一个实例的窗口显示出来
    if (win.isMinimized()) win.restore();
    if (win?.isVisible() == false) {
      showAllHideWindow()
    }
    win?.focus();
  }
});
