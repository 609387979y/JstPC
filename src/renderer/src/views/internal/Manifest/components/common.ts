import * as types from "./types";

/**
 * 转化EDI 类型文本
 * @param v
 * @returns
 */
export function convertEDITypeText(v: types.CargoEDIManifestEDIType) {
  let text = "";
  switch (v) {
    case types.CargoEDIManifestEDIType.Create:
      text = "原始";
      break;
    case types.CargoEDIManifestEDIType.Modify:
      text = "修改";
      break;
    case types.CargoEDIManifestEDIType.Delete:
      text = "删除";
      break;
  }
  return text;
}
