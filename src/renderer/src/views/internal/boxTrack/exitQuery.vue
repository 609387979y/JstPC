<template>
    <div class="exit-container">
        <div class="exit-header">
            <div class="header-item bold-border">
                <el-select class="m-2" popper-class="shipList" v-model="froms.addQuery.portCode" placeholder="请选择港口"
                    size="large" filterable style="height:100%;width:100%">
                    <el-option v-for="(item, index) in froms.state.portList" :key="index" :label="item.label"
                        :value="item.value" />
                </el-select>
            </div>
            <div class="header-item bold-border">
                <!-- <el-select class="m-2" v-model="froms.addQuery.containerNo" placeholder="单号类型" size="large" filterable
                    style="height:100%;width:100%">
                    <el-option v-for="(item, index) in froms.state.dhType" :key="index" :label="item.value"
                        :value="item.value" />
                </el-select> -->
                <div class="item2" style="width:100%">
                    <el-input placeholder="请输入箱号" v-model="froms.addQuery.containerNo" clearable
                        @input="froms.getCarrierCode"></el-input>
                </div>
            </div>
            <div class="header-item bold-border">
                <div class="item1">
                    <el-input placeholder="请输入提单号" v-model="froms.addQuery.BillNo" clearable
                        @input="froms.getCarrierCode" @change="froms.reLoadShipList"></el-input>
                </div>
                <div class="item2">
                    <el-select class="m-2" popper-class="shipList" v-model="froms.addQuery.carrierCode"
                        placeholder="请选择船公司" size="large" filterable clearable style="height:100%;width:100%">
                        <el-option v-for="(item, index) in froms.state.shipComapanyList" :key="index" :label="item.Code"
                            :value="item.Code">
                            <div class="optionItem"><span>{{ item.CnShippingName }}</span>
                                <span>{{ item.Code }}</span>
                            </div>
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="header-item" @click="froms.addTrack">订阅跟踪</div>
            <div class="header-item" @click="froms.batchTrack">表格导入</div>
        </div>
        <div class="exit-body">
            <div class="body-header">
                <div>
                    <div class="body-header-item" style="margin-right:8px">
                        共&nbsp;<span>{{ tables.state.tableTotal }}</span>&nbsp;条跟踪</div>
                    <div class="body-btn" @click="tables.tsSet">推送设置</div>
                    <div class="body-btn body-btn2" @click="tables.delTableList">删除</div>
                </div>
                <div>
                    <div class="body-select">
                        <el-select @change="tables.initSubmit" class="m-2" placeholder="提单类型" size="large"
                            style="height:100%;width:100%" v-model="tables.search.Type">
                            <el-option v-for="item in tables.state.typeList" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="body-input demo-input-suffix">
                        <el-input :placeholder="tables.inputTip" v-model="tables.search.No" clearable>
                            <template #suffix>
                                <el-icon class="el-input__icon">
                                    <Search @click="tables.initSubmit" style="cursor: pointer;" />
                                </el-icon>
                            </template>
                        </el-input>
                    </div>
                    <div>
                        <el-button type="primary" size="small"
                            style="font-size:12px;min-height:25px;height:25px;padding:0 8px;margin-left:8px"
                            @click="tables.reload">
                            <el-icon class="el-icon--left">
                                <Refresh />
                            </el-icon>刷新
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="body-container">
                <tablePage @getList="tables.getList" :total="tables.state.tableTotal"
                    :ref="(e: any) => { return tables.state.tableRef = e }">
                    <template #table>
                        <el-table v-loading="tables.state.tableLoading" :max-height="tables.state.tableMaxHeight"
                            @selection-change="tables.changeTable" stripe :data="tables.state.tableList" border
                            style="width: 100%" size="mini">
                            <el-table-column type="selection" width="35" />
                            <!-- <el-table-column prop="date" label="订阅状态" width="65" align="center">
                                <template #default="{ row }">
                                    <div v-if="row.SubscribeStatus == 1" class="suatusIcon" style="color:#C8C9CC">
                                        <Bell style="width: 10px; height: 10px; color:#C8C9CC;margin-right: 2px;" />已订阅
                                    </div>
                                    <div v-if="row.SubscribeStatus == 0" class="suatusIcon" style="color:#409EFF;">
                                        <Bell style="width: 10px; height: 10px; color:#409EFF;margin-right: 2px;" />未订阅
                                    </div>
                                </template>
                            </el-table-column> -->
                            <el-table-column prop="name" label="当前状态" min-width="80">
                                <template #default="{ row }">
                                    <div v-if="row.descriptionCn" class="suatusIcon">
                                        <div
                                            :class="row.descriptionCn != '海关退关' && row.descriptionCn != '码头退关' ? 'successStatus' : 'errorStatus'">
                                        </div>{{ row.descriptionCn }}
                                    </div>
                                    <div v-else-if="row.errorMsg" style="color:#909399;">
                                        <el-popover placement="right" :width="300" trigger="hover"
                                            :content="row.errorMsg">
                                            <template #reference>
                                                <div style="display:flex;align-items:center">暂无数据&nbsp;
                                                    <Warning style="width:15px;height:15px;color:#409EFF" />
                                                </div>
                                            </template>
                                        </el-popover>
                                    </div>
                                    <div v-else>--</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="billNo" label="提单号" min-width="160" show-overflow-tooltip>
                                <template #default="{ row }">
                                    <div style="
                                        color:#409EFF;cursor: pointer;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                                        @click="tables.openDetali(row, 'billNo')">
                                        {{ row.billNo }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="containerNo" label="箱号" min-width="160" show-overflow-tooltip>
                                <template #default="{ row }">
                                    <div style="
                                        color:#409EFF;cursor: pointer;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                                        @click="tables.openDetali(row, 'containerNo')">
                                        {{ row.containerNo }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="carrierCode" label="船公司" min-width="80">
                                <template #default="{ row }">
                                    <div style="color:#409EFF">{{ row.carrierCode }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="装货港" min-width="80">
                                <template #default="{ row }">
                                    {{ row.polName ? row.polName : "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="podName" label="卸货港" min-width="160">
                                <template #default="{ row }">
                                    {{ row.podName ? row.podName : "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="船名航次" min-width="170">
                                <template #default="{ row }">
                                    <div v-if="row.vessel || row.voyage">{{ row.vessel }}/{{ row.voyage }}</div>
                                    <div v-else>--</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" label="箱型箱量" min-width="100">
                                <template #default="{ row }">
                                    <div v-if="row.csize || row.ctype">{{ row.csize }}
                                        {{ row.ctype }}</div>
                                    <div v-else>--</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="terminalName" label="码头" min-width="80" :filters="tables.filterList"
                                :filter-method="tables.filterHandler">
                                <template #default="{ row }">
                                    {{ row.terminalName ? row.terminalName : "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="eta" label="预计抵港" min-width="115">
                                <template #default="{ row }">
                                    {{ row.eta ? row.eta.substring(0, 16) : "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="etd" label="预计离港" min-width="115">
                                <template #default="{ row }">
                                    {{ row.etd ? row.etd.substring(0, 16) : "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="ata" label="实际抵港" min-width="115">
                                <template #default="{ row }">
                                    {{ row.ata ? row.ata.substring(0, 16) : "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="atd" label="实际离港" min-width="115">
                                <template #default="{ row }">
                                    {{ row.atd ? row.atd.substring(0, 16) : "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="openDate" label="进箱开始" min-width="115">
                                <template #default="{ row }">
                                    {{ row.openDate ? row.openDate.substring(0, 16) : "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="closeDate" label="进箱截止" min-width="115">
                                <template #default="{ row }">
                                    {{ row.closeDate ? row.closeDate.substring(0, 16) : "--" }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </tablePage>
            </div>
        </div>
        <!-- 订阅跟踪 -->
        <addTrackDialog :ref="(e: any) => { froms.state.dialogAddRef = e }" @initSubmit="tables.initSubmit"
            @reset="froms.resetQuery" @rulesTs="tables.rulesTs">
        </addTrackDialog>
        <!-- 批量跟踪 -->
        <batchAddDialog :ref="(e: any) => { froms.state.dialogBatchRef = e }" @submit="froms.batchAdd">
        </batchAddDialog>
        <!-- 关注公众号 -->
        <div class="tsDialog">
            <el-dialog v-model="tables.state.tsVisible" title="推送设置" width="500px">
                <div class="ts-container">
                    <img src="@/assets/boxTrack/wxCode.jpg" alt=""
                        :ref="(e: any) => { return tables.state.codeRef = e }">
                    <div style="margin-top:16px;font-weight: 500;font-size: 14px;">请使用微信扫码关注及时通服务平台二维码</div>
                    <div style="margin-top:24px">提示：1.您需要关注《及时通服务平台》公众号才可接收提醒消息</div>
                    <div style="margin-top:7px;margin-left: -48px;">2.保存后，该设置适用于录入的所有提单号</div>
                </div>
            </el-dialog>
        </div>
        <!-- 推送设置 -->
        <div class="tsDialog2">
            <el-dialog v-model="tables.state.tsVisible2" title="推送设置" width="625px">
                <div class="checkbox-container">
                    <div>船舶推送</div>
                    <el-checkbox-group v-model="tables.state.checkList">
                        <el-row>
                            <el-col :span="6">
                                <el-checkbox label="TSDP">开截航</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox label="pier">码头变化</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox label="DLPT">船舶离泊推送</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox label="POCA">船舶停靠推送</el-checkbox>
                            </el-col>
                        </el-row>
                    </el-checkbox-group>
                </div>
                <div class="checkbox-container">
                    <div>箱货推送</div>
                    <el-checkbox-group v-model="tables.state.checkList">
                        <el-row>
                            <el-col :span="6">
                                <el-checkbox label="Prerecorded">预录入推送</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox label="TSGT">进场推送</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox label="PASS">海关放行推送</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox label="TMPS">码头放行推送</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox label="VGM">VGM接收推送</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox label="eta">目的港预计到港提醒</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox label="ata">目的港实际到港提醒</el-checkbox>
                            </el-col>
                        </el-row>
                    </el-checkbox-group>
                </div>
                <div class="checkbox-container">
                    <div>箱货预警：（为了更好保障业务，默认开启预警推送，无法关闭。）</div>
                    <el-checkbox-group v-model="tables.state.checkList">
                        <el-row>
                            <el-col :span="6">
                                <el-checkbox label="CUIP" disabled>箱货查验预警</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox label="offLoad" disabled>甩箱预警</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox label="SUOT" disabled>进场数据异常预警</el-checkbox>
                            </el-col>
                        </el-row>
                    </el-checkbox-group>
                </div>
                <div class="ts-tooltip">
                    <div>提示：1.您需要关注《及时通服务平台》公众号才可接收提醒消息</div>
                    <div>&emsp;&emsp;&emsp;2.保存后，该设置适用于录入的所有提单号</div>
                </div>
                <div class="footer-btn">
                    <el-button type="primary" @click="tables.updateTS" :loading="tables.state.checkLoading">确认
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, nextTick, onMounted } from "vue";
import { Search, Bell, Refresh, Warning } from '@element-plus/icons';
import tablePage from './components/tablePage.vue';
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from 'element-plus';
import addTrackDialog from "./components/addTrackDialog.vue";
import batchAddDialog from "./components/batchAddDialog.vue";
import request from "@/public/request";
import { computed } from "@vue/reactivity";
import { download } from './components/download.js'
function useFroms() {
    let state = reactive({
        /* 添加跟踪的ref */
        dialogAddRef: {} as InstanceType<typeof addTrackDialog>,
        /* 批量导入模板的ref */
        dialogBatchRef: {} as InstanceType<typeof batchAddDialog>,
        portList: [{ label: 'NINGBO(宁波港)', value: 'NINGBO' }] as Array<Record<string, string>>,
        shipComapanyList: [] as Array<Record<string, string>>,
        dhType: [{ value: '提单号' }] as Array<Record<string, string>>,
    })
    let addQuery = reactive({
        /* 订阅状态 */
        Status: 1,
        /* 提单号 */
        BillNo: '',
        /* 箱号 */
        containerNo: '',
        /* 港口 */
        portCode: 'NINGBO',
        port: '宁波',
        /* 船公司 */
        carrierCode: ''
    })
    /* 单个跟踪 */
    async function addTrack() {
        if (!addQuery.BillNo && !addQuery.containerNo) return ElMessage.warning('请输入提单号或箱号');
        if (!addQuery.carrierCode) return ElMessage.warning('请选择船公司');
        let params = [{ BillNo: addQuery.BillNo, carrierCode: addQuery.carrierCode, polName: addQuery.port, polNameEn: addQuery.portCode, containerNo: addQuery.containerNo }];
        state.dialogAddRef.handleOpen(params);
    }
    /* 打开批量导入对话框 */
    function batchTrack() {
        state.dialogBatchRef.handleOpen();
    }
    /* 批量跟踪 */
    function batchAdd(data: any) {
        let params = data;

        state.dialogAddRef.handleOpen(params);
    }
    /* 获取港口列表 */
    /* async function getPort() {
        const result = await request.get('/api/CargoEDIPort/GetPortList', { page: 1, limit: 9999 });
        state.portList = result.Rows;
    } */
    /* 获取船公司列表 */
    async function getShipCompany() {
        const result = await request.get('/api/FRShipping/GetShippingList', { page: 1, limit: 9999 });
        state.shipComapanyList = result.Rows;

    }
    async function getCarrierCode() {
        console.log(addQuery.BillNo);
        if (addQuery.BillNo == '') return
        const result = await request.get('/api/CT_TrackOcean/GetShippingCompany', {
            bill: addQuery.BillNo
        })
        if (result.length == 0) {
            getShipCompany()
        }
        if (result.length == 1) {
            addQuery.carrierCode = result[0].Code
        }
        if (result.length > 1) {
            let newList: any = []
            state.shipComapanyList.forEach((t) => {
                result.forEach((s: any) => {
                    if (t.Code == s.Code) {
                        newList.push(t)
                    }
                })
            })
            state.shipComapanyList = newList
        }

    }
    function reLoadShipList() {
        if (addQuery.BillNo == '') {
            getShipCompany()
        }
    }
    /* 清除跟踪数据 */
    function resetQuery() {
        addQuery.BillNo = '';
        addQuery.carrierCode = '';
        addQuery.containerNo = '';
    }
    onMounted(() => {
        getShipCompany()
    })
    return reactive({
        state,
        addQuery,
        addTrack,
        batchTrack,
        resetQuery,
        batchAdd,
        getCarrierCode,
        reLoadShipList
    })
}

function usetables() {
    const router = useRouter();
    let search = reactive({
        No: '',
        Type: 0
    })
    let state = reactive({
        /* 表格的ref */
        tableRef: {} as any,
        /* 表格loading */
        tableLoading: true as boolean,
        /**  表格最大高度 */
        tableMaxHeight: document.body.clientHeight - 330,
        /** 表格数据 */
        tableList: [] as any,
        /* 数据总数（total） */
        tableTotal: 0,
        /**  当前选中的数据 */
        currentTableList: [] as Array<Record<string, string>>,
        /* 关注微信公众号对话框 */
        tsVisible: false,
        /* 推送设置对话框 */
        tsVisible2: false,
        /* 推送多选的数据 */
        checkList: ['CUIP', 'offLoad', 'SUOT'],
        /* 放置二维码的ref */
        codeRef: {} as HTMLImageElement,
        checkLoading: false,
        reloadLoading: false,
        typeList: [{ label: '全部', value: 0 }, { label: '按箱号显示', value: 2 }, { label: '按提单显示', value: 1 }]
    })
    const inputTip = computed(() => {
        let tip: any = {
            0: '请输入提单号或箱号查询',
            2: '请输入箱号查询',
            1: '请输入提单号查询'
        }
        return tip[search.Type]
    })
    async function reload() {
        state.reloadLoading = true;
        await initSubmit();
        ElMessage.success('刷新成功')
        state.reloadLoading = false;
    }
    /* 获取表格数据 */
    function getList() {
        state.tableLoading = true;
        nextTick(async () => {
            let params = {
                page: state.tableRef.query.page,
                limit: state.tableRef.query.limit,
                ...search
            }
            params.No = params.No ? params.No.trim() : ''
            const result = await request.get('/api/CT_TrackOcean/GetList', params);
            /* await request.get('/api/CT_TrackOcean/getTest'); */
            state.tableList = result.Rows;
            state.tableTotal = result.Total;
            state.tableLoading = false;
        })
    }
    /* 初始化查询 */
    function initSubmit() {
        nextTick(() => {
            state.tableRef.query.page = 1;
            getList();

        })
    }
    /** 打开箱货跟踪详情 */
    function openDetali(row: Record<string, string>, type: string) {
        if (type == 'billNo') {
            router.push({
                path: '/internal/exitQueryDetailInfo',
                query: {
                    Id: row.Id,
                    billNo: row.billNo,
                    carrierCode: row.carrierCode,
                    vessel: row.vessel,
                    voyage: row.voyage,
                    errorMsg: row.errorMsg,
                    eta: row.eta,
                    etd: row.etd,
                    ata: row.ata,
                    atd: row.atd,
                    openDate: row.openDate,
                    closeDate: row.closeDate
                }
            })
        }
        if (type == 'containerNo') {
            router.push({
                path: '/internal/exitQueryDetailInfo',
                query: {
                    Id: row.Id,
                    containerNo: row.containerNo,
                    carrierCode: row.carrierCode,
                    vessel: row.vessel,
                    voyage: row.voyage,
                    errorMsg: row.errorMsg,
                    eta: row.eta,
                    etd: row.etd,
                    ata: row.ata,
                    atd: row.atd,
                    openDate: row.openDate,
                    closeDate: row.closeDate
                }
            })
        }
    }
    /** 删除选中的列表 */
    async function delTableList() {
        if (state.currentTableList.length == 0) return ElMessage.warning('请至少选择一项数据！')
        const delStatus = await ElMessageBox.confirm(
            '是否删除选中的数据?',
            '提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            })
        if (!delStatus) return;
        let ids: Array<string> = [];
        state.currentTableList.forEach((t) => {
            ids.push(t.Id);
        })
        const result = await request.post('/api/CT_TrackOcean/UnSubscribe', { idList: ids })
        if (!result.Status) return ElMessage.error(result.Message);
        ElMessage.success(result.Message);
        initSubmit();
    }
    /** 选中数据时保存数据 */
    function changeTable(row: Array<Record<string, string>>) {
        state.currentTableList = row;
    }
    /* 码头筛选功能 */
    const filterHandler = (
        value: string,
        row: any,
        column: any
    ) => {
        const property = column['property'];
        return row[property] === value
    }
    /* 根据数据进行筛选 */
    const filterList = computed(() => {
        if (!state.tableList) return;
        let list = [] as any;
        state.tableList.forEach((t: any) => {
            if (t.terminalName != null) {
                list.push({
                    text: t.terminalName,
                    value: t.terminalName
                })
            }
        })
        function qc(tempArr: any) {
            for (let i = 0; i < tempArr.length; i++) {
                for (let j = i + 1; j < tempArr.length; j++) {
                    if (tempArr[i].value == tempArr[j].value) {
                        tempArr.splice(j, 1);
                        j--;
                    };
                };
            };
            return tempArr;
        }
        list = qc(list);
        return list
    })
    /*成功添加跟踪，则弹出关注公众号的对话框 */
    async function rulesTs(result: any) {
        /* 校验用户是否授权，没有授权即弹出关注公众号对话框 */
        if (result.Data == 1) return;
        setTimeout(async () => {
            const href = await download('/api/CT_TrackOcean/QRCode');
            state.tsVisible = true;
            /* 对话框dom加载完后更改src */
            nextTick(() => {
                state.codeRef.src = href;
            })
        }, 1000)

    }
    /* 推送设置 */
    async function tsSet() {
        let result = await request.get('/api/CT_TrackOcean/GetWxConfig');
        state.tsVisible2 = true;
        state.checkList = [];
        if (!result.Data) return
        for (let key in result.Data) {
            if (result.Data[key] === true) {
                state.checkList.push(key)
            }
        }
        if (result.Data.AllStatus) {
            state.checkList = ['TSDP', 'pier', 'DLPT', 'POCA', 'Prerecorded', 'TSGT', 'PASS', 'TMPS', 'VGM', 'eta', 'ata', 'CUIP', 'offLoad', 'SUOT']
        }

    }
    async function updateTS() {
        let params = {} as any
        if (state.checkList.length == 14) {
            params = {
                AllStatus: true
            }
        } else {
            params = {
                TSDP: false,
                pier: false,
                DLPT: false,
                POCA: false,
                Prerecorded: false,
                TSGT: false,
                PASS: false,
                TMPS: false,
                VGM: false,
                eta: false,
                ata: false,
                CUIP: false,
                offLoad: false,
                SUOT: false
            } as any
            state.checkList.forEach((t: any) => {
                params[t] = true;
            })
        }
        state.checkLoading = true;
        let result = await request.post('/api/CT_TrackOcean/UpWxConfig', params)
        state.checkLoading = false;
        if (!result.Status) return ElMessage.error(result.Message);
        ElMessage.success(result.Message);
        state.tsVisible2 = false;

    }
    onMounted(() => {
        initSubmit()
    })
    return reactive({
        getList,
        initSubmit,
        openDetali,
        changeTable,
        delTableList,
        filterHandler,
        state,
        search,
        rulesTs,
        tsSet,
        filterList,
        updateTS,
        reload,
        inputTip
    })
}
export default defineComponent({
    components: {
        Search,
        Bell,
        Refresh,
        tablePage,
        addTrackDialog,
        batchAddDialog,
        Warning
    },
    setup() {
        const tables = usetables();
        const froms = useFroms();
        let listener = null
        onMounted(() => {
            listener = window.$ipc.on("cargotracking/inquire", (_, msg) => {
                tables.initSubmit()

            });
        })
        return {
            tables,
            froms
        }
    }
})
</script>

<style lang="scss" scoped>
* {
    font-family: PingFangSC-Medium;
    box-sizing: border-box;
}


.exit-container {
    width: 100%;
}

.exit-header {
    background: #FFFFFF;
    border: 1px solid #F2F3F5;
    border-radius: 4px;
    padding: 32px 40px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}

.header-item {
    height: 48px;
    box-sizing: border-box;
    border-radius: 4px;
}

.header-item:nth-child(1) {
    width: 12.5%;
    margin-right: 16px;
}

.header-item:nth-child(2) {
    width: 20%;
    margin-right: 16px;
}

.header-item:nth-child(3) {
    width: 39.2%;
    margin-right: 16px;
    display: flex;
    align-items: center;
}

.header-item:nth-child(4) {
    width: 10%;
    margin-right: 16px;
    background: #3496FB;
    font-size: 16px;
    color: #FFFFFF;
    font-weight: 500;
    text-align: center;
    line-height: 48px;
    cursor: pointer;
}

/* .header-item:nth-child(5) {
    width: 10%;
    margin-right: 16px;
    font-size: 16px;
    color: #3496FB;
    font-weight: 500;
    text-align: center;
    line-height: 44px;
    cursor: pointer;
} */

.header-item:nth-child(5) {
    width: 10%;
    background: #E5F4FF;
    height: 32px;
    font-size: 16px;
    color: #3496FB;
    font-weight: 500;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
}

.item1 {
    width: 56%;
    height: 18px;
    border-right: 2px solid #E4E7ED;
    margin-top: 12px;
    margin-bottom: 12px;
}

.item2 {
    width: 44%;
    height: 100%;
}

.bold-border {
    border: 3px solid #3496FB;
}

.border {
    border: 2px solid #3496FB;
}

.optionItem {
    width: 350px;
    display: flex;
    justify-content: space-between;
}

.optionItem span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}


::v-deep .header-item .el-select .el-input__inner {
    border: none !important;
    height: 100%;
}

::v-deep .m-2 .el-input__suffix-inner .el-icon:nth-child(1) svg {
    display: none;
}

::v-deep .header-item .el-input--small {
    width: 100%;
    height: 100%;
}

::v-deep .header-item .el-input--small .el-input__inner {
    width: 100%;
    height: 100%;
    font-size: 14px;
    border: none
}

::v-deep .header-item .el-select .select-trigger {
    height: 100%;
}

::v-deep .header-item .el-select .select-trigger .el-input {
    height: 100%;
}
</style>
<style lang="scss" scoped>
.exit-body {
    background: #FFFFFF;
    border-radius: 4px;
    margin-top: 8px;
    border: 1px solid #F2F3F5;
}

.body-header {
    width: 100%;
    height: 42px;
    padding: 12px 16px 13px 24px;
    border-bottom: 1px solid #F2F3F5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #969799;
}

.body-header div {
    display: flex;
    align-items: center;
}

.body-header-item span {
    color: #3496FB;
}

.body-btn {
    padding: 4px 8px;
    background: #E5F4FF;
    border: 1px solid #3496FB;
    border-radius: 2px;
    text-align: center;
    font-size: 12px;
    color: #3496FB;
    font-weight: 500;
    cursor: pointer;
    margin-right: 8px;
}

.body-btn2 {
    background-color: #fff;
    color: #606266;
    border: 1px solid #E4E7ED;
}

.body-select {
    width: 90px;
    height: 25px;
}

::v-deep .body-select .el-select .select-trigger {
    height: 100%;
}

::v-deep .body-select .el-select .select-trigger .el-input {
    height: 100%;
}

::v-deep .body-select .el-select .el-input__inner {
    padding-left: 8px;
    height: 100%;
    background: #E5F4FF;
    padding-right: 8px;
    text-align: center;
    border: none;
    color: #3496FB;
}

::v-deep .body-select .el-select .select-trigger .el-input {
    height: 100%;
    font-size: 12px;
}

::v-deep .body-select .el-select .select-trigger ::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: #3496FB;
}

::v-deep .body-select .el-select .select-trigger ::-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #3496FB;
}

::v-deep .body-select .el-select .select-trigger ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #3496FB;
}

::v-deep .body-select .el-select .select-trigger ::-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #3496FB;
}

::v-deep .el-input__suffix {
    right: 0
}

::v-deep .body-input .el-input--small {
    width: 100%;
    height: 100%;
}

::v-deep .body-input .el-input--small .el-input__inner {
    width: 100%;
    height: 100%;
}

.body-input {
    width: 245px;
    height: 25px;
    margin-left: 8px;
}

.body-container {
    padding: 16px 16px 32px 16px;
    width: 100%;
}

::v-deep .tsDialog .el-dialog__title {
    font-size: 16px;
    font-weight: 500;
    color: #3C4144;
    font-family: PingFangSC-Medium;
}

::v-deep .tsDialog .el-dialog__header {
    padding: 16px 24px;
}

::v-deep .tsDialog2 .el-dialog__header {
    padding: 16px 16px 0 16px;
}

::v-deep .tsDialog2 .el-dialog__title {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #3C4144;
    letter-spacing: 0;
    font-weight: 400;
}

::v-deep .tsDialog2 .el-dialog__body {
    padding: 0 24px 24px 24px;
}

::v-deep .el-checkbox {
    margin-right: 0;
}

.checkbox-container {
    margin-top: 16px;
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #3C4144;
    letter-spacing: 0;
    font-weight: 500;
}

::v-deep .checkbox-container .el-checkbox__label {
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #3C4144;
    letter-spacing: 0;
    font-weight: 500;
}


.ts-container {
    text-align: center;
    font-size: 12px;
    color: #3C4144;
    letter-spacing: 0;
    font-weight: 400;
    width: 100%;
}

.ts-container img {
    width: 210px;
    height: 210px;
}

.ts-tooltip {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #3C4144;
    letter-spacing: 0;
    font-weight: 400;
    margin: 30px 0 70px 0;
    line-height: 25px;
}

.footer-btn {
    text-align: center;
}

.footer-btn .el-button--small {
    padding: 9px 35px !important;
    font-size: 14px;
}
</style>
<!-- 表格样式 -->
<style lang="scss" scoped>
@import './components/exitQueryTableStyle.css';
</style>
<style>
.shipList .el-select-dropdown__item {
    padding: 0 20px !important
	.el-popper.is-light {
		padding: 15px 10px;
	}
}
</style>