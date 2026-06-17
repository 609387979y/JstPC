<template>
    <div class="alert-box">
        <el-icon class="icon">
            <Warning />
        </el-icon>{{ text }}
    </div>
</template>

<script setup>
import { Warning } from "@element-plus/icons";
const props = defineProps({
    text: {
        type: String,
        default: ''
    }
})

</script>

<style lang="scss" scoped>
.alert-box {
    background-color: #FFF9EA;
    padding: 8px 16px;
    border-radius: 24px;
    font-size: 14px;
    line-height: 22px;
    color: #000;
    display: flex;
    align-items: center;
}

.icon {
    font-size: 16px;
    color: #E6A23C;
    margin-right: 10px;
}
</style>