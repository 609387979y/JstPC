<template>
    <el-form :show-message="false" :model="model" ref="formRef">

        <!-- VGM主要信息 -->
        <div>
            <el-descriptions class="form-table" :column="3" size="small" border>
                <el-descriptions-item label-class-name="manifest-editor-label" class-name="manifest-editor-content">
                    <template #label>
                        <div class="label-text">港口</div>
                    </template>
                    <el-form-item :rules="{ validator: validator, trigger: 'blur' }" class="form-content" prop="Port">
                        <div class="flex">

                            <el-select v-model="model.Port" filterable placeholder="港口"
                                @change="(v) => editorOptions.onCodeSelectChange(v, editorOptions.VGM_PortList, (item) => { model.PortName = item.Name })">
                                <el-option :label="item.Name" :value="item.Code"
                                    v-for="item in editorOptions.VGM_PortList" :key="item.Code"></el-option>
                            </el-select>
                            <ManifestErrorTips class="error-tips" field="Port"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label-class-name="manifest-editor-label" class-name="manifest-editor-content">
                    <template #label>
                        <div class="label-text required">船公司</div>
                    </template>
                    <el-form-item :rules="{ validator: validator, trigger: 'blur' }" class="form-content"
                        prop="Shipping">
                        <div class="flex">
                            <el-select v-model="model.Shipping" filterable placeholder="船公司"
                                @change="(v) => editorOptions.onCodeSelectChange(v, editorOptions.VGM_ShippingList, (item) => { model.ShippingName = item.Name })">
                                <el-option :label="item.Name" :value="item.Code"
                                    v-for="item in editorOptions.VGM_ShippingList" :key="item.Code"></el-option>
                            </el-select>
                            <ManifestErrorTips class="error-tips" field="Shipping"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>



                <el-descriptions-item label-class-name="manifest-editor-label" class-name="manifest-editor-content">
                    <template #label>
                        <div class="label-text required">提单号</div>
                    </template>
                    <el-form-item :rules="{ validator: validator, trigger: 'blur' }" class="form-content"
                        prop="CGO_MBL_NO">
                        <div class="flex">
                            <el-input @input="model.CGO_MBL_NO = utils.inputCGO_MBL_NO(model.CGO_MBL_NO)"
                                placeholder="提单号" v-model="model.CGO_MBL_NO"></el-input>
                            <ManifestErrorTips class="error-tips" field="CGO_MBL_NO"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>




                <el-descriptions-item label-class-name="manifest-editor-label" class-name="manifest-editor-content">
                    <template #label>
                        <div class="label-text required">码头</div>
                    </template>
                    <el-form-item :rules="{ validator: validator, trigger: 'blur' }" class="form-content"
                        prop="CGO_WHARF_CODE">
                        <div class="flex">
                            <el-select v-model="model.CGO_WHARF_CODE" filterable placeholder="码头"
                                @change="(v) => editorOptions.onCodeSelectChange(v, editorOptions.VGM_DockList, (item) => { model.CGO_WHARF_NAME = item.Name })">
                                <el-option :label="item.Name" :value="item.Code"
                                    v-for="item in editorOptions.VGM_DockList" :key="item.Code"></el-option>
                            </el-select>
                            <ManifestErrorTips class="error-tips" field="CGO_WHARF_CODE"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>



                <el-descriptions-item label-class-name="manifest-editor-label" class-name="manifest-editor-content">
                    <template #label>
                        <div class="label-text required">船名</div>
                    </template>
                    <el-form-item :rules="{ validator: validator, trigger: 'blur' }" class="form-content"
                        prop="CGO_VES">
                        <div class="flex">
                            <el-input @input="model.CGO_VES = utils.inputToUpAndNoChinese(model.CGO_VES)"
                                placeholder="船名" v-model="model.CGO_VES"></el-input>
                            <ManifestErrorTips class="error-tips" field="CGO_VES"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label-class-name="manifest-editor-label" class-name="manifest-editor-content">
                    <template #label>
                        <div class="label-text required">航次</div>
                    </template>
                    <el-form-item :rules="{ validator: validator, trigger: 'blur' }" class="form-content"
                        prop="CGO_VOY">
                        <div class="flex">
                            <el-input @input="model.CGO_VOY = utils.inputToUpAndNoChinese(model.CGO_VOY)"
                                placeholder="航次" v-model="model.CGO_VOY"></el-input>
                            <ManifestErrorTips class="error-tips" field="CGO_VOY"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>




                <el-descriptions-item label-class-name="manifest-editor-label" class-name="manifest-editor-content">
                    <template #label>
                        <div class="label-text required">持箱人</div>
                    </template>
                    <el-form-item :rules="{ validator: validator, trigger: 'blur' }" class="form-content"
                        prop="OwnerBoxSign">
                        <div class="flex">
                            <el-radio-group v-model="model.OwnerBoxSign">
                                <el-radio label="COC">COC</el-radio>
                                <el-radio label="SOC">SOC</el-radio>
                            </el-radio-group>
                            <ManifestErrorTips class="error-tips" field="OwnerBoxSign"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item label-class-name="manifest-editor-label" class-name="manifest-editor-content">
                    <template #label>
                        <div class="label-text required">截VGM时间</div>
                    </template>
                    <el-form-item :rules="{ validator: validator, trigger: 'blur' }" class="form-content"
                        prop="CutOffDay">
                        <div class="flex">
                            <el-date-picker :disabled-date="utils.cutOffDayDisabledDate" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" v-model="model.CutOffDay" type="date" placeholder="截VGM时间" />
                            <ManifestErrorTips class="error-tips" field="CutOffDay"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label-class-name="manifest-editor-label" class-name="manifest-editor-content">
                    <template #label>
                        <div class="label-text">SO号</div>
                    </template>
                    <el-form-item :rules="{ validator: validator, trigger: 'blur' }" class="form-content" prop="SO_NO">
                        <div class="flex">
                            <el-input @input="model.SO_NO = utils.inputToUpAndOnlyEnglishOrNum(model.SO_NO)"
                                placeholder="SO号" v-model="model.SO_NO"></el-input>
                            <ManifestErrorTips class="error-tips" field="SO_NO"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>



            </el-descriptions>
        </div>
        <ManifestTips style="margin-top: 16px;" hidebtn tiptype="warning"
            content="本托运人声明：该文件资料所含载货集装箱重量信息系按照《1974年国际海上人命安全公约》所述方法获得，称重点的衡量器已取得计量技术机构颁发的计量检定证书，且获得重量的日期在证书的有效范围内。">
        </ManifestTips>


        <div class="vgm-detail">
            <div class="vgm-detail-btns">
                <div>
                    <template v-if="disableEditDetail == false">
                        <el-button @click="modelDetail.addDetail" type="primary">
                            <el-icon>
                                <plus />
                            </el-icon>新增
                        </el-button>
                        <el-button @click="modelDetail.copyDetail">
                            <el-icon>
                                <document-copy />
                            </el-icon>复制
                        </el-button>
                        <el-button @click="modelDetail.removeDetail">
                            <el-icon>
                                <delete />
                            </el-icon>删除
                        </el-button>
                        <el-button @click="modelDetail.clearDetail">
                            <el-icon>
                                <refresh />
                            </el-icon>清空
                        </el-button>
                    </template>

                </div>
                <div>
                    <div class="summary">
                        <div class="label">总箱数：</div>
                        <div class="value">{{ summary.totalCount }}</div>
                        <div class="label">总VGM重量：</div>
                        <div class="value">{{ summary.totalVGM }}</div>
                    </div>
                </div>
            </div>
            <div class="table">

                <el-table border highlight-current-row @current-change="modelDetail.currentRowChange" stripe
                    :data="model.Details">
                    <el-table-column label="箱号">
                        <template #header>
                            <div class="table-field required">箱号</div>
                        </template>
                        <template #default="scope">
                            <el-form-item :rules="{ validator: validator, trigger: 'blur' }"
                                :prop="`Details[${scope.$index}].CGO_CNNO`">

                                <ManifestErrorTips :field="`Details[${scope.$index}].CGO_CNNO`">
                                    <el-input v-model="scope.row.CGO_CNNO"
                                        @input="scope.row.CGO_CNNO = utils.inputToUpAndOnlyEnglishOrNum(scope.row.CGO_CNNO)"
                                        :disabled="disableEditDetail"
                                        placeholder="箱号"></el-input>
                                </ManifestErrorTips>

                            </el-form-item>
                        </template>
                    </el-table-column>



                    <el-table-column label="VGM重量(KGS)">
                        <template #header>
                            <div class="table-field required">VGM重量(KGS)</div>
                        </template>
                        <template #default="scope">
                            <el-form-item :rules="{ validator: validator, trigger: 'blur' }"
                                :prop="`Details[${scope.$index}].VGM`">

                                <ManifestErrorTips :field="`Details[${scope.$index}].VGM`">

                                    <el-input v-model="scope.row.VGM"
                                        @input="scope.row.VGM = utils.toNumberPoint(scope.row.VGM)"
                                        placeholder="VGM重量(KGS)"></el-input>
                                </ManifestErrorTips>

                            </el-form-item>
                        </template>
                    </el-table-column>


                    <el-table-column label="称重方">
                        <template #header>
                            <div class="table-field required">称重方</div>
                        </template>
                        <template #default="scope">
                            <el-form-item :rules="{ validator: validator, trigger: 'blur' }"
                                :prop="`Details[${scope.$index}].WeightingPart`">

                                <ManifestErrorTips :field="`Details[${scope.$index}].WeightingPart`">
                                    <el-input v-model="scope.row.WeightingPart"
                                        @input="scope.row.WeightingPart = utils.inputToUpAndNoChinese(scope.row.WeightingPart)"
                                        placeholder="称重方"></el-input>
                                </ManifestErrorTips>

                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column label="称重方地址">
                        <template #header>
                            <div class="table-field">称重方地址</div>
                        </template>
                        <template #default="scope">
                            <el-form-item :rules="{ validator: validator, trigger: 'blur' }"
                                :prop="`Details[${scope.$index}].WeightingPartAddress`">

                                <ManifestErrorTips :field="`Details[${scope.$index}].WeightingPartAddress`">
                                    <el-input v-model="scope.row.WeightingPartAddress"
                                        @input="scope.row.WeightingPartAddress = utils.inputToUpAndNoChinese(scope.row.WeightingPartAddress)"
                                        placeholder="称重方地址"></el-input>
                                </ManifestErrorTips>


                            </el-form-item>
                        </template>
                    </el-table-column>


                    <el-table-column label="签名">
                        <template #header>
                            <div class="table-field required">签名</div>
                        </template>
                        <template #default="scope">
                            <el-form-item :rules="{ validator: validator, trigger: 'blur' }"
                                :prop="`Details[${scope.$index}].SignName`">

                                <ManifestErrorTips :field="`Details[${scope.$index}].SignName`">

                                    <el-input v-model="scope.row.SignName"
                                        @input="scope.row.SignName = utils.inputToUpAndNoChinese(scope.row.SignName)"
                                        placeholder="签名"></el-input>
                                </ManifestErrorTips>


                            </el-form-item>
                        </template>
                    </el-table-column>







                </el-table>
            </div>
        </div>


    </el-form>
</template>

<script lang="ts">
import * as types from "./types"
import {
    defineComponent,
    ref,
    reactive,
    onMounted,
    watch,
    computed,
    Ref,
    PropType,
    toRefs,
    provide
} from "vue";
import request from "@/public/request"
import { utils as jstUtils } from "justom-share";
import { useEditorOptions } from "../../components/editor/useEditorOptions"
import ManifestTips from "../../components/manifestTips.vue"
import dayjs from "dayjs";
import { Plus, DocumentCopy, Delete, Refresh } from "@element-plus/icons"
import { ElMessage } from "element-plus"
import ManifestErrorTips from "../../components/editor/ManifestErrorTips.vue";
import * as math from "mathjs"

function useUtils() {
    function inputToUp(val: string) {
        if (val == null || val == "") {
            return "";
        }
        var reg = /[^\x00-\xff]/gim;
        val = val.replace(reg, "");
        val = val.toString();
        return val.toUpperCase();
    }
    //去除中文全角
    function inputToNoChinese(val: string) {
        if (val == null || val == "") {
            return "";
        }
        var reg = /[^\x00-\xff]/gim;
        val = val.replace(reg, "");
        val = val.toString();
        return val
    }
    /**
     * 英文大写 并且只能输入英文和数字
     * @param val 
     */
    function inputToUpAndOnlyEnglishOrNum(val: string) {
        if (val == null || val == "") {
            return "";
        }
        val = val.replace(/[\W]/g, '')
        val = val.toString();
        return val.toUpperCase();
    }

    function inputToUpAndNoChinese(val: string) {
        let v = inputToNoChinese(val)
        v = inputToUp(v);
        return v
    }


    //只允许数字+1个小数点
    function toNumberPoint(val: string) {
        var pattern = /[^\d.]/g;
        val = val.replace(pattern, "");
        val = val.replace(/^\./g, ".");
        val = val.replace(/\.{2,}/g, ".");
        val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        return val;
    }

    function inputCGO_MBL_NO(val: string) {
        let v = inputToUpAndNoChinese(val);
        v = inputToUpAndOnlyEnglishOrNum(val)
        return v
    }

    const today = dayjs(dayjs().format("YYYY-MM-DD")).toDate();

    /**
     * 截VGM日期 CutOffDay 禁用的日期
     */
    function cutOffDayDisabledDate(time: Date) {
        return time.getTime() < today.getTime()
    }

    return reactive({
        inputToUp,
        inputToNoChinese,
        inputToUpAndOnlyEnglishOrNum,
        toNumberPoint,
        formatEmptyString: jstUtils.formatEmptyString,
        inputToUpAndNoChinese,
        inputCGO_MBL_NO,
        cutOffDayDisabledDate
    })
}


interface FieldError {
    /**
     * 字段
     */
    Prop: string
    /**
     * 消息
     */
    Msg: string
}
/**
 * element 
 */
interface FormRule {
    field: string,
    fullField: string,
    type: string
}
function useValidate(model: Ref<types.CargoVGMModel>, autoValidate: Ref<boolean>) {
    // 错误列表
    const fieldErrors = ref<Map<string, string[]>>(new Map<string, string[]>())
    // form instance 
    const formRef = ref<any>()


    // 请求接口返回错误信息
    async function requestValidate(): Promise<FieldError[]> {
        let res = await request.post("/api/CargoEDISHVGM/Check", model.value)
        if (res.Status) {
            return []
        }

        // 转化模型
        let errors = [
            ...res.Data.InfoErrors,
            ...res.Data.DetailErrors
        ]

        return errors as FieldError[]
    }

    /**
     * 验证器
     */
    function validator(rule: FormRule, value: any, callback: Function) {
        // 判断是否有错误缓存
        const errors = fieldErrors.value.get(rule.fullField)
        if (errors == undefined || errors.length == 0) {
            return callback()
        }
        if (errors.length === 0) {
            return callback()
        }
        callback(errors[0])
    }

    // 是否触发过验证
    const validated = ref(false)
    /**
     * 触发验证
     */
    async function validate(jumpToError: boolean = false) {

        validated.value = true
        let errors = await requestValidate()

        // 清空原先的错误
        fieldErrors.value.clear()
        if (errors.length != 0) {
            // 保存错误信息
            for (let error of errors) {
                // error.Prop
                if (fieldErrors.value.get(error.Prop) == undefined) {
                    fieldErrors.value.set(error.Prop, [])
                }

                const arr = fieldErrors.value.get(error.Prop)!
                arr.push(error.Msg)
            }
        }

        // 触发form.validate 存在错误标红字段
        if (formRef.value == null) {
            console.error("formRef is null")
        }
        try {
            await formRef.value.validate()
            if (errors.length == 0) {
                return true
            } else {
                return false;
            }
        } catch {

            // 校验失败 跳转到指定字段位置
            if (errors.length != 0 && jumpToError) {
                formRef.value.scrollToField(errors[0].Prop)
            }
            return false
        }

    }

    function reset() {
        validated.value = false
        fieldErrors.value.clear()
        formRef.value.clearValidate()
    }

    const debounceValidate = jstUtils.debounce(validate, 500)


    watch(() => model.value, () => {
        if (validated.value) {
            // 只有触发过验证以后才会持续触发验证
            debounceValidate()
        }
    }, { deep: true })




    return {
        validate,
        validator,
        reset,
        formRef,
        fieldErrors
    }
}


/**
 * 模型详情列表
 */
function useModelDetail(model: Ref<types.CargoVGMModel>) {

    const currentSelectedIdx = ref(-1);
    /**
     * 当前选中的行变化
     * @param val 
     */
    function currentRowChange(val: types.CargoEDI_VGMDetail | undefined) {
        if (val == undefined) {
            return
        }

        let idx = model.value.Details.findIndex(t => val == t)
        currentSelectedIdx.value = idx;
    }
    /**
     * 新增
     */
    function addDetail() {
        model.value.Details.push(new types.CargoEDI_VGMDetail())
    }

    /**
     * 删除
     */
    function removeDetail() {
        if (currentSelectedIdx.value == -1) {
            ElMessage.warning("请选择一行")
            return
        }

        model.value.Details.splice(currentSelectedIdx.value, 1)
        currentSelectedIdx.value = -1;
    }
    function copyDetail() {
        if (currentSelectedIdx.value == -1) {
            ElMessage.warning("请选择一行")
            return
        }

        let detail = JSON.parse(JSON.stringify(model.value.Details[currentSelectedIdx.value]))
        model.value.Details.push(detail)
    }
    /**
     * 清空detail
     */
    function clearDetail() {
        model.value.Details = []
        currentSelectedIdx.value = -1;
    }




    return reactive({
        currentRowChange,
        addDetail,
        removeDetail,
        copyDetail,
        clearDetail,


    })
}


/**
 * 计算总和
 * @param model 
 */
function useSummary(model: Ref<types.CargoVGMModel>) {

    // 总箱数
    const totalCount = computed(() => {
        let total = model.value.Details.length
        return total;
    })


    // 总VGM重量
    const totalVGM = computed(() => {
        let total = math.chain(math.bignumber(0))

        model.value.Details.forEach(item => {
            if (isNaN(parseFloat(item.VGM))) {

            } else {
                total = total.add(math.bignumber(item.VGM))
            }
        })
        return math.format(total.done())
    })




    return reactive({
        totalCount,
        totalVGM
    })
}



export default defineComponent({
    components: {
        ManifestTips,
        Plus,
        DocumentCopy,
        Delete,
        Refresh,
        ManifestErrorTips
    },
    props: {
        /**
         * 触发过验证接口后 自动进行校验
         */
        autoValidate: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        /**
         * 禁用编辑详情
         */
        disableEditDetail: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {

        const { autoValidate } = toRefs(props)


        const model = ref<types.CargoVGMModel>(new types.CargoVGMModel());
        model.value.Details.push(new types.CargoEDI_VGMDetail());




        const utils = useUtils()
        const editorOptions = useEditorOptions();
        const summary = useSummary(model)
        const { validate, validator, formRef, fieldErrors, reset: validateReset } = useValidate(model, autoValidate)
        provide("manifest-form-validator", validator)
        provide("manifest-form-fieldErrors", fieldErrors)
        const modelDetail = useModelDetail(model)






        /**
         * 加载数据
         */
        async function load(request: types.CargoVGMModel) {

            // 如果有id 先储存id
            let id = model.value.Id
            // 加载数据
            model.value = JSON.parse(JSON.stringify(request));
            if (id != 0) {
                model.value.Id = id
            }

        }
        /**
         * 重置数据
         */
        async function reset() {
            validateReset()

            let model = new types.CargoVGMModel();
            model.Details.push(new types.CargoEDI_VGMDetail())
            await load(model)
        }

        async function save(req: { validate: boolean }): Promise<types.CargoVGMModel | null> {
            if (req.validate) {
                if ((await validate(true)) == false) {
                    return null
                }
            }

            return model.value
        }






        return {
            model,
            load,
            reset,
            save,
            utils,
            editorOptions,
            validate,
            validator,
            formRef,
            fieldErrors,
            modelDetail,
            summary

        }
    },
});
</script>
<style lang="scss">
.manifest-editor-label {
    width: 120px;
}

.manifest-editor-content {
    min-width: 282px;
}
</style>
<style lang="scss" scoped>
:deep(.form-table) {

    // description 相关的
    .el-descriptions__label.el-descriptions__cell.is-bordered-label {
        background: #f0f9ea;
        border: 1px solid #dcdfe6;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
    }

    .el-descriptions .is-bordered .el-descriptions__cell {
        border: 1px solid #dcdfe6;
    }

    .el-descriptions__cell.el-descriptions__content.is-left {
        // 内容
        border: 1px solid #dcdfe6;
        padding: 5px 10px;
        // padding-right: 29px;
    }

    .el-descriptions__body {
        background-color: #f7f8fa;
    }

    // form 相关的
    .el-form-item--small.el-form-item {
        margin: 0px;
    }

    .el-form-item__content {
        line-height: initial;
    }

    // input 相关
    .el-input__inner {
        height: 25px;
    }

    .form-lable {
        width: 129px;
    }

    .label-text {
        &.required {
            &::before {
                content: "*";
                font-size: 12px;
                color: #ef4333;
                font-weight: 500;
            }
        }
    }

    .el-descriptions__cell.el-descriptions__content.is-left {
        position: relative;
    }

    .error-tips {
        // position: absolute;
        // right: 7px;
        // top: 9px;
        // display: inline-block;
        margin-left: 5px;
    }
}

.vgm-detail {

    :deep(.el-button) {
        min-height: 25px;
        height: 25px;
        line-height: 25px;
        padding: 0px 15px;

    }

    .summary {
        display: flex;

        .label {
            font-size: 12px;
            color: #606266;
            letter-spacing: 0;
            line-height: 22px;
            font-weight: 400;
        }

        .value {
            font-size: 12px;
            color: #67c23a;
            letter-spacing: 0;
            line-height: 22px;
            font-weight: 400;
            margin-right: 8px;
        }
    }

    .vgm-detail-btns {
        display: flex;
        justify-content: space-between;

        :deep(.el-button) {
            i {
                margin-right: 4px;
            }
        }

    }

    .table {
        margin-top: 8px;

        .table-field {
            font-size: 12px;
            color: #000000;
            letter-spacing: -0.86px;
            font-weight: 500;

            &.required {
                &:before {
                    content: "*";
                    font-size: 12px;
                    color: #ef4333;
                    font-weight: 500;
                }
            }
        }

        :deep(th) {
            background-color: #f0f9ea;
        }

        :deep(th, td, tr) {
            border-color: #e4e7ed;
        }

        :deep(.el-form-item--small.el-form-item) {
            margin-bottom: 0px;
            padding: 0px 10px;
        }

        :deep(.el-form-item.is-error) {
            background-color: #fef0f0;
        }

        :deep(.el-input__inner) {
            border: none;
            padding: 0px;
            background-color: rgba(0, 0, 0, 0);
        }

        :deep(tbody td) {
            padding: 0px;

            .cell {
                padding: 0px;
            }
        }
    }
}

.error-tips {
    margin-left: 5px;
}

.flex {
    display: flex;
    align-items: center;
}
</style>