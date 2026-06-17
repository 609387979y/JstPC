
import { BrowserWindow, Tray } from 'electron'
import Mediator from "./websocket";
export interface EntryProps{
    win:BrowserWindow,
    wsMediator:typeof Mediator
    getTray():Tray
}
export interface EntryHandler{
  beforeEntry:(props:EntryProps)=>Promise<void>,
  entry:(props:EntryProps)=>Promise<void>,
}




export type DefineHandler = (props:EntryProps)=>IpcMainHandler
export type IpcHandlerType = IpcMainHandler | DefineHandler

export interface IpcMainHandler {

    /**
     * 
     * 监听 channel
     */
    channel:string
    /**
     * 只触发一次
     */
    once?:boolean,
    /**
     * 初始化 handler
     * @param prop 
     */
    setup?(prop:EntryProps):void
    
    /**
     * 接收并回复消息
     * @param args 
     */
    handle(...args:any[]):Promise<any>

    [key:string]:any
}

