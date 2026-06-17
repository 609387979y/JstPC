<template>
  <div class="fall-list-group">

    <div class="fall-list-item" v-for="(item, index) in data" :key="index" @click="openDrawer(item.Id, 1,item.LogId)">
      <div class="has-consult-tag" v-if="item.Inquired">已询价</div>
      <div class="item-content">
        <div class="float-content">
          <div style="width: 65%" class="float-content-hc-group">
            <!-- <div class="float-content-hq">
              {{
              item.LineDay
              ? item.LineType == 0
              ? item.LineDay + "天"
              : "中转 " + item.LineDay + "天"
              : ""
              }}
            </div> -->
            <div class="float-content-hc">
              <div class="content-port txt-end">
                <div>{{ item.PolEnPortName }}</div>
                <div>{{ item.PolCnPortName }}</div>
              </div>
              <div class="float-content-hq">
                <div style="line-height:18px;text">
                  {{ item.LineDay ? item.LineDay + "天" : "" }}
                </div>
                <div class="step-line-group">
                  <div class="step-line-point"></div>
                  <div class="step-line-bar"></div>
                  <div class="step-line-point"></div>
                </div>
                <div style="line-height: 16px;height:16px;">
                  {{ item.LineType != 0 ? "中转" : "" }}
                </div>
              </div>

              <!-- 目的港悬浮窗 -->
              <el-popover placement="bottom" trigger="hover">
                <template #reference>
                  <div class="content-port">
                    <div>{{ item.DestEnPortName }}</div>
                    <div>{{ item.DestCnPortName }}</div>
                  </div>
                </template>
                <div class="FCL-hover">英文名称：{{ item.DestEnPortName }}</div>
                <div class="FCL-hover">中文名称：{{ item.DestCnPortName }}</div>
                <div class="FCL-hover">所属航线：{{ item.LineName }}</div>
                <div class="FCL-hover">航线明细：{{ item.LineDetailName }}</div>
              </el-popover>
            </div>
            <div class="float-content-zz">
              {{ item.LineType == 0 ? " " : item.PodPortName }}
            </div>
          </div>
          <div style="width: 30%">
            <div class="float-content-ship">
              <div class="float-content-ship-img">
                <img v-if="item.ShippingLogo" :src="item.ShippingLogo" alt />
                <img v-else src="@/assets/images/no-ship-img.png" alt />
              </div>
              <el-popover placement="bottom" trigger="hover">
                <template #reference>
                  <div class="float-content-ship-name">{{ item.ShippingCode }}</div>
                </template>
                <div class="FCL-hover">船司名称：{{ item.EnShippingName }}</div>
              </el-popover>
            </div>
            <div><span class="item-title">码头：</span>{{ item.CnWharfName }}</div>
            <div>
              <span class="item-title">开航/截关：</span>{{ weekCn[item.ETDDate - 1] }}/{{
              weekCn[item.CSTDate - 1]
              }}
            </div>
          </div>
        </div>
        <div class="fixed-content">

          <!-- 基础运价 -->
          <el-row class="fixed-content-price-out" v-if="isCertification">
            <el-col :span="18" class="fixed-content-price-box">
              <el-row class="fixed-content-price-box-row">
                <el-col :span="24">
                  <el-row v-if="item.IsShow">
                    <el-col :span="24" class="over-time-freight-box">
                      <div class="over-time-freight"> *请注意：该运价需要单票确认,询价后即可获取底价</div>
                    </el-col>
                  </el-row>
                  <el-row v-if="!item.IsShow">
                    <el-col :span="8" class="fixed-content-price-else">
                      <div class="has-price" v-if="item.AllOutPrice20GP">
                        <span class="price-title">$</span>{{ item.AllOutPrice20GP }}
                      </div>
                      <div class="has-price" v-else>
                        <div class="disabled-price">停止接货</div>
                      </div>
                    </el-col>
                    <el-col :span="8" class="fixed-content-price-else">
                      <div class="has-price" v-if="item.AllOutPrice40GP">
                        <span class="price-title">$</span>{{ item.AllOutPrice40GP }}
                      </div>
                      <div class="has-price" v-else>
                        <div class="disabled-price">停止接货</div>
                      </div>
                    </el-col>
                    <el-col :span="8" class="fixed-content-price-else">
                      <div class="has-price" v-if="item.AllOutPrice40HQ">
                        <span class="price-title">$</span>{{ item.AllOutPrice40HQ }}
                      </div>
                      <div class="has-price" v-else>
                        <div class="disabled-price">停止接货</div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :span="8" class="fixed-content-price-else">
                      <div class="has-price-type">
                        <div>20GP</div>
                        <div class="has-price-dialog-before" v-if="item.HasHiddenPrice20GP&&item.IsShow == false"></div>
                        <div class="has-price-dialog" v-if="item.HasHiddenPrice20GP&&item.IsShow == false">有底价</div>
                      </div>
                    </el-col>
                    <el-col :span="8" class="fixed-content-price-else">
                      <div class="has-price-type">
                        <div>40GP</div>
                        <div class="has-price-dialog-before" v-if="item.HasHiddenPrice40GP&&item.IsShow == false"></div>
                        <div class="has-price-dialog" v-if="item.HasHiddenPrice40GP&&item.IsShow == false">有底价</div>
                      </div>
                    </el-col>
                    <el-col :span="8" class="fixed-content-price-else">
                      <div class="has-price-type">
                        <div>40HQ</div>
                        <div class="has-price-dialog-before" v-if="item.HasHiddenPrice40HQ&&item.IsShow == false"></div>
                        <div class="has-price-dialog" v-if="item.HasHiddenPrice40HQ&&item.IsShow == false">有底价</div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6" class="fixed-content-price"
              v-if="item.TzxPrice20RF||item.TzxPrice40NOR||item.TzxPrice40RF||item.TzxPrice45HQ">
              <div class="has-price" v-if="item.IsShow == false">
                <span class="price-title" style="width:108px"></span><span class="price-text">有价格</span>
              </div>
              <div v-else style="height: 31px;"></div>
              <div class="has-price-type" style="width:108px">
                <div>特种箱</div>
                <div class="has-price-dialog-before" v-if="item.IsShow == false"></div>
                <div class="has-price-dialog" v-if="item.IsShow == false">询价获取</div>
              </div>
            </el-col>
          </el-row>
          <div class="fixed-content-cz">
            <div class="ask-price">
              <div class="left-button">想优惠？</div>
              <div class="right-button">询问底价</div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashed-line"></div>
      <div class="item-footer">
        <div style="display: flex; align-items: center">
          由

          <img style="width: 100px; margin: 0 8px" src="@/assets/images/company-mohu.png" alt="" />
          公司 发布
        </div>
        <div>
          <!-- <span class="item-footet-hxdm" v-if="item.AMS">AMS/ENS：{{ item.AMS }}</span>
          <el-divider direction="vertical" v-if="item.AMS"></el-divider> -->
          <span class="item-footet-hxdm"
            ><span class="item-title">航线代码：</span>{{ item.LineCode }}</span
          >

          <el-divider direction="vertical"></el-divider>
          <span class="item-footet-hxdm">
            <span class="item-title">有效期：</span>
            {{ item.StartTime.substring(0, 10) }} 至
            {{ item.EndTime.substring(0, 10) }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!data.length && loading == false" class="no-data">
    <img src="@/assets/images/joinEntry.svg" />
    <div>哎呀，暂无找到对应的数据，请尝试其他的查询条件重新查询。</div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, reactive } from "vue";
import request from "@/public/request";
import dayjs from "dayjs";
import { useTimeCountDown } from "@/utils/nowOrder";
export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => { },
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    isCertification: {
      type: Boolean,
      default: () => false,
    },
  },

  setup(props, context) {
    const weekCn = reactive(["周一", "周二", "周三", "周四", "周五", "周六", "周日"]);
    function openDrawer(id, type, LogId) {
      context.emit("openDrawer", id, type, LogId);
    }
    onMounted(() => { });
    return {
      weekCn,
      openDrawer,
    };
  },
});
</script>

<style scoped lang="scss">
@import "@/styles/FCLFreight/FCLFreightFallList.scss";

.fixed-content-price-box-row {
  margin-top: 14px;
  border-left: 1px solid #E4E7ED;
}

.fixed-content-price-else {
  padding: 0 24px;
  .has-price {
    .disabled-price {
      padding: 2px 8px;
      font-size: 14px;
      color: #FFFFFF;
      background: #E4E7ED;
      border-radius: 4px;
      width: 60px;
      margin-bottom: 4px;
    }

    font-size: 24px;
    color: #FA6400;
    width: 100px;
    margin: 0 auto;

    .price-title {
      font-size: 18px;
      color: #FA6400;
    }

    .price-text {
      color: #FF816D;
    }

    font-weight: 600;

  }

  .has-price-type {
    display: flex;
    align-items: end;
    font-size: 14px;
    width: 100px;
    margin: 0 auto;

    .has-price-dialog-before {
      width: 0;

      height: 0;

      border-bottom: 6px solid #FF1D00;

      border-left: 6px solid transparent;
    }

    .has-price-dialog {
      font-size: 12px;
      color: white;
      background: #FF1D00;
      padding: 1px 4px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
}

.over-time-freight-box{
  padding: 0 24px;
}

.over-time-freight {
    background: #fef0f0;
    border-radius: 2px;
    font-size: 12px;
    color: #f56c6c;
    line-height: 22px;
    padding: 2px 8px;
    margin-bottom: 5px;
    border-radius: 3px;
}

.fall-list-group {
  border-left: none;
  border-right: none;

  .fall-list-item:nth-child(odd) {
    background-color: #fff;
  }

  .fall-list-title {
    border-left: 1px solid #e1e1e1;
    border-right: 1px solid #e1e1e1;
  }

  .fall-list-item {
    background-color: #fff;
    margin-top: 17px;

    &:hover {
      background-color: #fff9f5;
    }
  }
}
</style>
