<template>
    <el-dialog v-model="show" title="会员充值" width="1200px" top="5vh" @close="closeDialog" custom-class="renew-dialog">
        <template #title>
            <div style="font-size: 16px;font-weight: 500;">会员充值</div>
        </template>
        <div class="recharge-container" v-loading="loading">

            <div class="main">
                <el-row style="margin-bottom: 20px;overflow-x: auto;flex-wrap: nowrap;"
                    :style="{ 'margin-right': planList.length > 3 ? '0px' : '-7.5px' }" :gutter="15">
                    <el-col v-for="(item, idx) in planList" style="margin-bottom: 5px;" :key="idx" :span="8">
                        <FlashSaleButton :coin="item.coin" :amount="item.amount.toString()" :delAmount="item.delAmount"
                            :days="item.days" :active="activePlanId == item.id"
                            @click="chooseAmount(item.amount, item.plan)">
                        </FlashSaleButton>
                    </el-col>
                </el-row>
                <JstCardLayout>
                    <div class="flex-box">
                        <div v-loading="qrCodeLoading" style="margin-right: 20px">
                            <template v-if="paymentGuid">
                                <canvas id="qr-canvas" ref="qrCanvas" width="170" height="170"
                                    style="border: 1px solid #ddd; border-radius: 4px;"></canvas>
                                <div style="color: #969799; text-align: center; font-size: 12px">扫描二维码进行支付</div>
                            </template>
                            <template v-else-if="activeAmount == 0">
                                <div>
                                    <div style="position: relative;">
                                        <img width="170" height="170" src="@/assets/newImages/freeEWM.png" alt />
                                        <div class="free-btn" @click="freeOpen(selectedPlan.Id)">开通会员</div>
                                    </div>
                                    <div style="color: #969799; text-align: center; font-size: 12px">点击免费开通</div>
                                </div>
                            </template>
                            <template v-else>
                                <img width="170" height="170" src="@/assets/images/offline-pay.svg" alt />
                                <div style="color: #969799; text-align: center; font-size: 12px">请重新选择套餐</div>
                            </template>
                        </div>

                        <div style="flex: 1 0 auto">
                            <div style="margin-bottom: 20px">
                                <span class="detail-text">实付：</span>
                                <span class="real-price">{{ activeAmount }}</span>
                                <span style="color: #fa6400;margin-left: 5px">元</span>
                            </div>
                            <div class="flex-box" v-if="activeAmount > 0">
                                <div>支付方式：</div>微信 / 支付宝
                                <!-- <div class="flex-box-wrap active">
                                    <div class="pay-btn-box ">
                                        <img src="@/assets/images/icon-pay-zfb.svg" alt />
                                        <img src="@/assets/images/icon-pay-wechat.svg" alt />
                                    </div>
                                </div> -->
                            </div>
                        </div>
                    </div>
                </JstCardLayout>
                <JstCardLayout>
                    <div class="flex-box">
                        <div>
                            <div>充值账号：{{ currentUser.MobilePhone }}</div>
                            <div>到账账户：{{ currentUser.RealName }}</div>
                        </div>
                        <div></div>
                    </div>
                </JstCardLayout>
            </div>
            <JstCardLayout class="JstCardLayout-plan" style="width: 300px; flex-shrink: 0;">
                <div class="space-width">
                    <!-- 动态显示套餐详细信息 -->
                    <div v-if="selectedPlan">
                        <div class="plan">
                            <h3>{{ selectedPlan.Name }}</h3>
                            <p>{{ selectedPlan.Describe }}</p>
                            <div class="price-Box">
                                <div class="type">
                                    <img v-if="selectedPlan.Url" :src="getIconUrl(selectedPlan.Url)"
                                        alt="">&nbsp;<span>{{
                                            selectedPlan.Name }}</span>
                                </div>
                                <div class="price"><span>{{ selectedPlan.Money }}¥</span>/{{ selectedPlan.Days }}天
                                </div>
                            </div>
                            <div class="title">{{ selectedPlan.VipDescribe }}</div>
                            <ul>
                                <li v-for="(item, index) in selectedPlan.Details" :key="index">
                                    <img src="@/assets/newImages/renewVip/dui.png" alt="">&nbsp;{{
                                        getNameByType(item.Type) }}
                                    <span class="tip" v-if="getTipByType(item)">{{ getTipByType(item) }}</span>
                                    <div>{{ getDescribeByType(item.Type) }}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <p class="desc-text">若有问题请联系平台人员</p>
                <p class="desc-text">工作日：8:30-17:30</p>
            </JstCardLayout>
        </div>
    </el-dialog>
</template>
<script>
import { defineComponent } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import FlashSaleButton from "./components/FlashSaleButton.vue";
import qrcode from "qrcode";

export default defineComponent({
    setup() {
        return {}
    },
    components: { FlashSaleButton, },
    data() {
        return {
            show: false,
            loading: false,
            // 套餐列表
            plans: [],
            // 选中的套餐
            selectedPlan: null,
            // 激活的套餐Id
            activePlanId: null,
            // 激活的amount
            activeAmount: 0,
            // 0支付宝 1微信 2线下
            payWay: 0,
            // 支付GUID
            paymentGuid: "",
            // 支付URL
            paymentUrl: "",
            /**
             * 二维码加载状态
             */
            qrCodeLoading: false,
            // 订单id用来确认是否完成
            orderId: 0,

            // 检查是否支付完成的interval
            checkInterval: null,
            // 是否支付完成
            isPayFinish: false,
            // 是否已显示支付成功弹窗
            hasShownSuccessDialog: false
        }
    },
    computed: {
        // 转换套餐数据为FlashSaleButton需要的格式
        planList() {
            return this.plans.map(plan => ({
                coin: plan.Name,
                amount: plan.Money,
                delAmount: "",
                days: plan.Days,
                plan: plan,
                id: plan.Id
            }));
        },
        currentUser() {
            let user = this.$store.state.auth.user;
            if (user == null) {
                return {}
            }
            return user;
        },
        currentEmployee() {
            let emp = this.$store.state.auth.employee;
            if (emp == null) {
                return {}
            }
            return emp;
        }
    },
    methods: {
        openPlanOptionDialog(type) {
            this.show = true
            this.getplans(type)
            this.checkInterval = setInterval(async () => {
                await this.checkPayStatus();
            }, 3000);
        },
        async getplans(type) {
            this.loading = true
            try {
                let res = await this.$http.get("/api/CargoRate/SelectMemberDispositionListInfo")
                if (res.Data && res.Data.length) {
                    this.plans = res.Data;

                    // 根据传入的type选择对应套餐，没有则默认选择第一个
                    let selectedPlan = null;
                    if (type) {
                        // 根据Id查找对应套餐
                        selectedPlan = this.plans.find(plan => plan.Id === type);
                    }

                    // 如果没找到指定套餐或没传type，则选择第一个
                    if (!selectedPlan && this.plans.length > 0) {
                        selectedPlan = this.plans[0];
                    }

                    if (selectedPlan) {
                        await this.chooseAmount(selectedPlan.Money, selectedPlan);

                        // 如果传入了type且套餐数量超过3个，滚动到对应套餐
                        if (type && this.plans.length > 3) {
                            this.$nextTick(() => {
                                this.scrollToSelectedPlan(type);
                            });
                        }
                    }
                } else {
                    this.$message.error('暂无会员套餐')
                }
            } catch (error) {
                this.$message.error('获取会员套餐失败')
            } finally {
                this.loading = false
            }

        },
        // 选择金额
        async chooseAmount(amount, plan) {
            this.selectedPlan = plan;
            this.activePlanId = plan.Id;
            this.activeAmount = amount;

            // 重置支付状态
            this.isPayFinish = false;
            this.hasShownSuccessDialog = false;

            // 如果是免费套餐，清空支付信息
            if (amount === 0) {
                this.paymentGuid = "";
                this.paymentUrl = "";
                return;
            }

            // 付费套餐生成支付二维码
            this.qrCodeLoading = true;
            try {
                let res = await this.$http.post("/api/CargoRate/VIPUrl", {
                    MemberDispositionId: plan.Id,
                })
                if (!res.Status) {
                    this.paymentGuid = "";
                    this.paymentUrl = "";
                    this.$message.error(res.Message ?? '获取支付信息失败')
                    return;
                }

                this.paymentGuid = res.Data.GUID;
                this.paymentUrl = res.Data.Url;

                // 生成二维码
                await this.generateQRCode(res.Data.Url);

            } catch (error) {
                this.$message.error('获取支付信息失败')
            } finally {
                this.qrCodeLoading = false;
            }
        },
        // 滚动到指定套餐
        scrollToSelectedPlan(planId) {
            try {
                // 找到对应套餐的索引
                const planIndex = this.plans.findIndex(plan => plan.Id === planId);
                if (planIndex === -1) return;

                // 获取滚动容器（el-row）
                const scrollContainer = document.querySelector('.renew-dialog .el-row');
                if (!scrollContainer) return;

                // 获取所有套餐元素
                const planElements = scrollContainer.querySelectorAll('.el-col');
                if (planElements.length <= planIndex) return;

                // 获取目标套餐元素
                const targetElement = planElements[planIndex];

                // 计算滚动位置
                const containerRect = scrollContainer.getBoundingClientRect();
                const targetRect = targetElement.getBoundingClientRect();

                // 如果目标元素不在可视区域内，滚动到该位置
                if (targetRect.left < containerRect.left || targetRect.right > containerRect.right) {
                    const scrollLeft = targetElement.offsetLeft - scrollContainer.offsetLeft -
                        (scrollContainer.clientWidth - targetElement.clientWidth) / 2;

                    scrollContainer.scrollTo({
                        left: Math.max(0, scrollLeft),
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                console.error('滚动到指定套餐失败:', error);
            }
        },
        // 生成二维码
        async generateQRCode(url) {
            try {
                await this.$nextTick(); // 确保DOM已更新
                const canvas = this.$refs.qrCanvas;
                if (canvas) {
                    await qrcode.toCanvas(canvas, url, {
                        width: 170,
                        height: 170,
                        margin: 1,
                        color: {
                            dark: '#000000',
                            light: '#FFFFFF'
                        }
                    });
                }
            } catch (error) {
                console.error('生成二维码失败:', error);
                this.$message.error('生成二维码失败');
            }
        },
        // 免费开通
        async freeOpen(Id) {
            try {
                let res = await this.$http.post("/api/CargoRate/CreateVIP", {
                    MemberDispositionId: Id,
                })
                if (res.Status) {
                    await this.checkMemberStatus();
                    ElMessageBox.alert('免费会员开通成功！', '开通成功', {
                        confirmButtonText: '完成',
                        type: 'success',
                        callback: () => {
                            this.show = false; // 关闭弹窗
                            this.closeDialog();
                        }
                    });
                } else {
                    ElMessage.error(res.Message || '开通失败')
                }
            } catch (error) {
                ElMessage.error('开通失败')
            }
        },

        async checkMemberStatus() {
            let res = await this.$http.get("/api/CargoRate/SelectVIP", {
                Type: 1
            })
            if (res.Status) {
                this.$store.commit('auth/setVipInfo', res.Data);
            }
        },
        getNameByType(type) {
            const nameMap = {
                1: "搜运价",
                2: "找舱位",
                3: "查船期",
                4: "卖舱位",
                5: "箱跟踪"
            };
            return nameMap[type] || null;
        },
        getDescribeByType(type) {
            const describeMap = {
                1: "提供全球海运实时运价数据的查询比价",
                2: "提供基于用户需求的舱位资源智能匹配服务",
                3: "提供全球海运主要航线的船舶动态查询服务",
                4: "提供基于保舱服务的舱位库存智能撮合服务",
                5: "提供全球海运端到端全程物流跟踪订阅服务"
            };
            return describeMap[type] || null;
        },
        getTipByType(item) {
            if (!item || typeof item.Type !== 'number') {
                return '';
            }
            const nameMap = {
                1: "查询运价",
                2: "找舱位",
                3: "查船期",
                4: "卖舱位",
                5: "箱跟踪"
            };
            const typeName = nameMap[item.Type] || null;
            if (!typeName) {
                return '';
            }
            return item.Status
                ? `可免费${typeName}${item.Number}条`
                : `可无限次${typeName}`;
        },
        getIconUrl(name) {
            // 使用动态导入来获取图标文件
            return new URL(`./vipIcon/${name}.svg`, import.meta.url).href;
        },
        // 检查支付状态
        async checkPayStatus() {
            if (this.isPayFinish || this.hasShownSuccessDialog) {
                clearInterval(this.checkInterval);
                return;
            }
            if (!this.paymentGuid) {
                return;
            }

            try {
                // 使用支付订单状态检查接口
                let res = await this.$http.get("/api/Payment/GetOrderStatusForExternal", {
                    guid: this.paymentGuid
                })

                if (res.Status && res.Data === 3) {
                    // 支付成功，更新会员信息
                    this.isPayFinish = true;
                    this.hasShownSuccessDialog = true; // 标记已显示弹窗
                    clearInterval(this.checkInterval); // 立即停止检查

                    await this.checkMemberStatus();

                    ElMessageBox.alert('支付成功！会员已开通', '支付成功', {
                        confirmButtonText: '完成',
                        type: 'success',
                        callback: () => {
                            this.show = false; // 关闭弹窗
                            this.closeDialog();
                        }
                    });
                }
            } catch (error) {
                console.error('检查支付状态失败:', error);
            }
        },
        closeDialog() {
            clearInterval(this.checkInterval);
            // 重置状态
            this.isPayFinish = false;
            this.hasShownSuccessDialog = false;
            this.paymentGuid = "";
            this.paymentUrl = "";
            this.checkMemberStatus();
        },
    },
    async mounted() {
        // 把自身的引用存到store中
        this.$store.commit("renew/setDialogRef", this)
        // this.$store.dispatch("payplan/getPayPlan")
    }
})
</script>
<style lang="scss">
.renew-dialog {
    background-color: #F7F8FA;
}
</style>
<style lang="scss" scoped>
.recharge-container {
    width: 1160px;
    display: flex;
    justify-content: space-between;
    gap: 15px;
}

.main {
    flex: 1 1 auto;
    min-width: 0;
    /* 允许flex项目收缩 */
    overflow: hidden;
    /* 防止内容溢出 */
}

.hb-title {
    font-family: PingFangSC-Medium;
    font-size: 24px;
    color: #3c4144;
    letter-spacing: 0;
    line-height: 34px;
    font-weight: 500;
}

.desc-text {
    color: #969799;
    font-size: 14px;
}

.space-width {
    margin: 0 auto;
    width: 100%;
    border-bottom: 1px dashed #e4e7ed;
    padding-bottom: 20px;
}

.flex-box {
    display: flex;
}

.flex-box-wrap {
    width: 600px;
    display: flex;
    flex-wrap: wrap;
}

.detail-text {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #606266;
    font-weight: 400;
}

.real-price {
    font-family: HelveticaNeue-Medium;
    font-size: 24px;
    color: #fa6400;
    letter-spacing: -2px;
    font-weight: 500;
}

.pay-btn-box {
    width: 218px;
    height: 57px;
    border: 1px solid #ebecf0;
    border-radius: 8px;
    margin: 0 15px 15px 0;
    line-height: 55px;
    padding-left: 10px;
    cursor: pointer;

    img {
        vertical-align: middle;
    }
}

.pay-btn-box.active {
    background: #fffcf5;
    border: 1px solid #ebbf74;
    position: relative;
    overflow: hidden;

    &::after {
        content: "√";
        line-height: 14px;
        display: block;
        color: #ffffff;
        font-weight: 600;
        position: absolute;
        right: 2px;
        bottom: 2px;
    }

    &::before {
        content: "";
        display: block;
        width: 34px;
        height: 34px;
        background-color: #ebbf74;
        position: absolute;
        right: -17px;
        bottom: -17px;
        transform: rotate(45deg);
    }
}

.plan {
    width: 100%;
    transition: all 0.3s ease-in-out;
    box-sizing: border-box;
    flex-shrink: 0;
    margin-left: -1px;

    &.self-hovered {
        border-color: #FD953E !important;
        box-shadow: 0 0 10px rgb(253, 149, 62, .3);
        position: relative;
        z-index: 1;
    }

    &.disable {
        cursor: not-allowed;
        opacity: 0.5;

        &:hover {
            border-color: #eaeaea !important;
            /* Revert all borders to original color */
            box-shadow: none !important;
        }
    }

    h3 {
        margin: 10px 0;
        color: #333;
        font-size: 22px;
    }

    p {
        color: rgba(0, 0, 0, 0.6);
        margin: 5px 0;
        font-size: 14px;
    }

    ul {
        height: 310px;
        list-style: none;
        padding: 0;
    }

    li {
        margin: 5px 0;
        font-size: 15px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);

        div {
            font-size: 14px;
            padding-left: 27px;
            font-weight: normal;
            color: rgba(0, 0, 0, 0.6);
        }

        img {
            width: 22px;
            vertical-align: middle;
            margin-bottom: 2px;
        }

        .tip {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.45);
            font-weight: normal;
        }
    }

    .price-Box {
        height: 80px;
        display: flex;
        justify-content: space-between;

        .type {
            img {
                width: 14px;
            }

            margin: 10px 0;
            height: 20px;
            display: flex;
            // align-items: center;
        }

        .price {
            font-size: 12px;
            margin: 10px 0;

            span {
                font-size: 14px;
                color: #000;
            }
        }
    }


    .title {
        font-size: 14px;
        width: 100%;
        height: 20px;
        border-bottom: 1px solid #eaeaea;
    }

    .btn {
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        margin: 15px auto 0;
        font-size: 18px;
        width: 270px;
        text-align: center;
        margin-bottom: 10px;
    }

    .open {
        color: #fff;
        background-image: linear-gradient(116deg, #e6a23c 8%, #f56c6c 100%);
    }

    .openExperience {
        margin-top: 10px;
        border: 1px solid #f56c6c;
        color: #f56c6c;
    }
}

.JstCardLayout-plan {
    :deep(.el-card__header) {
        display: none;
    }

    :deep(.el-card__body) {
        padding: 10px 15px;
    }
}

.free-btn {
    position: absolute;
    background-color: rgba(251, 233, 197, 1);
    color: rgba(173, 127, 52, 1);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 6px 10px;
    border-radius: 23px;
    cursor: pointer;
    font-size: 14px;
    width: 105px;
    text-align: center;
}
</style>