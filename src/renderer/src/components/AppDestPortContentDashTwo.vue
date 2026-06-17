<template>
    <div
        style="margin:-12px;"
        v-loading="tabsLoading"
        class="dest-container"
    >
        <!-- <div
            class="destport-title"
            v-if="historyList.length && isHistory"
        >
            <span class="destport-blue"></span>
            <span class="destport-words">历史查询</span>
        </div>
        <div
            class="destport-list"
            v-if="historyList.length && isHistory"
        >
            <div
                class="destport-item"
                v-for="item in historyList"
                :key="item.Id"
                @click="selectPort(item)"
            >
                <div class="destport-cn">{{ item.CnPortName }}</div>
                <div class="destport-en">{{ item.EnPortName }}</div>
                <div class="destport-cn">{{ item.EnChauName }}</div>
            </div>
        </div>
        <div
            v-if="!hideTitle"
            class="destport-title"
        >
            <span class="destport-blue"></span>
            <span class="destport-words">推荐港口</span>
        </div>
        <el-tabs
            class="destport-tabs"
            v-model="activeName"
            :loading="tabsLoading"
            @tab-click="handleClick"
            v-if="type == 1"
        >
            <el-tab-pane
                v-for="item in portData"
                :key="item.Id"
                :label="item.LineName"
                :name="item.LineName"
            >
                <div
                    class="destport-list"
                    style="padding: 0 7px 0"
                >
                    <div
                        class="destport-item"
                        v-for="child in item.gangkou"
                        :key="child.Id"
                        @click="selectPort(child)"
                    >
                        <div class="destport-cn">{{ child.CnPortName }}</div>
                        <div class="destport-en">{{ child.EnPortName }}</div>
                        <div class="destport-cn">{{ child.EnChauName }}</div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-tabs
            class="destport-tabs"
            v-model="activeName"
            :loading="tabsLoading"
            @tab-click="handleClick"
            v-if="type == 2"
        >
            <el-tab-pane
                v-for="item in portData"
                :key="item.LineName"
                :label="item.LineName"
                :name="item.LineName"
            >
                <div
                    class="destport-list"
                    style="padding: 0 7px 0"
                >
                    <div
                        class="destport-item"
                        v-for="child in item.PortList"
                        :key="child.Id"
                        @click="selectPort(child)"
                    >
                        <div class="destport-cn">{{ child.CnPortName }}</div>
                        <div class="destport-en">{{ child.EnPortName }}</div>
                        <div class="destport-cn">{{ child.EnChauName }}</div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs> -->
        <div class="left-destport-container">
            <div class="tabs">
                <div
                    class="tab-item"
                    v-for="item in portData"
                    :key="item.PortLineId"
                    @click="tabClick(item.PortLineId)"
                    :class="tabSeletedId == item.PortLineId ? 'tab-item-selected ' : ''"
                >
                    {{ item.LineName }}
                </div>
            </div>
        </div>
        <div class="right-destport-container">
            <div class="destport-list">
                <div
                    class="destport-item"
                    v-for="child in destSelected"
                    :key="child.Id"
                    @click="selectPort(child)"
                >
                    <div class="destport-cn">{{ child.CnPortName }}</div>
                    <div class="destport-en">{{ child.EnPortName }}</div>
                    <div class="destport-cn">{{ child.EnChauName }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    components: {},
    props: {
        // 隐藏标题
        hideTitle: {
            type: Boolean,
            default: false
        },
        data: {
            type: String,
            default: "",
        },
        type: {
            type: Number,
            default: 1,
        },
        isHistory: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            portData: [],
            activeName: "",
            historyList: [],
            tabsLoading: true,
            tabSeletedId: 0,
            destSelected: [],
        };
    },
    methods: {
        // 选中航线
        tabClick(id) {
            this.tabSeletedId = id;
            this.portData.forEach(item => {
                if (item.PortLineId == id) {
                    this.destSelected = item.gangkou;
                }
            })
        },

        async getPort() {
            this.tabsLoading = true
            let url = "";
            if (this.type == 1) {
                url = "/api/FRPortalPort/GetPortList";
            } else if (this.type == 2) {
                url = "/api/DcPort/GetDcPort";
            }
            let res = await this.$http.get(url);
            this.portData = res.Data;
            this.tabSeletedId = res.Data[0].PortLineId;
            this.destSelected = res.Data[0].gangkou;
            this.activeName = res.Data[0].LineName;
            this.tabsLoading = false
        },
        selectPort(item) {
            if (this.type == 1) {
                this.$emit("selectPort", item.Id, item);
                let historyList = this.historyList;
                for (let i in historyList) {
                    if (historyList[i].Id == item.Id) {
                        historyList.splice(i, 1);
                    }
                }
                historyList.unshift(item);
                if (historyList.length > 5) {
                    historyList.pop();
                }
                this.historyList = historyList;
                localStorage.setItem("destPortHistory", JSON.stringify(historyList));
            } else if (this.type == 2) {
                this.$emit("selectPort", item.EnPortName);
                let historyList = this.historyList;
                for (let i in historyList) {
                    if (historyList[i].EnPortName == item.EnPortName) {
                        historyList.splice(i, 1);
                    }
                }
                historyList.unshift(item);
                if (historyList.length > 5) {
                    historyList.pop();
                }
                this.historyList = historyList;
                localStorage.setItem("destPortDcHistory", JSON.stringify(historyList));
            }
        },
        initHistoryList() {
            if (this.type == 1) {
                let historyList = localStorage.getItem("destPortHistory");
                if (historyList) {
                    historyList = JSON.parse(historyList);
                    this.historyList = historyList;
                } else {
                    this.historyList = [];
                }
            } else if (this.type == 2) {
                let historyList = localStorage.getItem("destPortDcHistory");
                if (historyList) {
                    historyList = JSON.parse(historyList);
                    this.historyList = historyList;
                } else {
                    this.historyList = [];
                }
            }
        },
        searchKeywords(list, keyWord) {
            var arr = [];
            for (var i = 0; i < list.length; i++) {
                if (list[i].label.indexOf(keyWord) >= 0) {
                    arr.push(list[i]);
                }
            }
            return arr;
        },
    },
    computed: {},
    mounted() {
        this.getPort();
        this.initHistoryList();

    },
};
</script>
  
<style lang="scss" scoped>
.destport-title {
    .destport-blue {
        display: inline-block;
        background: #409eff;
        width: 3px;
        height: 12px;
        border-radius: 2px;
        margin-right: 4px;
    }

    .destport-words {
        font-size: 16px;
        color: #303133;
        font-weight: bold;
    }
}

.destport-list {
    display: flex;
    // padding: 16px 7px 0px;
    padding: 13px;
    // padding: 20px 30px 24px 32px;
    line-height: 20px;
    flex-direction: row;
    flex-wrap: wrap;
    max-height: 464px;
    overflow: auto;
    box-sizing: border-box;

    .destport-item {
        width: 13%;
        border-radius: 4px;
        border-radius: 4px;
        padding: 5px;
        margin-bottom: 16px;
        transition: 0.3s;

        .destport-cn {
            font-size: 12px;
            color: #606266;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .destport-en {
            font-size: 12px;
            color: #3c4144;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .destport-item:hover {
        background: #fcf1e7;
        cursor: pointer;
    }
}

.destport-tabs {
    :deep(.el-tabs__header) {
        margin: 0 0 15px 10px;
    }
}

// 新布局
.dest-container {
    display: flex;
    align-items: flex-start;
    // height: 464px;
}

.left-destport-container {
    padding: 13px 6px;
    font-size: 14px;
    width: 20%;
    border-right: 1px solid #e6e6e6;
    background: #f4f4f4;
    max-height: 464px;
    overflow: auto;

    .tab-item {
        padding: 8px 11px;
        line-height: 18px;
        margin-bottom: 8px;
        cursor: pointer;
    }

    .tab-item-selected {
        background: #fd953e;
        border-radius: 5px;
        font-size: 14px;
        color: #fff;
    }
}

.right-destport-container {
    width: 100%;
}
</style>
  