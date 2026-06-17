

/**
 * 交易类型
 */
export interface TradeInfo {
    /**
     * 产品类型
     */
    Type:string;
    /**
     * 消费类型
     */
    Action:string;
}

export const tradeCollection:TradeInfo[] = [
    {Type:"及时通",Action:"充值"},
]




/**
 * 获得业务类型下的所有操作
 * @param type 业务类型
 */
export function getTradeTypeActions(type:string){
    return tradeCollection.filter(t=>t.Type == type).map(t=>t.Action)
}
/**
 * 获得所有业务类型
 * @returns 
 */
export function getAllTradeTypes():string[]{
    let set = new Set<string>()
    tradeCollection.forEach(v=>{
        set.add(v.Type)
    })
    let arr:string[] = []
    set.forEach(v=>{
        arr.push(v)
    })
    return arr
}