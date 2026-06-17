import { ViewSize } from "@main/common/consts";
import path from "path";
import { BrowserWindow } from "electron";

export interface CreateCoverOptions {
  width: number;
  height: number;

}

const state = {
  loadingWindows: new Map<number, LoadingCover>(),
};


/**
 * 关闭window
 * @param key 
 */
function closeWindowByKey(key: number) {
  let item = state.loadingWindows.get(key);
  if (item) {
    item.window.destroy();
    state.loadingWindows.delete(key);
    if(item.onClose != null){
      item.onClose();
    }
  }
}


export interface LoadingCover{
  /**
   * cover key
   */
  key:number;
  /**
   * 实例
   */
  window:BrowserWindow;
  /**
   * 关闭加载
   */
  closeLoadingCover():void;
  /**
   * 当触发关闭时触发
   */
  onClose:Function | null;
}

async function createLoadingCover(key:number,
  options: CreateCoverOptions | undefined = undefined
) {
  if (options === undefined) {
    options = {
      width: ViewSize.normal.width,
      height: ViewSize.normal.height,
    };
  }

  let loadingWin = new BrowserWindow({
    frame: false,
    width: options.width,
    height: options.height,
    minWidth: options.width,
    minHeight: options.height,
    center: true,
  });

  await loadingWin.loadFile(path.join(__dirname, `../../build/loading.html`));


  const item:LoadingCover = {
    key:key,
    window:loadingWin,
    closeLoadingCover(){
      closeWindowByKey(this.key);
    },
    onClose:null
  }
  // 先情况/关闭以前的loadingCover
  closeWindowByKey(key);
  state.loadingWindows.set(key, item);
  
  return item;
}

export { createLoadingCover,closeWindowByKey };
