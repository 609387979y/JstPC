<template>
    <el-dialog v-model="dialog" title="查看详情">
        <div class="main-body">
            <ChatInfo style="height: 300px;"></ChatInfo>
            <div class="link-box">
                <div>
                    当前线索仅做查看
                </div>
                <div>
                    （非本人）
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import ChatInfo from './ChatInfo.vue';
import { ref } from 'vue';

const props = defineProps({
    dialog: {
        type: Boolean,
        default: false
    }
})
</script>

<style lang="scss" scoped>
.main-body {
    background-color: #F7F7F7;
    padding: 12px;
}

.link-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #DCDFE6;
    height: 75px;
    font-weight: 600;
    color: #252525;
}
</style>