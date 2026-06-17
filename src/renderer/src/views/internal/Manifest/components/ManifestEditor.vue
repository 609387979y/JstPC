<template>
    <el-form :show-message="false" ref="formRef" :model="model">
        <!-- 基本信息 -->
        <div>
            <CargoTitleVue style="margin-bottom: 8px;">基本信息</CargoTitleVue>
            <el-descriptions class="form-table" :column="3" size="small" border>
                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">主提单号</div>
                    </template>
                    <el-form-item
                        :rules="{ validator: validator, trigger: 'blur' }"
                        class="form-content"
                        prop="CGO_MBL_NO"
                    >
                        <div class="flex">
                            <el-input
                                :disabled="disableProps.CGO_MBL_NO"
                                v-model="model.CGO_MBL_NO"
                                placeholder="请输入主提单号"
                                @input="model.CGO_MBL_NO = utils.inputCGO_MBL_NO(model.CGO_MBL_NO)"
                            ></el-input>
                            <ManifestErrorTips class="error-tips" field="CGO_MBL_NO"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">船公司</div>
                    </template>
                    <el-form-item
                        :rules="{ validator: validator, trigger: 'blur' }"
                        class="form-content"
                        prop="ShippingCode"
                    >
                        <div class="flex">
                            <el-select
                                v-model="model.ShippingCode"
                                filterable
                                :disabled="disableProps.ShippingCode"
                                placeholder="船公司"
                                @change="(v) => editorOptions.onCodeSelectChange(v, editorOptions.SHIPPINGList, (item) => { model.ShippingName = `${item.Code} - ${item.Name}` })"
                            >
                                <el-option
                                    :label="`${item.Code} - ${item.Name}`"
                                    :value="item.Code"
                                    v-for="item in editorOptions.SHIPPINGList"
                                    :key="item.Code"
                                >
                                    <div style="display: flex; justify-content: space-between;">
                                        <div>{{ item.Code }}</div>
                                        <div style="color:#909399">{{ item.Name }}</div>
                                    </div>
                                </el-option>
                            </el-select>
                            <ManifestErrorTips class="error-tips" field="ShippingCode"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">货物类型</div>
                    </template>
                    <el-form-item
                        :rules="{ validator: validator, trigger: 'blur' }"
                        class="form-content"
                        prop="CargoType"
                    >
                        <div class="flex">
                            <el-select v-model="model.CargoType" placeholder="货物类型">
                                <el-option
                                    :label="item.Name"
                                    :value="item.Code"
                                    v-for="item in editorOptions.CARGO_TYPEList"
                                    :key="item.Code"
                                ></el-option>
                            </el-select>

                            <ManifestErrorTips class="error-tips" field="CargoType"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">运输条款</div>
                    </template>
                    <div class="form-content flex">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            prop="CGO_M_DELY_TERMA"
                        >
                            <el-input disabled v-model="CGO_M_DELY_TERMAB"></el-input>
                        </el-form-item>
                        <!-- 固定CY-CY -->

                        <!-- <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            prop="CGO_M_DELY_TERMA"
                        >
                            <el-select value="CY" placeholder="运输条款A">
                                <el-option
                                    :label="item.Name"
                                    :value="item.Code"
                                    v-for="item in editorOptions.CGO_M_DELY_TERMAList"
                                    :key="item.Code"
                                ></el-option>
                            </el-select> 
                        </el-form-item>
                        <div style="margin:0px 10px;line-height: 25px;">-</div>
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            prop="CGO_M_DELY_TERMB"
                        >
                           <el-select v-model="model.CGO_M_DELY_TERMB" placeholder="运输条款B">
                                <el-option
                                    :label="item.Name"
                                    :value="item.Code"
                                    v-for="item in editorOptions.CGO_M_DELY_TERMBList"
                                    :key="item.Code"
                                ></el-option>
                            </el-select> 
                        </el-form-item>
                         <ManifestErrorTips
                            class="error-tips"
                            :field="['CGO_M_DELY_TERMA', 'CGO_M_DELY_TERMB']"
                        ></ManifestErrorTips>-->
                    </div>
                </el-descriptions-item>

                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">付款方式</div>
                    </template>
                    <el-form-item
                        :rules="{ validator: validator, trigger: 'blur' }"
                        class="form-content"
                        prop="CGO_M_FRT_TERM"
                    >
                        <div class="flex">
                            <el-select v-model="model.CGO_M_FRT_TERM" placeholder="付款方式">
                                <el-option
                                    :label="item.Name"
                                    :value="item.Code"
                                    v-for="item in editorOptions.CGO_M_DELY_TERMList"
                                    :key="item.Code"
                                ></el-option>
                            </el-select>
                            <ManifestErrorTips class="error-tips" field="CGO_M_FRT_TERM"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">提单类型</div>
                    </template>
                    <el-form-item
                        :rules="{ validator: validator, trigger: 'blur' }"
                        class="form-content"
                        prop="CGO_MBL_TYPE"
                    >
                        <div class="flex">
                            <el-select v-model="model.CGO_MBL_TYPE" placeholder="提单类型">
                                <el-option
                                    :label="item.Name"
                                    :value="item.Code"
                                    v-for="item in editorOptions.CGO_MBL_TYPEList"
                                    :key="item.Code"
                                ></el-option>
                            </el-select>

                            <ManifestErrorTips class="error-tips" field="CGO_MBL_TYPE"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">签发地</div>
                    </template>
                    <el-form-item class="form-content">
                        <el-input v-model="shanghaiPort" disabled></el-input>
                    </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">提单份数</div>
                    </template>
                    <el-form-item
                        :rules="{ validator: validator, trigger: 'blur' }"
                        class="form-content"
                        prop="CGO_MBL_NUM"
                    >
                        <div class="flex">
                            <el-input
                                style="width: 180px;"
                                v-model.number="model.CGO_MBL_NUM"
                                placeholder="提单份数"
                            ></el-input>

                            <ManifestErrorTips class="error-tips" field="CGO_MBL_NUM"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>

                <!-- 托运编号不需要填写  后台进行生成 -->
                <!-- <el-descriptions-item label-class-name="manifest-editor-label" class-name="manifest-editor-content"  >
                    <template #label>
                        <div class="required label-text">托运编号</div>
                    </template>
                    <el-form-item :rules="{ validator: validator, trigger: 'blur' }" class="form-content" prop="ReferenceNo">
                        <el-input v-model.number="model.ReferenceNo" placeholder="托运编号"></el-input>
                    </el-form-item>
                </el-descriptions-item>-->
            </el-descriptions>
        </div>

        <!-- 船舶信息 -->
        <div style="margin-top: 16px;">
            <CargoTitleVue style="margin-bottom: 8px;">船舶信息</CargoTitleVue>
            <el-descriptions class="form-table" :column="3" size="small" border>
                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">船名</div>
                    </template>
                    <el-form-item
                        :rules="{ validator: validator, trigger: 'blur' }"
                        class="form-content"
                        prop="CGO_VES"
                    >
                        <div class="flex">
                            <el-autocomplete
                                @input="$nextTick(()=>{model.CGO_VES = utils.inputToUpAndNoChinese(model.CGO_VES)})"
                                v-model="model.CGO_VES"
                                :fetch-suggestions="autoComplete.queryVES"
                                :trigger-on-focus="false"
                                clearable
                                placeholder="船名"
                                :disabled="disableProps.CGO_VES"
                            />

                            <ManifestErrorTips class="error-tips" field="CGO_VES"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">航次</div>
                    </template>
                    <div class="flex">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            class="form-content"
                            prop="CGO_VOY"
                        >
                            <el-autocomplete
                                @input="$nextTick(()=>{model.CGO_VOY = utils.inputToUpAndNoChinese(model.CGO_VOY)})"
                                v-model="model.CGO_VOY"
                                :fetch-suggestions="autoComplete.queryVOY"
                                :trigger-on-focus="false"
                                clearable
                                placeholder="航次"
                                :disabled="disableProps.CGO_VOY"
                            />
                        </el-form-item>

                        <el-link @click="clickNotOpen" :underline="false" class="check-btn">检测</el-link>
                        <ManifestErrorTips class="error-tips" field="CGO_VOY"></ManifestErrorTips>
                    </div>
                </el-descriptions-item>

                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">船代</div>
                    </template>
                    <div class="flex">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            class="form-content"
                            prop="ShipAgentCode"
                        >
                            <el-select
                                v-model="model.ShipAgentCode"
                                filterable
                                placeholder="船代"
                                @change="(v) => editorOptions.onCodeSelectChange(v, editorOptions.SHIP_AGENTList, (item) => { model.ShipAgentName = item.Name })"
                                :disabled="disableProps.ShipAgentCode"
                            >
                                <el-option
                                    :label="item.Name"
                                    :value="item.Code"
                                    v-for="item in editorOptions.SHIP_AGENTList"
                                    :key="item.Code"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-link @click="clickNotOpen" :underline="false" class="check-btn">校验</el-link>
                        <ManifestErrorTips class="error-tips" field="CGO_VOY"></ManifestErrorTips>
                    </div>
                </el-descriptions-item>

                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">发货地</div>
                    </template>
                    <el-form-item
                        :rules="{ validator: validator, trigger: 'blur' }"
                        class="form-content"
                        prop="CGO_ACPT_CODE"
                    >
                        <div class="flex">
                            <el-select
                                v-model="model.CGO_ACPT_CODE"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="发货地"
                                :remote-method="ACPTPortSearch.searchPort"
                                @change="ACPTPortSearch.selectPort"
                                :loading="ACPTPortSearch.isLoading"
                                clearable
                            >
                                <el-option
                                    v-for="item in ACPTPortSearch.ports"
                                    :key="item.Code"
                                    :label="`${item.EnPortName}`"
                                    :value="item.Code"
                                ></el-option>
                            </el-select>
                            <ManifestErrorTips class="error-tips" field="CGO_ACPT_CODE"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">装货港</div>
                    </template>
                    <el-form-item
                        :rules="{ validator: validator, trigger: 'blur' }"
                        class="form-content"
                        prop="CGO_POL_CODE"
                    >
                        <div class="flex">
                            <el-select
                                v-model="model.CGO_POL_CODE"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="装货港"
                                :remote-method="POLPortSearch.searchPort"
                                @change="POLPortSearch.selectPort"
                                :loading="POLPortSearch.isLoading"
                                clearable
                            >
                                <el-option
                                    v-for="item in POLPortSearch.ports"
                                    :key="item.Code"
                                    :label="`${item.EnPortName}`"
                                    :value="item.Code"
                                ></el-option>
                            </el-select>
                            <ManifestErrorTips class="error-tips" field="CGO_POL_CODE"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">卸货港</div>
                    </template>
                    <el-form-item
                        :rules="{ validator: validator, trigger: 'blur' }"
                        class="form-content"
                        prop="CGO_POD_CODE"
                    >
                        <div class="flex">
                            <el-select
                                v-model="model.CGO_POD_CODE"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="卸货港"
                                :remote-method="PODPortSearch.searchPort"
                                @change="PODPortSearch.selectPort"
                                :loading="PODPortSearch.isLoading"
                                clearable
                            >
                                <el-option
                                    v-for="item in PODPortSearch.ports"
                                    :key="item.Code"
                                    :label="`${item.EnPortName}`"
                                    :value="item.Code"
                                ></el-option>
                            </el-select>
                            <ManifestErrorTips class="error-tips" field="CGO_POD_CODE"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item
                    label-class-name="manifest-editor-label"
                    class-name="manifest-editor-content"
                >
                    <template #label>
                        <div class="required label-text">目的港</div>
                    </template>
                    <el-form-item
                        :rules="{ validator: validator, trigger: 'blur' }"
                        class="form-content"
                        prop="CGO_DELY_CODE"
                    >
                        <div class="flex">
                            <el-select
                                v-model="model.CGO_DELY_CODE"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="目的港"
                                :remote-method="DELYPortSearch.searchPort"
                                @change="DELYPortSearch.selectPort"
                                :loading="DELYPortSearch.isLoading"
                                clearable
                            >
                                <el-option
                                    v-for="item in DELYPortSearch.ports"
                                    :key="item.Code"
                                    :label="`${item.EnPortName}`"
                                    :value="item.Code"
                                ></el-option>
                            </el-select>
                            <ManifestErrorTips class="error-tips" field="CGO_DELY_CODE"></ManifestErrorTips>
                        </div>
                    </el-form-item>
                </el-descriptions-item>
            </el-descriptions>
        </div>

        <!-- 收发通信息 -->
        <div class="manifest-editor-sft" style="margin-top: 16px;">
            <CargoTitleVue style="margin-bottom: 8px;">收发通信息</CargoTitleVue>
            <ManifestTips :hidebtn="true" tiptype="warning" content="提醒：请尽量填写境内发货人，原则上海关不允许境外发货人！"></ManifestTips>
            <ManifestSFT showTemplate ref="sftRef" :form="model"></ManifestSFT>
        </div>

        <!-- 货物明细 -->
        <div style="margin-top: 16px;">
            <CargoTitleVue style="margin-bottom: 8px;">货物明细</CargoTitleVue>
            <ManifestEditorDetail :disableProps="disableProps" :model="model"></ManifestEditorDetail>
        </div>
        <NotOpenDialog type="manifest" ref="notOpenDialog"></NotOpenDialog>
    </el-form>
</template>

<script lang="tsx">
import {
    defineComponent,
    ref,
    reactive,
    Ref,
    provide,
    toRefs,
    PropType,
    watch,
    watchEffect,
    nextTick
} from "vue";
import { ElMessage, ElForm } from "element-plus"
import request from "@/public/request"
import * as types from "./types";
import CargoTitleVue from "./CargoTitle.vue";
import { useEditorOptions, usePortSearch,useAutoComplete } from "./editor/useEditorOptions"
import ManifestSFT from "./ManifestSFT.vue";
import { utils as jstUtils } from "justom-share";
import ManifestEditorDetail from "./editor/ManifestEditorDetail.vue";
import { init } from "@sentry/electron";
import ManifestErrorTips from "./editor/ManifestErrorTips.vue";
import ManifestTips from "./manifestTips.vue";
import NotOpenDialog from "@/components/NotOpenDialog.vue"
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

    function inputCGO_MBL_NO(val:string){
        let v = inputToUpAndNoChinese(val);
        v = inputToUpAndOnlyEnglishOrNum(val)
        return v
    }

    return reactive({
        inputToUp,
        inputToNoChinese,
        inputToUpAndOnlyEnglishOrNum,
        toNumberPoint,
        formatEmptyString: jstUtils.formatEmptyString,
        inputToUpAndNoChinese,
        inputCGO_MBL_NO
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
interface FormRule {
    field: string,
    fullField: string,
    type: string
}
function useValidate(model: Ref<types.CargoEDIManifestModel>, autoValidate: Ref<boolean>) {
    // 错误列表
    const fieldErrors = ref<Map<string, string[]>>(new Map<string, string[]>())
    // form instance 
    const formRef = ref<any>()


    // 请求接口返回错误信息
    async function requestValidate(): Promise<FieldError[]> {
        let res = await request.post("/api/CargoEDISHManifest/Validate", model.value)
        if (res.Status) {
            return []
        }
        return res.Data as FieldError[]
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
    async function validate(jumpToError:boolean = false) {

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
        // 清除验证
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


export default defineComponent({
    components: {
        CargoTitleVue,
        ManifestSFT,
        ManifestEditorDetail,
        ManifestErrorTips,
        ManifestTips,
        NotOpenDialog
    },
    props: {
        /**
         * 触发过验证接口后 自动进行校验
         */
        autoValidate: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        disableProps: {
            type: Object as PropType<types.ManifestEditorDisableProps>,
            default: () => {
                const props: types.ManifestEditorDisableProps = {
                    CGO_MBL_NO: false,
                    CGO_VES:false,
                    CGO_VOY:false,
                    ShippingCode:false,
                    ShipAgentCode:false,
                    DetailCGO_MBL_NO: false,
                    DetailCGO_DESC:false,
                    DetailCGO_CNNO:false,
                    DetailCGO_SEALNO:false,
                    
                }
                return props
            }
        }
    },
    methods: {
        clickNotOpen() {
            this.$refs.notOpenDialog.showDialog();
        }
    },
    setup(props) {
        const { autoValidate } = toRefs(props)

        const model = ref<types.CargoEDIManifestModel>(new types.CargoEDIManifestModel());

        model.value.Details.push(new types.ManifestDetail());


        const editorOptions = useEditorOptions();

        // 发货地
        const ACPTPortSearch = usePortSearch((value) => {
            model.value.CGO_ACPT_NAME = value.EnPortName
        })
        // 装货港
        const POLPortSearch = usePortSearch((value) => {
            model.value.CGO_POL_NAME = value.EnPortName
        })
        // 卸货港
        const PODPortSearch = usePortSearch((value) => {
            model.value.CGO_POD_NAME = value.EnPortName
        })
        // 目的港
        const DELYPortSearch = usePortSearch((value) => {
            model.value.CGO_DELY_NAME = value.EnPortName
        })


        // 收发通组件
        const sftRef = ref()
        const { validate, validator, formRef, fieldErrors, reset: validateReset } = useValidate(model, autoValidate)
        provide("manifest-form-validator", validator)
        provide("manifest-form-fieldErrors", fieldErrors)
        async function load(request: types.CargoEDIManifestModel) {

            validateReset()
            // 如果有id 先储存id
            let id = model.value.Id
            // 加载数据
            model.value = JSON.parse(JSON.stringify(request));
            if (id != 0) {
                model.value.Id = id
            }




            // 船公司
            editorOptions.onCodeSelectChange(model.value.ShippingCode, editorOptions.SHIPPINGList, (item) => { model.value.ShippingName = `${item.Code} - ${item.Name}` })

            // 触发港口搜索
            ACPTPortSearch.searchPort(request.CGO_ACPT_CODE)
            POLPortSearch.searchPort(request.CGO_POL_CODE)
            PODPortSearch.searchPort(request.CGO_POD_CODE)
            DELYPortSearch.searchPort(request.CGO_DELY_CODE)



            // 处理收发通
            function formatSFT() {
                // 重新赋值收发通
                model.value.SH_CODE = request.SH_CODE;
                model.value.CN_CODE = request.CN_CODE;
                model.value.NT_CODE = request.NT_CODE;

                sftRef.value.getSFTCodeSelectList("SH_CNTRY", "SH_CODE", "fhrList");
                sftRef.value.getSFTCodeSelectList("CN_CNTRY", "CN_CODE", "shrList");
                sftRef.value.getSFTCodeSelectList("NT_CNTRY", "NT_CODE", "tzrList");


            }
            nextTick(() => {
                formatSFT()
            })

        }


        function reset() {

            validateReset()

            let model = new types.CargoEDIManifestModel();
            model.Details.push(new types.ManifestDetail())
            load(model)
        }


        /**
         * 保存数据
         */
        async function save(req: {
            validate: boolean
        }): Promise<types.CargoEDIManifestModel | null> {

            if (req.validate) {
                if ((await validate(true)) == false) {
                    return null
                }
            }

            return model.value
        }



        const utils = useUtils()
        const autoComplete = useAutoComplete()

        return {
            editorOptions,
            model,
            ACPTPortSearch,
            POLPortSearch,
            DELYPortSearch,
            PODPortSearch,
            formRef,
            validate,
            validator,
            validateReset,
            load,
            save,
            reset,
            shanghaiPort: "CNSHA | SHANGHAI",
            CGO_M_DELY_TERMAB: "CY-CY",
            sftRef,
            utils,
            autoComplete
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
.flex {
    display: flex;
    align-items: center;
}
.check-btn {
    font-size: 12px;
    color: #67c23a;
    font-weight: 400;
    margin-left: 12px;
    &:hover {
        color: #67c23a;
        opacity: 0.8;
    }
}
:deep(.manifest-editor-sft) {
    tr .row-title,
    .group-title {
        background-color: #f0f9ea;
        font-size: 12px;
        color: #000000;
        letter-spacing: -0.86px;
        font-weight: 400;
    }

    .el-button--text {
        // 修改按钮颜色为绿色
        // color: #67C23A;
        color: #67c23a;
    }
}
.input-width {
    width: 206px;
}
.form-table {
    // width:300px;
}
</style>