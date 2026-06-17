<template>
  <div class="first-guide-container">
    <div class="first-guide-card">
      <h1>选择您感兴趣的目的港</h1>
      <p>至少选择一个目的港，可随时调整</p>
      <ManageFavoritePort></ManageFavoritePort>
      <div class="btn-group-center">
        <div
          v-loading="loading"
          type="primary"
          @click="submit"
          class="freight-primary-btn"
          style="text-align: center"
        >
          开启您的运价之旅
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, } from "vue";
import ManageFavoritePort from "./components/ManageFavoritePort.vue";
import request from "@/public/request"
import { getElectronAgent } from "@share/agent";
import { ElMessage } from "element-plus"
export default defineComponent({
  components: {
    ManageFavoritePort,
  },

  setup(props, context) {
    const loading=ref(false)
    const agent = getElectronAgent();
    const submit = async () => {
      loading.value=true
      let res = await request.get("/api/FRInquireFavoritePort/GetFavoritePorts");
      loading.value=false
      // if(!res.PolPorts.length){
      //   return ElMessage.warning("请先设置至少一个起运港。")
      // }
      if(!res.DestPorts.length){
        return ElMessage.warning("请先设置至少一个目的港。")
      }
      context.emit('setPort')
      agent?.ipcRequest("freight/newWin", {
          type: "small",
          url: "/internalComponents/userAuthorization?type=freight",
        });
       
    };

   
    onMounted(async () => {
    });

    return {
      loading,
      submit
    };
  },
});
</script>

<style lang="scss" scoped>
.first-guide-container {
  padding: 50px 100px;

  .first-guide-card {
    background: #ffffff;
    border: 1px solid #f2f3f5;
    border-radius: 4px;
    padding: 40px 48px;
  }
  h1 {
    font-size: 28px;
    color: #303133;
    letter-spacing: 0;
    font-weight: 500;
    text-align: center;
    margin-top: -10px;
  }
  p {
    font-size: 18px;
    color: #969799;
    letter-spacing: 0;
    font-weight: 400;
    text-align: center;
    margin-top: -10px;
  }
  .first-guide-ask {
    font-size: 18px;
    color: #606266;
    letter-spacing: 0;
    font-weight: 500;
    margin-top: 30px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
  }
  .common-port {
    display: flex;
    flex-wrap: wrap;
    .common-port-item {
      background: #f2f3f5;
      border-radius: 2px;
      padding: 4px 14px;
      font-size: 14px;
      color: #3c4144;
      line-height: 22px;
      margin-right: 24px;
      margin-bottom: 16px;
      cursor: pointer;
    }
    .active {
      background: #fcf1e7;
      color: #fd953e;
    }
  }
}
.btn-group-center {
  text-align: center;
  .freight-primary-btn {
    background-color: #fd953e;
    color: white;
    line-height: 30px;
    padding: 0 10px;
    cursor: pointer;
    border-radius: 3px;
    display: inline-block;
    &:hover {
      background-color: #ffb374;
    }
  }
}
.inputQuery-container {
  .inputQuery-item {
    display: block;
  }
}
</style>
