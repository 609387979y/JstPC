<template>
  <div class="freight-find">
    <div class="title">使用即时询价进行对话</div>

    <!-- 类型 -->
    <div class="type">
      <div class="type-item" :class="{ active: type === 1 }" @click="type = 1"><img src="@/assets/newIcon.svg" />运价查询
      </div>
      <div class="type-item" :class="{ active: type === 2 }" @click="type = 2"><img src="@/assets/newIcon2.svg" />即时询价
      </div>
      <!-- <div class="type-item" :class="{ active: type === 3 }" @click="type = 3">船期查询</div> -->
    </div>

    <!-- 搜索栏 -->
    <FreightSearchCompontent :key="active" :isInquiry="(type == 2)" ref="freightSearchRef" @search="searchBtn"
      :search="search" :isFreightLayout="true">
    </FreightSearchCompontent>

  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import {
  useRouter,
} from "vue-router";
import { ArrowLeft, ArrowRight, ArrowDown, RefreshRight } from "@element-plus/icons";
import FreightSearchCompontent from "@/views/internal/components/FreightSearchComponents.vue";
import { ElMessage } from "element-plus";

const router = useRouter();

const searchBtn = () => {
  switch (type.value) {
    case 1:
      if (!search.PolPortId || !search.DestPortId) {
        return ElMessage.warning("请选择起运港和目的港");
      }
      router.push({
        path: "/internal/freightFind",
        query: {
          search: JSON.stringify(search)
        }
      })

      break;
    case 2:
      if (!search.PolPortId || !search.DestPortId) {
        ElMessage.warning('请选择起运港和目的港')
        return
      }
      if (!search.Box || !search.BoxAmount) {
        ElMessage.warning('请选择箱型箱量')
        return
      }
      router.push({
        path: "/internal/instant",
        query: {
          search: JSON.stringify(search)
        }
      })
      break;
  }
}

const search = reactive({
  startPort: "",
  destPort: "",
  searchDate: null,
  isLCL: false,
  isFCL: false,
});

// 类型
const type = ref(1);

</script>
<style lang="scss" scoped>
.freight-find {
  display: flex;
  align-items: center;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;

  .title {
    font-size: 20px;
    font-weight: bold;
    line-height: 20px;
    margin-bottom: 24px;
  }

  .type {
    padding: 4px;
    border-radius: 4px;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;

    .type-item {
      width: 100px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      text-align: center;
      display: flex;
      align-items: center;
      border-radius: 4px;
      cursor: pointer;
      padding-left: 12px;

      img {
        margin-right: 5px;
      }

      &.active {
        background: rgba(253, 149, 62, 0.15);
        color: #FD953E;
        font-weight: 600;
      }
    }
  }
}

.freight-search-container {
  background: #fd953e;
}

::v-deep .el-select-dropdown__item.selected {
  color: #fd953e;
}
</style>
