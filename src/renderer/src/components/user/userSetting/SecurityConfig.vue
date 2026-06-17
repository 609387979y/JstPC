<template>
    <div class="container">
        <div class="main-title">安全设置</div>

        <JstField type="plain" optCenter>
            <template #title>账号密码</template>
            <template #remark>修改账号的登录密码</template>
            <template #opt>
                <el-button @click="openPasswordDialog" type="text">修改</el-button>
            </template>
        </JstField>

    </div>

    <el-dialog title="修改密码" v-model="passwordFormShow" width="400px">
        <el-form :model="passwordForm" ref="passwordForm" :rules="passwordRules">
            <el-form-item label="手机号">{{ mobilePhone }}</el-form-item>
            <el-form-item label="验证码" prop="verCode">
                <el-input style="width:150px" v-model="passwordForm.verCode"></el-input>
                <el-button
                    :disabled="passwordForm.tick > 0"
                    @click="sendVerCode"
                    style="margin-left:10px"
                >
                    {{
                        passwordForm.tick == -1 ? '发送验证码' : (passwordForm.tick) + '秒后重发'
                    }}
                </el-button>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input show-password v-model="passwordForm.newPassword"></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="passwordFormShow = false">取 消</el-button>
                <el-button type="primary" @click="submitPassword">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { defineComponent } from "vue"
export default defineComponent({
    components: {

    },
    data() {
        return {
            activeName: "password",
            passwordFormShow: false,
            passwordForm: {
                // 验证码
                verCode: "",
                // 密码
                newPassword: "",
                tick: -1
            },
            passwordRules: {
                verCode: [{
                    required: true, message: '请输入验证码', trigger: 'blur'
                }],
                newPassword: [{
                    required: true, message: '请输入新密码', trigger: 'blur'
                }, {
                    min: 6, message: '请输入至少6位的密码', trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        openPasswordDialog() {
            this.passwordForm.verCode = "";
            this.passwordForm.newPassword = "";
            this.passwordFormShow = true;
        },
        async sendVerCode() {
            let res = await this.$http.post("/api/UserVerCode/SendVerCode", {
                mobilePhone: this.mobilePhone,
                type: 1
            });
            if (res.Status) {
                this.passwordForm.tick = 60;
                let id = setInterval(() => {
                    this.passwordForm.tick -= 1;
                    if (this.passwordForm.tick <= 0) {
                        clearInterval(id);
                        this.passwordForm.tick = -1;
                    }
                }, 1000)
            } else {
                this.$message.error(res.Message)
            }
        },
        async submitPassword() {
            let valid = await this.$refs.passwordForm.validate().catch(() => { })
            if (!valid) {
                this.$message.warning("请填写所有字段");
                return;
            }


            let res = await this.$http.post("/api/CurrentUser/ChangePasswordByVerCode", {
                verCode: this.passwordForm.verCode,
                newPassword: this.passwordForm.newPassword
            })


            if (res.Status) {
                this.$message.success(res.Message);
                this.passwordFormShow = false;
            } else {
                this.$message.error(res.Message)
            }

        }
    },
    created() {

    },
    computed: {
        mobilePhone() {
            if (this.$store.state.auth.user) {
                return this.$store.state.auth.user.MobilePhone;
            }
            return ""
        }
    }
})
</script>

<style lang='scss' scoped>
.container {
    width: 100%;
}
.main-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    line-height: 22px;
    margin-bottom: 24px;
}
.current-company{
    display: flex;
}
</style>