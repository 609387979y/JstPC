import * as types from "../types"
import request from "@/public/request"
import { reactive,ref,computed,onMounted } from "vue"
import { useStore } from "vuex"
import { utils } from "justom-share"

function useBaseCode(){
    
    const store = useStore()

    // 船公司
    const SHIPPINGList = computed<types.BaseCode[]>(()=>{
        return store.state.manifest.SHIPPINGList
    });
    // 货物类型
    const CARGO_TYPEList = computed<types.BaseCode[]>(()=>{
        return store.state.manifest.CARGO_TYPEList
    });
    // 运输条款(A)
    const CGO_M_DELY_TERMAList = computed<types.BaseCode[]>(()=>{
        return store.state.manifest.CGO_M_DELY_TERMAList
    });
    // 运输条款(B)
    const CGO_M_DELY_TERMBList = computed<types.BaseCode[]>(()=>{
        return store.state.manifest.CGO_M_DELY_TERMBList
    });
    // 运输条款
    const CGO_M_DELY_TERMList = computed<types.BaseCode[]>(()=>{
        return store.state.manifest.CGO_M_DELY_TERMList
    });
    
    // 提单类型
    const CGO_MBL_TYPEList = computed<types.BaseCode[]>(()=>{
        return store.state.manifest.CGO_MBL_TYPEList
    });

    // 箱型
    const CGO_CN_TYPEList = computed<types.BaseCode[]>(()=>{
        return store.state.manifest.CGO_CN_TYPEList
    });

    // 包装单位
    const CGO_PACKList = computed<types.BaseCode[]>(()=>{
        return store.state.manifest.CGO_PACKList
    });

    // 船代
    const SHIP_AGENTList = computed<types.BaseCode[]>(()=>{
        return store.state.manifest.SHIP_AGENTList
    });





    // VGM
    // VGM 港口
    const VGM_PortList = computed<types.BaseCode[]>(()=>{
        return store.state.manifest.VGM_PortList
    });
    // VGM 船司
    const VGM_ShippingList = computed<types.BaseCode[]>(()=>{
        return store.state.manifest.VGM_ShippingList
    });
    // VGM 码头
    const VGM_DockList = computed<types.BaseCode[]>(()=>{
        return store.state.manifest.VGM_DockList
    });

    /**
     * 转化code到name
     * @param list 
     * @param code 
     * @returns 
     */
    function covertCodeToName(list:types.BaseCode[],code:string){
        if(!code) return utils.formatEmptyString('')
        const item = list.find(item=>item.Code === code)
        if(item) return utils.formatEmptyString(item.Name)
        return utils.formatEmptyString('')
    }



    return {
        SHIPPINGList,
        CARGO_TYPEList,
        CGO_M_DELY_TERMAList,
        CGO_M_DELY_TERMBList,
        CGO_M_DELY_TERMList,
        CGO_MBL_TYPEList,
        CGO_CN_TYPEList,
        CGO_PACKList,
        SHIP_AGENTList,        
        covertCodeToName,
        VGM_PortList,
        VGM_ShippingList,
        VGM_DockList
    }
}

/**
 * 自动补全
 * @returns 
 */
export function useAutoComplete() {

    async function queryVOY(keyword: string, cb: Function) {
        let res = await request.get("/api/CargoEDICommon/AutoCompleteVOY", {
            keyword: keyword
        })
        cb(res.map(t => {
            return {
                value: t
            }
        }))
    }
    async function queryVES(keyword: string, cb: Function) {
        let res = await request.get("/api/CargoEDICommon/AutoCompleteVES", {
            keyword: keyword
        })
        cb(res.map(t => {
            return {
                value: t
            }
        }))
    }
    return reactive({
        queryVOY,
        queryVES
    })
}



export function usePortSearch(setValueFunc:(value:types.CargoEDI_Port)=>any){

    const isLoading = ref(false);
    const ports = ref<types.CargoEDI_Port[]>([])
    
    async function searchPort(query:string){
        isLoading.value = true;
        const result = await request.get(`/api/CargoEDIPort/GetPortList`,{
            page:1,
            limit:10,
            keyword:query
        });
        ports.value = result.Rows;
        isLoading.value = false;
        return result;
    }


    function selectPort(value:string){
        console.log('select value',value)
        let item = ports.value.find(t=>t.Code == value)
        if(item == undefined){
            console.error("未找到港口的item!" + value);
            return
        }
        setValueFunc(item);
    }
    return reactive({
        ports,
        isLoading,
        searchPort,
        selectPort
    })
}

let isFetching = false;
/**
 * options
 * @returns 
 */
export function useEditorOptions(){
    const store = useStore()
    // 基础代码相关
    const baseCode = useBaseCode()


    function onCodeSelectChange(value:string,list:types.BaseCode[],setValueFunc:(value:types.BaseCode)=>any){
        let item = list.find(t=>t.Code == value)
        if(item == undefined){
            console.error("未找到代码的item!" + value);
            return
        }
        setValueFunc(item)
    }


    onMounted(async () => {
        // 防止请求多次
        if(isFetching){
            return
        }
        isFetching = true;
        await store.dispatch("manifest/init")
    })

    return reactive({
        ...baseCode,
        onCodeSelectChange
    })
}