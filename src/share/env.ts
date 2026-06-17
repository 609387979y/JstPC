import pkg from "../../package.json"

export interface ShareEnv{
    /**
     * 是否运行在electron中
     */
    inElectron: boolean;
    /**
     * 服务器地址
     */
    host:string;

    /**
     * 版本
     */
    version:string
    /**
     * 系统
     */
    platform:string;

}



const env:ShareEnv = {
    inElectron: false,
    host:import.meta.env.VITE_AXIOS_HOST as string,
    version:pkg.version,
    platform:""
}




export default env

