<template>
    <div class="user-info">
        <div class="avatar">
            <el-avatar :size="78" :src="userInfo.Avatar">
                <img src="@/assets/default-avatar.svg" />
            </el-avatar>
        </div>
        <div class="content">
            <div class="title">您好，{{ userInfo.RealName }}</div>
            <div class="detail">
                <JstFormField class="field">
                    <template #title>手机：</template>
                    {{ $utils.formatEmptyString(userInfo.MobilePhone) }}
                </JstFormField>
                <JstFormField class="field">
                    <template #title>邮箱：</template>
                    {{ $utils.formatEmptyString(userInfo.Email) }}
                </JstFormField>
                <JstFormField class="field">
                    <template #title>注册时间：</template>
                    {{ $utils.formatDateTime(userInfo.CreateTime) }}
                </JstFormField>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue"
export default defineComponent({
    components: {

    },
    data() {
        return {

        }
    },
    methods: {

    },
    computed: {
        userInfo(){
            if(this.$store.state.auth.user){
                return this.$store.state.auth.user
            }
            return {}
        }
    },
    created() {

    }
})
</script>

<style lang='scss' scoped>
 .user-info {
    display: flex;
    .content {
      margin-left: 16px;
      .title {
        font-size: 16px;
        color: #606266;
        letter-spacing: 0;
        line-height: 22px;
      }
      .detail {
        margin-left: 16px;
        margin-top: 16px;
        .field {
          margin-bottom: 8px;
        }
      }
    }
  }
</style>