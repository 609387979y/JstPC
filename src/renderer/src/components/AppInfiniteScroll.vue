<template>
  <el-scrollbar ref="scrollContent" :height="contentHeight" @scroll="contentScroll">
    <!-- 这里放列表 -->
    <div>
      <slot></slot>
    </div>
    <!-- 撑开高度 -->
    <div style="height: 80px">
      <!-- 加载动画 -->
      <div style="height: 80px" v-show="loading" v-loading="loading"></div>
      <!-- 没有更多数据 -->
      <div style="line-height: 80px; text-align: center" v-if="nomore && !loading">
        <slot name="nomore">暂时没有更多数据……</slot>
      </div>
    </div>
  </el-scrollbar>
</template>
<script>
export default {
  name: "infinite-scroll",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    nomore: {
      type: Boolean,
      default: false,
    },
    clientHeight: {
      type: String,
      default: "100%",
    },
  },
  data() {
    return {
      contentHeight: "100%",
    };
  },
  created() {},
  mounted() {
    //初始化高度
    if (this.clientHeight) {
      this.contentHeight = this.clientHeight;
    }

  },
  methods: {
    contentScroll({ scrollLeft, scrollTop }) {
      //滚动条
      let a = this.$refs.scrollContent.wrap$.scrollHeight;
      //可视区
      let b = this.$refs.scrollContent.wrap$.clientHeight;
      //距离顶部
      let c = scrollTop
      //触底
      if (b + c == a) {
        console.log('到底啦')
        this.$emit("loadBottom");
      } else {
        return;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.scrollContent {
  overflow: auto;
}
// .scrollContent::-webkit-scrollbar {
//   display: none; /* Chrome Safari */
// }
</style>
