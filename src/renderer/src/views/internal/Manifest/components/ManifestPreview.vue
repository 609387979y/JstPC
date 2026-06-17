<template>
    <div class="previewcontent">
        <!-- 基本信息 -->
        <div style="margin-bottom: 16px;">
            <CargoTitle style="margin-bottom: 8px;">基本信息</CargoTitle>

            <el-descriptions class="preview-table" :column="3" size="small" border>
                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">主提单号</div>
                    </template>
                    {{ utils.formatEmptyString(model.CGO_MBL_NO) }}
                </el-descriptions-item>
                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">船公司</div>
                    </template>
                    {{ utils.formatEmptyString(model.ShippingName) }}
                </el-descriptions-item>
                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">货物类型</div>
                    </template>
                    {{ editorOptions.covertCodeToName(editorOptions.CARGO_TYPEList, model.CargoType) }}
                </el-descriptions-item>

                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">运输条款</div>
                    </template>
                    {{ model.CGO_M_DELY_TERMA }}-{{ model.CGO_M_DELY_TERMB }}
                </el-descriptions-item>

                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">付款方式</div>
                    </template>
                    {{ editorOptions.covertCodeToName(editorOptions.CGO_M_DELY_TERMList, model.CGO_M_FRT_TERM) }}
                </el-descriptions-item>

                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">提单类型</div>
                    </template>
                    {{ editorOptions.covertCodeToName(editorOptions.CGO_MBL_TYPEList, model.CGO_MBL_TYPE) }}
                </el-descriptions-item>

                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">签发地</div>
                    </template>
                    SHANGHAI|CNSHA
                </el-descriptions-item>

                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">提单份数</div>
                    </template>
                    {{ utils.formatEmptyString(model.CGO_MBL_NUM as any) }}
                </el-descriptions-item>
            </el-descriptions>
        </div>

        <!-- 船舶信息 -->
        <div style="margin-bottom: 16px;">
            <CargoTitle style="margin-bottom: 8px;">船舶信息</CargoTitle>

            <el-descriptions class="preview-table" :column="3" size="small" border>
                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">船名</div>
                    </template>
                    {{ utils.formatEmptyString(model.CGO_VES) }}
                </el-descriptions-item>
                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">航次</div>
                    </template>
                    {{ utils.formatEmptyString(model.CGO_VOY) }}
                </el-descriptions-item>
                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">船代</div>
                    </template>
                    {{ utils.formatEmptyString(model.ShipAgentName) }}
                </el-descriptions-item>

                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">发货地</div>
                    </template>
                    {{ utils.formatEmptyString(model.CGO_ACPT_NAME) }}
                </el-descriptions-item>

                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">装货港</div>
                    </template>
                    {{ utils.formatEmptyString(model.CGO_POL_NAME) }}
                </el-descriptions-item>

                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">卸货港</div>
                    </template>
                    {{ utils.formatEmptyString(model.CGO_POD_NAME) }}
                </el-descriptions-item>

                <el-descriptions-item label-class-name="form-lable">
                    <template #label>
                        <div class="label-text">目的港</div>
                    </template>
                    {{ utils.formatEmptyString(model.CGO_DELY_NAME) }}
                </el-descriptions-item>
            </el-descriptions>
        </div>

        <!-- 收发信息 -->
        <div style="margin-bottom: 16px;">
            <CargoTitle style="margin-bottom: 8px;" >收发信息</CargoTitle>

            <ManifestSFTInfo :form="model"></ManifestSFTInfo>
        </div>
        <!-- 货物明细 -->
        <div style="margin-bottom: 16px;">
            <CargoTitle style="margin-bottom: 8px;">货物明细</CargoTitle>
            <ManifestEditorDetailInfo :model="model"></ManifestEditorDetailInfo>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, PropType } from "vue"
import * as types from "./types"
import CargoTitle from "./CargoTitle.vue"
import { useEditorOptions } from "./editor/useEditorOptions"
import { utils } from "justom-share"
import ManifestSFTInfo from "./ManifestSFTInfo.vue"
import ManifestEditorDetailInfo from "./editor/ManifestEditorDetailInfo.vue"
export default defineComponent({
    components: {
        CargoTitle,
        ManifestSFTInfo,
        ManifestEditorDetailInfo
    },
    props: {
        model: {
            type: Object as PropType<types.CargoEDIManifestModel>,
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
.preview-table{
	:deep(.el-descriptions__body){
		.is-bordered{
			.el-descriptions__cell{
				border: 1px solid #DCDFE6;
			}
		} 
		.el-descriptions__label.el-descriptions__cell.is-bordered-label{
			font-size: 12px;
			color: rgba(0,0,0,0.85);
			font-weight: 500;
		}
	}
}
.previewcontent{
	:deep(.mainifest-table){
		.group-title{
			font-size: 12px;
			color: rgba(0,0,0,0.85);
			font-weight: 500;
		}
		.row-title{
			font-size: 12px;
			color: rgba(0,0,0,0.85);
			font-weight: 500;
		}
	    td{
	    	border: 1px solid #DCDFE6;
	    }
	}
}
</style>