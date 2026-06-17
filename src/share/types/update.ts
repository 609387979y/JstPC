export interface AppVersionResult {
  /**
   * 最新版本
   */
  Version: string;
  /**
   * 最低支持的版本
   */
  MinVersion: string;
  /**
   * 更新日志
   */
  Description: string;
  /**
   * 更新地址
   */
  LatestUrl: string;
}

/**
 * 检查更新结果
 */
 export interface CheckUpdateResult {
  /**
   * 是否需要更新
   */
  needUpdate: boolean;
  /**
   * 更新版本号
   */
  version: string;
  /**
   * 更新日志
   */
  description: string;
}


