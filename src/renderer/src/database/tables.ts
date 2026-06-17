/**
 * 系统日志
 */
export interface SystemLog {
    id?:number
    /**
     * 内容
     */
    content:string
    /**
     * 来源 (报错位置)
     */
    from:string
    /**
     * 是否汇报
     */
    report:boolean
    /**
     * 创建时间
     */
    createTime:Date
}
