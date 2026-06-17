<template>
	<div class="form">
		<el-form :label-width="labelWidth" size="small" ref="form">
			<slot></slot>
		</el-form>
		<div>
		      <el-button type="primary" class="searchbtn" @click="submit" size="mini">查询</el-button>
		      <el-button type="text" v-show="!hideClean" class="clean" @click="reset">清空筛选条件</el-button>
		</div>
	</div>
</template>

<script>
import { InfoFilled,ArrowDown,ArrowUp } from "@element-plus/icons";
export default {
	props: {
		// 在清空筛选条件后提交
		submitAfterReset: {
		  type: Boolean,
		  default: false
		},
		"labelWidth":{
		  type: String,
		  default: "100px"
		}
	},
	components: {
		InfoFilled,
		ArrowDown,
		ArrowUp
	},
	data() {
		return {
			
		};
	},
	methods: {
		submit() {
		  this.$emit("submit");
		},
		reset() {
		  this.$emit("reset");
		  if (this.submitAfterReset) {
		    this.$emit("submit");
		  }
		}
	},
	mounted() {
		
	}
}
</script>

<style lang='scss' scoped>
	.form {
	  padding: 15px;
	  background-color: #f8f8f8;
	  height: auto;
	  
	  :deep(.el-form-item__label){
		  font-size: 12px;
	  }
	}
	.clean {
	  margin-left: 15px;
	  color: #67C23A;
	  		&:hover{
			opacity: 0.7;
		}
	}
	.searchbtn{
		background: #8dce6c;
		border-color: #8dce6c;
		&:hover{
			opacity: 0.7;
		}
	}
	.collapse{
	  transition: all 0.5s ease;
	}
	.rotate{
	  // transition: all 0.5s ease;
	  transform:rotate(-180deg);
	}
</style>
