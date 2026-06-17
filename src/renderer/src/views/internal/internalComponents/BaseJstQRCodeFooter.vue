<template>
  <div class="qr-info">
    <div class="box">
      <div>
        <img src="@/assets/images/qr-code.png" alt />
      </div>
      <div style="display: flex;flex-direction: column;align-items: center;">
        <div class="text">关注及时通公众号，支持运价订阅、货物跟踪关键节点微信推送，更可获得及时通最新产品、案例及运价信息</div>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
.qr-info {
  background-color: #f2f8fd;
  padding: 20px 30px;
}
.box {
  display: flex;
  img{
    width:102px;
    height:102px;
  }
}
.text {
  color: #a6b4c2;
  line-height: 20px;
  padding:20px 10px;
}
</style>