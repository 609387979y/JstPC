<template>
    <div class="record">
        <div class="title">
            <template v-if="data.isBillNo">
                <el-space>
                    <div>
                        提单号：
                        {{ data.billNo }}
                    </div>
                    <div></div>
                    <div @click="openPosition" class="position">船舶定位</div>
                </el-space>
            </template>
            <template v-else>箱号： {{ data.containerNo }}</template>
        </div>
        <div class="content">
            <div class="info">
                <div>
                    <JstFormField>
                        <template #title>状态：</template>
                        <div class="statusText">
                            {{ data.CurrentStatusDescriptionCn }}
                            {{ $utils.formatDateTime(data.CurrentStatusEventTime) }}
                        </div>
                    </JstFormField>
                </div>
                <div>
                    <el-space>
                        <JstFormField main="value">
                            <template #title>船名：</template>
                            <div class="infoText">{{ $utils.formatEmptyString(data.FirstVessel) }}</div>
                        </JstFormField>
                        <JstFormField main="value">
                            <template #title>船公司：</template>
                            <div class="infoText">
                                <el-link target="__blank" :href="data.CarrierUrl" type="primary"
                                    style="font-size: 12px;">{{ data.CarrierCode }}</el-link>
                            </div>
                        </JstFormField>
                    </el-space>
                </div>
                <div>
                    <el-space>
                        <JstFormField main="value">
                            <template #title>航次：</template>
                            <div class="infoText">{{ $utils.formatEmptyString(data.FirstVoyage) }}</div>
                        </JstFormField>
                        <JstFormField main="value">
                            <template #title>箱型箱量：</template>
                            <div class="infoText">{{ $utils.formatEmptyString(data.ContainerInfo) }}</div>
                        </JstFormField>
                    </el-space>
                </div>
            </div>

            <div class="step" :class="hideBtn ? 'hideBtn' : ''">
                <template v-if="statusList.length == 0">
                    <a-steps progress-dot :current="-1">
                        <a-step title="订舱"></a-step>
                        <a-step title="到达"></a-step>
                    </a-steps>
                </template>
                <template v-else>
                    <a-steps progress-dot :current="currentStatus">
                        <a-step v-for="item in statusList" :key="item.Id"
                            :title="item.descriptionCn ? item.descriptionCn : item.descriptionEn"
                            :description="descriptionText(item)"></a-step>
                    </a-steps>
                </template>
            </div>
            <div v-if="hideBtn == false" class="btns">
                <div>
                    <el-link @click="toDetail" type="primary" :underline="false">详情</el-link>
                </div>
                <div>
                    <el-popconfirm @confirm="unSubscribe" title="是否取消订阅这条数据?">
                        <template #reference>
                            <el-link type="primary" :underline="false">删除</el-link>
                        </template>
                    </el-popconfirm>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue"



export default defineComponent({
    props: {
        data: {
            type: Object
        },
        hideBtn: {
            type: Boolean,
            default: false
        }
    },
    components: {

    },
    data() {
        return {
            mapToken: ""
        }
    },
    methods: {
        descriptionText(status) {
            return `${status.Count}/${status.TotalCount}箱`
        },
        async openPosition() {

            if (this.mapToken == "") {
                let res = await this.$http.get("/api/CT_TrackOceanConfig/GetMapToken")
                this.mapToken = res;
            }


            let url = `https://app.prd.freightower.com/#/vesseltrack/iframe/${this.mapToken}?billNo=${this.data.SearchBillNo}&containerNo=${this.data.SearchContainerNo}&carrierCode=${this.data.SearchCarrierCode}&portCode=${this.data.SearchPortCode}&isExport=${this.data.SearchIsExport}`
            window.open(url)

        },
        async unSubscribe() {
            let res = await this.$http.post("/api/CT_TrackOcean/UnSubscribe", {
                idList: [this.data.SubscribeId]
            })

            if (!res.Status) {
                this.$message.error(res.Message ?? '失败')
                return;
            }
            this.$message.success('成功');
            this.$emit("reload")
        },


        toDetail() {
            this.$router.push({
                path: "/cargoTracking/trackOcean/detail",
                query: {
                    id: this.data.Id
                }
            })
        }
    },
    created() {
    },
    computed: {
        // 到达第一个isEsti 是Y的
        currentStatus() {
            let idx = this.statusList.findIndex(t => t.isEsti == 'Y')
            if (idx == -1) {
                idx = this.statusList.length
            }
            return idx - 1;
        },
        statusList() {
            if (!this.data || !this.data.ContainerStatus) {
                return []
            }

            // 处理steps status


            let portGroup = []

            for (let status of this.data.ContainerStatus) {
                let place = status.eventPlace
                if (!place) {
                    continue;
                }

                let item = portGroup.find(t => t.eventPlace == place);
                if (item === undefined) {
                    item = {
                        eventPlace: place,
                        eventPlaceOrigin: status.eventPlaceOrigin,
                        list: [status]
                    }
                    portGroup.push(item)
                } else {
                    item.list.push(status)
                }

            }


            let result = []


            for (let group of portGroup) {
                result = result.concat(group.list)
            }


            return result
        }
    }
})
</script>

<style lang='scss' scoped>
$info-width: 304px;

.record {
    position: relative;

    .info {
        width: $info-width;
    }

    font-size: 12px;

    :deep(.prop) {
        font-size: 12px;
    }

    :deep(.value) {
        font-size: 12px;
    }

    .title {
        font-size: 12px;
        color: #303133;
        letter-spacing: 0;
        font-weight: 500;
    }

    .content {
        display: flex;
    }

    .statusText {
        font-size: 12px;
        color: #606266;
        letter-spacing: 0;
        font-weight: 500;
    }

    .infoText {
        width: 96px;
        font-size: 12px;
        color: #606266;
        letter-spacing: 0;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.scrollbar {
    width: 100%;

    :deep(.ant-steps) {
        padding-top: 5px;
        padding-bottom: 10px;
    }
}

.step {
    position: absolute;
    left: 240px;
    width: calc(100% - $info-width - 40px);

    &.hideBtn {
        left: 273px;
    }

    :deep(.ant-steps-item-title) {
        font-size: 12px;
        color: #3c4144;
        text-align: center;
        font-weight: 500;
    }

    :deep(.ant-steps-label-vertical .ant-steps-item) {
        width: 1%;
        min-width: 40px;
    }

    :deep(.ant-steps-item-description) {
        font-size: 12px;
        color: #969799 !important;
        text-align: center;
        font-weight: 400;
    }
}

.position {
    width: 60px;
    height: 16px;
    line-height: 16px;
    background: #edf4ff;
    border-radius: 8.5px;
    font-size: 10px;
    color: #409eff;
    font-weight: 400;
    text-align: center;
    cursor: pointer;
}

.btns {
    position: absolute;
    right: 22px;
    top: 27px;
    height: 100%;
}
</style>