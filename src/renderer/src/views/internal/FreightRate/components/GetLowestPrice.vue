<template>
  <div class="dialog-container">
    <el-dialog
      v-model="dialog.dialogVisible"
      title="Tips"
      width="600px"
      :close-on-click-modal="false"
      :before-close="dialog.handleClose"
    >
      <template #title>
        <div class="dialog-title">
          <div>已向 <img
          style="width: 100px; margin: 0 8px"
          src="@/assets/images/company-mohu.png"
          alt=""
        /> 公司获取底价</div>
        </div>
      </template>
      <div class="body">
        <el-alert
          style="margin-bottom: 10px"
          title="success alert"
          type="info"
          show-icon
          :closable="false"
        >
          <template #title>
            <div class="alert-title alert-title2">
              当对方报价后即可查看承运人公司信息；可通过询价沟通查看底价并与承运人联系
            </div>
          </template>
        </el-alert>
        <div class="port">
          <div class="title">
            有效期：{{ dialog.priceInfo.Info.StartTime.substring(0, 10) }}
            -
            {{ dialog.priceInfo.Info.EndTime.substring(0, 10) }}
          </div>
          <div class="title2">
            <!-- 船司信息 -->
            <span
              ><img class="ship-logo" :src="dialog.priceInfo.Info.ShippingLogo" alt="" />
              &nbsp;&nbsp;</span
            >
            <span>{{ dialog.priceInfo.Info.CnShippingName }}</span>
            <span>{{ dialog.priceInfo.Info.ShippingCode }} &nbsp;&nbsp;</span>
            <span>
              截关开航：{{ dialog.weekCn[dialog.priceInfo.Info.CSTDate-1] }}/{{
                dialog.weekCn[dialog.priceInfo.Info.ETDDate-1]
              }}
            </span>
          </div>
          <div class="city">
            <div class="name">
              <div>{{ dialog.priceInfo.Info.PolEnPortName }}</div>
              <div>{{ dialog.priceInfo.Info.PolCnPortName }}</div>
            </div>
            <div class="bar">
              <div style="text-align: center">{{ dialog.priceInfo.Info.LineDay }} 天</div>
              <div style="width: 100px">
                <div class="plugin-icon">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
            <div class="name">
              <div>{{ dialog.priceInfo.Info.DestEnPortName }}</div>
              <div>{{ dialog.priceInfo.Info.DestCnPortName }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="freight-default-button" @click="$emit('colseDrawer'),dialog.dialogVisible = false,dialog.goConsultPrice()">查看询价沟通</el-button>
          <el-button @click="$emit('colseDrawer'),dialog.dialogVisible = false,$store.dispatch('message/getUnReadMessageCount')" style="background: #fd953e" type="warning"
            >继续询价</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import request from "@/public/request.ts";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
/*唤起&关闭对话框*/
function dialogs() {
  const router = useRouter();
  const dialogVisible = ref(false);
  const priceInfo = ref(null);
  const weekCn = reactive(["周一", "周二", "周三", "周四", "周五", "周六", "周日"]);
  const returnId=ref(null)
  const store = useStore();
  function handleClose() {
    dialogVisible.value = false;
    store.dispatch("message/getUnReadMessageCount");
  }
  function handleOpen(Info,Id) {
    priceInfo.value = Info;
    returnId.value=Id
    dialogVisible.value = true;
  }
  function goConsultPrice(){

      router.push({
        path: "/freightRate/ConsultPrice",
        query: {
          id: returnId.value
        }
      })
  }
  //   async function getData(Id) {
  //     const res = await request.get("/api/FRRate/GetRateString", {
  //       RateId: Id,
  //     });
  //     offerPirceText.value = res.Data;
  //   }

  return reactive({
    priceInfo,
    weekCn,
    dialogVisible,
    handleClose,
    handleOpen,
    goConsultPrice,
  });
}
export default defineComponent({
  name: "inquiryPriceDialog",
  setup(props) {
    const dialog = dialogs();

    return {
      dialog,
    };
  },
});
</script>

<style scoped lang="scss">
.dialog-title {
  font-size: 14px;
  color: #303133;
  font-weight: bold;
  div{
    display: flex;
  }
}
.body {
  margin-top: -20px;
  :deep(.el-alert--info) {
    background: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 4px;
    color: #409eff;
  }
  .port {
    background: #f9fafb;
    box-sizing: border-box;
    width: 100%;
    height: 170px;
    padding: 20px;

    .title {
      text-align: center;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
    }
    .title2 {
      justify-content: center;
      font-size: 12px;
      color: #8fa4b2;
      text-align: center;
      margin-top: 13px;
      display: flex;
      align-items: center;
    }
    .city {
      display: flex;
      justify-content: space-around;
      margin-top: 24px;
      font-size: 14px;
      color: #3c4144;
      font-weight: 500;
      .bar {
        .plugin-icon {
          display: flex;
          justify-content:center;
          align-items: center;
          div:nth-child(1) {
            width: 7px;
            height: 7px;
            border: 1px solid #fd953e; /*var(--freight-layout-primary-color)*/
            border-radius: 50%;
          }
          div:nth-child(2) {
            height: 0;
            border: 1px solid #fd953e;
            width: 75%;
          }
          div:nth-child(3) {
            width: 7px;
            height: 7px;
            border: 1px solid #fd953e; /*var(--freight-layout-primary-color)*/
            border-radius: 50%;
          }
        }
      }

      .name {
        
        div {
          height: 25px;
          line-height: 25px;
        }
      }
    }
    .cost {
      width: 100%;
      margin-top: 28px;
      box-sizing: border-box;
      padding: 0 0 24px 0;
      border-top: 1px solid #e4e7ed;
      border-bottom: 1px solid #e4e7ed;
    }
  }
}
.ship-logo {
  width: 70px;
}
</style>
