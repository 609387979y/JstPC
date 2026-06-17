<template>
  <div class="container" ref="container">
    <div class="title" style="margin-top: 14px">我的应用</div>
    <div class="content" style="margin-top: 24px">
      <template v-if="collections.length > 0">
        <el-space wrap :size="space">
          <ApplicationMenu @on-remove="getCollections" showMenu v-for="item in collections" :key="item.Id"
            @onClick="toAppDetail(item.ApplicationCode)" :code="item.ApplicationCode">
          </ApplicationMenu>
        </el-space>
      </template>
      <template v-else>
        <el-empty :image-size="100">
          <el-button @click="$router.push('/internal/applicationMenu')" type="text">前往添加应用</el-button>
        </el-empty>
      </template>
    </div>

    <div class="groups ">
      <div class="tool-tab">
        <div class="group" style="display: flex;align-items: center;padding-top:0px">
          <div style="margin-top:0px;font-size:16px" class="tool-title">我的工具</div>
          <div style="margin-left:15px">
            <el-tabs size="large" v-model="currentTab" @tab-click="clickTab" ref="tabs">
              <el-tab-pane label="货物跟踪" name="货物跟踪"></el-tab-pane>
              <el-tab-pane label="物流基础库" name="物流基础库"></el-tab-pane>
              <el-tab-pane label="码头箱动态" name="码头箱动态"></el-tab-pane>
              <el-tab-pane label="通关参数查询" name="通关参数查询"></el-tab-pane>
              <el-tab-pane label="商品贸易" name="商品贸易"></el-tab-pane>
              <el-tab-pane label="物流展会" name="物流展会"></el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>

      <div class="group" ref="货物跟踪">
        <div class="tool-title">
          货物跟踪 - <span class="tool-remark">全面的货物跟踪工具</span>
        </div>
        <div class="content">
          <el-space wrap :size="space">
            <ApplicationMenu @onClick="openToolUrl('tools_airTracking')" code="tools_airTracking">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_tkztcx')" code="tools_tkztcx">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_cbdw')" code="tools_cbdw">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_gjkd')" code="tools_gjkd">
            </ApplicationMenu>
          </el-space>
        </div>
      </div>

      <div class="group" ref="物流基础库">
        <div class="tool-title">
          物流基础库 - <span class="tool-remark">常用物流基础数据整理查询</span>
        </div>
        <div class="content">
          <el-space wrap :size="space">
            <ApplicationMenu @onClick="openToolUrl('tools_zxds')" code="tools_zxds">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_sshlcx')" code="tools_sshlcx">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_hsbmcx')" code="tools_hsbmcx">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_wxpbz')" code="tools_wxpbz">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_wxpysjd')" code="tools_wxpysjd">
            </ApplicationMenu>
          </el-space>
        </div>
      </div>

      <div class="group" ref="码头箱动态">
        <div class="tool-title">
          码头箱动态 -
          <span class="tool-remark">全国主要口岸码头箱动态查询</span>
        </div>
        <div class="content">
          <el-space wrap :size="space">
            <ApplicationMenu @onClick="openToolUrl('tools_ytjd')" code="tools_ytjd">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_yjsj')" code="tools_yjsj">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_tgb')" code="tools_tgb">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_ygt')" code="tools_ygt">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_blsq')" code="tools_blsq">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_dxmt')" code="tools_dxmt">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_msmt')" code="tools_msmt">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_ytmt')" code="tools_ytmt">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_sk/cwmt')" code="tools_sk/cwmt">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_dcw')" code="tools_dcw">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_hgfx')" code="tools_hgfx">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_mtxxx')" code="tools_mtxxx">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_zwy')" code="tools_zwy">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_nsgw')" code="tools_nsgw">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_qdg')" code="tools_qdg">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_tjg')" code="tools_tjg">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_ytg')" code="tools_ytg">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_lyg')" code="tools_lyg">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_xmg')" code="tools_xmg">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_yh')" code="tools_yh">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_gjhg')" code="tools_gjhg">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_symt')" code="tools_symt">
            </ApplicationMenu>
          </el-space>
        </div>
      </div>

      <div class="group" ref="通关参数查询">
        <div class="tool-title">
          通关参数查询 -
          <span class="tool-remark"> 中华人民共和国海关官方通关参数查询</span>
        </div>
        <div class="content">
          <el-space wrap :size="space">
            <ApplicationMenu @onClick="openToolUrl('tools_jgfs')" code="tools_jgfs">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_gn')" code="tools_gn">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_jl')" code="tools_jl">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_cj')" code="tools_cj">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_ysfs')" code="tools_ysfs">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_zmxz')" code="tools_zmxz">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_gq')" code="tools_gq">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_qyxz')" code="tools_qyxz">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_yt')" code="tools_yt">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_zjmsfs')" code="tools_zjmsfs">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_gbdq')" code="tools_gbdq">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_bz')" code="tools_bz">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_dqxz')" code="tools_dqxz">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_jsfs')" code="tools_jsfs">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_jgzj')" code="tools_jgzj">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_gjrh')" code="tools_gjrh">
            </ApplicationMenu>
          </el-space>
        </div>
      </div>

      <div class="group" ref="商品贸易">
        <div class="tool-title">
          商品贸易 - <span class="tool-remark"> 外贸进出口商品货物查询</span>
        </div>
        <div class="content">
          <el-space wrap :size="space">
            <ApplicationMenu @onClick="openToolUrl('tools_jck')" code="tools_jck">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_spcx')" code="tools_spcx">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_tscx')" code="tools_tscx">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_hybz')" code="tools_hybz">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_fqx')" code="tools_fqx">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_cpycd')" code="tools_cpycd">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_glcx')" code="tools_glcx">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_jszn')" code="tools_jszn">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_swfg')" code="tools_swfg">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_swty')" code="tools_swty">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_jwfg')" code="tools_jwfg">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_zzty')" code="tools_zzty">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_zsrz')" code="tools_zsrz">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_mydz')" code="tools_mydz">
            </ApplicationMenu>
          </el-space>
        </div>
      </div>

      <div class="group" ref="物流展会">
        <div class="tool-title">
          物流展会 - <span class="tool-remark"> 汇集国内的行业交流会议</span>
        </div>
        <div class="content">
          <el-space wrap :size="space">
            <ApplicationMenu @onClick="openToolUrl('tools_nbhjh')" code="tools_nbhjh">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_szwbh')" code="tools_szwbh">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_yzwl')" code="tools_yzwl">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_jcwl')" code="tools_jcwl">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_lyz')" code="tools_lyz">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_ywwbh')" code="tools_ywwbh">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_sdwlz')" code="tools_sdwlz">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_yzwlz')" code="tools_yzwlz">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_sxps')" code="tools_sxps">
            </ApplicationMenu>

            <ApplicationMenu @onClick="openToolUrl('tools_wlzb')" code="tools_wlzb">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_gjhs')" code="tools_gjhs">
            </ApplicationMenu>
            <ApplicationMenu @onClick="openToolUrl('tools_jbhs')" code="tools_jbhs">
            </ApplicationMenu>
          </el-space>
        </div>
      </div>
    </div>

    <ApplicationEntryVue ref="appEntry"></ApplicationEntryVue>
    <div class="bottom"></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import ApplicationMenu from "@/components/menu/ApplicationMenu";
import ApplicationEntryVue from "@/components/ApplicationEntry.vue";
import { applications } from "@/components/menu/ApplicationMenu";
import { log } from "mathjs";
export default defineComponent({
  components: {
    ApplicationMenu,
    ApplicationEntryVue,
  },
  setup() {
    return {};
  },
  data() {
    return {
      currentTab: "collection",
      collections: [],
      tools: applications.filter((t) => t.official === false),
      currentTab: "货物跟踪",
      space: 32,
    };
  },
  methods: {
    async getCollections() {
      let res = await this.$http.get("/api/UserCollectionApp/GetCollections", {
        page: -1,
      });
      this.collections = res.Rows;
      this.collections.forEach((t, i) => {
        if (t.ApplicationCode == 'fastCargo') {
          this.collections.splice(i, 1)
        }
      })
    },
    toAppDetail(code) {
      this.$refs.appEntry.entry(code);
    },
    openToolUrl(code) {
      let tool = applications.find((t) => t.code == code);

      window.open(tool.toolUrl);
    },

    clickTab() {
      let name = this.currentTab;

      this.$refs[name].scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    },
    /* 页面滚动，高亮tabs */
    scrollActive(e) {
      // 页面滚动距离(减51是要要减去header的高度)
      let rich = Math.abs(this.rich.getBoundingClientRect().top - 51);
      //判断滚动距离是否在item范围内
      if (rich <= this.itemOffsetTop(1)) {
        this.removeClass();
        this.tabsItem[0].classList.add("is-active");
        this.tabsDom.style = "width:64px;transform: translateX(0px);";
      } else if (rich <= this.itemOffsetTop(2)) {
        this.removeClass();
        this.tabsItem[1].classList.add("is-active");
        this.tabsDom.style = "width:80px;transform: translateX(94px);";
      } else if (rich <= this.itemOffsetTop(3)) {
        this.removeClass();
        this.tabsItem[2].classList.add("is-active");
        this.tabsDom.style = "width:80px;transform: translateX(202px);";
      } else if (rich <= this.itemOffsetTop(4)) {
        this.removeClass();
        this.tabsItem[3].classList.add("is-active");
        this.tabsDom.style = "width:96px;transform: translateX(308px);";
      } else if (rich <= this.itemOffsetTop(5)) {
        this.removeClass();
        this.tabsItem[4].classList.add("is-active");
        this.tabsDom.style = "width:64px;transform: translateX(438px);";
      } else if (rich <= this.itemOffsetTop(6)) {
        this.removeClass();
        this.tabsItem[5].classList.add("is-active");
        this.tabsDom.style = "width:64px;transform: translateX(534px);";
      }
    },
    /* 统一清除tabs高亮 */
    removeClass() {
      for (let i = 0; i < this.tabsItem.length; i++) {
        this.tabsItem[i].classList.remove("is-active");
      }
    },
    /* 获取item至顶部的距离 */
    itemOffsetTop(i) {
      return this.group[i].offsetTop;
    },
  },
  created() {
    this.getCollections();
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("scroll", this.scrollActive, true);
    })
  },
  /* 获取dom */
  computed: {
    tabsDom() {
      return document.getElementsByClassName("el-tabs__active-bar")[0];
    },
    tabsItem() {
      return document.getElementsByClassName("el-tabs__item");
    },
    rich() {
      return this.$refs.container;
    },
    group() {
      return document.getElementsByClassName("group");
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  color: #333;
}

body {
  overflow: auto;
}

.bottom {
  height: 230px;
}

.container {
  background-color: #fff;
  padding: 10px;

  :deep(.el-tabs__header) {
    margin: 0px;
  }

  :deep(.el-space__item) {
    padding-bottom: 16px !important;
  }

  :deep(.el-tabs__item) {
    font-size: 14px;
  }

  :deep(.el-tabs__nav-wrap::after) {
    background-color: #f2f3f5;
    height: 1px;
  }
}

.content {
  margin-top: 16px;
}

.tool-title {
  font-size: 15px;
  color: #333;
  margin-top: 32px;
}

.tool-remark {
  font-size: 14px;
  font-weight: 500;
  color: #727887;
  line-height: 16px;
}

.groups {
  margin-top: 56px;
}

.group {
  padding-top: 32px;
}

.fixed {
  // position: sticky;
  // top:0px;
  // z-index:99;
  // background-color: #fff;
}

.tool-tab {
  position: sticky;
  top: 0px;
  z-index: 2;
  background-color: #fff;
}
</style>
