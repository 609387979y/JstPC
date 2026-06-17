<template>
    <div class="previewcontent">
        <!-- 基本信息 -->
        <div style="margin-bottom: 16px;">
            <CargoTitle style="margin-bottom: 8px;">基本信息</CargoTitle>

            <el-descriptions class="preview-table" :column="3" size="small" border>
                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">港口</div>
                    </template>
                    {{ utils.formatEmptyString(model.PortName as any) }}
                </el-descriptions-item>
                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">船公司</div>
                    </template>
                    {{ utils.formatEmptyString(model.ShippingName as any) }}
                </el-descriptions-item>
                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">提单号</div>
                    </template>
                    {{ utils.formatEmptyString(model.CGO_MBL_NO as any) }}
                </el-descriptions-item>


                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">码头</div>
                    </template>
                    {{ utils.formatEmptyString(model.CGO_WHARF_NAME as any) }}
                </el-descriptions-item>

                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">船名</div>
                    </template>
                    {{ utils.formatEmptyString(model.CGO_VES as any) }}
                </el-descriptions-item>


                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">航次</div>
                    </template>
                    {{ utils.formatEmptyString(model.CGO_VOY as any) }}
                </el-descriptions-item>



                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">持箱人</div>
                    </template>
                    {{ utils.formatEmptyString(model.OwnerBoxSign as any) }}
                </el-descriptions-item>

                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">截VGM事件</div>
                    </template>
                    {{ utils.formatEmptyString(model.CutOffDay as any) }}
                </el-descriptions-item>

                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">SO号</div>
                    </template>
                    {{ utils.formatEmptyString(model.SO_NO as any) }}
                </el-descriptions-item>


            </el-descriptions>
        </div>
        <!-- 箱子信息 -->

        <div class="table">
            <el-table border stripe :data="model.Details">

                <el-table-column prop="CGO_CNNO" label="箱号">
                    <template #default="scope">
                        {{ utils.formatEmptyString(scope.row.CGO_CNNO) }}
                    </template>
                </el-table-column>
                <el-table-column prop="VGM" label="VGM重量(KGS)">
                    <template #default="scope">
                        {{ utils.formatEmptyString(scope.row.VGM) }}
                    </template>
                </el-table-column>
                <el-table-column prop="WeightingPart" label="称重方">
                    <template #default="scope">
                        {{ utils.formatEmptyString(scope.row.WeightingPart) }}
                    </template>
                </el-table-column>
                <el-table-column prop="WeightingPartAddress" label="称重方地址">
                    <template #default="scope">
                        {{ utils.formatEmptyString(scope.row.WeightingPartAddress) }}
                    </template>
                </el-table-column>
                <el-table-column prop="SignName" label="签名">
                    <template #default="scope">
                        {{ utils.formatEmptyString(scope.row.SignName) }}
                    </template>
                </el-table-column>

            </el-table>
        </div>

    </div>
</template>


<script lang="ts">
import { defineComponent, PropType } from "vue"
import * as types from "./types"
import CargoTitle from "../../components/CargoTitle.vue"
import { useEditorOptions } from "../../components/editor/useEditorOptions"
import { utils } from "justom-share"
export default defineComponent({
    components: {
        CargoTitle
    },
    props: {
        model: {
            type: Object as PropType<types.CargoVGMModel>,
            required: true
        }
    },
    data() {
        return {

        }
    },
    methods: {

    },
    setup() {
        const editorOptions = useEditorOptions()
        return {
            editorOptions,
            utils
        }
    }


})
</script>

<style lang="scss" scoped>
.preview-table {
    :deep(.el-descriptions__body) {
        .is-bordered {
            .el-descriptions__cell {
                border: 1px solid #DCDFE6;
            }
        }

        .el-descriptions__label.el-descriptions__cell.is-bordered-label {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
        }
    }
}

.previewcontent {
    :deep(.mainifest-table) {
        .group-title {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
        }

        .row-title {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
        }

        td {
            border: 1px solid #DCDFE6;
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
        background-color: #F2F3F5;
    }

    :deep(th, td, tr) {
        border-color: #e4e7ed;
    }

    :deep(.el-form-item--small.el-form-item) {
        margin-bottom: 0px;
        padding: 0px 10px;
    }



}
</style>