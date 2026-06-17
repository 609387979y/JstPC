<template>
	<el-dialog title="导入VGM" v-model="jxshow" width="600px" @close="jxclose">
		 <div class="jxbox" v-loading="jxloading">
			 <el-upload drag action="" accept=".xls,.xlsx" :show-file-list="false"
			   :http-request="uploadAnalysisHandle">
			   <div slot="trigger" class="upload-box">
			     <img src="@/assets/images/icon-upload.svg" alt="" />
			     <div class="el-upload__text">文件拖至此处或<span>点击上传</span></div>
			   </div>
			 </el-upload>
			 <div class="jxbottom">
			 	<span>使用VGM模版，只能用于VGM导入</span>
			 	<el-button size="mini" @click="downexcel">
			 		<el-icon><download /></el-icon>
			 			下载导入模版
			 		</el-button>
			 </div>
		 </div>
		 
	</el-dialog>
</template>

<script>
import { defineComponent } from "vue"
import { Download } from "@element-plus/icons";
export default defineComponent({
	props: {
		
	},
	components: {
	    Download
	},
	data() {
	    return {
	        jxshow: false,
	        uploadAnalysisFile: [],
	        jxloading: false
	    }
	},
	methods: {
	    /**
	     * 打开解析窗口
	     */
	    openJxDialog(){
	    	this.jxshow = true;
	    },
	    async uploadAnalysisHandle(file) {
	      if (file && file.file) {
	        this.uploadAnalysisFile = file.file
	    	this.jxloading = true;
	    	const formData = new FormData()
	    	formData.append('file', this.uploadAnalysisFile)
	    	var res = await this.$http.post('/api/CargoEDISHVGMDraft/ParseExcelAndCreateDraft',formData);
	    	if(res.Status){
	    		this.$emit('jxsave',res);
	    		this.jxshow = false;
	    		this.$message.success(res.Message);
	    	}else{
	    		this.jxshow = false;
	    		this.$message.error(res.Message);
	    	}
	      }
	    },
	    jxclose(){
	    	this.jxloading = false;
	    	this.uploadAnalysisFile = [];
	    },
		/**
		 * 下载解析模板
		 */
		downexcel(){
			this.$agent().ipcRequest("window/downloadUrl",import.meta.env.VITE_AXIOS_HOST + '/Files/上海VGM导入模板.xlsx"');
		},
	},
	created() {
	
	}
	
	
})
</script>

<style lang="scss" scoped>
	.jxbox{
		width: 536px;
		background: #FFFFFF;
		margin: auto;
		margin-top: -10px;
		
		:deep(.el-upload-dragger){
			width: 536px;
			height: 259px;
			border: 2px dashed #E4E7ED;
			border-radius: 4px;
		}
		
		
		.upload-box {
			img {
			    display: block;
			    width: 48px;
			    margin: auto;
				margin-top: 89px;
			}
			
			.el-upload__text {
			    font-size: 14px;
			    color: #3C4144;
			    letter-spacing: 0;
			    line-height: 20px;
			    font-weight: 500;
				margin-top: 14px;
				font-weight: bold;
				span{
					font-size: 14px;
					color: #8DCE6C;
					letter-spacing: 0;
					line-height: 20px;
					font-weight: 500;
				}
			}
		}
	}
	.jxbottom{
		margin-top: 13px;
		display: flex;
		align-items: center;
		justify-content: right;
		box-sizing: border;
		padding-right: 12px;
		span{
			margin-right: 5px;
			font-size: 12px;
		}
	}
</style>
