import WebSocket from "ws";
import EventEmitter from "events"
import TypedEmitter from "typed-emitter"
import { app } from "electron"
import { WsMessage } from "@share/types/websocket"
import env from "@share/env"
export type MessageEvents = {
  /**
   * 连接建立时
   */
  onOpen():any
  /**
   * 断连后重新连接
   */
  onReConnect():any
  /**
   * 收到消息时
   * @param msg
   */
  onMessage(msg:WsMessage):any
  /**
   * 验证身份完成时
   */
  onAuthenticated():any
  /**
   * 关闭时
   */
  onClose():any

}


const messageEmitter = new EventEmitter() as TypedEmitter<MessageEvents>


const state = {
  ws:<WebSocket | null>null,
  connecting:false,
  enableLog: !app.isPackaged 
}

function wsLog(content:string){
    if(state.enableLog){
      console.log("[WebSocket] " + content)
    }
}


const host = import.meta.env.VITE_WEB_SOCKET


/**
 * 防抖
 * @param fn 
 * @param delay 
 * @returns 
 */
function debounce(fn:Function,delay:number){
  let timer:any = null //借助闭包
  return function() {
      if(timer){
          clearTimeout(timer) 
          timer = setTimeout(fn,delay) 
      }else{
          timer = setTimeout(fn,delay)
      }
  }
}

/**
 * 防抖5秒等待 重连
 */
const reConnect = debounce(()=>{
  initWebsocket(true);
},5000);



function initWebsocket(isReconnect:boolean = false){
  wsLog('Try Connect WebSocket Server: ' + host)
  state.ws = null
  state.ws = new WebSocket(host as string);
  state.ws.on("open",()=>{
    wsLog('Connected!')
    state.connecting = true

    messageEmitter.emit("onOpen")
    if(isReconnect){
      messageEmitter.emit("onReConnect")
    }
  })
  state.ws.on("message",(msg)=>{
    wsLog(msg.toString())
    let content = msg.toString("utf-8")
    let message:WsMessage = JSON.parse(content)
    if(message.type == "pong"){
      return
    }
    
    messageEmitter.emit("onMessage",message)
  })
  state.ws.on("close",()=>{
    wsLog('Close!')
    state.connecting = false
    reConnect();
  })
  state.ws.on("error",()=>{
    wsLog('Error!')
    state.connecting = false
    reConnect();
  })
}

function send(msg:WsMessage){
  if(state.ws == null || state.connecting == false){
    return
  }
  
  state.ws.send(JSON.stringify(msg))
}

// 20秒进行一次heart beat
const heartBeat = setInterval(()=>{
  if(state.ws == null || state.connecting == false){
    return
  }
  state.ws.send(`{type:"ping",content:"${env.version}"}`)
},5000); 

initWebsocket();



export default {
  event:messageEmitter,
  send
}
