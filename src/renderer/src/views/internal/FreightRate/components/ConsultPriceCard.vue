<template>
  <div class="container">
    <div v-for="(item, index) in data" :key="index">
      <div class="time" v-if="!item.hideTime">{{ item.CreateTime }}</div>
      <div v-if="item.Type === 0" class="my-card">
        <div class="card">
          <div class="price">
            <div class="icon">
              <img src="@/assets/consultPrice/consult.svg" alt="" />
            </div>
            <div class="guest">已询价，等待承运人报价</div>
          </div>
          <div class="request">挑选好运价啦，记得提醒承运人报价哦</div>
          <div class="solid"></div>
          <div class="btn" v-if="!item.isReply">
            <div class="primary" @click="$emit('urge')">催一下</div>
            <div @click="$emit('toConsult')">询价详情</div>
          </div>
          <div class="btn" v-else>
            <div  class="disable">已报价</div>
          </div>
        </div>

        <img
          v-if="!item.UserLogo"
          src="@/assets/default-avatar.svg"
          class="user-avater"
          alt=""
        />
        <img v-else :src="item.UserLogo" class="user-avater" alt="" />
      </div>
      <!-- <div v-if="item.Type === 0">已催促</div> -->
      <div class="provider-card" v-if="item.Type === 1">
        <img
          v-if="!item.UserLogo"
          src="@/assets/default-avatar.svg"
          class="user-avater"
          alt=""
        />
        <img v-else :src="item.UserLogo" class="user-avater" alt="" />
        <div>
          <div class="user-name">{{ item.UserName }}</div>
          <div class="card">
            <div class="price">
              <div class="icon">
                <img src="@/assets/consultPrice/can.svg" alt="" />
              </div>
              <div class="guest">已报价，与承运人进一步联系</div>
            </div>
            <div class="request">承运人已报价，若满意可提交托书锁定价格</div>
            <div class="solid"></div>
            <div class="btn">
              <div @click="$emit('toOffer')" class="primary">查看报价</div>
              <div v-if="item.isUpLoad" @click="$emit('openOrderFile')">下载托书</div>
              
              <div v-else @click="$emit('submitBookingFile')">提交托书</div>
              <div @click="$emit('askContact')">即刻联系</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="item.Type === 2" class="provider-card">
        <img
          v-if="!item.UserLogo"
          src="@/assets/default-avatar.svg"
          class="user-avater"
          alt=""
        />
        <img v-else :src="item.UserLogo" class="user-avater" alt="" />
        <div>
          <div class="user-name">{{ item.UserName }}</div>
          <div class="card">
            <div class="price">
              <!-- <div class="icon">
            <img src="@/assets/consultPrice/can.svg" alt="" />
          </div> -->
              <div class="guest" style="margin-left: 0">承运人希望您提交您的托书</div>
            </div>

            <div class="request">提交您的托书，获得并锁定精准价格</div>
            <div class="solid"></div>
            <div class="btn">
              <div class="primary" @click="$emit('submitBookingFile')">提交托书</div>
            </div>
          </div>
        </div>
      </div>
      <div class="my-card" v-if="item.Type === 3">
        <div class="card">
          <div class="price">
            <div class="icon">
              <img src="@/assets/consultPrice/qts.svg" alt="" />
            </div>
            <div class="guest">托书已提交</div>
          </div>

          <div class="request">您可以联系承运人进一步了解服务</div>
          <div class="solid"></div>
          <div class="btn">
            <div @click="$emit('openOrderFile')" class="primary">查看托书</div>
            <div @click="$emit('askContact')">即刻联系</div>
          </div>
        </div>
        <img
          v-if="!item.UserLogo"
          src="@/assets/default-avatar.svg"
          class="user-avater"
          alt=""
        />
        <img v-else :src="item.UserLogo" class="user-avater" alt="" />
      </div>
      <div v-if="item.Type === 4" class="consult-text">已催促承运人尽快报价。</div>
      <div v-if="item.Type == 'message'" class="consult-text">
        {{ item.message }}
      </div>

      <div class="provider-card" v-if="item.Type === 5">
        <img
          v-if="!item.UserLogo"
          src="@/assets/default-avatar.svg"
          class="user-avater"
          alt=""
        />
        <img v-else :src="item.UserLogo" class="user-avater" alt="" />
        <div>
          <div class="user-name">{{ item.UserName }}</div>
          <div class="message-card">
            {{ item.Content }}
          </div>
        </div>
      </div>

      <div class="consult-text" v-if="item.Type === 100 && item.Creator == 0">
        您查询了承运人的联系方式。
      </div>
      <div class="consult-text" v-if="item.Type === 100 && item.Creator == 1">
        承运人查询了您的的联系方式。
      </div>
      <div class="my-card" v-if="item.Type == 200 && item.Creator == 0">
        <div class="card">
          <div class="price">您交换了联系方式</div>
          <div class="request">
            为了方便承运人与您及时联系，您提供了您的电话联系方式。
          </div>
          <div class="btn" style="height: 30px"></div>
        </div>
        <img
          v-if="!item.UserLogo"
          src="@/assets/default-avatar.svg"
          class="user-avater"
          alt=""
        />
        <img v-else :src="item.UserLogo" class="user-avater" alt="" />
      </div>
      <div class="provider-card" v-if="item.Type == 200 && item.Creator == 1">
        <img
          v-if="!item.UserLogo"
          src="@/assets/default-avatar.svg"
          class="user-avater"
          alt=""
        />
        <img v-else :src="item.UserLogo" class="user-avater" alt="" />
        <div>
          <div class="user-name">{{ item.UserName }}</div>
          <div class="card">
            <div class="price">
              <div class="icon">
                <img src="@/assets/consultPrice/tel.svg" alt="" />
              </div>
              <div class="guest">承运人交换了联系方式</div>
            </div>
            <div class="request">
              与供应商交换了电话号码，您也可主动与承运人联系：<span class="copy-text"
                >{{ item.UserName }}: {{ item.Content }}</span
              >
            </div>
            <div class="solid"></div>
            <div class="btn">
              <div @click="copyContent(item.Content)" class="primary">复制号码</div>
            </div>
          </div>
        </div>
      </div>

      <div class="consult-text" v-if="item.Type === 101 && item.Creator == 0">
        您查询了承运人的QQ。
      </div>
      <div class="consult-text" v-if="item.Type === 101 && item.Creator == 1">
        承运人查询了您的QQ。
      </div>
      <div class="my-card" v-if="item.Type === 201 && item.Creator == 0">
        <div class="card">
          <div class="price">您交换了QQ</div>
          <div class="request">为了方便承运人与您及时联系，您提供了您的QQ号码。</div>
          <div class="btn" style="height: 30px"></div>
        </div>
        <img
          v-if="!item.UserLogo"
          src="@/assets/default-avatar.svg"
          class="user-avater"
          alt=""
        />
        <img v-else :src="item.UserLogo" class="user-avater" alt="" />
      </div>
      <div class="provider-card" v-if="item.Type === 201 && item.Creator == 1">
        <img
          v-if="!item.UserLogo"
          src="@/assets/default-avatar.svg"
          class="user-avater"
          alt=""
        />
        <img v-else :src="item.UserLogo" class="user-avater" alt="" />
        <div>
          <div class="user-name">{{ item.UserName }}</div>
          <div class="card">
            <div class="price">
              <div class="icon">
                <img src="@/assets/consultPrice/qq.svg" alt="" />
              </div>
              <div class="guest">承运人交换了QQ</div>
            </div>
            <div class="request">
              与供应商交换了QQ，您也可主动与承运人联系：<span class="copy-text"
                >{{ item.UserName }}: {{ item.Content }}</span
              >
            </div>
            <div class="solid"></div>
            <div class="btn">
              <div @click="callQQ(item.Content)" class="primary">联系QQ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { TrendCharts } from "@element-plus/icons";
import copy from "copy-to-clipboard";
import { ElMessage } from "element-plus";
import { getElectronAgent } from "@share/agent";
export default defineComponent({
  name: "inquiryPriceCard",
  props: {
    data: { type: Object, default: () => ({}) },
  },
  emits: ["submitBookingFile"],
  components: {
    TrendCharts,
  },
  methods:{

  },
  setup(props) {
    const agent = getElectronAgent();
    function offer() {}

    function copyContent(content) {
      if (content) {
        copy(content);
        ElMessage.success("复制成功！");
      } else {
        ElMessage.warning("供应商未提供联系信息");
      }
    }
    function callQQ(qq) {
      if (!qq) {
        return ElMessage.warning("供应商未提供QQ");
      }
      agent.ipcRequest(
        "window/externalUrl",
        `tencent://message/?uin=${qq}&Site=在线QQ&amp;Menu=yes`
      );
    }
    onMounted(() => {});
    return { offer, copyContent, callQQ };
  },
});
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  div {
  }
}
.time {
  font-size: 12px;
  color: #969799;
  margin-top: 24px;
  text-align: center;
}
.consult-text {
  text-align: center;
  font-size: 12px;
  color: #969799;
  line-height: 22px;
  margin: 28px 0;
  .copy {
    color: #fd953e;
    cursor: pointer;
  }
}
.card {
  width: 300px;
  background: #ffffff;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 24px 22px 0px 22px;

  .price {
    display: flex;
    align-items: center;

    .icon {
      width: 18px;
      height: 19.5px;
      display: flex;
      align-items: center;
    }

    .guest {
      margin-left: 9px;
      font-size: 16px;
      color: #606266;
      font-weight: 500;
    }
  }

  .request {
    margin-top: 10px;
    font-size: 14px;
    color: #969799;
    font-weight: 400;
    .copy-text {
      color: #fd953e;
    }
  }

  .solid {
    border-top: 1px solid #e4e7ed;
    margin-top: 19px;
  }

  .btn {
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    div {
      flex: 1 0 auto;
      cursor: pointer;
      text-align: center;
      border-right: 1px solid #ffac68;
      &.primary {
        color: #fd953e;
        
      }
      &:last-child {
        border-right: none;
      }
      &.disable{
        color: #d0d1d4;
        cursor: context-menu;
      }
    }
  }
}
.my-card {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;

  margin-top: 32px;
  .user-name {
    text-align: right;
    margin-bottom: 8px;
    color: #606266;
  }
  .card {
    background: #fdf3eb;
  }
  .user-avater {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0 16px;
  }
}
.provider-card {
  display: flex;
  align-items: flex-start;
  justify-content: start;

  margin-top: 32px;
  .user-name {
    margin-bottom: 8px;
    color: #606266;
  }
  .user-avater {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0 16px;
  }
  .card {
    border: 1px solid #e3e7ed;
  }
}
.message-card {
  background: #ffffff;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 22px;
  border: 1px solid #e3e7ed;
  margin-right: 72px;
  word-break: break-all;
}
</style>
