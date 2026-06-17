<template>
    <div>
        <div class="container">
            <!-- <div class="header-container">
            <div class="header-box">

            </div>
        </div> -->
            <div class="freight-search-container">
                <div class="search-group">
                    <div class="search-group-item">
                        <div class="search-group-item-title">起运港</div>
                        <img v-show="table.state.search.startPortName" src="@/assets/shippingQuery/port.svg" alt="" />
                        <img v-show="!table.state.search.startPortName" src="@/assets/images/port_01.svg" alt="" />
                        <el-select class="search-port-select" filterable v-model="table.state.search.startPortName"
                            placeholder="请选择起运港" popper-class="shippingQuery" :filter-method="table.getPolPort"
                            clearable @clear="table.getPolPort(null)">
                            <div style="position:absolute;top:0;height:30px;width:100%;background:#409eff;color:#fff;display: flex;justify-content: space-between;align-items: center;font-size: 14px;
    font-weight: bold;padding:0 10px;box-sizing: border-box;z-index:2000">
                                <div>支持中文/英文输入</div>
                                <div>城市</div>
                            </div>
                            <el-option v-for="(item, index) in table.state.startPortList" :key="item.EnPortName"
                                :value="item.EnPortName">
                                <template #default>
                                    <div class="polPortStyle">
                                        <div>{{ item.EnPortName }}</div>
                                        <div> {{ item.CnPortName }}</div>
                                    </div>
                                </template>
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-group-item">
                        <div class="search-group-item-title">目的港</div>
                        <img v-show="table.state.search.destPortName" src="@/assets/shippingQuery/port.svg" alt="" />
                        <img v-show="!table.state.search.destPortName" src="@/assets/images/port_01.svg" alt="" />
                        <div class="desPort-selectde-content" @click="table.state.destPortVisible = true">
                            <el-popover width="600px" trigger="click" v-model:visible="table.state.destPortVisible"
                                class="el-popover" popper-class="select-port-popper" style="padding:0">
                                <template #reference>
                                    <el-input class="dest-port-select" size="mini"
                                        v-model="table.state.search.destPortName" clearable placeholder="请选择目的港"
                                        @input="table.watchDestInput"></el-input>
                                </template>
                                <div class="inputQuery" v-if="table.state.search.destPortName.length">
                                    <div class="inputQuery-header">
                                        <div>支持中英文输入</div>
                                        <div>航线</div>
                                    </div>
                                    <el-scrollbar max-height="330px">
                                        <div class="inputQuery-container"
                                            v-for="(items1, index) in table.state.inputQueryList" :key="index">
                                            <div class="container-items" v-for="(items2, index2) in items1.gangkou"
                                                :key="index2" @click="table.confirmQuery(items2.Id, items2.EnPortName)">
                                                <div>{{ items2.CnPortName }}&nbsp;{{ items2.EnPortName }}</div>
                                                <div>{{ items1.LineName }}</div>
                                            </div>
                                        </div>
                                        <div v-if="!table.state.inputQueryList.length" style="padding: 5px 10px">
                                            暂无港口
                                        </div>
                                    </el-scrollbar>
                                </div>
                                <AppDestPortContent v-else style="padding: 14px 12px" @selectPort="table.selectDesPort"
                                    :isHistory="false" :type="1"></AppDestPortContent>
                            </el-popover>
                        </div>
                    </div>
                    <div class="search-group-item">
                        <div class="search-group-item-title">开航日</div>
                        <div class="search-port-daterange">
                            <el-date-picker v-model="table.state.search.DateRange"
                                popper-class="data-picker-shippingQuery" type="date" clearable placeholder="请选择开航日期"
                                value-format="YYYY-MM-DD" :disabled-date="table.disabledDate">
                            </el-date-picker>
                        </div>
                    </div>
                    <div></div>
                </div>
                <img class="search-icon" @click="table.getList" src="@/assets/images/search-icon.svg" alt="" />
            </div>
            <div class="history-container">
                <div class="title">历史搜索：</div>
                <div class="body">
                    <div :class="item.id == table.state.historyId ? 'history-active' : ''"
                        v-for="(item, index) in table.state.historyQueryList" :key="index">
                        <span @click="table.addQuery(item)">{{ item.startPortName }} - {{
                                item.destPortName
                        }}</span>
                        <Close style="margin-left:5px;width:16px;height:16px" @click="table.historyDel(item)"></Close>
                    </div>
                </div>
            </div>
        </div>
        <div class="tabs-container" style="margin-top:15px">
            <div class="prev">
                <div>
                    <ArrowLeft style="width: 16px; height: 16px;color: #ddd;" />
                </div>
            </div>
            <div class=" body">
                <div class="body-item" :class="table.state.EtdListId == 0 ? 'tabs-active' : ''">
                    <div @click="table.handleDay(0)">本周 {{ table.getMonday("s", 0, 'e') }}-{{ table.getMonday("e", 0,
                            'e')
                    }}</div>
                </div>
                <div class="body-item" :class="table.state.EtdListId == 1 ? 'tabs-active' : ''">
                    <div @click="table.handleDay(1)">下一周 {{ table.getMonday("s", 1, 'e') }}-{{ table.getMonday("e", 1,
                            'e')
                    }}</div>
                </div>
                <div class="body-item" :class="table.state.EtdListId == 2 ? 'tabs-active' : ''">
                    <div @click="table.handleDay(2)">下两周 {{ table.getMonday("s", 2, 'e') }}-{{ table.getMonday("e", 2,
                            'e')
                    }}</div>
                </div>
                <div class="body-item" :class="table.state.EtdListId == 3 ? 'tabs-active' : ''">
                    <div @click="table.handleDay(3)">下三周 {{ table.getMonday("s", 3, 'e') }}-{{ table.getMonday("e", 3,
                            'e')
                    }}</div>
                </div>
            </div>
            <div class="next">
                <div>
                    <ArrowRight style="width: 16px; height: 16px;color: #ddd;" />
                </div>
            </div>
        </div>
        <div class="body-container">
            <div class="left-tabs" v-show="query.state.tabsValue">
                <div class="title">
                    <span>精准筛选</span>
                    <span @click="query.handle('tabs')">
                        <Fold style="width: 16px; height: 16px;color: #3567df;cursor: pointer;" />
                    </span>
                </div>
                <div class="checkbox">
                    <el-checkbox-group v-model="table.state.filterTYPE" @change="table.handleSX">
                        <el-checkbox label="direct">直达</el-checkbox>
                        <el-checkbox label="transit">中转</el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="table.state.filterKB" @change="table.handleSX">
                        <el-checkbox label="有船">有船</el-checkbox>
                        <el-checkbox label="空班">空班</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="shipping">
                    <div class="shipping-title">
                        <span>船公司</span>
                        <span @click="query.handle('shipping')" class="transition"
                            :class="query.state.shippingValue ? 'transform' : ''">
                            <ArrowRight style="width: 16px; height: 16px;color: #ddd;cursor: pointer;" />
                        </span>
                    </div>
                    <el-collapse-transition>
                        <div class="shipping-body" v-show="query.state.shippingValue">
                            <el-checkbox v-model="table.checkAll" :indeterminate="table.isIndeterminate"
                                @change="table.handleCheckAllChange">全部</el-checkbox>
                            <el-checkbox-group v-model="table.state.filterCGS" @change="table.handleSX">
                                <el-checkbox :label="item" v-for="(item, index) in table.state.filterCGSList"
                                    :key="index" />
                                <!-- <el-checkbox label="COSCO" />
                                <el-checkbox label="EMC" />
                                <el-checkbox label="HBS" />
                                <el-checkbox label="HMM" />
                                <el-checkbox label="HPL" />
                                <el-checkbox label="MATSON" />
                                <el-checkbox label="MSC" />
                                <el-checkbox label="MSK" />
                                <el-checkbox label="ONE" />
                                <el-checkbox label="OOCL" />
                                <el-checkbox label="SML" />
                                <el-checkbox label="YML" /> -->
                            </el-checkbox-group>
                        </div>
                    </el-collapse-transition>
                </div>
                <div class="shipping">
                    <div class="shipping-title">
                        <span>码头</span>
                        <span @click="query.handle('port')" class="transition"
                            :class="query.state.portValue ? 'transform' : ''">
                            <ArrowRight style="width: 16px; height: 16px;color: #ddd;cursor: pointer;" />
                        </span>
                    </div>
                    <el-collapse-transition>
                        <div class="shipping-body" v-show="query.state.portValue">
                            <div style="margin-bottom:5px;">起运港</div>
                            <el-checkbox v-model="table.checkAll2" :indeterminate="table.isIndeterminate2"
                                @change="table.handleCheckAllChange2">全部</el-checkbox>
                            <el-checkbox-group v-model="table.state.filterQYG" @change="table.handleSX()">
                                <el-checkbox :label="item" v-for="(item, index) in table.state.filterQYGList"
                                    :key="index" />

                            </el-checkbox-group>
                            <div style="border-bottom: 1px solid #f2f2f2;margin:15px 0;width:100%;height:1px"></div>
                            <div style="margin-bottom:5px;">目的港</div>
                            <el-checkbox v-model="table.checkAll3" :indeterminate="table.isIndeterminate3"
                                @change="table.handleCheckAllChange3">全部</el-checkbox>
                            <el-checkbox-group v-model="table.state.filterMDG" @change="table.handleSX()">
                                <el-checkbox :label="item" v-for="(item, index) in table.state.filterMDGList"
                                    :key="index" />
                            </el-checkbox-group>
                        </div>
                    </el-collapse-transition>
                </div>
                <div class="time">
                    <div class="time-title">
                        <span>时间</span>
                        <span @click="query.handle('time')" class="transition"
                            :class="query.state.timeValue ? 'transform' : ''">
                            <ArrowRight style="width: 16px; height: 16px;color: #ddd;cursor: pointer;" />
                        </span>
                    </div>
                    <el-collapse-transition>
                        <div class="time-body" v-show="query.state.timeValue">
                            <div class="ETD">
                                <div style="margin-bottom:12px;">ETD</div>
                                <el-checkbox-group v-model="table.state.filterSJ" @change="table.handleSX()">
                                    <el-checkbox label="周一">一</el-checkbox>
                                    <el-checkbox label="周二">二</el-checkbox>
                                    <el-checkbox label="周三">三</el-checkbox>
                                    <el-checkbox label="周四">四</el-checkbox>
                                    <el-checkbox label="周五">五</el-checkbox>
                                    <el-checkbox label="周六">六</el-checkbox>
                                    <el-checkbox label="周日">日</el-checkbox>
                                </el-checkbox-group>
                                <div style="border-bottom: 1px solid #f2f2f2;margin:12px 0;width:100%;height:1px"></div>
                                <div style="margin-top:12px;">T/T</div>
                                <el-slider v-model="table.state.numberActive" size="small" :min="table.state.numberMin"
                                    :max="table.state.numberMax" @change="table.handleSX()" />
                                <div class="number">
                                    <span>{{ table.state.numberMin }}</span>
                                    <span>{{ table.state.numberMax }}</span>
                                </div>
                            </div>
                            <div class="T"></div>
                        </div>
                    </el-collapse-transition>
                    <div class="btn" @click="table.clearQuery">清空条件</div>
                </div>
            </div>
            <div class="left-tabs2" v-show="!query.state.tabsValue">
                <div @click="query.handle('tabs')">
                    <Expand style="width: 16px; height: 16px;color: #3567df;" />
                </div>
                <div style="writing-mode: vertical-lr;margin-top:5px;cursor: pointer;">展开筛选选项</div>
            </div>
            <div class="right-table" :class="!query.state.tabsValue ? 'right-table2' : ''">
                <div class="table-title">
                    <div class="title-item">大船ETD
                        <span class="px">
                            <div @click="table.ETDPx('max')"
                                :class="table.state.sxId == 'max' ? 'px-active-bottom' : ''">
                            </div>
                            <div @click="table.ETDPx('min')" :class="table.state.sxId == 'min' ? 'px-active-top' : ''">
                            </div>
                        </span>
                    </div>
                    <div class="title-item">总航程
                        <span class="px">
                            <div @click="table.HcPx('max')"
                                :class="table.state.sxId2 == 'max' ? 'px-active-bottom' : ''">
                            </div>
                            <div @click="table.HcPx('min')" :class="table.state.sxId2 == 'min' ? 'px-active-top' : ''">
                            </div>
                        </span>
                    </div>
                    <div class="title-item">码头</div>
                    <div class="title-item">共舱船公司（航线代码）</div>
                    <div class="title-item">大船船名/航次</div>
                    <!-- <div class="title-item">认证</div> -->
                    <div class="title-item">船定位</div>
                </div>
                <div class="table-body" v-loading="table.state.tableLoading" v-show="table.state.directList.length">
                    <div class="body-title">直达方案（{{ table.zdSum }}）</div>
                    <div class="body-item" v-for="(item, index) in table.state.directList" :key="index"
                        :class="item.kb == '空班' ? 'kb-active' : ''">
                        <div>{{ item.etdDay }}</div>
                        <div>{{ table.getSumTime(item.staticEta, item.staticEtd) }}天</div>
                        <div>{{ item.polTerminalCn }}</div>
                        <div>
                            <span v-for="(gc, index2) in item.shareCabins" :key="index2">
                                <span>{{ gc.carrier }}({{ gc.routeCode ? gc.routeCode : '无ss' }})</span>
                                <span v-if="item.shareCabins.length > index2 + 1"> / </span>
                            </span>
                        </div>
                        <div @click="dialog.openDialog(item)">
                            <span v-if="item.kb == '有船'">{{ item.vessel.toUpperCase() }}/{{ item.voyage }}</span>
                            <span v-else class="kb-active">{{ item.kb }}</span>
                        </div>
                        <div @click="dialog.openDialog(item)">
                            <div style="width:100%;height:100%" v-show="table.getKHTime(item.staticEtd, item.etd) < 0">
                                <img src="@/assets/shippingQuery/error.png" alt="" style="width:100%;height:20px">
                                <span style="color:#fff;position:absolute;text-align: center;width:100%;top:2px;left:0">
                                    延迟{{ Math.abs(table.getKHTime(item.staticEtd, item.etd)) }}天
                                </span>
                            </div>
                            <div style="width:100%;height:100%" v-show="table.getKHTime(item.staticEtd, item.etd) > 0">
                                <img src="@/assets/shippingQuery/success.png" alt="" style="width:100%;height:20px">
                                <span style="color:#fff;position:absolute;text-align: center;width:100%;top:2px;left:0">
                                    提前{{ Math.abs(table.getKHTime(item.staticEtd, item.etd)) }}天
                                </span>
                            </div>
                            <div style="width:100%;height:100%" v-show="table.getKHTime(item.staticEtd, item.etd) == 0">
                                <img src="@/assets/shippingQuery/success.png" alt="" style="width:100%;height:20px">
                                <span style="color:#fff;position:absolute;text-align: center;width:100%;top:2px;left:0">
                                    准点
                                </span>
                            </div>

                        </div>
                        <!-- <div><img src="@/assets/shippingQuery/rz.png" alt=""></div> -->
                        <div @click="table.messageBox(item)">
                            <img style="cursor:pointer" src="@/assets/shippingQuery/dw.png" alt="">
                        </div>
                    </div>
                </div>
                <div class="table-body" v-loading="table.state.tableLoading" v-show="table.state.transitList.length"
                    style="margin-top:15px">
                    <div class="body-title">中转方案（{{ table.state.transitList.length }}）</div>
                    <div class="body-item" v-for="(item, index) in table.state.transitList" :key="index"
                        :class="item.kb == '空班' ? 'kb-active' : ''">
                        <div>{{ item.etdDay }}</div>
                        <div>{{ table.getSumTime(item.staticEta, item.staticEtd) }}天</div>
                        <div>{{ item.polTerminalCn }}</div>
                        <div style="display:flex">
                            <div style="width:35%;font-weight: 400 !important;">{{ item.carriercd }}({{ item.routeCode ?
                                    item.routeCode : '无'
                            }})</div>
                            <div style="color: rgb(0, 124, 227);text-decoration:underline;width:35px">
                                {{ item.hc }}程
                            </div>
                            <div style="width:30px;">转</div>
                            <div style="width:45%">{{ item.transitPortEn }}</div>
                        </div>
                        <div @click="dialog.openDialog(item)">
                            <span v-if="item.kb == '有船'">{{ item.vessel.toUpperCase() }}/{{ item.voyage }}</span>
                            <span v-else class="kb-active">{{ item.kb }}</span>
                        </div>
                        <div @click="dialog.openDialog(item)">
                            <div style="width:100%;height:100%"
                                v-show="table.getKHTime(item.staticEtd, item.etd) < 0 && item.kb == '有船'">
                                <img src="@/assets/shippingQuery/error.png" alt="" style="width:100%;height:20px">
                                <span style="color:#fff;position:absolute;text-align: center;width:100%;top:2px;left:0">
                                    延迟{{ Math.abs(table.getKHTime(item.staticEtd, item.etd)) }}天
                                </span>
                            </div>
                            <div style="width:100%;height:100%"
                                v-show="table.getKHTime(item.staticEtd, item.etd) > 0 && item.kb == '有船'">
                                <img src="@/assets/shippingQuery/success.png" alt="" style="width:100%;height:20px">
                                <span style="color:#fff;position:absolute;text-align: center;width:100%;top:2px;left:0">
                                    提前{{ Math.abs(table.getKHTime(item.staticEtd, item.etd)) }}天
                                </span>
                            </div>
                            <div style="width:100%;height:100%"
                                v-show="table.getKHTime(item.staticEtd, item.etd) == 0 && item.kb == '有船'">
                                <img src="@/assets/shippingQuery/success.png" alt="" style="width:100%;height:20px">
                                <span style="color:#fff;position:absolute;text-align: center;width:100%;top:2px;left:0">
                                    准点
                                </span>
                            </div>

                        </div>
                        <!-- <div><img src="@/assets/shippingQuery/rz.png" alt=""></div> -->
                        <div @click="table.messageBox(item)">
                            <img style="cursor:pointer" src="@/assets/shippingQuery/dw.png" alt="">
                        </div>
                    </div>
                </div>
                <div class="table-body" style="padding:30px 0;text-align:center" v-loading="table.state.tableLoading"
                    v-show="table.state.directList.length == 0 && table.state.transitList.length == 0">
                    暂无数据</div>
            </div>
        </div>
        <div class="shippingQueryDialog">
            <el-dialog v-model="dialog.state.DialogVisible" width="780px">
                <div class="dialog-title">
                    <div class="port">{{ dialog.state.rows.pol }}</div>
                    <div class="sanjiao"><span></span></div>
                    <div class="port">{{ dialog.state.rows.pod }}</div>
                    <div>总航程：{{ table.getSumTime(dialog.state.rows.staticEta, dialog.state.rows.staticEtd) }}天</div>
                </div>
                <div class="dialog-body">
                    <div class="left">
                        <div class="left-container" v-for="(item, index) in dialog.state.portList" :key="index">
                            <div class="container-title">
                                <div></div>
                                <div>{{ item.title }} {{ item.port }}</div>
                            </div>
                            <div class="container-body">
                                <div class="container-body-item1"
                                    :class="dialog.state.portList.length > index + 1 ? '' : 'line-active'"></div>
                                <div class="container-body-item2">
                                    <div v-if="item.staticEtd">
                                        {{ dialog.state.portList.length == index + 1 ? '计划抵港：' : '计划离港：' }}
                                        {{ item.staticEtd }}
                                        {{ table.getDay(item.staticEtd) }}

                                    </div>
                                    <div v-if="item.etd">
                                        <span>最新预计： {{ item.etd }} {{ table.getDay(item.etd) }} </span>
                                        <span style="position:relative"
                                            v-if="table.getKHTime(item.staticEtd, item.etd) < 0">
                                            <img src="@/assets/shippingQuery/error.png" alt=""
                                                style="width:105px;height:22px;margin-left:10px">
                                            <span
                                                style="display: block;position:absolute;width:100%;text-align: center;left:0;top:2px;color: #fff;">延迟{{
                                                        Math.abs(table.getKHTime(item.staticEtd, item.etd))
                                                }}天</span>
                                        </span>
                                        <span style="position:relative"
                                            v-if="table.getKHTime(item.staticEtd, item.etd) > 0">
                                            <img src="@/assets/shippingQuery/success.png" alt=""
                                                style="width:105px;height:22px;margin-left:10px">
                                            <span
                                                style="display: block;position:absolute;width:100%;text-align: center;left:0;top:2px;color: #fff;">提前{{
                                                        Math.abs(table.getKHTime(item.staticEtd, item.etd))
                                                }}天</span>
                                        </span>
                                        <span style="position:relative"
                                            v-if="table.getKHTime(item.staticEtd, item.etd) == 0">
                                            <img src="@/assets/shippingQuery/success.png" alt=""
                                                style="width:105px;height:22px;margin-left:10px">
                                            <span
                                                style="display: block;position:absolute;width:100%;text-align: center;left:0;top:2px;color: #fff;">准点</span>
                                        </span>
                                    </div>
                                    <div class="vessel" v-if="item.title != '目的港'">
                                        <div>
                                            <span
                                                style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width:250px">
                                                船名/航次:
                                                <span v-if="item.vessel && item.voyage">{{ item.vessel.toUpperCase()
                                                }}/{{ item.voyage }}</span>
                                                <span v-else>暂无数据</span>
                                            </span>
                                            <img @click="table.messageBox(item)" src="@/assets/shippingQuery/dw.png"
                                                alt="" style="margin-right:0;cursor: pointer;">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="right-container">
                            <div class="right-container-item">
                                <div>头程大船船名</div>
                                <div>{{ dialog.state.rows.vessel ? dialog.state.rows.vessel.toUpperCase() : '--' }}
                                </div>
                            </div>
                            <div class="right-container-item">
                                <div>IMO</div>
                                <div>{{ dialog.state.rows.imoNumber ? dialog.state.rows.imoNumber : '--' }}</div>
                            </div>
                            <div class="right-container-item">
                                <div>船旗</div>
                                <div>
                                    <!-- {{ dialog.rows.vessel}} -->
                                    --
                                </div>
                            </div>
                            <div class="right-container-item">
                                <div>建造日期</div>
                                <div>
                                    <!-- {{ dialog.rows.vessel}} -->
                                    --
                                </div>
                            </div>
                            <div class="right-container-item">
                                <div>总箱量</div>
                                <div>
                                    <!-- {{ dialog.rows.vessel}} -->
                                    --
                                </div>
                            </div>
                            <div class="right-container-item">
                                <div>运营方</div>
                                <div>{{ dialog.state.rows.carriercd ? dialog.state.rows.carriercd : '--' }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { defineComponent, computed, ref, reactive, onMounted, nextTick } from "vue";
import { ArrowLeft, ArrowRight, Expand, Fold, Close } from "@element-plus/icons";
import AppDestPortContent from "@/components/AppDestPortContent2.vue";
import request from "@/public/request";
import { getDate } from "./publicUtils.js"
import { ElMessage } from "element-plus";
import { getElectronAgent } from "@share/agent";
function useQuery() {
    const state = reactive({
        tabsValue: true,
        shippingValue: true,
        portValue: true,
        timeValue: true,
    })
    function handle(val) {
        switch (val) {
            case 'shipping':
                state.shippingValue = !state.shippingValue
                break;
            case 'port':
                state.portValue = !state.portValue
                break;
            case 'time':
                state.timeValue = !state.timeValue
                break;
            case 'tabs':
                state.tabsValue = !state.tabsValue
                break;

        }
    }
    return reactive({
        state,
        handle
    })
}
function useTable() {
    const agent = getElectronAgent();
    const state = reactive({
        DialogVisible: false,
        startPortList: [],
        search: {
            destPortName: '',
            startPortName: '',
            DateRange: getDate(new Date(), 0)
        },
        inputQueryList: [],
        destPortVisible: false,
        tableLoading: false,
        directList: [],
        transitList: [],
        EtdListId: 0,
        oldDirectList: [],
        oldTransitList: [],
        filterTYPE: [],
        filterKB: [],
        filterCGS: [],
        filterCGSList: [],
        filterQYG: [],
        filterQYGList: [],
        filterMDG: [],
        filterMDGList: [],
        filterSJ: [],
        filterDirectList: [],
        filterTransitList: [],
        numberMin: 0,
        numberMax: 0,
        numberActive: 0,
        historyQueryList: [],
        historyId: null,
        sxId: null,
        sxId2: null

    })
    const watchDestInput = () => {
        if (state.search.destPortName == "") {
            return (state.destPortVisible = true);
        }
        state.destPortVisible = true;
        getDesPort();
    };
    const getDesPort = async () => {
        const res = await request.get("/api/FRPortalPort/GetPortToList", { EnPortName: state.search.destPortName, });
        state.inputQueryList = res.Data;
        console.log(state.inputQueryList);
        /* /api/CT_TrackOcean/GetDestination */
    };
    const getPolPort = async (e) => {
        let keyword = "";
        if (e) {
            keyword = e
        }
        state.startPortList = [];
        const res = await request.get("/api/FRPort/GetPortList", {
            page: 1, limit: 9999,
            PortName: keyword,
            PortType: 2

        });
        /* /api/FRPort/GetFRPortList */
        let list = []
        res.Rows.forEach((t) => {
            if (t.Code) {
                list.push(t)
            }
        })
        /* /api/CT_TrackOcean/GetDeparture */
        nextTick(() => {
            state.startPortList = res.Rows;
        })
    }
    function selectDesPort(item) {
        state.search.destPortName = item.EnPortName;
        watchDestInput();
        state.destPortVisible = false;
    }
    function confirmQuery(Id, value) {
        state.destPortVisible = false;
        state.search.destPortName = value;
    }
    function storeHistoryQuery() {
        if (!state.search.destPortName || !state.search.startPortName || !state.search.DateRange) return
        let list = [];
        let query = {
            destPortName: state.search.destPortName,
            startPortName: state.search.startPortName,
            DateRange: state.search.DateRange
        }
        if (window.sessionStorage.getItem('query')) {
            let json = JSON.parse(window.sessionStorage.getItem('query'));
            list = [...json, query];
        } else {
            list = [query]
        }
        let newList = unique(list);
        if (newList.length > 20) {
            newList.shift()
        }
        newList.forEach((t, i) => {
            t.id = i
        })
        window.sessionStorage.setItem('query', JSON.stringify(newList))
        function unique(arr) {
            for (var i = 0; i < arr.length; i++) {    // 首次遍历数组
                for (var j = i + 1; j < arr.length; j++) {   // 再次遍历数组
                    if (arr[i].destPortName == arr[j].destPortName && arr[i].startPortName == arr[j].startPortName && arr[i].DateRange == arr[j].DateRange) {          // 判断连个值是否相等
                        arr.splice(j, 1);           // 相等删除后者
                        j--;
                    }
                }
            }
            return arr
        }
        computedHistoryQuery();
    }
    function addQuery(row) {
        state.search = {
            destPortName: row.destPortName,
            startPortName: row.startPortName,
            DateRange: row.DateRange
        }
        state.historyId = row.id;
        searchBtn()
    }
    function computedHistoryQuery() {
        if (!window.sessionStorage.getItem('query')) return
        state.historyQueryList = JSON.parse(window.sessionStorage.getItem('query'));

    }
    function getList() {
        clearGl()
        searchBtn()
    }
    async function searchBtn() {
        if (!(state.search.startPortName && state.search.destPortName && state.search.DateRange)) return ElMessage.warning('请输入完整的搜索条件！');
        let currentTime = new Date(state.search.DateRange).getTime();
        let day0s = new Date(getMonday("s", 0, 'i')).getTime()
        let day0e = new Date(getMonday("e", 0, 'i')).getTime()
        let day1s = new Date(getMonday("s", 1, 'i')).getTime()
        let day1e = new Date(getMonday("e", 1, 'i')).getTime()
        let day2s = new Date(getMonday("s", 2, 'i')).getTime()
        let day2e = new Date(getMonday("e", 2, 'i')).getTime()
        let day3s = new Date(getMonday("s", 3, 'i')).getTime()
        let day3e = new Date(getMonday("e", 3, 'i')).getTime()
        if (currentTime <= day3e && currentTime >= day3s) {
            handleDay(3);

        }
        if (currentTime <= day2e && currentTime >= day2s) {
            handleDay(2);
        }
        if (currentTime <= day1e && currentTime >= day1s) {
            handleDay(1);
        }
        if (currentTime <= day0e && currentTime >= day0s) {
            handleDay(0);
        }
    }
    async function searchBtn2(etd) {
        state.tableLoading = true;
        storeHistoryQuery()
        let params = {
            polCode: await getPolCode(state.search.startPortName),
            podCode: await getPodCode(state.search.destPortName),
            etd: etd
        }
        const res = await request.post('/api/CT_TrackOcean/RequestShippingShippingTimeData', params);
        state.tableLoading = false;
        if (res.message != '成功') return;
        res.data.direct.forEach((e) => {
            e.etdDay = getDay(e.staticEtd);
            e.type = 'direct'
            e.kb = '空班';
            if (e.vessel) {
                e.kb = '有船'
            }
        })
        res.data.transit.forEach((e) => {
            e.etdDay = getDay(e.staticEtd);
            e.type = 'transit'
            e.hc = getPortNumber(e);
            e.kb = '空班';
            if (e.vessel) {
                e.kb = '有船'
            }
        })
        state.oldDirectList = res.data.direct;
        state.oldTransitList = res.data.transit;
    }
    /* 获取最大航程和最小航程 */
    function getHc(type) {
        let list = [...state.filterDirectList, ...state.filterTransitList];
        let sumList = [];
        list.forEach((t) => {
            sumList.push(getSumTime(t.staticEta, t.staticEtd))
        })
        if (type == 'max') {
            return sumList.length != 0 ? Math.max(...sumList) : 0
        }
        if (type = 'min') {
            return sumList.length != 0 ? Math.min(...sumList) : 0
        }
    }
    /* 获取船公司集合 */
    function getShip() {
        state.filterCGSList = [];
        state.filterQYGList = [];
        state.filterMDGList = [];
        let sumList = state.filterDirectList.concat(state.filterTransitList);
        let sumList2 = state.filterDirectList.concat(state.filterTransitList);
        let sumList3 = state.filterDirectList.concat(state.filterTransitList);
        let list = qc(sumList, 'carriercd');
        let list2 = qc(sumList2, 'polTerminalCn');
        let list3 = qc(sumList3, 'podTerminalCn');
        list.forEach(t => {
            if (t.carriercd) {
                state.filterCGSList.push(t.carriercd)
            }
        })
        list2.forEach(t => {
            if (t.polTerminalCn) {
                state.filterQYGList.push(t.polTerminalCn)
            }
        })
        list3.forEach(t => {
            if (t.podTerminalCn) {
                state.filterMDGList.push(t.podTerminalCn)
            }
        })
        function qc(tempArr, keys) {
            let arr = tempArr;
            for (let i = 0; i < arr.length; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    if (arr[i][keys] == arr[j][keys]) {
                        arr.splice(j, 1);
                        j--;
                    };
                };
            };
            return arr;

        }
    }

    function getMonday(type, dates, type2) {
        var now = new Date();
        var nowTime = now.getTime();
        var day = now.getDay();
        var longTime = 24 * 60 * 60 * 1000;
        var n = longTime * 7 * (dates || 0);
        if (type == "s") {
            var dd = nowTime - (day - 1) * longTime + n;
        };
        if (type == "e") {
            var dd = nowTime + (7 - day) * longTime + n;
        };
        if (type2 == 'i') {
            dd = new Date(dd);
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1;
            var d = dd.getDate();
            m = m < 10 ? "0" + m : m;
            d = d < 10 ? "0" + d : d;
            var day = y + "-" + m + "-" + d;
            return day;
        }
        if (type2 == 'e') {
            dd = new Date(dd);
            var m = dd.getMonth() + 1;
            var d = dd.getDate();
            d = d < 10 ? "0" + d : d;
            var day = m + "." + d;
            return day;
        }
    };
    /* 筛选预计离港日期的列表 */
    function filterEtdList(id, { s, e }) {
        let newDirectList = [];
        let newTransitList = [];
        info(s, e);
        function info(start, end) {
            let startTime = parseInt(new Date(start).getTime()) - 1000 * 60 * 60 * 8
            let endTime = parseInt(new Date(end).getTime()) + 1000 * 60 * 60 * 24 - 1000 * 60 * 60 * 8;
            console.log(getDate(startTime, 0), getDate(endTime, 0));
            state.oldDirectList.forEach((t, i) => {
                let m = parseInt(new Date(t.staticEtd).getTime());
                if (m >= startTime && m < endTime) {
                    newDirectList.push(t);

                }
            })
            state.oldTransitList.forEach((t) => {
                let m = parseInt(new Date(t.staticEtd).getTime());
                if (m >= startTime && m < endTime) {
                    newTransitList.push(t);
                }
            })

        }
        return {
            newDirectList,
            newTransitList
        }
    }
    /* 周数点击事件 */
    async function handleDay(id) {
        /* state.filterJZ = [];
        state.filterCGS = [];
        state.filterCGSList = [];
        state.filterQYG = [];
        state.filterMDG = [];
        state.filterSJ = []; */
        state.EtdListId = id;
        switch (id) {
            case 0:
                await searchBtn2(getMonday("s", 0, 'i'))
                state.directList = filterEtdList(id, { s: getMonday("s", 0, 'i'), e: getMonday("e", 0, 'i') }).newDirectList;
                state.transitList = filterEtdList(id, { s: getMonday("s", 0, 'i'), e: getMonday("e", 0, 'i') }).newTransitList;
                state.filterDirectList = state.directList;
                state.filterTransitList = state.transitList;
                break;
            case 1:
                await searchBtn2(getMonday("s", 1, 'i'))
                state.directList = filterEtdList(id, { s: getMonday("s", 1, 'i'), e: getMonday("e", 1, 'i') }).newDirectList;
                state.transitList = filterEtdList(id, { s: getMonday("s", 1, 'i'), e: getMonday("e", 1, 'i') }).newTransitList;
                state.filterDirectList = state.directList;
                state.filterTransitList = state.transitList;
                break;
            case 2:
                await searchBtn2(getMonday("s", 2, 'i'))
                state.directList = filterEtdList(id, { s: getMonday("s", 2, 'i'), e: getMonday("e", 2, 'i') }).newDirectList;
                state.transitList = filterEtdList(id, { s: getMonday("s", 2, 'i'), e: getMonday("e", 2, 'i') }).newTransitList;
                state.filterDirectList = state.directList;
                state.filterTransitList = state.transitList;
                break;
            case 3:
                await searchBtn2(getMonday("s", 3, 'i'))
                state.directList = filterEtdList(id, { s: getMonday("s", 3, 'i'), e: getMonday("e", 3, 'i') }).newDirectList;
                state.transitList = filterEtdList(id, { s: getMonday("s", 3, 'i'), e: getMonday("e", 3, 'i') }).newTransitList;
                state.filterDirectList = state.directList;
                state.filterTransitList = state.transitList;
                break;
        }
        getShip();
        state.numberMin = getHc('min');
        state.numberMax = getHc('max');
        state.numberActive = getHc('max');
        handleSX()
        state.sxId = null;
        state.sxId2 = null;
    }
    /* 获取航程（预计抵港-预计离港） */
    function getSumTime(staticEta, staticEtd) {
        let newTime = new Date(staticEta).getTime();
        let oldTime = new Date(staticEtd).getTime();
        let diff = newTime - oldTime;
        let d = Math.ceil(diff / (1000 * 3600 * 24));
        /* let d = parseInt(diff / (1000 * 3600 * 24)); */
        return d
    }
    /* 获取开航是否准点 */
    function getKHTime(staticEtd, etd) {
        let newTime = new Date(staticEtd).getTime();
        let oldTime = new Date(etd).getTime();
        let diff = newTime - oldTime;
        let d = parseInt(diff / (1000 * 3600 * 24));
        return d

    }
    /* 计算星期 */
    function getDay(day) {
        let str1 = "";
        var week = new Date(day).getDay();
        switch (week) {
            case 0:
                str1 = "周日";
                break;
            case 1:
                str1 = "周一";
                break;
            case 2:
                str1 = "周二";
                break;
            case 3:
                str1 = "周三";
                break;
            case 4:
                str1 = "周四";
                break;
            case 5:
                str1 = "周五";
                break;
            case 6:
                str1 = "周六";
                break;
        }
        return str1;
    }
    /* 计算中转港程数 */
    function getPortNumber(t) {
        let sum = 1;
        if (t.thirdTransitPortEn) {
            sum += 1;
        }
        if (t.secondTransitPortEn) {
            sum += 1;
        }
        if (t.transitPortEn) {
            sum += 1;
        }
        return sum
    }
    /* 获取起运港五字代码 */
    async function getPolCode(enName) {
        if (!enName) return
        let currentCode = '';
        /* const res = await request.get("/api/FRPort/GetFRPortList", { page: 1, limit: 9999 }); */
        /* res.Rows.forEach((t) => {
            if (t.EnPortName == enName) {
                currentCode = t.Code;
                return
            }
        }) */
        state.startPortList.forEach((t) => {
            if (t.EnPortName == enName) {
                currentCode = t.Code;
                if (!t.Code) {
                    currentCode = 'CNNGB'
                }
                return
            }
        })
        return currentCode
    }
    /* 获取目的港五字代码 */
    async function getPodCode(enName) {
        if (!enName) return
        let currentCode = "";
        /* const res = await request.get("/api/FRPortalPort/GetPortToList"); */
        /* res.Data.forEach((t) => {
            t.gangkou.forEach((t2) => {
                if (t2.EnPortName == enName) {
                    currentCode = t2.Code;
                    return
                }
            })
        }) */
        state.inputQueryList.forEach((t) => {
            t.gangkou.forEach((t2) => {
                if (t2.EnPortName == enName) {
                    currentCode = t2.Code;
                    return
                }
            })
        })
        return currentCode
    }
    function disabledDate(time) {
        let max = new Date(getMonday("e", 3, 'i')).getTime();
        return time.getTime() < Date.now() - 8.64e7 || time.getTime() > max;
    }
    function handleSX() {
        state.filterCGS.forEach((t) => {
            if (t == '全部') {
                state.filterCGS = state.filterCGSList;
            }
        })
        let sumList = [...state.filterDirectList, ...state.filterTransitList];
        let etd = state.numberActive;
        let newFilterList = sumList.filter((t) => {
            let type = state.filterTYPE.length ? state.filterTYPE.includes(t.type) : true;
            let kb = state.filterKB.length ? state.filterKB.includes(t.kb) : true;
            let cgs = state.filterCGS.length ? state.filterCGS.includes(t.carriercd) : true;
            let qyg = state.filterQYG.length ? state.filterQYG.includes(t.polTerminalCn) : true;
            let mdg = state.filterMDG.length && !checkAll3.value ? state.filterMDG.includes(t.podTerminalCn) : true;
            let sj = state.filterSJ.length ? state.filterSJ.includes(t.etdDay) : true;
            if (type && kb & cgs && qyg && mdg && sj && etd >= getSumTime(t.staticEta, t.staticEtd)) {
                return t
            }
        })
        let directList = [];
        let transitList = [];
        newFilterList.forEach((t) => {
            if (t.type == 'direct') {
                directList.push(t)
            }
            if (t.type == 'transit') {
                transitList.push(t)
            }
        })
        state.directList = directList;
        state.transitList = transitList;
    }

    const checkAll = ref(false)
    const isIndeterminate = ref(true)
    const handleCheckAllChange = (val) => {
        state.filterCGS = val ? state.filterCGSList : []
        isIndeterminate.value = false
        handleSX()
    }
    const handleCheckedCitiesChange = (value) => {
        const checkedCount = value.length
        checkAll.value = checkedCount === state.filterCGSList.length
        isIndeterminate.value = checkedCount > 0 && checkedCount < state.filterCGSList.length;
        handleSX()
    }
    const checkAll2 = ref(false)
    const isIndeterminate2 = ref(true)
    const handleCheckAllChange2 = (val) => {
        state.filterQYG = val ? state.filterQYGList : []
        handleCheckAllChange2.value = false
        handleSX()
    }
    const handleCheckedCitiesChange2 = (value) => {
        const checkedCount = value.length
        checkAll2.value = checkedCount === state.filterQYGList.length
        isIndeterminate2.value = checkedCount > 0 && checkedCount < state.filterQYGList.length;
        handleSX()
    }
    const checkAll3 = ref(false)
    const isIndeterminate3 = ref(true)
    const handleCheckAllChange3 = (val) => {
        state.filterMDG = val ? state.filterMDGList : []
        handleCheckedCitiesChange3.value = false;
        handleSX()
    }
    const handleCheckedCitiesChange3 = (value) => {
        const checkedCount = value.length
        checkAll3.value = checkedCount === state.filterMDGList.length
        isIndeterminate3.value = checkedCount > 0 && checkedCount < state.filterMDGList.length
        handleSX()
    }
    function clearQuery() {
        state.filterTYPE = [];
        state.filterKB = [];
        state.filterCGS = [];
        state.filterQYG = [];
        state.filterMDG = [];
        state.filterSJ = [];
        state.numberActive = state.numberMax;
        handleSX()
    }
    function clearGl() {
        state.historyId = null
    }
    function ETDPx(type) {
        function compare(a, b) {
            // 使用 toUpperCase() 忽略字符大小写 
            const bandA = new Date(a.staticEtd).getTime();
            const bandB = new Date(b.staticEtd).getTime();

            let comparison = 0;
            if (bandA > bandB) {
                comparison = 1;
            } else if (bandA < bandB) {
                comparison = -1;
            }
            return comparison;
        }
        function compare2(a, b) {
            // 使用 toUpperCase() 忽略字符大小写 
            const bandA = new Date(a.staticEtd).getTime();
            const bandB = new Date(b.staticEtd).getTime();

            let comparison = 0;
            if (bandA > bandB) {
                comparison = 1;
            } else if (bandA < bandB) {
                comparison = -1;
            }
            return comparison * -1;
        }
        if (type == 'min') {
            state.sxId = type;
            state.directList.sort(compare2)
            state.transitList.sort(compare2)
            return
        }
        if (type = 'max') {
            state.sxId = type;
            state.directList.sort(compare)
            state.transitList.sort(compare)
            return
        }
    }
    function HcPx(type) {
        function compare(a, b) {
            // 使用 toUpperCase() 忽略字符大小写 
            const bandA = getSumTime(a.staticEta, a.staticEtd);
            const bandB = getSumTime(b.staticEta, b.staticEtd);

            let comparison = 0;
            if (bandA > bandB) {
                comparison = 1;
            } else if (bandA < bandB) {
                comparison = -1;
            }
            return comparison;
        }
        function compare2(a, b) {
            // 使用 toUpperCase() 忽略字符大小写 
            const bandA = getSumTime(a.staticEta, a.staticEtd);
            const bandB = getSumTime(b.staticEta, b.staticEtd);

            let comparison = 0;
            if (bandA > bandB) {
                comparison = 1;
            } else if (bandA < bandB) {
                comparison = -1;
            }
            return comparison * -1;
        }
        if (type == 'min') {
            state.sxId2 = type;
            state.directList.sort(compare2)
            state.transitList.sort(compare2)
            return
        }
        if (type = 'max') {
            state.sxId2 = type;
            state.directList.sort(compare)
            state.transitList.sort(compare)
            return
        }
    }
    async function messageBox(row) {
        if (!row.vessel) return ElMessage.warning('暂无数据')
        /* window.open('https://www.shipxy.com/') */
        agent.ipcRequest("shippingWebView/opt", 'close');
        agent.ipcRequest('shippingWebView/shippingWebView', '/internal/cdw?iframe=http://60.205.250.22:8909/lv_zm/&&vessel=' + row.vessel)
    }
    function historyDel(row) {
        console.log(row);
        let query = JSON.parse(window.sessionStorage.getItem('query'));
        let newQuery = query.filter((t) => {
            if (t.id != row.id) {
                return t
            }
        })
        console.log(newQuery);
        window.sessionStorage.setItem('query', JSON.stringify(newQuery));
        state.historyQueryList = newQuery;
    }
    /* 直达方案组 */
    const zdSum = computed(() => {
        let i = 0;
        state.directList.forEach((t) => {
            i += t.shareCabins.length
        })
        return i
    })
    const zzSum = computed(() => {
        let i = 0;
        state.transitList.forEach((t) => {
            i += t.shareCabins.length
        })
        return i
    })
    onMounted(() => {
        computedHistoryQuery();
    })
    return reactive({
        state,
        watchDestInput,
        getDesPort,
        getPolPort,
        selectDesPort,
        confirmQuery,
        searchBtn,
        getPolCode,
        getPodCode,
        getSumTime,
        getKHTime,
        getPortNumber,
        disabledDate,
        getMonday,
        getDay,
        handleDay,
        handleSX,
        handleCheckAllChange,
        handleCheckAllChange2,
        handleCheckAllChange3,
        handleCheckedCitiesChange,
        handleCheckedCitiesChange2,
        handleCheckedCitiesChange3,
        checkAll,
        checkAll2,
        checkAll3,
        clearQuery,
        addQuery,
        getList,
        ETDPx,
        HcPx,
        messageBox,
        historyDel,
        zdSum,
        zzSum
    })
}
function useDialog() {
    const state = reactive({
        DialogVisible: false,
        rows: {},
        portList: []
    })
    function openDialog(row) {
        if (row.kb == '空班') return
        state.rows = row;
        console.log(state.rows);
        state.portList = [];
        state.portList.push({
            staticEtd: row.staticEtd,
            etd: row.etd,
            vessel: row.vessel,
            voyage: row.voyage,
            port: row.pol,
            title: '起运港'
        })
        if (row.transitPortEn) {
            state.portList.push({
                vessel: row.vesselAfterTransit,
                voyage: row.voyageAfterTransit,
                port: row.transitPortEn,
                title: '中转港'
            })
        }
        if (row.secondTransitPortEn) {
            state.portList.push({
                vessel: row.secondVesselAfterTransit,
                voyage: row.secondVoyageAfterTransit,
                port: row.secondTransitPortEn,
                title: '中转港'
            })
        }
        if (row.thirdTransitPortEn) {
            state.portList.push({
                vessel: row.thirdVesselAfterTransit,
                voyage: row.thirdVoyageAfterTransit,
                port: row.thirdTransitPortEn,
                title: '中转港'
            })
        }
        state.portList.push({
            staticEtd: row.staticEta,
            etd: row.eta,
            port: row.pod,
            title: '目的港'
        })
        state.DialogVisible = true;
    }
    return reactive({
        openDialog,
        state
    })
}
export default defineComponent({
    components: {
        ArrowLeft,
        ArrowRight,
        Expand,
        Fold,
        AppDestPortContent,
        Close
    },
    setup() {

        const table = useTable();
        const query = useQuery();
        const dialog = useDialog();
        onMounted(() => {
            table.getDesPort();
            table.getPolPort();
        })
        return {
            query,
            table,
            dialog,
        }
    },
})
</script>

<style lang="scss" scoped>
$main-color: #3c4144;
$main-bgColor: #02AF9E;
$main-fontSize: 14px;

::v-deep .el-select-dropdown__list {
    min-width: 280px;
}


.container {
    width: 100%;
    height: 100%;
    padding: 10px;
    background-color: #fff;
    box-sizing: border-box;
}

.header-container {
    padding: 20px 0;
    background: #fff;
}

.header-box {
    width: 100%;
    padding: 0 3.8%;
}

.freight-search-container {
    width: 950px;
    margin: 20px auto 20px;
    background: $main-bgColor;
    border-radius: 4px;
    height: 60px;
    display: flex;

    .search-group {
        background: white;
        height: 54px;
        margin-top: 3px;
        margin-left: 3px;
        width: 850px;
        display: flex;

        .search-group-item {
            padding: 10px 16px;
            position: relative;

            img {
                position: absolute;
                top: 30px;
                left: 17px;
                z-index: 10;
            }

            .search-group-item-title {
                font-size: 12px;
                color: #969799;
            }

            .search-port-select {
                width: 180px;

                :deep(.el-input__inner) {
                    border: none;
                    height: 25px;
                    padding: 0 22px;
                }

                :deep(.el-input__icon) {
                    height: 22px;
                    line-height: 22px;
                }

                :deep(.el-icon:nth-child(1)) {
                    display: none;
                }
            }

            .search-port-daterange {
                width: 180px;

                :deep(.el-input__inner) {
                    border: none !important;
                    height: 25px !important;
                    padding: 3px 22px;
                    // padding: 0 22px !important;
                }

                :deep(.el-range-separator) {
                    color: white;
                }

                /* :deep(.el-icon) {
                    display: none;
                } */
            }
        }
    }

    .search-icon {
        width: 97px;
        height: 34px;
        padding: 12px 0;
        cursor: pointer;
    }
}

::v-deep .el-input--mini .el-input__inner {
    border: none
}

.history-container {
    padding: 15px;
    display: flex;
    color: $main-color;
    font-size: 14px;
    flex-wrap: nowrap;

    .title {
        font-weight: 500;
        line-height: 28px;
        width: 70px
    }

    .body {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 12px;
        width: calc(100% - 70px);

        div {
            background-color: #f2f3f5;
            padding: 4px 14px;
            line-height: 22px;
            margin-right: 8px;
            margin-bottom: 6px;
            cursor: pointer;
            border-radius: 2px;
            padding: 4px 14px;
            display: flex;
            align-items: center;
        }
    }
}

.tabs-container {
    background-color: #fff;
    display: flex;
    border: 1px solid rgb(242, 242, 242);

    .prev {
        width: 45px;
        height: 40px;
        padding: 8px 0;
        box-sizing: border-box;

        div {
            height: 100%;
            border-right: 1px solid #ddd;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .body {
        width: calc(100% - 90px);
        box-sizing: border-box;
        display: flex;
        font-size: 12px;
        color: $main-color;
        cursor: pointer;

        .body-item {
            width: 25%;
            padding: 8px 0;

            div {
                height: 100%;
                width: 100%;
                border-right: 1px solid #ddd;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }

    .next {
        width: 45px;
        height: 40px;
        padding: 8px 0;
        box-sizing: border-box;

        div {
            height: 100%;
            border-left: 1px solid #ddd;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}

.history-active {
    background-color: #cdefec !important;
    color: $main-bgColor;
}

.tabs-active {
    border-bottom: 2px solid $main-bgColor;
    color: $main-bgColor;
    font-weight: bold;
}

.body-container {
    display: flex;
    padding-top: 15px;

    .left-tabs {
        width: 14.7%;
        border: 1px solid #f2f2f2;
        padding: 16px;
        background-color: #fff;

        .title {
            min-height: 28px;
            border-bottom: 1px solid #f2f2f2;
            font-weight: 700;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
        }

        .checkbox {
            padding: 15px 0;
            border-bottom: 1px solid #f2f2f2;

            ::v-deep .el-checkbox {
                width: 50%;
                margin-right: 0;
                font-size: 12px;
            }

            ::v-deep .el-checkbox__label {
                font-size: 12px;
            }
        }

        .shipping {
            .shipping-title {
                width: 100%;
                height: 48px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #f2f2f2;
            }

            .shipping-body {
                padding: 15px 0;
                width: 100%;
                border-bottom: 1px solid #f2f2f2;

                ::v-deep .el-checkbox {
                    width: 50%;
                    margin-right: 0;
                    font-size: 12px;
                }

                ::v-deep .el-checkbox__label {
                    font-size: 12px;
                }
            }
        }

        .time {
            .time-title {
                width: 100%;
                height: 48px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #f2f2f2;
            }

            .time-body {
                padding: 15px 0;
                border-bottom: 1px solid #f2f2f2;

                .ETD {
                    ::v-deep .el-checkbox {
                        margin-right: 10px;
                        font-size: 12px;
                        display: block;
                    }

                    ::v-deep .el-checkbox-group {
                        display: flex;
                        justify-content: space-between;
                    }

                    ::v-deep .el-checkbox__label {
                        font-size: 12px;
                        display: block;
                        padding-left: 0;
                    }

                    ::v-deep .el-slider__button {
                        width: 15px;
                        height: 15px;
                    }

                    ::v-deep .el-slider {
                        padding: 0 5px;
                    }

                    .number {
                        display: flex;
                        justify-content: space-between;
                        margin-top: -8px;
                    }
                }
            }

            .btn {
                margin: 20px auto 0;
                padding: 8px 22px;
                text-align: center;
                color: #fff;
                background-color: #3567df;
                width: 100px;
                border-radius: 20px;
                cursor: pointer;
            }
        }
    }

    .left-tabs2 {
        background: #fff;
        border-radius: 6px;
        width: 50px;
        border: 1px solid #f2f2f2;
        padding: 16px;
        box-sizing: border-box;
        font-size: 12px;
        color: #282828;
        font-weight: 600;
        letter-spacing: 0.5em;
    }

    .right-table {
        margin-left: 1.5%;
        width: 83.8%;

        .table-title {
            width: 100%;
            padding: 0 40px;
            height: 40px;
            display: flex;
            align-items: center;
            box-sizing: border-box;

            .title-item {
                text-align: left;
                font-weight: 600;
                font-size: 12px;
            }

            .title-item:nth-child(1) {
                width: 10%;
                display: flex;
            }

            .title-item:nth-child(2) {
                width: 8%;
                display: flex;
            }

            .title-item:nth-child(3) {
                width: 8%;
            }

            .title-item:nth-child(4) {
                width: 38%;
            }

            .title-item:nth-child(5) {
                width: 27.4%;
            }

            .title-item:nth-child(6) {
                width: 7%;
                text-align: center;
            }

            /*             .title-item:nth-child(7) {
                width: 6%;
                text-align: center;
            } */
        }

        .table-body {
            padding: 0px 20px 0px;
            background: rgb(255, 255, 255);
            border-radius: 4px;
            border: 1px solid rgb(242, 242, 242);
            width: 100%;
            box-sizing: border-box;

            .body-title {
                height: 56px !important;
                font-size: 14px;
                font-weight: 700;
                line-height: 56px;
                border-bottom: 1px solid #f2f2f2;
            }

            .body-item {
                height: 56px !important;
                background-color: #fff;
                padding: 0 20px;
                display: flex;
                align-items: center;
                position: relative;
                border-bottom: 1px solid #f2f2f2;

                div {
                    text-align: left;
                    position: relative;
                    font-size: 12px;
                    overflow: hidden;
                    box-sizing: border-box;
                    border-right: 10px solid transparent;
                }

                div:nth-child(1) {
                    width: 10.4%;
                    font-weight: 600;
                }

                div:nth-child(2) {
                    width: 8.4%;
                }

                div:nth-child(3) {
                    width: 8.4%;
                }

                div:nth-child(4) {
                    width: 40%;
                }

                div:nth-child(5) {
                    width: 22.5%;
                    color: rgb(0, 124, 227);
                    cursor: pointer;
                }

                div:nth-child(6) {
                    width: 105px;
                    text-align: center;
                    cursor: pointer;
                }

                div:nth-child(7) {
                    width: 10%;
                    text-align: center;
                }

                /* 
                div:nth-child(8) {
                    width: 7%;
                    text-align: center;

                } */
            }
        }
    }
}

.transition {
    transition: 0.2s linear all;
}

.transform {
    transform: rotate(90deg);
}

.right-table2 {
    width: 94% !important;
}

.dest-port-select {
    :deep(.el-input__inner) {
        border: none;
        height: 20px;
        padding-left: 2px;
    }

    :deep(.el-input__icon) {
        height: 20px;
        line-height: 20px;
    }
}

.select-port-popper {
    padding: 0 !important;

    .el-popper__arrow {
        display: none;
    }
}

.desPort-selectde-content {
    padding: 3px 0 3px 20px;
    width: 160px;

    div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 18px;
    }
}

.dest-port-btn {
    width: 120px;
    position: absolute;
    left: 0;
    opacity: 0;
    cursor: pointer;
    top: 16px;
}

.dest-port-select {
    :deep(.el-input__inner) {
        border: none;
        height: 20px;
        padding-left: 2px;
    }

    :deep(.el-input__icon) {
        height: 20px;
        line-height: 20px;
    }
}

.inputQuery {
    overflow: auto;
    padding: 0 !important;

    .inputQuery-header {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        font-weight: bold;
        background: #409eff;
        color: white;
        padding: 6px 10px;
    }

    .container-items {
        display: flex;
        justify-content: space-between;
        line-height: 30px;
        cursor: pointer;
        padding: 0 10px;
    }

    .container-items:hover {
        background-color: #e6f5ff;
    }
}

.inputQuery::-webkit-scrollbar {
    display: none;
}

::v-deep .el-popover.el-popper {
    padding: 0;
}

::v-deep .freight-search-container .search-group .search-group-item .search-port-daterange .el-range-separator {
    color: #3c4144;
    font-size: 12px;
    line-height: 18px;
}

::v-deep .freight-search-container .search-group .search-group-item .search-port-daterange .el-icon {
    display: flex;
}

::v-deep .destport-tabs .el-tabs__item.is-active {
    color: $main-bgColor;
}

::v-deep .destport-tabs .el-tabs__active-bar {
    background-color: $main-bgColor;
}

::v-deep .destport-list .destport-item:hover {
    background-color: #cdefec;
}

::v-deep .destport-list .destport-item:hover .destport-cn {
    color: $main-bgColor  !important;
}

::v-deep .destport-list .destport-item:hover .destport-en {
    color: $main-bgColor  !important;
}

::v-deep .destport-tabs .el-tabs__item:hover {
    color: $main-bgColor;
}

::v-deep .destport-tabs .el-tabs__item.is-active:hover {

    color: $main-bgColor;
}

::v-deep .destport-title .destport-blue {
    background: $main-bgColor;
}

::v-deep .el-input__prefix {
    left: -5px;
    top: -1px;
    font-size: 16px;
}

.kb-active {
    color: rgb(144, 144, 144) !important
}

.px {
    display: flex;
    margin-left: 5px;
    position: relative;

    div:nth-child(1) {
        position: absolute;
        top: -3px;
        border: 5px solid transparent;
        border-bottom: 5px solid #d9d9d9;
    }

    div:nth-child(2) {
        position: absolute;
        top: 9px;
        border: 5px solid transparent;
        border-top: 5px solid #d9d9d9;
    }
}

.px-active-top {
    border-top: 5px solid $main-bgColor  !important;
}

.px-active-bottom {
    border-bottom: 5px solid $main-bgColor  !important;
}
</style>
<style lang="scss">
$main-bgColor: #02AF9E;

.data-picker-shippingQuery {
    .el-date-table td.available:hover {
        color: $main-bgColor;
    }

    td.today {
        color: $main-bgColor;
    }

    // .el-date-table td.today .el-date-table-cell__text{
    //     color: #fd953e!important
    // }

    .el-date-table td.end-date .el-date-table-cell__text,
    .el-date-table td.start-date .el-date-table-cell__text {
        background: #cdefec;
        color: $main-bgColor;
    }

    .el-date-table td.current:not(.disabled) .el-date-table-cell__text {
        background: #cdefec;
        color: $main-bgColor;
    }

    .el-date-table td.today .el-date-table-cell__text {
        color: $main-bgColor;
    }

    .el-date-table td.today.end-date .el-date-table-cell__text,
    .el-date-table td.today.start-date .el-date-table-cell__text {
        color: $main-bgColor;
    }
}

.shippingQueryDialog {
    .el-dialog__body {
        padding: 0 20px 20px 20px;
    }

    .dialog-title {
        display: flex;
        font-size: 14px;
        color: #282828;

        .port {
            margin-right: 20px;
            font-weight: 700;
        }

        .sanjiao {
            width: 40px;
            height: 0;
            border: 1px solid #d1d1d1;
            background: #d1d1d1;
            margin: 8px 20px 0 0;
            position: relative;
            border-radius: 4px;

            span {
                position: absolute;
                width: 0;
                height: 6px;
                background: #d1d1d1;
                border: 1px solid #d1d1d1;
                transform: rotate(-45deg);
                right: 0;
                top: -6px;
                border-radius: 2px;
            }
        }
    }

    .dialog-body {
        margin-top: 20px;
        display: flex;
        width: 100%;

        .left {
            width: 53%;
            font-size: 12px;
            min-height: 380px;

            .left-container {
                color: #282828;

                .container-title {
                    display: flex;
                    align-items: center;
                    font-weight: 700;

                    div:nth-child(1) {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: rgb(53, 103, 223);
                        margin-right: 15px;
                    }

                }

                .container-body {
                    display: flex;

                    .container-body-item1 {
                        width: 2px;
                        margin-left: 5px;
                        background-color: rgb(53, 103, 223);
                        margin-right: 15px;
                    }

                    .container-body-item2 {
                        padding-top: 5px;

                        div {
                            padding: 5px 0 5px 0px;
                            margin-left: 5px;
                            display: flex;
                            margin-right: 15px;
                            align-items: center;
                        }

                        .vessel {
                            position: relative;
                            width: 100%;
                            margin: 15px 0 30px 0px;

                            div {
                                background-color: #f8f8f8;
                                color: #909090;
                                height: 33px;
                                width: 100%;
                                padding: 0;
                                padding-left: 15px;
                                line-height: 33px;
                            }
                        }
                    }
                }
            }
        }

        .right {
            width: 47%;
            border-left: 1px solid #f2f2f2;
            padding-left: 20px;

            .right-container {
                display: flex;
                background: #f8f8f8;
                border-radius: 4px;
                height: 155px;
                flex-wrap: wrap;
                padding: 10px;

                .right-container-item {
                    width: 50%;
                    font-size: 12px;

                    div:nth-child(1) {
                        color: #909090;
                        margin-bottom: 5px;
                    }

                    div:nth-child(2) {
                        color: #282828;
                        margin-bottom: 18px;
                    }
                }
            }
        }
    }
}

.line-active {
    background-color: #fff !important;
}

.el-popper.is-light {
    padding: 0 !important;
}

.polPortStyle {
    display: flex;
    justify-content: space-between;
}

.shippingQuery .el-select-dropdown__item {
    padding: 0 10px;
    min-width: 280px;
}

.shippingQuery .el-select-dropdown__list {
    padding-top: 30px !important;
}
</style>