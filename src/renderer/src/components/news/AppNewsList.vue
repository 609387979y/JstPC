<template>
  <div class="list">

    <el-space :size="16" wrap>


      <div @click="toDetail(item.Id)" v-for="item in news" class="news">
        <div class="pic">
          <img :src="item.ImgUrl" class="image" />
        </div>
        <div class="content">
          <div :title="item.Title" class="title">{{ item.Title }}</div>
          <div class="btn">
            <button class="more">了解详情</button>
          </div>

        </div>
      </div>

    </el-space>



  </div>
</template>

<script>
import { defineComponent } from "vue"
export default defineComponent({
  components: {

  },
  props: {
    keyword: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      news: [],
      page: 1
    }
  },

  methods: {
    async getNews(reset) {
      let res = await this.$http.get("/api/MhPportalinfo/GetNewsList", {
        page: this.page,
        limit: 10,
        IsShow: 0,
        Title: this.keyword ?? ""
      })
      if (reset) {
        this.news = res.Rows;
        this.page++;
      } else {
        if (res.Rows.length > 0) {
          this.news = this.news.concat(res.Rows)
        } else {
          this.page++;
        }
      }
    },
    toDetail(id) {
      this.$router.push({
        path: "/internal/news/newsDetail",
        query: {
          id: id
        }
      })
    }
  },
  watch: {
    keyword() {
      this.page = 1
      this.getNews(true)
    }
  },
  created() {
    this.page = 1
    this.getNews()
  }
})
</script>

<style lang="scss" scoped>
.list {
  background-color: #fff;
  padding-bottom: 10px;
}

.news {
  width: 257px;
  height: 234px;
  box-sizing: border-box;
  background: #FFFFFF;
  border: 1px solid #E4E7ED;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    .image {
      transform: scale(1.1);
    }
  }

  .pic {
    overflow: hidden;
  }

  .image {
    object-fit: cover;
    height: 149px;
    width: 100%;
    transition: all 0.5s ease;

  }

  .title {
    font-size: 14px;
    color: #606266;
    letter-spacing: 0;
    font-weight: 500;
    padding: 0px 8px;
    height: 40px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
  }


  .btn {
    position: absolute;
    right: 8px;
    bottom: 12px;
  }

  .more {
    font-size: 12px;
    color: #409EFF;
    letter-spacing: 0;
    line-height: 16px;
    font-weight: 400;
    border: 1px solid #A0CFFF;
    border-radius: 2px;
    background-color: #F2F8FD;
    cursor: pointer;
    transition: all 0.1s ease;

    &:hover {
      color: #F2F8FD;
      background: #409EFF;
      border: 1px solid #409EFF;
      transition: all 0.1s ease;
    }
  }
}

@keyframes fade-in-img {
  0% {
    transform: scale(1.2);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
