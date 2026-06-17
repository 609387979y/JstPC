<template>
    <el-dialog v-model="state.show" title="" :width="state.success ? '1200px' : '500px'"
        :top="state.success ? '5vh' : '25vh'" custom-class="business-dialog">
        <template #title>
            <div></div>
        </template>
        <div class="modal">
            <div class="header-image">
                <!-- <img v-if="state.success" src="@/assets/opportunity-header.png" alt="成功">
                <img v-else src="@/assets/opportunity-header.png" alt="失败"> -->
            </div>
            <div class="title">
                {{ state.success ? "商机获取成功，具体商机信息如下" : "Q点不足，扣除失败" }}
            </div>
            <template v-if="state.success">
                <div class="info-title">商机信息</div>
                <SuccessData ref="successDataRef"></SuccessData>
            </template>
            <template v-else>
                <div class="failed-info">
                    当前剩余Q点：<span>{{ wallet.balance }}</span>，应扣除Q点：<span>20</span>，剩余Q点无法够扣除，请联系公司管理员进行相应充值后在扣除
                </div>
            </template>
        </div>
        <div class="btn" @click="goBack">返回待处理列表</div>
        <!-- <div class="btn" v-if="!state.success" @click="wallet.openRecharge">充值</div> -->
    </el-dialog>
</template>
<script setup>
import { ref, defineProps, nextTick, defineExpose, defineEmits, reactive, watch, computed, onMounted, } from "vue";
import request from "@/public/request";
import { ElMessage, ElMessageBox } from "element-plus";
import SuccessData from "./SuccessData.vue"
import { useWallet } from "@/composables/pay/useWallet"
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({

})

const wallet = useWallet()//余额

const state = reactive({
    show: false,
    success: true,
})
const successDataRef = ref()
const emits = defineEmits(['refresh']);
const goBack = () => {
    if (state.success) {
        emits('refresh')
    }
    state.show = false;
}
const openDialog = (Status, info) => {
    state.show = true;
    state.success = Status;
    if (Status) {
        nextTick(() => {
            successDataRef.value.setData(info)
        })
    }
};
onMounted(() => {
})
defineExpose({
    openDialog,
});
</script>
<style lang="scss">
.business-dialog .el-dialog__body {
    padding: 10px 20px 30px;
}
</style>
<style lang="scss" scoped>
.header-image {
    text-align: center;
    margin-bottom: 20px;

    img {
        max-width: 100%;
        height: auto;
    }
}

.title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #000;
}

.info-title {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 10px;
    padding: 0 20px;
    color: #000;
}

.btn {
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    margin: 15px auto 0;
    font-size: 18px;
    width: 270px;
    text-align: center;
    color: #fff;
    background-image: linear-gradient(116deg, #e6a23c 8%, #f56c6c 100%);
}

.failed-info {
    padding: 0 20px;
    font-size: 14px;
    color: #606266;
    margin-top: -10px;

    span {
        color: #EF6B33;
        font-weight: 550;
    }
}
</style>
