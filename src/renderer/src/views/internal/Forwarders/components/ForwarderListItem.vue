<template>
  <div class="forwarder">
    <div class="head" :class="verify ? 'verify' : ''">
      <div class="head-info">
        <div class="logo">
          <img object-fit="fill" :src="companyLogo" style="width: 80px; height: 80px" />
        </div>
        <div class="text">
          <div class="title">{{ formatEmpty(companyName) }}</div>
          <div>
            <img src="@/assets/images/verify.svg" />
            <img v-if="chosen" style="margin-left:9px" src="@/assets/images/choosen.svg" />
          </div>
        </div>
      </div>
    </div>

    <div class="body">
      <div>
        <div class="fields">
          <div class="field">
            <div class="lable">主营业务：</div>
            <div class="value">{{ formatEmpty(mainBusiness) }}</div>
          </div>
          <div class="field">
            <div class="lable">优势航线：</div>
            <div :title="mainRoute" class="value">{{ formatEmpty(mainRoute) }}</div>
          </div>
        </div>
        <div class="tags">
          <el-space wrap>
            <el-tag v-for="item in tags">{{ item }}</el-tag>
          </el-space>
        </div>
      </div>

      <div class="operation">
        <div>
          <el-button @click="toDetail" style="width: 144px" size="large"
            >货代详情</el-button
          >
        </div>
        <div>
          <el-button
            @click="toWebsite"
            class="to-website"
            style="width: 144px"
            size="large"
            >在线服务</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    /**
     * 是否是认证服务商
     */
    verify: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否是精选供应商
     */
    chosen: {
      type: Boolean,
      default: false,
    },
    /**
     * 公司名
     */
    companyName: {
      type: String,
      default: "",
    },
    /**
     * logo
     */
    companyLogo: {
      type: String,
      default: "",
    },
    /**
     * 主营业务
     */
    mainBusiness: {
      type: String,
      default: "",
    },
    /**
     * 优势航线
     */
    mainRoute: {
      type: String,
      default: "",
    },
    tags: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  emits: ["toDetail", "toWebsite"],
  methods: {
    toDetail() {
      this.$emit("toDetail");
    },
    toWebsite() {
      this.$emit("toWebsite");
    },
    formatEmpty(value) {
      return value || "--";
    },
  },
  created() {},
});
</script>

<style lang="scss" scoped>
.forwarder {
  min-width: 358px;
  // box-sizing: border-box;
  width: 100%;
  height: 330px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  margin-bottom: 24px;

  .head {
    width: 100%;
    height: 116px;
    border-radius: 8px 8px 0px 0px;
    // background-image: linear-gradient(270deg, rgba(167, 181, 202, 0.60) 0%, rgba(163, 177, 199, 0.60) 0%, rgba(180, 192, 214, 0.60) 23%, rgba(204, 214, 232, 0.60) 67%, rgba(179, 192, 213, 0.60) 100%);

    .head-info {
      margin-left: 15px;
      padding-top: 15px;
      display: flex;
      align-items: center;
      border-radius: 8px;

      .logo {
        width: 80px;
        height: 80px;
        border: 2px solid;
        border-radius: 8px;
        border-image: linear-gradient(to bottom right, #ccd6e7, #8799b5, #ccd6e8) 1;
        clip-path: inset(0 round 8px);

        img {
          border-radius: 7px;
        }
      }

      .text {
        // margin-top: 15px;
        margin-left: 9px;
        max-width: 290px;

        .title {
          font-size: 20px;
          color: #303133;
          letter-spacing: 0;
          font-weight: 500;
          line-height: 24px;
          margin-bottom: 8px;
        }
      }
    }

    &.verify {
      // background-image: linear-gradient(270deg, #FFE196 0%, #FFE9B7 19%, #FEEDC8 49%, #FFE9B7 100%);
      background: url("../../../../assets/images/forwarder_vertity.png") no-repeat center
        right;
      .logo {
        border-image: linear-gradient(to bottom right, #fcf6e1, #cba15e, #e1c799) 1;
      }
    }
  }

  .body {
    padding: 16px 24px;
    position: relative;
    height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .fields {
      .field {
        display: flex;
        margin-bottom: 8px;

        .lable {
          font-size: 14px;
          color: #969799;
          letter-spacing: 0;
          line-height: 20px;
          font-weight: 400;
          min-width: 70px;
        }

        .value {
          font-size: 14px;
          color: #303133;
          letter-spacing: 0;
          line-height: 20px;
          font-weight: 400;
          display: -webkit-box; //谷歌
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; //显示几行
          overflow: hidden;
        }
      }
    }

    .operation {
      display: flex;
      justify-content: space-between;
      width: 310px;
      margin: 0 auto;
    }
  }
}
.to-website {
  background-image: linear-gradient(182deg, #ff7228 0%, #fa2d18 100%);
  border: 1px solid #fb1616;
  border-radius: 4px;

  font-size: 16px;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 16px;
  font-weight: 500;
  &:hover{
    opacity: 0.8;
  }
}
</style>
