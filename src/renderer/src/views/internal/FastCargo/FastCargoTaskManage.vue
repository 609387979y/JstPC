<template>
  <JstCardLayout>
    <template #title>
        <div class="fast-cargo-card-title">抢舱任务管理</div>
    </template>
    <div class="page-search-form">
      <el-row>
        <el-col :span="6" class="page-search-form-item">
          <div class="page-search-form-lable">出发地</div>
          <div class="page-search-form-content">
            <el-input size="mini" v-model="state.search.porCityName"> </el-input>
          </div>
        </el-col>
        <el-col :span="6" class="page-search-form-item">
          <div class="page-search-form-lable">目的地</div>
          <div class="page-search-form-content">
            <el-input size="mini" v-model="state.search.fndCityName"> </el-input>
          </div>
        </el-col>
        <el-col :span="6" class="page-search-form-item">
          <div class="page-search-form-lable">箱型</div>
          <div class="page-search-form-content">
            <el-select v-model="state.search.containerType">
				<el-option label="20GP" value="20GP"></el-option>
				<el-option label="40GP" value="40GP"></el-option>
				<el-option label="40HQ" value="40HQ"></el-option>
			</el-select>
          </div>
        </el-col>
        <el-col :span="24" class="page-search-form-item">
          <div class="page-search-form-lable">开航日</div>
          <div class="page-search-form-content">
			<DateRange v-model:start="state.search.startTime" v-model:end="state.search.endTime"></DateRange>
          </div>
        </el-col>
        <el-col :span="24" class="page-search-form-item">
          <div class="page-search-form-lable">操作时间</div>
          <div class="page-search-form-content">
            <DateRange v-model:start="state.search.upStartTime" v-model:end="state.search.upEndTime" :datetype="2"></DateRange>
            <el-button size="mini" class="search-btn" color="#FF9809" type="primary" @click="search()"
              >查询</el-button
            >
            <span class="text-btn" @click="reset()">清空筛选条件</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-tabs
      class="cargo-tabs"
      v-model="cargoTabName"
      type="card"
    >
      <el-tab-pane label="COSCO 抢舱" name="1"></el-tab-pane>
      <el-tab-pane v-if="state.isApi" label="COSCO API" name="2"></el-tab-pane>
    </el-tabs>
    <div class="task-manage-bar">
      <div class="task-manage-btn" :class="state.search.runStatus==0?'active':''" @click="changestatus(0)">草稿箱</div>
      <div class="task-manage-btn" :class="state.search.runStatus==1?'active':''" @click="changestatus(1)">待运行</div>
      <div class="task-manage-btn" :class="state.search.runStatus==2?'active':''" @click="changestatus(2)">运行中</div>
      <div class="task-manage-btn" :class="state.search.runStatus==3?'active':''" @click="changestatus(3)">已截止</div>
    </div>
    <el-divider style="margin: 12px 0" />
    <JstPageTable full @change="getList" :data="data" :option="tableOption">
      <template #left>
        <el-button 
			size="mini" 
			style="width: 100px" 
			color="#FF9809" 
			type="primary"
			v-if="state.search.runStatus == 1"
			@click="runsubmit"
        >
			<el-icon style="margin-right: 4px" :size="16"><Clock /></el-icon>提交并运行
		</el-button>
		
		<el-button
			size="mini" 
			style="width: 100px" 
			color="#FF9809" 
			type="primary"
			v-if="state.search.runStatus == 2&&cargoTabName == '2'"
			@click="pauseclick"
		>
			<el-icon style="margin-right: 4px" :size="16"><VideoPause /></el-icon>截止订舱
		</el-button>
		
        <!-- <el-button 
			size="mini" 
			style="width: 80px"
			@click="copy(1,0)"
        >
			<el-icon style="margin-right: 4px" :size="16"><DocumentCopy /></el-icon>复制
		</el-button> -->
		<el-button
			size="mini" 
			style="width: 80px"
			@click="exportfile()"
			v-if="state.search.runStatus == 3"
		>
			<el-icon style="margin-right: 4px" :size="16"><Download /></el-icon>导出
		</el-button>
        <el-button 
			size="mini" 
			style="width: 80px" 
			v-if="state.search.runStatus <= 1"
			@click="del(1,0)"
        >
			<el-icon style="margin-right: 4px" :size="16"><Delete /></el-icon>删除
		</el-button>
      </template>
	  <el-table-column type="selection" width="35px" key="selection" />
      <el-table-column v-if="state.search.runStatus > 1" key="tablestatus" label="任务状态" min-width="100px">
		<template #default="scope">
			<span v-if="scope.row.taskStatus==1" class="grey">等待回执...</span>
			<span v-if="scope.row.taskStatus==2" class="orange tableicon"><el-icon><CaretRight /></el-icon>抢舱中</span>
			<!-- <span v-if="scope.row.taskStatus==4" class="green tableicon">抢舱成功 <el-icon><ArrowDown /></el-icon></span> -->
			<el-popover v-if="scope.row.taskStatus==4" :width="500" placement="bottom" trigger="click" popper-class="FC-popover">
			    <template #reference>
					<span class="green tableicon" @click="getinfo(scope.row.Id)">抢舱成功 <el-icon><ArrowDown /></el-icon></span>
			    </template>
				<div class="fctablebox">
					<el-table :data="state.infolist" :loading="state.fcloading">
						<el-table-column property="orderNumber" label="订单号" />
						<el-table-column property="orderStatus" label="订单状态" />
						<el-table-column property="submitDate" label="下单时间" />
					</el-table>
				</div>
			    
			</el-popover>
			<span v-if="scope.row.taskStatus==5" class="red">抢舱失败</span>
			<span v-if="scope.row.taskStatus==6" class="red">停止抢舱</span>
		</template>
	  </el-table-column>
      <el-table-column label="出发地" prop="porCityName" key="porCityName" min-width="150px">
		  <template #default="scope">
		  	{{ scope.row.porCityName?scope.row.porCityName:'-' }}
		  </template>
	  </el-table-column>
      <el-table-column label="目的港" prop="fndCityName" key="fndCityName" min-width="150px">
		  <template #default="scope">
		  	{{ scope.row.fndCityName?scope.row.fndCityName:'-' }}
		  </template>
	  </el-table-column>
      <el-table-column label="航线" prop="serviceCode" key="serviceCode" min-width="150px">
		  <template #default="scope">
		  	{{ scope.row.serviceCode?scope.row.serviceCode:'-' }}
		  </template>
	  </el-table-column>
      <el-table-column label="开航日" min-width="140px" key="startDate">
		  <template #default="scope">
			  <div>{{scope.row.startDate?scope.row.startDate.split(" ")[0]:'-'}}</div>
			  <div>{{scope.row.endDate?scope.row.endDate.split(" ")[0]:'-'}}</div>
		  </template>
	  </el-table-column>
      <el-table-column label="箱型/量" min-width="150px" key="containerType">
		<template #default="scope">
			<span v-if="scope.row.containerType">{{scope.row.containerType}}*{{scope.row.containerCount}}</span>
			<span v-else>-</span>
		</template>
	  </el-table-column> 
      <el-table-column label="指定产品" min-width="150px" v-if="cargoTabName == '2'" key="productId">
		  <template #default="scope">
		  	{{ scope.row.productId?'已选择产品':scope.row.vesselName?scope.row.vesselName+'/'+scope.row.voynoName:'-' }}
		  </template>
	  </el-table-column>
      <el-table-column label="运行时间" min-width="150px" key="startRunDate">
		  <template #default="scope">
		  	<div>{{scope.row.startRunDate?scope.row.startRunDate:'-'}}</div>
		  	<div>{{scope.row.endRunDate?scope.row.endRunDate:'-'}}</div>
		  </template>
	  </el-table-column>
      <el-table-column label="修改人" min-width="150px" key="UpdateEmployeeName">
		  <template #default="scope">
		  	{{ scope.row.UpdateEmployeeName }}
		  </template>
	  </el-table-column>
      <el-table-column label="修改时间" min-width="150px" key="UpdateTime">
		  <template #default="scope">
		  	<div>{{scope.row.UpdateTime}}</div>
		  </template>
	  </el-table-column>
      <el-table-column label="操作" fixed="right" key="caozuo" min-width="120px">
		  <template #default="scope">
			  <span v-if="state.search.runStatus <= 1" class="tablebtn black color1" @click="edit(scope.row.runStatus,scope.row)">编辑</span>
			  <span v-if="state.search.runStatus > 1" class="tablebtn orange color1" @click="view(scope.row)">查看</span>
			  <span class="tablebtn black color1" @click="copy(2,scope.row)">复制</span>
			  <span v-if="state.search.runStatus <= 1" @click="del(2,scope.row.Id)" class="tablebtn red">删除</span>
			  
		  </template>
	  </el-table-column>
    </JstPageTable>
  </JstCardLayout>
  <FastCargoEditTask ref="editbox" :showeditd="state.showdialog" @clear="cleardialog" @submit="submitclick"></FastCargoEditTask>
  <FastCargoWebEditTask ref="editwebbox" :showeditd="state.showwebdialog" @clear="clearwebdialog" @submit="submitclick"></FastCargoWebEditTask>
  <FastCargoViewTask ref="viewbox" :showviewd="state.showviewdialog" @clear="clearviewdialog"></FastCargoViewTask>
  
  
  <el-dialog
    custom-class="submit-dialog"
    v-model="state.submitDialog"
    width="486px"
    title="提交运行"
	@close="submitclose"
  >
    <div style="padding: 15px;">
      <div class="cost-table-title">运行任务清单</div>
      <div class="cost-table-head">
        <div class="cost-table-th">序号</div>
        <div class="cost-table-th">箱型箱量</div>
        <div class="cost-table-th">保证金</div>
      </div>
      <div class="cost-table-body">
        <div class="cost-table-tr" v-for="(item,index) in feelist">
          <div class="cost-table-td">{{index + 1}}</div>
          <div class="cost-table-td">
            <div>{{item.containerType}}*{{item.containerCount}}</div>
            <div><img src="@/assets/images/jst-hb.svg" alt="" />{{200*item.containerCount}}</div>
          </div>
        </div>
        <div class="cost-table-summary">
          <div class="cost-table-td">共计消费</div>
          <div class="cost-table-td">
            <img src="@/assets/images/jst-hb.svg" alt="" />{{allprice}}
          </div>
        </div>
      </div>
      <div class="describe-title">提示说明：</div>
      <div class="describe-describe">请谨慎核对箱型箱量数据，确认后将扣除相应抢舱保证金；抢舱成功，该保证金将作为抢舱服务费收取；抢舱失败，该保证金将会退还到您的账号余额。</div>
      <div class="mgt-16 txt-center">
        <el-button
          type="primary"
          style="width: 120px"
          color="#FF9809"
          @click="saveyx"
          >确认</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { defineComponent, ref,reactive,onMounted,onActivated,nextTick,toRaw,watch } from "vue";
import { getElectronAgent } from "@share/agent";
import { useCompanyCertification } from "@/composables/user/certification";
import { VideoPlay,VideoPause,DocumentCopy,Delete,Clock,CaretRight,ArrowDown,Download } from "@element-plus/icons";
import ApplicationEntryVue from "@/components/ApplicationEntry.vue";
import request from "@/public/request";
import { ElMessage,ElMessageBox  } from "element-plus";
import { useRoute,useRouter } from "vue-router";
import { utils, useTableOption } from "justom-share";
import FastCargoEditTask from "./components/FastCargoEditTask.vue";
import FastCargoWebEditTask from "./components/FastCargoWebEditTask.vue";
import FastCargoViewTask from "./components/FastCargoViewTask.vue";
import DateRange from "./components/DateRange.vue";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    ApplicationEntryVue,
    VideoPlay,
    VideoPause,
    DocumentCopy,
    Delete,
    Clock,
	CaretRight,
	ArrowDown,
	Download,
	FastCargoEditTask,
	FastCargoWebEditTask,
	FastCargoViewTask,
	DateRange
  },
  setup() {
    const agent = getElectronAgent();
    const certification = useCompanyCertification();
    const cargoTabName = ref("1");
	const Router = useRouter();
	const Route = useRoute();
	const store = useStore();
	const editbox = ref(null);
	const editwebbox = ref(null);
	const viewbox = ref(null);
	
	const state = reactive({
		search: {
			porCityName: '',
			fndCityName: '',
			containerType: '',
			startTime: '',
			endTime: '',
			upStartTime: '',
			upEndTime: '',
			runStatus: 0
		},
		infolist: [],
		fcloading: false,
		showdialog: false,
		showwebdialog: false,
		showviewdialog: false,
		submitDialog: false,
		isApi: false
	})
	
	
	
	const data = ref([]);
	
	const tableOption = useTableOption({
		selectFilter(item) {
			return item.Id
		}
	})
	
	if(Route.query.type){
		state.search.runStatus = Route.query.type;
	}
	
	
	
	// 获取抢舱列表
	async function getList(){
		tableOption.loading = true;
		
		let query = {
			Page: tableOption.page,
			Limit: tableOption.pageSize,
			porCityName: state.search.porCityName,
			fndCityName: state.search.fndCityName,
			containerType: state.search.containerType,
			startTime: state.search.startTime,
			endTime: state.search.endTime,
			upStartTime: state.search.upStartTime,
			upEndTime: state.search.upEndTime,
			runStatus: state.search.runStatus
		}
		let res = null;
		if(cargoTabName.value == '1'){
			res = await request.get("/api/RobShipCos/GetCusCosList", query);
		}
		if(cargoTabName.value == '2'){
			res = await request.get("/api/RobShipCosApi/GetCusCosApiList", query);
		}
		tableOption.total = res.Total;
		data.value = res.Rows;
		tableOption.loading = false;
	}
	
	// 查询
	function search(){
		tableOption.Page = 1;
		getList();
	}
	// 重置
	function reset(){
		state.search.porCityName = "";
		state.search.fndCityName = "";
		state.search.containerType = "";
		state.search.startTime = "";
		state.search.endTime = "";
		state.search.upStartTime = "";
		state.search.upEndTime = "";
	}
	
	// 切换状态
	function changestatus(i){
		if(i || i==0){
			state.search.runStatus = i;
		}
		getList();
	}
	// 删除类型判断
	function del(type,id){
		if(type == 1){
			if(tableOption.selected.length == 0){
				ElMessage.warning("请选择数据");
				return;
			}
			deltrue(tableOption.selected.join(","));
		}else{
			deltrue(id);
		}
	}
	// 删除
	function deltrue(id){
		ElMessageBox.confirm(
		    '确定删除吗?',
		    '提示',
		    {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning',
		    }
		  )
		    .then(async () => {
			  let res = null;
			  if(cargoTabName.value == '1'){
				res = await request.get('/api/RobShipCos/DeleteCos',{Id: id});
			  }else{
				res = await request.get('/api/RobShipCosApi/DeleteCosApi',{Id: id});
			  }
		      
			  if(res.Status){
				  ElMessage.success(res.Message);
				  getList();
			  }else{
				  ElMessage.warning(res.Message);
			  }
		    })
	}
	// 编辑
	function edit(type,row){
		let data = JSON.parse(JSON.stringify(toRaw(row)));
		if(cargoTabName.value == '1'){
			
			editwebbox.value.setdata(type,data);
			state.showwebdialog = true;
		}else{
			editbox.value.setdata(type,data);
			state.showdialog = true;
		}
		
		
	}
	// 复制
	function copy(type,row){
		if(type == 1){
			if(tableOption.selected.length != 1){
				ElMessage.warning("请选择一条数据");
				return;
			}
			let data = JSON.parse(JSON.stringify(toRaw(row)));
			if(cargoTabName.value == '1'){
			  editwebbox.value.setdata(3,data);
			  state.showwebdialog = true;
			}else{
			  editbox.value.setdata(3,data);
			  state.showdialog = true;
			}
			
			
		}else{
			let data = JSON.parse(JSON.stringify(toRaw(row)));
			if(cargoTabName.value == '1'){
			  editwebbox.value.setdata(3,data);
			  state.showwebdialog = true;
			}else{
			  editbox.value.setdata(3,data);
			  state.showdialog = true;
			}
		}
	}
	// 查看
	function view(row){
		let data = JSON.parse(JSON.stringify(toRaw(row)));
		viewbox.value.setdata(data,cargoTabName.value);
		state.showviewdialog = true;
	}
	// 导出
	async function exportfile(){
		if(tableOption.selected.length == 0){
			ElMessage.warning("请选择导出数据");
			return;
		}
		var ids = tableOption.selected.join(',');
		if(cargoTabName.value == '1'){
			agent.ipcRequest('fastCargo/downloadUrl',import.meta.env.VITE_AXIOS_HOST + '/api/RobShipCos/ExportSaveExcel?ids=' + ids);
		}else{	
			agent.ipcRequest('fastCargo/downloadUrl',import.meta.env.VITE_AXIOS_HOST + '/api/RobShipCosApi/ExportSaveExcel?ids=' + ids);
		}
		
		
	}
	// 获取抢舱详情
	async function getinfo(id){
		state.fcloading = true;
		let res = await request.get('/api/RobShipCosApi/GetCosApiInfo',{Id: id});
		state.infolist = res.orderList;
		state.fcloading = false;
	}
	
	// 截止任务
    function pauseclick(){
		if(tableOption.selected.length != 1){
			ElMessage.warning("请选择一条数据");
			return;
		}
		ElMessageBox.confirm(
		    '确定截止该任务吗?',
		    '提示',
		    {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning',
		    }
		  )
		    .then(async () => {
			  let res = null;
			  if(cargoTabName.value == '1'){
				res = await request.get('/api/RobShipCos/CutCos',{Id: tableOption.selected[0]});
			  }else{ 
				res = await request.get('/api/RobShipCosApi/CutCosApi',{Id: tableOption.selected[0]});
			  }
		      
			  if(res.Status){
				  ElMessage.success(res.Message);
				  getList();
			  }else{
				  ElMessage.warning(res.Message);
			  }
		    })
	}
	const feelist = ref([]);
	const allprice = ref(0);
	// 提交并运行
	function runsubmit(){
		if(tableOption.selected.length == 0){
			ElMessage.warning("请选择提交数据");
			return;
		}
		feelist.value = data.value.filter(x => {
			return tableOption.selected.includes(x.Id)
		})
		feelist.value.forEach(item => {
			allprice.value = allprice.value + (item.containerCount * 200);
		})
		state.submitDialog = true;
	}
	// 
	async function saveyx(){
		let res = null;
		if(cargoTabName.value == '1'){
			res = await request.get('/api/RobShipCos/BatchSubmitCos',{Ids: tableOption.selected.join(',')});
		}else{
			res = await request.get('/api/RobShipCosApi/BatchSubmitCosApi',{Ids: tableOption.selected.join(',')});
		}
		
		if(res.Status){
			ElMessage.success(res.Message);
			state.submitDialog = false;
			changestatus(2);
		}else{
			ElMessage.warning(res.Message);
		}
	}
	// 关闭弹窗
	function cleardialog(){
		state.showdialog = false;
	}
	function clearwebdialog(){
		state.showwebdialog = false;
	}
	function clearviewdialog(){
		state.showviewdialog = false;
	}
	// 
	function submitclose(){
		feelist.value = [];
		allprice.value = 0;
	}
	// 弹窗提交
	function submitclick(i){
		changestatus(i);
	}
	// 
	async function getapilist(){
		let res = await request.get('api/Code/GetList',{type: 'COSCO API 抢舱'});
		let arr = [];
		res.Data.Rows.forEach(item=>{
			if(item.Code == store.state.auth.employee.CompanyId){
				state.isApi = true;
			}
		})
	}
	
	onMounted(()=>{
		cargoTabName.value = '1';
		
		changestatus(0)
	})
	
	
	onActivated(async ()=>{
		getapilist();
		if(Route.query.type){
			cargoTabName.value = Route.query.type;
			changestatus(Route.query.status);
		}
		
	})
	
	watch(() => cargoTabName.value, (newValue, oldValue) => {
		tableOption.Page = 1;
	    changestatus();
	})
	
	
    return {
	  state,
      agent,
      certification,
      cargoTabName,
	  getList,
	  data,
	  tableOption,
	  search,
	  reset,
	  changestatus,
	  del,
	  edit,
	  copy,
	  view,
	  getinfo,
	  pauseclick,
	  exportfile,
	  cleardialog,
	  editbox,
	  editwebbox,
	  viewbox,
	  submitclick,
	  clearviewdialog,
	  clearwebdialog,
	  runsubmit,
	  feelist,
	  allprice,
	  submitclose,
	  saveyx,
	  getapilist
    };
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    back() {
      this.$router.back();
    },

    entry() {},
  },
  mounted() {},
});
</script>

<style lang="scss" scoped>
@import "./FastCargoStyle.scss";
$lable-width: 70px;
.page-search-form {
  padding: 8px;
  background: #f8f8f8;
  .page-search-form-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    .page-search-form-lable {
      width: $lable-width;
      text-align: end;
    }
    .page-search-form-content {
      display: flex;
      padding-left: 8px;
      width: calc(100% - $lable-width);
      :deep(.el-input__inner) {
        height: 24px !important;
        line-height: 24px !important;
      }
      :deep(.options .option) {
        height: 24px !important;
        line-height: 24px !important;
      }
      :deep(.mid) {
        height: 24px !important;
        line-height: 24px !important;
      }
      :deep(.choose) {
        border: 1px solid #ff9809;
        color: #ff9809;
      }
      :deep(.option:hover) {
        border: 1px solid #ff9809;
        color: #ff9809;
      }
      .text-btn {
        line-height: 24px !important;
        color: #ff9809;
        cursor: pointer;
        margin-left: 8px;
      }
      .search-btn {
        min-height: 24px;
        height: 24px;
        line-height: 0px;
        margin-left: 8px;
      }
    }
  }
}
.task-manage-bar {
  display: flex;
  .task-manage-btn {
    background: #f2f3f5;
    border: 1px solid #f2f3f5;
    border-radius: 2px;
    font-size: 12px;
    color: #3c4144;
    padding: 3px 8px;
    margin-left: 8px;
    cursor: pointer;
  }
  :hover {
    border: 1px solid #ff9809;
    background: #ffedd3;
  }
  .active {
    border: 1px solid #ff9809;
    background: #ffedd3;
  }
}
.cargo-tabs {
  margin-top: 8px;
  :deep(.el-tabs__item.is-active) {
    color: #ff9809;
  }
  :deep(.el-tabs__item:hover) {
    color: #ff9809;
  }
}
.fast-cargo-card-title{
  font-size: 14px;
  color: #3C4144;
  font-weight: 400;
}
.tablebtn{
	margin-right: 5px;
	cursor: pointer;
}
.color1{
	color: #FF9809;
}
.red{
	color: #FF5646;
}
.orange{
	color: #FF9809;
}
.green{
	color: #57C734;
	cursor: pointer;
}
.grey{
	color: rgba(0,0,0,0.45);
}
.tableicon{
	display: flex;
	align-items: center;
	i{
		margin: 0 4px;
	}
}

:deep(.app_page_table .el-table__header th){
	background-color: #FFEDD3!important;
	color: #3C4144;
	padding: 0;
}

:deep(.el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell){
	border-bottom: 1px solid #E4E7ED;
}
:deep(.el-table--border .el-table__cell){
	border-right: 1px solid #E4E7ED;
}
:deep(.el-table--group, .el-table--border){
	border: 1px solid #E4E7ED;
}

.fctablebox{
	width: 500px;
}
.cost-table-title {
  margin-top: -18px;
  margin-bottom:8px;
  font-size: 12px;
  color: #3C4144;
}
.cost-table-head {
  background: #f8f8f8;
  display: flex;
  :first-child {
    width: 20%;
  }
  :nth-child(2) {
    width: 60%;
  }
  :nth-child(3) {
    width: 20%;
	text-align: right;
  }
  .cost-table-th {
    padding: 8px;
  }
}
.cost-table-body {
  border-top: 1px solid #e4e7ed;
  border-left: 1px solid #e4e7ed;
}
.cost-table-tr {
  display: flex;
  :first-child {
    width: 20%;
  }
  :nth-child(2) {
    width: 80%;
    display: flex;
    justify-content: space-between;
    :first-child {
      width: 80%;
    }
    :nth-child(2) {
      width: 20%;
      display: flex;
      justify-content: end;
      align-items: center;
    }
  }
  img {
    width: 10px !important;
    height: 10px !important;
    margin-right:8px;
  }
  .cost-table-td {
    padding: 8px;
    border-right: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
  }
}
.cost-table-summary {
  display: flex;
  border-right: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  img {
    width: 20px!important;
    height: 20px!important;
    margin-right:8px;
  }
  :first-child {
    width: 80%;
  }
  :nth-child(2) {
    width: 20%;
    display: flex;
      justify-content: end;
      align-items: center;
  }
  .cost-table-td {
    padding: 8px;
  }
}

</style>
<style lang="scss">
	.el-message-box__btns{
		.el-button--primary{
			color: #606266;
		}
		.el-button:hover,.el-button:focus{
			color: #409eff;
		}
	}
	.FC-popover{
		background: #FFF1CB!important;
		padding: 1px!important;
		.el-table th.el-table__cell{
			background-color: #FFF1CB;
		}
		.el-table th.el-table__cell.is-leaf{
			border-bottom: 1px solid #FFF1CB;
		}
		.el-table td.el-table__cell{
			border-bottom: 1px solid #FFF1CB;
		}
		.el-popper__arrow::before{
			background: #FFF1CB!important;
		}
	}
	.submit-dialog{
		.el-dialog__body{
			padding: 0;
		}
	}
</style>

