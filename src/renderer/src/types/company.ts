export enum CompanyType {
    /**
     * 平台
     */
    Platform = 0,
    /** 
     * 客户
     */
    Customer = 1,
    /** 
     * 供应商
     */
    Provider = 2,
  }
  
  
  
  
  /**
   * 企业审核类型
   */
   export enum CompanyAuditType {
    /**
     * 企业入驻
     */
    CreateCompany = 0,
    /**
     * 员工绑定(新建一个账号)
     */
    CreateEmployee = 1,
    /**
     * 解绑员工
     */
    UnBindEmployee = 2
  }
  /**
   * 审核状态
   */
   export enum CompanyAuditStatus {
    /**
     * 已驳回
     */
    Rejected = -1,
    /**
     * 进行中
     */
    Running = 1,
    /**
     * 完成
     */
    Finish = 2
  }
  
  export interface AuditStep{
    AuditId: number
    CreateTime:string
    EmployeeId: number | null
    EmployeeName: string | null
    EventTime:string
    Id: number
    Pass: boolean | null
    Remark: string | null
    StepIndex: number
    Type: CompanyAuditType
    UpdateTime: string | null
  
  }
  export interface AuditData {
    CurrentStep:number,
    /**
     * 企业法人
     */
    BusinessCorporation: string | null,
    /**
     * 企业法人 身份证
     */
    BusinessCorporationIdNo: string | null,
    /**
     *  企业法人 手机号
     */
    BusinessCorporationMobilePhone: string | null,
    /**
     *  营业执照 社会统一信用代码
     */
    BusinessLicense: string | null,
    /**
     * 营业执照图片
     */
    BusinessLicenseImg: string | null,
    /**
     * 营业期限
     */
    BusinessLicenseRange: string | null,
    /**
     * 公司地址
     */
    Address:string | null,
    /**
     * 角色Id , 分割
     */
    ChooseRoleIdList: string | null,
    /**
     * 角色名称 , 分割
     */
    ChooseRoleList: string | null,
    /**
     * 申请公司Id
     */
    CompanyId: number | null
    /**
     * 申请公司名称
     */
    CompanyName: string | null,
    /**
     * 公司logo
     */
    CompanyLogo?:string | null,
    /**
     * 选择的企业身份
     */
    CompanyType: CompanyType | null,
    /**
     * 联系人邮箱
     */
    ContactEmail: string | null,
    /**
     * 联系人手机
     */
    ContactMobilePhone: string | null,
    /**
     * 联系人名称
     */
    ContactName: string | null,
    /**
     * 创建时间
     */
    CreateTime: string | null,
    /**
     * 员工Id
     */
    EmployeeId: number | null,
    /**
     * 审核Id
     */
    Id: number
    /**
     * 邀请人Id
     */
    Inviter: number | null,
    /**
     * 邀请人名称
     */
    InviterName: string | null,
    /**
     * 审核状态
     */
    Status: CompanyAuditStatus,
    /**
     * 提交人Id
     */
    SubmitUserId: number | null,
    /**
     * 提交人名称
     */
    SubmitUserName: string | null,
    /**
     * 提交人 手机号
     */
    SubmitMobilePhone:string | null,
    /**
     * 审核类型
     */
    Type: CompanyAuditType,
    /**
     * 步骤
     */
    Steps:AuditStep[],
    /**
     * 创建的公司名称
     */
    CreateCompanyName: string | null,
    /**
     * 创建/操作的 员工
     */
    EmployeeName:string | null
  }
  
  
  /**
   * 部门
   */
  export interface Organization{
    CompanyId: number,
    CreateTime:string | null,
    /**
     * Id
     */
    Id:number | null,
    /**
     * 部门名称
     */
    OrgName: string | null
    /**
     * 父级Id
     */
    ParentId: number | null
  }
  
  /**
   * 角色
   */
  export interface Role{
    /**
     * 公司Id
     */
    CompanyId: number | null
    /**
     * 公司类型
     */
    CompanyType: CompanyType
    CreateTime:string | null
    Id: number | null
    /**
     * 角色名称
     */
    RoleName: string | null
    UpdateTime: string | null
  }