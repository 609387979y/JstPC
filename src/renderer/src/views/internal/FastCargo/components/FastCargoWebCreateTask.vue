<template>
<div class="FastCargoCreateTask" v-loading="state.dyxloading">
  <el-dialog v-model="showcreate" width="900px" top="50px" @close="cleardialog">
    <el-form ref="form1" :model="state.data" :rules="form1rules" label-width="100px">
	  <div class="CT-top">
		<div class="main-title">新建COSCO Web订舱</div>
		<el-row style="margin-top: 16px">
		  <el-col :span="8">
		    <el-form-item label="船公司"><el-input v-model="shipname" readonly></el-input> </el-form-item>
		  </el-col>
		  <el-col :span="8">
		    <el-form-item label="关联账号" prop="userName">
				<el-select v-model="state.data.userName" @change="glselect">
					<el-option v-for="item in state.configlist" :label="item.userName" :value="item.userName"></el-option>
				</el-select>
			</el-form-item>
		  </el-col>
		  <el-col :span="8">
			  <el-button size="mini" class="plainbtn configbtn" @click="state.setAccountDialog = true">配置账号</el-button>
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
			<el-form-item label="出发地" prop="porCityId">
				<el-select-v2 v-model="state.data.porCityId"
					:options="state.startcitylist" placeholder="请选择出发地"
					:loading="state.listLoading" filterable clearable remote
					:remote-method="querySearch.porSearch" @change="porselect">
					<template #default="{ item }">
						<span class="select-lable">{{ item.label }}</span>
					</template>
				</el-select-v2>
			</el-form-item>
		  </el-col>
		  <el-col :span="10">
			<el-form-item label="目的地" prop="fndCityId">
				<el-select-v2 v-model="state.data.fndCityId"
					:options="state.endcitylist" placeholder="请选择出发地"
					:loading="state.listLoading" filterable clearable remote
					:remote-method="querySearch.fndSearch" @change="fndselect">
					<template #default="{ item }">
						<span class="select-lable">{{ item.label }}</span>
					</template>
				</el-select-v2>
			</el-form-item>
		</el-col>
		</el-row>
		<el-form-item label="开航日" prop="startDate">
		  <el-date-picker
		    v-model="state.data.startDate"
		    type="date"
		    placeholder="开始日期"
			format="YYYY-MM-DD"
			value-format="YYYY-MM-DD"
			popper-class="FCdatepicker"
			:disabled-date="disabledDate"
		  />
		  <span>至</span>
		  <el-date-picker
		    v-model="state.data.endDate"
		    type="date"
		    placeholder="结束日期"
		  	format="YYYY-MM-DD"
		  	value-format="YYYY-MM-DD"
			popper-class="FCdatepicker"
			:disabled-date="disabledDate2"
		  />
		</el-form-item>
		<el-form-item label="航线">
		  <div class="border-container">
		    <el-radio-group v-model="state.linetype" class="ml-4">
		      <el-radio label="1" size="large">对所有航线进行抢舱</el-radio>
		      <el-radio label="2" size="large">对指定航线</el-radio>
		    </el-radio-group>
		    <el-input 
			  size="mini"
			  v-model="state.data.serviceCode"
			  :disabled="state.linetype=='1'?true:false" 
			  style="width: 100px; margin: 0 8px"
			  @input="toUpValue(1)"
			>
			</el-input>进行抢舱
		  </div>
		</el-form-item>
		
		<el-form-item label="指定产品">
		  <div class="border-container">
		    <el-radio-group v-model="state.producttype" class="ml-4">
		      <el-radio label="2" size="large">对指定船名/航次</el-radio>
		
		      <el-input
		        size="mini"
		        style="width: 100px; margin: 0 8px;margin-left: -20px;"
		        placeholder="请输入船名"
				v-model="state.data.vesselName"
				:disabled="state.producttype=='2'?false:true"
				@input="toUpValue(2)"
		      ></el-input>
		      <el-input
		        size="mini"
		        style="width: 100px;margin-right: 20px;"
		        placeholder="请输入航次"
				v-model="state.data.voynoName" 
				:disabled="state.producttype=='2'?false:true"
				@input="toUpValue(3)"
		      ></el-input>
		      进行抢舱
		      <el-radio label="3" size="large">不指定/航次</el-radio>
		    </el-radio-group>
		  </div>
		  
		</el-form-item>
		
		<el-form-item label="支付比例">
		  <div class="border-container">
		    <el-radio-group v-model="state.paytype" class="ml-4">
		      <el-radio label="1" size="large">余额支付全款</el-radio>
		      <el-radio label="2" size="large">余额支付首付</el-radio>
		    </el-radio-group>
		    <el-input size="mini" type="number" v-model="state.data.payRatio" :disabled="state.paytype=='1'?true:false" style="width: 150px; margin: 0 8px">
				<template #append>%</template>
			</el-input>
		  </div>
		</el-form-item>
	  </div>
	  <div class="CT-bottom">
		<div class="card-title">
		  <span class="color-bar"></span>
		  抢舱目标
		</div>
		<el-form-item label="箱型箱量" prop="containerType">
			<el-select v-model="state.data.containerType" style="width: 117px;" clearable @blur="jyxx" @change="xxselect">
				<el-option label="20GP" value="20GP"></el-option>
				<el-option label="40GP" value="40GP"></el-option>
				<el-option label="40HQ" value="40HQ"></el-option>
			</el-select>
			<el-input type="number" style="width: 100px;margin-left: 15px;" v-model="state.data.containerCount"></el-input>
		</el-form-item>
		
		<div class="card-title">
		  <span class="color-bar"></span>
		  保价服务
		</div>
		<div class="check-row">
		  <el-checkbox
		    class="check-item"
		    v-model="state.data.includeInsurance"
		    label="需要COSCO提供的保价服务（金额USD 5 / Unit),成功后即入海运费;"
		    size="large"
		  />
		  <div>单证数量 <el-input :disabled="state.data.includeInsurance?false:true" style="width: 100px" v-model="state.data.blQuantity"></el-input>票。</div>
		</div>
		<div class="card-title">
		  <span class="color-bar"></span>
		  抢舱运行时间
		</div>
		<AppWarningBox class="warningbox"><span style="color: #FF9809;">温馨提示: 运行时间建议不超过<span style="color: #FB4800">5</span>分钟,时间过长将会有被封号危险</span></AppWarningBox>
		<el-form-item label="运行起止时间" label-width="110px" prop="startRunDate">
		  <el-date-picker
		    v-model="state.data.startRunDate"
		    type="datetime"
		    placeholder="开始时间"
		  	format="YYYY-MM-DD HH:mm:ss"
		  	value-format="YYYY-MM-DD HH:mm:ss"
			popper-class="FCdatepicker"
			:disabled-date="disabledDate3"
			@change="checkTime"
		  />
		  <span>至</span>
		  <el-time-picker
		    v-model="state.data.endRunDate"
		    placeholder="结束时间"
			format="HH:mm:ss"
			value-format="HH:mm:ss"
			popper-class="FCdatepicker"
		  />
		</el-form-item>
	  </div>
      
    </el-form>
	<div class="footer-btns">
		
		<el-button size="mini" class="plainbtn" @click="savedrafts()">
		  <el-icon style="margin-right: 4px" :size="16"><Folder /></el-icon>保存草稿箱
		</el-button>
		
		<el-button 
		  size="mini" 
		  class="plainbtn" 
		  @click="savedyx" 
		>
			<el-icon style="margin-right: 4px" :size="16"><Clock /></el-icon>存入待运行
		</el-button>
		<el-button 
		  size="mini" 
		  @click="tjyx" 
		  style="width: 100px"
		  color="#FF9809" 
		  type="primary"
		>
			<el-icon style="margin-right: 4px" :size="16"><Position /></el-icon>提交并运行
		</el-button>
		
	</div>
  </el-dialog>
  <el-dialog
    custom-class="submit-dialog"
    v-model="state.submitDialog"
    width="486px"
    title="提交运行"
  >
    <div style="padding: 15px;">
      <div class="cost-table-title">运行任务清单</div>
      <div class="cost-table-head">
        <div class="cost-table-th">序号</div>
        <div class="cost-table-th">箱型箱量</div>
        <div class="cost-table-th">保证金</div>
      </div>
      <div class="cost-table-body">
        <div class="cost-table-tr">
          <div class="cost-table-td">1</div>
          <div class="cost-table-td">
            <div>{{state.data.containerType}}*{{state.data.containerCount}}</div>
            <div><img src="@/assets/images/jst-hb.svg" alt="" />{{200*state.data.containerCount}}</div>
          </div>
        </div>
        <div class="cost-table-summary">
          <div class="cost-table-td">共计消费</div>
          <div class="cost-table-td">
            <img src="@/assets/images/jst-hb.svg" alt="" />{{200*state.data.containerCount}}
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
  
  <el-dialog
    custom-class="jst-set-account-dialog"
    v-model="state.setAccountDialog"
    width="486px"
    title="配置账号"
	@close="setAccountClose"
  >
  
    <div style="text-align: center;padding:0 40px;">
      <el-form 
  	    ref="CoscoConfigFormRef"
  		:model="CoscoConfigForm"
  	    :rules="CoscoConfigRules"
  		label-width="100px"
  	  >
        <el-form-item label="船公司">
          <el-input disabled v-model="CoscoConfigForm.CompantName"></el-input>
        </el-form-item>
        <el-form-item label="用途">
          <el-input disabled v-model="CoscoConfigForm.UseType"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="userName">
          <el-input v-model="CoscoConfigForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="userPassword">
          <el-input v-model="CoscoConfigForm.userPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="支付密码" prop="payPassword">
          <el-input v-model="CoscoConfigForm.payPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div class="mgt-16">
        <el-button
          type="primary"
          style="width: 120px;margin-bottom: 15px;"
          color="#FF9809"
          @click="CoscoConfigSave"
          >确定</el-button
        >
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive, toRaw,computed,watch,nextTick } from "vue";
import { getElectronAgent } from "@share/agent";
import { useCompanyCertification } from "@/composables/user/certification";
import { VideoPlay,VideoPause,DocumentCopy,Folder,Clock,Position,Right,Back } from "@element-plus/icons";
import ApplicationEntryVue from "@/components/ApplicationEntry.vue";
import request from "@/public/request";
import { ElMessage } from "element-plus";
import { useRoute,useRouter } from "vue-router";
import AppWarningBox from "@/components/AppWarningBox.vue";
export default defineComponent({
  components: {
    ApplicationEntryVue,
    VideoPlay,
    VideoPause, 
    Folder,
    Clock,
    Position,
	Right,
	Back,
	AppWarningBox
  },
  props:{
	showcreated: {
		type: Boolean,
		default: false
	},
  },
  setup(props,context) {
	const Route = useRoute();
	const Router = useRouter();
	  
    const agent = getElectronAgent();
    const certification = useCompanyCertification();
    const startDate = ref();
    const endDate = ref();
    const cargoTabName = ref("0");
	
	const shipname = ref("COSCO-即刻订舱");
	
	const form1 = ref(null);
	const form2 = ref(null);
	const showcreate = ref(props.showcreated);
	const producttable = ref(null);
	
	//
	const validatexxxl = (rule, value, callback) => {
	  if (state.data.containerCount == '') {
	    callback(new Error('请输入箱量'))
	  } else {
	    callback()
	  }
	}
	const validateRunTime = (rule, value, callback) => {
	  if (!state.data.startRunDate || !state.data.endRunDate) {
	    callback(new Error('请选择抢舱运行时间'))
	  } else {
	    callback()
	  }
	}

	// 
	const form1rules = reactive({
		userName: [
		  { required: true, message: '请选择关联账号', trigger: 'blur' },
		],
		porCityId: [
		  { required: true, message: '请选择出发地', trigger: 'blur' },
		],
		fndCityId: [
		  { required: true, message: '请选择目的地', trigger: 'blur' },
		],
		startDate: [
		  { required: true, message: '请选择开航日', trigger: 'blur' },
		],
		containerType: [
		  { required: true, message: '请选择箱型', trigger: 'blur' },
		  { validator: validatexxxl, trigger: 'blur' }
		],
		startRunDate: [
		  { required: true, message: '请选择抢舱运行时间', trigger: 'blur' },
		  { validator: validateRunTime, trigger: 'change' }
		]
	})
	
	
	const state = reactive({
		data: {
			Id: 0,
			userName: '',
			userPassword: '',
			payPassword: '',
			porCityId: '',
			porCityName: '',
			fndCityId: '',
			fndCityName: '',
			serviceCode: '',
			startDate: null,
			endDate: null,
			vesselName: '',
			voynoName: '',
			containerType: '',
			containerCount: '',
			includeInsurance: true,
			blQuantity: '1',
			startRunDate: null,
			endRunDate: null,
			payRatio: ''
		},
		configlist: [],
		startcitylist: [],
		endcitylist: [],
		listLoading: false,
		linetype: '1',
		paytype: '1',
		producttype: '3',
		dyxloading: false,
		submitDialog: false,
		setAccountDialog: false
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
	
	// 获取关联账号
	async function getCosConfig(){
		let res = await request.get("/api/RobShipCosConfig/GetCosCompanyConfig");
		state.configlist = res;
	}
	// 关联账号选择
	function glselect(val){
		let arr = state.configlist.filter((x)=>{
			return x.userName == val;
		})
	    state.data.userPassword = arr[0].userPassword;
		state.data.payPassword = arr[0].payPassword;
	}
	const querySearch = {
		// 获取出发地
		porSearch: function(PortName) {
			PortName = PortName ? PortName : "";
			state.listLoading = true;
			request.get("/api/RobShipCosBase/GetCityList", {
				keyword: PortName
			}).then((res) => {
				state.startcitylist = res.Data.map((item) => ({
					value: item.city_id,
					label: item.city_name
				}));
				state.listLoading = false;
			});
		},
		// 获取目的地
		fndSearch: function(PortName) {
			PortName = PortName ? PortName : "";
			state.listLoading = true;
			request.get("/api/RobShipCosBase/GetCityList", {
				keyword: PortName
			}).then((res) => {
				state.endcitylist = res.Data.map((item) => ({
					value: item.city_id,
					label: item.city_name
				}));
				state.listLoading = false;
			});
		}
	};
	// 出发地选择
	function porselect(val){
		let arr = state.startcitylist.filter((x)=>{
			return x.value == val;
		})
		if(arr.length>0){
			state.data.porCityName = arr[0].label;
		}
		jypor();
	}
	// 目的地选择
	function fndselect(val){
		
		let arr = state.endcitylist.filter((x)=>{
			return x.value == val;
		})
		if(arr.length>0){
			state.data.fndCityName = arr[0].label;
		}
		jyfnd();
	}
	
	// 出发地校验
	function jypor(){
		form1.value.validateField('porCityId',(val)=>{})
	}
	// 出发地校验
	function jyfnd(){
		form1.value.validateField('fndCityId',(val)=>{})
	}
	// 箱型箱量校验
	function jyxx(){
		form1.value.validateField('containerType',(val)=>{})
	}
	// 箱型选择
	function xxselect(val){
		jyxx();
	}
	
	
	// 保存草稿箱
	async function savedrafts(){
		let data = JSON.parse(JSON.stringify(state.data));
		data.includeInsurance = data.includeInsurance?1:0;
		
		if(data.endRunDate && data.startRunDate){
			data.endRunDate = data.startRunDate.split(' ')[0] + " " + data.endRunDate;
		};
		let res = await request.post('/api/RobShipCos/SaveTempCos',data);
		if(res.Status){
			ElMessage.success("成功");
			setTimeout(()=>{
				state.dyxloading = false;
				Router.push({
					path: '/fastCargo/fastCargoTaskManage',
					query: {
						type: 1,
						status: 0
					}
				})
			},200)
		}else{
			ElMessage.warning(res.Message);
		}
	}
	
	// 存入待运行
	function savedyx(){
		form1.value.validate(async (valid, fields) => {
			if(valid){
				if(state.linetype == '2'&&state.data.serviceCode == ""){
					ElMessage.warning("请输入航线代码");
					return;
				}
				if(state.producttype == '2'&&state.data.vesselName == ''){
					ElMessage.warning("请输入船名");
					return;
				}
				if(state.producttype == '2'&&state.data.voynoName == ''){
					ElMessage.warning("请输入航线");
					return;
				}
				if(state.paytype == '2'&&state.data.payRatio == ''){
					ElMessage.warning("请输入支付首付比例");
					return;
				}
				if(state.data.includeInsurance&&state.data.blQuantity == ""){
					ElMessage.warning("请输入单证数量");
					return;
				}
				
				state.dyxloading = true;
				let data = JSON.parse(JSON.stringify(state.data));
				data.includeInsurance = data.includeInsurance?1:0;
				
				data.endRunDate = data.startRunDate.split(' ')[0] + " " + data.endRunDate;
				
				let res = await request.post('/api/RobShipCos/SaveCos',data);
				if(res.Status){
					ElMessage.success("成功");
					setTimeout(()=>{
						state.dyxloading = false;
						Router.push({
							path: '/fastCargo/fastCargoTaskManage',
							query: {
								type: 1,
								status: 1
							}
						})
					},200)
				}else{
					state.dyxloading = false;
					ElMessage.warning(res.Message);
				}
			}	
		})
	}
	
	// 提交运行
	function tjyx(){
		form1.value.validate(async (valid, fields) => {
			if(valid){
				if(state.linetype == '2'&&state.data.serviceCode == ""){
					ElMessage.warning("请输入航线代码");
					return;
				}
				if(state.producttype == '2'&&state.data.vesselName == ''){
					ElMessage.warning("请输入船名");
					return;
				}
				if(state.producttype == '2'&&state.data.voynoName == ''){
					ElMessage.warning("请输入航线");
					return;
				}
				if(state.paytype == '2'&&state.data.payRatio == ''){
					ElMessage.warning("请输入支付首付比例");
					return;
				}
				if(state.data.includeInsurance&&state.data.blQuantity == ""){
					ElMessage.warning("请输入单证数量");
					return;
				}
				if(state.data.includeInsurance&&state.data.blQuantity == ""){
					ElMessage.warning("请输入单证数量");
					return;
				}
				state.submitDialog = true;
			}	
		})
	}
	async function saveyx(){
		let data = JSON.parse(JSON.stringify(state.data));
		data.includeInsurance = data.includeInsurance?1:0;
		
		data.endRunDate = data.startRunDate.split(' ')[0] + " " + data.endRunDate;
		
		let res = await request.post("/api/RobShipCos/SubmitCos",data);
		if(res.Status){
			ElMessage.success("成功");
			setTimeout(()=>{
				state.dyxloading = false;
				Router.push({
					path: '/fastCargo/fastCargoTaskManage',
					query: {
						type: 1,
						status: 2
					}
				})
			},200)
			state.submitDialog = false;
		}else{
			state.dyxloading = false;
			ElMessage.warning(res.Message);
		}
	}
	// 重置弹窗
	function cleardialog(){
		context.emit('clear');
		state.data = {
			Id: 0,
			ApiKey: '',
			ApiSecret: '',
			porCityId: '',
			porCityName: '',
			fndCityId: '',
			fndCityName: '',
			serviceCode: '',
			startDate: null,
			endDate: null,
			vesselName: '',
			voynoName: '',
			containerType: '',
			containerCount: '',
			includeInsurance: true,
			blQuantity: '1',
			startRunDate: null,
			endRunDate: null,
			payRatio: null
		};
		state.productlist = [];
		state.productselect = [];
		state.linetype = '1';
		state.paytype = '1';
		state.producttype = '3';
		state.dyxloading = false;
		state.submitDialog = false;
		state.setAccountDialog = false;
		form1.value.resetFields();
	}
	const CoscoConfigFormRef = ref(null);
	// 配置数据
	const CoscoConfigForm = reactive({
		CompantName: 'COSCO-中远海-Channel C',
		UseType: '网页',
		userName: '',
		userPassword: '',
		payPassword: ''
	})
	
	const CoscoConfigRules = reactive({
	  userName: [
	    { required: true, message: '请输入账号', trigger: 'blur' },
	  ],
	  userPassword: [
	    { required: true, message: '请输入登录密码', trigger: 'blur' },
	  ],
	  payPassword: [
	    { required: true, message: '请输入支付密码', trigger: 'blur' },
	  ]
	})
	
	// 保存配置
	const CoscoConfigSave = () => {
		CoscoConfigFormRef.value.validate(async (valid, fields) => {
		  if (valid) {
		    let res = await request.post('/api/RobShipCosConfig/CreateOrUpdate',{
				userName: CoscoConfigForm.userName,
				userPassword: CoscoConfigForm.userPassword,
				payPassword: CoscoConfigForm.payPassword
			})
			if(res.Status){
				ElMessage.success("配置成功!");
				state.setAccountDialog = false;
				getCosConfig();
			}else{
				ElMessage.warning(res.Message);
			}
		  }  
		})
		// cargoAccount.accountNotAllowed = false;
	}
	// 关闭配置
	const setAccountClose = async () =>{
		CoscoConfigFormRef.value.resetFields();
		CoscoConfigForm.value = {
			CompantName: 'COSCO-中远海-Channel C',
			UseType: '网页',
			userName: '',
			userPassword: '',
			payPassword: ''
		}
	}
	
	// 禁止日期-开航
	function disabledDate(time) {
		return time.getTime() < Date.now()
	}
	// 禁止日期-截止
	function disabledDate2(time) {
		if(state.data.startDate){
			let khdate = new Date(state.data.startDate);
			return time.getTime() < khdate.getTime()
		}else{
			return time.getTime() < Date.now()
		}
		
	}
	// 禁止日期-运行
	function disabledDate3(time) {
		return time.getTime() < Date.now() - 8.64e7;
	}
	// 输入大写字母与数字
	function toUpValue(i){
		if(i == 1){
			state.data.serviceCode = state.data.serviceCode.replace(/[\W]/g,'').toUpperCase();
		}else if(i == 2){
			state.data.vesselName = state.data.vesselName.replace(/[\W]/g,'').toUpperCase();
		}else{
			state.data.voynoName = state.data.voynoName.replace(/[\W]/g,'').toUpperCase();
		}
		
	}
	// 确定运行开始时间
	function checkTime(val){
		let startdate = new Date(val);
		let enddate = new Date(startdate.getTime() + 10*60*1000);
		let Hours = enddate.getHours()<=9?'0'+enddate.getHours():enddate.getHours();
		let Minutes = enddate.getMinutes()<=9?'0'+enddate.getMinutes():enddate.getMinutes();
		let Seconds = enddate.getSeconds()<=9?'0'+enddate.getSeconds():enddate.getSeconds();
		state.data.endRunDate = Hours+":"+Minutes+":"+Seconds;
	}
	
	
	
	watch(() => state.linetype, (newValue, oldValue) => {
	    if(newValue == '1'){
			state.data.serviceCode = "";
		}
	})
	watch(() => state.data.includeInsurance, (newValue, oldValue) => {
	    if(!newValue){
			state.data.blQuantity = "";
		}
	})
	watch(() => state.paytype, (newValue, oldValue) => {
	    if(newValue == '1'){
			state.data.payRatio = "";
		}
	})
	watch(props,(old,newProps)=>{
		showcreate.value = newProps.showcreated;
		if(newProps.showcreated){
			querySearch.porSearch();
			querySearch.fndSearch();
		}
	})
	
	onMounted(async ()=>{
		getCosConfig();
		querySearch.porSearch();
		querySearch.fndSearch();
	})
	
    return {
      agent,
      certification,
      startDate,
      endDate,
      cargoTabName,
	  shipname,
	  getCosConfig,
	  state,
	  glselect,
	  porselect,
	  fndselect,
	  khRange,
	  yxRange,
	  form1,
	  form2,
	  form1rules,
	  jypor,
	  jyfnd,
	  savedrafts,
	  validatexxxl,
	  jyxx,
	  xxselect,
	  savedyx,
	  saveyx,
	  tjyx,
	  showcreate,
	  cleardialog,
	  producttable,
	  CoscoConfigForm,
	  CoscoConfigRules,
	  CoscoConfigSave,
	  CoscoConfigFormRef,
	  querySearch,
	  setAccountClose,
	  disabledDate,
	  disabledDate2,
	  disabledDate3,
	  toUpValue,
	  checkTime
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
    background: #ff9809;
    display: inline-block;
    margin-right: 8px;
  }
}
.check-row {
  display: flex;
  align-items: center;
  .check-item {
    margin-right: 8px;
    
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
.configbtn{
	margin: 3px 0 0 10px;
}
:deep(.el-dialog__body){
	padding: 0;
}
</style>
