<template>
    <div class="business-settings-container">
        <!-- 默认推送部分 -->
        <div class="default-push-section">
            <h3 class="section-title">默认推送</h3>
            <div class="colleague-list">
                <div class="colleague-scroll">
                    <div v-for="item in defaultPushList" :key="item.UserId" class="colleague-item">
                        <div class="avatar" @mouseenter="showRemoveOverlay(item)" @mouseleave="hideRemoveOverlay(item)">
                            <el-avatar :size="60" :src="item.Avatar">
                                <img src="@/assets/default-avatar.svg" />
                            </el-avatar>
                            <div v-if="item.showRemove" class="remove-overlay" @click.stop="removeColleague(item)">
                                <div class="remove-overlay-content">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                    <span>移除同事</span>
                                </div>
                            </div>
                        </div>
                        <div class="name">{{ item.UserName || '默认员工' }}</div>
                    </div>
                    <div class="add-colleague" @click="addColleague">
                        <div class="add-circle">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </div>
                        <div class="add-text">添加同事</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 推送设置部分 -->
        <div class="push-settings-section">
            <h3 class="section-title">推送设置</h3>
            <searchComp @searchFun="searchFun" :form="searchForm" @clearFun="clearFun" :searchList="searchList"
                style="margin-bottom: 12px;"></searchComp>

            <AppVxeTable style="margin-top: 10px;" @change="getList" :tableData="tableData" :tableOption="tableOption"
                :height="tableHeight" :singleHighLight="true">
                <vxe-column width="100" label="操作">
                    <template #default="scope">
                        <el-button type="text" class="operation-btn" @click="setPushPersonnel(scope.row)">
                            设置客服人员
                        </el-button>
                    </template>
                </vxe-column>
                <vxe-column min-width="150" show-overflow-tooltip sortable field="InquiryCompany" title="询价公司">
                    <template #default="{ row }">
                        <div>{{ row.InquiryCompanyName || '--' }}</div>
                    </template>
                </vxe-column>
                <vxe-column min-width="120" show-overflow-tooltip sortable field="PushPersonnel" title="客服人员">
                    <template #default="{ row }">
                        <div>{{ row.Employee[0] ? row.Employee[0].RealName : '' }}</div>
                    </template>
                </vxe-column>
                <vxe-column min-width="130" show-overflow-tooltip sortable field="MobilePhone" title="手机号">
                    <template #default="{ row }">
                        <div>{{ row.Employee[0] ? row.Employee[0].MobilePhone : '' }}</div>
                    </template>
                </vxe-column>
                <vxe-column min-width="180" show-overflow-tooltip sortable field="ContactEmail" title="联系邮箱">
                    <template #default="{ row }">
                        <div>{{ row.Employee[0] ? row.Employee[0].Email : '' }}</div>
                    </template>
                </vxe-column>
                <vxe-column min-width="200" show-overflow-tooltip sortable field="DepartmentName" title="部门名称">
                    <template #default="{ row }">
                        <div>{{ row.Employee[0] ? row.Employee[0].OrgName : '' }}</div>
                    </template>
                </vxe-column>
            </AppVxeTable>
        </div>
    </div>

    <!-- 设置推送人员弹窗 -->
    <el-dialog v-model="pushPersonnelDialog.visible" title="设置推送人员" width="500px" :close-on-click-modal="false"
        custom-class="pushPersonnelDialog">
        <el-form :model="pushPersonnelDialog.form" label-width="80px">
            <el-form-item label="推送人员">
                <el-select v-model="pushPersonnelDialog.form.employeeId" filterable remote
                    :remote-method="searchEmployees" @focus="searchEmployees('')" :loading="pushPersonnelDialog.loading"
                    placeholder="选择公司员工" style="width: 100%" clearable>
                    <el-option v-for="item in pushPersonnelDialog.employeeList" :key="item.Id" :label="item.RealName"
                        :value="item.Id">
                        <span>{{ item.RealName }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="pushPersonnelDialog.visible = false">取消</el-button>
                <el-button type="primary" @click="confirmSetPushPersonnel">确认</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- 添加同事弹窗 -->
    <el-dialog v-model="addColleagueDialog.visible" title="添加同事" width="500px" custom-class="pushPersonnelDialog"
        :close-on-click-modal="false">
        <el-form :model="addColleagueDialog.form" label-width="80px">
            <el-form-item label="选择同事">
                <el-select v-model="addColleagueDialog.form.employeeId" filterable remote
                    :remote-method="searchAvailableEmployees" @focus="searchAvailableEmployees('')"
                    :loading="addColleagueDialog.loading" placeholder="选择公司员工" style="width: 100%" clearable>
                    <el-option v-for="item in addColleagueDialog.employeeList" :key="item.Id" :label="item.RealName"
                        :value="item.Id">
                        <span>{{ item.RealName }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addColleagueDialog.visible = false">取消</el-button>
                <el-button type="primary" @click="confirmAddColleague">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Close, Plus, Delete } from '@element-plus/icons'
import AppSearchFormMini from '@/components/AppSearchFormMini.vue'
import AppPageTable from '@/components/AppPageTable/AppPageTable.vue'
import { useTableOption } from 'justom-share'
import request from '@/public/request'
import AppVxeTable from "@/components/AppVxeTable.vue";
import { useStore } from "vuex";
import searchComp from '@/components/searchComp.vue';

const searchFun = (form) => {

    searchForm.InquiryCompany = form.InquiryCompany
    searchForm.EmployeeName = form.EmployeeName
    getList()
}

const clearFun = () => {
    searchForm.InquiryCompany = ''
    searchForm.EmployeeName = ''
    getList()
}

const searchList = computed(() => {
    return [
        {
            type: 'input',
            label: '询价公司',
            prop: 'InquiryCompany',
            placeholder: '询价公司'
        },
        {
            type: 'input',
            label: '推送人员',
            prop: 'EmployeeName',
            placeholder: '推送人员'
        }

    ]
})

// 默认推送列表 - 使用Personal.vue中的workMate逻辑
const defaultPushList = ref([])
const store = useStore();
const employee = computed(() => {
    if (store.state.auth.employee) {
        return store.state.auth.employee;
    } else {
        return {};
    }
});
// 获取同事列表
const getColleagueList = async () => {
    try {
        const res = await request.get("/api/CargoRate/SelectrRecordConfig", {
            CompanyId: employee.value.CompanyId,
        })
        const processedData = (res.Data || []).map(row => {
            const processedRow = { ...row }

            // 如果有员工信息，提取到顶层
            if (row.Employee && row.Employee.length > 0) {
                const employee = row.Employee[0]
                processedRow.UserName = employee.RealName || '--'
                processedRow.Avatar = employee.Avatar || ''
                processedRow.EmployeeId = employee.Id || 0
            } else {
                processedRow.UserName = '--'
                processedRow.Avatar = ''
                processedRow.EmployeeId = 0
            }

            return processedRow
        })
        defaultPushList.value = processedData
    } catch (error) {
        console.error('获取同事列表失败:', error)
    }
}

// 搜索表单
const searchForm = reactive({
    InquiryCompany: '',
    EmployeeName: ''
})

// 表格数据
const tableData = ref([])

// 表格配置
const tableOption = reactive({
    page: 1,
    pageSize: -1,
    total: 0,
    loading: false,
})
const tableHeight = computed(() => document.body.clientHeight - 400)

// 设置推送人员弹窗
const pushPersonnelDialog = reactive({
    visible: false,
    loading: false,
    form: {
        employeeId: null
    },
    employeeList: [],
    currentRow: null
})

// 添加同事弹窗
const addColleagueDialog = reactive({
    visible: false,
    loading: false,
    form: {
        employeeId: null
    },
    employeeList: []
})

// 获取列表数据
const getList = async () => {
    tableOption.loading = true
    try {
        const res = await request.get('/api/CargoRate/SelectRecordConfigPageRequest', {
            page: tableOption.page,
            limit: tableOption.pageSize,
            ...searchForm,
            CompanyId: employee.value.CompanyId,
        })

        tableData.value = res.Rows

        tableOption.total = res.Total || 0

        console.log(tableData.value)
    } catch (error) {
    } finally {
        tableOption.loading = false
    }
}

// 重置搜索
const resetSearch = () => {
    searchForm.InquiryCompany = ''
    searchForm.EmployeeName = ''
    getList()
}

// 清空内容
const clearContent = () => {
    searchForm.InquiryCompany = ''
    searchForm.EmployeeName = ''
}

// 显示移除覆盖层
const showRemoveOverlay = (item) => {
    item.showRemove = true
}

// 隐藏移除覆盖层
const hideRemoveOverlay = (item) => {
    item.showRemove = false
}

// 移除同事
const removeColleague = async (item) => {
    try {
        await ElMessageBox.confirm(`确认移除同事 ${item.UserName}？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })

        // 调用删除接口，假设使用相同的接口但Type为true表示删除
        const res = await request.get("/api/CargoRate/DeleteRecordConfig", {
            Id: item.Id
        })

        if (res.Status) {
            ElMessage.success('移除成功')
        } else {
            ElMessage.error(res.Message || '移除失败')
        }

        // 无论成功失败都重新查询列表
        await getColleagueList()
    } catch (error) {
        await getColleagueList()
    }
}

// 添加同事
const addColleague = () => {
    addColleagueDialog.form.employeeId = null
    addColleagueDialog.employeeList = []
    addColleagueDialog.visible = true
}

// 搜索可用的员工（过滤掉已在默认推送列表中的员工）
const searchAvailableEmployees = async (query) => {
    let RealName = query ? query : ''
    addColleagueDialog.loading = true
    try {
        const res = await request.get("/api/Employee/GetEmployeeInCompany", {
            page: -1,
            limit: -1, // 获取更多数据以便过滤
            OnlyBind: true,
            RealName,
        })

        // 处理返回的数据
        const processedData = res.Rows.map(row => {
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
            return row
        })

        // 过滤掉已在默认推送列表中的员工
        const availableEmployees = processedData.filter(employee => {
            return !defaultPushList.value.some(defaultEmployee =>
                defaultEmployee.EmployeeId === employee.Id
            )
        })

        addColleagueDialog.employeeList = availableEmployees
    } catch (error) {
        ElMessage.error('搜索员工失败')
    } finally {
        addColleagueDialog.loading = false
    }
}

// 确认添加同事
const confirmAddColleague = async () => {
    if (!addColleagueDialog.form.employeeId) {
        ElMessage.warning('请选择同事')
        return
    }

    try {
        const res = await request.post("/api/CargoRate/RecordConfig", {
            Type: false,
            CompanyId: employee.value.CompanyId,
            EmployeeId: addColleagueDialog.form.employeeId
        })

        if (res.Status) {
            ElMessage.success('添加成功')
        } else {
            ElMessage.error(res.Message || '添加失败')
        }

        // 无论成功失败都重新查询列表
        await getColleagueList()
        addColleagueDialog.visible = false
    } catch (error) {
        ElMessage.error('添加失败')
        // 即使出错也重新查询列表
        await getColleagueList()
        addColleagueDialog.visible = false
    }
}

// 设置推送人员
const setPushPersonnel = (row) => {
    pushPersonnelDialog.currentRow = row
    pushPersonnelDialog.form.employeeId = null
    pushPersonnelDialog.employeeList = []
    pushPersonnelDialog.visible = true
}

// 搜索员工
const searchEmployees = async (query) => {
    let RealName = query ? query : ''
    pushPersonnelDialog.loading = true
    try {
        const res = await request.get("/api/Employee/GetEmployeeInCompany", {
            page: -1,
            limit: -1,
            OnlyBind: true,
            RealName,
        })

        // 处理返回的数据
        const processedData = res.Rows.map(row => {
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
            return row
        })

        pushPersonnelDialog.employeeList = processedData
    } catch (error) {
        ElMessage.error('搜索员工失败')
    } finally {
        pushPersonnelDialog.loading = false
    }

}

// 确认设置推送人员
const confirmSetPushPersonnel = async () => {
    if (!pushPersonnelDialog.form.employeeId) {
        ElMessage.warning('请选择推送人员')
        return
    }

    try {
        const res = await request.post("/api/CargoRate/RecordConfig", {
            Type: true,
            CompanyId: employee.value.CompanyId,
            EmployeeId: pushPersonnelDialog.form.employeeId,
            InquiryCompanyId: pushPersonnelDialog.currentRow.InquiryCompanyId,
            Id: pushPersonnelDialog.currentRow.Id,
        })

        if (res.Status) {
            ElMessage.success('设置成功')
        } else {
            ElMessage.error(res.Message || '设置失败')
        }

        // 无论成功失败都重新查询列表
        await getList()
        pushPersonnelDialog.visible = false
    } catch (error) {
        ElMessage.error('设置失败')
        // 即使出错也重新查询列表
        await getList()
        pushPersonnelDialog.visible = false
    }
}
defineExpose({
    getList
})
onMounted(() => {
    getList()
    getColleagueList()
})
</script>

<style lang="scss" scoped>
.business-settings-container {
    padding: 8px;
    background-color: #fff;
}

.section-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
    margin-top: 0;
}

.default-push-section {
    margin-bottom: 15px;
}

.colleague-list {
    border: 1px solid #e4e7ed;

    .colleague-scroll {
        display: flex;
        overflow-x: auto;
        gap: 16px;
        padding: 10px 0;

        &::-webkit-scrollbar {
            height: 6px;
        }

        &::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    }
}

.colleague-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
    position: relative;

    .avatar {
        margin-bottom: 8px;
        position: relative;
        cursor: pointer;
        overflow: hidden;

        .remove-overlay {
            width: 60px;
            height: 60px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            transition: all 0.3s ease;

            &:hover {
                background: rgba(0, 0, 0, 0.5);
            }

            .remove-overlay-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 5px;

                span {
                    font-size: 12px;
                    zoom: 0.8;
                }
            }

        }
    }

    .name {
        font-size: 12px;
        color: #606266;
        text-align: center;
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.add-colleague {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
    cursor: pointer;

    .add-circle {
        width: 60px;
        height: 60px;
        border: 2px dashed #d4d4d4;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
        color: #909399;
        font-size: 20px;

        &:hover {
            border-color: #409eff;
            color: #409eff;
        }
    }

    .add-text {
        font-size: 12px;
        color: #909399;
        text-align: center;
    }
}

.push-settings-section {
    .operation-btn {
        color: #f56c6c;
        font-size: 12px;

        &:hover {
            color: #e64242;
        }
    }
}

:deep(.el-table) {

    .el-table__row:nth-child(4),
    .el-table__row:nth-child(5),
    .el-table__row:nth-child(6) {
        background-color: #f0f9ff;
    }

    .el-table__header-wrapper {
        .el-table__header {
            th {
                background-color: #fafafa;
                color: #606266;
                font-weight: 600;
            }
        }
    }

    .el-table__body-wrapper {
        .el-table__row {
            &:hover {
                background-color: #f5f7fa;
            }
        }
    }
}

:deep(.el-pagination) {
    margin-top: 16px;
    text-align: right;
}


:deep(.el-select) {
    .el-select__tags {
        max-width: calc(100% - 30px);
    }
}
</style>
<style lang="scss">
// 弹窗样式

.pushPersonnelDialog {
    .el-dialog__header {
        padding: 20px 20px 15px;

        .el-dialog__title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
        }
    }

    .el-dialog__body {
        padding: 20px;
    }

    .el-dialog__footer {
        padding: 15px 20px;

        .dialog-footer {
            display: flex;
            justify-content: center;
            gap: 10px;
        }
    }
}

:deep(.el-table__empty-block) {
    min-height: calc(100vh - 370px) !important;
}
</style>