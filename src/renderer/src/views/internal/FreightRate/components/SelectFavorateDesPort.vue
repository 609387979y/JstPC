<template>
  <div class="port-container" ref="containerScrol">
    <el-icon v-show="showArrow" class="left-arrow" :size="20" @click="selectPrePort"
      ><ArrowLeft
    /></el-icon>
    <div class="scroll" ref="portScrol">
      <div class="port-item-group">
        <div
          class="port-item"
          v-for="item in desPortList"
          :Id="item.PortId"
          @click="selectFavorateDesPort(item)"
          :key="item.PortId"
          :class="item.isActive ? 'active' : ''"
        >
          {{ item.EnPortName }},{{ item.Code }}
        </div>
      </div>
    </div>
    <el-icon v-show="showArrow" class="right-arrow" :size="20" @click="selectNextPort"
      ><ArrowRight
    /></el-icon>
  </div>
  <!-- <div class="port-container">
    
  </div> -->
</template>

<script>
import { defineComponent, reactive, ref, onMounted, onUnmounted,watch } from "vue";
import request from "@/public/request.ts";
import { ArrowLeft, ArrowRight } from "@element-plus/icons";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "",
  props: {
    desPortList: {
      type: Array,
      default: () => {},
    },
  },
  components: {
    ArrowLeft,
    ArrowRight,
  },

  setup(props, context) {
    const portScrol = ref(null);
    const containerScrol = ref(null);
    const showArrow = ref(false);
    function selectFavorateDesPort(item) {
      context.emit("selectFavorateDesPort", item);
    }
    function selectPrePort() {
      for (let i in props.desPortList) {
        if (props.desPortList[i].isActive && i != 0) {
          if (i - 5 < 0) {
            context.emit("selectFavorateDesPort", props.desPortList[0]);
            let left = document.getElementById(props.desPortList[0].PortId).offsetLeft;
            portScrol.value.scrollTo({ left: left - 30, behavior: "smooth" });
          } else {
            let index = i - 5;
            context.emit("selectFavorateDesPort", props.desPortList[index]);
            let left = document.getElementById(props.desPortList[index].PortId)
              .offsetLeft;
            portScrol.value.scrollTo({ left: left - 30, behavior: "smooth" });
          }
          return;
        }
      }
    }
    function selectNextPort() {
      for (let i in props.desPortList) {
        if (props.desPortList[i].isActive && i != props.desPortList.length - 1) {
          if (i + 5 > props.desPortList.length - 1) {
            context.emit(
              "selectFavorateDesPort",
              props.desPortList[props.desPortList.length - 1]
            );
            let left = document.getElementById(
              props.desPortList[props.desPortList.length - 1].PortId
            ).offsetLeft;
            portScrol.value.scrollTo({ left: left - 30, behavior: "smooth" });
          } else {
            let index = parseInt(i) + 5;
            context.emit("selectFavorateDesPort", props.desPortList[index]);
            let left = document.getElementById(props.desPortList[index].PortId)
              .offsetLeft;
            portScrol.value.scrollTo({ left: left - 30, behavior: "smooth" });
          }

          return;
        }
      }
    }
    function updateScroll() {
      setTimeout(() => {
        portScrol.value.update();
      }, 500);
    }
    function listenContainerWidth() {
      let outWidth = document.documentElement.clientWidth;
      let inWidth = containerScrol.value.clientWidth;
      let count = outWidth - inWidth;
      count < 279 ? (showArrow.value = true) : (showArrow.value = false);
    }
    watch(props,(old,newVal)=>{
      listenContainerWidth();
    })
    onMounted(() => {
      listenContainerWidth();
      window.onresize = () => {
        return (() => {
          listenContainerWidth();
        })();
      };
    });
    onUnmounted(() => {
      window.onresize = null;
    });
    return {
      portScrol,
      containerScrol,
      selectFavorateDesPort,
      selectPrePort,
      selectNextPort,
      updateScroll,
      showArrow,
    };
  },
});
</script>

<style scoped lang="scss">
.port-container {
  max-width: calc(100% - 60px);
  position: relative;
  .scroll {
    overflow: auto;
  }
  ::-webkit-scrollbar {
    width: 4px;
    height: 8px;
  }

  /* 滚动槽 */

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);

    border-radius: 5px;
  }

  /* 滚动条滑块 */

  ::-webkit-scrollbar-thumb {
    border-radius: 5px;

    background: rgba(0, 0, 0, 0.1);

    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
  }

  ::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(0, 0, 0, 0.1);
  }
  .left-arrow {
    width: 16px;
    opacity: 0.6;
    position: absolute;
    left: 0;
    top: 5px;
    cursor: pointer;
  }
  .right-arrow {
    width: 16px;
    opacity: 0.6;
    position: absolute;
    right: 0;
    top: 5px;
    cursor: pointer;
  }
}
.port-item-group {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  // overflow: auto;
  font-size: 14px;
  // margin-bottom: 12px;
  .port-item:last-child {
    margin-right: 0px;
  }
  .port-item {
    background: #f2f3f5;
    white-space: nowrap;
    border-radius: 2px;
    padding: 4px 14px;
    font-size: 14px;
    color: #3c4144;
    line-height: 22px;
    margin-right: 8px;
    margin-bottom: 6px;
    cursor: pointer;
  }
  .active {
    background: #fcf1e7;
    color: #fd953e;
  }
}
</style>
