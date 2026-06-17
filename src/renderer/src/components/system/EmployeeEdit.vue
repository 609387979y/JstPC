<template>
    <el-dialog append-to-body :title="employee.isCreate ? '创建' : '编辑'" v-model="employee.show" width="500px">
        <div>
            <el-form
                :model="employee.data"
                :rules="employee.rules"
                ref="ruleForm"
                label-width="100px"
                label-suffix="："
            >
                <el-form-item :error="employee.data.MobilePhoneError" required label="个人账号ID">
                    <template v-if="employee.isCreate">
                        <div style="display: flex;align-items: center;">
                            <el-input placeholder="用户手机号" v-model="employee.data.bindMobilePhone"></el-input>
                            <div style="width: 20px;margin-left:5px">
                                <el-icon
                                    v-if="employee.data.bindUserInfo && employee.data.bindUserInfo.Id"
                                    color="#67C23A"
                                >
                                    <circle-check-filled />
                                </el-icon>
                            </div>

                            <el-button @click="checkMobilePhone" style="margin-left: 15px;">验证手机号</el-button>
                        </div>
                    </template>
                    <template v-else>{{ bindUserNames }}</template>
                    <div style="color:#969799">
                        个人用户注册时候的手机号，企业管理者不可变更
                    </div>
                </el-form-item>

                <el-form-item label="工作昵称" prop="RealName">
                    <el-input v-model="employee.data.RealName"></el-input>
                </el-form-item>

                <el-form-item label="联系号码" prop="MobilePhone">
                    <el-input v-model="employee.data.MobilePhone"></el-input>
                </el-form-item>

                <el-form-item label="联系邮箱" prop="Email">
                    <el-input v-model="employee.data.Email"></el-input>
                </el-form-item>

                <el-form-item v-if="!hideOrg" label="所属部门" prop="OrgId">
                    <el-select v-model="employee.data.OrgId">
                        <el-option
                            :label="item.OrgName"
                            :value="item.Id"
                            v-for="item in orgList"
                            :key="item.Id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :rules="[{required: hideAdmin?true:false,message: '请选择角色',trigger: 'blur'}]"  label="所属角色" prop="Roles">
                    <el-select
                        :disabled="employee.data.IsAdmin"
                        v-model="employee.data.Roles"
                        multiple
                        placeholder="请选择"
                        @change="RolesChange"
                    >
                        <el-option
                            v-for="item in roleList"
                            :key="item.Id"
                            :label="item.RoleName"
                            :value="item.Id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item v-if="hideAdmin == false" label="管理员" prop="IsAdmin">
                    <el-checkbox v-model="employee.data.IsAdmin">是否为企业管理员</el-checkbox>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="employee.show = false">取 消</el-button>
                <el-button type="primary" @click="submitEmployee">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { defineComponent } from "vue"
import { CircleCheckFilled } from "@element-plus/icons"
export default defineComponent({
    components: {
        CircleCheckFilled
    },
    props: {
        companyId: {
            type: Number,
            default: 0
        },
        // 隐藏所属部门 默认放到root上
        hideOrg:{
            type: Boolean,
            default: false
        },
        // 隐藏勾选子管理员的选项
        hideAdmin:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            employee: {
                show: false,
                isCreate: false,
                rules: {
                    RealName: [
                        { required: true, message: "请输入工作昵称", trigger: "blur" },
                    ],
                    OrgId: [
                        { required: true, message: "请选择部门", trigger: "blur" },
                    ],
                },
                data: {
                    Id: 0,
                    RealName: "",
                    AccountNo: "",
                    MobilePhone: "",
                    MobilePhoneError:"",
                    Email: "",
                    IsAdmin: false,
                    CompanyId: 0,
                    OrgId: 0,
                    // 创建并绑定的手机号
                    bindMobilePhone: "",
                    bindUserInfo: {},
                    // 角色
                    Roles: [],
                    BindUserList: []
                },
            },
            roleList: [],
            orgList: []

        }
    },
    methods: {
        createEmployee(isAdmin = false) {
            this.initData();
            this.employee.isCreate = true;
            this.employee.data = {
                Id: 0,
                RealName: "",
                AccountNo: "",
                MobilePhone: "",
                MobilePhoneError:"",
                Email: "",
                IsAdmin: isAdmin,
                CompanyId: this.companyId,
                OrgId: null,
                bindMobilePhone: "",
                bindUserInfo: {},
                Roles: [],
                BindUserList: []
            };

            this.employee.show = true;
        },
        // 更新
        async modifyEmployee(id) {
            this.initData();
            let res = await this.$http.get("/api/Employee/GetEmployeeInfo", { employeeId: id })
            this.employee.isCreate = false;
            this.employee.data = res.Data;
            this.employee.show = true;
        },
        /**
         * 初始化数据
         */
        async initData() {
            let orgRes = await this.$http.get("/api/Company/GetAllOrganizationInCompany", { companyId: this.companyId });
            this.orgList = orgRes;


            let roleRes = await this.$http.get(
                "/api/Role/GetCompanyRoles",
                { companyId: this.companyId }
            );
            this.roleList = roleRes.Data;


        },
        // 提交 
        async submitEmployee() {

            if(this.hideOrg){
                // 隐藏了部门 默认选中跟部门
                let root = this.orgList.find(t=>t.ParentId == 0)
                if(!root){
                    this.$message.error("根部门不存在")
                    return
                }
                this.employee.data.OrgId = root.Id
            }


            let valid = await this.$refs.ruleForm.validate()
            if (!valid) {
                this.$message.warning("请填写所有必填项");
                return;
            }

            let res = null;
            if (this.employee.isCreate) {
                res = await this.$http.post("/api/Employee/CreateAndBindUser", this.employee.data)
            } else {
                res = await this.$http.post("/api/Employee/Update", this.employee.data)
            }
            if (!res.Status) {
                this.$message.error(res.Message);
                return;
            }
            this.$message.success(res.Message ?? "成功");
            this.employee.show = false;
            this.$emit("submit")
        },



        /**
         * 检查手机号
         */
        async checkMobilePhone() {
            if (!this.employee.data.bindMobilePhone) {
                this.$message.warning("手机号不能为空");
                this.employee.data.MobilePhoneError = "手机号不能为空";
                return false;
            }

            let res = await this.$http.get("/api/User/GetUserBaseInfoByMobilePhone", {
                mobilePhone: this.employee.data.bindMobilePhone
            })

            if (!res.Status) {
                this.$message.error("手机号不存在")
                this.employee.data.MobilePhoneError = "手机号不存在";
                return false;
            }
            this.employee.data.bindUserInfo = res.Data;
            this.employee.data.MobilePhoneError = "";
            return true;
        },
        RolesChange(){
            this.$refs.ruleForm.validateField('Roles');
        },

    },
    created() {

    },
    computed: {
        // 绑定的用户名称
        bindUserNames() {
            if (this.employee.isCreate == false) {
                if (this.employee.data && this.employee.data.BindUserList) {
                    return this.employee.data.BindUserList.map(t => `${t.RealName}(${t.MobilePhone})`).join(",")
                }
                return ""
            } else {
                return ""
            }
        }

    }
})
</script>

<style lang='scss' scoped>
</style>