<template>
    <el-dialog title="自定义工作台" v-model="dialogVisible" width="600px" @close="handleClose" @opened="handleDialogOpen">
        <div class="customize-workbench-content">
            <div class="section sectiondone">
                <div class="section-title">已选择模块:</div>
                <div class="selected-modules" id="selected-modules-sortable" ref="selectedModulesSortable">
                    <el-tag v-for="item in selectedModules" :key="item.id" closable @close="removeSelectedTag(item)"
                        :data-id="item.id">
                        {{ item.name }}
                    </el-tag>
                </div>
            </div>
            <div class="section">
                <div class="section-title">待选择模块:</div>
                <el-table :data="availableModules" style="width: 100%" max-height="300">
                    <el-table-column prop="name" label="模块名称" width="120"></el-table-column>
                    <el-table-column prop="description" label="模块描述"></el-table-column>
                    <el-table-column label="操作" width="80">
                        <template #default="{ row }">
                            <el-checkbox :model-value="isSelected(row)" @change="handleCheckboxChange(row, $event)" />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import Sortable from 'sortablejs'; // 导入Sortable.js库

export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        initialSelectedModuleIds: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            dialogVisible: this.visible,
            availableModules: [
                { id: "opportunityOverview", name: "商机概况", description: "显示商机概况的统计数据。" },
                { id: "consumptionOverview", name: "消费概况", description: "显示消费概况的统计数据。" },
            ],
            selectedModuleIds: [],
        };
    },
    watch: {
        visible(newVal) {
            this.dialogVisible = newVal;
            if (newVal) {
                // 当弹窗打开时，同步初始选择状态
                this.selectedModuleIds = [...this.initialSelectedModuleIds];
            }
        },
        dialogVisible(newVal) {
            this.$emit("update:visible", newVal);
        },
    },
    computed: {
        selectedModules() {
            const result = [];
            this.selectedModuleIds.forEach(id => {
                const module = this.availableModules.find(item => item.id === id);
                if (module) {
                    result.push(module);
                }
            });
            return result;
            // return this.availableModules.filter(module => this.selectedModuleIds.includes(module.id));
        },
    },
    methods: {
        isSelected(row) {
            return this.selectedModuleIds.includes(row.id);
        },
        handleCheckboxChange(row, checked) {
            if (checked) {
                if (!this.selectedModuleIds.includes(row.id)) {
                    this.selectedModuleIds.push(row.id);
                }
            } else {
                this.selectedModuleIds = this.selectedModuleIds.filter(id => id !== row.id);
            }
        },
        removeSelectedTag(item) {
            this.selectedModuleIds = this.selectedModuleIds.filter(id => id !== item.id);
        },
        handleClose() {
            this.dialogVisible = false;
            this.$emit("cancel");
        },
        handleConfirm() {
            this.dialogVisible = false;
            this.$emit("confirm", this.selectedModuleIds);
        },
        handleDialogOpen() {
            const el = this.$refs.selectedModulesSortable; // 使用ref获取元素
            if (el) {
                new Sortable(el, {
                    animation: 150,
                    onEnd: ({ newIndex, oldIndex }) => {
                        const movedItem = this.selectedModuleIds.splice(oldIndex, 1)[0];
                        this.selectedModuleIds.splice(newIndex, 0, movedItem);
                    },
                });
            } else {
            }
        },
    },
};
</script>

<style scoped lang="scss">
.customize-workbench-content {
    padding: 10px 0;
}

.section {
    margin-bottom: 20px;
}

.sectiondone {
    display: flex;
    gap: 10px;
    align-items: center;
}

.section-title {
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
}

.selected-modules .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}

:deep(.el-tag) {
    cursor: pointer;
}
</style>