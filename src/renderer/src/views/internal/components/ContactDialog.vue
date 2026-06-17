<template>
  <div class="contact-dialog-container">
    <div class="contact-header">
      <img src="@/assets/customWorkbench/kefu.svg" alt="" />
      审核客服联系人
    </div>
    <div class="contact-content">
      <div class="contact-avatar">
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
            <template v-if="employeeInfo.QQ ">
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
</template>

<script>
import { defineComponent, ref, watch, reactive, computed, onMounted } from "vue";
import { ArrowRight } from "@element-plus/icons";

export default defineComponent({
  components: {
    ArrowRight,
  },
  props: {
    employeeInfo: {},
  },
  data() {
    return {
      serverInfo: {},
    };
  },
  computed: {},
  methods: {
    openQQ(qq) {
      window.open(`tencent://message/?uin=${qq}&Site=在线QQ&amp;Menu=yes`, "_self");
    },
  },
  created() {},
  mounted() {
    // this.getServerInfo()
  },
});
</script>

<style lang="scss" scoped>
.contact-dialog-container {
  .contact-header {
    background: #f8f8f8;
    display: flex;
    align-items: center;
    padding: 10px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    font-weight: 500;
    img {
      margin-right: 4px;
    }
  }
  .contact-content {
    padding: 16px 8px;
    display: flex;
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
</style>
