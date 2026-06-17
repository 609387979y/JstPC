<template>
    <el-dialog v-model="show" :title="id === 0 ? '创建服务商' : '编辑企业信息'" width="900px" @closed="handleDialogClosed"
        top="8vh" custom-class="company-edit-dialog">
        <el-form ref="form" class="company-edit-form" label-suffix="：" label-width="140px" :model="formData"
            :rules="rules">
            <div class="subHead">服务商信息 </div>
            <el-row>
                <el-col>
                    <el-form-item prop="CompanyLogo" label="企业Logo">
                        <JstImageUploader :sizeMB="5" :upload="uploadFile" v-model:url="formData.CompanyLogo"
                            style="width: 80px; height: 80px" type="avatar"></JstImageUploader>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item prop="CompanyName" label="企业名称">
                        <el-input v-model="formData.CompanyName" placeholder="企业名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="CompanyShortName" label="企业简称">
                        <el-input v-model="formData.CompanyShortName" placeholder="企业简称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="CompanyCode" label="企业代码">
                        <el-input v-model="formData.CompanyCode" placeholder="企业代码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="BusinessLicense" label="社会统一信用代码">
                        <el-input v-model="formData.BusinessLicense" placeholder="请与营业执照上保持一致，英文字母大写" maxlength="18"
                            show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="营业执照有效期" prop="BusinessLicenseRange">
                        <el-input v-model="formData.BusinessLicenseRange" placeholder="请与营业执照上保持一致" maxlength="70"
                            show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="营业执照" prop="BusinessLicenseImg">
                        <JstImageUploader :sizeMB="5" :upload="uploadFile" v-model:url="formData.BusinessLicenseImg"
                            style="width: 100px; height: 50px" remark="上传营业执照"></JstImageUploader>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="subHead">企业法人信息</div>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="企业法人" prop="BusinessCorporation">
                        <el-input v-model="formData.BusinessCorporation" placeholder="请与营业执照上保持一致" maxlength="10"
                            show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="法人联系方式" prop="BusinessCorporationMobilePhone">
                        <el-input v-model="formData.BusinessCorporationMobilePhone" placeholder="请填写企业法人的手机号码"
                            maxlength="11" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="法人身份证" prop="BusinessCorporationIdNo">
                        <el-input v-model="formData.BusinessCorporationIdNo" placeholder="请填写企业法人的身份证号码" maxlength="18"
                            show-word-limit></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="subHead">联系方式<span class="warning-icon"><el-icon>
                        <Warning />
                    </el-icon>需填写已注册且未企业认证的账号 </span></div>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="企业联系人" prop="ContactName">
                        <el-input v-model="formData.ContactName" placeholder="请输入联系人的真实姓名" maxlength="10"
                            show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系人号码" prop="ContactMobilePhone">
                        <el-input v-model="formData.ContactMobilePhone" placeholder="请输入联系人的手机号码" maxlength="11"
                            show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系人邮箱" prop="ContactMail">
                        <el-input v-model="formData.ContactMail" placeholder="请输入联系人正确的邮箱地址"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="服务商地址" prop="Address">
                        <el-input v-model="formData.Address" placeholder="请填写公司地址" maxlength="70"
                            show-word-limit></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-form-item label="管理员名称" prop="AdminName">
                <el-input v-model="formData.AdminName" placeholder="管理员名称" show-word-limit></el-input>
            </el-form-item>

            <el-form-item label="管理员手机号" prop="AdminMobilePhone">
                <el-input v-model="formData.AdminMobilePhone" placeholder="管理员手机号" show-word-limit></el-input>
            </el-form-item> -->
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
                CompanyName: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
                // CompanyLogo: [{ required: true, message: "请上传公司Logo", trigger: "change" }],
                // CompanyShortName: [{ required: true, message: "请输入公司简称", trigger: "blur" }],
                // CompanyCode: [{ required: true, message: "请输入企业代码", trigger: "blur" }],
                // BusinessLicense: [{ required: true, message: "请输入社会统一信用代码", trigger: "blur" }],
                // BusinessLicenseImg: [{ required: true, message: "请上传营业执照", trigger: "change" }],
                // AdminName: [{ required: true, message: "请输入管理员名称", trigger: "blur" }],
                // AdminMobilePhone: [{ required: true, message: "请输入管理员手机号", trigger: "blur" }],
                // BusinessCorporation: [{ required: true, message: "请输入企业法人", trigger: "blur" }],
                // BusinessCorporationMobilePhone: [{ required: true, message: "请输入法人联系方式", trigger: "blur" }],
                // BusinessCorporationIdNo: [{ required: true, message: "请输入法人身份证", trigger: "blur" }],
                // ContactName: [{ required: true, message: "请输入公司联系人", trigger: "blur" }],
                ContactMobilePhone: [{ required: true, message: "请输入联系人号码", trigger: "blur" }],
                // ContactMail: [{ required: true, message: "请输入联系人邮箱", trigger: "blur" }],
                // Address: [{ required: true, message: "请输入公司地址", trigger: "blur" }]
            }
        }
    },
    watch: {
    },
    methods: {
        open(id) {
            this.show = true
            this.id = id ? id : 0
            this.fetchData()
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

                let res
                if (this.id === 0) {
                    res = await this.$http.post("/api/Company/Create", this.formData)
                } else {
                    res = await this.$http.post("/api/Company/Update", this.formData)
                }

                if (res.Status) {
                    this.$message.success(this.id === 0 ? "创建成功!" : "更新成功!")
                    this.$emit("saved", { id: this.id, data: this.formData })
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
    font-size: 16px;
    color: #606266;
    border-bottom: 1px solid #DCDFE6;
    display: flex;
    align-items: center;
}

.warning-icon {
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;

    .el-icon {
        margin: 0 5px;
    }
}
</style>