<template>
    <div class="heard-info">
        <template v-for="(item, index) in state.wallet" :key="index">
            <div class="heard-lind" v-if="index > 0"></div>
            <div class="heard-tab-Box" :class="{ 'active': info.tabActive === item.value }"
                @click="info.tabActive = item.value">
                <div class="title">{{ item.label }}</div>
                <div class="info">
                    <span>
                        {{ item.count }}
                    </span>
                    {{ unit }}
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, reactive } from 'vue'
import request from "@/public/request";

const props = defineProps({
    tabItems: {
        type: Array,
        default: () => [
        ]
    },
    search: {
        type: Object,
        default: () => {
            return {
                timeValue: 0,
                tabActive: -1,
            }
        }
    },
    unit: {
        type: String,
        default: '点'
    },
    companyId: {
        type: Number,
        default: 0
    },
})
const state = reactive({
    wallet: [
        { label: '总累计充值Q点', value: 0, count: '-' },
        { label: '剩余Q点', value: 1, count: '-' },
        { label: '共消费Q点', value: 2, count: '-' },
    ]
})
const getWalletDictionary2 = async (Id) => {
    const res = await request.get("/api/CargoRate/SelectCustomerDispositionPriceDetails", {
        companyId: Id,
    });
    if (res.Status == false) {
        return;
    }
    if (res.Status) {
        if (res.Data && res.Data.length && res.Data[0].Details && res.Data[0].Details.length) {
            res.Data[0].Details.forEach(t => {
                const type = t.Type;
                switch (type) {
                    case 1:
                        state.wallet[0].count = t.Integral;
                        break;
                    case 2:
                        state.wallet[1].count = t.Integral;
                        break;
                    case 3:
                        state.wallet[2].count = t.Integral;
                        break;
                    default:
                        break;
                }
            })
        }
    }
}
const getWalletDictionary = async (Id) => {
    const res = await request.get("/api/PayWallet/GetWalletDictionary");
    if (res.Status == false) {
        return;
    }
    state.wallet[0].count = res.Data['总累计充值Q点：']
    state.wallet[1].count = res.Data['剩余Q点：']
    state.wallet[2].count = res.Data['共消费Q点：']
}
const emit = defineEmits(['update:search'])
defineExpose({
    getWalletDictionary
})
// 计算属性
const info = computed({
    get() {
        return props.search
    },
    set(value) {
        emit('update:search', value)
    }
})
onMounted(() => {
})

</script>

<style lang="scss" scoped>
:deep(.heard-data-select) {
    .el-input__inner {
        border: none;
        font-size: 16px;
        font-weight: bold;
    }
}

.heard-info {
    height: 76px;
    // border: 1px solid #ebeef5;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px 10px;
    gap: 20px;
    margin-top: 10px;

    .heard-data {
        width: 200px;
        display: flex;
        justify-content: center;
    }

    .heard-lind {
        height: 50%;
        width: 2px;
        background-color: #ebeef5;
    }

    .heard-tab-Box {
        flex: 1;
        height: 100%;
        padding: 5px 25px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 15px;
        // cursor: pointer;

        .title {}

        .info {
            display: flex;
            align-items: center;

            span {
                font-size: 28px;
                font-weight: 550;
                margin-right: 10px;
            }
        }
    }

    .active {
        background-color: #fff9f3;
    }
}
</style>