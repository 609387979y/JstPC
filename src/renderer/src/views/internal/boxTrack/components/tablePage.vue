<!--调用方法：<El-Pagination @change="changeList" :total="total" :pageSizes="pageSizes"></El-Pagination>
注意事项：
1、该组件依赖于elementui,使用前请先下载；
2、其中total为总条数，pageSizes为分页器数目置，@change为页数或者条数变化要执行的方法，layout为el-pagination的样式变化
3、每次重新查询请求数据的时候建议重置一下page（changeList除外）
#table为表格插槽，btn则是分页右侧插槽-->
<template>
  <div>
    <div>
      <slot name="table"></slot>
    </div>
    <div class="margin-top-15">
      <div>
        <slot name="btn"></slot>
      </div>
      <div>
        <el-pagination background :current-page="query.page" :page-size="query.limit" :page-sizes="pageSizes"
          :total="total" :layout="layout" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { number, string } from 'mathjs'

export default {
  props: {
    total: {
      type: number,
      default: 0
    },
    pageSizes: {
      type: Array,
      default: function () {
        return [10, 20, 30, 40, 50, 60, 70, 80, 99]
      }
    },
    layout: {
      type: string,
      default: 'total,sizes,prev,pager,next,jumper'
    }
  },
  data() {
    return {
      query: {
        limit: this.pageSizes[0],
        page: 1
      }
    }
  },
  methods: {
    //pageSize变化时触发
    handleSizeChange(val) {
      this.query.limit = val
      this.$emit('getList', this.query)
    },
    //page变化时触发
    handleCurrentChange(val) {
      this.query.page = val
      this.$emit('getList', this.query)
    }
  },
}
</script>
<style scoped>
.margin-top-15 {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}
</style>
