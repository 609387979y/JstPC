<template>
    <div class="search">
        <div class="search-item" :style="{ 'width': item.width || 'calc(25% - 8px)' }" v-for="(item, i) in searchList"
            :key="i">
            <div class="label" :style="{ 'width': item.labelWidth || '70px' }">{{ item.label }}</div>
            <div class="input">
                <template v-if="item.type == 'slot'">
                    <slot :name="item.slotName"></slot>
                </template>
                <el-input v-if="item.type == 'input'" :placeholder="item.placeholder || ''"
                    v-model="form[item.prop]"></el-input>

                <el-select v-model="form[item.prop]" v-if="item.type == 'select'" :placeholder="item.placeholder || ''">
                    <el-option v-for="(value, i) in item.data" :label="value[item.dataLabel]" :value="value[item.value]"
                        :key="i"></el-option>
                </el-select>

                <div class="data-picker-container" style="display: flex;align-items: center;"
                    v-if="item.type == 'daterange'">
                    <el-date-picker value-format="YYYY-MM-DD" v-model="form[item.prop]" type="daterange"
                        range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" size="small" />
                    <template v-if="item.btn">
                        <el-button size="small" style="margin-left: 5px" @click="onBtn('today')"
                            :class="currentBtn === 'today' ? 'active-btn' : ''">今</el-button>
                        <el-button size="small" @click="onBtn('yesterday')"
                            :class="currentBtn === 'yesterday' ? 'active-btn' : ''">昨
                        </el-button>
                        <el-button size="small" @click="onBtn('senven')"
                            :class="currentBtn === 'senven' ? 'active-btn' : ''">近7天
                        </el-button>
                        <el-button size="small" @click="onBtn('thirty')"
                            :class="currentBtn === 'thirty' ? 'active-btn' : ''">近30天
                        </el-button>
                    </template>
                </div>

                <el-select v-model="form.PolPortId" v-if="item.type == 'Pol'" placeholder="请选择起运港" filterable remote
                    :remote-method="getPortList">
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

                <el-select v-model="form.ShippingId" v-if="item.type == 'shipping'" placeholder="请选择船公司" filterable
                    remote :remote-method="getShipList">
                    <el-option v-for="(value, i) in shipList" :value="value.Id" :key="i">
                        <span class="select-lable">{{ value.label }}</span>
                        <span class="select-value">{{ value.CnShippingName }}</span>
                    </el-option>
                </el-select>
            </div>


        </div>

        <el-button size="small" @click="searchFun" class="search-btn">搜索</el-button>
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
    },
    form: {
        type: Object,
        default: () => { return {} }
    }
});
const currentBtn = ref("");
const getDate = (date, day) => {
    let currentDate = new Date(date).getTime() + 1000 * 36 * 2400 * day;
    var time = new Date(currentDate);
    let y = time.getFullYear();
    let m =
        time.getMonth() + 1 < 10
            ? "0" + (time.getMonth() + 1)
            : time.getMonth() + 1;
    let d = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    return `${y}-${m}-${d}`;
}
const onBtn = (val) => {
    currentBtn.value = val;
    let start = "";
    let end = getDate(new Date(), 0);
    switch (val) {
        case "today":
            start = getDate(new Date(), 0);
            break;
        case "yesterday":
            start = getDate(new Date(), -1);
            break;
        case "senven":
            start = getDate(new Date(), -7);
            break;
        case "thirty":
            start = getDate(new Date(), -30);
            break;
    }
    props.form.date = props.form.date || []
    props.form.date[0] = start
    props.form.date[1] = end
}

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
        props.form.DestPortId = "";
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
    props.form.DestPortId = item.Id;
    searchPort.DestPortId = item.Id;
    searchPort.destPortName = item.EnPortName;
    watchInput();
    destPortVisible.value = false;
}

function confirmQuery(Id, value) {
    destPortVisible.value = false;
    searchPort.DestPortId = Id;
    props.form.DestPortId = ''
    props.form.DestPortId = Id;
    searchPort.destPortName = value;
}

const emits = defineEmits(['searchFun', 'clearFun']);
// 搜索
const searchFun = () => {
    emits('searchFun', props.form)
}

const clearFun = () => {
    emits('clearFun', {})
}

const shipList = ref([])
async function getShipList(e,) {
    let keyword;
    e ? (keyword = e) : (keyword = "");
    let res = await request.get("/api/FRShipping/GetShippingList", {
        Page: 1,
        limit: -1,
        ShippingSimName: keyword,
    });
    let list = res.Rows;
    for (let item of list) {
        item.label = item.Code;
        item.CnShippingName = item.CnShippingName;
        item.value = item.Code;
    }
    shipList.value = list;
}


onMounted(() => {
    props.searchList.forEach(item => {
        console.log(item)
        if (item.type == 'Pol') {
            getPortList()
        }
        if (item.type == 'shipping') {
            getShipList()
        }
    })
})
</script>

<style lang="scss" scoped>
.search {
    display: flex;
    flex-wrap: wrap;
    background-color: #F7F8FA;
    padding: 8px;

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

.search-btn {
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

.data-picker-container {

    :deep(.el-button + .el-button) {
        margin-left: 5px;
    }

    :deep(.el-button) {
        color: #dcdee0;
        border: 1px solid #dcdee0;
        background: #f8f8f8;
        height: 24px;
        line-height: 24px;
        padding: 0 5px;
        min-height: auto;
    }

    :deep(.el-range-editor.el-input__wrapper) {
        width: 100% !important;
    }

    .active-btn {
        color: #1f8efa;
        border-color: #1f8efa;
    }

    :deep(.el-input__inner) {
        width: 100%;
    }

    :deep(.el-button--mini) {
        padding: 7px 5px;
    }
}

.select-lable {
    float: left;
}

.select-value {
    float: right;
    color: #8492a6;
    font-size: 13px;
}
</style>