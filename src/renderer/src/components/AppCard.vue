<template>
  <el-row>
    <el-card
      :shadow="shadow"
      :class="'card_staff ' + (border == false ? 'header_bottom' : '')"
      :style="'width:' + width"
    >
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <slot name="title"></slot>
          </span>
          <slot name="button"></slot>
        </div>
      </template>
      <div class="title">
        <slot name="second-title"></slot>
      </div>
      <div class="number">
        <slot name="number"></slot>
      </div>
      <div class="card-content">
        <slot></slot>
      </div>
      
    </el-card>
  </el-row>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    width: {
      type: String,
      default: "100%",
    },
    border: {
      type: Boolean,
      default: false,
    },
    shadow:{
      type: String,
      default: "never",
    },
  },
});
</script>
<style lang='scss' scoped>
::v-deep(.header_bottom .el-card__header) {
  border-bottom: none;
  padding: 10px 16px;
}
::v-deep(.el-card__body) {
  // padding-top: 0;
  padding:0 16px 16px 16px;
}
.card_staff {
  margin-bottom: 8px;
}
.card-header {
  
  .card-title {
    font-size: 16px;
    color: #303133;
    display: flex;
    align-items: center;
    font-weight: bold;
  }
  display: flex;
  justify-content: space-between;
}
.number {
  font-size: 30px;
  line-height: 50px;
  color: #303133;
}
.title {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}
.staff_info {
  display: flex;
  .staff_info_item {
    width: 50%;
    text-align: center;

    .staff_info_lable {
      font-size: 14px;
      color: #909399;
      line-height: 29px;
    }
    .staff_info_num {
      font-size: 24px;
      color: #3c4144;
      line-height: 40px;
      margin-bottom: 10px;
    }
  }
}
// .card-content{
//   padding-top: 24px;
// }
</style>