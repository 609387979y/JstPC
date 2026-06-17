<template>
  <el-dialog v-model="manageSubVisible" width="600px">
    <div class="desPort-selectde-content">
      <el-input class="sub-select" v-model="search.destPortName" clearable placeholder="请选择您想关注的目的港口"
        @input="watchInput"></el-input>
      <!-- <div
        class="sub-port-btn dialog-sub-btn"
        @click="setFavoritePorts"
        v-show="search.destPortName"
      >
        <img src="@/assets/customWorkbench/add.svg" alt="" />
        添加关注
      </div> -->
    </div>
    <div class="inputQuery" v-if="search.destPortName.length" v-loading="pageLoading">
      <div class="inputQuery-header" :class="isFreightLayout ? 'inputQuery-header-freight' : ''">
        <div>支持中英文输入</div>
        <div>操作</div>
      </div>
      <el-scrollbar max-height="330px">
        <div class="inputQuery-container" v-for="(items1, index) in inputQueryList" :key="index">
          <div :class="isFreightLayout ? 'container-items-freight' : 'container-items'"
            v-for="(items2, index2) in items1.gangkou" :key="index2">
            <div>
              {{ items2.CnPortName }}&nbsp;{{ items2.EnPortName }}&nbsp;{{
                items2.EnChauName
              }}
            </div>

            <div class="del-sub-btn" v-if="items2.isFav" @click="setFavoritePorts(items2, 'del')">
              <img src="@/assets/customWorkbench/del.svg" alt="" />
              取消关注
            </div>
            <div class="sub-port-btn dialog-sub-btn" @click="setFavoritePorts(items2, 'add')" v-else>
              <img src="@/assets/customWorkbench/add.svg" alt="" />
              添加关注
            </div>
          </div>
        </div>
        <div v-if="!inputQueryList.length" style="padding: 5px 10px">暂无港口</div>
      </el-scrollbar>
    </div>
    <div class="sub-port-group" v-else-if="favPortList.length">
      <div class="fav-title">我的关注</div>
      <div class="sub-port-item" v-for="item in favPortList" :key="item.PortId">
        <div class="sub-port-item-title">
          <img src="@/assets/images/port_02_orange.svg" alt="" />
          <div>{{ item.EnPortName }} ({{ item.CnPortName }})</div>
        </div>

        <div class="del-sub-btn" @click="delFavPort(item.PortId)">
          <img src="@/assets/customWorkbench/del.svg" alt="" />
          删除关注
        </div>
      </div>
    </div>

    <div class="no-fav-content" v-else>
      <img src="@/assets/customWorkbench/undraw_add_to_cart_re_wrdo.svg" alt="" />
      <div class="no-fav-tips">添加您常用的目的港口，方便您快速查询运价</div>
      <!-- <div class="sub-port-btn" @click="openFavManageDialog">
        <img src="@/assets/customWorkbench/add.svg" alt="" />
        添加关注
      </div> -->
    </div>
  </el-dialog>
</template>

<script>
import { defineComponent, ref, watch, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@/public/request";
import tools from "@/utils/Utils";
import { useStore, Store } from "vuex";
import { ArrowRight } from "@element-plus/icons";
export default defineComponent({
  components: {
    ArrowRight,
  },
  data() {
    return {
      companyList: [],
      pageLoading: false,
      manageSubVisible: false,
      destPortVisible: false,
      search: {
        DestPortId: "",
        destPortName: "",
      },
      isFreightLayout: true,
      destPortName: "",
      inputQueryList: [],
      inputQueryListAll: [],
      favPortList: [],
      favLimitPortList: [],
      portOverLimit: false,
    };
  },
  methods: {
    openDialog() {
      this.manageSubVisible = true;
    },
    selectDesPort(id, item) {
      this.search.DestPortId = item.Id;
      this.search.destPortName = item.EnPortName;
      this.watchInput();
      this.destPortVisible = false;
    },
    confirmQuery(Id, value) {
      this.destPortVisible = false;
      this.search.DestPortId = Id;
      this.search.DestPortId = Id;
      this.search.destPortName = value;
      this.destPortName = value;
    },
    formatQueryList() {
      this.inputQueryList.forEach((line) => {
        line.gangkou.forEach((item) => {
          if (this.favPortList.length > 0) {
            let favPort = null;
            favPort = this.favPortList.find((item2) => {
              return item2.PortId == item.Id;
            });
            console.log(favPort, 'favport')
            if (favPort) {
              item.isFav = true;
            } else {
              item.isFav = false;
            }
          } else {
            item.isFav = false;
          }
        });
      });
    },
    async getEndPortQuery() {
      const res = await request.get("/api/FRPortalPort/GetPortToList", {
        EnPortName: this.search.destPortName,
      });
      this.inputQueryList = res.Data;
      this.formatQueryList();
    },
    async getEndPortQueryAll() {
      const res = await request.get("/api/FRPortalPort/GetPortToList", {
        EnPortName: "",
      });
      this.inputQueryListAll = res.Data;
    },
    async getFavoritePorts() {
      this.pageLoading = true;
      const res = await request.get("/api/FRInquireFavoritePort/GetFavoritePorts");
      this.pageLoading = false;
      this.favPortList = res.DestPorts;
      this.favLimitPortList = res.DestPorts;
      if (res.DestPorts.length > 7) {
        this.favLimitPortList = this.favLimitPortList.slice(0, 7);
        this.portOverLimit = true;
      } else {
        this.portOverLimit = false;
      }
    },
    delFavPort(Id) {
      this.favPortList = this.favPortList.filter((item) => {
        return item.PortId !== Id;
      });
      this.setFavoritePorts("", "favDel");
    },
    async setFavoritePorts(row, type) {
      console.log(row);
      let destPort = [];
      if (type == "add") {
        destPort.push(row.Id);
      } else if (type == "del") {
        this.favPortList = this.favPortList.filter((item) => {
          return item.PortId !== row.Id;
        });
      }
      this.favPortList.forEach((item) => {
        destPort.push(item.PortId);
      });
      destPort = [...new Set(destPort)];
      this.pageLoading = true;
      const res = await request.post("/api/FRInquireFavoritePort/SetFavoritePorts", {
        PortIdList: destPort,
      });
      this.pageLoading = false;
      if (type == "add") {
        this.$emit("add");
      } else {
        this.$emit("del");
      }

      await this.getFavoritePorts();
      this.getEndPortQuery();
    },
    //监听目的港查询输入
    watchInput() {
      if (this.search.destPortName == "") {
        this.search.DestPortId = "";
        this.destPortVisible = false;
        // return (state.destPortVisible = true);
        return;
      }
      this.destPortVisible = true;
      this.getEndPortQuery();
    },
  },
  watch: {
    "search.DestPortId"(newVal, old) {
      this.inputQueryListAll.forEach((line) => {
        line.gangkou.forEach((des) => {
          if (des.Id == this.search.DestPortId) {
            this.search.DestPortName = `${des.EnPortName}(${des.CnPortName})`;
            // this.search.DestPortId = this.search.DestPortId;
            // state._search.destPortName = props.search.DestPortName;
          }
        });
      });
    },
  },
  created() {
    // this.getEndPortQuery();
    // this.getEndPortQueryAll();
    this.getFavoritePorts();
  },
});
</script>

<style lang="scss" scoped>
.dashbord-title {
  font-size: 14px;
  color: #000000;
  letter-spacing: -1px;
  font-weight: 400;
  line-height: 32px;
}

.no-company {
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;

  .no-logo {
    height: 90px;
    margin: 18px;
  }

  div {
    font-size: 14px;
    color: #969799;
    margin-top: 8px;
  }
}

.sub-port-btn {
  margin-top: 8px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #fd953e;
  cursor: pointer;

  img {
    height: 14px;
    margin-right: 4px;
  }
}

.no-head-content {
  display: flex;
  justify-content: space-between;
  margin-top: -4px;
  overflow: auto;

  .service-qa {
    padding-left: 24px;
    margin-top: 16px;
    height: 90px;
    border-left: 1px solid #e4e7ed;

    div {
      margin-bottom: 8px;
      font-size: 14px;
      color: #606266;
      width: 271px;
    }
  }

  .company-group {
    display: flex;
  }

  .company-item {
    margin: 8px 21px;

    .company-logo-out {
      width: 68px;
      height: 68px;
      padding: 2px;
      border-radius: 4px;
      background: linear-gradient(135deg, #fcf6e1 0%, #cba15e 50%, #e1c799 100%);

      .company-logo-content {
        background: #fff;
        width: 68px;
        height: 68px;
        border-radius: 2px;
        display: flex;
        align-items: center;

        img {
          width: 68px;
          max-height: 68px;
        }
      }
    }

    .company-item-name {
      font-size: 14px;
      color: #303133;
      letter-spacing: -1px;
      text-align: center;
      margin-top: 8px;
      overflow: hidden;
      width: 72px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .unlock {
    .company-logo-out {
      background: linear-gradient(135deg, #ccd6e7 0%, #8799b5 50%, #ccd6e8 100%);

      .company-logo-content {
        background: #f7fbfe;
      }
    }

    .company-item-name {
      color: #969799;
    }
  }
}

.freight-destport {
  :deep(.el-tabs__item.is-active) {
    color: #ff7d14;
  }

  :deep(.el-tabs__item:hover) {
    color: #ff7d14;
  }

  :deep(.el-tabs__active-bar) {
    background-color: #fd953e;
  }

  :deep(.tab-item-selected) {
    background-color: #ff7d14 !important;
  }

  :deep(.destport-blue) {
    background-color: #ff7d14 !important;
  }

  :deep(.destport-item:hover) {
    background: #fcf1e7;
  }
}

.desPort-selectde-content {
  display: flex;
  align-items: center;
  // justify-content: center;
  margin-top: -16px;
}

.sub-select {
  width: 310px;
}

.dialog-sub-btn {
  margin-top: 0;
  // margin-left: 6px;
  font-size: 12px;
}

.subed-port-group {
  display: flex;
  flex-flow: wrap;

  .subed-port-item {
    background: #f2f2f2;
    border-radius: 8px;
    line-height: 36px;
    display: flex;
    padding: 0 8px;
    margin-bottom: 8px;
    cursor: pointer;
    margin-right: 8px;

    img {
      margin-right: 8px;
    }
  }
}

.sub-port-group {
  padding: 8px 0 16px;

  .fav-title {
    line-height: 48px;
    font-size: 16px;
  }

  .sub-port-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    line-height: 30px;

    .sub-port-item-title {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #3c4144;

      img {
        margin-right: 4px;
      }
    }
  }
}

.del-sub-btn {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #ef4333;
  cursor: pointer;

  img {
    margin-right: 4px;
    width: 14px;
  }
}

.inputQuery {
  overflow: auto;
  padding: 0;
  margin-top: 8px;

  .inputQuery-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    background: #fd953e;
    color: white;
    padding: 6px 10px;
  }

  .inputQuery-header-freight {
    background-color: #fd953e;
  }

  .container-items {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
    cursor: pointer;
    padding: 0 10px;
  }

  .container-items:hover {
    background-color: #e6f5ff;
  }

  .container-items-freight {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
    cursor: pointer;
    padding: 0 10px;
  }

  .container-items-freight:hover {
    background: #fcf1e7;
  }
}

.inputQuery::-webkit-scrollbar {
  display: none;
}

.manage-btn {
  font-size: 12px;
  color: #3388ff;
  position: absolute;
  right: 12px;
  top: 8px;

  cursor: pointer;
}

.no-fav-content {
  text-align: center;
  padding: 80px 0 120px;
  width: 100%;

  img {
    margin-bottom: 24px;
    height: 118px;
  }

  .no-fav-tips {
    font-size: 14px;
    color: #969799;
    font-weight: 400;
    margin-bottom: 16px;
  }
}
</style>
<style lang="scss">
.el-dialog {
  border-radius: 8px;
}
</style>
