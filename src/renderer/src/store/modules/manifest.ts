import { Module } from "vuex";
import { RootState } from "../types";
import request from "@/public/request";
import * as types from "@/views/internal/Manifest/components/types";

/**
 * 获得Type的所有数据
 * @param type
 * @returns
 */
export async function getCodeTypesAll(type: string): Promise<types.BaseCode[]> {
  let res = await request.get("/api/Code/GetList", {
    page: -1,
    type: type,
  });
  if (res.Status) {
    return res.Data.Rows as types.BaseCode[];
  } else {
    return [];
  }
}

/**
 * 搜索code
 * @param req
 */
export async function getCodeTypeKeywords(req: {
  page: number;
  limit: number;
  type: string;
  keywords: string;
}) {
  let res = await request.get("/api/Code/GetList", {
    page: req.page,
    limit: req.limit,
    type: req.type,
    keyword: req.keywords,
  });

  const result = {
    Total: 0,
    Rows: <types.BaseCode[]>[],
  };

  if (res.Status) {
    result.Total = res.Data.Total;
    result.Rows = res.Data.Rows;
  }

  return result;
}

/**
 *  相关state
 */
export interface ManifestState {
  /**
   * 是否初始化过
   */
  inited: boolean;
  /**
   * 常量
   */
  const: types.ManifestConst | null;
  /**
   * 船公司
   */
  SHIPPINGList: types.BaseCode[];
  /**
   * 货物类型
   */
  CARGO_TYPEList: types.BaseCode[];
  /**
   * 运输条款(A)
   */
  CGO_M_DELY_TERMAList: types.BaseCode[];
  /**
   * 运输条款(B))
   */
  CGO_M_DELY_TERMBList: types.BaseCode[];
  /**
   * 付款方式
   */
  CGO_M_DELY_TERMList: types.BaseCode[];
  /**
   * 提单类型
   */
  CGO_MBL_TYPEList: types.BaseCode[];
  /**
   * 箱型
   */
  CGO_CN_TYPEList: types.BaseCode[];
  /**
   * 包装单位
   */
  CGO_PACKList: types.BaseCode[];
  /**
   * 船代
   */
  SHIP_AGENTList: types.BaseCode[];

  /**
   * VGM的港口
   */
  VGM_PortList:types.BaseCode[];
  /**
   * VGM的船公司
   */
  VGM_ShippingList:types.BaseCode[];
  /**
   * VGM的码头
   */
  VGM_DockList:types.BaseCode[]

}

const module: Module<ManifestState, RootState> = {
  namespaced: true,
  state: {
    inited: false,
    const: null,
    SHIPPINGList: [],
    CARGO_TYPEList: [],
    CGO_M_DELY_TERMAList: [],
    CGO_M_DELY_TERMBList: [],
    CGO_M_DELY_TERMList: [],
    CGO_MBL_TYPEList: [],
    CGO_CN_TYPEList: [],
    CGO_PACKList: [],
    SHIP_AGENTList: [],

    VGM_PortList:[],
    VGM_ShippingList:[],
    VGM_DockList:[]    

  },
  getters: {},
  mutations: {},
  actions: {
    async init({ state, commit, dispatch }) {
      if (state.inited) {
        return;
      }
      let consts = await request.get<types.ManifestConst>(
        "/api/CargoEDICommon/Consts"
      );
      state.const = consts;
      
      // 查找对应数据
      let codeList = await request.post<types.BaseCode[]>(
        "/api/Code/GetManyTypesCode",
        {
          types: [
            consts.CODETYPE_CARGO_TYPE,
            consts.CODETYPE_CGO_M_DELY_TERMA,
            consts.CODETYPE_CGO_M_DELY_TERMB,
            consts.CODETYPE_CGO_M_DELY_TERM,
            consts.CODETYPE_CGO_MBL_TYPE,
            consts.CODETYPE_CGO_CN_TYPE,
            consts.CODETYPE_CGO_PACK,
            consts.CODETYPE_SHIP_AGENT,
            consts.CODETYPE_SHIPPING,
            consts.VGM_DockList,
            consts.VGM_PortList,
            consts.VGM_ShippingList
          ],
        }
      );

      state.CARGO_TYPEList = codeList.filter(
        (t) => t.Type == consts.CODETYPE_CARGO_TYPE
      );
      state.CGO_M_DELY_TERMAList = codeList.filter(
        (t) => t.Type == consts.CODETYPE_CGO_M_DELY_TERMA
      );
      state.CGO_M_DELY_TERMBList = codeList.filter(
        (t) => t.Type == consts.CODETYPE_CGO_M_DELY_TERMB
      );
      state.CGO_M_DELY_TERMList = codeList.filter(
        (t) => t.Type == consts.CODETYPE_CGO_M_DELY_TERM
      );
      state.CGO_MBL_TYPEList = codeList.filter(
        (t) => t.Type == consts.CODETYPE_CGO_MBL_TYPE
      );
      state.CGO_CN_TYPEList = codeList.filter(
        (t) => t.Type == consts.CODETYPE_CGO_CN_TYPE
      );
      state.CGO_PACKList = codeList.filter(
        (t) => t.Type == consts.CODETYPE_CGO_PACK
      );
      state.SHIP_AGENTList = codeList.filter(
        (t) => t.Type == consts.CODETYPE_SHIP_AGENT
      );
      state.SHIPPINGList = codeList.filter(
        (t) => t.Type == consts.CODETYPE_SHIPPING
      );



      state.VGM_DockList = codeList.filter(
        (t) => t.Type == consts.VGM_DockList
      );
      state.VGM_PortList = codeList.filter(
        (t) => t.Type == consts.VGM_PortList
      );
      state.VGM_ShippingList = codeList.filter(
        (t) => t.Type == consts.VGM_ShippingList
      );


      state.inited = true;
    },

  },
};

export default module;
