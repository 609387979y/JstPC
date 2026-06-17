<template>
    <el-dialog width="1100px" top="60px" v-model="show" title="舱单详情预览" custom-class="previewDialog">
		<div class="previewBox">
			<ManifestPreview  :model="model"></ManifestPreview>
		</div>
		<div class="SFTbottom">
			<el-button size="mini" @click="savecg"><el-icon><folder /></el-icon>保存草稿</el-button>
			<el-button size="mini" @click="savedfs"><el-icon><clock /></el-icon>提交待发送</el-button>
			<el-button size="mini" @click="savefs" type="success"><el-icon><promotion /></el-icon>提交发送</el-button>
		</div>
    </el-dialog>
</template>


<script lang="ts">
import { defineComponent, PropType } from "vue"
import * as types from "./types"
import ManifestPreview from "./ManifestPreview.vue"
import { Clock,Folder,Promotion } from "@element-plus/icons";
export default defineComponent({
    props: {
    },
    components: {
        ManifestPreview,
		Clock,Folder,Promotion
    },
    data() {
        return {
            show: false,
            model: new types.CargoEDIManifestModel()
        }
    },
    methods: {
        openPreviewDialog(req: types.CargoEDIManifestModel) {
            this.model = req
            this.show = true
            // this.$refs.previewDialog.open()
        },
        cancel() {
            this.show = false
        },
		savecg(){
			this.show = false;
			this.$emit('btnclick',1);
		},
		savedfs(){
			this.show = false;
			this.$emit('btnclick',2);
		},
		savefs(){
			this.show = false;
			this.$emit('btnclick',3);
		}
    },
    created() {

    }


})
</script>

<style lang="scss" scoped>
	.manifestpreviewbox{
		width: 100%;
		height: 500px;
		overflow: auto;
	}
</style>
<style lang="scss">
.previewDialog {
	position: relative;

	.previewBox {
		width: 100%;
		height: 600px;
		box-sizing: border-box;
		overflow: auto;
		padding: 17px 15px 67px 15px;

		
	}
	.previewBox::-webkit-scrollbar {
		width: 4px;
	}
	.previewBox::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: rgba(0, 0, 0, 0.2);
	}
	.previewBox::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		border-radius: 0;
		background: rgba(0, 0, 0, 0.1);
	}

	.SFTbottom {
		width: 100%;
		height: 50px;
		background: #ffffff;
		text-align: center;
		box-sizing: border-box;
		padding-top: 14px;
		box-shadow: 0 -1px 1px 0 rgba(60, 65, 68, 0.25);
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 10;

		button {
			margin: 0 13px;
			i{
				margin-right: 4px;
			}
		}
	}

	.el-dialog__header {
		border-bottom: 1px solid #f2f3f5;
		text-align: center;

		.el-dialog__title {
			font-size: 24px;
			color: #303133;
			letter-spacing: -1.71px;
			font-weight: 500;
		}
	}
	.el-dialog__body {
		padding: 0;
	}
}
</style>