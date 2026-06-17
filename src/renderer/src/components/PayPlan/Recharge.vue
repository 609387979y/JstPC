<template>
  <div class="recharge-container">
    <JstCardLayout>
      <div class="space-width">
        <!-- 动态显示套餐详细信息 -->
        <div v-if="selectedPlan">
          <div class="plan">
            <h3>{{ selectedPlan.Name }}</h3>
            <p>{{ selectedPlan.Describe }}</p>
            <div class="price-Box">
              <div class="type">
                <img v-if="selectedPlan.Url" :src="getIconUrl(selectedPlan.Url)" alt="">&nbsp;<span>{{
                  selectedPlan.Name }}</span>
              </div>
              <div class="price"><span>{{ selectedPlan.Money }}¥</span>/{{ selectedPlan.Days }}天
              </div>
            </div>
            <div class="title">{{ selectedPlan.VipDescribe }}</div>
            <ul>
              <li v-for="(item, index) in selectedPlan.Details" :key="index">
                <img src="@/assets/newImages/renewVip/dui.png" alt="">&nbsp;{{ getNameByType(item.Type) }}
                <span class="tip" v-if="getTipByType(item)">{{ getTipByType(item) }}</span>
                <div>{{ getDescribeByType(item.Type) }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p class="desc-text">若有问题请联系平台人员</p>
      <p class="desc-text">工作日：8:30-17:30</p>
    </JstCardLayout>
    <div class="main">
      <el-row style="margin-bottom: 20px;overflow-x: auto;" :gutter="15">
        <el-col v-for="(item, idx) in planList" style="margin-bottom: 5px;" :key="idx" :span="6">
          <FlashSaleButton :coin="item.coin" :amount="item.amount.toString()" :delAmount="item.delAmount"
            :days="item.days" :active="activePlanId == item.id" @click="chooseAmount(item.amount, item.plan)">
          </FlashSaleButton>
        </el-col>
      </el-row>
      <JstCardLayout>
        <div class="flex-box">
          <div v-loading="iframeLoading" v-if="iframeSrc !== ''" style="margin-right: 20px">

            <iframe width="170" height="170" :src="iframeSrc" :ref="e => hookIframe(e)" frameborder="no" border="0"
              marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
            <div style="color: #969799; text-align: center; font-size: 12px">扫描二维码进行支付</div>
          </div>
          <div v-else style="margin-right: 20px">
            <img width="170" height="170" src="@/assets/images/offline-pay.svg" alt />
            <div style="color: #969799; text-align: center; font-size: 12px">扫描二维码进行支付</div>
          </div>

          <div style="flex: 1 0 auto">
            <div style="margin-bottom: 20px">
              <span class="detail-text">实付：</span>
              <span class="real-price">{{ activeAmount }}</span>
              <span style="color: #fa6400;margin-left: 5px">元</span>
            </div>
            <div class="flex-box">
              <div>支付方式：</div>
              <div class="flex-box-wrap">
                <div class="pay-btn-box active">
                  <img src="@/assets/images/icon-pay-zfb.svg" alt />
                </div>
              </div>
            </div>
          </div>
        </div>
      </JstCardLayout>
      <JstCardLayout>
        <div class="flex-box">
          <div>
            <div>充值账号：{{ currentUser.MobilePhone }}</div>
            <div>到账账户：{{ currentUser.RealName }}</div>
          </div>
          <div></div>
        </div>
      </JstCardLayout>
    </div>
  </div>
</template>

<script>
import FlashSaleButton from "./components/FlashSaleButton.vue";
import { defineComponent } from "vue"
import utils from "@/utils/Utils"


export default defineComponent({
  components: { FlashSaleButton },
  data() {
    return {
      // 套餐列表
      plans: [],
      // 选中的套餐
      selectedPlan: null,
      // 激活的套餐Id
      activePlanId: null,
      // 激活的amount
      activeAmount: 0,
      // 0支付宝 1微信 2线下
      payWay: 0,
      // 二维码链接
      iframeSrc: "",
      /**
       * iframe加载
       */
      iframeLoading: true,
      // 订单id用来确认是否完成
      orderId: 0,

      // 检查是否支付完成的interval
      checkInterval: null,
      // 是否支付完成
      isPayFinish: false
    }
  },
  computed: {
    // 转换套餐数据为FlashSaleButton需要的格式
    planList() {
      return this.plans.map(plan => ({
        coin: plan.Name,
        amount: plan.Money,
        delAmount: "",
        days: plan.Days,
        plan: plan,
        id: plan.Id
      }));
    },
    currentUser() {
      let user = this.$store.state.auth.user;
      if (user == null) {
        return {}
      }
      return user;
    },
    currentEmployee() {
      let emp = this.$store.state.auth.employee;
      if (emp == null) {
        return {}
      }
      return emp;
    }
  },
  methods: {
    // 获取套餐列表
    async getPlans() {
      let res = await this.$http.get("/api/CargoRate/SelectMemberDispositionListInfo")
      if (res.Data && res.Data.length) {
        this.plans = res.Data;
        // 默认选择第一个套餐
        if (this.plans.length > 0) {
          this.chooseAmount(this.plans[0].Money, this.plans[0]);
        }
      } else {
        this.$message.error('暂无会员套餐')
      }
    },
    // 选择金额
    async chooseAmount(amount, plan) {
      this.selectedPlan = plan;
      this.activePlanId = plan.Id;
      this.activeAmount = amount
      return
      this.iframeLoading = true;
      let res = await this.$http.post("/api/PayOrder/CompanyRecharge", {
        Way: this.payWay,
        RechargeType: amount
      })
      if (!res.Status) {
        this.$message.error(res.Message ?? '失败')
        return;
      }

      this.iframeSrc = res.Data.Url;
      this.orderId = res.Data.OrderId;
      this.activeAmount = amount
    },
    // 检查支付状态
    async checkPayStatus() {
      if (this.isPayFinish) {
        clearInterval(this.checkInterval);
        return;
      }
      if (this.orderId === 0) {
        return;
      }

      let res = await this.$http.get("/api/PayOrder/GetOrderStatus", {
        orderId: this.orderId
      })
      if (res.Status == false) {
        console.error(res);
      } else {

        if (res.Data == -1) {
          // 已关闭
        }

        switch (res.Data) {
          // 已被关闭
          case -1:
            // 提示刷新界面
            this.isPayFinish = true;
            this.$alert('支付已过期请刷新页面', '刷新页面', {
              confirmButtonText: '刷新',
              showClose: false,
              type: "info",
              callback: (action) => {
                window.location.reload()
              },
            })
            break;
          // 待支付
          case 0:
          // 支付完成
          case 1:
          // 支付完成但是后续操作失败了
          case 2:
            // 什么也不做 等着
            // do nothing
            break
          // 后续操作也完成
          case 3:
            //  提示支付完成并跳转到个人中心
            this.isPayFinish = true;

            this.$alert('支付成功', '成功', {
              confirmButtonText: '完成',
              showClose: false,
              type: "success",
              callback: async (action) => {
                await this.$store.dispatch("pay/refreshBalance")
                if (utils.isFromJustomClient()) {
                  window.close()
                } else {
                  this.$router.push("/workbench/personal")
                }

              },
            })

            break;
        }


      }

    },
    // iframe加载完毕后 停止加载
    iframeOnload() {
      this.iframeLoading = false;
    },
    // iframe loading hook
    hookIframe(element) {
      if (element == null) {
        return;
      }
      element.onload = () => {
        this.iframeOnload()
      }
    },
    // 从RenewDialog复制的方法
    getNameByType(type) {
      const nameMap = {
        1: "搜运价",
        2: "找舱位",
        3: "查船期",
        4: "卖舱位",
        5: "箱跟踪"
      };
      return nameMap[type] || null;
    },
    getDescribeByType(type) {
      const describeMap = {
        1: "提供全球海运实时运价数据的查询比价",
        2: "提供基于用户需求的舱位资源智能匹配服务",
        3: "提供全球海运主要航线的船舶动态查询服务",
        4: "提供基于保舱服务的舱位库存智能撮合服务",
        5: "提供全球海运端到端全程物流跟踪订阅服务"
      };
      return describeMap[type] || null;
    },
    getTipByType(item) {
      if (!item || typeof item.Type !== 'number') {
        return '';
      }
      const nameMap = {
        1: "查询运价",
        2: "找舱位",
        3: "查船期",
        4: "卖舱位",
        5: "箱跟踪"
      };
      const typeName = nameMap[item.Type] || null;
      if (!typeName) {
        return '';
      }
      return item.Status
        ? `可免费${typeName}${item.Number}条`
        : `可无限次${typeName}`;
    },
    getIconUrl(name) {
      // 使用动态导入来获取图标文件
      return new URL(`./vipIcon/${name}.svg`, import.meta.url).href;
    },
  },
  mounted() {
    this.getPlans();

    this.checkInterval = setInterval(async () => {
      await this.checkPayStatus();
    }, 3000);
  },
  unmounted() {
    clearInterval(this.checkInterval);
  }
});
</script>

<style lang="scss" scoped>
.recharge-container {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
}

.main {
  flex: 1 1 auto;
  margin-left: 15px;
}

.hb-title {
  font-family: PingFangSC-Medium;
  font-size: 24px;
  color: #3c4144;
  letter-spacing: 0;
  line-height: 34px;
  font-weight: 500;
}

.desc-text {
  color: #969799;
  font-size: 14px;
}

.space-width {
  margin: 0 auto;
  width: 100%;
  border-bottom: 1px dashed #e4e7ed;
  padding-bottom: 20px;
}

.flex-box {
  display: flex;
}

.flex-box-wrap {
  width: 600px;
  display: flex;
  flex-wrap: wrap;
}

.detail-text {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #606266;
  font-weight: 400;
}

.real-price {
  font-family: HelveticaNeue-Medium;
  font-size: 24px;
  color: #fa6400;
  letter-spacing: -2px;
  font-weight: 500;
}

.pay-btn-box {
  width: 218px;
  height: 57px;
  border: 1px solid #ebecf0;
  border-radius: 8px;
  margin: 0 15px 15px 0;
  line-height: 55px;
  padding-left: 10px;
  cursor: pointer;

  img {
    vertical-align: middle;
  }
}

.pay-btn-box.active {
  background: #fffcf5;
  border: 1px solid #ebbf74;
  position: relative;
  overflow: hidden;

  &::after {
    content: "√";
    line-height: 14px;
    display: block;
    color: #ffffff;
    font-weight: 600;
    position: absolute;
    right: 2px;
    bottom: 2px;
  }

  &::before {
    content: "";
    display: block;
    width: 34px;
    height: 34px;
    background-color: #ebbf74;
    position: absolute;
    right: -17px;
    bottom: -17px;
    transform: rotate(45deg);
  }
}

.plan {
  min-width: 330px;
  padding: 20px 20px 10px;
  transition: all 0.3s ease-in-out;
  box-sizing: border-box;
  flex-shrink: 0;
  margin-left: -1px;

  &.self-hovered {
    border-color: #FD953E !important;
    box-shadow: 0 0 10px rgb(253, 149, 62, .3);
    position: relative;
    z-index: 1;
  }

  &.disable {
    cursor: not-allowed;
    opacity: 0.5;

    &:hover {
      border-color: #eaeaea !important;
      /* Revert all borders to original color */
      box-shadow: none !important;
    }
  }

  h3 {
    margin: 10px 0;
    color: #333;
    font-size: 22px;
  }

  p {
    color: rgba(0, 0, 0, 0.6);
    margin: 5px 0;
    font-size: 14px;
  }

  ul {
    height: 310px;
    list-style: none;
    padding: 0;
  }

  li {
    margin: 5px 0;
    font-size: 15px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);

    div {
      font-size: 14px;
      padding-left: 27px;
      font-weight: normal;
      color: rgba(0, 0, 0, 0.6);
    }

    img {
      width: 22px;
      vertical-align: middle;
      margin-bottom: 2px;
    }

    .tip {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      font-weight: normal;
    }
  }

  .price-Box {
    height: 80px;
    display: flex;
    justify-content: space-between;

    .type {
      img {
        width: 14px;
      }

      margin: 10px 0;
      height: 20px;
      display: flex;
      // align-items: center;
    }

    .price {
      font-size: 12px;
      margin: 10px 0;

      span {
        font-size: 14px;
        color: #000;
      }
    }
  }


  .title {
    font-size: 14px;
    width: 100%;
    height: 20px;
    border-bottom: 1px solid #eaeaea;
  }

  .btn {
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    margin: 15px auto 0;
    font-size: 18px;
    width: 270px;
    text-align: center;
    margin-bottom: 10px;
  }

  .open {
    color: #fff;
    background-image: linear-gradient(116deg, #e6a23c 8%, #f56c6c 100%);
  }

  .openExperience {
    margin-top: 10px;
    border: 1px solid #f56c6c;
    color: #f56c6c;
  }
}
</style>