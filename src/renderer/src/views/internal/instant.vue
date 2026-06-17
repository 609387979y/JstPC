<template>
    <div class="header-box">
        <div class="title">使用即时询价进行询盘</div>
        <!-- 搜索栏 -->
        <FreightSearchCompontent :isInquiry="true" ref="freightSearchRef" @search="searchBtn" :search="search"
            :isFreightLayout="true">
        </FreightSearchCompontent>
    </div>

    <div class="recommendation">
        <div class="recommendation-title">
            推荐港口
        </div>

        <AppDestPortContent @selectPort="selectDesPort" :isHistory="false" :type="1" :hideTitle="true"
            class="recommended-dest-port" :isFreight="true" v-loading="destLoading">
        </AppDestPortContent>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import AppDestPortContent from "@/components/AppDestPortContentDash.vue";
import FreightSearchCompontent from "@/views/internal/components/FreightSearchComponents.vue";
import request from "@/public/request";
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const searchBtn = async () => {
    const now = new Date();
    const future = new Date(now);
    future.setDate(future.getDate() + 14);
    if (!search.value.PolPortId || !search.value.DestPortId) {
        ElMessage.warning('请选择起运港和目的港')
        return
    }
    if (!search.value.Box || !search.value.BoxAmount) {
        ElMessage.warning('请选择箱型箱量')
        return
    }
    let pd = {
        PolEnPortName: search.value.PolPortName,
        DestEnPortName: search.value.DestPortName,
        PolPortId: search.value.PolPortId,
        DestPortId: search.value.DestPortId,
        PolCnPortName: search.value.CnPolPortName,
        DestCnPortName: search.value.CnDestPortName,
        StartTime: search.value.StartTime ? search.StartTime : formatDate(now),
        EndTime: search.value.EndTime ? search.EndTime : formatDate(future),
        Box: search.value.Box,
        BoxAmount: search.value.BoxAmount,
        Type: 2,
        RecordType: 2,
        Id: 0
    }
    // search.Type = 2
    // search.RecordType = 2
    // search.Id = 0
    const res = await request.post("/api/CargoRate/CreateBusinessDocuments", pd)
    if (!res.Status) {
        ElMessage.error(res.Message)
        return
    }
    ElMessage.success('成功')

    getChatMenu()
}

const router = useRouter();
const store = useStore()
const getChatMenu = async () => {
    let arr = []
    const res = await request.get('/api/CargoRate/GroupByBusinessDocuments')
    let oldArr = []


    if (store.state.menu.newList.length) {
        store.state.menu.newList[store.state.menu.newList.length - 1].info.forEach(item => {
            oldArr.push(item.url)
        })
    }
    let path, name, BusinessDocumentsId = ''
    res.Data[res.Data.length - 1].info.forEach(item => {
        if (oldArr.indexOf("/internal/ChatWin" + item.Id) == -1) {
            path = "/internal/ChatWin" + item.Id
            name = 'ChatWin' + item.Id
            BusinessDocumentsId = item.Id
        }
    })
    router.addRoute('internal', {
        name: name,
        path: path,
        component: () => import("@/views/internal/ChatWin.vue"),
        meta: {
            title: "聊天",
        },
    })
    res.Data.forEach((value, i) => {
        value.info.forEach(item => {
            arr[i] = arr[i] || {
                Time: value.Time.substring(0, 10),
                info: []
            }
            arr[i].info.push({
                name: item.PolEnPortName + '-' + item.DestEnPortName,
                url: "/internal/ChatWin" + item.Id,
                query: { BusinessDocumentsId: item.Id },
                icon: item.Type == 1 ? 'menu7.svg' : 'menu8.svg',
                iconActive: item.Type == 1 ? 'menu7Active.svg' : 'menu8Active.svg'
            })
        })

    })

    console.log(arr)

    store.commit("menu/setNewList", arr);
    router.push({ path: path, query: { BusinessDocumentsId: BusinessDocumentsId } })
}

const destLoading = ref(false)
const selectDesPort = (Id, item) => {
    console.log(item)
    search.value.DestPortName = item.EnPortName;
    search.value.DestPortId = Id;
    search.value.CnDestPortName = item.CnPortName
}

const search = ref({})

const Route = useRoute();

const freightSearchRef = ref(null)

onMounted(() => {
    if (Route.query.search) {
        search.value = JSON.parse(Route.query.search)
        setTimeout(() => {
            freightSearchRef.value.setDestPort()
            searchBtn()
        }, 500);
    }
})
</script>

<style lang="scss" scoped>
.title {
    font-size: 24px;
    line-height: 32px;
    font-weight: 600;
    text-align: center;
    margin: 0 0 12px;
}

.header-box {
    padding-bottom: 12px;
    padding-top: 12px;
    margin-top: 8px;
    border: 1px solid #F5F5F5;
    background-color: #fff;
}

.recommendation {
    margin-top: 12px;
    padding: 8px;
    border: 1px solid #F5F5F5;
    background-color: #fff;

    .recommendation-title {
        padding-top: 16px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
        margin-bottom: 12px;
    }
}
</style>