<template>
    <div v-show="true">
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
        <div class="page-container" v-show="state.activeName == 1">
            <JstCardLayout border class="MyTabsCard">
                <template #title>企业权益</template>
                <MyTabs class="expenseLog-class" ref="MyTabsRef" :companyId="state.info.Id"></MyTabs>
            </JstCardLayout>
            <JstCardLayout>
                <template #title>消费记录</template>
                <expenseLog v-show="state.activeName2 == 0" ref="expenseLogRef">
                </expenseLog>
            </JstCardLayout>
        </div>
    </div>
    <div class="no-permission-card" v-show="false">
        <div class="permission-content">
            <h2 class="permission-title">抱歉,你无权访问该页面</h2>
            <p class="permission-desc">若想要查看该页面，可通过开通企业权益进行操作。</p>
        </div>
    </div>
    <!-- <EmployeeEdit @submit="getList" :companyId="state.info.Id" ref="editEmpRef" hideAdmin></EmployeeEdit> -->
</template>
<script setup>
import { defineComponent, ref, reactive, computed, onMounted, toRaw, nextTick, } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import { useTableOption } from "justom-share";
import request from "@/public/request";
import { ElMessage, ElMessageBox } from "element-plus";
import expenseLog from "./expenseLog.vue";
import rechargeLog from "./rechargeLog.vue";
import { useWallet } from "@/composables/pay/useWallet"
import MyTabs from "./components/MyTabs.vue";



const store = useStore();
const wallet = useWallet()

const route = useRoute();
const router = useRouter();
const state = reactive({
    id: 0,
    info: {},
    activeName: 1,
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
})
const editEmpRef = ref()
const customerInfoDialogRef = ref()
const expenseLogRef = ref()
const rechargeLogRef = ref()
const MyTabsRef = ref()
const toEditCompanyInfo = () => {
    customerInfoDialogRef.value.open(state.info.Id)
}
// 公司基本信息
const getCompanyInfo = async () => {
    const res = await request.get("/api/Company/GetCompanyInfo", {
        companyId: employee.value.CompanyId,
    });
    state.info = res.Data;
    MyTabsRef.value.getWalletDictionary(employee.value.CompanyId)
}
// 获取金额
const getWalletDictionary = async () => {
    const res = await request.get("/api/CargoRate/SelectCustomerDispositionPriceDetails", {
        companyId: employee.value.CompanyId,
    });
    if (res.Status == false) {
        return;
    }
    if (res.Status) {
        if (res.Data && res.Data.length && res.Data[0].Details && res.Data[0].Details.length) {
            res.Data[0].Details.forEach(t => {
                const type = t.Type;
                switch (type) {
                    case 1:
                        state.wallet[0] = t.Integral;
                        break;
                    case 2:
                        state.wallet[1] = t.Integral;
                        break;
                    case 3:
                        state.wallet[2] = t.Integral;
                        break;
                    default:
                        break;
                }
            })
        }
    }
}
// 公司成员列表
const getList = async () => {
    state.tableOption.loading = true;
    let res = await request.get("/api/Employee/GetEmployeeInCompany", {
        page: state.tableOption.page,
        limit: state.tableOption.pageSize,
        OnlyBind: true,
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
onMounted(() => {
    getCompanyInfo()
    getWalletDictionary()
    getList()
    active1Change()
})
</script>
<style lang="scss" scoped>
.header-title {
    display: flex;
    align-items: center;
    font-weight: 600;

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

.no-permission-card {
    background: #ffffff;
    border-radius: 4px;
    padding: 6px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    .permission-content {
        text-align: center;
    }

    .permission-title {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin-bottom: 16px;
        margin-top: 0;
    }

    .permission-desc {
        font-size: 16px;
        color: #666;
        margin-bottom: 32px;
        line-height: 1.5;
    }

    .open-membership-btn {
        background: linear-gradient(90deg, #fd953e 0%, #ff6b9d 100%);
        border: none;
        padding: 12px 32px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 6px;
        color: #fff;
        width: 100%;

        &:hover {
            background: linear-gradient(90deg, #e88535 0%, #e55a8a 100%);
        }
    }
}

.detail-header-container {
    padding: 25px 0 0 !important;
}

:deep(.el-card) {
    border: none;
}

:deep(.el-card__header) {
    padding-left: 0;

    .card-title {
        font-weight: normal !important;
        font-size: 14px !important;
    }
}


:deep(.MyTabsCard) {
    .el-card__body {
        margin-top: 12px;
        border: 1px solid #ebeef5;
    }
}

:deep(.header_bottom) {

    .el-card__header {
        padding-left: 0px !important;
        border-bottom: 1px solid var(--el-card-border-color);
    }

    .el-card__body {
        padding-left: 0px !important;
    }
}



// #ebeef5
</style>