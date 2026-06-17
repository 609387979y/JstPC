<template>
  <div class="title">基本设置</div>
  
  <el-form  :rules="rules" ref="form" class="content" :model="form" label-position="top">
    <div class="form">
      <div>
        <el-form-item prop="Email" label="联系邮箱">
          <el-input v-model="form.Email"></el-input>
        </el-form-item>
        <el-form-item prop="RealName" label="昵称">
          <el-input v-model="form.RealName"></el-input>
        </el-form-item>
        <el-button @click="submit" type="primary">更新基本信息</el-button>
      </div>
      <div class="avatar">
        <div class="info">头像</div>

        <JstImageUploader
          v-model:url="form.Avatar"
          :upload="uploadFile"
          ref="uploader"
          type="avatar"
          style="width:144px;height:144px;"
        >
          <img src="@/assets/default-avatar.svg" />
        </JstImageUploader>
        <el-button style="margin-top: 10px;" @click="uploadAvatar" icon="el-icon-upload2">上传文件</el-button>
      </div>
    </div>
  </el-form>


</template>

<script>
import { defineComponent } from "vue"

export default defineComponent({
  components: {

  },
  data() {
    return {
      form: {
        Email: "",
        RealName: "",
        Avatar: ""
      },
      rules: {
        Email: [{ type: "email", message: '请输入正确的邮箱', trigger: 'blur' }],
        RealName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getUserInfo() {
      if (this.$store.state.auth.user) {
        this.form.Email = this.$store.state.auth.user.Email;
        this.form.RealName = this.$store.state.auth.user.RealName;
        this.form.Avatar = this.$store.state.auth.user.Avatar;
      }
    },
    async uploadFile(file) {
      var form = new FormData();
      form.append("file", file)
      let res = await this.$http.postFile("/api/File/Upload", form)
      if (res.Status == false) {
        this.$message.error(res.Message);
        return ""
      }
      return res.Data
    },
    uploadAvatar(){
      this.$refs.uploader.reUpload();
    },
    async submit(){
      let valid = await this.$refs.form.validate().catch(()=>{})
      if(!valid){
        this.$message.warning("请仔细填写字段");
        return;
      }


      let res = await this.$http.post("/api/CurrentUser/UpdateUserInfo",this.form);
      if(res.Status == false){
        this.$message.error(res.Message);
        return;
      }

      this.$message.success(res.Message);
      this.$store.dispatch("auth/getCurrentUserInfo")
    }
  },
  mounted() {
    this.getUserInfo();
  }
})
</script>

<style lang='scss' scoped>
.title {
  font-size: 16px;
  font-weight: 500;
}
.content {
  margin-top: 14px;
}
.form {
  display: flex;
  .info {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    text-align: left;
  }
  .avatar {
    margin-left: 107px;
    text-align: center;
  }
}
</style>