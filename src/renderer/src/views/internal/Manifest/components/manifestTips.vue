<template>
	<div class="tips" :class="tiptype=='error'?'error':'warning'">
		<div class="title">
			<el-icon :color="tiptype=='error'?'#F53206':'#FD953E'" size="12px"><info-filled /></el-icon>
			<!-- <i class="el-icon-warning"></i> -->
			<span v-if="title!=''">{{title}}</span>
		</div>
		<div class="content" :class="{'unhidden': show,'hidden': !show,'contentbig': title==''}" v-html="content"></div>
		<div v-if="!hidebtn" class="btn" :class="show?'active':''" @click="show = !show">{{!show?'展开':'收起'}}<el-icon><ArrowDown /></el-icon></div>
		<!-- <div class="btn" v-else @click="show = false">收起<el-icon><ArrowUp /></el-icon></div> -->
	</div>
</template>

<script>
import { InfoFilled,ArrowDown,ArrowUp } from "@element-plus/icons";
export default {
	props: {
		tiptype: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		content: {
			type: String,
			default: ''
		},
		hidebtn: {
			type: Boolean,
			default: false
		}
	},
	components: {
		InfoFilled,
		ArrowDown,
		ArrowUp
	},
	data() {
		return {
			show: false
		};
	},
	methods: {
		
	},
	mounted() {
		
	}
}
</script>

<style lang='scss' scoped>
	.tips{
		padding: 11px 10px 11px 16px;
		border-radius: 2px;
		display: flex;
		margin-bottom: 8px;
		
		.title{
			height: 22px;
			display: flex;
			align-items: center;
			i{
				margin-right: 5px;
			}
			span{
				display: inline-block;
				width: 112px;
			}
		}
		.content{
			width: calc(100% - 184px);
			line-height: 22px;
			transition: max-height .3s;
		}
		.contentbig{
			width: calc(100% - 72px);
		}
		.hidden{
			overflow: hidden;
			max-height: 22px;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.unhidden{
			overflow: hidden;
			max-height: 100px;
			text-overflow: ellipsis;
		}
		.btn{
			width: 62px;
			height: 22px;
			color: #8DCE6C;
			letter-spacing: 0;
			display: flex;
			align-items: center;
			cursor: pointer;
			justify-content: flex-end;
			
			i{
				margin-left: 4px;
				transition: transform .3s;
			}
		}
		.active{
			i{
				transform: rotate(-180deg);
			}
		}
	}
	.error{
		background: #FFEEEE;
		
		.title{
			span{
				color: #F53206;
				letter-spacing: 0;
			}
		}
	}
	.warning{
		background: #FDF6ED;
		
		.title{
			span{
				color: #FD953E;
				letter-spacing: 0;
			}
		}
	}
</style>
