<template>
    <el-card class="opportunity-card">
        <template #header>
            <div class="card-header">
                <span>商机概况</span>
            </div>
        </template>
        <div class="opportunity-stats">
            <div class="stat-item">
                <div>全部商机</div>
                <div class="stat-number">{{ tableData?.length > 0 ? tableData[0].AllCount : 0 }} <span>票</span></div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div>待受理商机</div>
                <div class="stat-number">{{ tableData?.length > 0 ? tableData[0].NotCount : 0 }} <span>票</span></div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div>已受理商机</div>
                <div class="stat-number">{{ tableData?.length > 0 ? tableData[0].InCount : 0 }} <span>票</span></div>
            </div>
        </div>
        <div class="opportunity-tabs-container">
            <el-tabs v-model="activeTab" @tab-click="handleTabChange" type="card" class="opportunity-tabs">
                <el-tab-pane label="待处理" :name="0"></el-tab-pane>
                <el-tab-pane label="已处理" :name="1"></el-tab-pane>
            </el-tabs>
            <!-- <div class="view-all-btn" @click="viewAllOpportunities">查看全部</div> -->
        </div>

        <AppVxeTable :tableHeightMin="'calc(100% - 300px)'" :rowId="'Id'" ref="businessRef"
            :tableHeaderKey="'businessTable'" :toolbarConfig="true" class="vex-table-primary freight-table"
            :tableData="tableData" :tableOption="tableOption" @getTableList="getList()" :tableHeight="'1000'"
            :columnList="columnList">

            <template #OperatingStatus="{ row }">
                <div :class="row.OperatingStatus ? 'sure-class' : ''">
                    <span class="dot"></span>{{ !row.OperatingStatus ? '未受理' : '已受理' }}
                </div>
            </template>


            <template #Type="{ row }">
                <div>
                    {{ row.Type == 1 ? '询价' : '询盘' }}
                </div>
            </template>

            <template #User="{ row }">
                <div v-if="row.OperatingStatus">
                    {{ row.UserRealName }}<span v-if="row.UserMobilePhone">（{{ row.UserMobilePhone }}）</span>
                </div>
                <div v-else>******</div>
            </template>

            <template #box="{ row }">
                <div>
                    {{ row.Box + "*" + row.BoxAmount }}
                </div>
            </template>
        </AppVxeTable>
        <SuccessDialog ref="successDialogRef" @refresh="getList"></SuccessDialog>
    </el-card>
</template>

<script>
import { defineComponent } from 'vue';
import { useTableOption, utils } from "justom-share"
import { ElMessage, ElMessageBox } from "element-plus";
import AppVxeTable from "@/components/AppVxeTable.vue";
import SuccessDialog from "./SuccessDialog.vue"

export default defineComponent({
    name: 'OpportunityOverview',
    props: {
        search: {
            type: Object,
            default: () => {
            }
        }
    },
    components: {
        AppVxeTable
    },
    data() {
        return {
            activeTab: 0,
            opportunityCounts: {
                all: 12,
                pending: 12,
                processed: 12,
            },
            tableData: [],
            option: useTableOption(),
            loading: false,
            tableOption: {
                page: 1,
                pageSize: 10,
                total: 0,
                loading: false,
            },
            columnList: [
                {
                    title: '商机状态',
                    field: 'OperatingStatus',
                    type: 'slot',
                    slotName: 'OperatingStatus',
                    width: 120
                },
                {
                    title: '商机类型',
                    field: 'Type',
                    type: 'slot',
                    slotName: 'Type',
                    width: 120
                },
                {
                    title: '询价人',
                    field: 'User',
                    type: 'slot',
                    slotName: 'User',
                    width: 200
                },
                {
                    title: '起运港',
                    field: 'PolEnPortName',
                    width: 120
                },
                {
                    title: '目的港',
                    field: 'DestEnPortName',
                    width: 120
                },
                {
                    title: '开始有效期',
                    field: 'StartTime',
                    width: 140
                },
                {
                    title: '结束有效期',
                    field: 'EndTime',
                    width: 140
                },
                {
                    title: '备注',
                    field: 'SpecialRemark',
                    width: 200
                }
            ]
        };
    },
    computed: {

    },
    methods: {
        async getOpportunityCounts() {
            // 同时发起三个请求
            const [resPending, resProcessed, resAll] = await Promise.all([
                this.$http.get("/api/CargoRate/ProviderInquiry", {
                    page: 1,
                    limit: 1,
                    LineType: -1,
                    OperatingStatus: false, // 询价中
                }),
                this.$http.get("/api/CargoRate/ProviderInquiry", {
                    page: 1,
                    limit: 1,
                    LineType: -1,
                    OperatingStatus: true, // 已完成
                }),
                this.$http.get("/api/CargoRate/ProviderInquiry", {
                    page: 1,
                    limit: 1,
                    LineType: -1, // 所有
                })
            ]);
            this.opportunityCounts.pending = resPending.Total;
            this.opportunityCounts.processed = resProcessed.Total;
            this.opportunityCounts.all = resAll.Total;
        },
        async getList() {
            this.loading = true;
            let res = await this.$http.post("/api/CargoRate/SelectCompanyBusinessDocuments", {
                OperatingStatus: this.activeTab == 1,
                CompanyId: this.$store.state.auth.employee.CompanyId
            })
            this.tableData = res.Rows;
            this.loading = false;
        },
        handleTabChange(tabName) {
            this.getList()
        },
        viewAllOpportunities() {
            this.$router.push('/internal/businessList');
        },

        getInquiryInfo(row) {
            // 在实际应用中，您会处理获取询价人信息的逻辑，例如打开弹窗或跳转到详情页
            this.$message.info(`获取 ${row.type} 的询价人信息`);
        },
        enquiry(row) {
            console.log(row);
            this.$messageBox.confirm(
                `<div style="color:#000;">解锁需Q点：<span style="color:#fd953e;">${row.Integral || 0}</span>，确认解锁后，即可获取商机</div>`,
                '是否解锁获取商机',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    showClose: false,
                    dangerouslyUseHTMLString: true,
                    customClass: 'enquiry-el-message-box',
                }
            )
                .then(async () => {
                    const Time = this.getCurrentFormattedTime()
                    let res = await request.get("/api/CargoRate/DeductIntegral", {
                        Id: row.InquiryId,
                        EmployeeId: employee.value.Id,
                        Time,
                    })
                    if (res.Status) {
                        const info = JSON.parse(JSON.stringify(row))
                        info.OperatingEmployeeName = employee.value.RealName + (employee.value.MobilePhone ? `(${employee.value.MobilePhone})` : '');
                        info.OperatingTime = Time
                        this.$refs.successDialogRef.openDialog(true, info)
                        this.$message.success(res.Message)
                    } else {
                        this.$message.error(res.Message)
                    }
                })
                .catch(() => {

                })
        },
        getCurrentFormattedTime() {
            const now = new Date();
            const year = now.getFullYear();
            let month = now.getMonth() + 1;
            let date = now.getDate();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
            month = month.toString().padStart(2, '0');
            date = date.toString().padStart(2, '0');
            hours = hours.toString().padStart(2, '0');
            minutes = minutes.toString().padStart(2, '0');
            seconds = seconds.toString().padStart(2, '0');
            return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
        },
        formatNameAndPhone(name, phone) {
            if (name && phone) {
                return `${name}(${phone})`;
            } else if (name || phone) {
                return name || phone;
            } else {
                return '- -';
            }
        }
    },
    mounted() {
        this.getOpportunityCounts()
    }
});
</script>

<style lang="scss" scoped>
.opportunity-card {
    margin-top: 8px;
    box-shadow: none;
    border: none;
    border-radius: 0;

    :deep(.el-card__header) {
        border: none;
        padding: 8px 20px 20px;
    }

    :deep(.el-card__body) {
        padding: 0px 20px 20px;
    }

    .card-header {
        font-size: 16px;
        // font-weight: bold;
        color: #303133;
        border: none;
    }

    .opportunity-stats {
        display: flex;
        justify-content: space-around;
        padding: 15px 0;
        margin-bottom: 20px;
        background-color: #f7f8fa;

        .stat-item {
            text-align: center;
            flex: 1;

            div:first-child {
                font-size: 14px;
                color: #909399;
                margin-bottom: 5px;
            }

            .stat-number {
                font-size: 24px;
                font-weight: bold;
                color: #303133;

                span {
                    font-size: 14px;
                    font-weight: normal;
                    color: #909399;
                }
            }
        }

        .stat-divider {
            width: 1px;
            background-color: #EBEEF5;
            margin: 0 10px;
        }
    }

    .opportunity-tabs {
        position: relative;

        .el-tabs__header {
            margin-bottom: 0;
        }

        .el-tabs__nav-wrap::after {
            height: 0; // 移除下划线
        }

        .view-all-btn {
            position: absolute;
            right: 0;
            top: 0;
            color: #409EFF;
            cursor: pointer;
            font-size: 14px;
        }
    }

    .opportunity-table {
        margin-top: 20px;
    }
}

.opportunity-tabs-container {
    position: relative;

    .view-all-btn {
        position: absolute;
        right: 0;
        top: 10px;
        color: #fd953e;
        cursor: pointer;
        font-size: 14px;
    }
}

:deep(.el-table__empty-block) {
    width: 100% !important;
    position: sticky;
    left: 0;
}
</style>

<style lang="scss">
// 覆盖Element UI的默认样式
.opportunity-tabs {
    .el-tabs__nav-wrap {
        position: relative; // 确保子元素可以定位
    }

    .el-tabs__active-bar {
        display: none; // 隐藏默认的激活条
    }

    .el-tabs__item.is-active {
        font-weight: bold;
        color: #409EFF; // 激活状态颜色
    }

    .el-tabs__item {
        padding: 0 10px; // 调整tab的内边距
    }
}
</style>