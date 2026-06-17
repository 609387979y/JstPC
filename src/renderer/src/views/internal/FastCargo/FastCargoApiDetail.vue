<template>
  <div class="app-detail-container">
    <!-- <el-button @click="back">返回</el-button> -->
    <div class="main">
      <div class="info">
        <div class="imagebox">
          <img class="image" src="@/assets/images/COSCO.png" />
        </div>
        <div class="info-text">
          <div class="title">COSCO API抢舱</div>
          <div class="description">协助拥有COSCO API协议的客户进行对接于抢舱事项</div>
          <div class="btn">
            <el-button
              size="mini"
              style="width: 120px"
              color="#FF9809"
              type="primary"
              @click="KtClick()"
              >即刻联系开通</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="main-content">
	  <div class="main-content-item">
		<div class="sub-title">COSCO API介绍</div>
		<div class="detail">
		  帮助发展中的中小企业做好内部财务及经营管理；以销售订单或项目为源头，关联所有采购，费用报销，工资等支出，计算出每个销售订单或者项目的利润。软件使用门槛低、高安全、服务佳、弹性大、迭代快等特点。事前预测，事中控制，实时核算，业务全过程管控。员工使用更高效，老板经营更安心，公司更上一层楼！
		</div> 
		<div class="line"></div>
	  </div>
      
      <div class="main-content-item">
		<div class="sub-title">COSCO API抢舱说明</div>
		<div class="detail">
		  帮助发展中的中小企业做好内部财务及经营管理；以销售订单或项目为源头，关联所有采购，费用报销，工资等支出，计算出每个销售订单或者项目的利润。软件使用门槛低、高安全、服务佳、弹性大、迭代快等特点。事前预测，事中控制，实时核算，业务全过程管控。员工使用更高效，老板经营更安心，公司更上一层楼！
		</div>
	  </div>
    </div>
  </div>
  <el-dialog
    custom-class="jst-apply-dialog"
    v-model="accountApplicationDialog"
    width="420px"
    center
  >
    <div class="apply-form">
      <div class="apply-title">开通申请</div>
      <div class="apply-describe">开通即可享受COSCO API抢舱</div>
      <div class="apply-lable"><span class="required">*</span> 联系人</div>
      <el-input class="apply-input" size="large" v-model="sqmess.name"></el-input>
      <div class="apply-lable"><span class="required">*</span> 联系方式</div>
      <el-input class="apply-input" size="large" v-model="sqmess.phone"></el-input>
      <div class="apply-describe2">确认以上信息为您联系信息，即可进行开通审核</div>
      <div class="mgt-16">
        <el-button
          type="primary"
          style="width:100%"
          color="#FF9809"
          size="large"
          @click="coscoApiSubmit()"
        >提交</el-button
        >
      </div>
      <BaseJstInfoFooter style="margin-top:48px"></BaseJstInfoFooter>
    </div>
    
  </el-dialog>
  <el-dialog 
	custom-class="jst-apply-dialog"
	v-model="accountApplicationDialog2"
	width="518px"
	center
  >
	<div class="apply-success">
	  <img src="@/assets/images/fast-cargo-apply.svg" alt="" />
	  <div class="apply-main-title">开通申请已提交成功</div>
	  <div class="apply-second-title">平台将尽快联系您进行审核，请留意您的电话…</div>
	  <div class="apply-bottom">
	    <div>
	      帮助发展中的中小企业做好内部财务及经营管理；以销售订单或项目为源头，关联所有采购，费用报销，工资等支出，计算出每个销售订单或者项目的利润。软件使用门槛低、高安全、服务佳、弹性大、迭代快等特点。事前预测，事中控制，实时核算，业务全过程管控。
	    </div>
	  </div>
	</div>
  </el-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";
import { getElectronAgent } from "@share/agent";
import { useCompanyCertification } from "@/composables/user/certification";
import BaseJstInfoFooter from "@/views/internal/internalComponents/BaseJstInfoFooter.vue";
import request from "@/public/request";
import { ElMessage } from "element-plus";
export default defineComponent({
  components: {
    BaseJstInfoFooter,
  },
  setup() {
    const agent = getElectronAgent();
    const certification = useCompanyCertification();
    const accountApplicationDialog = ref(false);
	const accountApplicationDialog2 = ref(false);
	const issq = ref(false);
	const sqmess = ref({
		name: '',
		phone: ''
	})
	// 申请
	async function coscoApiSubmit(){
		if(!sqmess.value.name){
			ElMessage.warning("请输入联系人");
			return;
		}
		if(!sqmess.value.phone){
			ElMessage.warning("请输入联系方式");
			return;
		}
		let res = await request.post("/api/RobShipCosApiApply/Create",{	
			ApplyName: sqmess.value.name,
			ApplyPhone: sqmess.value.phone
		})
		if(res.Status){
			accountApplicationDialog2.value = true;
			accountApplicationDialog.value = false;
		}else{
			ElMessage.warning(res.Message);
		}
		// cargoAccount.accountNotAllowed = false;
	}
	// 开通
	async function KtClick(){
		let res = await request.get('/api/RobShipCosApiApply/GetCosCompanyApply');
		if(res){
			accountApplicationDialog2.value = true;
		}else{
			accountApplicationDialog.value = true;
		}
		
	}
	
	
    return {
      agent,
      certification,
      accountApplicationDialog,
	  coscoApiSubmit,
	  KtClick,
	  sqmess,
	  accountApplicationDialog2
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
.app-detail-container {
  background-color: #fff;
  height: 100%;
  // padding: 10px;
  :deep(.el-divider--horizontal) {
    border-color: #f2f3f5;
  }

  

  .main {

  }

  .info {
    display: flex;
	box-sizing: border-box;
	padding: 32px 0 24px 32px;
	
	.imagebox{
		width: 96px;
		.image {
		  width: 96px;
		  height: 96px;
		}
	}
	

    .info-text {
	  flex: 1;
      margin-left: 16px;
	  
	  .title {
	    font-size: 24px;
		line-height: 33px;
	    color: #606266;
	    letter-spacing: 0;
	    font-weight: bold;
		margin-top: 2px;
	  }
	  
	  .description {
	    font-size: 20px;
		line-height: 28px;
	    color: #969799;
	    letter-spacing: 0;
	    font-weight: 400;
	    margin-top: 8px;
	  }
	  
	  .btn {
	    margin-top: 16px;
	  
	    :deep(.el-button) {
	      border-radius: 2px;
	      width: 84px;
	      height: 24px;
	    }
	  }
    }

    
  }
  .main-content{
	padding-bottom: 1px;
	margin-top: 8px;
	.main-content-item{
		width: 100%;
		box-sizing: border-box;
		padding: 0 32px;
		padding-top: 24px;
		padding-bottom: 0px;
		
		.sub-title {
		  font-size: 20px;
		  color: #303133;
		  letter-spacing: 0;
		  font-weight: bold;
		}
		
		.detail {
		  margin-top: 10px;
		  font-size: 16px;
		  color: #606266;
		  letter-spacing: 0;
		  margin-bottom: 16px;
		}
	} 
  }
  
}
.apply-form {
  padding: 32px;
  padding-top: 0;
  .apply-title {
    font-size: 20px;
	line-height: 28px;
    color: #3c4144;
    font-weight: 600;
  }
  .apply-describe {
    font-size: 12px;
	line-height: 17px;
    color: #3c4144;
    margin: 8px 0;
  }
  .apply-lable {
    font-size: 14px;
	line-height: 20px;
    color: #606266;
    margin-top: 24px;
    .required {
      color: red;
    }
  }
  .apply-input {
    margin-top: 8px;
  }
  .apply-describe2 {
    margin-top: 48px;
    font-size: 12px;
    color: #3c4144;
  }
}
.apply-success {
  text-align: center;
  img {
    width: 88px;
    height: 88px;
    margin:60px 0 32px;
  }
  .apply-main-title {
    font-size: 28px;
    color: #3c4144;
    font-weight: 600;
  }
  .apply-second-title {
    font-size: 16px;
    color: #969799;
    margin-top: 6px;
  }
  .apply-bottom {
    background: rgba(255, 237, 211, 0.5);
    padding: 51px 91px;
    margin-top:32px;
    div {
      font-size: 14px;
      color: #a6b4c2;
    }
  }
}
.line{
	width: 100%;
	height: 1px;
	background: #DCDFE6;
}

</style>
<style lang="scss">
.jst-apply-dialog{
    .el-dialog__body{
        padding: 0;
    }
}
</style>