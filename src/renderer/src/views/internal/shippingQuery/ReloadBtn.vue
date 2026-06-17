<template>
    <div>
        <el-button type="primary" size="mini" @click="reload">
            <el-icon class="el-icon--left">
                <Refresh />
            </el-icon>
            刷新
        </el-button>
    </div>
</template>

<script lang="ts">
import { Refresh } from "@element-plus/icons"
import { ElMessage } from "element-plus";
import { defineComponent, ref, unref } from "vue"
export default defineComponent({
    components: {
        Refresh
    },
    setup(context, porps) {
        async function reload() {
            await porps.emit('reload');
            ElMessage.success('刷新成功');
        }
        return {
            reload
        }
    },
})
</script>

<style lang="scss" scoped>
:deep(.el-button--mini) {
    padding: 7px 10px;
}
</style>