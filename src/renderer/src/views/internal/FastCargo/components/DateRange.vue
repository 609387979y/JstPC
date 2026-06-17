<template>
  <div class="range-content">
    <div>
      <el-date-picker
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :size="size"
        @change="(v) => valueChange('start', v)"
        v-model="startDate"
        type="date"
        :placeholder="startPlaceholder"
      ></el-date-picker>
    </div>
    <div class="mid">{{ toText }}</div>
    <div>
      <el-date-picker
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :size="size"
        @change="(v) => valueChange('end', v)"
        v-model="endDate"
        type="date"
        :placeholder="endPlaceholder"
      ></el-date-picker>
    </div>
    <div class="options">
      <div
        @click="choose(idx)"
        :class="{
          'choose': optionChooseIdx == idx,
          'mini': size == 'mini'
        }"
        class="option"
        v-for="(opt, idx) in option"
      >{{ opt.label }}</div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue"
import dayjs from "dayjs"
export default defineComponent({
  props: {
    // 开始时间
    start: {
      type: String,
      default: ""
    },
    // 结束时间
    end: {
      type: String,
      default: ""
    },
    option: {
      type: Array,
      default: () => [
        {
          label: "今",
          start: 0,
          end: 0
        },
        {
          label: "昨",
          start: -1,
          end: -1
        },
        {
          label: "近7天",
          start: -7,
          end: 0
        },
        {
          label: "近30天",
          start: -30,
          end: 0
        }
      ]
    },


    // 开始时间 Placeholder
    startPlaceholder: {
      type: String,
      default: "开始时间"
    },
    // 结束时间 Placeholder
    endPlaceholder: {
      type: String,
      default: "结束时间"
    },
    // 中间的文本
    toText: {
      type: String,
      default: "至"
    },
    // 控件大小
    size: {
      type: String,
      default: "small"
    },
	datetype: {
		type: Number,
		default: null
	}




  },
  name: "DateRange",
  data() {
    return {
      startDate: this.start,
      endDate: this.end,
      optionChooseIdx: -1
    }
  },
  methods: {
    valueChange(type, value) {
      this.$emit(`update:${type}`, value)
    },
    // 选择快快捷选项
    choose(idx) {
      this.optionChooseIdx = idx;

      const item = this.option[idx];
      this.startDate = this.getDateFromNow(item.start);
      this.endDate = this.getDateFromNow(item.end);
      this.valueChange("start", this.startDate)
      this.valueChange("end", this.endDate)
    },
    getDateFromNow(offset) {
      if (offset > 0) {
        return dayjs().add(offset, 'day').format("YYYY-MM-DD")
      } else if (offset < 0) {
        return dayjs().subtract(offset * -1, 'day').format("YYYY-MM-DD")
      } else {
        return dayjs().format("YYYY-MM-DD")
      }
    }
  },
  mounted(){
	if(this.datetype){
		this.choose(this.datetype);
	}
  },
  watch: {
    start() {
      this.startDate = this.start;
	  if(this.start == ""){
		  this.optionChooseIdx = -1;
	  }
    },
    end() {
      this.endDate = this.end;
    }
  },
  created() {

  }
})
</script>

<style lang='scss' scoped>
.range-content {
  display: flex;
  flex-wrap: wrap;
}
.mid {
  line-height: 32px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #606266;
  margin: 0px 1px;
}
.options {
  display: flex;
  .option {
    border-radius: 2px;
    border: 1px solid #e4e7ed;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #dcdfe6;
    line-height: 32px;
    padding: 0px 5px;
    cursor: pointer;
    margin-left: 8px;
    &.choose {
      border: 1px solid #409eff;
      color: #409eff;
    }
    &:hover {
      border: 1px solid #409eff;
      color: #409eff;
    }

    &.mini {
      height: 29px;
    }
  }
}
</style>