import { createStore,Module } from "vuex";
import { RootState } from "./types";
import env from "@share/env"


const modules = import.meta.globEager("./modules/*.{js,ts}");


// 动态载入modules
// 模块
let storeModules:any = {};
for(const path in modules){
    const module = modules[path];
    const defaultExport = module.default as Module<any,any>;
    let name = path.replace("./modules/","")
                   .replace(".ts","")
                   .replace(".js","");
    
    storeModules[name] = defaultExport;
}


const store = createStore<RootState>({
  modules: storeModules,
  state:{
    systemName:"及时通",
    host:env.host
  }
});


export default store;