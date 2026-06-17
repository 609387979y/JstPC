<template>
  <div>
    <div class="search-container">
      <el-input :prefix-icon="Search" clearable size="large" class="search-input" v-model="keyword"
        placeholder="搜索行业最新消息">
      </el-input>
      <el-button class="search-btn" @click="search" type="primary">搜索</el-button>
    </div>

    <div v-show="searchKeyword != ''" class="search-info">
      <div style="font-size:20px">
        {{ searchKeyword }}
      </div>
      <div style="color:#909399;margin-top:10px">已找到 <span style="color:#409EFF">{{ rows.length }}</span> 个结果</div>
    </div>
    <div class="list">
      <el-space wrap :size="16">
        <div @click="toDetail(item.Id)" v-for="item in rows" class="news-item">
          <div style="overflow:hidden">
            <img :src="item.ImgUrl" class="image" />
          </div>
          <div class="text">
            {{ item.Title }}
          </div>
        </div>


      </el-space>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue"
import { Search } from "@element-plus/icons"

export default defineComponent({
  components: {

  },
  data() {
    return {
      Search,
      keyword: "",
      // 已经搜索完毕的关键字
      searchKeyword: "",
      rows: []
    }
  },
  methods: {
    async search() {

      let res = await this.$http.get("/api/MhPportalinfo/GetNewsList", {
        page: this.page,
        limit: 50,
        IsShow: 0,
        Title: this.keyword ?? ""
      })
      this.rows = res.Rows;
      this.searchKeyword = this.keyword;
    },
    toDetail(id) {
      this.$router.push({
        path: "/internal/news/newsDetail",
        query: {
          id: id
        }
      })
    },
  },

  mounted() {
    if (this.$route.query.keyword) {
      this.keyword = this.$route.query.keyword;
      this.search();
    }
  }
})
</script>

<style lang='scss' scoped>
.search-container {
  display: flex;
  width: 440px;
  margin: 0 auto;

  :deep(.el-button) {

    border-radius: 0px 4px 4px 0px;
  }

  .search-btn {
    width: 80px;
    height: 40px;

  }

  .search-input {
    :deep(.el-input__inner) {
      background-color: #F0F3F4;
      // border-color: #fff;
      border-right: none;
      border-radius: 4px 0px 0px 4px;

      &:focus {
        border-color: #409eff;
      }
    }

  }
}

.search-info {
  text-align: center;
  font-size: 16px;
  margin-top: 15px;
}

.image {
  width: 190px;
  height: 100px;
}

.list {
  margin-top: 20px;
  text-align: center;
}

.news-item {
  cursor: pointer;

  &:hover {
    .image {
      transform: scale(1.1);
    }
  }

  .image {
    transition: all 0.5s ease;
  }

  .text {
    overflow: hidden; //溢出隐藏
    white-space: nowrap; //禁止换行
    text-overflow: ellipsis; //...
    color: #606266;
    width: 190px;
    height: 20px;
  }

}
</style>