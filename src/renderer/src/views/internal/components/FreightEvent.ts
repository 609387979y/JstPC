import { defineComponent, ref, watch, reactive, computed, onMounted } from "vue";
import request from "@/public/request";
import { ElMessage, ElMessageBox } from "element-plus";
const showDiscount = async (row: object, isAuth: boolean) => {
    if (isAuth) {
        let res = await request.post("/api/FRProviderPermission/SubmitApply", {
            RateProviderCompanyId: row.CompanyId,
            RateId:row.Id
        });
        if(!res.Status){
            ElMessage.warning(res.Message)
            return false
        }else{
            return true
        }
    }else{
        ElMessage.warning('请先进行企业认证')
    }
}
const lockDiscount = async (row: any) => {

    if(row.RateId && row.RateId.toString &&row.RateId.toString().indexOf('jet') != -1){
        // 简达运价
        let content = `
        <div>起运港-目的港  ${row.PolCnPortName}-${row.DestCnPortName}</div>
        <div>船司  ${row.EnShippingName}</div>
  <div>航线  ${row.LineName}</div>
  <div>航线代码  ${row.LineCode}</div>

        `
        await request.post("/api/FRProvider/NotifyJetSaleman", {
            content: content
        });
        return true;
    }

    let res = await request.post("/api/FRProvider/ContactSaleman", {
        rateId: row.Id
    });
    if(!res.Status){
        ElMessage.warning(res.Message)
        return false
    }else{
        return true
    }

}

export default {
    showDiscount,
    lockDiscount
}

