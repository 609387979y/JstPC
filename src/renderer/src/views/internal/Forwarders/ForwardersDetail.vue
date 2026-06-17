<template>
  <div>
    <div class="head-info verify">

      <div class="main">
        <div class="main-content">
          <div class="left">
            <div class="logo">
              <el-image fit="cover" :src="data.LogoPath" style="width:100%;height: 100%;">
              </el-image>
            </div>
            <div class="info">
              <div class="title" style="margin-bottom:8px">{{ formatEmpty(data.Name) }}</div>
              <div class="field" style="margin-bottom:4px">
                <div class="lable">主营业务：</div>
                <div class="value">{{ formatEmpty(data.PrimaryService) }}</div>
              </div>
              <div class="field">
                <div class="lable">优势航线：</div>
                <div class="value">{{ formatEmpty(data.AdvantageRoutes) }}</div>
              </div>
            </div>
          </div>
          <div class="right">
            <el-button @click="openWebsite"  class="to-website" style="width:144px" type="primary" size="large">在线服务</el-button>
          </div>
        </div>

      </div>
      <div class="sub">


        <div class="sub-content">
          <div class="left">

            <div class="field">
              <div class="lable">注册资金：</div>
              <div class="value">{{ formatEmpty(data.RegistereCapital) }}</div>
            </div>
            <div class="field">
              <div class="lable">成立日期：</div>
              <div class="value">{{ formatEmpty(data.EstablishmentDate) }}</div>
            </div>
            <div class="field">
              <div class="lable">员工规模：</div>
              <div class="value">{{ formatEmpty(data.Scale) }}</div>
            </div>
            <div class="field">
              <div class="lable">公司地址：</div>
              <div class="value">{{ formatEmpty(data.Address) }}</div>
            </div>

          </div>
          <div class="split"></div>
          <div class="right">

            <div class="field" style="margin-bottom:8px">
              <div class="lable">客户群体：</div>
              <div class="value">{{ formatEmpty(data.CustomerGroup) }}</div>
            </div>

            <div class="field">
              <div class="lable">特色服务：</div>
              <div class="value">
                <el-space>

                  <el-tag v-for="item in tags">{{ item }}</el-tag>

                </el-space>

              </div>
            </div>


          </div>


        </div>

      </div>



    </div>

    <div class="detail">
      <div class="detail-main">
        <div ref="leftContent" class="detail-container">
          <div class="title" style="margin-bottom: 16px;">公司简介</div>


          <div class="panel">
            <div v-html="data.CompanyProfile">
            </div>
            <el-divider />
            <div class="panel_info">

              <div class="left">

                <div class="title">
                  <div>
                    <img src="@/assets/images/wangluo.svg" />
                  </div>
                  <div style="margin-left:8px">
                    优势航线
                  </div>


                </div>
                <div class="content">
                  {{ formatEmpty(data.AdvantageRoutes) }}
                </div>


              </div>
              <div class="split"></div>
              <div class="right">
                <div class="title">

                  <div> <img src="@/assets/images/haiguangangkou.svg" /></div>
                  <div style="margin-left:8px">可出运港口</div>
                </div>
                <div class="content">
                  {{ formatEmpty(data.ShippingPort) }}
                </div>


              </div>

            </div>


          </div>
          <div>

          </div>

        </div>
      </div>

      <div style="width:346px">
        <div class="detail-container">
          <div class="title" style="margin-bottom: 16px;">物流专家</div>

          <div class="panel" style="padding:10px 16px">

            <template v-if="data.ExpertList.length == 0">
              <div style="text-align: center;margin-top:30px">
                <div> <img style="width:100px" src="@/assets/images/expert-none.svg" /></div>

                <div style="color:#A3A6AD">
                  暂无专家信息
                </div>
              </div>

            </template>
            <template v-else>
              <el-scrollbar :max-height="leftHeight">
                <template v-for="(item, idx) in data.ExpertList">
                  <div class="expert">
                    <div class="avatar">
                      <el-avatar :src="item.Avatar" :size="48">
                        <img src="@/assets/images/default-avatar.svg" />
                      </el-avatar>

                    </div>
                    <div class="info">
                      <div class="name">{{ formatEmpty(item.Name) }}</div>
                      <div class="line" style="margin-bottom:16px">
                        <span class="lable">擅长航线：</span>
                        <span class="value">{{ formatEmpty(item.AdvantageRoutes) }}</span>
                      </div>
                      <div class="line">
                        <span class="lable">联系电话：</span>
                        <span @click="copyContent(item.PhoneNumber)" class="value">{{ formatEmpty(item.PhoneNumber)
                        }}</span>
                      </div>

                      <div class="line">
                        <span class="lable">联系邮箱：</span>
                        <span class="value">
                          <el-link @click="copyContent(item.Email)" class="link" type="primary">{{
                              formatEmpty(item.Email)
                          }}</el-link>
                        </span>
                      </div>

                      <div class="line" style="display:flex;align-items: center;">
                        <div class="lable">
                          联系QQ：</div>

                        <div class="value"
                          style="display:flex;align-items: center;justify-content: space-between;width: calc(100% - 60px);">
                          <div>
                            <el-link @click="copyContent(item.QQ)" class="link" type="primary">{{ formatEmpty(item.QQ)
                            }}
                            </el-link>
                          </div>

                          <div v-if="item.QQ"
                            style="display:flex;align-items:center;text-align: center;margin-left:10px">
                            <img src="@/assets/images/qq.svg" />
                            <span @click="callQQ(item.QQ)" style="margin-left:6px" class="contract-now">
                              即刻联系</span>
                          </div>

                        </div>
                      </div>


                    </div>
                  </div>

                  <el-divider v-if="idx != data.ExpertList.length - 1"></el-divider>

                </template>

              </el-scrollbar>


            </template>


          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue"
import { utils } from "justom-share"
import copy from "copy-to-clipboard";
export default defineComponent({
  components: {

  },
  data() {
    return {
      data: {
        ExpertList: []
      },
      leftHeight:500
    }
  },
  computed: {
    tags() {
      if (this.data.CharacteristicService) {
        return this.data.CharacteristicService.split(',')
      }
      return []
    }
  },
  methods: {
    /**
     * 复制内容
     * @param {*} content 
     */
    copyContent(content) {
      if (content) {
        copy(content);
        this.$message.success("复制成功！");
      }
    },
    callQQ(qq) {
      if (!qq) {
        return
      }
      this.$agent().ipcRequest(
        "window/externalUrl",
        `tencent://message/?uin=${qq}&Site=在线QQ&amp;Menu=yes`
      );
    },

    formatEmpty(v) {
      return utils.formatEmptyString(v)
    },
    async getInfo() {
      let res = await this.$http.get("/api/Agency/GetAgencyInfo", {
        id: this.$route.query.id
      })

      this.data = res;
      this.$nextTick(()=>{
        this.leftHeight = this.$refs.leftContent.clientHeight - 92
      });
    },
    /**
     * 打开页面
     */
    openWebsite() {
      this.$agent().ipcRequest("window/externalUrl", this.data.Website)
    }



  },
  created() {
    // 滚动到最上面
    // document.querySelector(".el-main.view").scrollTo(0, 0)
    this.getInfo()
  }
})
</script>

<style lang='scss' scoped>
.logo {
  width: 80px;
  height: 80px;
  border: 2px solid;

  border-image: linear-gradient(to bottom right, #CCD6E7, #8799B5, #CCD6E8) 1;
  clip-path: inset(0 round 8px);

  img {
    border-radius: 7px;
  }
}

.verify {
  // background-image: linear-gradient(270deg, #FFE196 0%, #FFE9B7 19%, #FEEDC8 49%, #FFE9B7 100%);

  .logo {
    border-image: linear-gradient(to bottom right, #FCF6E1, #CBA15E, #E1C799) 1;
  }
}

.head-info {
  // box-shadow: 2px 2px 4px #ccc;
  border: 1px solid #E4E7ED;
  border-radius: 8px;

  .main {
    // background-image: linear-gradient(270deg, #FFE196 0%, #FFE9B7 19%, #FEEDC8 49%, #FFE9B7 100%);
    background: url(../../../assets/images/forwarder_vertity_long.png) no-repeat center right;
    height: 116px;

    border-radius: 8px 8px 0 0;

    .main-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      padding-bottom: 16px;

      .left {
        display: flex;

        .info {
          margin-left: 9px;



          .title {
            font-size: 20px;
            color: #303133;
            letter-spacing: 0;
            line-height: 26px;
            font-weight: 500;

          }

        }
      }
    }

    .field .lable {
      color: #969799;
    }
  }

  .sub {
    height: 120px;
    background-color: #fff;
    border-radius: 0 0 8px 8px;


    .sub-content {
      display: flex;
      // justify-content: space-between;
      padding-top: 16px;
      // width:1102px;
      margin-left: 113px;

      .left {
        width: 418px;
      }

      .split {
        width: 1px;
        height: 70px;
        background-color: #E6E6E6;
      }

      .right {
        margin-left: 32px;
      }
    }

  }
}


.field {
  display: flex;
  line-height: 20px;
  align-items: center;

  .lable {
    font-size: 12px;
    color: #C8C9CC;
    text-align: left;
    font-weight: 400;
  }

  .value {
    font-size: 12px;
    color: #303133;
    text-align: left;
    font-weight: 400;
    display: flex;
    justify-content: space-between;
  }
}


.detail {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;

  .panel {
    background: #FFFFFF;
    border-radius: 8px;
    min-height: 200px;
    padding: 24px 16px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
}

.detail-container {

background-image: linear-gradient(0deg, #FFE196 0%, #FFE9B7 19%, #FEEDC8 47%, #FFD869 100%);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 2px 2px 4px #ccc;

  .title {
    font-size: 18px;
    color: #303133;
    letter-spacing: 0;
    font-weight: 500;
  }


}

.contract-now {
  background: #409EFF;
  border-radius: 2px;
  padding: 2px 2px;
  width: 48px;
  height: 17px;
  font-size: 10px;
  color: #FFFFFF;
  letter-spacing: 0;
  font-weight: 400;
  // margin-left: 30px;
  cursor: pointer;
}

.detail-main {
  flex: 1;
  margin-right: 20px;

}

.expert {
  display: flex;

  .avatar {
    background-color: #fff;

    :deep(.el-avatar) {
      background: #fff;
    }
  }

  .info {
    margin-left: 8px;

    .name {

      font-size: 16px;
      color: #303133;
      letter-spacing: 0;
      font-weight: 500;
      margin-bottom: 6px;
    }

    .line {
      margin-bottom: 4px;
    }

    .lable {
      font-size: 12px;
      color: #303133;
      letter-spacing: 0;
      line-height: 17px;
      font-weight: 400;
      text-align: right;
      width: 60px;
    }

    .value {
      font-size: 12px;
      color: #606266;
      letter-spacing: 0;
      line-height: 17px;
      font-weight: 400;
    }

    .voyage {

      font-size: 12px;
      color: #606266;
      letter-spacing: 0;
      line-height: 17px;
      font-weight: 400;
    }

    .link {
      font-size: 12px;
    }



  }
}

:deep(.el-divider--horizontal) {
  border-color: #F2F3F5;
}

.flex {
  display: flex;
}


.panel_info {
  display: flex;

  .title {

    font-size: 12px;
    color: #969799;
    letter-spacing: 0;
    font-weight: 400;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .left {
    width: 418px;
  }

  .split {
    width: 1px;
    height: 70px;
    background-color: #E6E6E6;
  }

  .right {
    margin-left: 32px;
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