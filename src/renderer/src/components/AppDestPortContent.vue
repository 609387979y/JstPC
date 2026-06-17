<template>
  <div style="" v-loading="tabsLoading">
    <div class="destport-title" v-if="historyList.length && isHistory">
      <span class="destport-blue"></span>
      <span class="destport-words">历史查询</span>
    </div>
    <div class="destport-list" v-if="historyList.length && isHistory">
      <div
        class="destport-item"
        v-for="item in historyList"
        :key="item.Id"
        @click="selectPort(item)"
      >
        <div class="destport-cn">{{ item.CnPortName }}</div>
        <div class="destport-en">{{ item.EnPortName }}</div>
      </div>
    </div>
    <div v-if="!hideTitle" class="destport-title">
      <span class="destport-blue"></span>
      <span class="destport-words">推荐港口</span>
    </div>
    <el-tabs
      class="destport-tabs"
      v-model="activeName"
      :loading="tabsLoading"
      @tab-click="handleClick"
      v-if="type == 1"
    >
      <el-tab-pane
        v-for="item in portData"
        :key="item.Id"
        :label="item.LineName"
        :name="item.LineName"
      >
        <el-scrollbar class="destport-container">
          <div class="destport-list" style="padding: 0 7px 0">
            <div
              class="destport-item"
              v-for="child in item.gangkou"
              :key="child.Id"
              @click="selectPort(child)"
            >
              <div class="destport-cn">{{ child.CnPortName }}</div>
              <div class="destport-en">{{ child.EnPortName }}</div>
            </div>
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
    <el-tabs
      class="destport-tabs"
      v-model="activeName"
      :loading="tabsLoading"
      @tab-click="handleClick"
      v-if="type == 2"
    >
      <el-tab-pane
        v-for="item in portData"
        :key="item.LineName"
        :label="item.LineName"
        :name="item.LineName"
      >
        <div class="destport-list" style="padding: 0 7px 0">
          <div
            class="destport-item"
            v-for="child in item.PortList"
            :key="child.Id"
            @click="selectPort(child)"
          >
            <div class="destport-cn">{{ child.CnPortName }}</div>
            <div class="destport-en">{{ child.EnPortName }}</div>
          </div>
        </div>
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
      type: String,
      default: "",
    },
    type: {
      type: Number,
      default: 1,
    },
    isHistory: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      portData: [],
      activeName: "",
      historyList: [],
      tabsLoading: true,
    };
  },
  methods: {
    async getPort() {
      this.tabsLoading = true;
      let url = "";
      if (this.type == 1) {
        url = "/api/FRInquireCustomer/GetPortToList";
      } else if (this.type == 2) {
        url = "/api/DcPort/GetDcPort";
      }
      let res = await this.$http.get(url);
      this.portData = res.Data;
      this.activeName = res.Data[0].LineName;
      this.tabsLoading = false;
    },
    selectPort(item) {
      if (this.type == 1) {
        this.$emit("selectPort", item);
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
    this.getPort();
    this.initHistoryList();
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
    width: 18%;
    border-radius: 4px;
    border-radius: 4px;
    padding: 5px;
    margin-bottom: 16px;
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
