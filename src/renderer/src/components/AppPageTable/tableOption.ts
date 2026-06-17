

/**
 * Table Option
 *
 * @export
 * @interface TableOption
 */
export default interface TableOption{
  /**
   * 页数
   *
   * @type {number}
   * @memberof TableOption
   */
  page?:number,
  /**
   * 每页数量
   *
   * @type {number}
   * @memberof TableOption
   */
  pageSize?:number,
  /**
   * 每页数量选择列表
   *
   * @type {Array<number>}
   * @memberof TableOption
   */
  pageSizes?:Array<number> 
  /**
   * 总数
   *
   * @type {number}
   * @memberof TableOption
   */
  total?:number,
  /**
   * 加载状态
   *
   * @type {boolean}
   * @memberof TableOption
   */
  loading?:boolean,
  /**
   * 选中的行
   *
   * @type {Array<any>}
   * @memberof TableOption
   */
  selected?:Array<any>,
  /**
   * 选中Filter
   */
  selectFilter?:<T = any>(item:T) => T,
  /**
   * 表格重置/ 刷新
   *
   * @memberof TableOption
   */
  reset?:Function

  [propName:string]:any
}
