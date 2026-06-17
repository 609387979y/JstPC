/**
 * base code
 */
export interface BaseCode {
  /**
   * 类型
   */
  Type: string;
  /**
   * 名称
   */
  Name: string;
  /**
   * 代码
   */
  Code: string;
}
/**
 * 舱单的常量
 */
export interface ManifestConst {
  /**
   * 货物类型
   */
  CODETYPE_CARGO_TYPE: string;
  /**
   * 运输条款(A)
   */
  CODETYPE_CGO_M_DELY_TERMA: string;
  /**
   * 运输条款(B)
   */
  CODETYPE_CGO_M_DELY_TERMB: string;
  /**
   * 付款方式
   */
  CODETYPE_CGO_M_DELY_TERM: string;
  /**
   * 提单类型
   */
  CODETYPE_CGO_MBL_TYPE: string;
  /**
   * 箱型
   */
  CODETYPE_CGO_CN_TYPE: string;
  /**
   * 包装单位
   */
  CODETYPE_CGO_PACK: string;
  /**
   * 船代
   */
  CODETYPE_SHIP_AGENT: string;
  /**
   * 船司
   */
  CODETYPE_SHIPPING: string;

  /**
   * VGM 港口
   */
  VGM_PortList: string;
  /**
   * VGM 接收方(船司)
   */
  VGM_ShippingList: string;
  /**
   * VGM 码头
   */
  VGM_DockList: string;
}

/**
 * 舱单发送状态
 */
export enum CargoEDIManifestSendStatus {
  /**
   * 未发送
   */
  UnSend = 0,
  /**
   * 发送中
   */
  Sending = 1,
  /**
   * 发送了  但是失败了  (可能是有字段错误需要客户修改)
   */
  SentFail = 2,
  /**
   * 发送完毕 成功
   */
  SentSuccess = 3,
}
/**
 * 舱单类型
 */
export enum CargoEDIManifestType {
  /**
   * 上海舱单
   */
  ShanghaiCargo = 0,
}
export enum CargoEDIManifestEDIType {
  /**
   * 普通创建的舱单
   */
  Create = 0,
  /**
   * 发送编辑报文的舱单
   */
  Modify = 1,
  /**
   * 发送删除报文的
   */
  Delete = 2
}

export class CargoEDI_Port {
  /**
   * id
   */
  Id: number = 0;
  /**
   * 创建时间
   */
  CreateTime: string = "";
  /**
   * 更新时间
   */
  UpdateTime: string = "";
  /**
   * 港口代码
   */
  Code: string = "";
  /**
   * 港口中文名称
   */
  CnPortName: string = "";
  /**
   * 港口英文名称
   */
  EnPortName: string = "";
  /**
   * 国家
   */
  Country: string = "";
}

/**
 * 舱单主单信息
 */
export class ManifestInfo {
  /**
   * id
   */
  Id: number = 0;
  /**
   * 创建时间
   */
  CreateTime: string = "";
  /**
   * 更新时间
   */
  UpdateTime: string = "";
  /**
   * 删除标记
   */
  DeleteMark: boolean = false;
  /**
   * 发送状态
   */
  Status: CargoEDIManifestSendStatus = CargoEDIManifestSendStatus.UnSend;
  /**
   * 失败原因
   */
  FailReason: string = "";
  /**
   * 舱单类型
   */
  Type: CargoEDIManifestType = CargoEDIManifestType.ShanghaiCargo;
  /**
   * 报文类型
   */
  EDIType: CargoEDIManifestEDIType = CargoEDIManifestEDIType.Create;
  /**
   * 修改舱单   之前的舱单id
   */
  ModifyRefManifestId: number = 0;

  /**
   * 唯一标识号 (用于查找第三方系统的数据  )
   */
  Identifier: string = "";
  /**
   * 提单号
   */
  CGO_MBL_NO: string = "";
  /**
   * 货物类型
   */
  CargoType: string = "";
  /**
   * 托运编号
   */
  ReferenceNo: string = "";
  /**
   * 运输条款 (前)
   */
  CGO_M_DELY_TERMA: string = "CY";
  /**
   * 运输条款 (后)
   */
  CGO_M_DELY_TERMB: string = "CY";

  /**
   * 船名
   */
  CGO_VES: string = "";
  /**
   * 航次
   */
  CGO_VOY: string = "";
  /**
   * 提单类型
   */
  CGO_MBL_TYPE: string = "";
  /**
   * 正本提单份数
   */
  CGO_MBL_NUM: number | undefined = 1;
  /**
   * 副本提单份数
   */
  CGO_MBL_NUM_COPY: number | undefined = undefined;

  /**
   * 付款方式
   */
  CGO_M_FRT_TERM: string = "";
  /**
   * 船代
   */
  ShipAgentCode: string = "";
  /**
   * 船代名称
   */
  ShipAgentName: string = "";
  /**
   * 船公司
   */
  ShippingCode: string = "";
  /**
   * 船公司名称
   */
  ShippingName: string = "";

  /**
   * 签发地代码
   */
  PlaceOfIssueCode: string = "";
  /**
   * 签发地名称
   */
  PlaceOfIssueName: string = "";
  /**
   * 收货地名称
   */
  CGO_ACPT_NAME: string = "";

  /**
   * 收货地代码
   */
  CGO_ACPT_CODE: string = "";

  /**
   * 装货港名称
   */
  CGO_POL_NAME: string = "";
  /**
   * 装货港代码
   */
  CGO_POL_CODE: string = "";

  /**
   * 卸货港名称
   */
  CGO_POD_NAME: string = "";
  /**
   * 卸货港代码
   */
  CGO_POD_CODE: string = "";

  /**
   * 中转港名称
   */
  CGO_VIA_NAME: string = "";
  /**
   * 中转港代码
   */
  CGO_VIA_CODE: string = "";

  /**
   * 交货地名称
   */
  CGO_DELY_NAME: string = "";
  /**
   * 交货地代码
   */
  CGO_DELY_CODE: string = "";

  /**
   * 发货人代码
   */
  SH_CODE: string = "";
  /**
   * 发货人国家代码
   */
  SH_CNTRY: string = "";
  /**
   * 发货人名称
   */
  SH_NAME: string = "";
  /**
   * 发货人地址
   */
  SH_ADDR: string = "";
  /**
   * 发货人电话
   */
  SH_TEL: string = "";
  /**
   * 发货人AEO
   */
  SH_AEO: string = "";
  /**
   * 发货人邮箱
   */
  SH_EMAIL: string = "";
  /**
   * 发货人传真
   */
  SH_FAX: string = "";

  /**
   * 收货人代码
   */
  CN_CODE: string = "";
  /**
   * 收货人国家代码
   */
  CN_CNTRY: string = "";
  /**
   * 收货人名称
   */
  CN_NAME: string = "";
  /**
   * 收货人地址
   */
  CN_ADDR: string = "";
  /**
   * 收货人电话
   */
  CN_TEL: string = "";
  /**
   * 收货人AEO
   */
  CN_AEO: string = "";
  /**
   * 收货人具体联系人
   */
  CN_ATTN: string = "";
  /**
   * 收货人具体联系人电话
   */
  CN_ATTN_TEL: string = "";
  /**
   * 收货人邮箱
   */
  CN_EMAIL: string = "";
  /**
   * 收货人传真
   */
  CN_FAX: string = "";

  /**
   * 通知人代码
   */
  NT_CODE: string = "";
  /**
   * 通知人国家代码
   */
  NT_CNTRY: string = "";
  /**
   * 通知人名称
   */
  NT_NAME: string = "";
  /**
   * 通知人地址
   */
  NT_ADDR: string = "";
  /**
   * 通知人电话
   */
  NT_TEL: string = "";
  /**
   * 通知人AEO
   */
  NT_AEO: string = "";
  /**
   * 通知人邮箱
   */
  NT_EMAIL: string = "";
  /**
   * 通知人传真
   */
  NT_FAX: string = "";

  /**
   * 创建人员工
   */
  EmployeeId: number | undefined = undefined;
}

/**
 * 舱单详情
 */
export class ManifestDetail {
  /**
   * id
   */
  Id: number = 0;
  /**
   * 创建时间
   */
  CreateTime: string = "";
  /**
   * 更新时间
   */
  UpdateTime: string = "";

  /**
   * 舱单id
   */
  ManifestId: number = 0;

  /**
   * 提单号
   */
  CGO_MBL_NO: string = "";

  /**
   * 箱号
   */
  CGO_CNNO: string = "";

  /**
   * 封号
   */
  CGO_SEALNO: string = "";

  /**
   * 箱型
   */
  CGO_CN_TYPE: string = "";

  /**
   * 英文品名
   */
  CGO_DESC: string = "";

  /**
   * HS CODE
   */
  CGO_HSCODE: string = "";

  /**
   * 包装方式
   */
  CGO_PACK: string = "";

  /**
   * 包装方式 代码
   */
  CGO_PACK_CODE: string = "";

  /**
   * 数量
   */
  CGO_NUM: number = 0;

  /**
   * 重量
   */
  CGO_WGT: string = "";

  /**
   * 体积
   */
  CGO_MEAS: string = "";

  /**
   * 唛头
   */
  CGO_MARKS: string = "";

  /**
   * UNCode
   */
  CGO_UNCODE: string = "";

  /**
   * 危品类型
   */
  CGO_CATEGORY: string = "";

  /**
   * 货主箱标记
   */
  OwnerBoxSign: string = "";
}

/**
 * 舱单全部信息
 */
export class CargoEDIManifestModel extends ManifestInfo {
  Details: ManifestDetail[] = [];
}

export class ManifestEditorDisableProps {
  /**
   * 主提单号
   */
  CGO_MBL_NO: boolean = false;
  /**
   * 船名
   */
  CGO_VES: boolean = false;
  /**
   * 航次
   */
  CGO_VOY: boolean = false;
  /**
   * 船公司
   */
  ShippingCode: boolean = false;
  /*
     船代
  */
  ShipAgentCode:boolean = false;
  /**
   * 详情 提单号
   */
  DetailCGO_MBL_NO: boolean = false;
  /**
   * 品名
   */
  DetailCGO_DESC: boolean = false;
  /**
   * 箱号
   */
  DetailCGO_CNNO: boolean = false;
  /**
   * 封号
   */
  DetailCGO_SEALNO: boolean = false;
}
