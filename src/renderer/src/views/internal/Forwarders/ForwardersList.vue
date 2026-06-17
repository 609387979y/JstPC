<template>
  <div>
    <div class="search-container">
      <el-input :prefix-icon="Search" clearable size="large" class="search-input" v-model="search.searchInformation"
        placeholder="搜索10,000家优质货代资源">
      </el-input>
      <el-button class="search-btn" @click="getForwarders" type="primary">找货代</el-button>
    </div>

    <div class="top-ad">
      <div class="logo">
        <el-carousel class="carousel" :key="key">
      <div v-for="item in data" :key="item.Id" style="width:100%；overflow: hidden;">
        <el-carousel-item v-if="item.LocationType==1">
        <!-- contain cover -->
        <el-image @click="clickAd(item)" class="ad-pic" :src="item.advertiseLogo" fit="cover">
          <template #placeholder>
            <el-skeleton style="width: 100%; height: 229px" :loading="loading" animated>
              <template #template>
                <el-skeleton-item style="width: 100%; height: 229px" variant="image" />
              </template>
            </el-skeleton>
          </template>
        </el-image>
      </el-carousel-item>
      </div>
    </el-carousel>
      </div>
    </div>



    <div class="search-box">

      <div class="search-group" style="margin-left:20px">
        <div class="title" style="margin-right: 5px;">主营业务</div>

        <el-space wrap class="options">
          <div @click="choosePrimaryService('')" :class="search.primaryService == '' ? 'selected' : ''" class="option">
            全部</div>

          <template v-for="item in primaryServiceArr">
            <div @click="choosePrimaryService(item)" :class="search.primaryService == item ? 'selected' : ''"
              class="option">
              {{ item }}</div>
          </template>
        </el-space>


      </div>
      <div class="search-group" style="margin-left:20px;margin-top:16px">

        <div class="title" style="width:66px">优势航线</div>
        <el-space wrap class="options">
          <div @click="chooseAdvantageRoutes('')" :class="search.advantageRoutes == '' ? 'selected' : ''"
            class="option">全部</div>
          <template v-for="item in advantageRoutesArr">
            <div @click="chooseAdvantageRoutes(item)" :class="search.advantageRoutes == item ? 'selected' : ''"
              class="option">
              {{ item }}</div>
          </template>
        </el-space>


      </div>

    </div>

    <div class="list">

      <el-row v-if="rows.length != 0" :gutter="16">


        <el-col v-for="item in rows" :lg="{ span: 8 }" :xl="{ span: 6 }">
          <ForwarderListItem  :chosen="item.IsSelection" @to-detail="$router.push('/forwarders/detail?id=' + item.Id)"
            @to-website="openWebsite(item)" :company-name="item.Name" verify :company-logo="item.LogoPath"
            :main-business="item.PrimaryService" :main-route="item.AdvantageRoutes" :tags="item.tags">
          </ForwarderListItem>
        </el-col>

      </el-row>

      <el-empty v-else description="暂无数据" />

    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue"
import ForwarderListItem from "./components/ForwarderListItem.vue"
export default defineComponent({
  components: {
    ForwarderListItem
  },
  data() {
    return {
      key: 0,
      data: [],
      newsKeyword: "",
      rows: [],
      choosenArr:[""],
      search: {
        // 搜索框
        searchInformation: "",
        // 主要业务
        primaryService: "",
        // 优势航线
        advantageRoutes: ""
      },
      primaryServiceArr: [

        "海运",
        "空运",
        "海铁联运",
        "散杂货出运",
        "跨境物流",
        "亚马逊",
        "港口货物运输代理",
        "道路国际货物运输代理",
        "代理报关",
        "报检",
        "拖车",
        "仓储"
      ],
      advantageRoutesArr: [
        "东南亚",
        "日韩",
        "欧线",
        "印巴线",
        "俄罗斯航线",
        "欧地",
        "非洲",
        "中东",
        "中东红海",
        "印巴",
        "南美",
        "中东线",
        "红海线",
        "美加线",
        "中南美",
        "北美",
        "亚太",
        "美欧非"
      ]
    }
  },
  methods: {
    async getForwarders() {
      let res = await this.$http.get("/api/Agency/GetAgencyList", {
        page: -1,
        searchInformation: this.search.searchInformation,
        primaryService: this.search.primaryService,
        advantageRoutes: this.search.advantageRoutes
      })
      for (let item of res.Rows) {
        item.tags = item.CharacteristicService.split(",")
        item.tags = item.tags.filter(item => item != "")
      }
      this.rows = res.Rows;
    },
    /**
     * 打开浏览器
     */
    openWebsite(item) {
      this.$agent().ipcRequest("window/externalUrl", item.Website)
    },
    choosePrimaryService(item) {
      this.search.primaryService = item
      this.getForwarders()
    },
    chooseAdvantageRoutes(item) {
      this.search.advantageRoutes = item
      this.getForwarders()
    },



    /**轮播相关 */
    async getAd() {
      let res = await this.$http.get("/api/Advertise/GetListFile?onlyShow=true")

      this.data = res.Rows;
      this.key++

    },

    clickAd(item) {
      if (item.Address) {
        this.$agent().ipcRequest("window/externalUrl", item.Address)
      }
    },
    toNewsSearch() {
      this.$router.push({
        path: "/internal/news/newsSearch",
        query: {
          keyword: this.newsKeyword
        }
      })
    }
  },
  created() {
    this.getForwarders()
    this.getAd()
  }
})
</script>

<style lang='scss' scoped>
.top-ad {
  width: 100%;
  height: 229px;

  // position: absolute;
  left: 0px;
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column;

  .banner {
    width: 100%;
    height: 100%;
  }

  .logo {
    width: 100%;
  }
}

.list {
  margin: 0 auto;
  margin-top: 16px;
}

.search-container {
  display: flex;
  width: 440px;
  margin: 0 auto;
  padding: 5px 0px;

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


.search-box {
  background: #F7F8FA;
  border: 1px solid #F2F3F5;
  border-radius: 4px;
  min-height: 56px;
  margin-top: 26px;
  padding: 8px 0px;
  padding-bottom: 16px;
  // align-items: center;
  // display: flex;

  .search-group {
    display: flex;


    .title {
      font-size: 14px;
      color: #969799;
      letter-spacing: 0;
      font-weight: 400;
      line-height: 24px;
      margin-right: 16px;
      width: 66px;
    }

    .options {
      display: flex;

      .option {
        // width: 72px;
        cursor: pointer;
        padding: 0px 16px;
        align-items: center;
        display: flex;
        height: 24px;
        border-radius: 12px;

        font-size: 12px;
        color: #606266;
        letter-spacing: 0;
        text-align: center;
        line-height: 16px;
        font-weight: 400;

        &.selected {
          background: #409EFF;

          font-size: 12px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: center;
          line-height: 16px;
          font-weight: 400;
        }
      }
    }
  }
}
.ad-pic {
  width: 100%;
  height: 229px;
  cursor: pointer;
}
.carousel {
  width: 100%;
  // margin-top:57px;
}
::v-deep .el-carousel__container{
  height: 229px;
}
</style>