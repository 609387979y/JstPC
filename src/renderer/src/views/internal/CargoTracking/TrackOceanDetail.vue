<template>
    <el-row :gutter="8" class="track-detail">
        <el-col :span="16">
            <el-card shadow="nerver" border>
                <template #header>
                    <div class="track-detail-title">
                        <template v-if="data.isBillNo">提单号：{{ data.billNo }}</template>
                        <template v-else>箱号：{{ data.containerNo }}</template>
                    </div>
                </template>
                <div class="track-detail-title" style="margin-bottom: 8px;">宁波港信息</div>
                <el-descriptions :column="3" size="mini" border>
                    <el-descriptions-item>
                        <template #label>船公司</template>
                        {{ $utils.formatEmptyString(data.CarrierCode) }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>船名航次</template>
                        {{ $utils.formatEmptyString(data.FirstVessel) }} / {{ $utils.formatEmptyString(data.FirstVoyage) }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>码头</template>
                        {{ $utils.formatEmptyString(data.TerminalPlanTerminalName) }}
                    </el-descriptions-item>

                    <el-descriptions-item>
                        <template #label>开航日期</template>
                        {{ $utils.formatEmptyString(data.TerminalPlanOpen) }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>计划靠泊</template>
                        {{ $utils.formatEmptyString(data.TerminalPlanEta) }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>计划离泊</template>
                        {{ $utils.formatEmptyString(data.TerminalPlanEtd) }}
                    </el-descriptions-item>

                    <el-descriptions-item>
                        <template #label>截港时间</template>
                        {{ $utils.formatEmptyString(data.TerminalPlanClose) }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>实际靠泊</template>
                        {{ $utils.formatEmptyString(data.TerminalPlanAta) }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>实际离泊</template>
                        {{ $utils.formatEmptyString(data.TerminalPlanAtd) }}
                    </el-descriptions-item>
                </el-descriptions>

                <div class="track-detail-title" style="margin-bottom: 8px;margin-top: 16px;">提单信息</div>
                <div class="empty">
                    <div>
                        <img src="@/assets/images/no-data.svg" />
                    </div>
                    <div style=" margin-top: 30px;">暂无信息</div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="8">
            <el-card shadow="nerver" border class="tracking">
                <div class="route_info">
                    <div class="route_info_pol">
                        <p class="port-name">{{ $utils.formatEmptyString(data.ReceiptName) }}</p>
                        <p class="time">{{ receiptTime }}</p>
                    </div>
                    <div class="route_info_day">
                        <img src="@/assets/images/right-arrow.png" />
                    </div>
                    <div class="route_info_pod">
                        <p class="port-name">{{ $utils.formatEmptyString(data.DeliveryName) }}</p>
                        <p class="time">{{ deliveryTime }}</p>
                    </div>
                </div>

                <div class="containers">
                    <div class="container" v-for="item in data.Container" :key="item.Id">
                        <div @click="item.showDetail = !item.showDetail" class="container-header">
                            <div class="info">
                                <div>
                                    {{ item.containerNo }}
                                    【{{ item.containerSize ?? "" }} {{ item.containerType ?? "" }}】
                                </div>
                                <div>【{{ item.currentStatusDescriptionCn }}】</div>
                            </div>
                            <div class="sub">封号: {{ $utils.formatEmptyString(item.sealNo) }}</div>
                        </div>
                        <div v-show="item.showDetail" class="detail">
                            <el-timeline>
                                <template v-for="(timeline, index) in item.timeline" :key="index">
                                    <el-timeline-item :color="timeline.isPass ? '#409EFF' : ''">
                                        <div
                                            class="timeline-title"
                                        >{{ timeline.placePrefix }}{{ timeline.eventPlace }}</div>
                                    </el-timeline-item>

                                    <el-timeline-item
                                        v-for="(status,statusIdx) in timeline.list"
                                        :key="statusIdx"
                                        :color="status.isEsti == 'N' ? '#409EFF' : ''"
                                    >
                                        <div class="status">
                                            <div style="width:140px">{{ status.descriptionCn }}</div>
                                            <div>{{ $utils.formatDateTime(status.eventTime) }}</div>
                                        </div>
                                    </el-timeline-item>
                                </template>
                            </el-timeline>
                        </div>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import { defineComponent } from "vue"
const DATE_FORMAT = "MM-DD HH:mm"
export default defineComponent({
    components: {

    },

    data() {
        return {
            id: 0,
            data: {}
        }
    },
    methods: {


        generateTimeline(container, data) {
            if (!container || !container.Status) {
                return []
            }

            // 处理steps status


            let portGroup = []

            for (let status of container.Status) {
                let place = status.eventPlace
                if (!place) {
                    continue;
                }
                if(!status.descriptionCn){
                    status.descriptionCn = status.descriptionEn
                }

                let item = portGroup.find(t => t.eventPlace == place);
                if (item === undefined) {
                    item = {
                        // 起运港 中转港口 目的港
                        placePrefix: "",
                        eventPlace: place,
                        eventPlaceOrigin: status.eventPlaceOrigin,
                        list: [status]
                    }


                    // 和 receipt名字一样的是起运港
                    if (data.ReceiptName == place) {
                        item.placePrefix = "起运港"
                    } else if (data.DeliveryName == place) {
                        // 和 DeliveryName名字一样的是目的港
                        item.placePrefix = "目的港"
                    } else {
                        // 其余都是中转港
                        item.placePrefix = "中转港"
                    }

                    portGroup.push(item)
                } else {
                    item.list.push(status)
                }

            }


            for (let group of portGroup) {
                // 判断是否全部完成
                group.isPass = group.list.find(t => t.isEsti != 'N') === undefined ? true : false
            }


            return portGroup

        },
        async getDetail() {
            let res = await this.$http.get(`/api/CT_TrackOcean/GetDetail`, {
                infoId: this.id
            })
            if (!res.Status) {
                this.$message.error(res.Message ?? '失败')
                return;
            }

            for (let i = 0; i < res.Data.Container.length; i++) {
                // 展开第一个
                res.Data.Container[i].showDetail = i == 0;
                res.Data.Container[i].timeline = this.generateTimeline(res.Data.Container[i], res.Data)

            }

            this.data = res.Data

        let trList = document.querySelectorAll("#aaa tr")

            let r = []
            for (let tr of trList) {
                let tdList = tr.querySelectorAll("td");
                r.push(`${tdList[1].innerText},${tdList[2].innerText}`)
            }
            console.log(r.join('\r\n'))

        }
    },
    created() {
        this.id = this.$route.query.id
        this.getDetail()
    },
    computed: {
        // 出发地显示的时间
        receiptTime() {
            if (this.data.ReceiptAtd) {
                return `ATD: ${this.$utils.formatDateTime(this.data.ReceiptAtd, DATE_FORMAT)}`
            }
            return `ETD: ${this.$utils.formatDateTime(this.data.ReceiptEtd, DATE_FORMAT)}`
        },
        // 目的地显示的时间
        deliveryTime() {
            if (this.data.DeliveryAta) {
                return `ATA: ${this.$utils.formatDateTime(this.data.DeliveryAta, DATE_FORMAT)}`
            }
            return `ETA: ${this.$utils.formatDateTime(this.data.DeliveryEta, DATE_FORMAT)}`
        }
    }
})
</script>

<style lang='scss' scoped>
.track-detail {
    :deep(.el-card__header) {
        padding: 8px;
    }
    :deep(.el-timeline) {
        padding-left: 0px;
    }
    :deep(.el-card__body) {
        padding: 16px 24px 32px 16px;
    }
    :deep(.el-descriptions__label.el-descriptions__cell.is-bordered-label) {
        background: #edf4ff;
        font-size: 12px;
        color: #303133;
        letter-spacing: 0;
        font-weight: 400;
    }
    :deep(.el-descriptions__body
            .el-descriptions__table
            .el-descriptions__cell) {
        font-size: 12px;
        color: #303133;
        letter-spacing: 0;
        font-weight: 400;
    }
}
.track-detail-title {
    font-size: 12px;
    color: #303133;
    letter-spacing: 0;
    font-weight: 500;
}
.empty {
    text-align: center;
    font-size: 14px;
    color: #909399;
}

.route_info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    align-items: center;
    .port-name {
        font-size: 14px;
        line-height: 14px;
        font-weight: 600;
    }
    .time {
        font-size: 12px;
        line-height: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.container {
    border-bottom: 1px solid #f2f2f2;
    margin-top: 15px;
    .container-header {
        cursor: pointer;
        .info {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            line-height: 14px;
            padding-bottom: 10px;
        }
        .sub {
            display: flex;
            font-size: 12px;
            line-height: 12px;
            color: #909090;
            margin-bottom: 20px;
        }
    }
    .timeline-title {
        color: #282828;
        font-weight: 600;
    }
    .status {
        color: rgb(40, 40, 40);
        display: flex;
        font-size: 12px;
    }
}
</style>