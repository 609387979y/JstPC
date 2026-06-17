<template>
  <el-dialog
    v-model="show"
    :before-close="beforeClose"
    :title="title"
    width="521px"
  >
    <div class="info">
      <div class="title">主提单号：{{ confirmData.CGO_MBL_NO }}</div>
      <div class="item" style="margin-bottom: 6px">
        <div>船司:{{ confirmData.Shipping }}</div>
        <div>所属船代：{{ confirmData.ShipAgentName }}</div>
      </div>
      <div class="item">
        <div>船名：{{ confirmData.CGO_VES }}</div>
        <div>航次：{{ confirmData.CGO_VOY }}</div>
      </div>
    </div>
    <div class="tip">发送清单</div>
    <div class="list">
      <!-- <el-table border stripe :data="confirmData.Items">
        <el-table-column prop="index" label="序号">
          <template #default="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="CGO_MBL_NO" label="单号"></el-table-column>
        <el-table-column prop="Amount" label="价格"></el-table-column>
      </el-table> -->
      <div class="list-top">
        <div class="list-top-item">序号</div>
        <div class="list-top-item">单号</div>
        <div class="list-top-item">价格</div>
      </div>
      <div class="list-box">
        <div class="list-item" v-for="(item, index) in confirmData.Items">
          <div class="list-item-div">{{ index + 1 }}</div>
          <div class="list-item-div">{{ item.CGO_MBL_NO }}</div>
          <div class="list-item-div">
            <img src="../../../../assets/images/icon-gold.svg" />{{
              item.Amount
            }}
          </div>
        </div>
      </div>
      <div class="list-bottom">
        <div class="list-bottom-text">共计消费</div>
        <div class="list-bottom-num">
          <img src="../../../../assets/images/icon-gold.svg" />{{
            confirmData.TotalAmount
          }}
        </div>
      </div>
      <!-- 共计消费: {{ confirmData.TotalAmount }} -->
    </div>
    <div style="text-align: right">
      <!-- <div style="display:flex">
      <span>当前余额:</span>
    <span> <img src="../../../../assets/images/icon-gold.svg" /></span>
    <span>   {{
        $store.state.pay.balance
      }}</span>
  
      <el-link type="primary" :underline="false"> 充值 </el-link>
    </div>
   -->
    </div>
    <div class="btns">
      <el-button @click="clickCancel" size="small">还要修改</el-button>

      <template v-if="amountEnough">
        <el-button size="small" @click="clickConfirm" type="primary"
          >确认发送</el-button
        >
      </template>
      <template v-else>
        <el-button size="small" disabled>余额不足</el-button>
        <el-button @click="toRecharge" size="small" type="primary"
          >去充值</el-button
        >
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { ElMessage } from "element-plus";
import { defineComponent } from "vue";
export default defineComponent({
  props: {},
  data() {
    return {
      show: false,
      confirmData: {
        CGO_MBL_NO: "",
        CGO_VES: "",
        CGO_VOY: "",
        ShipAgent: "",
        Shipping: "",
        TotalAmount: "",
        Items: [],
      },
      // 0-> 新建  1->编辑  2->删除
      type: 0,

      /**
       * 金额是否足够
       */
      amountEnough: true,
      amountInterval: null,
    };
  },
  emits: ["confirm", "cancel"],
  methods: {
    async showConfirmDialog(model) {
      let res = await this.$http.post(
        "/api/CargoEDISHManifest/CalcSendAmount",
        model
      );
      if (res.Status == false) {
        ElMessage.error(res.Message);
        return;
      }

      this.confirmData = res.Data;
      this.checkAmountEnough();
      this.type = 0;
      this.show = true;
    },
    /**
     * 显示付费确认框  更新/删除
     * type 1->更新  2->删除
     */
    async showConfirmDialogModifyOrDelete(id, type) {
      let res = await this.$http.get(
        "/api/CargoEDISHManifest/CalcModifyOrDeleteAmount",
        {
          mainfestId: id,
          type: type,
        }
      );
      if (res.Status == false) {
        ElMessage.error(res.Message);
        return;
      }

      this.type = type;
      this.confirmData = res.Data;
      this.checkAmountEnough();
      this.show = true;
    },
    async showConfirmDialogModifyOrDelete2(model) {
      let res = await this.$http.post(
        "/api/CargoEDISHManifest/CalcModifyAmount",
        model
      );
      if (res.Status == false) {
        ElMessage.error(res.Message);
        return;
      }

      this.type = 1;
      this.confirmData = res.Data;
      this.checkAmountEnough();
      this.show = true;
    },
    clickConfirm() {
      this.show = false;
      this.$emit("confirm");
    },
    clickCancel() {
      this.show = false;
      this.$emit("cancel");
    },
    beforeClose(done) {
      this.clickCancel();
      done();
    },
    /**
     * 检查金额是否足够
     */
    async checkAmountEnough() {
      let res = await this.$http.get("/api/PayWallet/GetWalletBalance");
      let amount = parseInt(res.Data);
      let needAmount = parseInt(this.confirmData.TotalAmount);
      if (amount >= needAmount) {
        this.amountEnough = true;
      } else {
        this.amountEnough = false;
      }
    },

    toRecharge() {
      this.$agent()?.ipcRequest(
        "external/external",
        `/rechargeWeb?type=recharge`
      );
    },
  },
  activated() {
    this.amountInterval = setInterval(() => {
      this.checkAmountEnough();
    }, 3000);
  },
  deactivated() {
    clearInterval(this.amountInterval);
  },
  computed: {
    title() {
      if (this.type == 0) {
        return "发送舱单";
      } else if (this.type == 1) {
        return "更新舱单";
      } else if (this.type == 2) {
        return "删除舱单";
      }
      return "";
    },
  },
});
</script>

<style lang="scss" scoped>
.info {
  background: #f9fafb;
  font-size: 12px;
  color: #8fa4b2;
  letter-spacing: -0.86px;
  font-weight: 400;
  text-align: center;
  padding: 16px 0px;
  margin-bottom: 8px;
  margin-top: -20px;
  line-height: 17px;
  .title {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: -0.86px;
    font-weight: 500;
    margin-bottom: 11px;
  }
  .item {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    div {
      flex: 1;
    }
    div:first-child {
      text-align: right;
      box-sizing: border-box;
      padding-right: 12px;
    }
    div:nth-child(2) {
      text-align: left;
      box-sizing: border-box;
      padding-left: 12px;
    }
  }
}
.tip {
  line-height: 17px;
  font-size: 12px;
  color: #3c4144;
  letter-spacing: 0;
  font-weight: 500;
  margin: 8px 0 4px 0;
}
.list {
  .list-top {
    background: #f8f8f8;
    height: 25px;
    display: flex;
    .list-top-item {
      line-height: 25px;
      font-size: 12px;
      color: #969799;
      letter-spacing: -0.86px;
      font-weight: 400;
      box-sizing: border-box;
      padding: 0 8px;
    }
    .list-top-item:first-child {
      width: 47px;
    }
    .list-top-item:nth-child(2) {
      flex: 1;
    }
    .list-top-item:nth-child(3) {
      width: 139px;
      padding-right: 12px;
      text-align: right;
    }
  }
  .list-box {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #e4e7ed;
    border-bottom: none;

    .list-item {
      height: 25px;
      border-bottom: 1px solid #e4e7ed;
      display: flex;
      .list-item-div {
        line-height: 24px;
        font-size: 12px;
        color: #000000;
        letter-spacing: -0.86px;
        font-weight: 500;
        padding: 0 8px;
        box-sizing: border-box;
      }
      .list-item-div:first-child {
        width: 47px;
        border-right: 1px solid #e4e7ed;
      }
      .list-item-div:nth-child(2) {
        flex: 1;
      }
      .list-item-div:nth-child(3) {
        width: 139px;
        text-align: right;
        padding-right: 11px;
        font-size: 16px;
        color: #606266;
        letter-spacing: -1.33px;
        font-weight: 500;

        display: flex;
        justify-content: right;
        align-items: center;
        img {
          width: 10px;
          height: 10px;
          margin-right: 4px;
        }
      }
    }
  }
  .list-bottom {
    width: 100%;
    height: 40px;
    border: 1px solid #e4e7ed;
    box-sizing: border-box;
    border-top: none;
    display: flex;
    .list-bottom-text {
      flex: 1;
      box-sizing: border-box;
      border-right: 1px solid #e4e7ed;
      line-height: 39px;
      font-size: 12px;
      color: #3c4144;
      letter-spacing: -0.86px;
      text-align: right;
      font-weight: 400;
      padding-right: 8px;
    }
    .list-bottom-num {
      width: 139px;
      box-sizing: border-box;
      padding-right: 11px;
      font-size: 28px;
      color: #fa6400;
      letter-spacing: -2.33px;
      font-weight: bold;
      display: flex;
      justify-content: right;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
        margin-right: 4px;
      }
    }
  }
}
.btns {
  text-align: center;
  margin-top: 16px;
}
</style>
