<template>
  <JstCardLayout>
    <template #title>{{ info.Title }}</template>
    <div class="time">{{ info.CreateTime }}</div>
    <el-divider></el-divider>

    <template v-if="info.IsHTML">
      <div v-html="info.Content"></div>
    </template>
    <template v-else>
      <div class="content">{{info.Content}}</div>
    </template>
  </JstCardLayout>
</template>

<script>
import { defineComponent } from "vue"
export default defineComponent({
  props:{
    /**
     * 是否是预览的  (不请求数据)
     */
    preview:{
      type:Boolean,
      default:false
    },
  },
  data() {
    return {
      id: 0,
      isInfo:false,
      info: {}
    }
  },
  methods: {
    async getDetailInfo() {
      let res = await this.$http.get(this.requestUrl, {
        msgId: this.id
      });
      if (!res.Status) {
        this.$message.error(res.Message ?? '失败')
        return;
      }
      this.info = res.Data;
    }
  },
  computed:{
    requestUrl(){
      if(this.isInfo){
        return "/api/message/GetMessageInfoDetail"
      }else{
        return "/api/message/GetMessageDetail"
      }
    }
  },
  mounted() {
    if(this.preview == false){
      this.id = this.$route.query.id;
      if(this.$route.query.info){
        this.isInfo = true;
      }
      this.getDetailInfo();
    }else{

    }

  }
})
</script>

<style lang='scss' scoped>
.time {
  color: rgba(0, 0, 0, 0.4);
}
</style>