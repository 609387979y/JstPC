<template>
  <el-dialog v-model="planOptionVisiable" title="认证选项页面" width="650px">
    <template #title>
      <div></div>
    </template>
    <div class="plan-container">
      <template v-if="isCompanyExpired">
        <PayPlanOption @btnClick="contactUpgrade" btnText="联系我们">
          当前方案已过期
          <span style="color:red">{{ $utils.formatDateTime($store.getters["payplan/planInfo"].ExpireTime) }}</span>，
          如需续订或升级，请联系我们。
        </PayPlanOption>
      </template>
      <template v-else>
        <!-- <PayPlanOption @btnClick="openPlanDetailDialog('user')" :disabled="disabledTrial"
          :btnText="disabledTrial ? '已使用' : '前往试用'">
          尝试7天免费试用
        </PayPlanOption> -->
        <PayPlanOption @btnClick="openPlanDetailDialog('user')" :disabled="authStatus"
          :btnText="!authStatus ? '前往认证' : '已完成'">
          完成职业认证即可永久使用运价查询
        </PayPlanOption>
        <PayPlanOption @btnClick="openPlanDetailDialog('company')" style="margin-top:10px"
          :disabled="$store.getters['payplan/canSubmitCompanyAudit'] != 0"
          :btnText="$store.getters['payplan/canSubmitCompanyAudit'] == 0 ? '前往认证' : $store.getters['payplan/canSubmitCompanyAudit'] == 1 ? '审核中' : '已完成'">
          <div>
            完成企业认证获取专属权益
          </div>
          <div>
            完成认证，获取专属权益
          </div>
        </PayPlanOption>
      </template>

    </div>


  </el-dialog>

  <el-dialog :close-on-click-modal="false" top="10vh" v-model="planDetailVisiable" title="认证详情页面" width="600px">
    <template #title>
      <div></div>
    </template>
    <el-scrollbar ref="detailScrollbar" height="600px">
      <div class="plan-card-container">
        <div v-for="(item, index) in detailPage.value" style="margin-top:36px" class="plan-card">
          <div class="plan-card-title">
            <div class="plan-card-no">
              0{{ index + 1 }}
            </div>
            <div class="plan-card-info">
              <div class="plan-card-info-title">
                {{ item.title }}
              </div>
              <div>
                {{ item.remark }}
              </div>
            </div>
          </div>

          <div class="plan-image">
            <el-image fit="cover" :src="item.img" />
          </div>
        </div>

      </div>
    </el-scrollbar>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="planDetailVisiable = false">取消</el-button>
        <el-button :loading="detailPage.detailPageConfirmLoading" type="primary" @click="detailPageConfirm">
          {{ detailPage.type == 'user' ? '去试用' : '立即认证' }}
        </el-button>
      </span>
    </template>


  </el-dialog>
  <el-dialog :close-on-click-modal="false" top="10vh" v-model="planDetailVisiable2" title="认证详情页面" width="600px">
    <template #title>
      <div></div>
    </template>
    <el-scrollbar ref="detailScrollbar" height="600px">
      <div class="plan-card-container">
        <div v-for="(item, index) in detailPage.value" :key="item.title" style="margin-top:36px" class="plan-card">
          <div class="plan-card-title">
            <div class="plan-card-no">
              0{{ index + 1 }}
            </div>
            <div class="plan-card-info">
              <div class="plan-card-info-title">
                {{ item.title }}
              </div>
              <div>
                {{ item.remark }}
              </div>
            </div>
          </div>

          <div class="plan-image">
            <el-image fit="cover" :src="item.img" />
          </div>
        </div>

      </div>
    </el-scrollbar>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="planDetailVisiable2 = false">取消</el-button>
        <el-button :loading="detailPage.detailPageConfirmLoading" type="primary" @click="detailPageConfirm2">
          立即认证
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 企业认证提交页 -->
  <PayPlanCompanySubmit ref="company"></PayPlanCompanySubmit>
  <PayPlanUserSubmit ref="user" @success="getUserAuth"></PayPlanUserSubmit>
</template>

<script>
import { defineComponent } from 'vue'
import PayPlanOption from './PayPlanOption.vue';
import PayPlanCompanySubmit from './PayPlanCompanySubmit.vue';
import PayPlanUserSubmit from './PayPlanUserSubmit.vue'
import { ElMessage } from 'element-plus';
export default defineComponent({
  components: {
    PayPlanOption,
    PayPlanCompanySubmit,
    PayPlanUserSubmit
  },
  data() {
    return {
      authStatus: false,
      // 选择方案弹窗
      planOptionVisiable: false,
      // 选择方案详情弹窗
      planDetailVisiable: false,
      planDetailVisiable2: false,
      detailPage: {
        type: '',
        value: [],
        // 详情页面提交按钮loading
        detailPageConfirmLoading: false
      }

    }
  },
  methods: {
    async getUserAuth() {
      let res = await this.$http.get("/api/PayPlan/GetCurrentUserPayPlan")
      if (res.Status) {
        // 认证状态为 已认证
        if (res.Data.Status === 1) {
          this.authStatus = true;
        }
      }
    },
    detailPageConfirm2() {
      this.$refs.user.openResultDialog();
    },
    /**
     * 打开选择方案弹窗
     */
    openPlanOptionDialog() {
      this.planOptionVisiable = true
    },
    /**
     * 打开选择方案详情弹窗
     * @param {*} type  company/user  企业/个人  显示不同的内容
     */
    async openPlanDetailDialog(type) {

      // 先验证是否可以打开对应的弹窗
      this.planOptionVisiable = false
      await this.$store.dispatch("payplan/getPayPlan")
      let status = this.$store.state.payplan.status;



      // 如果已经不能提交企业认证
      if (status.Role == "Company" && type == "company") {
        // 已经企业认证通过了 不允许再次提交2个申请
        ElMessage.info("您已经完成企业认证，无需再次认证")
        return Promise.reject();
      }


      if (type == "user") {
        /* if (status.CanSubmitUserTrial == false) {
          // 已经提交试用申请
          ElMessage.warning("您已经提交过试用申请，可以完成企业认证获取专属权益")
          return Promise.reject();
        } */
        /* this.planDetailVisiable2=true */
        this.$refs.user.openAuditDialog();

      } else {
        // 公司 
        if (status.CanSubmitCompanyAudit == false) {
          // 已经提交企业认证深
          // 直接弹框
          // this.$refs.company.openResultDialog();
          this.$refs.company.openAuditDialog();
          return
        }
        /* this.planDetailVisiable = true; */
        // this.detailPageConfirm()
        // 打开企业认证页面弹窗
        this.$refs.company.openAuditDialog()
        this.planDetailVisiable = false
      }


      if (this.detailPage.type != type) {
        this.detailPage.value = await this.fetchDetailInfo(type)
        this.detailPage.type = type;
      }
      this.detailPage.detailPageConfirmLoading = false;
      this.$nextTick(() => {
        // this.$refs.detailScrollbar.setScrollTop(0)
      })

    },
    /**
     * 获取方案详情
     * @param {*} type 
     */
    /**
     * 获取方案详情信息
     * @param {*} type  company/user  企业/个人  显示不同的内容
     */
    async fetchDetailInfo(type) {
      let key = "";
      if (type == "user") {
        key = "WXAPP_PLAN_USER"
      } else {
        key = "WXAPP_PLAN_COMPANY"
      }
      // 发送请求获取方案详情信息
      let res = await this.$http.get("/api/Justom/WxAppPreConfig", {
        key: key
      })

      let arr = JSON.parse(res.Data)

      let result = []
      // 遍历获取到的方案详情信息，将其转换为需要的格式
      if (arr && arr.length) {
        for (let item of arr) {
          let spilt = item.label.split("/")
          result.push({
            title: spilt[0],
            remark: spilt[1],
            img: item.value
          })
        }
      }
      return result;
    },
    /**
     * 详情页面 提交按钮
     */
    async detailPageConfirm() {
      this.detailPage.detailPageConfirmLoading = true;

      if (this.detailPage.type == 'user') {
        await this.$store.dispatch("payplan/submitUserPayPlan")
        this.planDetailVisiable = false
      } else {
        // 打开企业认证页面弹窗
        this.$refs.company.openAuditDialog()
        this.planDetailVisiable = false
      }
    },
    /**
     * 联系我们升级
     */
    async contactUpgrade() {
      let res = await this.$http.get("/api/CompanyAudit/NotifyPlan");
      if (res.Status) {
        this.$message.success("已通知平台，请耐心等待")
      } else {
        this.$message.warning(res.Message);
      }
    },
  },
  computed: {
    // 是否禁用体验按钮
    disabledTrial() {
      return this.$store.getters["payplan/canSubmitUserTrial"]
    },
    isCompanyExpired() {
      let plan = this.$store.getters["payplan/planInfo"];
      if (plan.Role == "Company" && plan.Expired == true) {
        return true;
      }
      return false
    }
  },
  async mounted() {
    this.getUserAuth()
    // 把自身的引用存到store中
    this.$store.commit("payplan/setDialogRef", this)
    this.$store.dispatch("payplan/getPayPlan")
    console.log(this.$store.dispatch("payplan/getPayPlan"))


  }
});
</script>
<style scoped lang="scss">
.plan-container {
  padding-left: 20px;
  padding-right: 40px;
}








.plan-card-container {
  padding-left: 20px;
  padding-right: 40px;
  height: 100%;
  position: relative;

  .plan-footer {
    background-color: #fff;
    height: 98px;
    width: 100%;
    position: absolute;
    bottom: 0px;
    text-align: center;
  }

  /* pages/PayPlan/UserContent/UserContent.wxss */

  .plan-content {
    padding: 18px 14.5px;
    text-align: center;
  }

  .plan-title {
    font-size: 18px;
    color: #212121;
    letter-spacing: 1.12px;
    font-weight: 600;
    display: flex;
    align-items: center;

  }

  .plan-title-primary {

    font-size: 18px;
    color: #0090FE;
    letter-spacing: 1.12px;
    font-weight: 600;
    margin-left: 7px;
  }

  .plan-card {
    background: #F3F8FF;
    border-radius: 4px;
    width: 100%;
    padding: 25px 15px;

  }

  .plan-card-title {
    display: flex;
    align-items: center;

  }

  .plan-card-no {
    font-size: 35px;
    color: #0090FE;
    letter-spacing: 2.175px;
    font-weight: 600;
    padding-left: 15px;
  }

  .plan-card-info {
    text-align: left;
    margin-left: 15px;
    font-size: 11px;
    color: #5F5F5F;
    letter-spacing: 0.485px;
    font-weight: 400;
  }

  .plan-card-info-title {

    font-size: 15px;
    /* 30rpx / 2 */
    color: #212121;
    letter-spacing: 0.39px;
    /* 0.78rpx / 2 */
    font-weight: 500;
    margin-bottom: 5px;
    /* 10rpx / 2 */
  }

  .plan-image {
    margin-top: 18px;

    /* 36rpx / 2 */
    img {
      width: 100%;
      height: 160px;
    }

  }
}
</style>