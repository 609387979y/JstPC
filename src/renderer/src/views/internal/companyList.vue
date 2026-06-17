<template>
    <JstDetailHeader class="userCompanyDetail-header">
        <template #title>
            <div class="header-title">
                服务商名称：{{ state.info.CompanyName }}
            </div>
        </template>
        <template #btns>
        </template>
        <div>
            <el-row>
                <el-col :span="8">
                    <JstFormField main="value">
                        <template #title>子管理员：</template>
                        {{ formatNameAndPhone(state.info.AdminName, state.info.AdminMobilePhone) }}
                    </JstFormField>
                </el-col>
                <el-col :span="8">
                    <JstFormField main="value">
                        <template #title>创建人：</template>
                        {{ formatNameAndPhone(state.info.ContactName, state.info.ContactMobilePhone) }}
                    </JstFormField>
                </el-col>
                <el-col :span="8">
                    <JstFormField main="value">
                        <template #title>入驻时间：</template>
                        {{ state.info.CreateTime }}
                    </JstFormField>
                </el-col>
            </el-row>
        </div>
        <!-- <div style="width: 100%;height: 50px;"></div> -->
    </JstDetailHeader>
    <div style="height: 20px;"></div>
    <!-- <div class="tabs-box">
        <el-tabs v-model="state.activeName" class="demo-tabs" @tab-click="active1Change">
            <el-tab-pane label="服务商资料" :name="0"></el-tab-pane>
            <el-tab-pane label="服务商财务情况" :name="1"></el-tab-pane>
        </el-tabs>
    </div> -->
    <div class="page-container" v-show="state.activeName == 0">
        <JstCardLayout border>
            <template #title>服务商信息</template>
            <el-row>
                <!-- <div class="title-btn"> <el-button type="text" @click="toEditCompanyInfo">编辑</el-button></div> -->
            </el-row>
            <el-row style="margin-top: 14px;background-color:#f7f8fa;padding: 10px 5px 5px;">

                <el-col :span="12">
                    <JstFormField>
                        <template #title>企业名称：</template>
                        {{ $utils.formatEmptyString(state.info.CompanyName) }}
                    </JstFormField>
                </el-col>
                <el-col :span="12">
                    <JstFormField>
                        <template #title>企业简称：</template>
                        {{ $utils.formatEmptyString(state.info.CompanyShortName) }}
                    </JstFormField>
                </el-col>
                <el-col :span="12">
                    <JstFormField>
                        <template #title>企业代码：</template>
                        {{ $utils.formatEmptyString(state.info.CompanyCode) }}
                    </JstFormField>
                </el-col>
                <el-col :span="12">
                    <JstFormField>
                        <template #title>企业Id：</template>
                        {{ $utils.formatEmptyString(state.info.CompanyIdentifier) }}
                    </JstFormField>
                </el-col>
                <el-col :span="12">
                    <JstFormField>
                        <template #title>社会统一信用代码：</template>
                        {{ $utils.formatEmptyString(state.info.BusinessLicense) }}
                    </JstFormField>
                </el-col>
                <el-col :span="12">
                    <JstFormField>
                        <template #title>营业执照有效期：</template>
                        {{ $utils.formatEmptyString(state.info.BusinessLicenseRange) }}
                    </JstFormField>
                </el-col>

                <el-col :span="12">
                    <JstFormField>
                        <template #title>企业法人：</template>
                        {{ $utils.formatEmptyString(state.info.BusinessCorporation) }}
                    </JstFormField>
                </el-col>
                <el-col :span="12">
                    <JstFormField>
                        <template #title>法人身份证：</template>
                        {{ $utils.formatEmptyString(state.info.BusinessCorporationIdNo) }}
                    </JstFormField>
                </el-col>

                <el-col :span="12">
                    <JstFormField>
                        <template #title>公司联系人：</template>
                        {{ $utils.formatEmptyString(state.info.ContactName) }}&nbsp;&nbsp;&nbsp;({{
                            $utils.formatEmptyString(state.info.ContactMobilePhone) }})
                    </JstFormField>
                </el-col>
                <el-col :span="12">
                    <JstFormField>
                        <template #title>联系人邮箱：</template>
                        {{ $utils.formatEmptyString(state.info.ContactMail) }}
                    </JstFormField>
                </el-col>

                <el-col :span="12">
                    <JstFormField>
                        <template #title>企业地址：</template>
                        {{ $utils.formatEmptyString(state.info.Address) }}
                    </JstFormField>
                </el-col>
                <el-col>
                    <JstFormField>
                        <template #title>管理员名称：</template>
                        {{ $utils.formatEmptyString(state.info.AdminName) }}&nbsp;&nbsp;&nbsp;({{
                            $utils.formatEmptyString(state.info.AdminMobilePhone) }})
                    </JstFormField>
                </el-col>

                <el-col :span="12">
                    <JstFormField>
                        <template #title>企业Logo：</template>
                        <el-image v-if="state.info.CompanyLogo" style="width: 100px; height: 100px"
                            :src="state.info.CompanyLogo" :preview-src-list="[state.info.CompanyLogo]">
                        </el-image>
                        <div class="no-img-circle" v-else>
                            暂未上传
                        </div>
                    </JstFormField>
                </el-col>
                <el-col :span="12">
                    <JstFormField>
                        <template #title>营业执照：</template>
                        <el-image v-if="state.info.BusinessLicenseImg" style="width: 100px; height: 100px"
                            :src="state.info.BusinessLicenseImg"
                            :preview-src-list="[state.info.BusinessLicenseImg]"></el-image>
                        <div class="no-img" v-else>
                            暂未上传
                        </div>
                    </JstFormField>
                </el-col>
            </el-row>
            <CustomerInfoDialog ref="customerInfoDialogRef" @getInfo="getCompanyInfo"></CustomerInfoDialog>
        </JstCardLayout>
        <JstCardLayout border>
            <template #title>服务商成员</template>
            <div style="height: 10px;"></div>
            <el-row :gutter="10">
                <el-col :span="5">
                    <JstTitleBox>
                        <template #title>组织结构</template>
                        <el-tree ref="tree" default-expand-all node-key="Id" :expand-on-click-node="false"
                            :data="state.organization" :props="{ label: 'OrgName', children: 'Children' }"
                            @node-click="orgNodeClick" class="employee-list-tree">
                            <template #default="{ node, data }">
                                <div class="name orgItem">
                                    <div>{{ node.label }}</div>
                                    <div class="moreOpt">
                                        <el-dropdown trigger="click">
                                            <img class="el-dropdown-link" src="@/assets/images/menu.svg" />

                                            <template #dropdown>
                                                <el-dropdown-menu>
                                                    <el-dropdown-item @click="addOrg(data.Id)">添加</el-dropdown-item>
                                                    <el-dropdown-item @click="updateOrg(data)">编辑</el-dropdown-item>
                                                    <el-dropdown-item @click="deleteOrg(data.Id)">删除</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </template>
                                        </el-dropdown>
                                    </div>
                                </div>
                            </template>
                        </el-tree>
                    </JstTitleBox>
                </el-col>
                <el-col :span="19">
                    <AppSearchFormMini @reset="reset" @submit="getList" label-width="80px">
                        <el-row class="search-form-row">
                            <el-col :span="6">
                                <el-form-item label="账号名称">
                                    <el-input v-model="state.search.RealName" placeholder="用户名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="联系号码">
                                    <el-input v-model="state.search.MobilePhone" placeholder="联系号码"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="所属角色">
                                    <el-select v-model="state.search.RoleId">
                                        <el-option label="全部" value></el-option>
                                        <el-option v-for="item in state.roleList" :key="item.Id" :label="item.RoleName"
                                            :value="item.Id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-form-item label="入驻时间">
                                <JstDateRange v-model:start="state.search.CreateTimeStart"
                                    v-model:end="state.search.CreateTimeEnd">
                                </JstDateRange>
                            </el-form-item>
                            <el-col :span="6">
                                <div class="Search-Btn">
                                    <el-button type="primary" @click="getList">查询</el-button>
                                    <el-button type="text" @click="reset">清空</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </AppSearchFormMini>
                    <div v-if="isAdmin" class="btn-group">
                        <el-button @click="inviteEmployee" type="primary">邀请同事</el-button>
                        <el-button @click="deleteEmployees(null)" :icon="Delete">删除同事</el-button>
                    </div>

                    <JstPageTable :data="state.tableData" @change="getList" :option="state.tableOption">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column label="操作">
                            <template #default="scope">
                                <template v-if="currentEmployeeId == scope.row.Id">
                                    <el-link @click="leaveCompany" type="danger">离开企业</el-link>
                                </template>
                                <template v-else>
                                    <el-button v-if="isAdmin" @click="editEmployee(scope.row.Id)"
                                        type="text">编辑</el-button>
                                    <el-button v-if="isAdmin" @click="deleteEmployees(scope.row.Id)"
                                        type="text">删除</el-button>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="RealName" label="账号名称">
                            <template #default="scope">
                                <div>
                                    {{ scope.row.RealName }}
                                    <el-tag v-if="scope.row.IsAdmin" type="primary">子管理员</el-tag>
                                    <el-tag v-if="scope.row.Enable == false" type="danger">禁用</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="BindUserNames" label="绑定用户"></el-table-column>
                        <el-table-column prop="MobilePhone" label="联系号码"></el-table-column>
                        <el-table-column prop="Email" label="联系邮箱"></el-table-column>
                        <el-table-column prop="OrgName" label="部门名称"></el-table-column>
                        <el-table-column prop="RoleNameText" label="所属角色"></el-table-column>
                        <el-table-column prop="CreateTime" label="入驻时间">
                            <template #default="scope">{{ $utils.formatDateTime(scope.row.CreateTime) }}</template>
                        </el-table-column>
                    </JstPageTable>
                </el-col>
            </el-row>
        </JstCardLayout>
    </div>

    <EmployeeEdit @submit="getList" :companyId="state.info.Id" ref="editEmpRef" hideAdmin></EmployeeEdit>
</template>
<script setup>
import { defineComponent, ref, reactive, computed, onMounted, toRaw, nextTick, } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import { useTableOption } from "justom-share";
import request from "@/public/request";
import { ElMessage, ElMessageBox } from "element-plus";
import AppSearchFormMini from "@/components/AppSearchFormMini.vue";
import CustomerInfoDialog from "./components/CustomerInfoDialog.vue";
import EmployeeEdit from "@/components/system/EmployeeEdit.vue";
import { useWallet } from "@/composables/pay/useWallet"

const store = useStore();
const wallet = useWallet()

const route = useRoute();
const router = useRouter();
const state = reactive({
    id: 0,
    info: {},
    activeName: 0,
    activeName2: 0,
    tableData: [],
    search: {
        RealName: "",
        MobilePhone: "",
        RoleId: null,
        CreateTimeStart: "",
        CreateTimeEnd: "",
    },
    tableOption: useTableOption(),
    roleList: [],
    wallet: {},
    organization: [],
    orgId: 0,
})
const editEmpRef = ref()
const customerInfoDialogRef = ref()
const expenseLogRef = ref()
const rechargeLogRef = ref()
const toEditCompanyInfo = () => {
    customerInfoDialogRef.value.open(state.info.Id)
}
// 公司基本信息
const getCompanyInfo = async () => {
    const res = await request.get("/api/Company/GetCompanyInfo", {
        companyId: employee.value.CompanyId,
    });
    state.info = res.Data;
}
async function getOrganization() {
    let res = await request.get("/api/Company/GetCurrentOrganizationCompany", {
        companyId: employee.value.CompanyId,
    });
    state.organization = [
        {
            Id: res.Data.Id,
            OrgName: res.Data.OrgName,
            Children: res.Data.Children,
        },
    ];
    state.orgId = res.Data.Id;
    getList();
}

// 获取金额
const getWalletDictionary = async () => {
    const res = await request.get("/api/PayWallet/GetWalletDictionary");
    if (res.Status) {
        state.wallet = res.Data
    } else {
        ElMessage.error(res.Message)
    }
}
// 公司成员列表
const getList = async () => {
    state.tableOption.loading = true;
    let res = await request.get("/api/Employee/GetEmployeeInCompany", {
        page: state.tableOption.page,
        limit: state.tableOption.pageSize,
        OnlyBind: true,
        OrgId: state.orgId,
        ...state.search,
    });
    if (state.roleList.length == 0) {
        request
            .get("/api/Role/GetCompanyRoles", {
                CompanyId: state.info.Id,
            })
            .then((res) => {
                state.roleList = res.Data;
            });
    }
    state.tableOption.total = res.Total;
    for (let row of res.Rows) {
        // RoleName
        if (row.RoleName) {
            row.RoleNameText = row.RoleName.join(',')
        }
        if (row.IsAdmin) {
            row.RoleNameText = "子管理员"
        }
        if (row.EmployeeBindUserInfoList && row.EmployeeBindUserInfoList.length > 0) {
            row.UserId = row.EmployeeBindUserInfoList[0].UserId;
            row.UserMobilePhone = row.EmployeeBindUserInfoList[0].MobilePhone;
            row.UserRealName = row.EmployeeBindUserInfoList[0].RealName;
            row.UserAvatar = row.EmployeeBindUserInfoList[0].Avatar;
            row.BindUserNames = row.EmployeeBindUserInfoList.map(t => t.RealName).join(',')
        }
    }
    state.tableData = res.Rows;
    state.tableOption.loading = false;
}
const reset = () => {
    state.search = {
        RealName: "",
        MobilePhone: "",
        RoleId: null,
        CreateTimeStart: "",
        CreateTimeEnd: "",
    };
    getList()
}
const employee = computed(() => {
    if (store.state.auth.employee) {
        return store.state.auth.employee;
    } else {
        return {};
    }
});
// 当前员工是否是子管理员
const isAdmin = computed(() => store.getters["auth/isAdmin"]);
// 当前员工id
const currentEmployeeId = computed(() => {
    if (!store.state.auth.employee) {
        return 0
    }
    return store.state.auth.employee.Id;
});

/**
   * 编辑
   * @param {*} id 
   */
function editEmployee(id) {
    editEmpRef.value.modifyEmployee(id);
}

/**
 * 删除员工
 * @param {*} id 
 */
async function deleteEmployees(id) {
    let ids = []
    if (id === null || id === undefined) {
        ids = state.tableOption.selected
    } else {
        ids = [id]
    }
    if (ids.length === 0) {
        ElMessage.warning("请选择一行")
        return;
    }

    await ElMessageBox.confirm(
        '是否删除选中员工?',
        '删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'el-message-box-general',
        }
    )


    let res = await request.post("/api/Employee/RemoveEmployeeAllCorrelationList", {
        employeeIdList: ids
    })
    if (!res.Status) {
        ElMessage.error(res.Message ?? '失败')
        return;
    }
    ElMessage.success('成功');
    getList();
}


/**
 * 离开企业
 */
async function leaveCompany() {
    await ElMessageBox.confirm(
        '是否确定离开企业?',
        '离开企业',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error',
        }
    )

    let res = await request.post("/api/AuthEmployee/LeaveCompany")
    if (!res.Status) {
        ElMessage.error(res.Message ?? '失败')
        return;
    }
    ElMessage.success('成功');
    await router.push("/")
    await store.dispatch("auth/setTokenAndGetInfo", res.Data)
}


/**
 * 邀请同事
 */
function inviteEmployee() {
    editEmpRef.value.createEmployee();
}
const active1Change = () => {
    if (state.activeName == 0) {
        nextTick(() => {
            getList()
        })
    }
    if (state.activeName == 1 && state.activeName2 == 0) {
        nextTick(() => {
            expenseLogRef.value.getList()
        })
    }
    if (state.activeName == 1 && state.activeName2 == 1) {
        nextTick(() => {
            rechargeLogRef.value.getList()
        })
    }
}
const active2Change = () => {
    if (state.activeName2 == 0) {
        nextTick(() => {
            expenseLogRef.value.getList()
        })
    }
    if (state.activeName2 == 1) {
        nextTick(() => {
            rechargeLogRef.value.getList()
        })
    }
}
const setStatusClass = (i, type) => {
    let str = "";
    if (type == 1) {
        switch (i) {
            case 0:
                str = "geryStatus";
                break;
            case 1:
                str = "blueStatus";
            default:
                break;
        }
        return str;
    }
    if (type == 2) {
        switch (i) {
            case 0:
                str = "未认证";
                break;
            case 1:
                str = "已认证";
            default:
                break;
        }
        return str;
    }
}
const formatNameAndPhone = (name, phone) => {
    if (name && phone) {
        return `${name}(${phone})`;
    } else if (name || phone) {
        return name || phone;
    } else {
        return '- -';
    }
}
function orgNodeClick(data) {
    state.orgId = data.Id;
    state.tableOption.page = 1;
    getList();
}
/**
 * 添加
*/
async function addOrg(parentId) {
    const { value } = await ElMessageBox.prompt("请输入部门名称", "创建", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "部门名称不能为空",
    });

    let res = await request.post("/api/Company/AddOrModifyOrganization", {
        OrgName: value,
        CompanyId: employee.value.CompanyId,
        ParentId: parentId,
    });
    if (!res.Status) {
        ElMessage.error(res.Message ?? "失败");
        return;
    }
    ElMessage.success("成功");
    getOrganization();
}
/**
   * 更新
   */
async function updateOrg(data) {
    const { value } = await ElMessageBox.prompt("请输入部门名称", "修改", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "部门名称不能为空",
        inputValue: data.OrgName,
    });

    let res = await request.post("/api/Company/AddOrModifyOrganization", {
        OrgName: value,
        Id: data.Id,
    });
    if (!res.Status) {
        ElMessage.error(res.Message ?? "失败");
        return;
    }
    ElMessage.success("成功");
    getOrganization();
}
/**
 * 删除
 */
async function deleteOrg(orgId) {
    let res = await request.post("/api/Company/DeleteOrganization", {
        orgId: orgId,
    });
    if (!res.Status) {
        ElMessage.error(res.Message ?? "失败");
        return;
    }
    ElMessage.success(res.Message);
    getOrganization();
}
onMounted(() => {
    getCompanyInfo()
    getWalletDictionary()
    getOrganization()
    // getList()
})
</script>
<style lang="scss" scoped>
.employee-list-tree {
    :deep(.el-tree-node) {
        color: #606266;
    }

    :deep(.el-tree-node.is-current) {
        color: #409eff;
    }

    .orgItem {
        width: 100%;
        display: flex;
        position: relative;
    }

    .moreOpt {
        position: absolute;
        right: 5px;
        top: -12px;
    }

    .el-dropdown-link {
        margin-top: 15px;
        opacity: 0;
    }
}

::v-deep(.el-tree-node__content) {
    &:hover .el-dropdown-link {
        opacity: 1;
    }
}

.header-title {
    display: flex;
    align-items: center;

    .header-status {
        font-size: 12px;
        display: flex;
        margin-left: 10px;
    }

    .edit-Btn {
        margin-left: 10px;
        font-size: 14px;
        cursor: pointer;
        border: 1px solid #3B78FF;
        color: #3B78FF;
        height: 20px;
        line-height: 20px;
        padding: 0px 2px;
    }

    .company-status {
        margin-left: 10px;
        display: flex;
        align-items: center;
        font-size: 14px;

        span {
            height: 20px;
            line-height: 20px;
            padding: 2px 5px;
            border: 1px solid;
            margin-left: 5px;
        }
    }
}

.MyTabsCard {
    :deep(.el-card__body) {
        padding-bottom: 5px;
    }
}

.el-col {
    margin-bottom: 10px;
}

.search-form-row {
    .el-col {
        margin-bottom: 0px;
    }
}

.tabs-box {
    padding: 0 33px;
    margin-top: -52px;
}

.title-btn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    margin-top: -35px;

    .el-button {
        font-size: 14px;
    }
}

.Search-Btn {
    display: flex;
    height: 34px;
    align-items: center;
    gap: 5px;
    margin-left: 20px;
}

.userCompanyDetail-header {
    padding: 25px 33px 0;
}

.tabs-box {
    padding: 0 33px;
    margin-top: -40px;
}

.btn-group {
    margin: 10px 0;
}

.page-container {
    padding-bottom: 0px;
}

:deep(.el-form-item) {
    margin-bottom: 6px;
}
</style>