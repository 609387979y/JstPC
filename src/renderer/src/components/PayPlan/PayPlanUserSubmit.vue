<template>
  <el-dialog custom-class="company-audit-dialog" :close-on-click-modal="false" top="10vh" v-model="audit.visiable"
    title="职业认证" width="550px" @close="cancel">
    <!-- 400 -->
    <div class="user-info">
      <div class="user-info-item">
        <span class="label">用户姓名：</span>
        <span class="value">{{ userInfo.RealName || '' }}</span>
      </div>
      <div class="user-info-item">
        <span class="label">用户手机：</span>
        <span class="value">{{ userInfo.MobilePhone || '' }}</span>
      </div>
      <div class="user-info-item">
        <span class="label">用户公司：</span>
        <span class="value">{{ userInfo.PersonnelSource || '' }}</span>
      </div>
    </div>
    <div class="QRBox">
      <img src="@/assets/GRRZQRCode.png" />
    </div>
    <div class="QRText">扫码前往完成职业认证即可查看运价幅度</div>
  </el-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import { Upload } from "@element-plus/icons"
export default defineComponent({
  components: {
    Upload
  },
  data() {
    return {
      audit: {
        visiable: false,
        loading: false,
        data: {

        }
      }
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.auth.user || {}
    }
  },
  methods: {
    async openAuditDialog() {
      // console.log(123123);
      // return
      this.audit.visiable = true;
    },
    cancel() {
      this.$store.dispatch("auth/getUserAuth")
      this.audit.visiable = false;
    }
  },
  async mounted() {

  }
});
</script>
<style lang="scss" scoped>
.user-info {
  margin-bottom: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .user-info-item {
    display: flex;
    flex-direction: column;
    // flex: 1;
    min-width: 0;

    .label {
      font-size: 14px;
      font-weight: 500;
      color: rgba(150, 151, 153, 1);
      margin-bottom: 8px;
    }

    .value {
      font-size: 14px;
      color: rgba(50, 50, 51, 1);
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }
}

.QRBox {
  width: 100%;
  text-align: center;
}

.QRBox img {
  // width: 180px;
  width: 240px;
  height: 240px;
}

.QRText {
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #676c77;
  line-height: 48px;
}
</style>
<style lang="scss">
.el-overlay:has(.company-audit-dialog) {
  z-index: 2000 !important;
}
</style>