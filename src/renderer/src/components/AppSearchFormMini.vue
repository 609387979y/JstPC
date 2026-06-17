<template>
  <div class="form">
    <el-form label-suffix="" :label-width="labelWidth" :size="formSize" ref="form">
      <slot></slot>

      <el-collapse-transition>
        <div v-show="collapse">
          <slot name="hidden"></slot>
        </div>
      </el-collapse-transition>
      <slot name="fixed"></slot>
    </el-form>

    <el-button
      class="expand-btn"
      type="text"
      v-show="hasHiddenContent"
      @click="collapse = !collapse"
    >
      {{ collapse ? "收缩" : "展开" }}
      <i
        class="el-icon-arrow-down collapse"
        :class="collapse ? 'rotate' : ''"
      ></i>
    </el-button>
  </div>
</template>
  
  <script>
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        // 隐藏 清除筛选条件
        hideClean: {
            type: Boolean,
            default: false
        },
        // 在清空筛选条件后提交
        submitAfterReset: {
            type: Boolean,
            default: false
        },
        "labelWidth": {
            type: String,
            default: "60px"
        },
        formSize: {
            type: String,
            default: 'mini'
        }
    },
    data() {
        return {
            collapse: false
        };
    },
    methods: {
        submit() {
            this.$emit("submit");
        },
        reset() {
            this.$emit("reset");
            if (this.submitAfterReset) {
                this.$emit("submit");
            }
        }
    },
    computed: {
        hasHiddenContent: function() {
            if(!this.$slots.hidden){
                return false;
            }

            let slot = this.$slots.hidden()
            if (!slot) {
                return false;
            }
            if (slot.length != 0) {
                return true;
            }
            return false;
        }
    }
});
</script>
  
  <style lang='scss' scoped>
.form {
  padding: 15px 15px 0 15px;
  background-color: #f8f8f8;
  position: relative;
}
.clean {
  margin-left: 15px;
}
.collapse {
  transition: all 0.5s ease;
}
.rotate {
  // transition: all 0.5s ease;
  transform: rotate(-180deg);
}
.expand-btn{
  position: absolute;
  right: 3px;
  top: 13px;
}
:deep(.el-select-v2__wrapper) {
  padding: 1px 0 1px 0;
}
</style>
  