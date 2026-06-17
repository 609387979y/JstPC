<template>
    <JstCardLayout style="min-height: 177px;">
        <template #title>货物跟踪查询</template>

        <el-space :size="6">
            <div>
                <el-select filterable v-model="state.search.carrierCode" placeholder="船公司">
                    <el-option
                        v-for="item in shipping.list"
                        :label="`${item.ShippingSimName}(${item.Code})`"
                        :value="item.Code"
                    ></el-option>
                </el-select>
            </div>
            <div>
                <el-select v-model="state.search.type">
                    <el-option label="提单号" value="billNo"></el-option>
                    <el-option label="箱号" value="containerNo"></el-option>
                </el-select>
            </div>
            <div>
                <el-input
                    style="width: 266px;"
                    v-model="state.search.searchValue"
                    :suffix-icon="Search"
                    placeholder="请输入相应的单号进行搜索"
                    clearable
                ></el-input>
            </div>
        </el-space>
        <el-button @click="search" style="margin-top: 10px;" type="primary">订阅</el-button>
    </JstCardLayout>
</template>

<script>
import { defineComponent,ref,reactive,watchEffect,onMounted  } from "vue"
import {utils} from "justom-share"
import request from "@/public/request"
import { useRouter } from "vue-router"
export default defineComponent({
    components: {

    },
    setup() {
        const router =useRouter()

        const state = reactive({
            search: {
                carrierCode: "",
                // 单号
                searchValue: "",
                type: "billNo"
            }
        })


        /**
         * 船公司相关
         */
        function useShipping() {
            const list = ref([])
            async function getAllShipping() {
                let res = await request.get("/api/FreightBaseShipping/GetList", {
                    page: -1
                })
                list.value = res.Rows
            }

            // 通过提单号获得 船公司
            const getShippingByBillNo = utils.debounce(async () => {
                let res = await request.get("/api/FreightBaseShipping/GetShippingCodeByBillNo", {
                    billNo: state.search.searchValue
                })
                if (res.Status) {
                    state.search.carrierCode = res.Data;
                }
            })

            watchEffect(() => {
                if (state.search.searchValue == "" || state.search.type == "containerNo") {
                    return;
                }
                getShippingByBillNo()
            })

            onMounted(async () => {
                await getAllShipping()
            })

            return reactive({
                list
            })
        }
        const shipping = useShipping()


        function search(){
            router.push({
                path:"/cargoTracking/trackOcean",
                query:{
                    ...state.search
                }
            })
        }

        return {
            shipping,
            state,
            search
        }
    }
})
</script>

<style lang='scss' scoped>
</style>