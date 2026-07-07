<template>
    <div class="opportunity-success" :class="{ 'opportunity-success-list': isList }" v-loading="loading">
        <!-- 商机信息区域 -->
        <div class="opportunity-info">

            <div class="info-content">
                <div class="info-item">
                    <div class="info-label">充值信息</div>
                    <div style="background-color:#f7f8fa; padding: 10px 5px 5px;">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <div class="info-row">
                                    <span class="info-label-text">业务编号：</span>
                                    <span class="info-value">{{ info.OrderNumber }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">充值服务商：</span>
                                    <span class="info-value">{{ info.CompanyName }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">购买商品：</span>
                                    <span class="info-value">{{ info.ProductInfo }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">操作账户：</span>
                                    <span class="info-value"> {{ formatNameAndPhone(info.CreateEmployeeName,
                                        info.CreateUserMobilePhone) }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">充值时间：</span>
                                    <span class="info-value">{{ info.PayTime }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">充值Q点：</span>
                                    <span class="info-value">{{ info.Amount }}</span>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="info-row">
                                    <span class="info-label-text">备注：</span>
                                    <span class="info-value">{{ info.Remark }}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isList: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            info: {
                // 充值信息
                OrderNumber: "",//业务编号：
                CompanyName: "",//充值服务商：
                ProductInfo: "",//购买产品：
                CreateEmployeeName: "",//操作账户：
                CreateTime: "",//充值时间：
                Amount: "",//充值Q点：
                Remark: "",//备注：
            }
        }
    },
    methods: {
        getInfo(data) {
            this.info = data
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
    }
}
</script>

<style lang="scss" scoped>
.opportunity-success {
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    box-sizing: border-box;
}

.opportunity-success-list {
    padding: 5px;
    background: #f7f8fa;
}


.opportunity-info {


    .info-item {
        margin-bottom: 20px;
    }

    .info-label {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 5px;
    }

    .info-row {
        margin-bottom: 10px;
    }

    .info-label-text {
        display: inline-block;
        width: 84px;
        // font-weight: bold;
        color: #969799;
    }

    .info-value {
        color: #000;
    }
}

.price-table {
    padding: 5px 10px;
    box-sizing: border-box;
    border: 1px solid #cccccc;
    border-radius: 5px;
    background-color: #fff;
    text-align: center;

    .price-table-header {
        display: flex;
        flex-wrap: nowrap;
        padding: 5px 0;

        .price-table-header-text {
            color: #969799;
            flex: 1;
        }
    }

    .price-table-info {
        display: flex;
        flex-wrap: nowrap;
        background-color: #f7f8fa;
        padding: 5px 0;

        .price-table-info-text {
            color: #000;
            flex: 1;
        }
    }
}
</style>