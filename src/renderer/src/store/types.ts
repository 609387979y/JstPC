

/**
 * vuex 根结点类型
 */
export interface RootState{
    /**
     * 系统名称
     */
    systemName:string
    /**
     * 服务器地址
     */
    host:string
    [key:string]:any
}