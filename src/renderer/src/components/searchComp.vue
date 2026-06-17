<template>
    <div class="search">
        <div class="search-item" :style="{ 'width': item.width || 'calc(25% - 8px)' }" v-for="(item, i) in searchList"
            :key="i">
            <div class="label" :style="{ 'width': item.labelWidth || '70px' }">{{ item.label }}</div>
            <div class="input">
                <el-input v-if="item.type == 'input'" :placeholder="item.placeholder || ''"
                    v-model="form[item.prop]"></el-input>

                <el-select v-model="form[item.prop]" v-if="item.type == 'select'" :placeholder="item.placeholder || ''">
                    <el-option v-for="(value, i) in item.data" :label="value[item.dataLabel]" :value="value[item.value]"
                        :key="i"></el-option>
                </el-select>

                <el-date-picker value-format="YYYY-MM-DD" v-if="item.type == 'daterange'" v-model="form[item.prop]"
                    type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" size="small" />

                <el-select v-model="form.PolPortId" v-if="item.type == 'Pol'" placeholder="请选择起运港">
                    <el-option v-for="(value, i) in portList"
                        :label="`${value.EnPortName},${value.Country}(${value.CnPortName})`" :value="value.Id"
                        :key="i"></el-option>
                </el-select>

                <el-popover v-if="item.type == 'destPort'" width="600px" trigger="click"
                    v-model:visible="destPortVisible" class="el-popover">
                    <template #reference>
                        <el-input class="dest-port-select" size="mini" v-model="searchPort.destPortName" clearable
                            placeholder="请选择目的港" @input="watchInput"></el-input>
                    </template>
                    <div class="inputQuery" v-if="searchPort.destPortName?.length">
                        <div class="inputQuery-header">
                            <div>支持中英文输入</div>
                            <div>航线</div>
                        </div>
                        <el-scrollbar max-height="330px">
                            <div class="inputQuery-container" v-for="(items1, index) in inputQueryList" :key="index">
                                <div class="container-items
                                " v-for="(items2, index2) in items1.gangkou" :key="index2"
                                    @click="confirmQuery(items2.Id, items2.EnPortName)">
                                    <div>
                                        {{ items2.CnPortName }}&nbsp;{{ items2.EnPortName }}&nbsp;{{
                                            items2.EnChauName
                                        }}
                                    </div>
                                    <div>{{ items1.LineName }}</div>
                                </div>
                            </div>
                            <div v-if="!inputQueryList.length" style="padding: 5px 10px">
                                暂无港口
                            </div>
                        </el-scrollbar>
                    </div>
                    <!-- style="padding: 14px 12px" -->
                    <AppDestPortContent v-else @selectPort="selectDesPort" :isHistory="false" :type="1">
                    </AppDestPortContent>

                    <!-- <AppDestport
                        :visible="state.destPortVisible"
                        :type="1"
                        :btnType="1"
                        @selectPort="selectDesPort"
                      ></AppDestport> -->
                </el-popover>
            </div>


        </div>

        <el-button size="small" @click="searchFun">搜索</el-button>
        <span class="clear" @click="clearFun">清空内容</span>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import request from "@/public/request";
import AppDestPortContent from "@/components/AppDestPortContentDashTwo.vue";

const props = defineProps({
    searchList: {
        type: Array,
        default: () => []
    }
});

const form = ref({})

//获取起运港
const portList = ref([])
const getPortList = async (e) => {
    let keyword = e ?? "";
    let res = await request.get("/api/FRPort/GetFRPortList", {
        Page: 1,
        limit: -1,
        PortName: keyword,
        IsPol: true,
    });
    let list = res.Rows;
    for (let item of list) {
        item.label = item.EnPortName;
        item.value = item.Id;
    }
    portList.value = list;
}

// 目的港
const destPortVisible = ref(false)
const searchPort = reactive({})

//监听目的港查询输入
const watchInput = () => {
    if (searchPort.destPortName == "") {
        searchPort.DestPortId = "";
        searchPort.DestPortName = "";
        form.value.DestPortId = "";
        destPortVisible.value = false;
        // return (state.destPortVisible = true);
        return;
    }
    destPortVisible.value = true;
    getEndPortQuery();
}

//获取目的港模糊查询数据
const inputQueryList = ref([]);
const getEndPortQuery = async () => {
    const res = await request.get("/api/FRPortalPort/GetPortToList", {
        EnPortName: searchPort.destPortName,
    });
    inputQueryList.value = res.Data;
}

//选择目的港
function selectDesPort(id, item) {
    form.value.DestPortId = item.Id;
    searchPort.DestPortId = item.Id;
    searchPort.destPortName = item.EnPortName;
    watchInput();
    destPortVisible.value = false;
}

function confirmQuery(Id, value) {
    destPortVisible.value = false;
    searchPort.DestPortId = Id;
    form.value.DestPortId = ''
    form.value.DestPortId = Id;
    searchPort.destPortName = value;
}

const emits = defineEmits(['searchFun', 'clearFun']);
// 搜索
const searchFun = () => {
    emits('searchFun', form.value)
}

const clearFun = () => {
    form.value = {}
    emits('searchFun', form.value)
}

onMounted(() => {
    props.searchList.forEach(item => {
        console.log(item)
        if (item.type == 'Pol') {
            getPortList()
        }
    })
})
</script>

<style lang="scss" scoped>
.search {
    display: flex;
    flex-wrap: wrap;

    .search-item {
        display: flex;
        align-items: center;
        margin-right: 8px;
        margin-top: 4px;

        :deep(.el-input__inner) {
            height: 24px;
            line-height: 24px;
        }

        .label {
            white-space: nowrap;
        }


        .input {
            flex: 1;

            :deep(.el-date-editor) {
                width: auto;
            }
        }
    }
}

.inputQuery {
    overflow: auto;
    padding: 0;

    .inputQuery-header {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        font-weight: bold;
        background: #fd953e;
        color: white;
        padding: 6px 10px;
    }

    .inputQuery-header-freight {
        background-color: #fd953e;
    }


}

.container-items {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
    cursor: pointer;
    padding: 0 10px;
}

.container-items:hover {
    background-color: #fcf1e7;
}

.container-items-freight {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
    cursor: pointer;
    padding: 0 10px;
}

.container-items-freight:hover {
    background: #fcf1e7;
}

:deep(.el-button) {
    padding: 0 17px;
    min-height: 24px;
    line-height: 24px;
    margin-top: 4px;
    background-color: #FD953E;
    color: #fff;
    border: none;

    &:hover {
        background-color: #FD953E;
        color: #fff;
    }
}

.clear {
    color: #FD953E;
    line-height: 24px;
    margin-left: 12px;
    display: inline-block;
    height: 24px;
    margin-top: 4px;
    cursor: pointer;
}
</style>