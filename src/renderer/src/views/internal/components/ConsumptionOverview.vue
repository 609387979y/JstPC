<template>
    <el-card class="consumption-card">
        <template #header>
            <div class="card-header">
                <span>消费概况</span>
            </div>
        </template>
        <div class="consumption-stats">
            <div class="stat-item">
                <div>总累计充值Q点</div>
                <div class="stat-number">{{ $utils.formatEmptyString(wallet['总累计充值Q点：']) }} <span></span></div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div>现剩余Q点</div>
                <div class="stat-number"> {{ $utils.formatEmptyString(wallet['剩余Q点：']) }} <span></span></div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div>共消费Q点</div>
                <div class="stat-number"> {{ $utils.formatEmptyString(wallet['共消费Q点：']) }} <span></span></div>
            </div>
        </div>

        <div class="opportunity-tabs-container">
            <el-tabs v-model="activeTab" type="card" class="opportunity-tabs">
                <el-tab-pane label="消费记录" :name="0"></el-tab-pane>
            </el-tabs>
            <div class="view-all-btn" @click="viewAllRecords">查看全部</div>
        </div>

        <el-table :data="tableData" v-loading="loading" border height="500">
            <el-table-column show-overflow-tooltip sortable min-width="210" prop="TradeNumber"
                label="业务编号"></el-table-column>
            <el-table-column show-overflow-tooltip sortable min-width="110" prop="TradeType"
                label="产品类型"></el-table-column>
            <el-table-column show-overflow-tooltip sortable min-width="210" prop="CompanyName"
                label="服务商名称"></el-table-column>
            <el-table-column show-overflow-tooltip sortable min-width="110" prop="TradeAction"
                label="消费类型"></el-table-column>
            <el-table-column show-overflow-tooltip sortable min-width="110" prop="Amount"
                label="消费Q点"></el-table-column>
            <el-table-column show-overflow-tooltip sortable min-width="110" prop="Amount"
                label="应付Q点"></el-table-column>
            <!-- <el-table-column prop="AfterBalance" label="剩余数量"></el-table-column> -->
            <el-table-column show-overflow-tooltip sortable min-width="110" prop="EmployeeName" label="消费账号">
                <template #default="{ row }">
                    {{ formatNameAndPhone(row.EmployeeName, row.CreateUserMobilePhone) }}
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip sortable min-width="110" prop="CreateTime"
                label="消费时间"></el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import { defineComponent } from 'vue';
import { useTableOption, utils } from "justom-share"

export default defineComponent({
    name: 'ConsumptionOverview',
    props: {
        search: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            consumptionCounts: {
                totalRecharge: 0,
                remaining: 0,
                totalConsumption: 0,
            },
            tableData: [],
            loading: false,
            activeTab: 0,
            wallet: {},
        };
    },
    methods: {
        async getList() {
            this.loading = true;
            try {
                let res = await this.$http.get("/api/PayTradeRecord/GetCurrentCompanyRecordList", {
                    page: -1,
                    limit: -1,
                    StartTime: this.search.startDate,
                    EndTime: this.search.endDate,
                });
                for (let row of res.Rows) {
                    row.CreateTime = utils.formatDateTime(row.CreateTime);
                }
                this.tableData = res.Rows;
                // if (res.Data) {
                //     this.consumptionCounts.totalRecharge = res.Data.TotalRecharge || 0;
                //     this.consumptionCounts.remaining = res.Data.Remaining || 0;
                //     this.consumptionCounts.totalConsumption = res.Data.TotalConsumption || 0;
                // }
            } catch (error) {
                // this.$message.error("获取消费记录失败");
            } finally {
                this.loading = false;
            }
        },
        viewAllRecords() {
            this.$router.push('/workbench/myExpenseLog');
        },
        formatNameAndPhone(name, phone) {
            if (name && phone) {
                return `${name}(${phone})`;
            } else if (name || phone) {
                return name || phone;
            } else {
                return '- -';
            }
        },
        // 获取金额
        async getWalletDictionary() {
            const res = await this.$http.get("/api/PayWallet/GetWalletDictionary");
            if (res.Status) {
                this.wallet = res.Data
            } else {
                ElMessage.error(res.Message)
            }
        },
    },
    mounted() {
        this.getWalletDictionary()
    }
});
</script>

<style lang="scss" scoped>
:deep(.el-table thead.is-group th.el-table__cell) {
    background: #f5f7fa;
}

.consumption-card {
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
    }

    .consumption-stats {
        display: flex;
        justify-content: space-around;
        padding: 15px 0;
        // border-bottom: 1px solid #EBEEF5;
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

    .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
        color: #303133;

        .view-all-btn {
            color: #409EFF;
            cursor: pointer;
            font-weight: normal;
        }
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

:deep(.el-table__header th) {
    background-color: #f5f7fa;
}

:deep(.el-table__empty-block) {
    width: 100% !important;
    position: sticky;
    left: 0;
}
</style>
