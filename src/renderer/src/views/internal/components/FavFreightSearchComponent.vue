<template>
  <div class="fav-select-container" v-loading="pageLoading">
    <div class="no-fav-content" v-if="!favPortList.length">
      <img src="@/assets/customWorkbench/undraw_add_to_cart_re_wrdo.svg" alt="" />
      <div class="no-fav-tips">添加您常用的目的港口，方便您快速查询运价</div>
      <div class="sub-port-btn" @click="openFavManageDialog">
        <img src="@/assets/customWorkbench/add.svg" alt="" />
        添加关注
      </div>
    </div>
    <div class="attention-line" v-else>
      <img class="select-icon" src="@/assets/images/port_02_orange.svg" alt="" />
      <el-select class="attention-port-select" filterable v-model="search.PolPortId" placeholder="请选择起运港">
        <el-option v-for="item in portList" :key="item.Id"
          :label="`${item.EnPortName},${item.Code}(${item.CnPortName})`" :value="item.Id"></el-option>
      </el-select>
      <img src="@/assets/customWorkbench/single_right_arrow.svg" alt="" />
      <div class="port-item-scroll">
        <el-icon class="icon-left" @click="moveleft">
          <ArrowLeftBold />
        </el-icon>
        <el-icon class="icon-right" @click="moveright">
          <ArrowRightBold />
        </el-icon>
        <div class="port-item-group">
          <!-- <div class="port-item active" @click="selectFavorateDesPort()">
          {{ selectedFavoriteDesPort.EnPortName }},{{
            selectedFavoriteDesPort.Code
          }}
        </div> -->
          <div class="port-item" :class="item.PortId == search.DestPortId ? 'active' : ''" v-for="item in favPortList"
            @click="selectFavorateDesPort(item)" :key="item.PortId">
            <img class="org-icon" src="@/assets/images/port_02_orange.svg" alt="" />
            <img class="white-icon" src="@/assets/images/port_02_white.svg" alt="" />
            {{ item.EnPortName }},{{ item.Code }}
            <el-icon @click.stop="delFavPort(item.PortId)" size="14px" color="#949393" style="margin-left: 10px;">
              <CloseBold />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FavPortManageDialog ref="favPortManageDialog" @add="getFavoritePorts" @del="getFavoritePorts"></FavPortManageDialog>
</template>

<script>
import { defineComponent, ref, watch, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@/public/request";
import tools from "@/utils/Utils";
import { useStore, Store } from "vuex";
import { ArrowLeftBold, ArrowRightBold, ArrowRight, Close, CloseBold } from "@element-plus/icons";
import FavPortManageDialog from "./FavPortManageDialog.vue";

export default defineComponent({
  components: {
    ArrowRight,
    ArrowLeftBold,
    ArrowRightBold,
    FavPortManageDialog,
    Close,
    CloseBold,
  },
  props: {
    search: {
      type: Object,
      default: () => { },
    },
    isFreightLayout: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      portList: [],
      favPortList: [],
      pageLoading: false,
      selectedFavoriteDesPort: {
        EnPortName: "",
        Code: "",
      },
      left: 0,
      allwidth: 0,
    };
  },
  methods: {
    openFavManageDialog() {
      this.$refs.favPortManageDialog.openDialog();
    },
    delFavPort(Id) {
      this.favPortList = this.favPortList.filter((item) => {
        return item.PortId !== Id;
      });
      this.setFavoritePorts("del");
    },
    async setFavoritePorts(setType) {
      let destPort = [];
      this.favPortList.forEach((item) => {
        destPort.push(item.PortId);
      });
      destPort = [...new Set(destPort)];
      this.pageLoading = true;
      const res = await request.post("/api/FRInquireFavoritePort/SetFavoritePorts", {
        PortIdList: destPort,
      });
      this.pageLoading = false;
      this.$emit("updateFavPort");
      this.getFavoritePorts();
    },
    //获取起运港
    async getPortList(e) {
      let keyword = e ?? "";
      let res = await request.get("/api/FRPort/GetFRPortList", {
        Page: 1,
        limit: -1,
        PortName: keyword,
        IsPol: true,
      });
      let list = res.Rows;
      for (let item of list) {
        item.label = item.EnPortName;
        item.value = item.Id;
      }
      this.portList = list;
    },
    //获取关注
    async getFavoritePorts() {
      this.pageLoading = true;
      const res = await request.get("/api/FRInquireFavoritePort/GetFavoritePorts");
      this.pageLoading = false;
      this.favPortList = res.DestPorts;
    },
    selectFavorateDesPort(item) {
      this.$props.search.DestPortId = item.PortId;
      this.$props.search.DestPortName = `${item.EnPortName}(${item.CnPortName})`;
      this.$emit("search");
    },
    moveleft() {
      if (this.left == 0) {
        return;
      }
      this.left = this.left - 300;
      var scrollOptions = {
        left: this.left,
        behavior: "smooth",
      };

      document.querySelector(".port-item-group").scrollTo(scrollOptions);
    },
    moveright() {
      if (this.left > document.querySelector(".port-item-group").offsetWidth) {
        return;
      }
      this.left = this.left + 300;
      var scrollOptions = {
        left: this.left,
        behavior: "smooth",
      };

      document.querySelector(".port-item-group").scrollTo(scrollOptions);
    },
  },
  watch: {
    "search.PolPortId"(newVal, old) {
      this.portList.forEach((item) => {
        if (item.Id == this.$props.search.PolPortId) {
          `${item.EnPortName},${item.Code}(${item.CnPortName})`;
        }
      });
    },
  },
  created() {
    this.getPortList();
    this.getFavoritePorts();
  },
});
</script>

<style lang="scss" scoped>
.fav-select-container {
  padding: 0 16px 6px 16px;
  display: flex;
  align-items: center;
  margin-top: -8px;
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

.sub-port-btn {
  margin-top: 8px;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #fd953e;
  cursor: pointer;
  line-height: 13px;
  margin: 0 auto;
  width: 100px;

  img {
    height: 16px;
    margin-right: 8px;
    margin-bottom: 0;
  }
}

.attention-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-size: 14px;
  line-height: 50px;
  width: 100%;
  position: relative;

  .select-icon {
    z-index: 1;
    position: absolute;
    left: -5px;
    top: 9px;
    height: 12px;
  }

  .attention-port-select {
    width: 168px;
    border-radius: 8px;

    :deep(.el-input__inner) {
      height: 32px;
      line-height: 32px;
      background: #fcf1e7;
      color: #fd953e;
      padding: 0 26px;
      border: none;
      border-radius: 8px;
    }

    :deep(.el-input__icon) {
      color: rgba(253, 149, 62, 0.45);
    }
  }

  .port-item {
    background: #f2f3f5;
    border-radius: 2px;
    padding: 4px 8px;
    font-size: 14px;
    color: #3c4144;
    line-height: 22px;
    margin-right: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;

    img {
      width: 14px;
      height: 14px;
      margin: 0 4px 0 0;
    }

    .org-icon {
      display: inline-block;
    }

    .white-icon {
      display: none;
    }

    &.active {
      background: #fd953e !important;
      color: #fff !important;

      .org-icon {
        display: none;
      }

      .white-icon {
        display: inline-block;
      }
    }

    &:hover {
      background: #fcf1e7;
      // color: #fff;
      // .org-icon {
      //   display: none;
      // }
      // .white-icon {
      //   display: inline-block;
      // }
    }
  }

  .active {
    background: #fd953e !important;
    color: #fff !important;
    // .org-icon {
    //   display: none;
    // }
    // .white-icon {
    //   display: inline-block;
    // }
  }

  img {
    width: 20px;
    height: 16px;
    margin: 0 8px;
  }
}

.port-item-scroll {
  width: calc(100% - 256px);
  padding: 0 24px;
  position: relative;

  :deep(.el-scrollbar__thumb) {
    display: none;
  }

  .icon-left {
    cursor: pointer;
    position: absolute;
    left: 0;
    width: 38px;
    height: 32px;
    line-height: 32px;
    text-align: start;
    // text-align: center;
    color: #dcdfe6;
    background-image: linear-gradient(to right, white, white, transparent);
  }

  .icon-right {
    cursor: pointer;
    position: absolute;
    right: 0;
    width: 38px;
    height: 32px;
    line-height: 32px;
    text-align: end;
    // text-align: center;
    color: #dcdfe6;
    background-image: linear-gradient(to left, white, white, transparent);
  }
}

.port-item-group {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  overflow: auto;
  font-size: 14px;
  width: 100%;
  overflow: hidden;
  overflow-x: scroll;
  overflow: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

  // margin-bottom: 12px;
  .port-item:last-child {
    margin-right: 0px;
  }

  .port-item {
    background: #f2f3f5;
    white-space: nowrap;
    border-radius: 8px;
    padding: 4px 8px;
    font-size: 14px;
    color: #3c4144;
    line-height: 22px;
    margin-right: 8px;
    cursor: pointer;
  }
}
</style>
<style lang="scss"></style>
