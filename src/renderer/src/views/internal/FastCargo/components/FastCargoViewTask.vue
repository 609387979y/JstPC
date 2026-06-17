<template>
<div class="FastCargoEditTask" v-loading="state.dyxloading">
  <el-dialog v-model="showview" width="900px" top="50px" @close="cleardialog" :close-on-click-modal="false">
    <el-form ref="form1" :model="state.data" label-width="100px">
	  <div class="CT-top">
		<div class="main-title">
			<span v-if="state.data.taskStatus == 2" class="main-title-span orange">任务运行中<span class="circle"></span><span class="statustext">正在抢舱</span></span>
			<span v-if="state.data.taskStatus == 4" class="main-title-span green">任务已截止<span class="circle"></span><span class="statustext">抢舱成功</span></span>
			<span v-if="state.data.taskStatus == 5" class="main-title-span red">任务已截止<span class="circle"></span><span class="statustext">抢舱失败</span></span>
			<span v-if="state.data.taskStatus == 6" class="main-title-span red">任务已截止<span class="circle"></span><span class="statustext">停止抢舱</span></span>
		</div>
		<el-row style="margin-top: 16px">
		  <el-col :span="8">
		    <el-form-item label="船公司"><el-input v-model="shipname" readonly></el-input> </el-form-item>
		  </el-col>
		  <el-col :span="10">
		    <el-form-item label="关联账号">
				<el-input v-if="type == '2'" v-model="state.data.ApiKey" readonly></el-input>
				<el-input v-if="type == '1'" v-model="state.data.userName" readonly></el-input>
			</el-form-item>
		  </el-col>
		</el-row>
	  </div>
	  <el-divider style="margin: -4px 0 14px;box-shadow: 0 2px 3px 0 rgba(215,215,215,0.50);" />
	  
      <div class="CT-center">
		<div class="card-title">
		  <span class="color-bar"></span>
		  任务条件
		</div>
		<el-row>
		  <el-col :span="10">
			<el-form-item label="出发地">
				<el-input v-model="state.data.porCityName" readonly></el-input>
			</el-form-item>
		  </el-col>
		  <el-col :span="10">
			<el-form-item label="目的地">
				<el-input v-model="state.data.fndCityName" readonly></el-input>
			</el-form-item>
		</el-col>
		</el-row>
		<el-form-item label="开航日" prop="startDate">
		  <!-- <el-date-picker
		    v-model="khRange"
		    type="daterange"
		    range-separator="——"
		    start-placeholder="开始日期"
		    end-placeholder="结束日期"
			format="YYYY-MM-DD"
		    value-format="YYYY-MM-DD"
			readonly
		  /> -->
		  <el-date-picker
		    v-model="state.data.startDate"
		    type="date"
		    placeholder="开始日期"
		  	format="YYYY-MM-DD"
		  	value-format="YYYY-MM-DD"
		  	readonly
		  />
		  <span>至</span>
		  <el-date-picker
		    v-model="state.data.endDate"
		    type="date"
		    placeholder="结束日期"
		  	format="YYYY-MM-DD"
		  	value-format="YYYY-MM-DD"
			readonly
		  />
		</el-form-item>
		<el-form-item label="航线">
		  <div class="border-container">
			{{ state.data.serviceCode==""?'对所有航线进行抢舱':'对指定航线'+state.data.serviceCode+'进行抢舱' }}
		  </div>
		</el-form-item>
		
		<el-form-item label="指定产品">
		  <div class="border-container">
			  {{ state.data.productId?'对指定产品进行抢舱':state.data.vesselName?'对指定船名/航次'+state.data.vesselName+'/'+state.data.voynoName:'不指定/航次' }}
		  </div>
		  <el-table 
			border 
			style="margin: 8px 0" 
			:data="state.productlist"
			ref="producttable"
			v-if="state.data.productId"
		  >
		    <el-table-column label="出发地">
				<template #default="scope">
					{{scope.row.productPorCity}}
				</template>
			</el-table-column>
		    <el-table-column label="目的地">
				<template #default="scope">
					{{ scope.row.productFndCity}}
				</template>
			</el-table-column>
		    <el-table-column label="航线代码" prop="productServiceCode"></el-table-column>
		    <el-table-column label="船名/航次">
				<template #default="scope">
					{{ scope.row.productVesselName }} / {{ scope.row.productVoynoName }}
				</template>
			</el-table-column>
		    <el-table-column label="ETA" prop="productETA"></el-table-column>
		    <el-table-column label="ETD" prop="productETD"></el-table-column>
		  </el-table>
		  
		</el-form-item> 
		<el-form-item v-if="type == '1'" label="支付比例">
			<div class="border-container">
			  <!-- <el-radio-group v-model="lineType" class="ml-4">
			    <el-radio label="1" size="large">余额支付全款</el-radio>
			    <el-radio label="2" size="large">余额支付首付</el-radio>
			    <el-input size="mini" style="width: 100px" placeholder=""></el-input>
			  </el-radio-group> -->
			  {{ state.data.paytype?'对指定产品进行抢舱':state.data.vesselName?'对指定船名/航次'+state.data.vesselName+'/'+state.data.voynoName:'不指定/航次' }}
			</div>
		</el-form-item>
	  </div>
      
    </el-form>
    <el-form ref="form2" :model="state.data" label-width="100px">
	  <div class="CT-bottom">
		<div class="card-title">
		  <span class="color-bar"></span>
		  抢舱目标
		</div>
		<el-form-item label="箱型箱量">
			<el-input style="width: 117px;" v-model="state.data.containerType" readonly></el-input>
			<el-input style="width: 100px;margin-left: 15px;" v-model="state.data.containerCount" readonly></el-input>
		</el-form-item>
		<div class="card-title"  v-if="type == '2'">
		  <span class="color-bar"></span>
		  货物信息
		</div>
		<el-row  v-if="type == '2'">
		  <el-col :span="8">
		    <el-form-item label="货物名称">
				<el-input v-model="state.data.cargoInfoDesc" readonly></el-input>
			</el-form-item>
		  </el-col>
		  <el-col :span="8">
		    <el-form-item label="包装单位">
				<el-input v-model="state.data.cargoInfoPackageName" readonly></el-input>
			</el-form-item>
		  </el-col>
		  <el-col :span="4">
		    <el-form-item label="件数">
				<el-input v-model="state.data.cargoInfoQuantity" readonly></el-input>
			</el-form-item>
		  </el-col>
		  <el-col :span="4">
		    <el-form-item label="重量">
				<el-input v-model="state.data.cargoInfoWeight" readonly></el-input>
			</el-form-item>
		  </el-col>
		  <el-col :span="8">
		    <el-form-item label="体积">
				<el-input v-model="state.data.cargoInfoVolume" readonly></el-input>
			</el-form-item>
		  </el-col>
		  <el-col :span="16">
		    <el-form-item label="备注">
				<el-input v-model="state.data.cargoInfoRemarks" readonly></el-input>
			</el-form-item>
		  </el-col>
		</el-row>
		<div class="card-title" v-if="type == '2'">
		  <span class="color-bar"></span>
		  订舱联系人
		</div>
		<el-row  v-if="type == '2'">
		  <el-col :span="8">
		    <el-form-item label="姓名/企业">
				<el-input v-model="state.data.emergencyContactInfoName" readonly></el-input>
			</el-form-item>
		  </el-col>
		  <el-col :span="8">
		    <el-form-item label="联系邮箱">
				<el-input v-model="state.data.emergencyContactInfoEmail" readonly></el-input>
			</el-form-item>
		  </el-col>
		  <el-col :span="8">
		    <el-form-item label="联系客机">
				<el-input v-model="state.data.emergencyContactInfoMobile" readonly></el-input>
			</el-form-item>
		  </el-col>
		  <el-col :span="8">
		    <el-form-item label="联系手机">
				<el-input v-model="state.data.emergencyContactInfoPhone" readonly></el-input>
		    </el-form-item>
		  </el-col>
		  <el-col :span="16">
		    <el-form-item label="地址信息">
				<el-input v-model="state.data.emergencyContactInfoAddress" readonly></el-input>
			</el-form-item>
		  </el-col>
		</el-row>
		<div class="card-title">
		  <span class="color-bar"></span>
		  保价服务
		</div>
		<div class="check-row">
		  {{ state.data.includeInsurance?'需要COSCO提供的保价服务（金额USD 5 / Unit),成功后即入海运费;单证数量'+state.data.blQuantity+'票':'不需要COSCO提供的保价服务' }}
		</div>
		<div class="card-title">
		  <span class="color-bar"></span>
		  抢舱运行时间
		</div>
		<el-form-item label="运行起止时间" label-width="110px" prop="startRunDate">
		  <el-date-picker
		    v-model="state.data.startRunDate"
		    type="datetime"
		    placeholder="开始时间"
		  	format="YYYY-MM-DD HH:mm:ss"
		  	value-format="YYYY-MM-DD HH:mm:ss"
			readonly
		  />
		  <span>至</span>
		  <el-time-picker
		    v-model="state.data.endRunDate"
		    arrow-control
		    placeholder="结束时间"
		  	format="HH:mm:ss"
		  	value-format="HH:mm:ss"
			readonly
		  />
		</el-form-item>
	  </div>
      
    </el-form>
    <div class="footer-btns">
      <el-button size="mini" class="plainbtn" @click="cleardialog()">关闭</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive, toRaw,computed,watch,nextTick  } from "vue";
import { getElectronAgent } from "@share/agent";
import { useCompanyCertification } from "@/composables/user/certification";
import ApplicationEntryVue from "@/components/ApplicationEntry.vue";
import request from "@/public/request";
import { ElMessage } from "element-plus";
import { useRoute,useRouter } from "vue-router";
export default defineComponent({
  components: {
    ApplicationEntryVue
  },
  props:{
  	showviewd: {
  		type: Boolean,
  		default: false
  	},
  },
  setup(props,context) {
	const Route = useRoute();
	const Router = useRouter();
	  
    const agent = getElectronAgent();
    const certification = useCompanyCertification();
	
	const title = ref("");
	const type = ref('2');
	const runStatus = ref(0);
	
	const shipname = ref("COSCO-即刻订舱");
	
	const form1 = ref(null);
	const form2 = ref(null);
	const producttable = ref(null);
	const showview = ref(props.showviewd);
	
	
	const state = reactive({
		data: {
			Id: 0,
			ApiKey: '',
			ApiSecret: '',
			porCityId: '',
			porCityName: '',
			fndCityId: '',
			fndCityName: '',
			serviceCode: '',
			startDate: '',
			endDate: '',
			productId: '',
			vesselName: '',
			voynoName: '',
			containerType: '',
			containerCount: '',
			cargoInfoDesc: '',
			cargoInfoPackageType: '',
			cargoInfoPackageName: '',
			cargoInfoQuantity: '',
			cargoInfoWeight: '',
			cargoInfoVolume: '',
			cargoInfoRemarks: '',
			emergencyContactInfoName: '',
			emergencyContactInfoEmail: '',
			emergencyContactInfoMobile: '',
			emergencyContactInfoPhone: '',
			emergencyContactInfoAddress: '',
			includeInsurance: false,
			blQuantity: '',
			startRunDate: '',
			endRunDate: '',
			payRatio: ''
		},
		configlist: [],
		startcitylist: [],
		endcitylist: [],
		productlist: [],
		productselect: [],
		packgelist: [],
		linetype: '1',
		paytype: '1',
		producttype: '3',
		dyxloading: false,
		submitDialog: false
	})
	// 开航时间
	const khRange = computed({
		get: () => {
			return [state.data.startDate,state.data.endDate];
		},
		set: (val) => {
			
			if (val) {
				state.data.startDate = val[0];
				state.data.endDate = val[1];
			} else {
				state.data.startDate = "";
				state.data.endDate = "";
			}
		},
	});
	// 运行时间
	const yxRange = computed({
		get: () => {
			return [state.data.startRunDate,state.data.endRunDate];
		},
		set: (val) => {
			if (val) {
				state.data.startRunDate = val[0];
				state.data.endRunDate = val[1];
			} else {
				state.data.startRunDate = "";
				state.data.endRunDate = "";
			}
		},
	});
	
	
	// 获取数据
	function setdata(data,types){
		type.value = types;
		state.data = data;
		if(state.data.serviceCode){
			state.linetype = '2';
		}
		state.producttype = state.data.productId?'1':state.data.vesselName?'2':'3';
		if(state.data.productId){
			state.productlist = [{
				productPorCity: state.data.productPorCity?state.data.productPorCity:'',
				productFndCity: state.data.productFndCity?state.data.productFndCity:'',
				productServiceCode: state.data.productServiceCode?state.data.productServiceCode:'',
				productVesselName: state.data.productVesselName?state.data.productVesselName:'',
				productVoynoName: state.data.productVoynoName?state.data.productVoynoName:'',
				productETA: state.data.productETA?state.data.productETA:'',
				productETD: state.data.productETD?state.data.productETD:''
			}]
		}
		state.paytype = state.data.payRatio?'2':'1';
		state.data.includeInsurance = state.data.blQuantity?true:false;
		state.data.endRunDate = data.endRunDate.split(" ")[1];
	}
	
	// 重置弹窗
	function cleardialog(){
		context.emit('clear');
		state.data = {};
		state.productlist = [];
		state.productselect = [];
		state.linetype = '1';
		state.producttype = '3';
		state.dyxloading = false;
		state.submitDialog = false;
	}
	
	watch(props,(old,newProps)=>{
		showview.value = newProps.showviewd;
	})
	

	onMounted(async ()=>{

		// let data = await request.get("/api/RobShipCosApi/GetCosApiInfo",{Id: Route.query.id});
		// state.data = data;
		
	})
	
    return {
      agent,
      certification,

	  title,
	  shipname,
	  type,
	  state,

	  khRange,
	  yxRange,
	  form1,
	  form2,
	  producttable,
	  setdata,
	  showview,
	  cleardialog
    };
  },
  data() {

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
@import "../FastCargoStyle.scss";
.CT-top{
	box-sizing: border-box;
	padding: 0 16px;
	margin-top: -10px;
}
.CT-center,.CT-bottom{
	box-sizing: border-box;
	padding: 0 16px;
}
.main-title {
  font-size: 14px;
  line-height: 20px;
  color: #333333;
  .main-title-span{
	  display: flex;
	  align-items: center;
	  .circle{
		  width: 6px;
		  height: 6px;
		  border-radius: 3px;
		  margin: 0 6px 0 10px;
	  }
	  .statustext{
	  	font-size: 12px;
	  	letter-spacing: 0;
	  }
  }
  .orange{
  	.circle{
  		background: #ff9809;
  	}
	.statustext{
		color: #ff9809;
	}
  }
  .green{
  	.circle{
  		background: #34C759;
  	}
  	.statustext{
  		color: #34C759;
  	}
  }
  .red{
	 .circle{
	 	background: #EF4333;
	 }
	 .statustext{
	 	color: #EF4333;
	 } 
  }
}
.card-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #303133;
  font-weight: bold;
  margin: 12px 0;

  .color-bar {
    width: 4px;
    height: 14px;
    background: rgba(0,0,0,0.25);
    display: inline-block;
    margin-right: 8px;
  }
}
.check-row {
  display: flex;
  align-items: center;
  .check-item {
    margin-right: 8px;
    :deep(.el-checkbox__inner:hover) {
      border-color: #ff9809;
    }
    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
      border-color: #ff9809;
      background: #ff9809;
    }
    :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
      color: #ff9809;
    }
    :deep(.el-checkbox__input.is-focus .el-checkbox__inner) {
      border-color: #ff9809;
    }
  }
}
.footer-btns {
  text-align: center;
  margin-top: 30px;
  padding-bottom: 30px;
}
.border-container {
  border: 1px solid #e4e7ed;
  border-radius: 2px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  :deep(.el-radio) {
    height: 30px;
  }
  :deep(.el-radio-group) {
    line-height: 18px;
  }
  :deep(.el-input--mini .el-input__inner) {
    height: 24px;
  }
}
:deep(.el-radio__input.is-checked .el-radio__inner) {
  border-color: #ff9809;
  background: #ff9809;
}
:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #ff9809;
}
:deep(.el-radio__inner:hover) {
  border-color: #ff9809;
}
:deep(.el-radio-group) {
  display: flex;
  align-items: center;
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
.describe-title{
  font-size: 14px;
color: #969799;
line-height: 28px;
margin-top:12px;
}
.describe-describe{
  font-size: 12px;
color: #969799;
letter-spacing: 0;
line-height: 22px;
}
:deep(.el-card__body){
	padding: 0;
}
.plainbtn{
	min-width: 80px;
	border-color: #ff9809;
	color: #ff9809;
}
.plainbtn:hover{
	color: #FFFFFF;
}
.plainbtn:focus{
	color: #FFFFFF;
}
:deep(.el-dialog__body){
	padding: 0;
}
:deep(.el-input__inner:focus){
	border: 1px solid #dcdfe6;
}
</style>
