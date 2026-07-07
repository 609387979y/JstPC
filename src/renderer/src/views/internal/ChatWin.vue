<template>
    <div class="main-body" ref="boxRef">
        <Alert text="未 @指定销售时消息默认群发全员；如需一对一沟通，可 @对应销售单发消息，各聊天内容相互隔离，对方无法查看你与其他人的对话。"></Alert>

        <ChatInfo :info="info" class="info-box" ref="ChatInfoRef"></ChatInfo>

        <div class="fun-box">
            <div class="fun-box-item" v-if="Type == 1" @click="openDialog"><img src="@/assets/duibi.svg" />询价对比</div>
        </div>

        <div class="chat-bxo">
            <el-input @input="handleInput" @keydown="handleEnter($event)" v-model="message" type="textarea"
                resize="none" placeholder="请输入消息，按enter键 或 点击发送按钮发送"></el-input>

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
                <div>{{ '' }}</div>
                <div style="display: flex;align-items: center;">
                    <el-icon @click="getMessageNew" style="font-size: 16px;margin-right: 10px;" title="刷新">
                        <Refresh />
                    </el-icon>
                    <div class="send-btn" @click="sendFun">发送</div>
                </div>
            </div>
        </div>
    </div>

    <el-dialog v-model="delateDialog" title="询价对比" width="80%">
        <div class="handleDialog-title">询价信息</div>
        <div class="handleDialog-info">
            <div class="handleDialog-info-item">
                起运港: {{ tableData[0]?.PolEnPortName }}
            </div>
            <div class="handleDialog-info-item">
                目的港: {{ tableData[0]?.DestEnPortName }}
            </div>
            <div class="handleDialog-info-item">
                开始有效期：{{ tableData[0]?.StartTime }}
            </div>
            <div class="handleDialog-info-item">
                结束有效期：{{ tableData[0]?.EndTime }}
            </div>
            <div class="handleDialog-info-item">
                箱型箱量：{{ tableData[0] ? tableData[0]?.Box + '*' + tableData[0]?.BoxAmount : '' }}
            </div>
            <div class="handleDialog-info-item">
                备注：{{ tableData[0]?.SpecialRemark }}
            </div>

        </div>

        <div class="handleDialog-title">处理商机</div>
        <div class="handleDialog-info">
            <sonTable :tableData="tableData.length ? tableData[0].sonTable : []" :sonColumnList="sonColumnList"
                :nobtn="true"></sonTable>
        </div>
    </el-dialog>

</template>

<script setup>
import Alert from '@/components/Alert.vue';
import ChatInfo from './components/ChatInfo.vue';
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import request from "@/public/request";
import AppVxeTable from "@/components/AppVxeTable.vue";
import sonTable from './components/sonTable.vue';
import { useRoute } from 'vue-router';
import { useStore } from "vuex";
import { ElMessage } from 'element-plus';
import { getElectronAgent } from "@share/agent";
import { Refresh } from "@element-plus/icons";
// import WebSocket from "ws";

const store = useStore();

const route = useRoute()

const agent = getElectronAgent();

const info = ref([

])

const message = ref('')




const handleEnter = (event) => {
    console.log(event.keyCode == 13)
    if (event.keyCode == 13) {
        if (!event.ctrlKey) { // 如果没有按下 Ctrl 键
            event.preventDefault(); // 阻止默认的换行行为
        } else {
            message.value += '\n'; // 按下 Ctrl+Enter 时换行
        }
        sendFun()
    }

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
        if (Type.value == 2) return
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
        width: 200
    },
    {
        title: '报价',
        field: 'Price',
        width: 120
    },
    {
        title: '备注',
        field: 'Remark',
        minWidth: 200
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

const ChatInfoRef = ref(null)
const loading = ref(false)
const getMessage = async () => {
    loading.value = true
    try {
        let pd = { BusinessDocumentsId: BusinessDocumentsId.value }
        if (Type.value == 2 && DetailsId.value) {
            pd.DetailsId = DetailsId.value
        }
        const res = await request.get('/api/CargoRate/SelectAllMessages', pd)
        info.value = res.Data
        nextTick(() => {
            ChatInfoRef.value?.scrollLast()
        })
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }

    console.log(loading.value)
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
    if (!message.value.trim()) return
    try {
        let pd = {
            InfoId: info.value[0].InfoId,
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
        if (Type.value == 2 && DetailsId.value) {
            pd.DetailsId = DetailsId.value
        }
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
                getMessage()
            })
        } else {
            const res = await request.post('/api/CargoRate/CreateMessages', pd)
            if (!res.Status) return ElMessage.error(res.Message)
            message.value = ''
            getMessage()
        }
    } catch (error) {

    }
}

const getUserList = async () => {
    const res = await request.get('/api/CargoRate/PriceComparison', { BusinessDocumentsId: BusinessDocumentsId.value })
    console.log(res)
    users.value = res.Data
}

const chatKey = ref(false)
const getMessageNew = () => {
    chatKey.value = !chatKey.value
    getMessage()
}
let messageCountListener = null
const DetailsId = ref('')
onMounted(() => {
    messageCountListener = window.$ipc.on("window/message", (_, msg) => {
        console.log(msg)
    });
    window.addEventListener('mousemove', updateCursor)
    document.addEventListener('click', closeMention)

    console.log(route.query.BusinessDocumentsId)
    if (route.query.BusinessDocumentsId) {
        BusinessDocumentsId.value = route.query.BusinessDocumentsId
    }



    if (route.query.Type) {
        Type.value = route.query.Type
        if (route.query.DetailId) {
            DetailsId.value = route.query.DetailId
        }
    }

    console.log(route.query, 'route.query')

    getMessage()
    getUserList()
})

onUnmounted(() => {
    window.removeEventListener('mousemove', updateCursor)
})

</script>

<style lang="scss" scoped>
.info-box {
    margin: 16px 0;
    height: calc(100% - 265px);
}

.main-body {
    background-color: #fff;
    padding: 8px;
    height: calc(100% - 20px);


    .fun-box {
        display: flex;
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 10px;
        height: 22px;

        .fun-box-item {
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-right: 10px;

            img {
                margin-right: 5px;
            }
        }
    }

    .chat-bxo {
        height: 160px;
        border: 1px solid #FD953E;
        border-radius: 24px;
        box-shadow: 0 2px 7px 0 rgba(253, 149, 62, 0.4);
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

.handleDialog-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    margin-top: 24px;
    border-bottom: 1px solid #DCDFE6;
    color: #323233;
}

.handleDialog-info {
    margin-top: 8px;
    font-size: 14px;
    line-height: 20px;
    color: #323233;

    :deep(.el-input__inner) {
        height: 24px;
        line-height: 24px;
    }

    :deep(.el-form-item__label) {
        font-size: 12px;
        color: #000;
    }
}

.view-content {
    max-width: none;
}
</style>