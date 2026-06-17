<template>
    <div class="manifest-editor-detail">
        <div class="btns">
            <div>
                <template v-if="!disableProps.DetailCGO_MBL_NO">
                    <el-button @click="addDetail" type="primary"><el-icon><plus /></el-icon>新增</el-button>
                    <el-button @click="copyDetail"><el-icon><document-copy /></el-icon>复制</el-button>
                    <el-button @click="removeDetail"><el-icon><delete /></el-icon>删除</el-button>
                    <el-button @click="clearDetail"><el-icon><refresh /></el-icon>清空</el-button>
            
                </template>
            </div>
            <div class="summary">
                <div class="label">总件数：</div>
                <div class="value">{{ summary.totalNum }}</div>
                <div class="label">总毛重：</div>
                <div class="value">{{ summary.totalWeight }}</div>
                <div class="label">总体积：</div>
                <div class="value">{{ summary.totalCBM }}</div>
            </div>
        </div>
        <div class="table">
            <el-table
                border
                highlight-current-row
                @current-change="currentRowChange"
                stripe
                :data="model.Details"
            >
                <el-table-column label="提单号">
                    <template #header>
                        <div class="table-field required">提单号</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].CGO_MBL_NO`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].CGO_MBL_NO`">
                                <el-input
                                    v-model="scope.row.CGO_MBL_NO"
                                    @input="scope.row.CGO_MBL_NO = utils.inputToUpAndOnlyEnglishOrNum(scope.row.CGO_MBL_NO)"
                                    placeholder="提单号"
                                    :disabled="disableProps.DetailCGO_MBL_NO"
                                ></el-input>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column min-width="191" label="品名">
                    <template #header>
                        <div class="table-field">品名</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].CGO_DESC`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].CGO_DESC`">
                                <el-input
                                    v-model="scope.row.CGO_DESC"
                                    @input="scope.row.CGO_DESC = utils.inputToUp(scope.row.CGO_DESC)"
                                    placeholder="品名"
                                    :disabled="disableProps.DetailCGO_DESC"
                                ></el-input>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column width="120" label="箱号">
                    <template #header>
                        <div class="table-field">箱号</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].CGO_CNNO`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].CGO_CNNO`">
                                <el-input
                                    v-model="scope.row.CGO_CNNO"
                                    @input="scope.row.CGO_CNNO = utils.inputToUpAndOnlyEnglishOrNum(scope.row.CGO_CNNO)"
                                    placeholder="箱号"
                                    :disabled="disableProps.DetailCGO_CNNO"
                                ></el-input>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column width="100" label="封号">
                    <template #header>
                        <div class="table-field">封号</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].CGO_SEALNO`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].CGO_SEALNO`">
                                <el-input
                                    v-model="scope.row.CGO_SEALNO"
                                    @input="scope.row.CGO_SEALNO = utils.inputToUpAndOnlyEnglishOrNum(scope.row.CGO_SEALNO)"
                                    placeholder="封号"
                                    :disabled="disableProps.DetailCGO_SEALNO"
                                ></el-input>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="HS CODE">
                    <template #header>
                        <div class="table-field">HS CODE</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].CGO_HSCODE`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].CGO_HSCODE`">
                                <el-input
                                    v-model="scope.row.CGO_HSCODE"
                                    @input="scope.row.CGO_HSCODE = utils.inputToUpAndOnlyEnglishOrNum(scope.row.CGO_HSCODE)"
                                    placeholder="HS CODE"
                                ></el-input>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="箱型">
                    <template #header>
                        <div class="table-field">箱型</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].CGO_CN_TYPE`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].CGO_CN_TYPE`">
                                <el-select
                                    v-model="scope.row.CGO_CN_TYPE"
                                    filterable
                                    placeholder="箱型"
                                >
                                    <el-option
                                        :label="item.Name"
                                        :value="item.Code"
                                        v-for="item in editorOptions.CGO_CN_TYPEList"
                                        :key="item.Code"
                                    ></el-option>
                                </el-select>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="货主箱标志">
                    <template #header>
                        <div class="table-field">货主箱标志</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].OwnerBoxSign`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].OwnerBoxSign`">
                                <el-select
                                    v-model="scope.row.OwnerBoxSign"
                                    filterable
                                    placeholder="标志"
                                >
                                    <el-option label="SOC" value="SOC"></el-option>
                                    <el-option label="COC" value="COC"></el-option>
                                </el-select>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="件数">
                    <template #header>
                        <div class="table-field">件数</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].CGO_NUM`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].CGO_NUM`">
                                <el-input v-model.number="scope.row.CGO_NUM" placeholder="件数"></el-input>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="包装">
                    <template #header>
                        <div class="table-field">包装</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].CGO_PACK_CODE`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].CGO_PACK_CODE`">
                                <el-select
                                    @change="(v) => packChange(v, scope.$index)"
                                    v-model="scope.row.CGO_PACK_CODE"
                                    filterable
                                    placeholder="包装单位"
                                >
                                    <el-option
                                        :label="item.Name"
                                        :value="item.Code"
                                        v-for="item in editorOptions.CGO_PACKList"
                                        :key="item.Code"
                                    ></el-option>
                                </el-select>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="毛重(KGS)">
                    <template #header>
                        <div class="table-field">毛重(KGS)</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].CGO_WGT`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].CGO_WGT`">
                                <el-input
                                    v-model="scope.row.CGO_WGT"
                                    @input="scope.row.CGO_WGT = utils.toNumberPoint(scope.row.CGO_WGT)"
                                    placeholder="毛重"
                                ></el-input>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="体积(CBM)">
                    <template #header>
                        <div class="table-field">体积(CBM)</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].CGO_MEAS`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].CGO_MEAS`">
                                <el-input
                                    v-model="scope.row.CGO_MEAS"
                                    @input="scope.row.CGO_MEAS = utils.toNumberPoint(scope.row.CGO_MEAS)"
                                    placeholder="体积"
                                ></el-input>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="唛头">
                    <template #header>
                        <div class="table-field">唛头</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].CGO_MARKS`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].CGO_MARKS`">
                                <el-input
                                    v-model="scope.row.CGO_MARKS"
                                    @input="scope.row.CGO_MARKS = utils.inputToUp(scope.row.CGO_MARKS)"
                                    placeholder="品名"
                                ></el-input>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="UN Code(危)">
                    <template #header>
                        <div class="table-field">UN Code(危)</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].CGO_UNCODE`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].CGO_UNCODE`">
                                <el-input
                                    v-model="scope.row.CGO_UNCODE"
                                    @input="scope.row.CGO_UNCODE = utils.inputToUp(scope.row.CGO_UNCODE)"
                                    placeholder="UN Code"
                                ></el-input>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="类别(危)">
                    <template #header>
                        <div class="table-field">类别(危)</div>
                    </template>
                    <template #default="scope">
                        <el-form-item
                            :rules="{ validator: validator, trigger: 'blur' }"
                            :prop="`Details[${scope.$index}].CGO_CATEGORY`"
                        >
                            <ManifestErrorTips :field="`Details[${scope.$index}].CGO_CATEGORY`">
                                <el-input
                                    v-model="scope.row.CGO_CATEGORY"
                                    @input="scope.row.CGO_CATEGORY = utils.inputToUp(scope.row.CGO_CATEGORY)"
                                    placeholder="类别"
                                ></el-input>
                            </ManifestErrorTips>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    reactive,
    PropType,
    computed,
    toRefs,
    Ref,
    inject
} from "vue";
import * as types from "../types"
import { useEditorOptions } from "./useEditorOptions"
import { ElMessage } from "element-plus"
import * as math from "mathjs"
import ManifestErrorTips from "./ManifestErrorTips.vue"
import { DocumentCopy,Plus,Delete,Refresh } from "@element-plus/icons";
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
    //只允许数字+1个小数点
    function toNumberPoint(val: string) {
        var pattern = /[^\d.]/g;
        val = val.replace(pattern, "");
        val = val.replace(/^\./g, ".");
        val = val.replace(/\.{2,}/g, ".");
        val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        return val;
    }
    return reactive({
        inputToUp,
        inputToNoChinese,
        inputToUpAndOnlyEnglishOrNum,
        toNumberPoint
    })
}


/**
 * 计算总和
 * @param model 
 */
function useSummary(model: Ref<types.CargoEDIManifestModel>) {

    // 总件数
    const totalNum = computed(() => {
        let total = 0;
        model.value.Details.forEach(item => {
            if (typeof item.CGO_NUM == "number") {
                total += item.CGO_NUM;
            } else {
                let v = parseInt(item.CGO_NUM)
                if (isNaN(v)) {

                } else {
                    total += v;
                }
            }
        })
        return total;
    })


    // 总毛重
    const totalWeight = computed(() => {
        let total = math.chain(math.bignumber(0))

        model.value.Details.forEach(item => {
            if (isNaN(parseFloat(item.CGO_WGT))) {

            } else {
                total = total.add(math.bignumber(item.CGO_WGT))
            }
        })
        return math.format(total.done())
    })


    // 总毛重
    const totalCBM = computed(() => {
        let total = math.chain(math.bignumber(0))

        model.value.Details.forEach(item => {
            if (isNaN(parseFloat(item.CGO_MEAS))) {

            } else {
                total = total.add(math.bignumber(item.CGO_MEAS))
            }
        })
        return math.format(total.done())
    })



    return reactive({
        totalNum,
        totalWeight,
        totalCBM
    })
}


export default defineComponent({
    props: {
        model: {
            type: Object as PropType<types.CargoEDIManifestModel>,
            required: true
        },
        disableProps: {
            type: Object as PropType<types.ManifestEditorDisableProps>,
            default: () => {
                const props: types.ManifestEditorDisableProps = {
                    CGO_MBL_NO: false,
                    CGO_VES:false,
                    CGO_VOY:false,
                    ShippingCode:false,
                    DetailCGO_MBL_NO: false,
                    DetailCGO_DESC:false,
                    DetailCGO_CNNO:false,
                    DetailCGO_SEALNO:false
                }
                return props
            }
        }
    },
    components: {
        ManifestErrorTips,
		DocumentCopy,Plus,Delete,Refresh
    },
    setup(props) {
        const { model } = toRefs(props);
        const utils = useUtils()
        const editorOptions = useEditorOptions();
        const summary = useSummary(model);
        /**
         * 包装单位变化
         * @param code 
         * @param idx 
         */
        function packChange(code: string, idx: number) {
            let item = editorOptions.CGO_PACKList.find(t => t.Code == code)
            if (item == undefined) {
                return
            }
            props.model.Details[idx].CGO_PACK = item.Name;
        }

        const currentSelectedIdx = ref(-1);
        /**
         * 当前选中的行变化
         * @param val 
         */
        function currentRowChange(val: types.ManifestDetail | undefined) {
            if (val == undefined) {
                return
            }

            let idx = props.model.Details.findIndex(t => val == t)
            currentSelectedIdx.value = idx;
        }

        /**
         * 新增
         */
        function addDetail() {
            props.model.Details.push(new types.ManifestDetail())
        }

        /**
         * 删除
         */
        function removeDetail() {
            if (currentSelectedIdx.value == -1) {
                ElMessage.warning("请选择一行")
                return
            }

            props.model.Details.splice(currentSelectedIdx.value, 1)
            currentSelectedIdx.value = -1;
        }
        function copyDetail() {
            if (currentSelectedIdx.value == -1) {
                ElMessage.warning("请选择一行")
                return
            }

            let detail = JSON.parse(JSON.stringify(props.model.Details[currentSelectedIdx.value]))
            props.model.Details.push(detail)
        }
        /**
         * 清空detail
         */
        function clearDetail() {
            props.model.Details = []
            currentSelectedIdx.value = -1;
        }


        const validator = inject<Function>("manifest-form-validator")

        return {
            utils,
            editorOptions,
            summary,
            packChange,
            addDetail,
            currentRowChange,
            removeDetail,
            copyDetail,
            clearDetail,
            validator
        }
    },
});
</script>
<style lang="scss" scoped>
.manifest-editor-detail {
    :deep(.el-button) {
        min-height: 25px;
        height: 25px;
        line-height: 25px;
        padding: 0px 15px;
        &.el-button--primary {
            background: #8dce6c;
            border-color: #8dce6c;
            &:hover {
                opacity: 0.7;
            }
        }
    }
    .btns {
        display: flex;
        justify-content: space-between;
		
		:deep(.el-button) {
			i{
				margin-right: 4px;
			}
		}
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

    // el-form-item is-error el-form-item--small
}
</style>