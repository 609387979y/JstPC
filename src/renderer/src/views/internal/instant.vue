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

    <el-dialog title="即时询价" v-model="discountDialog" custom-class="discount-dialog">
        <el-form :model="discountForm" ref="discountRef" label-width="120px">
            <el-form-item label="起运港">
                <el-input size="small" v-model="discountForm.PolEnPortName" disabled></el-input>
            </el-form-item>
            <el-form-item label="目的港">
                <el-input size="small" v-model="discountForm.DestEnPortName" disabled></el-input>
            </el-form-item>
            <el-form-item label="开始有效期">
                <el-input size="small" v-model="discountForm.StartTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="结束有效期">
                <el-input size="small" v-model="discountForm.EndTime" disabled></el-input>
            </el-form-item>

            <div class="form-flex" style="display: flex;">
                <el-form-item label="箱型箱量" prop="Box" style="margin-right: 12px;">
                    <el-select size="small" v-model="discountForm.Box" placeholder="选择箱型" clearable disabled>
                        <el-option label="20GP" value="20GP"></el-option>
                        <el-option label="40GP" value="40GP"></el-option>
                        <el-option label="40HQ" value="40HQ"></el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label-width="0" prop="BoxAmount">
                    <el-input size="small" v-model="discountForm.BoxAmount" placeholder="输入箱量" disabled></el-input>
                </el-form-item>
            </div>
            <el-form-item label="备注" prop="SpecialRemark">
                <el-input type="textarea" v-model="discountForm.SpecialRemark" placeholder="请输入备注">
                </el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <div style="text-align: center;">
                <el-button @click="discountDialog = false">取消</el-button>
                <el-button :loading="btnLoading" type="primary" @click="sureFun" class="contact-price-buttom">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
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


const discountDialog = ref(false)
const discountForm = ref({})

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
    if (!search.value.StartTime || !search.value.EndTime) {
        ElMessage.warning('请选开航日期(ETD)')
        return
    }
    console.log(search.value)
    let pd = {
        PolEnPortName: search.value.PolPortName,
        DestEnPortName: search.value.DestPortName,
        PolPortId: search.value.PolPortId,
        DestPortId: search.value.DestPortId,
        PolCnPortName: search.value.CnPolPortName,
        DestCnPortName: search.value.CnDestPortName,
        StartTime: search.value.StartTime ? search.value.StartTime : formatDate(now),
        EndTime: search.value.EndTime ? search.value.EndTime : formatDate(future),
        Box: search.value.Box,
        BoxAmount: search.value.BoxAmount,
        Type: 2,
        RecordType: 2,
        Id: 0
    }

    discountForm.value = pd

    discountDialog.value = true
    return
    // search.Type = 2
    // search.RecordType = 2
    // search.Id = 0

}

const btnLoading = ref(false)
const sureFun = async () => {
    btnLoading.value = true
    try {
        const res = await request.post("/api/CargoRate/CreateBusinessDocuments", discountForm.value)
        if (!res.Status) {
            ElMessage.error(res.Message)
            return
        }
        ElMessage.success('成功')
        discountDialog.value = false
        btnLoading.value = false

        getChatMenu(res.Data)
    } catch (error) {
        btnLoading.value = false
    }
}

const router = useRouter();
const store = useStore()
const getChatMenu = async (Id) => {
    let arr = []
    const res = await request.get('/api/CargoRate/GroupByBusinessDocuments')

    let path, name, BusinessDocumentsId = ''
    path = "/internal/ChatWin" + Id
    name = 'ChatWin' + Id
    BusinessDocumentsId = Id

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

const search = ref({
    PolPortId: 675,
})

const Route = useRoute();

const freightSearchRef = ref(null)

onMounted(() => {
    const now = new Date();
    const future = new Date(now);
    future.setDate(future.getDate() + 14);
    search.value.StartTime = formatDate(now)
    search.value.EndTime = formatDate(future)
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
    background-color: #fff;
}

.recommendation {
    padding: 8px;
    padding-top: 0;
    background-color: #fff;

    .recommendation-title {
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
        margin-bottom: 12px;
    }
}

.form-flex {
    :deep(.el-form-item) {
        flex: 1;
    }
}
</style>