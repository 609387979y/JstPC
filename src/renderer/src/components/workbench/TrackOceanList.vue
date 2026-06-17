<template>
    <JstCardLayout v-loading="state.list.loading" class="record-card" border>
        <template #title>订阅货物</template>

        <div class="record-list">
            <template v-if="state.list.data.length != 0">
                <el-scrollbar :height="520">
                    <div v-for="(item, idx) in state.list.data" :key="item.Id">
                        <TrackOceanRecord
                            hideBtn
                            @reload="resetAndGetList"
                            class="record-item"
                            :class="idx % 2 == 1 ? 'even' : ''"
                            :data="item"
                        ></TrackOceanRecord>
                        <!-- <el-divider class="split" v-if="idx != state.list.data.length - 1"></el-divider> -->
                    </div>
                </el-scrollbar>
            </template>
            <template v-else>
                <div class="empty">
                
                    <div>
                        <img src="@/assets/images/no-data.svg" />
                    </div>
                    <div style=" margin-top: 30px;margin-bottom: 20px;">
                        暂无订阅货物，前往<a type="primary" style="font-size: 13px;" :underline="false" @click="$router.push('/cargoTracking/trackOcean')" >订阅全球货物跟踪</a>
                    </div>
                </div>
            </template>
        </div>
    </JstCardLayout>
</template>

<script setup lang="ts">
import {
    defineComponent,
    ref,
    reactive,
    onMounted,
    nextTick
} from "vue";
import request from "@/public/request"
import TrackOceanRecord from "@/components/trackOcean/TrackOceanRecord.vue"

const state = reactive({
    // 数据列表
    list: {
        query: {
            page: 1,
            limit: 10,
            // 单号
            No: "",
            //  0-> 新增日期  1-> 离港日期  2->到港日期
            Order: 0,
            // asc = 0 / desc = 1
            OrderType: 1,

        },
        loading: false,
        // 总数
        total: 0,
        data: <any[]>[]
    }
})


/**
 * 根据query 请求 已订阅的数据
 */
async function requestList() {
    state.list.loading = true
    let res = await request.get("/api/CT_TrackOcean/GetList", {
        ...state.list.query
    })
    state.list.total = res.Total
    state.list.data = state.list.data.concat(res.Rows)
    state.list.loading = false
    nextTick(() => {
        // window.
        // window.
    })
}
// 回到第一页
function resetAndGetList() {
    state.list.data = []
    state.list.query.page = 1;
    requestList()
}

onMounted(() => {
    resetAndGetList()
})

</script>
<style lang="scss" scoped>
.record-card {
    :deep(.el-card__body) {
        padding: 0px;
    }

    .record-item {
        padding: 9px 24px 9px 8px;
        margin-left: 24px;
        &:hover {
            background-color: #f7f8fa;
        }
        &.even {
            background-color: #f7f8fa;
        }
    }
    .split {
        margin: 0px;
    }
}

.empty {
    text-align: center;
    font-size: 14px;
    color: #909399;
    margin-top: 72px;
    min-height: 250px;
}
</style>