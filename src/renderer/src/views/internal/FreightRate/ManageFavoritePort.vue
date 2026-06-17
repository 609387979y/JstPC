<template>
  <el-dialog v-model="state.show" width="800px">
    <div class="favorite-title" style="margin-top: -40px">关注的起运港</div>
    <div class="common-port">
      <div
        v-for="item in state.polPortData"
        :key="item.Id"
        @click="selectFirstGuidePolPort(item)"
        class="common-port-item"
        :class="item.isActive ? 'active' : ''"
      >
        {{ item.EnPortName }},{{ item.Country }}({{ item.CnPortName }})
      </div>
    </div>
    <div class="favorite-title">
      <div>关注的目的港</div>
      <div>
        <el-popover
          width="auto"
          trigger="click"
          v-model:visible="state.destPortVisible"
          class="el-popover"
          popper-class="el-popover-class"
        >
          <template #reference>
            <el-input
              class="dest-port-select"
              size="mini"
              v-model="state.destPortName"
              @input="getEndPortQuery"
              placeholder="请输入目的港"
            ></el-input>
          </template>
          <el-scrollbar
            class="inputQuery-container"
            max-height="320px"
            v-loading="state.searchLoading"
          >
            <div v-for="(items1, index) in inputQueryList" :key="index">
              <el-checkbox
                class="inputQuery-item"
                v-for="(items2, index2) in items1.gangkou"
                v-model="items2.isActive"
                :key="index2"
                @change="changeAcitve(items2)"
                >{{ items2.CnPortName }}/{{ items2.EnPortName }}</el-checkbox
              >
            </div>
            <div v-if="!inputQueryList.length && !state.destPortName">
              请输入目的港进行查询
            </div>
            <div v-if="!inputQueryList.length && state.destPortName">未查询到港口</div>
          </el-scrollbar>
        </el-popover>
      </div>
    </div>
    <FirstGuideDestPortContent
      @selectFirstGuidePort="selectFirstGuidePort"
      :selectDesPortData="state.selectDesPortData"
      :hideTitle="true"
      :isHistory="false"
    ></FirstGuideDestPortContent>
    <div class="btn-group-center">
      <el-button @click="close()">放弃修改</el-button>
      <div
        type="primary"
        @click="submit"
        class="freight-primary-btn"
        style="margin-left: 6px"
      >
        保存关注
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onMounted,
  pushScopeId,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import request from "@/public/request";
import { useStore } from "vuex";
import { ElLoading } from "element-plus";
import { ElMessage } from "element-plus";
import { Minus, Close } from "@element-plus/icons";
import FirstGuideDestPortContent from "./components/FirstGuideDestPortContent.vue";
import {utils} from "justom-share"
export default defineComponent({
  props: {
    show: { type: Boolean, default: false },
  },
  components: {
    Minus,
    Close,
    FirstGuideDestPortContent,
  },
  setup(props, context) {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      //传入目的港组件
      selectDesPortData: [],
      polPortData: [],
      //目的港选择组件列表
      selectPortData: [],

      selectPolPortList: [],
      //关注的目的港列表
      selectDesPortList: [],
      selectPortList: [],
      isSubmit: false,
      show: false,
      //目的港查询悬浮框
      destPortVisible: false,
      //目的港查询字段
      destPortName: "",
      //目的港查询加载
      searchLoading: false,
    });

    //监听是否打开弹框
    watch(
      () => props.show,
      (newVal, oldVal) => {
        state.show = newVal;
        if (newVal === true) {
          getPortList();
        }
      }
    );

    //关闭弹窗
    function close() {
      context.emit("close");
      // props.templateSync=false
    }

    /**
     * 获取港口和初始化
     */
    const getPortList = async () => {
      let res = await request.get("/api/FRPort/GetFRPortList", {
        Page: -1,
        limit: -1,
        IsPol: true,
      });
      res.Rows.forEach((item) => {
        item.isActive = false;
      });

      state.polPortData = res.Rows;
      let selectedPort = await getFavoritePorts();
      let desPort = await getDesPort();
      state.selectPolPortList = [];
      //初始化起运港
      selectedPort.PolPorts.forEach((element) => {
        state.selectPolPortList.push(element.PortId);
        state.polPortData.forEach((item) => {
          if (element.PortId == item.Id) {
            item.isActive = true;
          }
        });
      });

      //初始化目的港
      for (let item of selectedPort.DestPorts) {
        for (let line of desPort) {
          for (let des of line.gangkou) {
            if (des.Id == item.PortId) {
              des.isActive = true;
              des.isModified = true;
            } else if (!des.isModified) {
              des.isActive = false;
            }
          }
        }
      }
      state.selectDesPortList = selectedPort.DestPorts;
      state.selectDesPortData = desPort;
    };

    /**
     * 选择起运港口
     */
    const selectFirstGuidePolPort = (item) => {
      item.isActive = !item.isActive;
      let isExist = false;
      state.selectPolPortList.forEach((element, index) => {
        if (element == item.Id) {
          state.selectPolPortList.splice(index, 1);
          isExist = true;
        }
      });
      if (!isExist) {
        state.selectPolPortList.push(item.Id);
      }
    };

    /**
     * 选择目的港
     */
    const selectFirstGuidePort = (selectPortList: any) => {
      state.selectDesPortData = selectPortList;

    };

    /**
     * 获取目的港
     */
    const submit = async () => {
      let desPort = [];

      state.selectDesPortData.forEach((line) => {
        line.gangkou.forEach((des) => {
          if (des.isActive) {
            desPort.push(des.Id);
          }
        });
      });
      if (!state.selectPolPortList.length) {
        return ElMessage.warning("请选择一个常用起运港");
      }
      if (!desPort.length) {
        return ElMessage.warning("请选择一个常用目的港");
      }

      let res = await request.post("/api/FRInquireFavoritePort/SetFavoritePorts", {
        PortIdList: [...state.selectPolPortList, ...desPort],
      });
      if (res.Status === true) {
        state.isSubmit = true;
        close();
        return ElMessage.success("设置常用港口成功！");
      }
    };

    /**
     * 获取关注列表
     * @param {*}
     *
     */
    const getFavoritePorts = async () => {
      let res = await request.get("/api/FRInquireFavoritePort/GetFavoritePorts");
      return res;
    };

    /**
     * 获取目的港
     * @param {*}
     *
     */
    const getDesPort = async () => {
      let url = "";
      url = "/api/FRPortalPort/GetPortToList";
      let res = await request.get(url);
      return res.Data;
    };

    /**
     * 关键词查询目的港
     * @param {*}
     *
     */
    const inputQueryList = ref([]);

    const getEndPortQuery=utils.debounce(async()=>{
      if (!state.destPortName) {
          inputQueryList.value = [];
          return;
        }

        state.destPortVisible = true;
        state.searchLoading = true;

        const res = await request.get("/api/FRPortalPort/GetPortToList", {
          EnPortName: state.destPortName,
        });

        inputQueryList.value = res.Data;
        //初始化下拉列表目的港
        initEndPortQuery();
        state.searchLoading = false;

      },500);

    /**
     * 初始化下拉列表目的港
     * @param {*}
     *
     */
    async function initEndPortQuery() {
 
      state.selectDesPortList.forEach((des1) => {
        inputQueryList.value.forEach((line) => {
          line.gangkou.forEach((des2) => {
            if (des2.Id == des1.PortId) {
              des2.isActive = true;
            }
          });
        });
      });
    }

    /**
     * 选择查询的目的港
     * @param {*}
     *
     */
    function changeAcitve(item) {
      state.selectDesPortData.forEach((line) => {
        if (line.PortLineId == item.PortLineId) {
          line.gangkou.forEach((des) => {
            if (item.Id == des.Id) {
              des.isActive = item.isActive;
            }
          });
        }
      });
    }

    onMounted(async () => {
      getPortList();
    });

    return {
      state,
      submit,
      getPortList,
      selectFirstGuidePort,
      getFavoritePorts,
      getDesPort,
      selectFirstGuidePolPort,
      close,
      inputQueryList,
      getEndPortQuery,
      changeAcitve,
    };
  },
});
</script>

<style lang="scss" scoped>
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
.favorite-title {
  font-size: 14px;
  color: #606266;
  letter-spacing: 0;
  font-weight: bold;
  margin-bottom: 20px;
  padding-left: 8px;
  display: flex;
  justify-content: space-between;
}
.common-port {
  display: flex;
  padding-left: 8px;
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

.btn-group-center {
  text-align: center;
  margin-top: 8px;
  .freight-primary-btn {
    background-color: #fd953e;
    color: white;
    line-height: 30px;
    font-size: 12px;
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
