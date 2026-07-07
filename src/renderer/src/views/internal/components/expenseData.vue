<template>
    <div class="opportunity-success" :class="{ 'opportunity-success-list': isList }" v-loading="loading">
        <!-- 商机信息区域 -->
        <div class="opportunity-info">

            <div class="info-content">
                <div class="info-item">
                    <div class="info-label">消费信息</div>
                    <div style="background-color:#f7f8fa; padding: 10px 5px 5px;">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <div class="info-row">
                                    <span class="info-label-text">业务编号：</span>
                                    <span class="info-value">{{ info.TradeNumber }}</span>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="info-row">
                                    <span class="info-label-text">消费服务商：</span>
                                    <span class="info-value">{{ info.CompanyName }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">操作账户：</span>
                                    <span class="info-value">{{ formatNameAndPhone(info.EmployeeName,
                                        info.CreateUserMobilePhone) }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">消费时间：</span>
                                    <span class="info-value">{{ info.CreateTime }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">消费Q点：</span>
                                    <span class="info-value">{{ info.Amount }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">剩余Q点：</span>
                                    <span class="info-value">{{ info.AfterBalance }}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <!-- 询价人信息 -->
                <div :class="{ 'info-item': !isList }">
                    <div class="info-label">询价人信息</div>
                    <div style="background-color:#f7f8fa; padding: 10px 5px 5px;">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">询价公司：</span>
                                    <span class="info-value">{{ info.InquiryCompanyName }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">询价人：</span>
                                    <span class="info-value">{{ formatNameAndPhone(info.InquiryUserRealName,
                                        info.InquiryUserMobilePhone)
                                        }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">询价时间：</span>
                                    <span class="info-value">{{ info.InquiryCreateTime }}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <!-- 询价商机信息 -->
                <div class="info-item">
                    <div class="info-label">询价商机信息</div>
                    <div style="background-color:#f7f8fa; padding:10px 5px;">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">询价公司：</span>
                                    <span class="info-value">{{ info.InquiryCompanyName }}</span>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">询价人：</span>
                                    <span class="info-value">{{ formatNameAndPhone(info.InquiryUserRealName,
                                        info.InquiryUserMobilePhone)
                                    }}</span>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="info-row">
                                    <span class="info-label-text">服务商：</span>
                                    <span class="info-value">{{ info.InquiryRateProviderCompanyName }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">起运港：</span>
                                    <span class="info-value">{{ info.PolEnPortName }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">目的港：</span>
                                    <span class="info-value">{{ info.DestEnPortName }}</span>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="info-row">
                                    <span class="info-label-text">中转：</span>
                                    <span class="info-value">{{
                                        info.LineType == 0 ? '直达' : info.LineType == 1 ? row.PodEnPortName : ''
                                    }}</span>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="info-row">
                                    <span class="info-label-text">船公司：</span>
                                    <span class="info-value">{{ info.ShippingCode }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">航线：</span>
                                    <span class="info-value">{{ info.LineName }}</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">截/开：</span>
                                    <span class="info-value">{{ info.CSTDate }}/{{ info.ETDDate }} </span>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <div class="info-row">
                                    <span class="info-label-text">价格：</span>
                                    <span class="info-value">{{ info.Integral }}</span>
                                </div>
                            </el-col>
                        </el-row>

                        <!-- 价格表格 -->
                        <div class="price-table">
                            <div class="price-table-header">
                                <div class="price-table-header-text">类型</div>
                                <div class="price-table-header-text">20GP</div>
                                <div class="price-table-header-text">40GP</div>
                                <div class="price-table-header-text">40HQ</div>
                            </div>
                            <div class="price-table-info">
                                <div class="price-table-info-text">ALL-IN价格</div>
                                <div class="price-table-info-text">{{ formatPrice(info.AllOutPrice20GP) }}</div>
                                <div class="price-table-info-text">{{ formatPrice(info.AllOutPrice40GP) }}</div>
                                <div class="price-table-info-text">{{ formatPrice(info.AllOutPrice40HQ) }}</div>
                            </div>
                        </div>
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
                // 消费信息
                TradeNumber: "",//业务编号：
                CreateTime: "",//创建时间：
                Amount: "",//消费数量：
                AfterBalance: "",//消费后余额：
                TradeType: "",//购买产品：
                TradeAction: "",//消费类型：
                Remark: "",//消费明细：
                CompanyName: "",//消费企业：
                EmployeeName: "",//创建人：

                // 询价人信息
                CompanyName: '',// 询价公司名称
                CompanyPeo: '',// 询价人
                CompanyTome: '',// 询价时间
                // 询价信息
                PolEnPortName: '',// 起运港
                DestEnPortName: '',// 目的港
                PodEnPortName: '',// 中转
                ShippingCode: '',// 船公司
                LineName: '',// 所属航线
                CSTDate: '',// 截/开
                ETDDate: '',// 截/开
                AllOutPrice20GP: '',// 20GP价格
                AllOutPrice40GP: '',// 40GP价格
                AllOutPrice40HQ: '',// 40HQ价格
                // 商机处理信息
                ServiceProviderName: '',// 处理服务商
                OpportunityType: '',// 商机类型
                OperatorName: '',// 操作人
                HandleTime: '',// 处理时间
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
        formatPrice(value) {
            if (value) {
                return `$${value}`;
            }
            return '';
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