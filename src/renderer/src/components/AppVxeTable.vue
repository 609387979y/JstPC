<template>
  <div v-loading="tableOption.loading">
    <vxe-toolbar v-if="tableHeaderKey || toolbarConfig" style="height: 40px">
      <template #buttons>
        <slot name="leftBtnGroup"></slot>
      </template>
      <template #tools>
        <!-- 设置tableHeaderKey后才能调用表头配置功能 -->
        <el-button type="text" size="small" v-if="tableHeaderKey && tableVisible" class="btn-mini-size"
          style="padding: 3px 0px" @click="setTableHeader">
          <el-icon :size="11">
            <Setting />
          </el-icon>
          配置表头
        </el-button>
        <slot name="rightBtnGroup"></slot>
      </template>
    </vxe-toolbar>

    <!-- <vxe-toolbar ref="xToolbar" custom>
      <template #buttons> </template>
    </vxe-toolbar> -->
    <vxe-table v-show="tableVisible" auto-resize border show-overflow id="tableId" ref="xTable" align="center"
      :row-id="rowId" :max-height="tableHeight" :min-height="tableHeightMin" :resizable-config="resizableConfig"
      :column-config="columnConfig" :custom-config="{ storage: true }" :row-config="rowConfig" :data="tableData"
      :empty-text="emptyText" class="vxe-list-table" @cell-dblclick="cellDBLClickEvent" @cell-click="cellClickEvent"
      @checkbox-change="checkboxChangeEvent" @checkbox-all="checkboxChangeEvent" :checkbox-config="{ highlight: false }"
      round>
      <slot></slot>
      <template v-if="columnList.length">
        <vxe-column :width="value.width || ''" :min-width="value.minWidth || ''" v-for="value in columnList"
          :field="value.field" :title="value.title" sortable width="90"
          :resizable="true">
          <template v-if="value.type && value.type == 'slot'" #default="scope">
            <slot :name="value.slotName" :row="scope.row"></slot>
          </template>
        </vxe-column>
      </template>
    </vxe-table>

    <vxe-pager v-show="tableVisible && showPager" background v-model:current-page="tableOption.page"
      v-model:page-size="tableOption.pageSize" :page-sizes="[10, 15, 20, 50, 100, 300, { label: '全部数据', value: -1 }]"
      :total="tableOption.total" @page-change="handlePageChange" :layouts="pageLayout">
      <template #left>
        <span class="page-left" v-if="hasCheckBox">
          <span class="select-count">共选中 {{ tableOption.selectRecords.length }} 条</span>
          <div style="margin-left: 8px">
            <slot name="page-btn-group"></slot>
          </div>
        </span>
      </template>
    </vxe-pager>
    <el-dialog title="表头排序" :width="300" v-model="headerSettingDialog" custom-class="header-setting-dialog">
      <div v-loading="headBtnLoading" v-if="reWrite">
        <vxe-table :row-id="'id'" :data="xTableR.columns" ref="tableRef" :row-config="{ isHover: true }" border
          class="sort-box" :row-class-name="handleDragAllow">
          <vxe-column field="title" title="字段名" align="center" />
          <vxe-column title="显示" width="50" align="center">
            <template #default="scope">
              <el-checkbox v-model="scope.row.visible" @change="checkChange(scope.row)"></el-checkbox>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <template #footer>
        <div style="text-align: center">
          <el-button @click="resetHeaderSetting">重置表头</el-button>
          <el-button @click="cancleHeaderSetting">取消</el-button>
          <el-button type="primary" @click="saveHeaderSetting" :loading="headBtnLoading">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  nextTick,
  reactive,
  onUnmounted,
} from "vue";
import {
  VXETable,
  VxeTableEvents,
  VxeTableInstance,
  VxeTableDefines,
  VxeColumnPropTypes,
  VxeTablePropTypes,
  VxeToolbarInstance,
} from "vxe-table";
import Sortable from "sortablejs";
import request from "@/public/request";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import storage from "../storage/localStorage";
import { Setting } from "@element-plus/icons";
export default defineComponent({
  props: {
    //列表数据
    tableData: {
      type: Array,
      default: () => [],
    },
    //列表可视
    tableVisible: {
      type: Boolean,
      default: () => true,
    },
    showPager: {
      type: Boolean,
      default: () => true,
    },

    //设置tableHeaderKey后才能调用表头配置功能
    tableHeaderKey: {
      type: String,
      default: () => "",
    },
    //列表配置
    tableOption: {
      type: Object,
      default: {
        page: 1,
        pageSize: 20,
        selectRecords: [],
        total: 0,
        isAllChecked: false,
        loading: false,
      },
    },

    columnList: {
      type: Array,
      default: () => []
    },

    //列表高度
    tableHeight: {
      type: String,
      default: () => "500",
    },
    tableHeightMin: {
      type: String,
      default: () => "500",
    },
    rowId: {
      type: String,
    },

    //列配置
    columnConfig: {
      type: Object,
      default: () => { return { resizable: true } },
    },

    resizableConfig: {
      type: Object,
      default: () => { return { isAllColumnDrag: true } },
    },

    //行配置
    rowConfig: {
      type: Object,
      default: { isHover: true, isCurrent: true },
    },

    //翻页配置
    pageLayout: {
      type: Array,
      default: () => [
        "PrevPage",
        "JumpNumber",
        "NextPage",
        "Sizes",
        "FullJump",
        "Total",
      ],
    },

    toolbarConfig: {
      type: Boolean,
      default: () => false,
    },
    hasCheckBox: {
      type: Boolean,
      default: () => false,
    },
    tableCustom: {
      type: Object,
      default: { storage: true } as VxeTablePropTypes.CustomConfig,
    },
    //为空提示文字
    emptyText: {
      type: String,
      default: () => " ",
    },
  },
  components: {
    Setting,
  },
  name: "AppVxeTable",
  setup(prop, context) {
    const xTable = ref({} as VxeTableInstance);
    const xToolbar = ref({} as VxeToolbarInstance);
    const Router = useRouter();
    const headBtnLoading = ref(false);
    /* 跳页 */
    const handlePageChange = async ({ currentPage, pageSize }) => {
      prop.tableOption.page = currentPage;
      prop.tableOption.pageSize = pageSize;
      prop.tableOption.selectRecords = [];
      context.emit("getTableList");
    };

    /* 单击 */
    const cellClickEvent: VxeTableEvents.CellClick = ({ row }) => {
      const $table = xTable.value;
      xTable.value.toggleCheckboxRow(row);
      prop.tableOption.selectRecords = $table.getCheckboxRecords();
      context.emit("cellClickEvent", row);
    };

    /* 双击 */
    const cellDBLClickEvent: VxeTableEvents.CellDblclick = ({ row }) => {
      context.emit("dbClick", row);
    };

    /* 单选复选框 */
    const checkboxChangeEvent: VxeTableEvents.CheckboxChange = ({ row }) => {
      const $table = xTable.value;
      xTable.value.toggleCheckboxRow(row);
      prop.tableOption.selectRecords = $table.getCheckboxRecords();
      context.emit("checkboxChangeEvent");
    };

    /* 全选复选框 */
    const changeAllEvent = () => {
      const $table = xTable.value;
      $table.setAllCheckboxRow(prop.tableOption.isAllChecked);
      prop.tableOption.selectRecords = $table.getCheckboxRecords();
      context.emit("changeAllEvent");
    };

    function handleDragAllow(row: any) {
      if (row.row.fixed) {
        return "noDragAllow";
      } else {
        return "dragAllow";
      }
    }

    /**
     *表头设置
     */
    const dragEl = ref<any>(null);
    const defaultHeader = ref([] as VxeTableDefines.ColumnInfo[]);
    const CACHE_KEY_PREFIX = "vxe:table:";
    const headerSettingDialog = ref(false);
    const xTableR = reactive({
      columns: [] as VxeTableDefines.ColumnInfo[],
    });
    //拖拽后的数组
    const modifyColumns = ref([] as VxeTableDefines.ColumnInfo[]);

    async function getTableHeaderSetting() {
      let form = {
        Type: CACHE_KEY_PREFIX,
        Key: prop.tableHeaderKey,
      };
      headBtnLoading.value = true;
      let res = null;
      try {
        res = await request.get("/api/Preference/GetValue", form);
      } catch (error) { }

      headBtnLoading.value = false;
      return res.Value;
    }

    async function setTableHeaderSetting() {
      let form = {
        Type: CACHE_KEY_PREFIX,
        Key: prop.tableHeaderKey,
        Value: JSON.stringify(modifyColumns.value),
      };
      headBtnLoading.value = true;
      let res = await request.post("/api/Preference/SetValue", form);
      headBtnLoading.value = false;
      return res;
    }

    /**
     * 初始化表头缓存
     */
    async function initStorageColumns() {
      defaultHeader.value = xTable.value.getTableColumn().collectColumn;
      //如果设置了tableHeaderKey则初始化表头
      if (prop.tableHeaderKey) {
        //初始化表头缓存
        // let cacheData = storage.getItem(`${CACHE_KEY_PREFIX}${prop.tableHeaderKey}`);
        let cacheData = await getTableHeaderSetting();
        //如果有缓存
        if (cacheData) {
          const $grid = xTable.value;

          //获取缓存列
          let storageColumn = JSON.parse(cacheData);

          //获取原有列
          let collectColumn = $grid.getTableColumn().collectColumn;

          //初始化表格加载列信息
          let afteterColum = [] as any;
          storageColumn.forEach((item) => {
            collectColumn.forEach((item2) => {
              if (item.title == item2.title) {
                item2.visible = item.visible;
                //处理表头组隐藏
                if (item2.children) {
                  item2.children.forEach((c) => {
                    c.visible = item2.visible;
                  });
                }
                afteterColum.push(item2);
              }
            });
          });

          $grid.loadColumn(afteterColum);

          //设置修改列
          modifyColumns.value = afteterColum;

          //设置弹窗列
          xTableR.columns = xTable.value.getTableColumn().collectColumn;
        } else {
          xTableR.columns = xTable.value.getTableColumn().collectColumn;
          modifyColumns.value = xTable.value.getTableColumn().collectColumn;
        }
      }
    }

    /**
     * 打开表头设置弹窗
     */
    const setTableHeader = () => {
      headerSettingDialog.value = true;

      setTimeout(() => {
        //初始化拖拽组件
        sortableFun();

        // modifyColumns.value = xTable.value.getTableColumn().collectColumn;
      }, 100);
    };

    /**
     * 表头保存
     */
    const saveHeaderSetting = async () => {
      const $grid = xTable.value;

      //保存缓存
      storage.saveItem(
        `${CACHE_KEY_PREFIX}${prop.tableHeaderKey}`,
        JSON.stringify(modifyColumns.value),
      );

      //保存完后加载修改后列
      $grid.loadColumn(modifyColumns.value);
      let res = await setTableHeaderSetting();
      if (res.Status == true) {
        ElMessage.success("保存表头成功！");
      } else {
        ElMessage.warning("保存表头失败！");
      }
      headerSettingDialog.value = false;
      xTableR.columns = modifyColumns.value;
      reFresh();
    };

    /**
     * 重置表头
     */
    const resetHeaderSetting = () => {
      ElMessageBox.confirm("是否重置表头?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          defaultHeader.value.forEach((item) => {
            item.visible = true;
            if (item.children) {
              item.children.forEach((item2) => {
                item2.visible = true;
              });
            }
          });
          xTableR.columns = defaultHeader.value;
          modifyColumns.value = defaultHeader.value;
          saveHeaderSetting();
        })
        .catch(() => { });
    };

    /**
     * 关闭表头设置
     */
    const cancleHeaderSetting = () => {
      headerSettingDialog.value = false;
    };

    /**
     * 重新加载表格组件来加载表头
     */
    const reWrite = ref(true);
    function reFresh() {
      reWrite.value = false;
      nextTick(() => {
        reWrite.value = true;
      });
    }

    nextTick(() => {
      // const $toolbar = xToolbar.value
      // xTable.value.connect($toolbar)
      //保存默认表头

      initStorageColumns();
      //  xTableR.columns = xTable.value.getTableColumn().collectColumn;
      //  modifyColumns.value=xTable.value.getTableColumn().collectColumn
    });

    /**
     * 初始化拖拽
     */
    const sortableFun = () => {
      const el: any = document.querySelectorAll(
        ".sort-box .vxe-table--body-wrapper .vxe-table--body tbody",
      );
      for (let i = 0; i < el.length; i++) {
        Sortable.create(el[i], {
          animation: 200,
          delay: 0,
          draggable: ".dragAllow",

          onEnd(sortableEvent) {
            const sortArr = modifyColumns.value;
            const targetThElem = sortableEvent.item;
            const newIndex = sortableEvent.newIndex as number;
            const oldIndex = sortableEvent.oldIndex as number;
            const wrapperElem = targetThElem.parentNode as HTMLElement;
            const newColumn = sortArr[newIndex];
            const oldColumn = sortArr[oldIndex];

            //不能移动固定列
            if (newColumn.fixed || oldColumn.fixed) {
              try {
                // 错误的移动
                console.log(wrapperElem)
                if (wrapperElem) {
                  const oldThElem = wrapperElem.children[oldIndex] as HTMLElement;
                  if (newIndex > oldIndex) {
                    wrapperElem.insertBefore(targetThElem, oldThElem);
                  } else {
                    wrapperElem.insertBefore(
                      targetThElem,
                      oldThElem ? oldThElem.nextElementSibling : oldThElem,
                    );
                  }
                }

              } catch (error) {
                console.log(error)
              }

              ElMessage.warning("固定列不允许拖动");
              return;
            }

            const currRow = sortArr.splice(oldIndex, 1)[0];
            sortArr.splice(newIndex, 0, currRow);
            resetColumns(sortArr);
          },
        });
      }
    };

    /**
     * 列重新排序
     */
    function resetColumns(sortArr: any) {
      const newData: any = [];
      sortArr.forEach((item: any, index: any) => {
        newData[index] = {
          ...item,
        };
      });
      modifyColumns.value = [];
      modifyColumns.value = newData;
    }

    /**
     * 显示/隐藏有子列的列
     */
    function checkChange(row: any) {
      modifyColumns.value.forEach((item) => {
        if (item.title == row.title) {
          item.visible = row.visible;
          if (item.children) {
            item.children.forEach((item2) => {
              item2.visible = row.visible;
            });
          }
        }
      });
    }

    onMounted(() => { });
    onUnmounted(() => { });

    return {
      xToolbar,
      xTable,
      handlePageChange,
      cellClickEvent,
      cellDBLClickEvent,
      checkboxChangeEvent,
      changeAllEvent,

      dragEl,
      xTableR,
      initStorageColumns,
      setTableHeader,
      headerSettingDialog,
      saveHeaderSetting,
      cancleHeaderSetting,
      resetHeaderSetting,
      handleDragAllow,
      checkChange,
      reWrite,
      headBtnLoading,
    };
  },
});
</script>
<style lang="scss">
.vxe-body--column {
  height: auto !important;
}

.vxe-checkbox--icon {
  font-size: 14px !important;
}

.page-left {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
}

.vxe-list-table {
  .vxe-cell {
    height: 30px !important;
    line-height: 30px;
    display: flex;
    align-items: center;
  }
}

.vxe-header--column {
  .vxe-cell {
    height: 22px !important;
    line-height: 22px !important;
  }
}

.vxe-header--row {
  .vxe-checkbox--label {
    display: none;
  }
}

.title-flex {
  width: 250px;
  margin: 0 auto;
  height: 36px;
  line-height: 36px;
  background-color: #eee;
  color: #666;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  text-align: center;
}

.content-flex {
  display: inline;
  width: 250px;
  margin: 0 auto;
  // border:1px solid #ccc
}

.sort-box {
  .el-table__expand-icon {
    display: none !important;
  }

  .el-table__cell {
    padding: 2px;
  }

  .el-checkbox {
    height: 20px;
    margin-right: 0 !important;
  }
}

.header-setting-dialog {
  --el-dialog-margin-top: 5vh;

  .el-dialog__header {
    padding: 10px;

    .el-dialog__title {
      font-size: 14px;
    }

    .el-dialog__headerbtn {
      top: 10px;
    }
  }

  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 8px;
  }
}

.noDragAllow {
  background: #f4f6f9;
  cursor: not-allowed;
}

.dragAllow {
  cursor: grab;
}

.vxe-table--render-default .vxe-body--row.row--checked,
.vxe-table--render-default .vxe-body--row.row--radio {
  background-color: #e6f7ff;
}

.vxe-table--render-default .vxe-body--row.row--checked,
.vxe-table--render-default .vxe-body--row.row--hover.row--radio {
  background-color: #e6f7ff !important;
}
</style>
