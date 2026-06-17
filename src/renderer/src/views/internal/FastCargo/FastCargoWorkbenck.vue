<template>
  <el-row>
    <el-col :span="16">
      <JstCardLayout>
        <template #title>
          <div class="fast-cargo-card-title">管理 - 抢舱任务</div>
        </template>
        <el-row :gutter="18">
          <el-col :span="10">
            <div class="mission-gray-card">
              <div class="mission-gray-card-title">进行中任务数</div>
              <div class="mission-gray-card-number mgt-10">{{state.allQC.RunCount}}</div>
            </div>
          </el-col>
		  
		  
          <el-col :span="10">
            <div class="mission-gray-card">
              <div class="mission-gray-card-title">待运行任务数</div>
              <div class="mission-gray-card-number mgt-10">{{state.allQC.NoRunCount}}</div>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="mission-gray-card">
              <div class="mission-gray-card-title">累计成功抢舱次数</div>
              <div class="mission-gray-card-number mgt-10 success">{{state.allQC.SuccessCount}}</div>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="mission-gray-card">
              <div class="mission-gray-card-title">累计抢舱次数</div>
              <div class="mission-gray-card-number mgt-10">{{state.allQC.AllCount}}</div>
            </div>
          </el-col>
          <el-col :span="10">
            <div></div>
          </el-col>
        </el-row>
      </JstCardLayout>
      <JstCardLayout
        ><template #title>
          <div class="fast-cargo-card-title">导航 - 创建抢舱任务</div>
        </template>
        <el-row :gutter="18">
          <el-col :span="8" @click="coscoClick()">
            <div class="mission-white-card">
              <img src="@/assets/images/COSCO.png" alt="" />
              <div>
                <div class="mission-white-card-name">
                  COSCO抢舱 <span class="hot">HOT</span>
                </div>
                <div class="mission-white-card-decribiton">
                  协助您一起进行COSCO抢舱，增加您的抢舱成功率
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8" @click="coscoApiClick()" v-if="state.isApi">
            <div class="mission-white-card">
              <img src="@/assets/images/COSCO.png" alt="" />
              <div>
                <div class="mission-white-card-name">
                  COSCO API抢舱 <span class="hot">HOT</span>
                </div>
                <div class="mission-white-card-decribiton">
                  协助拥有COSCO API协议的客户进行对接于抢舱事项
                </div>
              </div>
            </div>
          </el-col>
		  
          <el-col :span="8" @click="cargoAccount.accountNotAllowed = true">
            <div class="mission-white-card">
              <img src="@/assets/images/OOCL.png" alt="" />
              <div>
                <div class="mission-white-card-name">
                  OOCL抢舱
                </div>
                <div class="mission-white-card-decribiton">
                  内测中，敬请期待...
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8" @click="cargoAccount.accountNotAllowed = true">
            <div class="mission-white-card">
              <img src="@/assets/images/ONE.png" alt="" />
              <div>
                <div class="mission-white-card-name">
                  ONE抢舱
                </div>
                <div class="mission-white-card-decribiton">
                  内测中，敬请期待...
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8" @click="cargoAccount.accountNotAllowed = true">
            <div class="mission-white-card">
              <img src="@/assets/images/MSK.png" alt="" />
              <div>
                <div class="mission-white-card-name">
                  MSK抢舱
                </div>
                <div class="mission-white-card-decribiton">
                  内测中，敬请期待...
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </JstCardLayout>
    </el-col>
    <el-col :span="8">
	  <div style="box-sizing: border-box;padding-left: 16px;">
		<JstCardLayout class="mgb-8">
		  <template #title>
		    <div class="fast-cargo-card-title">今日抢舱事项</div>
		  </template>
		  <div class="mission-gray-card pd-11 flex-between">
		    <div class="mission-gray-card-title">今日抢舱任务</div>
		    <div class="mission-gray-card-number">{{state.DayQC.AllCount}}</div>
		  </div>
		  <div class="mission-gray-card pd-11 flex-between">
		    <div class="mission-gray-card-title">今日待运行</div>
		    <div class="mission-gray-card-number">{{state.DayQC.NoRunCount}}</div>
		  </div>
		  <div class="mission-gray-card pd-11 flex-between">
		    <div class="mission-gray-card-title">今日已结束</div>
		    <div class="mission-gray-card-number">{{state.DayQC.FinishCount}}</div>
		  </div>
		</JstCardLayout>
		<JstCardLayout class="mgb-8">
		  <template #title>
		    <div class="fast-cargo-card-title">概况-及时币</div>
		  </template>
		  <div>
		    <span style="font-size: 12px; color: #3c4144">及时币余额</span>
		    <span @click="gosalelist()" style="font-size: 10px; color: #ff9809; margin-left: 6px; cursor: pointer">抢舱消费记录</span
		    >
		  </div>
		  <div class="jsb mgt-8">
		    <img style="margin-right: 4px" src="@/assets/images/jst-hb.svg" alt srcset />{{
		      utils.formatAmount(wallet.balance)
		    }}
		  </div>
		  <div class="mission-gray-card flex-between yzfbox">
		    <div class="mission-gray-card-title">已支付保证金</div>
		    <div class="mission-gray-card-number">
		      <img
		        style="margin-right: 4px"
		        src="@/assets/images/jst-hb.svg"
		        alt
		        srcset
		      />{{ utils.formatAmount(state.Amount) }}
		    </div>
		  </div>
		  <div style="color: #969799; display: flex">
		    <el-icon style="color: #c8c9cc; margin-right: 6px"><InfoFilled /></el-icon
		    >抢舱失败后自动退还
		  </div>
		  <div style="margin-top:16px">
		    <el-button style="width: 120px" color="#FF9809" type="primary" @click="openWebPageAndCheck('recharge')">充值</el-button>
		  </div>
		</JstCardLayout>
		<JstCardLayout>
		  <template #title>
		    <div class="fast-cargo-card-title">配置 - 船司账号</div>
		  </template>
		  <template #button>
		    <span class="fast-cargo-text-button" @click="cargoAccount.accountDrawer = true"
		      >配置</span
		    >
		  </template>
		  <el-table header-cell-class-name="accountth" :data="state.configlist">
		    <el-table-column label="所属船司" prop="Company"></el-table-column>
		    <el-table-column label="账号名称" prop="userName"></el-table-column>
		    <el-table-column label="用途" prop="UseType"></el-table-column>
		  </el-table>
		</JstCardLayout>
	  </div>
    </el-col>
  </el-row>
  <el-dialog
    custom-class="jst-not-open-dialog"
    v-model="cargoAccount.accountNotAllowed"
    width="436px"
    center
  >
    <div style="text-align: center">
      <img src="@/assets/images/fast-cargo-not-allowed.svg" alt="" />
      <div class="mgt-16" style="font-size: 14px; color: #3c4144; font-weight: 600">
        很抱歉，该功能暂未开放
      </div>
      <div class="mgt-12" style="font-size: 10px; color: #969799">
        详细信息请致电客服进行了解
      </div>
      <div class="mgt-16">
        <el-button
          type="primary"
          style="width: 120px"
          color="#FF9809"
          @click="cargoAccount.accountNotAllowed = false"
          >确定</el-button
        >
      </div>
    </div>
  </el-dialog>
  <el-dialog
    custom-class="jst-set-account-dialog"
    v-model="cargoAccount.setAccountDialog"
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
          style="width: 120px"
          color="#FF9809"
          @click="CoscoConfigSave"
          >确定</el-button
        >
      </div>
    </div>
  </el-dialog>
  <el-drawer
    v-model="cargoAccount.accountDrawer"
    :direction="direction"
    :show-close="true"
	:size="500"
	title="配置-船司账号"
	custom-class="FCdrawer"
  >
    <template #default>
	  <el-button size="mini" type="primary" color="#FF9809" @click="cargoAccount.setAccountDialog = true">新增</el-button>
	  <div style="height: 15px;"></div>
      <el-table header-cell-class-name="accountth" :data="state.configlist">
        <el-table-column label="所属船司" prop="Company"></el-table-column>
        <el-table-column label="账号名称" prop="userName"></el-table-column>
        <el-table-column label="用途" prop="UseType"></el-table-column>
		<el-table-column label="操作" prop="operation" align="right">
			<template #default="scope">
				<el-button type="text" class="configdrawerbtn" @click="editConfig(scope.row)">编辑</el-button>
				<el-button type="text" class="configdrawerbtn" @click="delConfig(scope.row.Id)">删除</el-button>
			</template>
		</el-table-column>
      </el-table>
    </template>
  </el-drawer>
  <FastCargoCreateTask ref="creatbox" :showcreated="state.showdialog" @clear="cleardialog"></FastCargoCreateTask>
  <FastCargoWebCreateTask ref="creawebtbox" :showcreated="state.showwebdialog" @clear="clearwebdialog"></FastCargoWebCreateTask>
  
</template>

<script lang="ts">
import { defineComponent, ref,unref, reactive, computed, onMounted,onActivated } from "vue";
import { useRoute,useRouter } from "vue-router"
import request from "@/public/request";
import { utils } from "justom-share";
import { ElMessage,ElMessageBox } from "element-plus";
import { InfoFilled } from "@element-plus/icons";
import request from "@/public/request";
import { getElectronAgent } from "@share/agent";
import { useStore } from "vuex";
import { useCompanyCertification } from "@/composables/user/certification";
import { useWallet } from "@/composables/pay/useWallet";
import FastCargoCreateTask from "./components/FastCargoCreateTask.vue";
import FastCargoWebCreateTask from "./components/FastCargoWebCreateTask.vue";

function useCargoMission() {}
function useCargoAccount() {
  const accountConfig = ref(false);
  const accountDrawer = ref(false);
  const accountNotAllowed = ref(false);
  const setAccountDialog = ref(false);
  return reactive({
    accountConfig,
    accountDrawer,
    accountNotAllowed,
    setAccountDialog,
  });
}

export default defineComponent({
  components: { 
	InfoFilled,
	FastCargoCreateTask,
	FastCargoWebCreateTask
  },

  setup(props, context) {
    const cargoMisson = useCargoMission();
    const cargoAccount = useCargoAccount();
	const Route = useRoute();
	const Router = useRouter();
	const agent = getElectronAgent();
	const store = useStore();
	const certification = useCompanyCertification();
	const wallet = useWallet();
	
	const creatbox = ref(null);
	const creawebtbox = ref(null);
	
	const state = reactive({
		allQC: {
			NoRunCount: 0,
			RunCount: 0,
			SuccessCount: 0,
			AllCount: 0
		},
		DayQC: {
			AllCount: 0,
			NoRunCount: 0,
			FinishCount: 0
		},
		Amount: 0,
		showdialog: false,
		showwebdialog: false,
		configlist: [],
		isApi: false
	})
	
	// 获取抢舱统计
	async function GetShipStatistic(){
		let res = await request.get('/api/RobShipStatistics/GetShipStatistic');
		state.allQC = res;
	}
	// 获取今日抢舱统计
	async function GetShipTodayStatistic(){
		let res = await request.get('/api/RobShipStatistics/GetShipTodayStatistic');
		state.DayQC = res;
	}
	// 获取抢舱已支付保证金
	async function GetShipAmount(){
		let res = await request.get('/api/RobShipStatistics/GetShipAmount');
		state.Amount = res.Amount;
	}
	
	const CoscoConfigFormRef = ref(null);
	// cosco 网页配置
	async function coscoClick(){
		let res = await request.get('/api/RobShipStatistics/GetShipAmount',{});
		if(res.length == 0){
			cargoAccount.setAccountDialog=true;
		}else{
			state.showwebdialog = true;
			// Router.push('/fastCargo/fastCargoApiDetail')
		}
		
	}
	// cosco API配置
	async function coscoApiClick(){
		let res = await request.get('/api/RobShipCosApiConfig/CheckCosApiCompanyConfig',{});
		if(res){
			//Router.push('/fastCargo/FastCargoCreateTask')
			state.showdialog = true;
		}else{
			Router.push('/fastCargo/fastCargoApiDetail')
		}
	}
	
	const CoscoConfigForm = reactive({
		Id: 0,
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
	
	const CoscoConfigSave = () => {
		CoscoConfigFormRef.value.validate(async (valid, fields) => {
		  if (valid) {
		    let res = await request.post('/api/RobShipCosConfig/CreateOrUpdate',{
				Id: CoscoConfigForm.Id,
				userName: CoscoConfigForm.userName,
				userPassword: CoscoConfigForm.userPassword,
				payPassword: CoscoConfigForm.payPassword
			})
			if(res.Status){
				ElMessage.success("配置成功!");
				cargoAccount.setAccountDialog = false;
				getCosConfig();
			}else{
				ElMessage.warning(res.Message);
			}
		  }  
		})
		// cargoAccount.accountNotAllowed = false;
	}
	
	// 是否登录了员工账号
	const isEmployeeLogin = computed(() => {
	  if (store.state.auth.employee) {
	    return true;
	  } else {
	    return false;
	  }
	});
	
	async function openWebPage(urlType) {

	  if(urlType=='recharge'){
	    agent?.ipcRequest("external/external", `/rechargeWeb?type=${urlType}`)
	    return
	  }
	
	  agent?.ipcRequest("external/external", `/userCenterWeb?type=${urlType}`)

	}
	
	async function openWebPageAndCheck(url) {
	  if (isEmployeeLogin) {
	    openWebPage(url)
	  } else {
	    ElMessage.warning('请先进行企业认证')
	    certification.toUserAuth();
	  }
	}
	// 消费记录
	function gosalelist(){
		Router.push('/fastCargo/FastCargoCostLog');
	}
	
	function cleardialog(){
		state.showdialog = false;
	}
	function clearwebdialog(){
		state.showwebdialog = false;
	}
	// 获取配置账号
	// 获取关联账号
	async function getCosConfig(){
		let res = await request.get("/api/RobShipCosConfig/GetCosCompanyConfig");
		if(res){
			res.forEach(item => {
				item.Company = 'COSCO';
				item.UseType = '网页';
			})
		}
		state.configlist = res;
	}
	// 修改配置账号
	async function editConfig(row){
		CoscoConfigForm.Id = row.Id;
		CoscoConfigForm.userName = row.userName;
		CoscoConfigForm.payPassword = row.payPassword;
		CoscoConfigForm.userPassword = row.userPassword;
		cargoAccount.setAccountDialog = true;
	}
	// 删除配置
	function delConfig(Id){
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
			  let res = await request.get('/api/RobShipCosConfig/DeleteCosConfig',{Ids: Id});
		      
			  if(res.Status){
				  ElMessage.success(res.Message);
				  getCosConfig();
			  }else{
				  ElMessage.warning(res.Message);
			  }
		    })
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
	// 
	async function getlist(){
		let res = await request.get('api/Code/GetList',{type: 'COSCO API 抢舱'});
		let arr = [];
		res.Data.Rows.forEach(item=>{
			if(item.Code == store.state.auth.employee.CompanyId){
				state.isApi = true;
			}
		})
	}
	
	onMounted(async()=>{
		getlist();
		getCosConfig();
		GetShipStatistic();
		GetShipTodayStatistic();
		GetShipAmount();
	})
    onActivated(async () => {
		
	});

    return {
      utils,
	  state,
      cargoMisson,
      cargoAccount,
	  coscoClick,
	  CoscoConfigFormRef,
	  CoscoConfigForm,
	  CoscoConfigRules,
	  CoscoConfigSave,
	  coscoApiClick,
	  openWebPageAndCheck,
	  openWebPage,
	  isEmployeeLogin,
	  wallet,
	  creatbox,
	  creawebtbox,
	  cleardialog,
	  clearwebdialog,
	  gosalelist,
	  getCosConfig,
	  editConfig,
	  delConfig,
	  setAccountClose,
	  getlist
    };
  },
});
</script>

<style lang="scss" scoped>
.fast-cargo-card-title {
  font-size: 14px;
  color: #3c4144;
  font-weight: 400;
  margin-left: -6px;
  margin-top: 6px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
}

.mission-gray-card {
  background: #f7f9fa;
  padding: 16px;
  margin-bottom: 16px;

  .success {
    color: #67c23a !important;
  }
  .mission-gray-card-title {
    font-size: 14px;
    line-height: 30px;
    color: #3c4144;
  }
  .mission-gray-card-number {
    font-size: 24px;
    color: #3c4144;
    font-weight: 600;
    // margin-top: 16px;
  }
}
.mission-white-card {
  padding: 16px;
  display: flex;
  border: 1px solid #e7eaec;
  margin-bottom: 12px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    box-shadow: 1px 1px 15px rgba(25, 25, 25, 0.1);
  }
  img {
    width: 56px;
    height: 56px;
    margin-right: 12px;
  }
  .mission-white-card-name {
    color: #1f508a;
    font-size: 14px;
    margin-bottom: 4px;
    display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
    overflow: hidden; //超出部分隐藏
    text-overflow: ellipsis; //用一个省略号代替超出的内容
    -webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
    -webkit-line-clamp: 1; //限制行数
  }
  .mission-white-card-decribiton {
    color: #969799;
    font-size: 12px;
    display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
    -webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
    -webkit-line-clamp: 2; //限制行数
    overflow: hidden; //超出部分隐藏
    text-overflow: ellipsis; //用一个省略号代替超出的内容
  }
  .hot {
    background: #ec4242;
    border-radius: 12px;
    padding: 0 6px;
    font-size: 10px;
    color: #fff;
  }
}
.jsb {
  font-size: 28px;
  line-height: 33px;
  color: #fa6400;
}
.fast-cargo-text-button {
  cursor: pointer;
  color: #ff9809;
  margin-top: 7px;
}
.pd-11{
	padding: 11px 16px;
	margin-bottom: 8px;
}
.pd-11:last-child{
	margin-bottom: 0px;
}
.mgb-8{
	:deep(.card_staff){
		margin-bottom: 8px;
	}
}
.mgt-8{
	margin-top: 8px;
}
.yzfbox{
	padding: 11px 16px;
	margin-top: 16px;
	margin-bottom: 4px;
}
:deep(.accountth){
	background-color: #EFF3F8!important;
	padding: 1px 0;
}
.configdrawerbtn{
	color: #ff9809;
}
</style>
<style lang="scss">
	.FCdrawer{
		.el-drawer__header{
			margin-bottom: 0px;
		}
	}
</style>
