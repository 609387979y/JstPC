<template>
  <!-- 日期区间组件，调用方法为
  <AppDataPicker 
    v-model:startTime="???"
    v-model:endTime="???"
    :size="'default'"
    :btn="true"
  ></AppDataPicker>

 -->
  <div class="data-picker-container">
    <el-date-picker
      v-model="pickerTime"
      :type="type"
      range-separator="-"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :size="size"
      :popper-class="isFreightLayout ? 'data-picker-freight-primary yellow' : ''"
    />
    <template v-if="btn">
      <el-button
        :size="size"
        style="margin-left: 5px"
        @click="onBtn('today')"
        :class="currentBtn === 'today' ? 'active-btn' : ''"
      >今</el-button>
      <el-button
        :size="size"
        @click="onBtn('yesterday')"
        :class="currentBtn === 'yesterday' ? 'active-btn' : ''"
      >昨
      </el-button>
      <el-button
        :size="size"
        @click="onBtn('senven')"
        :class="currentBtn === 'senven' ? 'active-btn' : ''"
      >近7天
      </el-button>
      <el-button
        :size="size"
        @click="onBtn('thirty')"
        :class="currentBtn === 'thirty' ? 'active-btn' : ''"
      >近30天
      </el-button>
    </template>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  toRefs,
  unref,
  watch,
} from "vue";
/** 获取指定的日期，返回格式YYYY-MM-DD */
function getDate(date: Date | string, day: number) {
  let currentDate = new Date(date).getTime() + 1000 * 36 * 2400 * day;
  var time = new Date(currentDate);
  let y = time.getFullYear();
  let m =
    time.getMonth() + 1 < 10
      ? "0" + (time.getMonth() + 1)
      : time.getMonth() + 1;
  let d = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  return `${y}-${m}-${d}`;
}
export default defineComponent({
  props: {
    startTime: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "small",
    },
    btn: {
      type: Boolean,
      default: true,
    },
    onClick: {
      type: String,
      default: "",
    },
    isFreightLayout: {
      type: Boolean,
      default: false,
    },
    type:{
      type:String,
      default:'daterange'
    }
  },
  setup(props, contenxt) {
    const { startTime, endTime, size, btn, onClick,type } = toRefs(props);
    const pickerTime = computed({
      get: () => {
        if (unref(startTime) && unref(endTime)) {
          return [unref(startTime), unref(endTime)];
        } else {
          return [];
        }
      },
      set: (val: string[]) => {
        currentBtn.value = "";
        if (val !== null) {
          contenxt.emit("update:startTime", getDate(val[0], 0));
          contenxt.emit("update:endTime", getDate(val[1], 0));
        } else {
          contenxt.emit("update:startTime", "");
          contenxt.emit("update:endTime", "");
        }
        return val;
      },
    });
    const currentBtn = ref("");
    function onBtn(val: string) {
      currentBtn.value = val;
      let start = "";
      let end = getDate(new Date(), 0);
      switch (val) {
        case "today":
          start = getDate(new Date(), 0);
          break;
        case "yesterday":
          start = getDate(new Date(), -1);
          break;
        case "senven":
          start = getDate(new Date(), -7);
          break;
        case "thirty":
          start = getDate(new Date(), -30);
          break;
      }
      contenxt.emit("update:startTime", start);
      contenxt.emit("update:endTime", end);
    }

    function clear() {
      currentBtn.value = "";
    }

    onMounted(() => {
      if (onClick.value) {
        onBtn(onClick.value);
      }
    });
    return {
      pickerTime,
      size,
      currentBtn,
      onBtn,
      btn,
      clear
    };
  },
});
</script>

<style lang="scss" scoped>
.data-picker-container {
  width: 100%;
  display: flex;

  :deep(.el-button + .el-button) {
    margin-left: 5px;
  }

  :deep(.el-button) {
    color: #dcdee0;
    border: 1px solid #dcdee0;
    background: #f8f8f8;
  }

  :deep(.el-range-editor.el-input__wrapper) {
    width: 100% !important;
  }

  .active-btn {
    color: #1f8efa;
    border-color: #1f8efa;
  }

  :deep(.el-input__inner) {
    width: 100%;
  }

  :deep(.el-button--mini) {
    padding: 7px 5px;
  }
}
</style>