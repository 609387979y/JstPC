<template>
  <div style="" v-loading="tabsLoading">
    <el-tabs
      class="destport-tabs"
      v-model="activeName"
      :loading="tabsLoading"
      @tab-click="handleClick"
      v-if="type == 1"
    >
      <el-tab-pane
        v-for="item in destPortList"
        :key="item.Id"
        :label="item.LineName"
        :name="item.LineName"
      >
        <el-scrollbar class="destport-container">
          <div class="destport-list" style="padding: 0 7px 0">
            <div
              class="destport-item"
              :class="child.isActive ? 'active' : ''"
              v-for="child in item.gangkou"
              :key="child.Id"
              @click="selectFirstGuidePort(child)"
            >
              <div class="destport-cn">{{ child.CnPortName }}</div>
              <div class="destport-en">{{ child.EnPortName }}</div>
            </div>
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    // 隐藏标题
    hideTitle: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: [],
    },
    type: {
      type: Number,
      default: 1,
    },
    isHistory: {
      type: Boolean,
      default: true,
    },
    selectDesPortData: {
      type: Array,
      default: [],
    },
    allDesPort:{
      type: Array,
      default: [],
    }
  },
  data() {
    return {
      portData: [],
      firstGuidePortList: [],
      destPortList:[],
      selectedPortList:[],
      activeName: "",
      historyList: [],
      tabsLoading: false,
    };
  },
  methods: {
    loadPort(destPortList,selectedPortList){
      this.destPortList=destPortList
      this.selectedPortList=selectedPortList.DestPorts
      this.selectedPortList.forEach((select) => {
        this.destPortList.forEach((element) => {
          element.gangkou.forEach((item) => {
            if(select.PortId==item.Id){
              item.isActive = true
            }
          });
        });
      });
      this.activeName = this.destPortList[0].LineName;
    },
    /**
     * 获取港口和初始化
     */
    async getPort() {
      this.tabsLoading = true;

      //初始化

      // let res = await this.$http.get("/api/FRPortalPort/GetPortToList");
      // this.selectDesPortData.forEach((select) => {
      //   this.allDesPort.forEach((element) => {
      //     element.gangkou.forEach((item) => {
      //       item.isActive = false;
      //     });
      //   });
      // });

      // this.portData = res.Data;
      // this.activeName = res.Data[0].LineName;

      this.tabsLoading = false;
    },

    /**
     * 第一种接口选择港口
     */
    selectFirstGuidePort(item) {
      
      item.isActive = !item.isActive;
      this.$emit("selectFirstGuidePort", item);
      
    },

    /**
     * 第二种接口选择港口
     */
    selectPort(item) {
      if (this.type == 1) {
        this.$emit("selectPort", item.Id);
        let historyList = this.historyList;
        for (let i in historyList) {
          if (historyList[i].Id == item.Id) {
            historyList.splice(i, 1);
          }
        }
        historyList.unshift(item);
        if (historyList.length > 5) {
          historyList.pop();
        }
        this.historyList = historyList;
        localStorage.setItem("destPortHistory", JSON.stringify(historyList));
      } else if (this.type == 2) {
        this.$emit("selectPort", item.EnPortName);
        let historyList = this.historyList;
        for (let i in historyList) {
          if (historyList[i].EnPortName == item.EnPortName) {
            historyList.splice(i, 1);
          }
        }
        historyList.unshift(item);
        if (historyList.length > 5) {
          historyList.pop();
        }
        this.historyList = historyList;
        localStorage.setItem("destPortDcHistory", JSON.stringify(historyList));
      }
    },

    /**
     * 初始化历史选择港口
     */
    initHistoryList() {
      if (this.type == 1) {
        let historyList = localStorage.getItem("destPortHistory");
        if (historyList) {
          historyList = JSON.parse(historyList);
          this.historyList = historyList;
        } else {
          this.historyList = [];
        }
      } else if (this.type == 2) {
        let historyList = localStorage.getItem("destPortDcHistory");
        if (historyList) {
          historyList = JSON.parse(historyList);
          this.historyList = historyList;
        } else {
          this.historyList = [];
        }
      }
    },

    /**
     * 搜索关键字
     */
    searchKeywords(list, keyWord) {
      var arr = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].label.indexOf(keyWord) >= 0) {
          arr.push(list[i]);
        }
      }
      return arr;
    },
  },
  computed: {},
  mounted() {
  
  },
};
</script>

<style lang="scss" scoped>
.destport-title {
  .destport-blue {
    display: inline-block;
    background: #fd953e;
    width: 3px;
    height: 12px;
    border-radius: 2px;
    margin-right: 4px;
  }
  .destport-words {
    font-size: 16px;
    color: #303133;
    font-weight: bold;
  }
}
.destport-container {
  max-height: 300px;
  overflow: auto;
}
.destport-list {
  display: flex;
  padding: 16px 7px 0px;
  line-height: 20px;
  flex-direction: row;
  flex-wrap: wrap;

  .destport-item {
    width: 17%;
    border-radius: 4px;
    border-radius: 4px;
    padding: 5px;
    margin-bottom: 8px;
    margin-right: 8px;
    transition: 0.3s;
    .destport-cn {
      font-size: 12px;
      color: #606266;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: 0.3s;
    }
    .destport-en {
      font-size: 12px;
      color: #3c4144;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: 0.3s;
    }
  }
  .active {
    .destport-cn {
      color: #fba761;
    }
    .destport-en {
      color: #fba761;
    }
    background: #fcf1e7;

    cursor: pointer;
  }
  .destport-item:hover {
    .destport-cn {
      color: #fba761;
    }
    .destport-en {
      color: #fba761;
    }
    background: #fcf1e7;

    cursor: pointer;
  }
}
.destport-tabs {
  :deep(.el-tabs__header) {
    margin: 0 0 15px 10px;
  }
  :deep(.el-tabs__item.is-active) {
    color: #fd953e;
    &:hover {
      color: #fd953e;
    }
  }
  :deep(.el-tabs__item) {
    &:hover {
      color: #fd953e;
    }
  }
  :deep(.el-tabs__active-bar) {
    background-color: #fd953e;
  }
}
</style>
