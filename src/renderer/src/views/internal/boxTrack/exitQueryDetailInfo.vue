<template>
    <div v-loading="state.loading">
        <div class="mbx">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/internal/exitQuery' }">宁波港跟踪列表</el-breadcrumb-item>
                <el-breadcrumb-item>跟踪详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="dateilInfo">
            <div class="td-title">
                <div>{{ state.Id ? '提单号：' : '箱号：' }}{{ state.Id ? state.Id : state.Id2 }}</div>
                <div>更新时间：{{ state.detailInfo.UpdateTime ? state.detailInfo.UpdateTime : '--' }}</div>
            </div>
            <div class="city-container">
                <div class="city-item1">
                    <div>
                        <img style="object-fit:contain" src="@/assets/logo.png" />
                    </div>
                    <div style="width:100%"><span style="margin-right: 5px;">{{ state.carrierCode }}</span><span style="overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;"><a class="site" @click="openGw(state.detailInfo.CarrierUrl)">[官网]</a>&nbsp;&nbsp;&nbsp;&nbsp;
                            {{ state.vessel ? state.vessel : '--' }} / {{
                                    state.voyage ? state.voyage : '--'
                            }}</span></div>
                </div>
                <div class="city-item2">
                    <div>
                        <div style="margin-bottom:5px;text-align: right;width:167px;overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;">{{ getPortInfo(2, 'name') }}
                        </div>
                        <div style="text-align: right;width:167px;overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;">{{ getPortInfo(2, 'nameCN') }}
                        </div>
                    </div>
                    <div class="days">
                        <div style="font-size: 12px;
color: #606266;text-align:center">{{ state.timeDiff }} 天 <template v-if="state.detailInfo.Place">{{ isPortType ? '中转' :
        '直达'
}}</template><template v-else>--</template></div>
                        <div>
                            <img src="@/assets/boxTrack/jt.svg" alt="">
                        </div>
                    </div>
                    <div>
                        <div style="margin-bottom:5px;width:167px;overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;">{{ getPortInfo(4, 'name') }}</div>
                        <div style="width:167px;overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;">{{ getPortInfo(4, 'nameCN') }}</div>
                    </div>
                </div>
                <div class="city-item3">
                    <div>码头：{{ state.detailInfo.TerminalPlanTerminalName ? state.detailInfo.TerminalPlanTerminalName :
                            '--'
                    }}（{{ state.detailInfo.TerminalPlanTerminalCode ? state.detailInfo.TerminalPlanTerminalCode :
        '--'
}}）</div>
                    <div style="margin-top:8px;display: flex;">
                        <span style="width:165px;display: block;">进箱开始：
                            {{ state.openDate ? state.openDate.substring(0, 16) : '--' }}
                        </span>
                        <span style="margin-left:30px;">抵港：{{ state.eta ? state.eta.substring(0, 16) : '--' }}(预)</span>
                    </div>
                    <div style="margin-top:4px;color: #969799;display: flex;">
                        <span style="width:165px;display: block;">进箱截止： {{ state.closeDate ?
                                state.closeDate.substring(0, 16)
                                : '--'
                        }}</span>
                        <span style="margin-left:30px">离港：{{ state.atd ? state.atd.substring(0, 16) : '--' }}(实)</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="detailInfo2">
            <div class="statuesTitle">
                <div class="solid"></div>
                <div class="status-container">
                    <div>
                        <div class="status-item" :class="getStatus('BKCF') ? 'background-success' : ''">
                        </div>
                    </div>
                    <div>
                        <div class="status-item" :class="getStatus('EPRL') ? 'background-success' : ''">
                        </div>
                    </div>
                    <div>
                        <div class="status-item" :class="getStatus('STSP') ? 'background-success' : ''"></div>
                    </div>
                    <div>
                        <div class="status-item" :class="getStatus('GITM') ? 'background-success' : ''"></div>
                    </div>
                    <div>
                        <div class="status-item" :class="getStatus('PASS') ? 'background-success' : ''"></div>
                    </div>
                    <div>
                        <div class="status-item" :class="getStatus('TMPS') ? 'background-success' : ''"></div>
                    </div>
                    <div>
                        <div class="status-item" :class="getStatus('PRLD') ? 'background-success' : ''"></div>
                    </div>
                    <div>
                        <div class="status-item" :class="getStatus('LOBD') ? 'background-success' : ''"></div>
                    </div>
                    <div>
                        <div class="status-item" :class="getStatus('DLPT') ? 'background-success' : ''"></div>
                        <div class="haiyun"><img src="@/assets/boxTrack/haiyun.svg" alt=""></div>
                        <div class="boxk" @click="hxgj">航线轨迹</div>
                        <div class="jts"></div>
                    </div>
                    <div>
                        <div class="status-item" :class="getStatus('BDAR') ? 'background-success' : ''"></div>
                    </div>
                    <div>
                        <div class="status-item" :class="getStatus('STCS') ? 'background-success' : ''"></div>
                    </div>
                    <div>
                        <div class="status-item" :class="getStatus('RCVE') ? 'background-success' : ''"></div>
                    </div>
                </div>
            </div>
            <div class="statuesText">
                <div class="text-item" :class="getStatus('BKCF') ? 'text-success' : ''">
                    <div>订舱</div>
                    <div class="font-size-12">{{ getBoxTime('BKCF', 0) }}</div>
                    <div class="font-size-12">{{ getBoxTime('BKCF', 1) }}</div>
                    <div class="font-size-12 margin-top-16">箱量：<span>{{ getBoxNumber('BKCF') }}/{{ state.boxs.length
                    }}</span>
                    </div>
                </div>
                <div class="text-item" :class="getStatus('EPRL') ? 'text-success' : ''">
                    <div>放箱</div>
                    <div class="font-size-12">{{ getBoxTime('EPRL', 0) }}</div>
                    <div class="font-size-12">{{ getBoxTime('EPRL', 1) }}</div>
                    <div class="font-size-12 margin-top-16">箱量：<span>{{ getBoxNumber('EPRL') }}/{{ state.boxs.length
                    }}</span></div>
                </div>
                <div class="text-item" :class="getStatus('STSP') ? 'text-success' : ''">
                    <div>提空箱</div>
                    <div class="font-size-12">{{ getBoxTime('STSP', 0) }}</div>
                    <div class="font-size-12">{{ getBoxTime('STSP', 1) }}</div>
                    <div class="font-size-12 margin-top-16">箱量：<span>{{ getBoxNumber('STSP') }}/{{ state.boxs.length
                    }}</span></div>
                </div>
                <div class="text-item" :class="getStatus('GITM') ? 'text-success' : ''">
                    <div>进场</div>
                    <div class="font-size-12">{{ getBoxTime('GITM', 0) }}</div>
                    <div class="font-size-12">{{ getBoxTime('GITM', 1) }}</div>
                    <div class="font-size-12 margin-top-16">箱量：<span>{{ getBoxNumber('GITM') }}/{{ state.boxs.length
                    }}</span></div>
                </div>
                <div class="text-item" :class="getStatus('PASS') ? 'text-success' : ''">
                    <div>海关放行</div>
                    <div class="font-size-12">{{ getBoxTime('PASS', 0) }}</div>
                    <div class="font-size-12">{{ getBoxTime('PASS', 1) }}</div>
                    <div class="font-size-12 margin-top-16">箱量：<span>{{ getBoxNumber('PASS') }}/{{ state.boxs.length
                    }}</span></div>
                </div>
                <div class="text-item" :class="getStatus('TMPS') ? 'text-success' : ''">
                    <div>码头放行</div>
                    <div class="font-size-12">{{ getBoxTime('TMPS', 0) }}</div>
                    <div class="font-size-12">{{ getBoxTime('TMPS', 1) }}</div>
                    <div class="font-size-12 margin-top-16">箱量：<span>{{ getBoxNumber('TMPS') }}/{{ state.boxs.length
                    }}</span></div>
                </div>
                <div class="text-item" :class="getStatus('PRLD') ? 'text-success' : ''">
                    <div>配载</div>
                    <div class="font-size-12">{{ getBoxTime('PRLD', 0) }}</div>
                    <div class="font-size-12">{{ getBoxTime('PRLD', 1) }}</div>
                    <div class="font-size-12 margin-top-16">箱量：<span>{{ getBoxNumber('PRLD') }}/{{ state.boxs.length
                    }}</span></div>
                </div>
                <div class="text-item" :class="getStatus('LOBD') ? 'text-success' : ''">
                    <div>装船</div>
                    <div class="font-size-12">{{ getBoxTime('LOBD', 0) }}</div>
                    <div class="font-size-12">{{ getBoxTime('LOBD', 1) }}</div>
                    <div class="font-size-12 margin-top-16">箱量：<span>{{ getBoxNumber('LOBD') }}/{{ state.boxs.length
                    }}</span></div>
                </div>
                <div class="text-item" :class="getStatus('DLPT') ? 'text-success' : ''">
                    <div>开船</div>
                    <div class="font-size-12">{{ getBoxTime('DLPT', 0) }}</div>
                    <div class="font-size-12">{{ getBoxTime('DLPT', 1) }}</div>
                    <div class="font-size-12 margin-top-16">箱量：<span>{{ getBoxNumber('DLPT') }}/{{ state.boxs.length
                    }}</span></div>
                </div>
                <div class="text-item" :class="getStatus('BDAR') ? 'text-success' : ''">
                    <div>抵港</div>
                    <div class="font-size-12">{{ getBoxTime('BDAR', 0) }}</div>
                    <div class="font-size-12">{{ getBoxTime('BDAR', 1) }}</div>
                    <div class="font-size-12 margin-top-16">箱量：<span>{{ getBoxNumber('BDAR') }}/{{ state.boxs.length
                    }}</span></div>
                </div>
                <div class="text-item" :class="getStatus('STCS') ? 'text-success' : ''">
                    <div>提柜</div>
                    <div class="font-size-12">{{ getBoxTime('STCS', 0) }}</div>
                    <div class="font-size-12">{{ getBoxTime('STCS', 1) }}</div>
                    <div class="font-size-12 margin-top-16">箱量：<span>{{ getBoxNumber('STCS') }}/{{ state.boxs.length
                    }}</span></div>
                </div>
                <div class="text-item" :class="getStatus('RCVE') ? 'text-success' : ''">
                    <div>还箱</div>
                    <div class="font-size-12">{{ getBoxTime('RCVE', 0) }}</div>
                    <div class="font-size-12">{{ getBoxTime('RCVE', 1) }}</div>
                    <div class="font-size-12 margin-top-16">箱量：<span>{{ getBoxNumber('RCVE') }}/{{ state.boxs.length
                    }}</span></div>
                </div>
            </div>
        </div>
        <div class="detailInfo3">
            <el-tabs type="card" class="demo-tabs" v-model="status" @tab-change="handleClick">
                <el-tab-pane label="按箱查看" name="box"></el-tab-pane>
                <el-tab-pane label="按预配单号查看" name="code" disabled></el-tab-pane>
            </el-tabs>
            <div class="detailInfo3-body">
                <div class="body-header">

                    <!-- <div class="header-item header-item-active">
                    <div>箱号：OTPU6191034</div>
                    <div></div>
                    <div>提空箱</div>
                </div>
                <div class="header-item">
                    <div>箱号：OTPU6191034</div>
                    <div class="background-error"></div>
                    <div>提空箱</div>
                </div>
                <div class="header-item">
                    <div>箱号：OTPU6191034</div>
                    <div></div>
                    <div>提空箱</div>
                </div>
                <div class="header-item">
                    <div>箱号：OTPU6191034</div>
                    <div></div>
                    <div>提空箱</div>
                </div> -->
                    <div class="header-item" v-for="(item, index) in state.boxs" :key="index"
                        :class="item.Id == state.currentBox.Id ? 'header-item-active' : ''" @click="clickBox(item.Id)">
                        <div>箱号：{{ item.containerNo }}</div>
                        <div :class="getStatus('TMUT') || getStatus('SUOT') ? 'header-item-error' : ''"></div>
                        <div>{{ getMaxTime(item.containerNo) }}</div>
                    </div>
                </div>
                <div class="body-container">
                    <div class="body-left">
                        <div class="left-descript">
                            <div class="descript-title">箱货数据</div>
                            <div class="descript-body">
                                <el-descriptions class="margin-top" :column="3" size="small" border>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                箱状态
                                            </div>
                                        </template>
                                        {{ getBoxStatus }}
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                箱号
                                            </div>
                                        </template>
                                        {{ state.currentBox.containerNo ? state.currentBox.containerNo : '--' }}
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                铅封号
                                            </div>
                                        </template>
                                        {{ state.currentBox.sealNo ? state.currentBox.sealNo : '--' }}
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                装货港
                                            </div>
                                        </template>
                                        <!-- {{ getBoxPort('polEDI') }} -->
                                        {{ getPortInfo(2, 'name') }}
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                卸货港
                                            </div>
                                        </template>
                                        <!-- {{ getBoxPort('podEDI') }} -->
                                        {{ getPortInfo(3, 'name') !== '--' ? getPortInfo(3, 'name') : getPortInfo(4,
                                                'name')
                                        }}
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                目的港
                                            </div>
                                        </template>
                                        <!-- {{ getBoxPort('dstEDI') }} -->
                                        {{ getPortInfo(4, 'name') }}
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                箱型
                                            </div>
                                        </template>
                                        {{ getBoxPort('csize') == '--' ? '' : getBoxPort('csize') }}
                                        {{ getBoxPort('ctype') == '--' ? '' : getBoxPort('ctype') }}
                                        {{ getBoxPort('cheightcn') == '--' ? '' : getBoxPort('cheightcn') }}
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                箱货重
                                            </div>
                                        </template>
                                        {{ getBoxPort('ctnGrossWeight') }} KG
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                箱皮重
                                            </div>
                                        </template>
                                        {{ getBoxPort('ctnTareWeight') }} KG
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                持箱人
                                            </div>
                                        </template>
                                        {{ state.currentBox.containerOwner ? state.currentBox.containerOwner : '--' }}
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                VGM报文接收
                                            </div>
                                        </template>
                                        {{ getVGMInfo('vgmEDITime') }}
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                VGM(船公司)
                                            </div>
                                        </template>
                                        {{ getVGMInfo('vgmWeight') }}
                                    </el-descriptions-item>
                                </el-descriptions>
                            </div>
                        </div>
                        <div class="left-descript">
                            <div class="descript-title">运抵报告状态</div>
                            <div class="descript-body">
                                <el-descriptions class="margin-top" :column="7" size="small" border
                                    direction="vertical">
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                状态
                                            </div>
                                        </template>
                                        <div class="font-size-12">--</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                运抵报文发送时间
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ getBoxPort('reportSendTime') }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                箱预录时间
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ getBoxPort('preRecordTime') }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                箱号
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ getBoxPort('containerNo') }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                提单号
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ state.currentBox.billNO ? state.currentBox.billNO :
                                                '--'
                                        }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                船名
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ state.currentBox.vslName ? state.currentBox.vslName
                                                :
                                                '--'
                                        }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                航次
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ state.currentBox.voy ? state.currentBox.voy :
                                                '--'
                                        }}</div>
                                    </el-descriptions-item>
                                </el-descriptions>
                            </div>
                        </div>
                        <div class="left-descript">
                            <div class="descript-title">预配舱单状态</div>
                            <div class="descript-body">
                                <el-descriptions class="margin-top" :column="8" size="small" border
                                    direction="vertical">
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                船公司操作
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ state.currentBox.carrierOperate ?
                                                state.currentBox.carrierOperate : '--'
                                        }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                海关放行
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ currentBoxStatus('PASS') == '--' ? '--' :
                                                currentBoxStatus('PASS') ? 'Y' : 'N'
                                        }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                箱号
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ getBoxPort('containerNo') }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                提单号
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ state.currentBox.billNO ?
                                                state.currentBox.billNO : '--'
                                        }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                件数
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ getBoxPort('subPieces') }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                毛重(KGS)
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ getBoxPort('subWeight') }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                体积(m³)
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ getBoxPort('subVolume') }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                回执时间
                                            </div>
                                        </template>
                                        <div class="font-size-12">--</div>
                                    </el-descriptions-item>
                                </el-descriptions>
                            </div>
                        </div>
                        <div class="left-descript">
                            <div class="descript-title">作业状态</div>
                            <div class="descript-body">
                                <el-descriptions class="margin-top" :column="7" size="small" border
                                    direction="vertical">
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                计划类型
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ getBoxPort('reportSendTime') }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                受理时间
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ state.currentBox.arrangeTime ?
                                                state.currentBox.arrangeTime : '--'
                                        }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                计划开始时间
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ state.currentBox.startTime ?
                                                state.currentBox.startTime : '--'
                                        }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                计划结束时间
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ state.currentBox.endTime ?
                                                state.currentBox.endTime : '--'
                                        }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                码头放行
                                            </div>
                                        </template>
                                        <div class="font-size-12">
                                            {{ currentBoxStatus('TMPS') == '--' ? '--' :
                                                    currentBoxStatus('TMPS') ? 'Y' : 'N'
                                            }}
                                        </div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                状态
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ state.currentBox.status ?
                                                state.currentBox.status : '--'
                                        }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                是否甩柜
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ state.currentBox.offLoad ?
                                                'Y' : 'N'
                                        }}</div>
                                    </el-descriptions-item>
                                </el-descriptions>
                            </div>
                        </div>
                        <div class="left-descript" style="width:50%">
                            <div class="descript-title">抵港状态</div>
                            <div class="descript-body">
                                <el-descriptions class="margin-top" :column="4" size="small" border
                                    direction="vertical">
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                抵港状态
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ getDgStatus('BDAR', 'isEsti') == 'N' ?
                                                'Y' : 'N'
                                        }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                抵港时间
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ getDgStatus('BDAR', 'eventTime') }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                还箱状态
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ getDgStatus('RCVE', 'isEsti') == 'N' ?
                                                'Y' : 'N'
                                        }}</div>
                                    </el-descriptions-item>
                                    <el-descriptions-item>
                                        <template #label>
                                            <div class="cell-item">
                                                还箱时间
                                            </div>
                                        </template>
                                        <div class="font-size-12">{{ getDgStatus('RCVE', 'eventTime') }}</div>
                                    </el-descriptions-item>
                                </el-descriptions>
                            </div>
                        </div>
                    </div>
                    <div class="body-right" v-if="state.detailInfo.Place">
                        <!-- 有中转港 -->
                        <div class="right-step" v-if="isPortType">
                            <div>
                                <el-steps direction="vertical" :active="getRightStatus2">
                                    <el-step :icon="CircleCheckFilled">
                                        <template #title>
                                            <div style="height: 35px;" :class="getRightStatus2 >= 0 ? 'actives2' : ''">
                                                接货地:
                                                {{ getPortInfo(1, 'name') }}
                                                <!-- {{ state.detailInfo.Place[0].name ?
                                                state.detailInfo.Place[0].name : '--'
                                        }} -->
                                            </div>
                                        </template>
                                    </el-step>

                                    <el-step :icon="CircleCheckFilled">
                                        <template #title>
                                            <div :class="getRightStatus2 >= 1 ? 'actives2' : ''">
                                                起始港:
                                                {{ getPortInfo(2, 'name') }}
                                            </div>
                                        </template>
                                        <template #description>
                                            <div>
                                                <div class="step-port-1"
                                                    v-for="(item, index) in getRightBoxStatus(getPortInfo(2, 'name'))"
                                                    :class="getActives(item.isEsti) ? 'actives' : ''" :key="index">
                                                    <span>{{ item.name }}</span>
                                                    <span>{{ item.time }}</span>
                                                </div>
                                                <div class="steo-port-2">
                                                    <div class="width-100">船名:{{
                                                            getVessel(state.detailInfo.FirstVessel).vessel ?
                                                                getVessel(state.detailInfo.FirstVessel).vessel
                                                                : '--'
                                                    }}
                                                    </div>
                                                    <div class="width-100">航次:
                                                        {{ getPortInfo(2, 'PlanVoyage') }}
                                                    </div>
                                                    <div class="width-50">
                                                        <div style="width:100%">IMO:
                                                            {{ getVessel(state.detailInfo.FirstVessel).imo ?
                                                                    getVessel(state.detailInfo.FirstVessel).imo
                                                                    : '--'
                                                            }}
                                                        </div>
                                                        <div style="width:100%">MMSI:
                                                            {{ getVessel(state.detailInfo.FirstVessel).mmsi ?
                                                                    getVessel(state.detailInfo.FirstVessel).mmsi
                                                                    : '--'
                                                            }}
                                                        </div>
                                                    </div>
                                                    <div class="width-50">
                                                        <div style="width:100%">建造日期:
                                                            {{ getVessel(state.detailInfo.FirstVessel).dateBuild ?
                                                                    getVessel(state.detailInfo.FirstVessel).dateBuild
                                                                    : '--'
                                                            }}
                                                        </div>
                                                        <div style="width:100%">船旗帜:
                                                            {{ getVessel(state.detailInfo.FirstVessel).flagName ?
                                                                    getVessel(state.detailInfo.FirstVessel).flagName
                                                                    : '--'
                                                            }}
                                                        </div>
                                                    </div>
                                                    <div class="width-100">
                                                        <div class="width-50">总箱量:
                                                            {{ getVessel(state.detailInfo.FirstVessel).containerSize ?
                                                                    getVessel(state.detailInfo.FirstVessel).containerSize
                                                                    : '--'
                                                            }}
                                                        </div>
                                                        <div class="width-50">运营方:
                                                            {{ getVessel(state.detailInfo.FirstVessel).shipOwner ?
                                                                    getVessel(state.detailInfo.FirstVessel).shipOwner
                                                                    : '--'
                                                            }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </el-step>
                                    <el-step :icon="CircleCheckFilled" v-if="getPortInfo(3, 'name') != '--'">
                                        <template #title>
                                            <div :class="getRightStatus2 >= 2 ? 'actives2' : ''">
                                                中转港:
                                                {{ getPortInfo(3, 'name') }}
                                                <!--  {{ getZzPortInfo(3) }} -->
                                            </div>
                                        </template>
                                        <template #description>
                                            <div>
                                                <div class="step-port-1"
                                                    v-for="(item, index) in getRightBoxStatus(getPortInfo(3, 'name'))"
                                                    :class="getActives(item.isEsti) ? 'actives' : ''" :key="index">
                                                    <span>{{ item.name }}</span>
                                                    <span>{{ item.time }}</span>
                                                </div>
                                                <div class="steo-port-2">
                                                    <div class="width-100">船名:
                                                        {{ getVessel2(state.detailInfo.FirstVessel).vessel ?
                                                                getVessel2(state.detailInfo.FirstVessel).vessel
                                                                : '--'
                                                        }}
                                                        <!-- {{ state.detailInfo.Vessel[1].vessel }} -->
                                                    </div>
                                                    <div class="width-100">航次:
                                                        {{ getPortInfo(3, 'PlanVoyage') }}
                                                    </div>
                                                    <div class="width-50">
                                                        <div style="width:100%">
                                                            IMO:
                                                            {{ getVessel2(state.detailInfo.FirstVessel).imo ?
                                                                    getVessel2(state.detailInfo.FirstVessel).imo
                                                                    : '--'
                                                            }}
                                                        </div>
                                                        <div style="width:100%">MMSI:
                                                            {{ getVessel2(state.detailInfo.FirstVessel).mmsi ?
                                                                    getVessel2(state.detailInfo.FirstVessel).mmsi
                                                                    : '--'
                                                            }}
                                                        </div>
                                                    </div>
                                                    <div class="width-50">
                                                        <div style="width:100%">建造日期:
                                                            {{ getVessel2(state.detailInfo.FirstVessel).dateBuild ?
                                                                    getVessel2(state.detailInfo.FirstVessel).dateBuild
                                                                    : '--'
                                                            }}
                                                        </div>
                                                        <div style="width:100%">船旗帜:
                                                            {{ getVessel2(state.detailInfo.FirstVessel).flagName ?
                                                                    getVessel2(state.detailInfo.FirstVessel).flagName
                                                                    : '--'
                                                            }}
                                                        </div>
                                                    </div>
                                                    <div class="width-100">
                                                        <div class="width-50">总箱量:
                                                            {{ getVessel2(state.detailInfo.FirstVessel).containerSize ?
                                                                    getVessel2(state.detailInfo.FirstVessel).containerSize
                                                                    : '--'
                                                            }}
                                                        </div>
                                                        <div class="width-50">运营方:
                                                            {{ getVessel2(state.detailInfo.FirstVessel).shipOwner ?
                                                                    getVessel2(state.detailInfo.FirstVessel).shipOwner
                                                                    : '--'
                                                            }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </el-step>
                                    <el-step :icon="CircleCheckFilled">
                                        <template #title>
                                            <div :class="getRightStatus2 >= 3 ? 'actives2' : ''">
                                                目的港:
                                                {{ getPortInfo(4, 'name') }}
                                            </div>
                                        </template>
                                        <template #description>
                                            <div style="margin-bottom: 15px;">
                                                <div class="step-port-1"
                                                    v-for="(item, index) in getRightBoxStatus(getPortInfo(4, 'name'))"
                                                    :class="getActives(item.isEsti) ? 'actives' : ''" :key="index">
                                                    <span>{{ item.name }}</span>
                                                    <span>{{ item.time }}</span>
                                                </div>
                                            </div>
                                        </template>
                                    </el-step>
                                    <el-step :icon="CircleCheckFilled" v-if="getPortInfo(10, 'name') !== '--'">
                                        <!-- 未知港口 -->
                                        <template #title>
                                            <div :class="getRightStatus2 >= 4 ? 'actives2' : ''">
                                                {{ getPortInfo(10, 'name') }}
                                            </div>

                                        </template>
                                        <template #description>
                                            <div style="margin-bottom: 15px;">
                                                <div class="step-port-1"
                                                    v-for="(item, index) in getRightBoxStatus(getPortInfo(10, 'name'))"
                                                    :class="getActives(item.isEsti) ? 'actives' : ''" :key="index">
                                                    <span>{{ item.name }}</span>
                                                    <span>{{ item.time }}</span>
                                                </div>
                                            </div>
                                        </template>
                                    </el-step>
                                    <el-step :icon="CircleCheckFilled">
                                        <template #title>
                                            <div :class="getRightStatus2 >= 5 ? 'actives2' : ''">
                                                交货地:
                                                {{ getPortInfo(5, 'name') }}
                                            </div>

                                        </template>
                                    </el-step>
                                </el-steps>
                            </div>
                        </div>
                        <!-- 无中转港 -->
                        <div class="right-step" v-if="!isPortType">
                            <div style="height: 640px">
                                <el-steps direction="vertical" :active="getRightStatus">
                                    <el-step :icon="CircleCheckFilled">
                                        <template #title>
                                            <div :class="getRightStatus >= 0 ? 'actives2' : ''" style="height: 35px;">
                                                接货地:
                                                {{ getPortInfo(1, 'name') }}
                                                <!-- {{ state.detailInfo.Place[0].name ?
                                                state.detailInfo.Place[0].name : '--'
                                        }} -->
                                            </div>
                                        </template>
                                    </el-step>

                                    <el-step :icon="CircleCheckFilled">
                                        <template #title>
                                            <div :class="getRightStatus >= 1 ? 'actives2' : ''">
                                                起始港:
                                                {{ getPortInfo(2, 'name') }}
                                            </div>
                                            <!-- {{ state.detailInfo.Place[1].name ?
                                            state.detailInfo.Place[1].name : '--'
                                    }} -->
                                        </template>
                                        <template #description>
                                            <div>
                                                <div class="step-port-1"
                                                    v-for="(item, index) in getRightBoxStatus(getPortInfo(2, 'name'))"
                                                    :class="getActives(item.isEsti) ? 'actives' : ''" :key="index">
                                                    <span>{{ item.name }}</span>
                                                    <span>{{ item.time }}</span>
                                                </div>

                                                <div class="steo-port-2">
                                                    <div class="width-100">船名:{{ state.detailInfo.Vessel[0] ?
                                                            state.detailInfo.Vessel[0].vessel : '--'
                                                    }}
                                                    </div>
                                                    <div class="width-100">航次:
                                                        {{ state.detailInfo.Place[1].PlanVoyage }}
                                                    </div>
                                                    <div class="width-50">
                                                        <div style="width:100%">IMO:{{ state.detailInfo.Vessel[0] ?
                                                                state.detailInfo.Vessel[0].imo : '--'
                                                        }}</div>
                                                        <div style="width:100%">MMSI:{{ state.detailInfo.Vessel[0]
                                                                ?
                                                                state.detailInfo.Vessel[0].mmsi : '--'
                                                        }}</div>
                                                    </div>
                                                    <div class="width-50">
                                                        <div style="width:100%">建造日期:{{
                                                                state.detailInfo.Vessel[0].dateBuild
                                                                    ?
                                                                    state.detailInfo.Vessel[0].dateBuild : '--'
                                                        }}</div>
                                                        <div style="width:100%">船旗帜:{{
                                                                state.detailInfo.Vessel[0].flagName ?
                                                                    state.detailInfo.Vessel[0].flagName : '--'
                                                        }}</div>
                                                    </div>
                                                    <div class="width-100">
                                                        <div class="width-50">总箱量:{{
                                                                state.detailInfo.Vessel[0].containerSize
                                                                    ? state.detailInfo.Vessel[0].containerSize : '--'
                                                        }}</div>
                                                        <div class="width-50">运营方:{{
                                                                state.detailInfo.Vessel[0] ?
                                                                    state.detailInfo.Vessel[0].shipOwner : '--'
                                                        }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </el-step>
                                    <el-step :icon="CircleCheckFilled">
                                        <template #title>
                                            <div :class="getRightStatus >= 2 ? 'actives2' : ''">
                                                目的港:
                                                {{ getPortInfo(4, 'name') }}
                                            </div>
                                        </template>
                                        <template #description>
                                            <div style="margin-bottom: 15px;">
                                                <div class="step-port-1"
                                                    v-for="(item, index) in getRightBoxStatus(getPortInfo(4, 'name'))"
                                                    :class="getActives(item.isEsti) ? 'actives' : ''" :key="index">
                                                    <span>{{ item.name }}</span>
                                                    <span>{{ item.time }}</span>
                                                </div>
                                            </div>
                                        </template>
                                    </el-step>
                                    <el-step :icon="CircleCheckFilled" v-if="state.detailInfo.Place.length == 5">
                                        <template #title>
                                            <div :class="getRightStatus >= 3 ? 'actives2' : ''">
                                                {{ getPortInfo(10, 'name') }}
                                            </div>

                                        </template>
                                        <template #description>
                                            <div style="margin-bottom: 15px;">
                                                <div class="step-port-1"
                                                    v-for="(item, index) in getRightBoxStatus(getPortInfo(10, 'name'))"
                                                    :class="getActives(item.isEsti) ? 'actives' : ''" :key="index">
                                                    <span>{{ item.name }}</span>
                                                    <span>{{ item.time }}</span>
                                                </div>
                                            </div>
                                        </template>
                                    </el-step>
                                    <el-step :icon="CircleCheckFilled">
                                        <template #title>
                                            <div :class="getRightStatus >= 4 ? 'actives2' : ''">
                                                交货地:
                                                {{ getPortInfo(5, 'name') }}
                                            </div>
                                        </template>
                                    </el-step>
                                </el-steps>
                            </div>
                        </div>
                    </div>
                    <div class="body-right" v-if="!state.detailInfo.Place">
                        <div class="right-step">
                            <div style="height: 640px">
                                <el-steps direction="vertical" :active="-1">
                                    <el-step :icon="CircleCheckFilled">
                                        <template #title>
                                            <div style="height: 35px;">接货地:--
                                            </div>
                                        </template>
                                        <template #description>
                                            <div style="height:10px"></div>
                                        </template>
                                    </el-step>

                                    <el-step :icon="CircleCheckFilled">
                                        <template #title>起始港:--
                                        </template>
                                        <template #description>
                                            <div style="height:100px"></div>
                                        </template>
                                    </el-step>
                                    <el-step :icon="CircleCheckFilled">
                                        <template #title>目的港:--
                                        </template>
                                        <template #description>
                                            <div style="height:100px"></div>
                                        </template>
                                    </el-step>
                                    <el-step :icon="CircleCheckFilled">
                                        <template #title>交货地:--
                                        </template>
                                        <template #description>
                                            <div style="height:20px"></div>
                                        </template>
                                    </el-step>
                                </el-steps>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <el-dialog v-model="hxgjDialogVisible" title="航线轨迹" width="100%" custom-class="hxgj">
        <div v-html="ifream"></div>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, nextTick, computed } from "vue"
import { CircleCheckFilled } from '@element-plus/icons'
import { ElMessage, TabsPaneContext } from 'element-plus'
import { LocationQueryValue, useRoute } from "vue-router"
import request from "@/public/request"
import { TimeDate } from './components/date.js'
import { getElectronAgent } from "@share/agent";
import { useStore } from "vuex"
import { filterElement, enCode } from './components/publicUtils.js'
export default defineComponent({
    components: {
    },
    setup() {
        const route = useRoute();
        const agent = getElectronAgent() as any;
        const status = ref('box');
        const store = useStore()
        /* 找出最新时间状态的箱子，做为该提单总状态 */
        const getNewBox = computed(() => {
            if (!state.boxs) return;
            /* 查找所有箱子的状态的最新时间 */
            let diff = 0;
            let newObject = {} as any;
            state.boxs.forEach((t: any, i: any) => {
                t.Status.forEach((s: any) => {
                    let now = new Date(s.eventTime).getTime()
                    if (now > diff) {
                        diff = now;
                        newObject = state.boxs[i];
                    }
                })
            })
            return newObject;
        })
        /* 返回指定状态的港口 */
        const getPortInfo = computed(() => (type: number, params: string) => {
            let info = '' as string;
            if (!state.detailInfo.Place) return '--'
            state.detailInfo.Place.forEach((t: any) => {
                if (t.type == type) {
                    info = t[params]
                }
            })
            if (info) return info
            return '--'
        });
        function getZzPortInfo(type: any) {
            let info = [] as any;
            if (!state.detailInfo.Place) return []
            state.detailInfo.Place.forEach((t: any) => {
                if (t.type == type) {
                    info.push(t)
                }
            })
            return info
        }
        let state = reactive({
            /* 路由query值 */
            Id: '' as LocationQueryValue | LocationQueryValue[],
            Id2: '' as any,
            /* 详情总数据 */
            detailInfo: {} as any,
            /* 箱数据 */
            boxs: [] as any,
            /* 当前箱数据 */
            currentBox: {} as any,
            /* RCVE到达时间（时间差） */
            timeDiff: '--' as any,
            /* 起始港箱状态数据 */
            /* startPortStatus: getRightBoxStatus(getPortInfo(2, 'name')), */
            /* 中转港箱状态数据 */
            /* centerPortStatus: getRightBoxStatus(), */
            /* 目的港箱状态数据 */
            /* endPortStatus: getRightBoxStatus() */
            billNoStatus: getNewBox,
            billNo: '' as LocationQueryValue | LocationQueryValue[],
            carrierCode: '' as LocationQueryValue | LocationQueryValue[],
            loading: false,
            vessel: '' as LocationQueryValue | LocationQueryValue[],
            voyage: '' as LocationQueryValue | LocationQueryValue[],
            eta: '' as any,
            atd: '' as any,
            openDate: '' as any,
            closeDate: '' as any
        })
        /* 获取详情总数据 */
        async function getDetailInfo() {
            state.Id = route.query.billNo;
            state.Id2 = route.query.containerNo;
            state.billNo = route.query.billNo;
            state.vessel = route.query.vessel;
            state.voyage = route.query.voyage;
            state.carrierCode = route.query.carrierCode;
            state.eta = route.query.eta;
            state.atd = route.query.atd;
            state.openDate = route.query.openDate;
            state.closeDate = route.query.closeDate;
            if (route.query.errorMsg) ElMessage.error(route.query.errorMsg);
            state.loading = true;
            console.log(route.query.billNo);

            if (state.Id) {
                const result = await request.get('/api/CT_TrackOcean/GetDetail', { billNo: state.Id });
                state.loading = false;
                if (!result.Status) return
                if (result.Data.Container.length == 0) return
                state.detailInfo = result.Data;
                state.boxs = result.Data.Container;
                /* 默认查看第一个箱子 */
                state.currentBox = state.boxs[0];

                /* 获取时间差 */
                getTimeDiff()
            }
            if (state.Id2) {
                const result = await request.get('/api/CT_TrackOcean/GetDetail', { containerNo: state.Id2 });
                state.loading = false;
                if (!result.Status) return
                if (result.Data.Container.length == 0) return
                state.detailInfo = result.Data;
                state.boxs = result.Data.Container;
                /* 默认查看第一个箱子 */
                state.currentBox = state.boxs[0];

                /* 获取时间差 */
                getTimeDiff()
            }


        }
        /* 标签页变更方法 */
        const handleClick = (tab: TabsPaneContext, event: Event) => {
            console.log(tab, event)
        }
        /* 点击获取当前箱子 */
        function clickBox(Id: any) {
            state.boxs.forEach((t: any) => {
                if (t.Id == Id) {
                    state.currentBox = t;
                    return
                }
            })

        }
        /* 查找每个箱子的状态 */
        const getStatus = computed(() => (status: string) => {
            let isActive = false;
            if (state.currentBox.Status) {
                state.currentBox.Status.forEach((t: any) => {
                    if (t.eventCode == status && t.isEsti == 'N') {


                        isActive = true;
                    }
                })
            } else {

                return false
            }
            return isActive
            /* t.eventCode == status || status == 'BKCF' || status == 'EPRL' */
        });
        /* 查找每个箱子的状态时间 */
        const getBoxTime = computed(() => (status: string, type: number) => {
            let time = '';
            /* 判断是否有数据 */
            if (state.currentBox.Status) {
                /* 找出符合条件的的数据 */
                state.currentBox.Status.forEach((t: any) => {
                    if (t.eventCode == status) {
                        time = t.eventTime;
                    }
                })
                /* 根据type来赋值 */
                if (type == 0) {
                    return time ? time.substring(0, 10) : '--'
                } else if (type == 1) {
                    return time ? time.substring(11, 16) : '--'
                } else {
                    return '--'
                }
            } else {
                return '--'
            }
        })
        /* 返回每个箱子的箱状态 */
        const getBoxStatus = computed(() => {
            if (!state.currentBox.ctrStatusTerminal) return '--'
            let status = '';
            switch (String(state.currentBox.ctrStatusTerminal)) {
                case '1':
                    status = '出口重箱'
                    break;
                case '2':
                    status = '国内出口中转重箱'
                    break;
                case '3':
                    status = '进口重箱'
                    break;
                case '4':
                    status = '出口退关重箱'
                    break;
                case '5':
                    status = '出口空箱'
                    break;
                case '6':
                    status = '国际中转重箱'
                    break;
                case '7':
                    status = '重箱装船'
                    break;
                case '8':
                    status = '进口空箱'
                    break;
                case '9':
                    status = '内贸重箱'
                    break;
                case '10':
                    status = '国内进口中转重箱'
                    break;
                case '11':
                    status = '27301 装载舱单数据传输成功'
                    break;
                case '12':
                    status = '27106 该提（运）单未放行，海关'
                    break;
                case '13':
                    status = '内贸出口中转重箱'
                    break;
                case '14':
                    status = '内贸出口中转重箱'
                    break;
                case '15':
                    status = '国际中转空箱'
                    break;
                case '16':
                    status = '外贸出口重箱'
                    break;
                case '17':
                    status = '内贸出口重箱'
                    break;
                case '18':
                    status = '内贸出口中转空箱'
                    break;
                case '19':
                    status = '内贸中转重箱'
                    break;
                case '20':
                    status = '内贸进口中转重箱'
                    break;

            }
            return status ? status : '--'
        })
        /* 返回当前箱子指定的的key */
        const getBoxPort = computed(() => (key: string) => {
            if (!state.currentBox.containerNo) return '--'
            let port = {} as any;
            state.detailInfo.DocumentPacking.forEach((t: any) => {
                if (state.currentBox.containerNo == t.containerNo) {
                    port = t;
                }
            })
            return port[key] ? port[key] : '--'
        })
        /* 获取当前箱子的vgm数据 */
        const getVGMInfo = computed(() => (key: string) => {
            if (!state.detailInfo.DocumentVGM) return '--';
            let info = {} as any;
            state.detailInfo.DocumentVGM.forEach((t: any) => {
                if (t.containerNo == state.currentBox.containerNo) {
                    info = t;
                    return
                }
            })
            return info[key] ? info[key] : '--'
        })
        /* 计算开航和到港的时间差 */
        function getTimeDiff() {
            if (state.detailInfo.DeliveryEta && state.detailInfo.ReceiptEtd) {
                var stime = new Date(state.detailInfo.DeliveryEta).getTime();
                var etime = new Date(state.detailInfo.ReceiptEtd).getTime();
                let usedTime = stime - etime;
                let days = Math.floor(usedTime / (24 * 3600 * 1000));
                state.timeDiff = days;
            } else {
                state.timeDiff = '--'
            }
        }
        /* 返回指定港口的箱状态数据 */
        const getRightBoxStatus = computed(() => (status: string) => {
            /* 计算星期 */
            function getweekday(date: any) {
                var weekArray = new Array(' (周日)', ' (周一)', ' (周二)', ' (周三)', ' (周四)', ' (周五)', ' (周六)');
                var week = weekArray[new Date(date).getDay()];//注意此处必须是先new一个Date
                return week;
            }
            if (!state.currentBox.Status) return null
            let info = [] as any;
            state.currentBox.Status.forEach((t: any) => {
                if (status == t.eventPlace) {
                    info.push({ name: t.descriptionCn ? t.descriptionCn : '--', time: t.eventTime ? t.eventTime.substring(0, 16) + getweekday(t.eventTime) : '--', isEsti: t.isEsti })
                }
            })
            return info
        })
        const getActives = computed(() => (currentisEsti: string) => {
            let diff = false
            if (currentisEsti == 'N') {
                diff = true
            }


            return diff
        })
        /* 获取最新时间的当前箱子的状态 */
        const getMaxTime = computed(() => (No: string) => {
            if (!state.boxs) return '--';
            let currentBox = {} as any;
            /* 找出当前箱子 */
            state.boxs.forEach((t: any) => {
                if (t.containerNo == No) {
                    currentBox = t;
                    return;
                }
            });
            /* 找出当前箱子的最新状态 */
            let result = 0;
            currentBox.Status.forEach((t: any) => {
                if (t.eventTime && t.isEsti == 'N') {
                    let diff = new Date(t.eventTime).getTime();
                    if (diff > result) {
                        result = diff
                    }
                }
            })
            /* 根据最新状态来查找名称 */
            let newStatus = '';
            currentBox.Status.forEach((t: any) => {
                if (new Date(t.eventTime).getTime() == result) {
                    newStatus = t.descriptionCn;
                }
            })
            /* 返回箱状态 */
            return newStatus

        })
        /* 判断是中转还是直达 */
        const isPortType = computed(() => {
            let isFalse = false;
            state.detailInfo.Place.forEach((t: any) => {
                if (t.type == 3) {
                    isFalse = true;
                    return
                }
            })
            return isFalse
        })
        /* 获取当前箱子的箱量 */
        const getBoxNumber = computed(() => (status: string) => {
            if (!state.boxs) return '--';
            let number = 0;
            state.boxs.forEach((t: any, i: any) => {
                t.Status.forEach((s: any) => {
                    if (s.eventCode == status && s.isEsti == 'N') {
                        number++;
                    }
                })
                /* if (status == 'BKCF' || status == 'EPRL') {
                    number++
                } */
            })

            return number
        })
        /* 获取直达step步骤 */
        const getRightStatus = computed(() => {
            if (state.detailInfo.DeliveryAta) return 4;
            if (!state.currentBox) return -1;
            let max = 0;
            let currentStatus = '';
            state.currentBox.Status.forEach((t: any, i: any) => {
                let diff = new Date(t.eventTime).getTime();
                if (diff > max && t.isEsti == 'N') {
                    max = diff;
                    currentStatus = state.currentBox.Status[i].eventPlace;
                }
            })
            function aaa(type: any, params: any) {
                let info = '' as string;
                if (!state.detailInfo.Place) return '--'
                state.detailInfo.Place.forEach((t: any) => {
                    if (t.type == type) {
                        info = t[params]
                    }
                })
                if (info) return info
                return '--'
            }
            if (aaa(1, 'name') == currentStatus) {
                if (aaa(2, 'name') == currentStatus) {
                    return 1
                }
                if (aaa(1, 'name') == currentStatus) {
                    return 0
                }
            }
            if (aaa(2, 'name') == currentStatus) {
                return 1
            }
            if (aaa(4, 'name') == currentStatus) {
                /* if (aaa(5, 'name') == currentStatus) {
                    return 4
                }
                if (aaa(4, 'name') == currentStatus) {
                    return 2
                } */
                return 2
            }
            if (aaa(10, 'name') == currentStatus) {
                return 3
            }
            if (aaa(5, 'name') == currentStatus) {
                return 4
            }
            return currentStatus;
        })
        /* 获取中转step步骤 */
        const getRightStatus2 = computed(() => {
            if (state.detailInfo.DeliveryAta) return 5;
            if (!state.currentBox) return -1;
            let max = 0;
            let currentStatus = '';
            state.currentBox.Status.forEach((t: any, i: any) => {
                if (t.eventTime) {
                    let diff = new Date(t.eventTime).getTime();
                    if (diff > max && t.isEsti == 'N') {
                        max = diff;
                        currentStatus = state.currentBox.Status[i].eventPlace;

                    }
                }
            })
            function aaa(type: any, params: any) {
                let info = '' as string;
                if (!state.detailInfo.Place) return '--'
                state.detailInfo.Place.forEach((t: any) => {
                    if (t.type == type) {
                        info = t[params]
                    }
                })
                if (info) return info
                return '--'
            }
            if (aaa(1, 'name') == currentStatus) {
                if (aaa(2, 'name') == currentStatus) {
                    return 1
                }
                if (aaa(1, 'name') == currentStatus) {
                    return 0
                }
            }
            if (aaa(2, 'name') == currentStatus) {
                return 1
            }
            if (aaa(3, 'name') == currentStatus) {
                return 2
            }
            if (aaa(4, 'name') == currentStatus) {
                /* if (aaa(5, 'name') == currentStatus) {
                    return 5
                }
                if (aaa(4, 'name') == currentStatus) {
                    return 3
                } */
                return 3
            }
            if (aaa(10, 'name') == currentStatus) {
                return 4
            }
            if (aaa(5, 'name') == currentStatus) {
                return 5
            }
            return currentStatus;
        })
        /* 是否海关放行 */
        const currentBoxStatus = computed(() => (status: string) => {
            if (!state.currentBox.Status) return '--';
            let fx = false;
            state.currentBox.Status.forEach((t: any) => {
                if (status == t.eventCode && t.isEsti == 'N') {
                    fx = true;
                    return
                }
            })
            return fx
        })
        /* 跳转至外部浏览器链接 */
        function openGw(url: any) {
            agent.ipcRequest("window/externalUrl", url);
        }
        const getDgStatus = computed(() => (status: string, key: string) => {
            if (!state.currentBox.Status) return '--';
            let boxstatus = {} as Record<string, string>;
            state.currentBox.Status.forEach((t: any, i: number) => {
                if (t.eventCode == status) {
                    boxstatus = state.currentBox.Status[i]
                }
            })
            return boxstatus[key] ? boxstatus[key] : '--'
        })
        const getVessel = computed(() => (type: string) => {
            let obj = {} as any;
            type = type.replace(/\s*/g, "");
            state.detailInfo.Vessel.forEach((t: any) => {
                t.vessel = t.vessel.replace(/\s*/g, "");
                if (t.vessel == type) {
                    obj = t;
                    return
                }
            })
            return obj
        })
        const getVessel2 = computed(() => (type: string) => {
            let obj = {} as any;
            type = type.replace(/\s*/g, "");
            state.detailInfo.Vessel.forEach((t: any) => {
                t.vessel = t.vessel.replace(/\s*/g, "");
                if (t.vessel != type) {
                    obj = t;
                    return
                }
            })
            return obj
        })
        let hxgjDialogVisible = ref(false);
        let ifream: any = ref('');
        async function hxgj() {
            /* hxgjDialogVisible.value = true */
            let res = null;
            if (route.query.billNo) {
                res = await request.post('/api/CT_TrackOcean/RequestIFRAME', {
                    billno: route.query.billNo,
                    carrierCode: route.query.carrierCode
                })
                let el = filterElement(res.Data, 'iframe')

                ifream.value = el || null;
                let code = enCode(el);
                agent.ipcRequest("iframe/opt", 'close');
                agent.ipcRequest("iframe/iframe", '/internal/hxgj?iframe=' + code)
            }
            if (route.query.containerNo) {
                res = await request.post('/api/CT_TrackOcean/RequestIFRAME', {
                    containerNo: route.query.containerNo,
                    carrierCode: route.query.carrierCode
                })
                let el = filterElement(res.Data, 'iframe')

                ifream.value = el || null;
                let code = enCode(el);
                agent.ipcRequest("iframe/opt", 'close');
                agent.ipcRequest("iframe/iframe", '/internal/hxgj?iframe=' + code)
            }
        }
        /* function setHeight(){
            state.currentBox.Status(forEa)
        } */
        onMounted(() => {
            getDetailInfo();
        })
        return {
            CircleCheckFilled,
            status,
            state,
            handleClick,
            clickBox,
            getStatus,
            getPortInfo,
            getBoxTime,
            getBoxStatus,
            getBoxPort,
            getRightBoxStatus,
            getVGMInfo,
            getMaxTime,
            isPortType,
            getBoxNumber,
            getRightStatus,
            getRightStatus2,
            currentBoxStatus,
            openGw,
            getDgStatus,
            getActives,
            getVessel,
            getVessel2,
            hxgj,
            hxgjDialogVisible,
            ifream,
            getZzPortInfo
        }
    },
    mounted() {
        this.$nextTick(() => {
            let el = document.getElementsByClassName('actives')[0];
            console.log(el);
        })
    }
})
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
    font-family: PingFangSC-Regular;

}

img {
    width: 100%;
    height: 100%;
}

.dateilInfo {
    width: 100%;
    min-width: 1240px;
    padding: 16px;
    background: #FFFFFF;
    border: 1px solid #E4E7ED;
    border-radius: 0 0 4px 4px;
    margin-top: 12px;
}

.mbx {
    margin-top: 5px;
}

::v-deep .el-breadcrumb__item .el-breadcrumb__inner {
    font-size: 14px !important;
}

.td-title {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #969799;
}

.td-title div:nth-child(1) {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    margin-right: 12px;
}

.city-container {
    width: 100%;
    background: #F4F9FF;
    border-radius: 4px;
    padding: 16px 24px;
    margin-top: 16px;
    display: flex;
    align-items: center;
}


.city-item1 {
    text-align: center;
    font-size: 12px;
    color: #409EFF;
    width: 270px;
}

.city-item1 div:nth-child(1) {
    width: 90px;
    height: 34px;
    margin: 0 auto;
    margin-bottom: 4px;
}

.city-item1 div span:nth-child(1) {
    font-size: 14px;
    color: #3C4144;
    font-weight: 500;
    width: 70px;
    text-align: right;
}

.city-item1 div:nth-child(2) {
    display: flex;
    align-items: center;
    height: 20px;
}

.city-item2 {
    display: flex;
    justify-content: center;
    flex: 5;
    font-size: 14px;
    color: #3C4144;
    font-weight: 500;
}

.city-item2 div {
    padding: 0 6px;
}


.city-item3 {
    font-size: 12px;
    color: #303133;
}

.days {
    position: relative;
}

.jiantou {
    width: 88%;
    height: 2px;
    background-color: #C8C9CC;
    position: absolute;
    top: 25px;
}

.jiantou div {
    width: 0;
    height: 0;
    border: 4px solid #C8C9CC;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    position: absolute;
    right: -16px;
    top: -3px;
}

.detailInfo2 {
    width: 100%;
    min-width: 1240px;
    background: #FFFFFF;
    border: 1px solid #E4E7ED;
    border-radius: 0 0 2px 2px;
    border-top: none;
    padding: 30px 66px 30px 166px;
}

.statuesTitle {
    width: 100%;

}

.solid {
    border-top: 1px dashed #A0CFFF;
    width: 92%;
}

.status-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: -5px;
    position: relative;
}

.status-container div {
    flex: 1;
    position: relative;
    overflow: hidden;
}

.status-item {
    width: 8px;
    height: 8px;
    background-color: #DCDFE6;
    border-radius: 50%;
    position: relative;
}

.statuesText {
    width: 100%;
    display: flex;
    justify-content: space-between;
    /*     margin-top: 18px; */
    margin-top: -25px;
    margin-left: -10px;
}

.text-item {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    line-height: 18px;
    flex: 1;
}

.font-size-12 {
    font-size: 12px;
}

.margin-top-16 {
    margin-top: 10px;
}

.detailInfo3 {
    min-width: 1240px;
    background: #FFFFFF;
    border: 1px solid #E4E7ED;
    border-radius: 0 0 4px 4px;
    margin-top: 8px;
    overflow: auto;
}

::v-deep .el-tabs--card>.el-tabs__header {
    margin-bottom: 0;
    background-color: #FBFBFB;
}

::v-deep .el-tabs--card>.el-tabs__header .el-tabs__nav {
    border-top: none;
}

::v-deep .el-tabs--card>.el-tabs__header .el-tabs__item {
    font-size: 12px;
    height: 32px;
    line-height: 32px;
    padding: 0 8px;
}

::v-deep .el-tabs--top.el-tabs--card>.el-tabs__header .el-tabs__item:last-child {
    padding: 0 8px;
    font-size: 12px;
}

.detailInfo3-body {
    width: 100%;
    padding: 0 16px 28px 16px;
}

.body-header {
    padding-bottom: 8px;
    border-bottom: 1px solid #E4E7ED;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.header-item {
    margin-right: 12px;
    height: 24px;
    line-height: 24px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    background: #F2F3F5;
    border-radius: 2px;
    font-size: 12px;
    color: #969799;
    cursor: pointer;
    margin-top: 16px;
}

.header-item div:nth-child(2) {
    width: 6px;
    height: 6px;
    background: #67C23A;
    border-radius: 50%;
    margin: 0 4px 0 8px;
}

.header-item-error {
    background: #EF4333 !important;
}

.header-item div:nth-child(3) {
    color: #3C4144;
}

.header-item-active {
    background: #EFF6FC;
    border: 1px solid #3496FB;
    color: #3496FB;
}

.body-container {
    width: 100%;
    display: flex;
}

.body-left {
    width: calc(100% - 412px);
    padding-right: 57px;
}

.body-right {
    width: 412px;
    padding: 32px 46px 0 0;
}

.left-descript {
    padding-top: 16px;
    font-size: 14px;
    color: #303133;
    font-weight: 500;
}

.descript-title {
    border-left: 2px solid #409EFF;
    height: 14px;
    line-height: 14px;
    padding-left: 8px;
    margin-bottom: 5px;
}

.descript-body {
    width: 100%;
}

.right-step {

    min-height: 600px;
}

::v-deep .el-descriptions__label.el-descriptions__cell.is-bordered-label {
    background-color: #ECF5FF;
    color: #303133;
}

::v-deep .el-descriptions__content {
    font-size: 14px;
    color: #3C4144;
}

::v-deep .el-descriptions .is-bordered .el-descriptions__cell {
    border: 1px solid #DCDFE6;
}

::v-deep .el-step__icon .el-icon svg {
    font-size: 16px;
}

::v-deep .el-step.is-vertical .el-step__icon.is-icon {
    height: 14px;
}

::v-deep .el-step__icon-inner[class*=el-icon]:not(.is-status) {
    font-size: 14px;
}

::v-deep .el-step.is-vertical .el-step__title {
    margin-top: -5px !important;
    font-size: 14px;
    font-weight: 500;
    padding-bottom: 0;
    color: #969799;
}

::v-deep .el-step.is-vertical {
    flex-basis: 0 !important;

}

::v-deep .is-process .is-icon {
    color: #3496FB;
}

.step-port-1 {
    display: flex;
    justify-content: space-between;
    line-height: 25px;
    padding-right: 50px;
    color: #969799;
}

.step-port-1:nth-child(1) span {
    padding-top: 10px !important;
}

::v-deep .el-step__description {
    padding-right: 0;
}


::v-deep .el-step__description.is-finish {
    color: #3C4144;
}

::v-deep .is-finish .el-step__line {
    background-color: #3496FB;
}

/* ::v-deep .is-process .el-step__line {
    background-color: #3496FB;
} */

::v-deep .is-process {
    color: #969799;
}


.steo-port-2 {
    width: 100%;
    background: #F2F3F5;
    border-radius: 4px;
    padding: 6px;
    display: flex;
    flex-wrap: wrap;
    line-height: 22px;
    font-size: 12px;
    margin-top: 12px;
    margin-bottom: 15px;
}

.steo-port-2 div {
    display: flex;
    flex-wrap: wrap;
}

.width-100 {
    width: 100%;
}

.width-50 {
    width: 50%;
}

.background-success {
    background-color: #67C23A !important;
}

.background-error {
    background-color: #EF4333 !important;
}

.text-success {
    color: #3C4144 !important;
}

.haiyun {
    width: 20px;
    height: 15px;
    position: absolute;
    left: calc(50% - 10px);
    top: -12px;
}

.boxk {
    width: 55px;
    /* width: 80px; */
    height: 20px;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    position: absolute;
    top: -10px;
    text-align: center;
    left: calc(50% - 25px);
    background: #409EFF;
    border-radius: 2px;
    cursor: pointer;
}

.jts {
    width: 0;
    height: 0;
    border: 3px solid #409EFF;
    position: absolute;
    top: -36px;
    left: calc(50% - 2px);
    border-top-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
}

.site {
    text-decoration: none;
    color: #409EFF;
    cursor: pointer;
}

::v-deep .el-step.is-vertical .el-step__line {
    left: 12px
}

::v-deep .el-step__title {
    color: #c0c4cc;
}

.actives {
    color: #3C4144 !important;
    position: relative;
}

.actives2 {
    color: #3C4144 !important;
}

/* div .actives:not(:last-child) {
    background-color: red;
} */
.actives3 {
    color: #3C4144 !important;
    position: relative;
}

.actives3::after {
    display: block;
    position: absolute;
    content: '';
    width: 2px;
    height: 50%;
    margin-left: -22px;
    background-color: #3496FB;
    z-index: 2000;
}

.actives::after {
    display: block;
    position: absolute;
    content: '';
    width: 2px;
    height: 100%;
    margin-left: -22px;
    background-color: #3496FB;
    z-index: 2000;
}
</style>
<style>
.hxgj {
    margin-top: 0;
    height: 100vh;
    margin-bottom: 0;
}

.hxgj .el-dialog__body {
    padding: 0;
}

/* iframe {
    outline: none;
    border: none;
    width: 100%;
    padding: 0;
    margin: 0;
    height: calc(100vh - 58px);
} */
</style>