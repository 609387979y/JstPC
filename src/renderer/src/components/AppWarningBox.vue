<template>
  <!-- <div> -->
    <el-collapse-transition>
      <span class="box" v-show="visible">
        <el-icon color="#FF9809" style="margin-right: 5px;"><InfoFilled /></el-icon>
        <slot></slot>
        <div class="close" v-if="closable" @click="visible = false">
          <i class="el-icon-close icon"></i>
        </div>
      </span>
    </el-collapse-transition>
  <!-- </div> -->
</template>

<script>
import { InfoFilled } from "@element-plus/icons";
export default {
  props: {
    closable: {
      type: Boolean,
      default: false
    }
  },
  components: {
	InfoFilled
  },
  data() {
    return {
      visible: true
    };
  }
};
</script>

<style lang="scss" scoped>
.box {
	display: flex;
	align-items: center;
	background: #FFFAEE;
	border: 1px solid #F6E8C3;
	border-radius: 4px;
	border-radius: 4px;
	padding: 7px 8px;
	font-weight: normal;
	font-size: 12px;
	margin-bottom: 10px;
}
.icon {
  color: #F5A623;
  margin-right: 10px;
}
.close {
  position: absolute;
  right: 10px;
  top: 0;
  cursor: pointer;

  .icon {
    font-size: 20px;
  }
}
</style>
