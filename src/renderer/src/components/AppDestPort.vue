<template>
  <el-popover
    ref="popover"
    placement="bottom"
    :width="800"
    trigger="click"
    v-model:visible="showPopover"
  >
    <template #reference>
      <img v-if="btnType==1"  src="@/assets/images/hotport.svg" style="cursor: pointer;vertical-align: middle;margin-left: 4px;display:none;" @click="showPopover = !showPopover" alt="">
      <img v-else-if="btnType==3"  src="@/assets/images/hotport.svg" style="width:248px;height:32px; cursor: pointer;vertical-align: middle;margin-left: 4px;" @click="showPopover = !showPopover" alt="">
      <img v-else-if="btnType==2" src="@/assets/images/oneKey.svg" style="cursor: pointer;vertical-align: middle;margin-left: 4px;" @click="showPopover = !showPopover" alt="">
      
      <!-- <el-button type="primary"  size="mini"  style="padding: 6px;text-align:center;margin-left:5px">一键显示所有</el-button> -->
    </template>
    <AppDestPortContent style="padding:14px 12px" @selectPort="selectPort" :data="data" :type="type" :isHistory="isHistory"></AppDestPortContent>
  </el-popover>
  
</template>
<script>
import AppDestPortContent from "./AppDestPortContent.vue";

export default {
  components: {
    AppDestPortContent
  },
  props: {
    data: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 1,
    },
    btnType:{
      type: Number,
      default: 1,
    },
    isHistory: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      showPopover: false,
    };
  },
  methods: {
    selectPort(value){
      this.showPopover = false;
      this.$emit("selectPort", value);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
