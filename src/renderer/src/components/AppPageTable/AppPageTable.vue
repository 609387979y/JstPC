<template>
  <div v-loading="_option.loading" class="app_page_table">
    <el-table
      :max-height="tableHeight"
      ref="tableRef"
      @selection-change="handleSelectionChange"
      border
      @row-dblclick="emitDblclick"
      @row-click="emitClick"
      :row-style="rowStyle"
      :data="tableData"
      :row-key="rowKey"
      style="width: 100%"
      :highlight-current-row="singleHighLight"
      :height="fixedHeight"
    >
      <slot></slot>
    </el-table>
    <div class="page_component">
      <el-pagination
        background
        layout="total,sizes,prev, pager, next,jumper"
        :popper-class="$props.popperClass"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :total="_option.total"
        :page-size="_option.pageSize"
        :page-sizes="_option.pageSizes"
        :current-page="_option.page"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  PropType,
  computed,
  toRaw,
  onMounted,
} from "vue";
import TableOption from "./tableOption";
import useTableOption from "./useTableOption";
export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    tableHeight: {
      type: String,
    },
    fixedHeight:{
      type: String,
    },
    option: {
      type: Object as PropType<TableOption>,
      default: () => {
        return useTableOption();
      },
    },
    full: {
      type: Boolean,
      default: false,
    },
    hiddenBorder: {
      type: Boolean,
      default: false,
    },
    tableRef: {
      type: String,
      default: () => [],
    },
    rowKey:{
      type: String,
      default: () => '',
    },
    popperClass:{
      type:String,
      default:'freight-select-dropdown'
    },
    //单击表格是否高亮
    singleHighLight: {
      type: Boolean,
      default: false,
    },
  },
  name: "AppPageTable",
  emits: ["change", "update:option"],
  setup(prop, context) {
    const _option: TableOption = prop.option;
    const tableRef = ref(null);
    const tableData = computed(() => {
      if (prop.full) {
        // 分页
        let arr = prop.data.slice(
          ((_option.page ?? 1) - 1) * (_option.pageSize ?? 15),
          (_option.page ?? 1) * (_option.pageSize ?? 15)
        );
        return arr;
      } else {
        return prop.data;
      }
    });
    // 每页数量变化
    function handleSizeChange(size: number) {
      _option.pageSize = size;
      _option.page = 1;
      emitChange();
    }
    // 页数变化
    function handlePageChange(page: number) {
      _option.page = page;
      emitChange();
    }
    // 选项变化
    function handleSelectionChange(val: Array<any>) {
      const func = _option.selectFilter
        ? _option.selectFilter
        : (item: any) => item;
      let arr = [];
      for (let item of val) {
        let ret = func(toRaw(item));
        if (ret !== undefined) {
          arr.push(ret);
        }
      }

      _option.selected = arr;
      emitOption();
    }
    function resetTable() {
      _option.page = 1;
      emitChange();
    }
    function emitOption() {
      context.emit("update:option", _option);
    }
    function emitChange() {
      context.emit("change", toRaw(_option));
      emitOption();
    }
    //单击事件
    function emitClick(row: Object) {
      context.emit("singleClick", row);
      // tableRef.value.toggleRowSelection(row);
      // rowStyle({ row });
    }
    //双击事件
    function emitDblclick(row: Object) {
      context.emit("dblClick", row);
    }
    //行背景色
    function rowStyle({ row, rowIndex }) {
      let rowBackground: Object = {};
      // for (let item of prop.option.selected) {
      //   if (item.Id == row.Id) {
      //     return "background-color: #FFE7BF";
      //   }
      // }
      if (row.PriceType == 1) {
        rowBackground.background = "#FDF8F1";
        // rowBackground.background = "green";

        return rowBackground;
      }

      // console.log(prop.option.selected.id,row,'propproppropprop')
      // if (tableData[rowIndex]) {
      //     return 'background-color: rgba(243,243,243,1)'
      //   }
    }
    onMounted(() => {
      // 是否是所有数据都在了
      if (prop.full) {
        _option.total = prop.data.length;
      }

      let resetProxy: any = null;
      if (prop.option.reset) {
        resetProxy = new Proxy(prop.option.reset, {
          apply(target, thisArg, argumentsList) {
            resetTable();
            return target.call(thisArg, ...argumentsList);
          },
        });
        prop.option.reset = resetProxy;
      }
    });

    return {
      _option,
      tableData,
      handleSizeChange,
      handlePageChange,
      handleSelectionChange,
      emitDblclick,
      emitClick,
      rowStyle,
      tableRef,
    };
  },
});
</script>
<style lang="scss" >
.app_page_table {
  width: 100%;

  .page_component {
    text-align: right;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  // .el-table__body, .el-table__footer, .el-table__header{
  //       table-layout:auto !important ;
  // }
}
</style>