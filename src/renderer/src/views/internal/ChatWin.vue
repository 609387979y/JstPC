<template>
    <div class="main-body" ref="boxRef">
        <Alert text="未 @指定销售时消息默认群发全员；如需一对一沟通，可 @对应销售单发消息，各聊天内容相互隔离，对方无法查看你与其他人的对话。"></Alert>

        <ChatInfo :info="info" class="info-box"></ChatInfo>

        <div class="chat-bxo">
            <el-input @input="handleInput" @keyup.enter="handleEnter" v-model="message" type="textarea" resize="none"
                placeholder="请输入消息，按enter键 或 点击发送按钮发送"></el-input>

            <!-- 用户选择浮层 -->
            <ul v-if="showMention" ref="mentionListRef" class="mention-list"
                :style="{ top: popupTop + 'px', left: popupLeft + 'px' }">
                <li v-for="(user, idx) in filterUser" :key="user.id" :class="{ active: idx === selectedIndex }"
                    @click="selectUser(user)" @mouseenter="selectedIndex = idx">
                    {{ user.RealName }}
                </li>
                <li v-if="filterUser.length === 0" @click="selectUser()">无匹配用户</li>
            </ul>
            <div class="chat-btn">
                <div @click="openDialog">{{ Type == 1 ? '询价对比' : '' }}</div>
                <div>
                    <div class="send-btn" @click="sendFun">发送</div>
                </div>
            </div>
        </div>
    </div>

    <el-dialog v-model="delateDialog" title="报价详情">
        <AppVxeTable :showPager="false" ref="businessRef" class="vex-table-primary freight-table" :tableData="tableData"
            :tableOption="tableOption" @getTableList="getList()" :tableHeight="'1000'" :columnList="columnList">
            <vxe-column type="expand" title="更多" width="50">
                <template #content="{ row, rowIndex }">
                    <div class="row-expand-content" style="padding: 0 1px;">
                        <sonTable :nobtn="true" :tableData="tableData[rowIndex].sonTable"
                            :sonColumnList="sonColumnList"></sonTable>
                    </div>
                </template>
            </vxe-column>

            <template #Type="{ row }">
                <div>
                    {{ row.Type == 1 ? '询价' : '询盘' }}
                </div>
            </template>

            <template #box="{ row }">
                <div>
                    {{ row.Box + "*" + row.BoxAmount }}
                </div>
            </template>
        </AppVxeTable>
    </el-dialog>

</template>

<script setup>
import Alert from '@/components/Alert.vue';
import ChatInfo from './components/ChatInfo.vue';
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import request from "@/public/request";
import AppVxeTable from "@/components/AppVxeTable.vue";
import sonTable from './components/sonTable.vue';
import { useRoute } from 'vue-router';
import { useStore } from "vuex";
import { ElMessage } from 'element-plus';

const store = useStore();

const route = useRoute()

const info = ref([

])

const message = ref('')




const handleEnter = () => {
    sendFun()
}

// @功能
const showMention = ref(false)
const popupTop = ref(0)
const popupLeft = ref(0)

const updatePopupPosition = () => {
    popupTop.value = cursor.value.y - 50
    popupLeft.value = cursor.value.x - 150
    console.log(popupTop.value)
}



// 模拟用户列表
const users = ref([])

const filterUser = ref([])
const searchUser = ref(false)
const handleInput = (e) => {
    if (e.includes(' ') || e.includes('\n')) {
        searchUser.value = false
        showMention.value = false
    } else if (searchUser.value) {
        const arr = e.split('@')
        const name = arr[arr.length - 1]
        filterUser.value = users.value.filter(item => item.RealName.indexOf(name) != -1)
    }
}

watch(
    () => message.value,
    (newVal, oldVal) => {
        if(Type.value == 2) return
        if (newVal.indexOf('@') != -1 && oldVal.indexOf('@') == -1) {
            filterUser.value = users.value
            updatePopupPosition()
            showMention.value = true
            searchUser.value = true
        }
        if (newVal.indexOf('@') == -1 && oldVal.indexOf('@') != -1) {
            showMention.value = false
            searchUser.value = false
        }
    }
)

const cursor = ref({})
const updateCursor = (e) => {
    cursor.value = { x: e.clientX, y: e.clientY }
    // 如需相对于整个页面（考虑滚动）使用 e.pageX / e.pageY
}

// 关闭提及浮层
const closeMention = () => {
    showMention.value = false
    searchUser.value = false
}

const selectUser = (user) => {
    if (!user) {
        searchUser.value = false
        showMention.value = false
    }
    const arr = message.value.split('@')
    arr[arr.length - 1] = user.RealName
    message.value = arr.join('@')
    searchUser.value = false
    showMention.value = false
}

const search = ref({})
const getList = async () => {
    try {
        tableOption.loading = true
        const res = await request.get('/api/CargoRate/PriceComparison', { BusinessDocumentsId: BusinessDocumentsId.value })
        if (!res.Data.length) return
        res.Data[0].info.sonTable = res.Data
        tableData.value = [res.Data[0].info]
        tableOption.total = res.Total
        console.log(tableData.value)
    } catch (error) {

    } finally {
        tableOption.loading = false
    }
}

const tableData = ref([])
const tableOption = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
})

const sonColumnList = reactive([
    {
        title: '供应商',
        field: 'CompanyName',
        width: 120
    },
    {
        title: '报价',
        field: 'Price',
        width: 120
    },
    {
        title: '备注',
        field: 'Remark'
    },
    {
        title: '回复时间',
        field: 'CreateTime',
        width: 140
    },
])

const columnList = reactive([
    {
        title: '业务类型',
        field: 'Type',
        type: 'slot',
        slotName: 'Type',
        width: 120
    },
    {
        title: '起运港',
        field: 'PolEnPortName',
        width: 120
    },
    {
        title: '目的港',
        field: 'DestEnPortName',
        width: 120
    },
    {
        title: '开始有效期',
        field: 'StartTime',
        width: 140
    },
    {
        title: '结束有效期',
        field: 'EndTime',
        width: 140
    },
    {
        title: '箱型箱量',
        field: 'box',
        type: 'slot',
        slotName: 'box',
        width: 140
    },
    {
        title: '备注',
        field: 'SpecialRemark',
        width: 200
    },
    {
        title: '询价时间',
        field: 'CreateTime',
        width: 140
    },
])

const delateDialog = ref(false)
const openDialog = () => {
    if (Type.value == 2) return
    delateDialog.value = true
    getList()
}

const BusinessDocumentsId = ref('')

const getMessage = async () => {
    try {
        const res = await request.get('/api/CargoRate/SelectAllMessages', { BusinessDocumentsId: BusinessDocumentsId.value, CompanyId: employee.value.CompanyId })
        info.value = res.Data
    } catch (error) {
        console.log(error)
    }
}

const employee = computed(() => {
    if (store.state.auth.employee) {
        return store.state.auth.employee;
    } else {
        return {};
    }
});

const userInfo = computed(() => {
    if (store.state.auth.employee) {
        return store.state.auth.user;
    } else {
        return {};
    }
});

const Type = ref('1')

const sendFun = async () => {
    try {
        let pd = {
            InfoId: info.value[0].InfoId,
            DetailsId: info.value[0].DetailsId,
            ChatId: userInfo.value.Id,
            ChatContent: message.value,
            Type: 2,
            Status: Type.value,
            CompanyId: employee.value.CompanyId,
            Avatar: userInfo.value.Avatar,
            MobilePhone: userInfo.value.MobilePhone,
            RealName: employee.value.RealName || userInfo.value.RealName,
        }
        let arr = []
        users.value.forEach(item => {
            if (message.value.indexOf('@' + item.RealName) != -1) {
                arr.push(item.message.DetailsId)
            }
        })
        if (arr.length) {
            arr.forEach(async item => {
                pd.DetailsId = item
                const res = await request.post('/api/CargoRate/CreateMessages', pd)
                if (!res.Status) return ElMessage.error(res.Message)
                message.value = ''
            })
        } else {
            const res = await request.post('/api/CargoRate/CreateMessages', pd)
            if (!res.Status) return ElMessage.error(res.Message)
            message.value = ''
        }
        getMessage()
    } catch (error) {

    }
}

const getUserList = async () => {
    const res = await request.get('/api/CargoRate/PriceComparison', { BusinessDocumentsId: BusinessDocumentsId.value })
    console.log(res)
    users.value = res.Data
}

onMounted(() => {
    window.addEventListener('mousemove', updateCursor)
    document.addEventListener('click', closeMention)

    console.log(route.query.BusinessDocumentsId)
    if (route.query.BusinessDocumentsId) {
        BusinessDocumentsId.value = route.query.BusinessDocumentsId
        getMessage()
        getUserList()
    }

    if (route.query.Type) {
        Type.value = route.query.Type
    }
})

onUnmounted(() => {
    window.removeEventListener('mousemove', updateCursor)
})

</script>

<style lang="scss" scoped>
.info-box {
    margin: 16px 0;
    height: calc(100% - 252px);
}

.main-body {
    background-color: #fff;
    padding: 8px;
    border: 1px solid #F2F3F5;
    height: calc(100% - 20px);



    .chat-bxo {
        height: 160px;
        border: 1px solid #FD953E;
        border-radius: 24px;
        box-shadow: 0 2px 7px 0 #9C4700;
        padding: 12px;
        box-sizing: border-box;

        .chat-btn {
            line-height: 22px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            cursor: pointer;

            .send-btn {
                padding: 4px 12px;
                color: #fff;
                line-height: 22px;
                background-color: #FD953E;
                cursor: pointer;
                border-radius: 100px;
            }
        }

        :deep(.el-input--small) {
            height: calc(100% - 30px);

            .el-textarea__inner {
                height: 100%;
                border: none;
            }
        }
    }
}

.mention-list {
    position: absolute;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    list-style: none;
    margin: 0;
    padding: 4px 0;
    width: 150px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.mention-list li {
    padding: 6px 12px;
    cursor: pointer;
}

.mention-list li.active {
    background-color: #e6f7ff;
}

.mention-list li:hover {
    background-color: #f5f5f5;
}
</style>