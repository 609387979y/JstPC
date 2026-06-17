import { createAgent } from "@pre/agent";
import { contextBridge, ipcRenderer,app } from "electron";
import os from "os";

import remote from "@electron/remote"


try{
  const currentWindow = remote.getCurrentWindow();
  console.log('currentWindow',currentWindow.id)

  if(currentWindow.id == 1){
    contextBridge.exposeInMainWorld("_ELECTRON_WINDOW_NAME_","main")
  }
  contextBridge.exposeInMainWorld("_ELECTRON_WINDOW_ID_",currentWindow.id)
  
}catch(err){
  console.warn(err)
}


const agent = createAgent();


contextBridge.exposeInMainWorld("electron_agent", agent);
contextBridge.exposeInMainWorld("__PLATFORM__", os.platform().replace("32","") );


contextBridge.exposeInMainWorld('$ipc', {
  on: (channel:string, listener:any) => {
    ipcRenderer.on(channel, listener);
    return () => {
      ipcRenderer.removeListener(channel, listener);
    };
  }
});

// 页面加载中动画效果


window.addEventListener(
  "keydown",
  (e) => {
    if (e.key == "F12") {
      agent.ipcRequest("window/devTool");
    }
    if(e.key == "F5"){
        window.location.reload()
    }
  },
  false
);

