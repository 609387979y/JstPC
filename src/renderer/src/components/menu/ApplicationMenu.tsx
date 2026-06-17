import ApplicationMenuLayout from "@/components/menu/ApplicationMenuLayout.vue";
import { defineComponent, PropType, reactive, ref } from "vue";
import request from "@/public/request";
import { ElMessage } from "element-plus";

export interface MenuApp {
  /**
   *
   */
  title: string;
  /**
   * 描述
   */
  description: string;
}

function logClick(name: string) {
  request.get("/api/WayApp/ClickLog", { name });
}

export interface AppInfo {
  /**
   * 代码
   */
  code: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 描述
   */
  description: string;
  /**
   * 应用亮点
   */
  detailContent: string;
  /**
   * 图标
   */
  iconSrc: string;

  /**
   * 是否是官方应用
   */
  official: boolean;

  /**
   * 非官方 icon显示文字时的文字
   */
  toolIconText?: string;
  /**
   * 非官方 icon 自定义样式
   */
  toolIconTextStyle?: string;
  /**
   * 非官方 打开的页面
   */
  toolUrl?: string;
}

export const applications: AppInfo[] = [
  {
    code: "shManifest",
    title: "上海舱单",
    description: "价格优、体验佳、回执快的上海港舱单发送工具，目前支持70家船司的、11家船代的舱单、VGM数据发送",
    detailContent: `
    <ul>
        <li>收费标准：舱单按分票30元/票， VGM 5元/箱。</li>
        <li>提供舱单EXCEL格式解析导入，后台自动解析数据后快速提交，发送过程智能检测错误，发送后随时跟踪回执状态。</li>
    </ul>
    `,

    iconSrc: new URL(`../../assets/images/shcdmenu.svg`, import.meta.url).href,
    official: true,
  },
  {
    code: "nbManifest",
    title: "宁波舱单",
    description: "支持在线舱单制作和导入，支持一键邮箱发送功能； 操作简单，更可在周末及节假日均可发送。",
    detailContent:
      `
    <ul>
      <li>收费标准：免费。</li>
      <li>提供导入EXCEl表格，舱单及VGM信息同时解析数据自动填写，保存后导出到电脑本地。</li>
    </ul>
    `,
    iconSrc: new URL(`../../assets/images/nbcdmenu.svg`, import.meta.url).href,
    official: true,
  },

  {
    code: "freightRate",
    title: "整箱运价",
    description: "覆盖国际物流海运整箱优势航线资源，为客户提供港到港的全航线运价在线查询、订阅、询价服务。",
    detailContent: `
    <ul>
      <li>收费标准：免费。</li>
      <li>提供运价自动推存功能，只需关注常用港口，系统自动做出智能化推荐，直接在线询问底价。</li>
      <li>提供全航线运价查询和比价功能，支持在线询价。</li>
      <li>提供在线快捷在沟通工具，及时获得对方的报价和下单。</li>
    </ul>
    `,
    iconSrc: new URL(`../../assets/images/zxyjmenu.svg`, import.meta.url).href,
    official: true,
  },
  {
    code: "boxTrack",
    title: "箱货跟踪",
    description: "优秀供应商合作,可快速获取箱货状态",
    detailContent: "该功能尚未开放",

    iconSrc: new URL(`../../assets/images/box-track.svg`, import.meta.url).href,
    official: true,
  },
  {
    code: "fastCargo",
    title: "极速抢舱",
    description: "优秀供应商合作,可快速获得优质舱位",
    detailContent: "该功能尚未开放",

    iconSrc: new URL(`../../assets/images/fast-booking.svg`, import.meta.url)
      .href,
    official: true,
  },
  {
    code: "freightListen",
    title: "运价监控",
    description: "监控各船司的运价变化,支持推送提醒",
    detailContent:
      "该功能尚未开放",

    iconSrc: new URL(`../../assets/images/freight-listen.svg`, import.meta.url)
      .href,
    official: true,
  },
  {

    code: "voyage",
    title: "船期查询",
    description: "时刻了解船期动态",
    detailContent: "该功能尚未开放",

    iconSrc: new URL(`../../assets/images/voyage.svg`, import.meta.url).href,
    official: true,
  },
  {
    code: "shipPosition",
    title: "船舶定位",
    description: "提供船位跟踪,船舶路径查询,方便及时掌握船舶动态",
    detailContent: "该功能尚未开放",

    iconSrc: new URL(`../../assets/images/ship-position.svg`, import.meta.url)
      .href,
    official: true,
  },
  {
    code: "shipSpace",
    title: "现舱特价",
    description: "保舱保价，30分钟急速订舱",
    detailContent: "该功能尚未开放",

    iconSrc: new URL(`../../assets/images/现舱.svg`, import.meta.url).href,
    official: true,
  },
  {
    code: "shippingFile",
    title: "船司保函",
    description: "提供各船司的保函下载",
    detailContent:
      "支持39家船司的保函下载",

    iconSrc: new URL(`../../assets/images/sihpping-file.svg`, import.meta.url)
      .href,
    official: true,
  },
  {
    code: "voyageList",
    title: "船期表",
    description: "提供各船司的船期表下载",
    detailContent:
      "支持33家船司的船期表下载",

    iconSrc: new URL(`../../assets/images/voyage-list.svg`, import.meta.url)
      .href,
    official: true,
  },

  //  非官方应用

  {
    code: "tools_airTracking",
    title: "空运跟踪",
    description: "支持全球200多家航空公司货物跟踪",
    detailContent: "",
    iconSrc: new URL(`../../assets/my-appliction/hwgz/kygz.svg`, import.meta.url).href,
    official: true,
    toolUrl:
      "http://www.yundangnet.com/CargoTracking/AirTrackingNew?companyid=3193&themes=blue",

    toolIconText: "空运",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #1DCCFC 0%, #42A0F3 100%);",
  },

  {
    code: "tools_tkztcx",
    title: "通关状态查询",
    description: "中国海关通关信息查询（海空）",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/hwgz/htgztcx.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://swapp.singlewindow.cn/qspserver/sw/qsp/query/view/export",
    toolIconText: "通关",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #1DCCFC 0%, #42A0F3 100%);",
  },

  {
    code: "tools_cbdw",
    title: "船舶定位",
    description: "船讯网，最权威的船舶位置跟踪",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/hwgz/cbdw.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.shipxy.com/",
    toolIconText: "船舶",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #1DCCFC 0%, #42A0F3 100%);",
  },

  {
    code: "tools_gjkd",
    title: "国际快递",
    description: "支持全球663家快递公司轨迹追踪",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/hwgz/gjkd.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.51tracking.com/?ref=trackingmore_500",
    toolIconText: "快递",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #1DCCFC 0%, #42A0F3 100%);",
  },

  {
    code: "tools_gnkd",
    title: "国内快递",
    description: "快递100小工具方便又好用",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/hwgz/gnkd.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.kuaidi100.com/?from=openv",
    toolIconText: "快递",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #E1DAFA 0%, #A794DB 100%);",
  },






  /* 物流基础库 */
  {
    code: "tools_zxds",
    title: "装箱大师",
    description: "一款国外很好用的装箱计算工具",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wljck/zxds.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.searates.com/reference/stuffing/",
    toolIconText: "装箱",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #E1DAFA 0%, #A794DB 100%);",
  },

  {
    code: "tools_sshlcx",
    title: "实时汇率查询",
    description: "中国银行外汇牌价实时汇率",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wljck/sshlcx.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.boc.cn/sourcedb/whpj/",
    toolIconText: "汇率",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #E1DAFA 0%, #A794DB 100%);",
  },



  {
    code: "tools_hsbmcx",
    title: "HS编码查询",
    description: "最实用的HScode查询工具",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wljck/hs.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.hs-bianma.com/",
    toolIconText: "HS",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #E1DAFA 0%, #A794DB 100%);",
  },

  {
    code: "tools_wxpbz",
    title: "危险品标注",
    description: "联合国危险品货物运输标志及GHS标识查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wljck/wxpbz.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.hgmsds.com/hg-ehs-transportation",
    toolIconText: "危险",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #E1DAFA 0%, #A794DB 100%);",
  },

  {
    code: "tools_wxpysjd",
    title: "危险品运输鉴定",
    description: "专业危险品运输鉴定机构",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wljck/wxpys.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.ghs.cn/",
    toolIconText: "鉴定",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #E1DAFA 0%, #A794DB 100%);",
  },




  /* 码头箱动态 */

  {
    code: "tools_ytjd",
    title: "亿通查询",
    description: "预配，运抵报告，装箱数据，海关放行等所有上海港查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/ytcx.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.hb56.com/Main.aspx",
    toolIconText: "上海",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },

  {
    code: "tools_yjsj",
    title: "亿加数据（需登录）",
    description: "预配，运抵报告，装箱数据，海关放行全链路查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/yjsj.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://dp.eptrade.cn/#/template/csn096",
    toolIconText: "上海",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },



  {
    code: "tools_tgb",
    title: "通关宝查询",
    description: "上海港报关单，舱单，查验，个人行邮查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/tgbcx.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.tongguanbao.net/",
    toolIconText: "上海",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },

  {
    code: "tools_ygt",
    title: "易港通（需登录）",
    description: "宁波港海关放行，查验，装箱，VGM，放箱，船舶计划等查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/ygt.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.eporthub.com/",
    toolIconText: "宁波",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #74FA68 0%, #35C585 100%);",
  },


  {
    code: "tools_blsq",
    title: "北仑三期",
    description: "单箱信息，查验箱移位，船舶计划，提箱，空箱等查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/blsq.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://csct.nbport.com.cn/system/test/cqcx",
    toolIconText: "宁波",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #74FA68 0%, #35C585 100%);",
  },

  {
    code: "tools_dxmt",
    title: "大榭码头",
    description: "单箱信息，查验箱移位，船舶计划，进箱计划等查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/dxmt.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://willport.cmict.net/Pages/default.aspx",
    toolIconText: "宁波",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #74FA68 0%, #35C585 100%);",
  },

  {
    code: "tools_msmt",
    title: "梅山码头",
    description: "单箱信息，船期计划，单箱费用，截港截单时间，温控箱查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/msmt.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://msict.nbport.com.cn/mall-portal/index.html",
    toolIconText: "宁波",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #74FA68 0%, #35C585 100%);",
  },

  {
    code: "tools_ytmt",
    title: "盐田码头",
    description: "集装箱信息，运抵报告，船舶计划，查验柜递单等查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/ytmt.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.156yt.cn/publicInfoService/index.action",
    toolIconText: "深圳",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #FFA26E 0%, #FF672C 100%);",
  },

  {
    code: "tools_sk/cwmt",
    title: "蛇口/赤湾码头",
    description: "集装箱信息，交接单，船舶计划，VGM，交接单，放行等查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/skcwmt.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://eport.scctcn.com/query/VesselSchedule",
    toolIconText: "深圳",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #FFA26E 0%, #FF672C 100%);",
  },

  {
    code: "tools_dcw",
    title: "DCB/大铲湾",
    description: "集装箱放行，查验，设备交接单，船舶计划，运抵报告等查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/dcw.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.dcblink.com/web/dcblink/container-info-public",
    toolIconText: "深圳",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #FFA26E 0%, #FF672C 100%);",
  },
  {
    code: "tools_hgfx",
    title: "集装箱码头海关放行",
    description: "广州集装箱码头海关放行查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/jzxmthgfx.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.gct.com.cn/seltype/Manage_yuyue2.asp",
    toolIconText: "广州",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #4bb9fe 0%, #5198ff 100%);",
  },
  {
    code: "tools_mtxxx",
    title: "集装箱码头箱信息",
    description: "广州集装箱码头整箱和散货箱动态查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/jzxmtxx.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.gct.com.cn/share_query/query_share.htm",
    toolIconText: "广州",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #4bb9fe 0%, #5198ff 100%);",
  },
  {
    code: "tools_zwy",
    title: "中外运黄埔/东江/乌冲",
    description: "可按集装箱和提单号查询各种信息",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/zwyhb.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://sc.y2t.com/serwin/serwin/homepage.html",
    toolIconText: "广州",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #4bb9fe 0%, #5198ff 100%);",
  },
  {
    code: "tools_nsgw",
    title: "南沙港务/三期查询",
    description: "预约号，在场箱，VGM，进闸，船舶计划，箱信息查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/nsgw.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://eportal.goct.com.cn/Account/?ReturnUrl=%2f",
    toolIconText: "广州",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #4bb9fe 0%, #5198ff 100%);",
  },

  {
    code: "tools_qdg",
    title: "云港通（需登录）",
    description: "青岛港唯一官方查询入口，所有信息都可查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/ygt2.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.qingdao-port.net/",
    toolIconText: "青岛",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #8fefe1 0%, #67e2e6 100%);",
  },
  {
    code: "tools_tjg",
    title: "天津港（需登录）",
    description: "天津港官方唯一查询入口",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/tjg.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.tjgportnet.com/sc/default.aspx",
    toolIconText: "天津",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #8fefe1 0%, #67e2e6 100%);",
  },
  {
    code: "tools_ytg",
    title: "烟台港",
    description: "集装箱，船舶，海关放行，运抵等信息都可查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/ytg.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.ytedi.com/index/xinxifuwu",
    toolIconText: "烟台",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #8fefe1 0%, #67e2e6 100%);",
  },
  {
    code: "tools_lyg",
    title: "连云港",
    description: "集装箱，船舶，集港车辆，放行等信息都可查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/lyg.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.lygeport.com/Online_Query.html",
    toolIconText: "连云港",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #8fefe1 0%, #67e2e6 100%);",
  },

  {
    code: "tools_xmg",
    title: "厦门集装箱码头（海天/海润）",
    description: "箱动态，放行，运抵报告，船舶计划，查验等所有查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/xmjzxmt.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.jx-c.com.cn/xctgonline/index.html",
    toolIconText: "厦门",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #f5c609 0%, #f4ae1b 100%);",
  },
  {
    code: "tools_yh",
    title: "远海",
    description: "箱动态，提单查询，船舶计划，海关放行等信息查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/yh.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://webquery.coscoyh.com.cn:8080/yhweb/admin/infoquery/publicQuery.do?queryType=4",
    toolIconText: "厦门",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #f5c609 0%, #f4ae1b 100%);",
  },
  {
    code: "tools_gjhg",
    title: "国际货柜",
    description: "箱动态，提单查询，船舶计划，海关放行等信息查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/gjhg.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://webies.xict.com.cn/ctms/blInfoQueryAction.do",
    toolIconText: "厦门",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #f5c609 0%, #f4ae1b 100%);",
  },
  {
    code: "tools_symt",
    title: "嵩屿码头",
    description: "集装箱动态信息查询，可用箱号和提单号查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/mtx/symt.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.xsct.com.cn/new/CustomerQueryContainerTab.aspx?",
    toolIconText: "厦门",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #f5c609 0%, #f4ae1b 100%);",
  },

  {
    code: "tools_jgfs",
    title: "监管方式",
    description: "中国海关贸易方式代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/jgfs_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_myfs",
    toolIconText: "监管",
    toolIconTextStyle: "",
  },

  {
    code: "tools_gn",
    title: "国内地区代码表",
    description: "中国海关国内地区代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/gndq_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_gndq",
    toolIconText: "国内",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #8fefe1 0%, #67e2e6 100%);",
  },

  {
    code: "tools_jl",
    title: "计量单位代码表",
    description: "中国海关计量单位代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/jldw_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_jldw",
    toolIconText: "计量",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },

  {
    code: "tools_cj",
    title: "成交方式代码表",
    description: "中国海关成交方式代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/cjfs_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_cjfs",
    toolIconText: "成交",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #E1DAFA 0%, #A794DB 100%);",
  },
  {
    code: "tools_ysfs",
    title: "运输方式代码表",
    description: "中国海关运输方式代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/ysfs_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_ysfs",
    toolIconText: "运输",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #e3c78c 0%, #ccad75 100%);",
  },
  {
    code: "tools_zmxz",
    title: "征免性质代码表",
    description: "中国海关征免性质代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/zmxz_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_zmxz",
    toolIconText: "征免",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #f5c609 0%, #f4ae1b 100%);",
  },
  {
    code: "tools_gq",
    title: "关区代码表",
    description: "中国海关关区代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/gq_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_gq",
    toolIconText: "关区",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },

  {
    code: "tools_qyxz",
    title: "企业性质代码表",
    description: "中国海关企业性质代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/qyxz_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_qyxz",
    toolIconText: "企业",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #74FA68 0%, #35C585 100%);",
  },

  {
    code: "tools_yt",
    title: "用途代码表",
    description: "中国海关用途代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/yt_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_yt",
    toolIconText: "用途",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },

  {
    code: "tools_zjmsfs",
    title: "征减免税方式代码表",
    description: "中国海关征减免税方式代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/zjmsfs_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_zjmsfs",
    toolIconText: "征减",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #f5c609 0%, #f4ae1b 100%);",
  },

  {
    code: "tools_gbdq",
    title: "国别(地区)代码表",
    description: "中国海关国别(地区)代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/gb(dq)_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_gbdq",
    toolIconText: "国别",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #8fefe1 0%, #67e2e6 100%);",
  },

  {
    code: "tools_bz",
    title: "币制代码表",
    description: "中国海关币制代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/bz_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_bz",
    toolIconText: "币制",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #f5c609 0%, #f4ae1b 100%);",
  },

  {
    code: "tools_dqxz",
    title: "地区性质代码表",
    description: "中国海关地区性质代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/dqxz_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_dqxz",
    toolIconText: "地区",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #8fefe1 0%, #67e2e6 100%);",
  },

  {
    code: "tools_jsfs",
    title: "结汇方式代码表",
    description: "中国海关结汇方式代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/jhfs_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_jsfs",
    toolIconText: "结汇",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },

  {
    code: "tools_jgzj",
    title: "监管证件代码表",
    description: "中国海关监管证件代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/jgzj_dmb.svg`, import.meta.url)
      .href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=1894998&tableName=zfs_table_jgzj",
    toolIconText: "监管",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #FFA26E 0%, #FF672C 100%);",
  },

  {
    code: "tools_gjrh",
    title: "关检融合部分代码表",
    description: "中国海关关检融合部分代码表",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/tgcs/gjrhbf_dmb.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/customs/302427/302442/tgcs/gjrhbftgcscxjxz/index.html",
    toolIconText: "关检",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #8fefe1 0%, #67e2e6 100%);",
  },

  /* 商品贸易 */
  {
    code: "tools_jck",
    title: "进出口税率查询",
    description: "中国海关进出口税率查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/jckslcx.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/customs/302427/302442/jckszcx/index.html",
    toolIconText: "税率",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #f5c609 0%, #f4ae1b 100%);",
  },
  {
    code: "tools_spcx",
    title: "重点商品查询",
    description: "中国海关重点商品查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/zdswcx.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/eportal/ui?pageId=373577",
    toolIconText: "商品",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #FFA26E 0%, #FF672C 100%);",
  },
  {
    code: "tools_tscx",
    title: "出口退税查询",
    description: "中国国际税务总局出口退税查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/cktscx.png`, import.meta.url).href,
    official: true,
    toolUrl: "http://hd.chinatax.gov.cn/nszx/InitChukou.html",
    toolIconText: "退税",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },
  {
    code: "tools_hybz",
    title: "化验标准与方法",
    description: "中国海关化验标准与方法",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/hybzyff.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.customs.gov.cn/customs/302427/302442/hyxx45/hyff69/index.html",
    toolIconText: "化验",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },
  {
    code: "tools_fqx",
    title: "反倾销产品",
    description: "全球各国进出口商品反倾销查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/fqxcp.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://cacs.mofcom.gov.cn/cacscms/dcz/jkdcz",
    toolIconText: "反倾",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #FFA26E 0%, #FF672C 100%);",
  },
  {
    code: "tools_cpycd",
    title: "产品原产地",
    description: "贸促会原产地证真伪查询",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/cpycd.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://check.ccpiteco.net/",
    toolIconText: "产品",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #e3c78c 0%, #ccad75 100%);",
  },
  {
    code: "tools_glcx",
    title: "归类查询",
    description: "专业的报关归类辅助查询系统",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/glcx.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://hscode.macld.com/",
    toolIconText: "归类",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #E1DAFA 0%, #A794DB 100%);",
  },
  {
    code: "tools_jszn",
    title: "出口商品技术指南",
    description: "帮助企业尽快了解和掌握国外市场的标准、技术法规、认证检验等市场准入要求，跨越国外技术壁垒，引导企业主动提升自身技术水平和国际竞争力。",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/ckspjszn.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.mofcom.gov.cn/article/ckzn/",
    toolIconText: "出口",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #f5c609 0%, #f4ae1b 100%);",
  },

  {
    code: "tools_swfg",
    title: "中国商务法规",
    description: "包含各个级别、不同产业领域的法规",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/zgswfg.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://policy.mofcom.gov.cn/claw/index.shtml",
    toolIconText: "法规",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },
  {
    code: "tools_swty",
    title: "中外商务条约",
    description: "各种公约、议定书、协定、宣言、双边条约等",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/zwswty.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://policy.mofcom.gov.cn/pact/index.shtml",
    toolIconText: "条约",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #8fefe1 0%, #67e2e6 100%);",
  },
  {
    code: "tools_jwfg",
    title: "境外法规",
    description: "世界各国的法规",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/jwfg.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://policy.mofcom.gov.cn/page/list/nations.html",
    toolIconText: "境外",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #FFA26E 0%, #FF672C 100%);",
  },

  {
    code: "tools_zzty",
    title: "国际组织条约",
    description: "世界性国际组织和区域性国际组织的相关条约",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/gjzzty.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://policy.mofcom.gov.cn/page/list/organizations.html",
    toolIconText: "国际",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #e3c78c 0%, #ccad75 100%);",
  },

  {
    code: "tools_zsrz",
    title: "证书认证",
    description: "各种常用证书的介绍及认证",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/zsrz.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.fobwiki.com/practice/certificate/",
    toolIconText: "证书",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },

  {
    code: "tools_mydz",
    title: "贸易单证",
    description: "各种贸易单证指南",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/spmy/mydz.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://tradedoc.mofcom.gov.cn/TradeDoc/do/dz/tradedoc~1000_1000~0.html",
    toolIconText: "单证",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #8fefe1 0%, #67e2e6 100%);",
  },
  /* 物流展会 */
  {
    code: "tools_nbhjh",
    title: "宁波航交会",
    description: "中国（宁波）国际航运物流交易会",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wlzh/nbhjh.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.china-nsf.com/",
    toolIconText: "宁波",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #8fefe1 0%, #67e2e6 100%);",
  },
  {
    code: "tools_szwbh",
    title: "深圳物博会",
    description: "中国（深圳）国际物流与供应链输博览",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wlzh/szwbh.png`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.scmfair.com/",
    toolIconText: "深圳",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },

  {
    code: "tools_yzwl",
    title: "亚洲物流双年展",
    description: "第九届亚洲物流双年展将于2022年6月15-17日在上海新举行",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wlzh/yzwlsnz.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.tl-c.cn/",
    toolIconText: "亚洲",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #FFA26E 0%, #FF672C 100%);",
  },

  {
    code: "tools_jcwl",
    title: "锦程物流网峰会",
    description: "全球物流企业发展峰会",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wlzh/jcwlwfh.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.f-f-china.com/",
    toolIconText: "锦程",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #E1DAFA 0%, #A794DB 100%);",
  },

  {
    code: "tools_lyz",
    title: "多式联运展",
    description: "集装箱多式联运亚洲展",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wlzh/dlsyz.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.intermodal-asia.com.cn/",
    toolIconText: "联运",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #e3c78c 0%, #ccad75 100%);",
  },

  {
    code: "tools_ywwbh",
    title: "义乌物博会",
    description: "中国义乌物流产业博览会",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wlzh/ywbwh.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.wlfair.com/",
    toolIconText: "义乌",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #f5c609 0%, #f4ae1b 100%);",
  },

  {
    code: "tools_sdwlz",
    title: "山东物流展",
    description: "中国(山东)国际物流与仓储配送展览会",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wlzh/sdwlz.svg`, import.meta.url).href,
    official: true,
    toolUrl: "http://www.logistic-expo.com/",
    toolIconText: "山东",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },

  {
    code: "tools_yzwlz",
    title: "亚洲物流展",
    description: "亚洲国际物流技术与运输系统展览会",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wlzh/yzwlz.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.cemat-asia.com/",
    toolIconText: "亚洲",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },

  {
    code: "tools_sxps",
    title: "生鲜配送展",
    description: "第七届亚洲生鲜配送展",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wlzh/sxpsz.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.fl-a.cn/",
    toolIconText: "生鲜",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6df56b 0%, #3dcd80 100%);",
  },

  {
    code: "tools_wlzb",
    title: "物流装备与技术展",
    description: "中国（广州）国际物流装备与技术展览",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wlzh/wlzbyjsz.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.chinalet.cn/",
    toolIconText: "物流",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6CCFFB 0%, #30AAFD 100%);",
  },

  {
    code: "tools_gjhs",
    title: "广交会",
    description: "中国进出口商品交易会",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wlzh/gjh.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.cantonfair.org.cn/",
    toolIconText: "广交",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #8fefe1 0%, #67e2e6 100%);",
  },

  {
    code: "tools_jbhs",
    title: "进博会",
    description: "中国国际进口博览会",
    detailContent: "",

    iconSrc: new URL(`../../assets/my-appliction/wlzh/jbh.svg`, import.meta.url).href,
    official: true,
    toolUrl: "https://www.ciie.org/zbh/index.html",
    toolIconText: "进博",
    toolIconTextStyle: "background-image: linear-gradient(135deg, #6df56b 0%, #3dcd80 100%);",
  },

];

export default defineComponent({
  props: {
    code: {
      type: String,
      default: "shManifest",
    },
    showMenu: {
      type: Boolean,
      default: false,
    },
  },

  setup(prop, context) {
    async function removeApp() {
      await request.post("/api/UserCollectionApp/UnCollect", {
        code: prop.code,
      });
      context.emit("onRemove", prop.code);
      ElMessage.success("移除成功");
    }

    return {
      removeApp,
    };
  },
  emits: ["onClick", "onRemove"],
  render() {
    let _this = this;

    function clickEvent() {
      logClick(_this.$props.code);

      _this.$emit("onClick");
    }

    let menu = applications.find((t) => t.code == _this.$props.code);
    if (!menu) {
      return <span></span>;
    }

    if (menu.official) {
      let component = (
        <ApplicationMenuLayout
          onTriggerClick={clickEvent}
          title={menu.title}
          showMenu={_this.$props.showMenu}
          description={menu.description}
          onRemove={_this.removeApp}
        >
          <img src={menu.iconSrc} />
        </ApplicationMenuLayout>
      );

      return component;
    } else {




      return (
        <ApplicationMenuLayout
          onTriggerClick={clickEvent}
          title={menu.title}
          showMenu={_this.$props.showMenu}
          description={menu.description}
          onRemove={_this.removeApp}
          textIcon={{
            text: menu.toolIconText,
            style: menu.toolIconTextStyle,
          }}
        ></ApplicationMenuLayout>
      );
    }
  },
});
