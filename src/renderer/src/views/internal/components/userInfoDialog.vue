<template>
    <el-dialog v-model="show" title="身份资料编辑" width="900px" @closed="handleDialogClosed" top="8vh"
        custom-class="company-edit-dialog">
        <el-form ref="form" class="company-edit-form" label-suffix="：" label-width="140px" :model="formData"
            :rules="rules">
            <div class="subHead">身份资料信息 </div>
            <el-row>
                <el-col>
                    <el-form-item label="用户ID" prop="Id">
                        <el-input v-model="formData.Id" placeholder="" maxlength="70" show-word-limit
                            disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="RealName" label="姓名">
                        <el-input v-model="formData.RealName" placeholder="用户名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="用户号码" prop="MobilePhone">
                        <el-input v-model="formData.MobilePhone" disabled placeholder="请输入用户的手机号码" maxlength="11"
                            show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="Email">
                        <el-input v-model="formData.Email" placeholder="请输入正确的邮箱地址"></el-input>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                    <el-form-item prop="CompanyShortName" label="职位">
                        <el-input v-model="formData.CompanyShortName" placeholder="请输入职位"></el-input>
                    </el-form-item>
                </el-col> -->
                <!-- <el-col>
                    <el-form-item prop="CompanyCode" label="网址">
                        <el-input v-model="formData.CompanyCode" placeholder="请填写网址"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="地址" prop="Address">
                        <el-input v-model="formData.Address" placeholder="请填写地址" maxlength="70"
                            show-word-limit></el-input>
                    </el-form-item>
                </el-col> -->
                <!-- <el-col :span="12">
                    <el-form-item label="邀请人" prop="ContactName">
                        <el-input v-model="formData.ContactName" placeholder="请输入邀请人的真实姓名" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="BusinessLicense" label="邀请人所在用户企业" label-width="180px">
                        <el-input v-model="formData.BusinessLicense" placeholder="请输入" show-word-limit></el-input>
                    </el-form-item>
                </el-col> -->
                <el-col>
                    <el-form-item label="头像" prop="Avatar">
                        <JstImageUploader :sizeMB="5" :upload="uploadFile" v-model:url="formData.Avatar"
                            style="width: 100px; height: 50px" remark="上传头像"></JstImageUploader>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <template #footer>
            <div style="text-align: center;">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button @click="handleSubmit" type="primary">保 存</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { defineComponent } from "vue"
import { utils } from "justom-share"

export default defineComponent({
    name: "CompanyInfoDialog",
    props: {

    },
    emits: ['getInfo'],
    data() {
        return {
            show: false,
            id: 0,
            formData: {},
            rules: {
                RealName: [{ required: true, message: "请输入名称", trigger: "blur" }],
            }
        }
    },
    watch: {
    },
    methods: {
        open(data) {
            const info = JSON.parse(JSON.stringify(data))
            this.show = true
            this.formData = info ? info : {}
            // this.fetchData()
        },
        // 编辑公司信息
        async fetchData() {
            if (!this.id) return
            try {
                this.formData = {}
                const res = await this.$http.get("/api/Company/GetCompanyInfo", {
                    companyId: this.id
                })
                if (res.Status) {
                    this.formData = res.Data
                } else {
                    this.$message.error(res.Message)
                }
            } catch (error) {
                this.$message.error("获取公司信息失败，请稍后重试")
            }
        },
        async uploadFile(file) {
            try {
                const formData = new FormData()
                formData.append("file", file)
                const res = await this.$http.postFile("/api/File/Upload", formData)
                if (res.Status) {
                    return res.Data
                } else {
                    this.$message.error(res.Message)
                    return ""
                }
            } catch (error) {
                this.$message.error("文件上传失败，请稍后重试")
                return ""
            }
        },
        // 修改保存
        async handleSubmit() {
            try {
                const isValid = await this.$refs.form.validate().catch(() => false)
                if (!isValid) {
                    this.$message.warning("请填写所有必填项")
                    return
                }

                this.formData.CompanyType = 1

                let res = await this.$http.post("/api/CurrentUser/UpdateUserInfo", this.formData)

                if (res.Status) {
                    this.$message.success("更新成功!")
                    this.closeDialog()
                } else {
                    this.$message.error(res.Message)
                }
            } catch (error) {
                this.$message.error("提交失败，请稍后重试")
            }
        },
        closeDialog() {
            this.show = false
            this.$emit("getInfo")
            this.resetForm()
        },
        resetForm() {
            this.formData = {}
            this.id = 0
            this.$refs.form?.resetFields()
        },
        handleDialogClosed() {
            this.resetForm()
        }
    }
})
</script>
<style lang="scss">
.company-edit-dialog {
    .el-dialog__body {
        padding: 10px 20px 0;
    }
}
</style>
<style lang="scss" scoped>
.company-edit-form {
    :deep(.el-form-item.el-form-item--small) {
        margin-bottom: 15px;
    }
}

.subHead {
    margin-bottom: 20px;
    padding-bottom: 5px;
    font-size: 14px;
    color: #606266;
    border-bottom: 1px solid #DCDFE6;
}
</style>