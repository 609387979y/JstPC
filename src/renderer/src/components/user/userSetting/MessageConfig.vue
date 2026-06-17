<template>
    <div style="width: 100%;">
        <div>
            <el-button type="primary" @click="saveMessageConfig">保存</el-button>
        </div>
        <el-table
            :data="tableData"
            style="width:100%;margin-top: 15px;"
            row-key="id"
            default-expand-all
            :tree-props="{ children: 'Items', hasChildren: 'hasChildren' }"
        >
            <el-table-column prop="GroupName" label="消息类型" />
            <el-table-column prop="ItemName" label="消息子类型" />
            <el-table-column prop="SystemMessage" label="站内信">
                <template #default="scope">
                    <template v-if="!scope.row.Items">
                        <el-checkbox v-model="scope.row.SystemMessage"></el-checkbox>
                    </template>
                    <template v-else>
                        <el-checkbox v-model="scope.row.SystemMessageCheckAll"></el-checkbox>
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="SMS" label="短信">
                <template #default="scope">
                    <template v-if="!scope.row.Items">
                        <el-checkbox v-model="scope.row.SMS"></el-checkbox>
                    </template>
                    <template v-else>
                        <el-checkbox v-model="scope.row.SMSCheckAll"></el-checkbox>
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="Email" label="邮箱">
                <template #default="scope">
                    <template v-if="!scope.row.Items">
                        <el-checkbox v-model="scope.row.Email"></el-checkbox>
                    </template>
                    <template v-else>
                        <el-checkbox v-model="scope.row.EmailCheckAll"></el-checkbox>
                    </template>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { defineComponent, computed,reactive } from "vue"

export default defineComponent({
    components: {

    },
    data() {
        return {
            tableData: []
        }
    },
    methods: {
        async getMessageConfigs() {
            let res = await this.$http.get("/api/Message/GetEmployeeMessageConfig")
            let idx = 0;
            for (let row of res) {
                row.ItemName = "";
                row.id = ++idx;
                row.checkAll = false;
                for (let item of row.Items) {
                    item.id = ++idx;
                }
            }


            this.tableData = res;

            for (let group of this.tableData) {
                // 站内信是否全选
                group.SystemMessageCheckAll = computed({
                    get() {
                        // 如果下面都是被勾选了 返回true
                        if (group.Items.find(t => t.SystemMessage == false)) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    set(val) {
                        for (let item of group.Items) {
                            item.SystemMessage = val ? true : false;
                        }
                    }
                });
                //  短信 是否全选
                group.SMSCheckAll = computed({
                    get() {
                        // 如果下面都是被勾选了 返回true
                        if (group.Items.find(t => t.SMS == false)) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    set(val) {
                        for (let item of group.Items) {
                            item.SMS = val ? true : false;
                        }
                    }
                });
                // 邮件 是否全选
                group.EmailCheckAll = computed({
                    get() {
                        // 如果下面都是被勾选了 返回true
                        if (group.Items.find(t => t.Email == false)) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    set(val) {
                        for (let item of group.Items) {
                            item.Email = val ? true : false;
                        }
                    }
                });

            }

        },
        async saveMessageConfig() {

            let arr = [];


            for (let group of this.tableData) {
                for (let item of group.Items) {

                    // SMS 2
                    arr.push({
                        GroupName: item.GroupName,
                        ItemName: item.ItemName,
                        MessageType: 2,
                        Enable: item.SMS,
                    });
                    // Email 1
                    arr.push({
                        GroupName: item.GroupName,
                        ItemName: item.ItemName,
                        MessageType: 1,
                        Enable: item.Email,
                    });
                    // SystemMessage 0 
                    arr.push({
                        GroupName: item.GroupName,
                        ItemName: item.ItemName,
                        MessageType: 0,
                        Enable: item.SystemMessage,
                    });
                }
            }


            let res = await this.$http.post("/api/Message/SaveEmployeeMessageConfig", {
                data: arr
            })

            if (!res.Status) {
                this.$message.error(res.Message ?? '失败')
                return;
            }
            this.$message.success('成功');

        }
    },
    computed: {

    },
    created() {
        this.getMessageConfigs();
    }
})
</script>

<style lang='scss' scoped>
</style>