/**
 * VGM 主要信息
 */
export class CargoEDI_VGM {
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
   * 状态
   * 0-> 发送中
   * 1-> 已发送
   * 2-> 发送了但是失败了
   * 3-> 回执反馈成功
   */
  Status: 0 | 1 | 2 | 3 = 0;
  /**
   * 错误原因
   */
  FailReason: string = "";
  /**
   *  唯一标识号 (用于查找第三方系统的数据  )
   */
  Identifier: string = "";
  /**
   * 交易编号
   */
  TradeNumber: string = "";
  /**
   * 发送时间
   */
  SendTime: string = "";
  /**
   * 港口
   */
  Port: string = "";
  /**
   * 港口名称
   */
  PortName: string = "";
  /**
   * 船司
   */
  Shipping: string = "";

  /**
   * 船司名称
   */
  ShippingName: string = "";

  /**
   * 提单号
   */
  CGO_MBL_NO: string = "";

  /**
   * 码头代码
   */
  CGO_WHARF_CODE: string = "";
  /**
   * 码头名称
   */
  CGO_WHARF_NAME: string = "";
  /**
   * 船名
   */
  CGO_VES: string = "";
  /**
   * 航次
   */
  CGO_VOY: string = "";

  /**
   * SO编号
   */
  SO_NO: string = "";

  /**
   * 持箱人标记 COC / SOC
   */
  OwnerBoxSign: string = "COC";

  /**
   * 截VGM日期
   */
  CutOffDay: string = "";
}

/**
 * VGM 箱子信息
 */
export class CargoEDI_VGMDetail {
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
   * 状态
   * 0->还没接收到状态
   * 1->失败
   * 2->成功
   */
  Status: 0 | 1 | 2 = 0;
  /**
   * 错误原因
   */
  FailReason: string = "";
  /**
   * 箱号
   */
  CGO_CNNO: string = "";

  /**
   * VGM重量
   */
  VGM: string = "";
  /**
   * 责任方(称重方)
   */
  WeightingPart: string = "";
  /**
   * 责任方地址（条件必填）	上海口岸且船司为APL时必填
   */
  WeightingPartAddress: string = "";
  /**
   * 签名 签名不能超过20个字符, 只能输入大写字母
   */
  SignName: string = "";
}

/**
 * VGM 信息
 */
export class CargoVGMModel extends CargoEDI_VGM {
    Details:CargoEDI_VGMDetail[] = []
}