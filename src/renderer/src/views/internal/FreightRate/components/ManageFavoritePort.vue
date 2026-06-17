<template>
  <div class="favorite-port-container">
    <!-- <div class="favorite-port-title">您常用的起运港是？</div>
    <div class="query-tag-group">
      <el-tag
        v-for="(item, index) in state.selectedPolPortList"
        :key="item.Id"
        class="query-tag"
        type=""
        :closable="state.selectedPolPortList.length > 1"
        @close="closePolPortTag(index)"
        >{{ item.EnPortName }}</el-tag
      >
      <el-select
        v-if="state.addPolPortVisible"
        v-model="state.polPortId"
        filterable
        @change="setPolPort"
        :filter-method="getPolPortList"
        size="mini"
        placeholder="请选择起运港"
        style="width: 120px; margin-right: 8px"
        class="freight-primary-select"
        popper-class="pol-dropdown"
      >
        <div class="option-title">支持中文/英文输入</div>
        <el-option
          v-for="item in state.polPortList"
          :key="item.Id"
          :label="`${item.EnPortName}(${item.CnPortName}，${item.Country})`"
          :value="item.Id"
        ></el-option>
      </el-select>
      <el-button
        v-if="!state.addPolPortVisible"
        type="text"
        @click="state.addPolPortVisible = true"
      >
        + 添加</el-button
      >
    </div> -->
    <div class="favorite-port-title" style="margin-top: -30px">您常用的目的港</div>
    <div>
      <div>
        <div style="position: relative">
          <el-input
            style="width: 200px"
            class="dest-port-select freight-primary-select"
            size="mini"
            v-model="state.destPortName"
            placeholder="请输入并选择目的港"
            @input="watchDestInput"
          ></el-input>
          <transition name="el-fade-in-linear">
            <div
              v-show="state.destPortListVisible"
              class="inputQuery"
              v-if="state.destPortName.length"
            >
              <div class="inputQuery-header">
                <div>支持中英文输入</div>
                <div></div>
              </div>
              <el-scrollbar max-height="300px" ref="inputPortScroll">
                <div
                  class="inputQuery-container"
                  v-for="(items1, index) in state.destPortList"
                  :key="index"
                >
                  <div
                    class="container-items"
                    v-for="(items2, index2) in items1.gangkou"
                    :key="index2"
                    @click="confirmQuery(items2.Id, items2)"
                    :class="items2.isActive ? 'active-port' : ''"
                  >
                    <div>{{ items2.EnPortName }}</div>
                    <div class="flex-right">
                      <div>{{ items2.CnPortName }}</div>
                      <div class="check-icon">
                        <el-icon v-if="items2.isActive" size="14"><Check /></el-icon>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="!state.destPortList.length" style="padding: 5px 10px">
                  暂无港口
                </div>
              </el-scrollbar>
            </div>
          </transition>
        </div>
        <FirstGuideDestPortContent
          style="margin-left: -7px;"
          ref="destPortContentRef"
          @selectFirstGuidePort="selectGuidePort"
          :selectDesPortData="state.selectedDestPortList"
          :allDesPort="state.destPortList"
          :isHistory="false"
          :type="1"
        ></FirstGuideDestPortContent>
      </div>
      <div class="favorite-port-title">我关注的目的港</div>
      <div class="query-tag-group">
        <el-tag
          v-for="(item, index) in state.selectedDestPortList"
          :key="item.Id"
          class="query-tag"
          type=""
          :closable="state.selectedDestPortList.length > 1"
          @close="closeDestPortTag(index)"
          >{{ item.EnPortName }}</el-tag
        >
      </div>
    </div>
  </div>
  <div
    class="inputQuery-back"
    v-show="state.destPortListVisible"
    @click="state.destPortListVisible = false"
  ></div>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onMounted,
  pushScopeId,
  watch,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";
import request from "@/public/request";
import { useStore } from "vuex";
import { ElLoading, ElMessage } from "element-plus";
import { Check } from "@element-plus/icons";
import AppDestPortContent from "@/components/AppDestPortContent.vue";
import FirstGuideDestPortContent from "./FirstGuideDestPortContent.vue";
import { utils } from "justom-share";

export default defineComponent({
  props: {
    show: { type: Boolean, default: false },
  },
  components: {
    AppDestPortContent,
    FirstGuideDestPortContent,
    Check,
  },
  setup(props, context) {
    const store = useStore();
    const router = useRouter();
    const destPortContentRef = ref(null);
    const inputPortScroll = ref(null);
    const state = reactive({
      //所有起始港
      polPortList: [],

      //所有目的港
      allDestPortList: [],
      //下拉框目的港
      destPortList: [],

      //已经选择起始港
      selectedPolPortList: [],

      //已经选择目的港
      selectedDestPortList: [],

      //目的港查询字段
      destPortName: "",
      //目的港查询加载
      searchLoading: false,

      //添加起运港选择框可视
      addPolPortVisible: false,

      //添加目的港选择框可视
      addDestPortVisible: false,

      //目的港下拉框可视
      destPortListVisible: false,
    });

    /**
     * 获取港口和初始化
     */
    const initPortList = async () => {
      await getDesPort("all");
      let selectedPort = await getFavoritePorts();
      state.selectedPolPortList = selectedPort.PolPorts;
      state.selectedDestPortList = selectedPort.DestPorts;
      destPortContentRef.value.loadPort(state.allDestPortList, selectedPort);
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
     * 获取起运港
     * @param {*}
     *
     */
    const getPortList = async (e) => {
      let keyword;
      e ? (keyword = e) : (keyword = "");
      let res = await request.get("/api/FRPort/GetFRPortList", {
        Page: -1,
        limit: -1,
        IsPol: true,
        PortName: keyword,
      });

      state.polPortList = res.Rows;
    };

    /**
     * 获取目的港
     * @param {*}
     *
     */
    const getDesPort = async (type) => {
      let url =
        type == "all"
          ? "/api/FRInquireCustomer/GetPortToList"
          : "/api/FRPortalPort/GetPortToList";
      const res = await request.get(url, {
        EnPortName: type == "all" ? "" : state.destPortName,
      });
      if (type == "all") {
        state.allDestPortList = res.Data;
      } else {
        state.destPortList = res.Data;
        state.selectedDestPortList.forEach((select) => {
          state.destPortList.forEach((line) => {
            line.gangkou.forEach((port) => {
              if (select.PortId == port.Id) {
                port.isActive = true;
              }
            });
          });
        });
      }
    };

    /**
     * 监听目的港输入框
     * @param {*}
     *
     */
    const watchDestInput = async () => {
      if (state.destPortName == "") {
        return (state.destPortListVisible = true);
      }
      state.destPortListVisible = true;
      await getDesPort();
      inputPortScroll.value.update();
    };

    /**
     * 选择添加目的港
     * @param {*}
     *
     */
    const confirmQuery = (Id, item) => {
      // setDestPort(item);
      item.isActive = !item.isActive;
      selectGuidePort(item);
    };

    const selectAppDesPort = (item) => {
      setDestPort(item);
    };
    const setDestPort = (item) => {
      state.addDestPortVisible = false;

      //查重
      let isRepeat = false;
      state.selectedDestPortList.forEach((dest) => {
        if (dest.PortId == item.Id) {
          isRepeat = true;
        }
      });
      if (isRepeat) {
        return ElMessage.warning("已经选择该目的港");
      }

      item.PortId = item.Id;
      state.selectedDestPortList.push(item);
      state.addDestPortVisible = false;
      state.destPortListVisible = false;
      state.destPortName = "";
      setPort();
    };

    const selectGuidePort = (item) => {
      if (item.isActive == true) {
        setPort(item, true);
      } else {
        if (state.selectedDestPortList.length <= 1) {
          item.isActive = !item.isActive;
          return ElMessage.warning("请至少选择一个常用目的港");
        }
        let index = 0;
        state.selectedDestPortList.forEach((port, idx) => {
          if (port.PortId ? port.PortId == item.Id : port.Id == item.Id) {
            index = idx;
            closeDestPortTag(index);
          }
        });
      }
    };
    /**
     * 添加起运港
     * @param {*}
     *
     */
    const setPolPort = (e) => {
      state.addPolPortVisible = false;
      state.polPortId = "";
      let port = state.polPortList.find((item) => item.Id == e);

      //查重
      let isRepeat = false;
      state.selectedPolPortList.forEach((item) => {
        if (item.PortId == port.Id) {
          isRepeat = true;
        }
      });
      if (isRepeat) {
        return ElMessage.warning("已经选择该起运港");
      }

      port.PortId = port.Id;
      state.selectedPolPortList.push(port);

      setPort();
    };

    /**
     * 删除起运港tag
     * @param {*}
     *
     */
    const closePolPortTag = async (index) => {
      state.selectedPolPortList.splice(index);
      setPort();
    };

    /**
     * 删除目的港tag
     * @param {*}
     *
     */
    const closeDestPortTag = async (index) => {
      state.selectedDestPortList.splice(index, "1");
      setPort();
    };

    /**
     * 设置关注
     * @param {*}
     *
     */
    const setPort = async (item, isCom) => {
      // if (!state.selectedPolPortList.length) {
      //   return ElMessage.warning("请选择一个常用起运港");
      // }
      if (item) {
        state.selectedDestPortList.push(item);
        state.selectedDestPortList = [...new Set(state.selectedDestPortList)];
      }
      if (!state.selectedDestPortList.length) {
        return ElMessage.warning("请至少选择一个常用目的港");
      }

      // let polPort = [];
      // state.selectedPolPortList.forEach((item) => {
      //   polPort.push(item.PortId);
      // });

      let destPort = [];
      state.selectedDestPortList.forEach((item) => {
        destPort.push(item.PortId ? item.PortId : item.Id);
      });

      let res = await request.post("/api/FRInquireFavoritePort/SetFavoritePorts", {
        PortIdList: destPort,
      });
      if (res.Status === true) {
        // return ElMessage.success("设置常用港口成功！");
        if (!isCom) {
          initPortList();
        }
      } else {
        return ElMessage.warning(res.Message);
      }
    };
    
    onMounted(async () => {
      nextTick(() => {
        initPortList();
      });
    });

    return {
      state,
      destPortContentRef,
      inputPortScroll,
      initPortList,
      getPortList,
      getFavoritePorts,
      getDesPort,
      watchDestInput,
      confirmQuery,
      selectAppDesPort,
      selectGuidePort,
      setPolPort,
      setPort,
      setDestPort,
      closePolPortTag,
      closeDestPortTag,
    };
  },
});
</script>

<style lang="scss" scoped>
.favorite-port-container {
  .favorite-port-title {
    font-size: 18px;
    color: #606266;
    font-weight: 500;
    line-height: 60px;
  }
  .query-tag-group {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: 22px;
    .query-tag-title {
      margin-right: 8px;
    }
    .query-tag {
      margin-right: 8px;
      height: 29px;
      line-height: 29px;
      background: #fcf1e7;
      color: #fd953e;
      border: none;
      margin-bottom: 8px;
      :deep(.el-tag__close) {
        color: #fd953e;
        &:hover {
          background: #fa7b13;
          color: white;
        }
      }
    }
  }
}
.inputQuery-back {
  z-index: 3;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.inputQuery {
  margin-top: 6px;
  padding: 0;
  border-radius: 4px;
  box-shadow: 1px 1px 10px #ccc;
  position: absolute;
  top: 25px;
  left: 0;
  width: 50%;
  z-index: 4;
  background: white;
  .inputQuery-header {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    background: #fd953e;
    color: white;
    padding: 6px 10px;
  }
  .container-items {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
    cursor: pointer;
    padding: 0 0 0 10px;
    .flex-right {
      display: flex;
      .check-icon {
        width: 30px;
        text-align: center;
      }
    }
  }
  .container-items:hover {
    background-color: #fcf1e7;
  }
}

.option-title {
  background: #fd953e;
  color: white;
  padding: 6px 10px;
}
</style>
<style lang="scss">
.pol-dropdown {
  .el-popper__arrow {
    display: none;
  }
  .el-select-dropdown__list {
    margin: 0 !important;
  }
  .el-select-dropdown__item:hover {
    background: #fcf1e7;
  }
}
.el-popover-class {
  padding: 0 !important;
  .el-popper__arrow {
    display: none;
  }
}
.active-port {
  color: #fd953e;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
