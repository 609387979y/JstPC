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
                <div>待处理商机</div>
                <div class="stat-number">{{ tableData?.length > 0 ? tableData[0].NotCount : 0 }} <span>票</span></div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div>已处理商机</div>
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

        <el-table :data="tableData" v-loading="loading" border height="500">
            <!-- <el-table-column v-if="activeTab == 0" width="125" label="操作">
                <template #default="scope">
                    <el-button type="text" class="clean" @click="enquiry(scope.row)">去获取询价人信息</el-button>
                </template>
            </el-table-column> -->
            <el-table-column v-if="activeTab == 1" min-width="110" show-overflow-tooltip sortable
                prop="InquiryCompanyName" label="询价公司"></el-table-column>
            <el-table-column v-if="activeTab == 1" min-width="110" show-overflow-tooltip sortable
                prop="InquiryUserRealName" label="询价人">
                <template #default="{ row }">{{ formatNameAndPhone(row.InquiryUserRealName, row.InquiryUserMobilePhone)
                    }}</template>
            </el-table-column>
            <el-table-column min-width="110" show-overflow-tooltip sortable prop="InquiryType" label="商机类型">
                <template #default="{ row }">
                    <div>{{ row.InquiryType == 1 ? '询价商机' : row.InquiryType == 2 ? '询舱商机' : '' }}</div>
                </template>
            </el-table-column>
            <el-table-column min-width="110" show-overflow-tooltip sortable prop="InquiryCreateTime"
                label="询价时间"></el-table-column>
            <el-table-column min-width="110" show-overflow-tooltip sortable prop="InquiryRateProviderCompanyName"
                label="服务商"></el-table-column>
            <el-table-column min-width="110" show-overflow-tooltip sortable prop="PolEnPortName" label="起运港">
                <template #default="{ row }">
                    <div>{{ row.PolEnPortName }}</div>
                </template>
            </el-table-column>
            <el-table-column min-width="110" show-overflow-tooltip sortable prop="DestEnPortName" label="目的港">
                <template #default="{ row }">
                    <div class="mdg-block">
                        <div class="mdg-text-hidden">{{ row.DestEnPortName }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column min-width="110" show-overflow-tooltip sortable prop="PodEnPortName" label="中转">
                <template #default="{ row }">
                    <span v-if="row.LineType == 0">直达</span>
                    <span v-if="row.LineType == 1">{{ row.PodEnPortName }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="110" show-overflow-tooltip sortable prop="ShippingCode" label="船公司">
                <template #default="scope">
                    {{ scope.row.ShippingCode }}
                </template>
            </el-table-column>
            <el-table-column min-width="130" show-overflow-tooltip sortable prop="LineName"
                label="所属航线"></el-table-column>

            <el-table-column min-width="110" show-overflow-tooltip sortable prop="LineDay" label="航程">
                <template #default="{ row }">
                    {{ row.LineDay ? row.LineDay + "天" : "-" }}
                </template>
            </el-table-column>
            <el-table-column min-width="110" show-overflow-tooltip sortable prop="CSTDate" label="截/开">
                <template #default="{ row }"> {{ row.CSTDate }}/{{ row.ETDDate }} </template>
            </el-table-column>
            <el-table-column label="ALL-IN报价" align="center">
                <el-table-column prop="AllOutPrice20GP" sortable label="20GP" min-width="90">
                    <template #default="{ row }"> <span class="price-content">{{ row.AllOutPrice20GP ?
                        row.AllOutPrice20GP : "- -" }} </span></template>
                </el-table-column>
                <el-table-column prop="AllOutPrice40GP" sortable label="40GP" min-width="90">
                    <template #default="{ row }"><span class="price-content"> {{ row.AllOutPrice40GP ?
                        row.AllOutPrice40GP : "- -" }}</span> </template>
                </el-table-column>
                <el-table-column prop="AllOutPrice40GP" sortable label="40HQ" min-width="90">
                    <template #default="{ row }"><span class="price-content"> {{ row.AllOutPrice40HQ ?
                        row.AllOutPrice40HQ : "- -" }} </span></template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="申请幅度" align="center">
                <el-table-column prop="20GP" sortable label="20GP" width="90">
                    <template #default="{ row }">
                        <div class="discounts" v-if="row.Tag20GP">
                            <img src="@/assets/customWorkbench/green-arrow-down.svg" alt="" />
                            {{ row.Tag20GP }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="40GP" sortable label="40GP" width="90">
                    <template #default="{ row }">
                        <div class="discounts" v-if="row.Tag40GP">
                            <img src="@/assets/customWorkbench/green-arrow-down.svg" alt="" />
                            {{ row.Tag40GP }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="40HQ" sortable label="40HQ" width="90">
                    <template #default="{ row }">
                        <div class="discounts" v-if="row.Tag40HQ">
                            <img src="@/assets/customWorkbench/green-arrow-down.svg" alt="" />
                            {{ row.Tag40HQ }}
                        </div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column v-if="activeTab == 1" min-width="110" show-overflow-tooltip sortable prop="Integral"
                label="扣除Q点"></el-table-column>
            <el-table-column v-if="activeTab == 1" min-width="110" show-overflow-tooltip sortable
                prop="OperatingEmployeeName" label="操作人"></el-table-column>
            <el-table-column v-if="activeTab == 1" min-width="110" show-overflow-tooltip sortable prop="OperatingTime"
                label="处理时间"></el-table-column>
        </el-table>
        <SuccessDialog ref="successDialogRef" @refresh="getList"></SuccessDialog>
    </el-card>
</template>

<script>
import { defineComponent } from 'vue';
import { useTableOption, utils } from "justom-share"
import { ElMessage, ElMessageBox } from "element-plus";
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
            console.log(tabName);

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