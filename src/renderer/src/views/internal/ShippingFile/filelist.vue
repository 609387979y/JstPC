<template>
	<div class="shippingfile container">
		<div class="header">
			<div class="left">
				<el-image
					class="leftimage"
					fit="contain"
					v-if="state.companymess.ShippingLogo"
					:src="state.companymess.ShippingLogo"
				></el-image>
				<el-image
					class="leftimage"
					fit="contain"
					v-else
					:src="defaultimg"
				>
				</el-image>
				<span class="name">{{state.companymess.ShippingName}} {{state.type == 1?'船期表':'船司保函'}}</span>
			</div>
			<div class="right" v-if="state.type == 1">
				<el-date-picker
				  value-format="YYYY"
				  format="YYYY 年"
				  v-model="state.query.year"
				  type="year"
				  placeholder="请选择年份"
				  @change="getlist(state.companymess)"
				  size="mini"
				  style="width: 110px;"
				  class="shipfliedate"
				>
				</el-date-picker>
				<span style="display: inline-block; width: 10px"></span>
				<el-select
				  @change="getlist(state.companymess)"
				  placeholder="请选择月份"
				  v-model="state.query.month"
				  size="mini"
				  style="width: 110px;"
				>
				  <el-option
				    v-for="item in months"
				    :key="item.value"
				    :label="item.label"
				    :value="item.value"
				  ></el-option>
				</el-select>
			</div>
		</div>
		<div class="main">
			<JstPageTable
				full
				:data="data"
				v-if="state.type==1"
			>
				<el-table-column prop="filename" label="文件名称">
					<template #default="scope">
						<div class="filenamebox">
							<img src="@/assets/images/excel.svg" />
							<span @click="downcqloadFile(scope.row)">{{scope.row.FileName}}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="belongdate" label="所属年月" width="130px">
					<template #default="scope">
						<span>{{scope.row.Year}}年{{scope.row.Month}}月</span>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="UpdateTime" label="上传时间" width="150px"></el-table-column>
				<el-table-column prop="CreateEmployeeName" label="上传人" width="150px"></el-table-column> -->
				<el-table-column prop="Remark" label="备注" width="150px"></el-table-column>
				<el-table-column prop="remark" label="操作" width="136px">
					<template #default="scope">
						<!-- <el-button type="text" @click="checkFile(scope.row)">查看</el-button> -->
						<el-button type="text" @click="downcqloadFile(scope.row)">下载</el-button>
					</template>
				</el-table-column>
			</JstPageTable>
			
			<JstPageTable
				full
				:data="data"
				v-if="state.type==2"
			>
				<el-table-column prop="filename" label="文件名称">
					<template #default="scope">
						<div class="filenamebox">
							<img src="@/assets/images/excel.svg" />
							<span @click="downcsloadFile(scope.row)">{{scope.row.FileName}}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="ConfirmTime" label="稽核时间" width="150px"></el-table-column>
				<!-- <el-table-column prop="UpdateTime" label="上传时间" width="150px"></el-table-column>
				<el-table-column prop="CreateEmployeeName" label="上传人" width="150px"></el-table-column> -->
				<el-table-column prop="Remark" label="备注" width="150px"></el-table-column>
				<el-table-column prop="remark" label="操作" width="136px">
					<template #default="scope">
						<!-- <el-button type="text" @click="checkFile(scope.row)">查看</el-button> -->
						<el-button type="text" @click="downcsloadFile(scope.row)">下载</el-button>
					</template>
				</el-table-column>
			</JstPageTable>
		</div>
	</div>
</template>

<script>
import {
    defineComponent,
    ref,
    reactive,
	onMounted,
	onActivated
} from "vue";
import { ElMessage } from "element-plus";
import { useRouter,useRoute } from "vue-router";
import { useTableOption } from "justom-share";
import request from "@/public/request";
import { getElectronAgent } from "@share/agent";

export default defineComponent({
	components: {
		
	},
	setup() {

		const router = useRouter();
		const route = useRoute();
		const data = ref([]);
		const agent = getElectronAgent();

		const state = reactive({
		  type: 1,
		  name: '',
		  query: {
		    year: "" + new Date().getFullYear(),
		    month: -1,
		  },
		  tableData: [],
		  tableOption: useTableOption({}),
		  companymess: {}
		});

		const defaultimg = ref("");
		const setdefaultimg = async() =>{
			let m = await import('@/assets/images/cs_defult.svg');
			defaultimg.value = m.default;
		}
		
		const months = [
		  { label: "全部月份", value: -1 },
		  { label: "一月", value: 1 },
		  { label: "二月", value: 2 },
		  { label: "三月", value: 3 },
		  { label: "四月", value: 4 },
		  { label: "五月", value: 5 },
		  { label: "六月", value: 6 },
		  { label: "七月", value: 7 },
		  { label: "八月", value: 8 },
		  { label: "九月", value: 9 },
		  { label: "十月", value: 10 },
		  { label: "十一月", value: 11 },
		  { label: "十二月", value: 12 },
		];
		
		async function getlist(val) {
			if(state.type == 1){
				let res = await request.get('/api/MhShippingDate/GetShippingDateDetail',{
					Page: -1,
					Limit: 15,
					shippingDateId: val.Id,
					year: state.query.year,
					month: state.query.month
				})
				data.value = res.Rows;
			}else{
				let res = await request.get('/api/MhGuarantee/GetGuaranteeDetail',{
					Page: -1,
					Limit: 15,
					GuaranteeId: val.Id
				})
				data.value = res.Rows;
			}
		}
		
		// 下载保函文件
		async function downcsloadFile(row) {
		  agent.ipcRequest('window/downloadUrl',import.meta.env.VITE_AXIOS_HOST + '/api/MhGuarantee/DownUpFile?guid=' + row.guid);
		}
		
		// 下载船期文件
		async function downcqloadFile(row) {
		  agent.ipcRequest('window/downloadUrl',import.meta.env.VITE_AXIOS_HOST + '/api/MhShippingDate/DownUpFile?guid=' + row.guid);  
		}
		
		// 打开office预览页
		async function checkFile(row) {
		  const parseUrl = "http://view.officeapps.live.com/op/view.aspx?src=";
		  let host = "";
		  
		  if (import.meta.env.MODE == "development") {
		    host = import.meta.env.VITE_AXIOS_HOST;
		  } else {
		    //正式生产环境取当前url
		    host = window.location.href.match(/^http[s]?:\/\/[a-zA-Z0-9._-]*/)[0];
		  }
		  
		  if (host[host.length - 1] != "/") {
		    host += "/";
		  }
		  
		  const url = `api/MhGuarantee/DownUpFile?guid=${
		    row.guid
		  }&t=${new Date().getTime()}`;
		  const final = parseUrl + encodeURI(host + url);
		  if(row.FileName.search('.pdf')!='-1'){
		    openFdf(url)
		  }else if(row.FileName.search('.jpg')!='-1'||row.FileName.search('.jpeg')!='-1' ||row.FileName.search('.png')!='-1'){
		    openImage(encodeURI(host + url))
		  }else{
		    window.open(final)
		  }
		}
		
		onMounted(async ()=>{
			setdefaultimg();
		})
		onActivated(async ()=>{
			state.type = route.query.type;
			state.companymess = JSON.parse(route.query.item);
			getlist(state.companymess);
		});
		return{
			state,
			defaultimg,
			setdefaultimg,
			months,
			data,
			getlist,
			downcqloadFile,
			downcsloadFile,
			checkFile
		}
	}
})
</script>

<style lang="scss" scoped>
.container{
	min-width: 1100px;
	background: #FFFFFF;
	border: 1px solid #E7E7E7;
}
.header{
	border-bottom: 1px solid #E4E7ED;
	box-sizing: border-box;
	padding: 0 24px;
	display: flex;
	position: relative;
	height: 55px;
	justify-content: space-between;
	
	.left{
		display: flex;
		align-items: center;
		.leftimage{
			width: 28px;
			height: 28px;
			margin-right: 8px;
		}
		.name{
			font-size: 16px;
			color: rgba(0,0,0,0.85);
			line-height: 22px;
			font-weight: bold;
		}
	}
	.right{
		display: flex;
		align-items: center;
	}
}
.main{
	box-sizing: border-box;
	padding: 24px;
}
.shippingfile{
	:deep(.el-button--text){
		color: #409EFF;
	}
	:deep(.el-pagination.is-background .el-pager li:not(.disabled).active){
		background: #409EFF;
	}
	:deep(.el-year-table td.current:not(.disabled) .cell){
		color: #409EFF;
	}
	:deep(.el-select-dropdown__item.selected){
		color: #409EFF;
	}
}
.filenamebox{
	display: flex;
	align-items: center;
	img{
		margin-right: 4px;
	}
	span{
		font-size: 14px;
		color: #606266;
		letter-spacing: -1px;
		cursor: pointer;
	}
	span:hover{
		color: #409EFF;
	}
}
</style>
<style lang="scss">
	.el-select-dropdown__item.selected{
		color: #409EFF;
	}
	.el-year-table td.current:not(.disabled) .cell {
	    color: #409EFF;
	}
	.el-select .el-input.is-focus .el-input__inner {
	    border-color: #409EFF;
	}
	.el-input__inner:focus {
	    outline: 0;
	    border-color: #409EFF;
	}
	.el-year-table td .cell:hover {
	    color: #409EFF;
	}
	.el-date-picker__header-label:hover {
	    color: #409EFF;
	}
</style>