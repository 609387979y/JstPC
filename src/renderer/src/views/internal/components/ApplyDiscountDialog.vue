<template>
  <el-dialog v-model="visible" width="800px">
    <div class="dialog-result" v-if="result == 1">
      <img class="result-icon" src="@/assets/customWorkbench/jiangjia-01.svg" alt="" />
      <div class="reuslt-title">已向服务商申请查看幅度</div>
      <div class="reuslt-describe">
        服务商预计将在 30分钟内 通过申请 ，您还可以主动 <br />
        <span class="contact">与服务商联系
          <div class="contact-container">
            <ContactDialog :employeeInfo="employeeInfo"></ContactDialog>
          </div>
        </span>，即刻解锁运价幅度
      </div>
      <div class="qa-content">
        <div class="qa-title">解锁服务商有什么用？</div>
        <div class="qa-describe">1.服务商同意后，可直接查看该服务商全部报价的幅度</div>
        <div class="qa-describe" style="margin-top: 12px">
          2.解锁成功后若要了解价格详情与明确降价空间，可直接联系服务商获取确定价格.
        </div>
      </div>
      <div class="service-intro">
        <div class="devide"></div>
        <div class="title">服务商联系人</div>
        <div class="devide"></div>
      </div>
      <ContactDialog style="border:1px solid #dcdfe6;margin-top:5px" :employeeInfo="employeeInfo"></ContactDialog>
      <!--  <div class="company-info">
        
      <div class="company-logo">
          <img :src="companyInfo.ProviderInfo.Logo" alt="" />
        </div>
        <div class="company-detail">
          <div class="company-name">{{ companyInfo.ProviderInfo.CompanyName }}</div>
          <div class="company-detail-item">
            <div class="company-detail-lable">优势口岸：</div>
            <div class="company-detail-content" v-html="companyInfo.ProviderInfo.AdvantageousPort">
            </div>
          </div>
          <div class="company-detail-item">
            <div class="company-detail-lable">优势产品：</div>
            <div class="company-detail-content" v-html="companyInfo.ProviderInfo.AdvantageousProduct">
            </div>
          </div>
        </div> 
      </div>-->
    </div>
    <div class="dialog-result" v-if="result == 2">
      <img class="result-icon" src="@/assets/customWorkbench/undraw_mail_sent_re_0ofv.svg" alt="" />
      <div class="reuslt-title">已通知服务商销售与您联系</div>
      <div class="reuslt-describe">
        服务商预计将在 3分钟内 与您联系，请耐心等待。若您还可以主动<br />
        与服务商联系，即刻获取底价。
      </div>
      <div class="qa-content">
        <div class="qa-title">服务商销售没有联系怎么办？</div>
        <div class="qa-describe">
          1.可能由于销售员正忙无法及时回复您，您可以尝试通过销售信息，主动与销售联系
        </div>
        <div class="qa-describe" style="margin-top: 12px">
          2.若有需要，您也可以请 及时通客服 介入帮您与服务商进行沟通
          <span v-if="employeeInfo.Id" class="contact">联系服务商<el-icon>
              <ArrowRight></ArrowRight>
            </el-icon>
            <div class="contact-container" style="left: 60px">

              <ContactDialog :employeeInfo="employeeInfo"></ContactDialog>
            </div>
          </span>
        </div>
      </div>
      <template v-if="employeeInfo.Id">
        <div class="service-intro">
          <div class="devide"></div>
          <div class="title">服务商销售</div>
          <div class="devide"></div>
        </div>
        <div class="company-info">
          <div class="contact-avatar" style="width: 45px">
            <el-avatar :size="45" :src="employeeInfo.Avatar">
              <img src="@/assets/default-avatar.svg" />
              <div class="ke_fu">客服</div>
            </el-avatar>
          </div>
          <div class="contact-detail">
            <div class="contact-name">{{ employeeInfo.Name }}</div>
            <div class="contact-detail-item">
              <div class="contact-detail-label">电话：</div>
              <div class="contact-detail-content">{{ employeeInfo.TelePhone }}</div>
            </div>
            <div class="contact-detail-item">
              <div class="contact-detail-label">QQ：</div>
              <div class="contact-detail-content blue-text">
                <template v-if="employeeInfo.QQ">
                  <img src="@/assets/customWorkbench/qq.svg" alt="" />
                  <div class="contact-now" @click="openQQ(employeeInfo.QQ)">即刻联系</div>
                  {{ employeeInfo.QQ }}
                </template>
                <template v-else>
                  --
                </template>
              </div>
            </div>
            <!-- <div class="contact-detail-item">
            <div class="contact-detail-label">邮箱：</div>
            <div class="contact-detail-content blue-text">{{ employeeInfo.Email }}</div>
          </div> -->
          </div>
        </div>
      </template>

    </div>
    <div class="dialog-result" v-if="result == 3">
      <img class="result-icon" src="@/assets/customWorkbench/a-zhenrenrenzhengshibai.svg" alt="" />
      <div class="reuslt-default-title"> 似乎拒绝了您查看幅度！</div>
      <div class="reuslt-describe">
        可能由干您的企业信息不完善，或者是服务商无法与您取得进一步联系，使得服务商无法<br />对您企业做出有效判断所产生的结果
      </div>
      <div class="qa-content">
        <div class="qa-title">您可以尝试以下解决方案:</div>
        <div class="qa-describe">
          1.近可能完善您的企业资料信息后重新发起申请
          <span class="contact">联系平台完善<el-icon>
              <ArrowRight></ArrowRight>
            </el-icon></span>
        </div>
        <div class="qa-describe" style="margin-top: 12px">
          2.主动与服务商审核人员进行联系，帮助服务商更好的对您企业有所了解并通过
          <span class="contact">联系服务商<el-icon>
              <ArrowRight></ArrowRight>
            </el-icon></span>
        </div>
        <div class="qa-describe" style="margin-top: 12px">
          3.请 及时通客服 介入帮您与服务商进行沟通
          <span class="contact">联系服务商<el-icon>
              <ArrowRight></ArrowRight>
            </el-icon>
            <div class="contact-container" style="left: 60px">
              <ContactDialog></ContactDialog>
            </div>
          </span>
        </div>
      </div>
    </div>
    <div class="dialog-result" v-if="result == 4">
      <div class="result-company-logo">
        <div class="company-logo-out default-company-logo">
          <div class="company-logo-content"></div>
        </div>

        <div class="company-logo-out">
          <div class="company-logo-content">
            <img src="@/assets/logo.jpg" alt="" />
          </div>
          <img class="star-icon red" src="@/assets/customWorkbench/red_star.svg" alt="" />
          <img class="star-icon yellow" src="@/assets/customWorkbench/yellow_star.svg" alt="" />
          <img class="star-icon org" src="@/assets/customWorkbench/org_star.svg" alt="" />
        </div>
        <div class="company-logo-out default-company-logo">
          <div class="company-logo-content"></div>
        </div>
      </div>
      <div class="reuslt-title">恭喜！您已与 简达物流 成功建立合作！</div>
      <div class="reuslt-describe">
        现在已可以查看<span class="green-text">该服务商全部报价的幅度</span>。若需要获得更精准的价格可以通过<br />
        <span class="blue-text">联系锁价 </span> 功能与服务商销售取得联系，锁定优惠。
      </div>
      <div class="qa-content">
        <div class="qa-title">解锁服务商有什么用？</div>
        <div class="qa-describe">1.服务商同意后，可直接查看该服务商全部报价的幅度</div>
        <div class="qa-describe" style="margin-top: 12px">
          2.解锁成功后若要了解价格详情与明确降价空间，可直接联系服务商获取确定价格.
        </div>
      </div>
      <div class="reuslt-btn" @click="visible = false">知道了</div>
    </div>
    <!-- 广告 -->
    <div class="dialog-result" v-if="result == 5">
      <img class="result-icon" src="@/assets/customWorkbench/undraw_mail_sent_re_0ofv.svg" alt="" />
      <div class="reuslt-title">已通知服务商销售与您联系，了解更多信息</div>
      <div class="reuslt-describe">
        服务商预计将在 3分钟内 与您联系，请耐心等待。若您还可以主动<br />
        与服务商联系，即可获取优惠价格。
      </div>
      <div class="qa-content">
        <div class="qa-title">服务商销售没有联系怎么办？</div>
        <div class="qa-describe">
          1.可能由于销售员正忙无法及时回复您，您可以尝试通过销售信息，主动与销售联系
        </div>
        <div class="qa-describe" style="margin-top: 12px">
          2.若有需要，您也可以请 及时通客服 介入帮您与服务商进行沟通
          <span class="contact">联系服务商<el-icon>
              <ArrowRight></ArrowRight>
            </el-icon>
            <div class="contact-container" style="left: 60px">
              <ContactDialog :employeeInfo="employeeInfo"></ContactDialog>
            </div>
          </span>
        </div>
      </div>

      <div class="service-intro">
        <div class="devide"></div>
        <div class="title">服务商销售</div>
        <div class="devide"></div>
      </div>
      <div class="company-info">
        <div class="contact-avatar" style="width: 45px">
          <el-avatar :size="45" :src="employeeInfo.Avatar">
            <img src="@/assets/default-avatar.svg" />
            <div class="ke_fu">销售</div>
          </el-avatar>
        </div>
        <div class="contact-detail">
          <div class="contact-name">{{ employeeInfo.Name }}</div>
          <div class="contact-detail-item">
            <div class="contact-detail-label">电话：</div>
            <div class="contact-detail-content">{{ employeeInfo.TelePhone }}</div>
          </div>
          <div class="contact-detail-item">
            <div class="contact-detail-label">QQ：</div>
            <div class="contact-detail-content blue-text">
              <template v-if="employeeInfo.QQ">
                <img src="@/assets/customWorkbench/qq.svg" alt="" />
                <div class="contact-now" @click="openQQ(employeeInfo.QQ)">即刻联系</div>
                {{ employeeInfo.QQ }}
              </template>
              <template v-else>
                --
              </template>
            </div>
          </div>
          <!-- <div class="contact-detail-item">
            <div class="contact-detail-label">邮箱：</div>
            <div class="contact-detail-content blue-text">{{ employeeInfo.Email }}</div>
          </div> -->
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { defineComponent, ref, watch, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@/public/request";
import tools from "@/utils/Utils";
import { useStore, Store } from "vuex";
import { ArrowRight } from "@element-plus/icons";
import ContactDialog from "./contactDialog.vue";
import AppCard from "@/components/AppCard.vue";
export default defineComponent({
  components: {
    ArrowRight,
    AppCard,
    ContactDialog,
  },
  data() {
    return {
      visible: false,
      result: 4,
      companyInfo: {},
      employeeInfo: {},
    };
  },
  computed: {
    // 当前登录用户
    currentAvatar() {
      console.log(this.$store.state.auth, "this.$store.state.auth.user");
      if (this.currentUserIsLogin) {
        return this.$store.state.auth.user.Avatar;
      }
      return "";
    },
  },
  methods: {
    openDialog(val, row) {
      this.result = val;
      this.companyInfo = row;
      this.getServerInfo(row);
      console.log(this.companyInfo, "this.companyInfo");
      this.visible = true;
    },
    async getServerInfo(row) {
      let url = "/api/FRProvider/GetEmployees"
      if(this.result == 5 ){
        // 弹窗为广告时请求地址
        url = "/api/FRProvider/GetAdEmployees"
      }
      let res = await this.$http.get(url, {
        rateProviderId: row.CompanyId,
      });
      if (res.Data.length > 0) {
        this.employeeInfo = res.Data[0];
      }
    },
    openQQ(qq) {
      window.open(`tencent://message/?uin=${qq}&Site=在线QQ&amp;Menu=yes`, "_self");
    },
  },
  created() { },
});
</script>

<style lang="scss" scoped>
.dialog-result {
  text-align: center;
  width: 558px;
  margin: 0 auto;

  .result-company-logo {
    margin: 18px 0 42px;
    display: flex;
    align-items: center;
    justify-content: center;

    .company-logo-out {
      margin: 0 24px;
    }
  }

  .result-icon {
    margin-bottom: 42px;
  }

  .reuslt-title {
    font-size: 20px;
    color: #0ba471;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .reuslt-default-title {
    font-size: 20px;
    color: #000000;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .reuslt-describe {
    font-size: 14px;
    color: #606266;
    // margin-bottom: 42px;
    line-height: 24px;

    .green-text {
      color: #0ba471;
    }
  }

  .qa-content {
    background: #f7f8fa;
    border-radius: 4px;
    padding: 16px;
    text-align: start;

    margin: 24px auto;

    .qa-title {
      font-size: 14px;
      color: #000000;
      line-height: 24px;
      margin-bottom: 8px;
    }

    .qa-describe {
      font-size: 12px;
      color: #606266;
      font-weight: 400;
      padding-left: 16px;
    }
  }

  .service-intro {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .devide {
      height: 1px;
      width: 216px;
      background: #dcdfe6;
    }

    .title {
      font-size: 14px;
      color: #969799;
      font-weight: 400;
    }
  }

  .company-info {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 16px;
    display: flex;
    margin: 16px 0;

    .company-logo {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #f7f8fa;
      border-radius: 4px;
      margin-right: 8px;

      img {
        max-width: 80px;
        max-height: 80px;
      }
    }

    .company-detail {
      width: 450px;

      text-align: start;

      .company-name {
        font-size: 16px;
        color: #3c4144;
        letter-spacing: -0.8px;
        font-weight: 500;
      }

      .company-detail-item {
        display: flex;
        font-size: 12px;
        color: #3c4144;
        letter-spacing: 0;
        line-height: 17px;
        font-weight: 400;
        margin-top: 8px;

        .company-detail-lable {
          color: #c8c9cc;
          min-width: 66px;
        }
      }
    }
  }

  .reuslt-btn {
    background-image: linear-gradient(42deg, #457fff 1%, #3775ff 99%);
    border-radius: 24px;
    color: #fff;
    line-height: 48px;
    font-size: 16px;
    font-weight: 500;
    width: 210px;
    margin: 32px auto;
    cursor: pointer;
  }
}

.contact {
  color: #3385ff;
  cursor: pointer;
  position: relative;

  &:hover {
    .contact-container {
      display: block;
    }
  }

  .contact-container {
    transition: 0.3s;
    position: absolute;
    display: none;
    overflow: hidden;
    left: 80px;
    bottom: 0;
    width: 290px;
    background: #fff;
    border: 1px solid #3385ff;
    box-shadow: 0 5px 10px rgba(100, 100, 100, 0.5);

    .contact-header {
      background: #f8f8f8;
      display: flex;
      align-items: center;
      padding: 10px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
      font-weight: 500;
    }

    .contact-content {
      padding: 16px 8px;
      display: flex;
    }
  }
}

.contact-avatar {
  margin: 0 16px 0 8px;

  .ke_fu {
    margin-top: 8px;
  }
}

.contact-detail {
  text-align: start;

  .contact-name {
    font-size: 16px;
    color: #3c4144;
    letter-spacing: -0.8px;
    font-weight: 500;
  }

  .contact-detail-item {
    display: flex;
    font-size: 12px;
    color: #3c4144;
    letter-spacing: 0;
    line-height: 17px;
    font-weight: 400;
    margin-top: 8px;

    .contact-detail-label {
      min-width: 40px;
      text-align: end;
    }

    .contact-detail-content {
      display: flex;
      align-items: center;

      img {
        margin: 0 4px;
      }

      .contact-now {
        cursor: pointer;
        background: #3385ff;
        line-height: 16px;
        padding: 0 2px;
        color: #fff;
        margin-right: 4px;
        border-radius: 2px;
      }
    }
  }
}

.company-logo-out {
  width: 80px;
  height: 80px;
  padding: 2px;
  border-radius: 4px;
  background: linear-gradient(135deg, #fcf6e1 0%, #cba15e 50%, #e1c799 100%);
  box-shadow: 0 0 5px #fce300;
  position: relative;

  .star-icon {
    position: absolute;
  }

  .red {
    right: -10px;
    top: -20px;
  }

  .yellow {
    top: -27px;
    right: 7px;
  }

  .org {
    bottom: 0;
    left: -11px;
  }

  .company-logo-content {
    background: #fff;
    width: 80px;
    height: 80px;
    border-radius: 2px;
    display: flex;
    align-items: center;

    img {
      width: 80px;
      max-height: 80px;
    }
  }
}

.default-company-logo {
  width: 64px;
  height: 64px;
  box-shadow: none;
  background: linear-gradient(135deg, #ccd6e7 0%, #8799b5 50%, #ccd6e8 100%);

  .company-logo-content {
    background-image: linear-gradient(135deg, #ffffff 0%, #e6e6e6 100%);
    width: 64px;
    max-height: 64px;
  }
}

.blue-text {
  color: #3385ff;
}

:deep(.el-icon) {
  vertical-align: bottom;
}
</style>
