<template>
    <div class="workbench-container" v-loading="pageLoading">
        <div class="workbench-content">
            <el-row :gutter="8">
                <el-col :span="12">
                    <div class="workbench-card content-card minHeight">
                        <div class="card-title">
                            <div>已添加入口-业务导航</div>
                        </div>
                        <template v-if="leftEmpMenuShortcut.length == 0">
                            <el-empty :image-size="100" description="暂无菜单" />
                        </template>
                        <div class="menu-group" id="left-menu-group">
                            <div class="menu-item" :key="item.Id" v-for="(item, index) in leftEmpMenuShortcut">
                                <img :src="getLogo(item.Logo)" alt="" :id="'menu-group-left-' + index" />
                                <div class="menu-item-title">{{ item.AppName }}</div>
                                <div class="modify-buttom del" @click="delMenu(item)"
                                    v-if="leftEmpMenuShortcut.length > 1">
                                    -
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="workbench-card content-card minHeight">
                        <div class="card-title">
                            <div>已添加入口-应用导航</div>
                        </div>
                        <template v-if="rightEmpMenuShortcut.length == 0">
                            <el-empty :image-size="100" description="暂无菜单" />
                        </template>
                        <div class="menu-group" id="right-menu-group">
                            <div class="menu-item" :key="item.Id" v-for="(item, index) in rightEmpMenuShortcut">
                                <img :src="getLogo(item.Logo)" alt="" :id="'menu-group-right-' + index" />
                                <div class="menu-item-title">{{ item.AppName }}</div>
                                <div class="modify-buttom del" @click="delMenu(item)"
                                    v-if="rightEmpMenuShortcut.length > 1">
                                    -
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="24" class="mgt-8" style="margin-top: 10px;">
                    <div class="workbench-card content-card">
                        <div class="tabs-card-title">
                            <div>可添加入口</div>
                        </div>
                        <el-tabs class="page-card-tabs tab-flex-start" v-model="activeName">
                            <el-tab-pane :label="tabsName[tabs.TopMenuShortcutType]" :name="tabs.TopMenuShortcutType"
                                v-for="tabs in otherMenuShortcut">
                                <template v-if="tabs.menulist.length == 0">
                                    <el-empty :image-size="100" description="暂无菜单" />
                                </template>
                                <div class="menu-group" style="padding-top: 10px;" v-else>
                                    <div class="menu-item" :key="item.Id" v-for="item in tabs.menulist">
                                        <img :src="getLogo(item.Logo)" alt="" />
                                        <div class="menu-item-title">{{ item.AppName }}</div>
                                        <div class="modify-buttom" @click="addMenu(item)">+</div>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="bottom-btn-group">
            <el-button size="mini" @click="goUserCenter">返回工作台</el-button>

            <el-button size="mini" type="primary" @click="save" :loading="btnLoading">保存设置</el-button>
        </div>
    </div>
</template>

<script>
import Sortable from "sortablejs"; // 导入Sortable.js库，用于实现拖拽排序功能

// const host = import.meta.env.VITE_APP_HOST ?? ""; // 如果需要处理图片路径，取消注释

export default {
    components: {},
    props: {},
    data() {
        return {
            pageLoading: false,
            btnLoading: false,
            tabsName: { 10: "业务导航", 20: "我的应用" },
            activeName: 10,
            leftEmpMenuShortcut: [],
            rightEmpMenuShortcut: [],
            otherMenuShortcut: [
                {
                    TopMenuShortcutType: 10,
                    menulist: [],
                },
                {
                    TopMenuShortcutType: 20,
                    menulist: [],
                },
            ],
        };
    },
    computed: {
        // 如果需要员工信息，可以保留或调整
        employeeInfo() {
            return this.$store.state.auth.employee;
        },
        // 如果需要头像，可以保留或调整
        currentAvatar() {
            if (this.$store.state.auth.employee) {
                // return host + this.$store.state.auth.employee.Avatar;
                return this.$store.state.auth.employee.Avatar; // Assuming local path or full URL
            } else {
                return "";
            }
        },
    },
    methods: {
        addMenu(item) {
            if (item.TopMenuShortcutType == 10) {
                this.leftEmpMenuShortcut.push(item);
            } else if (item.TopMenuShortcutType == 20) {
                this.rightEmpMenuShortcut.push(item);
            }
            // 将添加的对象从 otherMenuShortcut 中移除
            let tab = this.otherMenuShortcut.find(
                (t) => t.TopMenuShortcutType === item.TopMenuShortcutType
            );
            if (tab) {
                // 直接从扁平化的 menulist 中移除
                tab.menulist = tab.menulist.filter((menu) => menu.Id !== item.Id);

                // 如果menulist为空，移除整个tab - 用户不希望这样，所以注释掉
                // if (tab.menulist.length === 0) {
                //     this.otherMenuShortcut = this.otherMenuShortcut.filter(t => t.TopMenuShortcutType !== tab.TopMenuShortcutType);
                // }
            }
        },
        delMenu(item) {
            if (item.TopMenuShortcutType == 10) {
                this.leftEmpMenuShortcut = this.leftEmpMenuShortcut.filter(menu => menu.Id !== item.Id);
            } else if (item.TopMenuShortcutType == 20) {
                this.rightEmpMenuShortcut = this.rightEmpMenuShortcut.filter(menu => menu.Id !== item.Id);
            }
            // 将删除的对象还原到 otherMenuShortcut 中
            let tab = this.otherMenuShortcut.find(
                (t) => t.TopMenuShortcutType === item.TopMenuShortcutType
            );
            if (!tab) {
                tab = { TopMenuShortcutType: item.TopMenuShortcutType, menulist: [] };
                this.otherMenuShortcut.push(tab);
                this.otherMenuShortcut.sort((a, b) => a.TopMenuShortcutType - b.TopMenuShortcutType);
            }
            tab.menulist.push(item);
        },
        goUserCenter() {
            this.$router.push("/workbench/applications");
        },
        async save() {
            let ids = [];
            this.leftEmpMenuShortcut.forEach((item, index) => {
                ids.push({
                    MenuId: item.Id,
                    MenuType: 3,
                    OrderNumber: index,
                });
            });
            this.rightEmpMenuShortcut.forEach((item, index) => {
                ids.push({
                    MenuId: item.Id,
                    MenuType: 2,
                    OrderNumber: index,
                });
            });
            this.btnLoading = true;
            let res = await this.$http.post("/api/CargoRate/SaveMenuShortcut", ids);
            this.btnLoading = false;
            if (res.Status) {
                this.$message({
                    message: "保存成功",
                    type: "success",
                });
                this.getEmployeeMenuList(); // 保存成功后重新获取列表
            } else {
                this.$message.error(res.Message || "保存失败");
            }
        },
        go(url) {
            if (!url) {
                return this.$message({
                    message: "敬请期待",
                    type: "info",
                });
            }
            this.$router.openTab(url);
        },
        async getEmployeeMenuList() {
            this.pageLoading = true;
            const PATH = "EXTERNAL_MENU";
            const MenuNames = ["工作台", "个人中心", "企业管理",]
            let res = await this.$http.get("/api/CargoRate/EmployeeMenuShortcut");
            res.Data.Menu.forEach(item => {
                item.TopMenuShortcutType = 10;
                item.AppName = item.MenuName;
                item.Logo = item.Icon;
            });
            res.Data.Info.forEach((item) => {
                item.TopMenuShortcutType = 20;
            });
            this.leftEmpMenuShortcut = res.Data.Menu
            this.rightEmpMenuShortcut = res.Data.Info
            let menus = await this.$store.dispatch("menu/getCurrentEmployeeMenuTree");
            let externalMenu = menus.find((t) => t.Path == PATH).Children;
            const extractInnermostChildren = (items) => {
                let result = [];
                items.forEach(item => {
                    if (item.Children && item.Children.length > 0) {
                        result = result.concat(extractInnermostChildren(item.Children));
                    } else {
                        result.push(item);
                    }
                });
                return result;
            };
            const innermostChildren = extractInnermostChildren(externalMenu);
            let companyApplications = innermostChildren.filter(item => !MenuNames.includes(item.MenuName));

            // 提取 leftEmpMenuShortcut 中的所有 Id
            const leftEmpMenuShortcutIds = new Set(this.leftEmpMenuShortcut.map(item => item.Id));
            // 过滤 companyApplications，移除 Id 存在于 leftEmpMenuShortcutIds 的项
            companyApplications = companyApplications.filter(item => !leftEmpMenuShortcutIds.has(item.Id));

            companyApplications.forEach((item) => {
                item.TopMenuShortcutType = 10;
                item.AppName = item.MenuName;
                item.Logo = item.Icon;
            });
            let allApplications = await this.$http.get("/api/Application/GetAllApplications");

            // 提取 rightEmpMenuShortcut 中的所有 Id
            const rightEmpMenuShortcutIds = new Set(this.rightEmpMenuShortcut.map(item => item.Id));
            // 过滤 allApplications，移除 Id 存在于 rightEmpMenuShortcutIds 的项
            allApplications = allApplications.filter(item => !rightEmpMenuShortcutIds.has(item.Id));

            allApplications.forEach((item) => {
                item.TopMenuShortcutType = 20;
            });
            this.pageLoading = false;

            // 初始化 otherMenuShortcut 并进行深拷贝，以避免引用传递问题
            this.otherMenuShortcut = [
                { TopMenuShortcutType: 10, menulist: JSON.parse(JSON.stringify(companyApplications)) },
                { TopMenuShortcutType: 20, menulist: JSON.parse(JSON.stringify(allApplications)) },
            ];
        },
        getLogo(logoName) {
            return new URL(`../../../../assets/applications-logo/${logoName}`, import.meta.url)
                .href;
        },
        // 初始化拖拽功能
        initSortable() {
            // 获取左侧菜单组的DOM元素
            const leftEl = document.getElementById('left-menu-group');
            if (leftEl) {
                // 为左侧菜单组创建Sortable实例
                new Sortable(leftEl, {
                    animation: 150, // 动画时长
                    // 拖拽结束时的回调函数
                    onEnd: (evt) => {
                        // 从旧位置移除项目并插入到新位置，更新数据数组顺序
                        const item = this.leftEmpMenuShortcut.splice(evt.oldIndex, 1)[0];
                        this.leftEmpMenuShortcut.splice(evt.newIndex, 0, item);
                    },
                });
            }

            // 获取右侧菜单组的DOM元素
            const rightEl = document.getElementById('right-menu-group');
            if (rightEl) {
                // 为右侧菜单组创建Sortable实例
                new Sortable(rightEl, {
                    animation: 150, // 动画时长
                    // 拖拽结束时的回调函数
                    onEnd: (evt) => {
                        // 从旧位置移除项目并插入到新位置，更新数据数组顺序
                        const item = this.rightEmpMenuShortcut.splice(evt.oldIndex, 1)[0];
                        this.rightEmpMenuShortcut.splice(evt.newIndex, 0, item);
                    },
                });
            }
        },
    },
    created() {
        this.getEmployeeMenuList();

    },
    mounted() {
        // 在组件挂载后，确保DOM更新完毕，然后初始化拖拽功能
        this.$nextTick(() => {
            this.initSortable();
        });
        // 根据路由参数激活 tab
        if (this.$route.query.tabType) {
            this.activeName = parseInt(this.$route.query.tabType);
        }
    },
    watch: {
        // 监听 leftEmpMenuShortcut 数据的变化
        leftEmpMenuShortcut: {
            deep: true, // 深度监听数组内部对象的变化
            handler() {
                // 数据变化后，确保DOM更新完毕，然后重新初始化拖拽功能
                this.$nextTick(() => {
                    this.initSortable();
                });
            },
        },
        // 监听 rightEmpMenuShortcut 数据的变化
        rightEmpMenuShortcut: {
            deep: true, // 深度监听数组内部对象的变化
            handler() {
                // 数据变化后，确保DOM更新完毕，然后重新初始化拖拽功能
                this.$nextTick(() => {
                    this.initSortable();
                });
            },
        },
    },
};
</script>
<style lang="scss" scoped>
.workbench-container {
    min-width: 1160px;
    gap: 16px;
}

.workbench-card {
    position: relative;
    padding: 16px;
    border-radius: 6px;
    box-shadow: 0px 1px 2px 0px #0000001a;
    background-color: #ffffff;
    margin-bottom: 8px;
}

.content-card {
    padding: 8px 16px;
    height: calc(100% - 16px);

    .card-title {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        letter-spacing: 0%;
        color: #000000e5;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #dcdfe6;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .section-title {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-bottom: 8px;

        .section-title-word {
            font-family: PingFang SC;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
            letter-spacing: 0%;
        }

        .divide-line {
            border-bottom: 1px dashed #e7e7e7;
            width: calc(50% - 50px);
        }
    }
}

.header-title {
    display: flex;
    justify-content: space-between;
    font-family: PingFang SC;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    letter-spacing: 0%;
    color: #000000e5;

    span {
        font-size: 14px;
    }

    .blue-logo {
        height: 28px;
    }
}

.menu-group {
    display: flex;
    flex-wrap: wrap;
    gap: 34px;
}

.menu-item {
    width: 84px;
    border-radius: 4px;
    padding: 10px 0;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid #e8eef4;
    margin-bottom: 8px;
    position: relative;

    &:hover {
        background: linear-gradient(180deg, #edf4f7 0%, #f1f1f5 100%);
        border: 1px solid transparent;

        .menu-item-title {
            color: #3b78ffe5;
        }
    }

    img {
        width: 34px;
        height: 34px;
        margin-bottom: 6px;
    }

    .menu-item-title {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        letter-spacing: 0%;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .menu-item-describe {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        letter-spacing: 0%;
        color: #00000066;
    }

    .modify-buttom {
        position: absolute;
        color: #747474;
        width: 13px;
        height: 13px;
        border: 1px solid #00000026;
        border-radius: 50%;
        cursor: pointer;
        right: -7px;
        top: -7px;
        background: #fff;
        display: inline;
        text-align: center;
        line-height: 11px;

        &.del {
            line-height: 10px;
        }
    }
}

.workbench-user-card {
    background: linear-gradient(180deg, #0052d9 0%, #002b73 100%);
    box-shadow: 0px 1px 2px 0px #0000001a;
    padding: 32px;
    border-radius: 6px;
    margin-bottom: 16px;

    .user-name {
        font-family: PingFang SC;
        font-weight: 600;
        font-size: 20px;
        line-height: 28px;
        letter-spacing: 0%;
        color: #ffffffe5;
        margin-bottom: 8px;
    }

    .user-role {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        letter-spacing: 0%;
        color: #ffffffe5;
    }
}

.tabs-card-title {
    position: absolute;
    top: 8px;
    left: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0%;
    color: #000000e5;
}

.page-card-tabs.tab-flex-start {
    :deep(.el-tabs__nav) {
        margin-left: 106px;
    }
}

.bottom-btn-group {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    background: #fff;
    box-shadow: 0px -2px 4px 0px #0000000d;
    text-align: center;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
}

.minHeight {
    min-height: 291px;
}
</style>