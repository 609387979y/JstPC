<template>
  <div :class="active ? 'active' : ''" class="box-container">
    <div class="main">
      <div>
        <span class="main-price">{{ coin }}</span>
      </div>
      <div>
        <span style="color: #fa6400">￥</span>
        <span class="real-price">{{ amount }}</span>
        <span v-if="days" class="days-text">/{{ days }}天</span>
        <template v-if="delAmount != ''">
          &ensp;
          <span class="origin-price">￥{{ delAmount }}</span>
        </template>
      </div>
    </div>
    <div class="footer">限时福利</div>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: () => false,
    },
    /**
     * 金额
     */
    amount: {
      type: String,
      default: () => '',
    },
    /**
     * 及时通币数量
     */
    coin: {
      type: String,
      default: () => '',
    },
    /**
     * 被划掉的价格
     */
    delAmount: {
      type: String,
      default: () => '',
    },
    /**
     * 天数
     */
    days: {
      type: [String, Number],
      default: () => '',
    }

  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.box-container {
  height: 116px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  box-sizing: border-box;

  .main {
    height: 83px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    &>div {
      text-align: center;
    }

    padding-top: 10px;
    box-sizing: border-box;
  }

  .footer {
    height: 100%;
    background-color: #ffe8c0;

    text-align: center;
    line-height: 33px;

    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #b57d1e;
    letter-spacing: 0;
    font-weight: 400;
  }
}

.box-container.active {
  border: 2px solid #eabb6a;
  background-color: #fffcf5;
}

.main-price {
  font-weight: 550;
  color: #303133;
  font-size: 20px;
  font-family: HelveticaNeue-Medium;
}

.real-price {
  font-family: HelveticaNeue-Medium;
  font-size: 14px;
  color: #fa6400;
  letter-spacing: -1px;
  font-weight: 550;
}

.origin-price {
  font-family: HelveticaNeue-Medium;
  font-size: 14px;
  color: #fa6400;
  letter-spacing: 0;
  font-weight: 500;
  text-decoration: line-through;
}

.days-text {
  font-family: HelveticaNeue-Medium;
  font-size: 12px;
  color: #969799;
  font-weight: 400;
  margin-left: 4px;
}
</style>