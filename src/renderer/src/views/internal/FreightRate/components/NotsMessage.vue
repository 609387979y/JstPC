<template>
  <div>
    <div class="notmessage-container" v-if="isShow" :class="isActive ? 'bg-acitve' : ''">
      <!-- 置顶 -->
      <div :class="isTop ? 'triangle' : ''"></div>
      <img
        class="star-select"
        v-if="data.Collection"
        src="@/assets/consultPrice/star-select.svg"
        style=""
        alt=""
      />
      <div class="note-top">
        <div class="unread-count" v-if="data.UnReadCount">{{ data.UnReadCount }}</div>
        <div class="user-info" v-if="data.Status == 1">
          <img
            v-if="data.ProviderUserLogo"
            :src="data.ProviderUserLogo"
            class="user-avater"
          />
          <img v-else src="@/assets/default-avatar.svg" class="user-avater" alt="" />
          <div class="user-info-right">
            <div class="user-info-name">{{ data.ProviderUserName }}</div>
            <div class="user-info-company">
              {{ data.ProviderCompanyName }}
            </div>
          </div>
        </div>
        <img
          v-else
          class="user-info-mohu"
          src="@/assets/consultPrice/user-info-mohu.png"
          alt=""
        />
      </div>
      <div class="note-port">
        <div class="city" style="text-align: end">{{ data.PolPortEnName }}</div>
        <div class="bar" style="width: 60px; display: flex; align-items: center">
          <div class="plugin-icon">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div class="city">{{ data.DestPortEnName }}</div>
      </div>
      <div class="note-info">
        <div class="start-time">{{ data.DeliveryDate.substring("5", "11") }} 出运</div>
        <img :src="data.ShippingLogo" alt="" />
        <div class="count">
          <span>{{ data.CargoType }}</span>
          <span v-if="data.Count20GP">20GP*{{ data.Count20GP }}</span>
          <span v-if="data.Count40GP"> 40GP*{{ data.Count40GP }}</span>
          <span v-if="data.Count40HQ"> 40HQ*{{ data.Count40HQ }}</span>
          <span v-if="data.Count45HQ"> 45HQ*{{ data.Count45HQ }}</span>
          <span v-if="data.Count40NOR"> 40NOR*{{ data.Count40NOR }}</span>
          <span v-if="data.CountTzx20RF"> 20RF*{{ data.CountTzx20RF }}</span>
          <span v-if="data.CountTzx40NOR"> 40NOR*{{ data.CountTzx40NOR }}</span>
          <span v-if="data.CountTzx40RF"> 40RF*{{ data.CountTzx40RF }}</span>
          <span v-if="data.CountTzx45HQ"> 45HQ*{{ data.CountTzx45HQ }}</span>
        </div>
      </div>
      <div class="note-bottom">
        <div class="price" v-if="!(data.ZdTotalAmountUSD || data.ZdTotalAmountCNY)">
          底价：
          <div v-if="data.time">在 {{ data.time }} 内获取</div>
          <div v-else>即将报价</div>
        </div>
        <div v-else>
         <span>底价：</span>
          <span v-if="data.ZdTotalAmountUSD" class="red">
            USD {{ $utils.formatAmount(data.ZdTotalAmountUSD) }}
          </span>
          <span  v-if="data.ZdTotalAmountUSD && data.ZdTotalAmountCNY"> & </span>
          <span v-if="data.ZdTotalAmountCNY" class="red">
            CNY {{ $utils.formatEmptyString(data.ZdTotalAmountCNY) }}
          </span>
        </div>
        <div class="yj-price">
          预计：
          <span v-if="data.IsShow == false">
            <span v-if="data.YgTotalAmountUSD">USD {{ $utils.formatAmount(data.YgTotalAmountUSD) }}</span>
            <span v-if="data.YgTotalAmountUSD && data.YgTotalAmountCNY"> & </span>
            <span v-if="data.YgTotalAmountCNY"> CNY
            {{ $utils.formatEmptyString(data.YgTotalAmountCNY) }}
            </span>
          </span>
          <span v-else>{{data.ZdTotalAmountUSD || data.ZdTotalAmountCNY?'该运价已单票确认':'该运价需要单票确认'}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import request from "@/public/request";
import dayjs from "dayjs";
import { useTimeCountDown } from "@/utils/nowOrder";
export default defineComponent({
  props: {
    isActive: {
      type: Boolean,
      default: () => false,
    },
    isTop: {
      type: Boolean,
      default: () => false,
    },
    isShow: {
      type: Boolean,
      default: () => true,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  name: "notMessage",
  setup(props) {
    const timeCountDown = useTimeCountDown();
    // async function getPriceStatu() {
    //   const time =props.data.CreateTime;
    //   let nowTime=await request.get("/api/System/GetSystemDate")
    //   nowTime=nowTime.replace(/\//g,'-')
    //   let showTime = timeCountDown.startByCreateTime(time, 30 * 60,nowTime)
    //   props.data.time=showTime

    // }
    onMounted(() => {
      // if(!props.data.ZdTotalAmountCNY&&!props.data.ZdTotalAmountUSD){
      //   getPriceStatu()
      // }
    });
    return {
      dayjs,
    };
  },
});
</script>

<style scoped lang="scss">
.notmessage-container {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  padding: 0 16px;
  margin-bottom: 9px;
  border-radius: 5px;
  background: white;
  border: 1px solid white;
  overflow: hidden;
  .note-top {
    display: flex;
    padding: 12px 0;
    align-items: end;
    .user-info-mohu {
      width: 180px;
    }
    .user-info {
      display: flex;
      .user-avater {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        margin: 0 8px 0 4px;
      }
      .user-info-name {
        font-size: 14px;
        color: #606266;
      }
      .user-info-company {
        font-size: 12px;
        color: #606266;
      }
    }
    .create-time {
      font-size: 10px;
      color: #969799;
      display: inline-block;
      margin-left: 16px;
    }
  }
  .note-info {
    display: flex;
    padding: 5px 0;
    align-items: flex-end;
    white-space: nowrap;
    .start-time {
      border: 1px solid #fd953e;
      border-radius: 2px;
      line-height: 15px;
      padding: 0 6px;
      color: #fd953e;
      font-size: 12px;
    }
    img {
      height: 17px;
      margin: 0 6px;
    }
    .count {
      span {
        font-size: 12px;
        color: #3c4144;
        font-weight: 600;
        margin-right: 6px;
      }
    }
  }
  .note-bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 12px;
    color: #3c4144;
    height: 34px;
    border-top: 1px dashed #e4e7ed;
    align-items: center;
    .price {
      display: flex;
      align-items: center;
      div {
        padding: 5px;
        background: #fef0f0;
        border-radius: 4px;
      }
    }
    .yj-price {
      font-size: 10px;
      color: #606266;
      letter-spacing: -0.71px;
    }
  }
  .days {
    padding-top: 15px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .note-port {
    display: flex;
    .city {
      font-size: 14px;
      font-weight: 600;
      max-width: 160px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .bar {
      width: 100px;
    }
  }
  .price-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    margin-top: 5px;
    .price {
      display: flex;
      align-items: center;
      div {
        padding: 5px;
        background: #fef0f0;
        border-radius: 4px;
      }
    }
  }
  .count {
    font-size: 12px;
    color: #969799;
    margin-top: 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 236px;
    white-space: nowrap; 
    display: block;
    & > div > span {
      &::after {
        content: "/";
      }
      &:last-child::after {
        content: "";
      }
    }
  }
  .type {
    font-size: 12px;
    color: #969799;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
  }
  .company {
    margin-top: 5px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #969799;
    height: 30px;
    border-top: 1px dashed #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
    :nth-child(2) {
      margin-left: 8px;
      cursor: pointer;
    }
    .orange {
      color: #fd953e;
      display: flex;
    }
  }
}

.triangle {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-right: 23px solid #fd953e;
  border-bottom: 23px solid transparent;
}
.red {
  color: #ef4333;
  font-weight: 600;
}
.orange {
  color: #fd953e;
}
.bg-acitve {
  background-color: #fff9f5;
  border: 1px solid #fd953e;
}
.plugin-icon {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 4px;
  div:nth-child(1) {
    width: 7px;
    height: 7px;
    border: 1px solid #969799; /*var(--freight-layout-primary-color)*/
    border-radius: 50%;
  }
  div:nth-child(2) {
    height: 0;
    border: 1px solid #969799;
    width: 60%;
    margin: 0 4px;
  }
  div:nth-child(3) {
    width: 7px;
    height: 7px;
    border: 1px solid #969799; /*var(--freight-layout-primary-color)*/
    border-radius: 50%;
  }
}
.unread-count {
  color: white;
  border: 2px solid white;
  width: 16px;
  height: 16px;
  background: red;
  border-radius: 50%;
  text-align: center;
  position: absolute;
  top: 10px;
  font-size: 12px;
  left: 45px;
  z-index: 10;
}
.star-select {
  position: absolute;
  right: 12px;
  top: 9px;
}
</style>
