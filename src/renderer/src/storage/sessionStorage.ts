
/**
 * 保存对象到sessionStorage
 * @template T
 * @param {string} key
 * @param {T} value
 */
 function saveObjectItem<T extends any>(key:string,value:T):void{
    saveItem(key,JSON.stringify(value));
}

/**
 * 保存字符串到sessionStorage
 * @param key 
 * @param value 
 */
function saveItem(key:string,value:string):void{
    window.sessionStorage.setItem(key,value);
}
/**
 * 获得Item
 * @param key 
 */
function getItem(key:string):string | null{
    return window.sessionStorage.getItem(key);
}
/**
 * 获得Item 转化为Object
 * @param key 
 */
function getItemToObject<T>(key:string):T | null{
    let item = getItem(key);
    if(item == null){
        return null;
    }
    return <T>JSON.parse(item);
}

/**
 * 删除item
 * @param key 
 */
function removeItem(key:string):void{
    window.sessionStorage.removeItem(key);
}
/**
 * 清空
 */
function clear(){
    window.sessionStorage.clear();
}

export default {
    saveObjectItem,
    saveItem,
    getItem,
    getItemToObject,
    removeItem,
    clear
}