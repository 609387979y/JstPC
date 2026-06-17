<template>
  <div class="dialog-container">
    <el-dialog
      v-model="dialog.dialogVisible"
      title="Tips"
      width="1000px"
      :before-close="dialog.handleClose"
    >
      <template #title>
        <div class="dialog-title">
          <div>报底价</div>
          <div>
            <img src="../../../../assets/consultPrice/price.svg" alt="" />
          </div>
          <div>历史价格</div>
        </div>
      </template>
      <div class="body">
        <div class="left">
          <div class="left-title">报价参考</div>
          <div class="left-from">
            <div class="from-title">海运费价格</div>
            <div class="from">
              <el-table :data="leftTable.tabData" border style="width: 100%">
                <el-table-column label="费用名称" width="74px" align="center">
                  <template v-slot:default="scope">
                    <div style="margin-left: 2px">基础海运费</div>
                  </template>
                </el-table-column>
                <el-table-column label="20GP" width="74px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="40GP" width="81px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="40HQ" width="81px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="45HQ" width="81px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="40NOR" width="81px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="left-from">
            <div class="from-title">申请幅度</div>
            <div class="from">
              <el-table :data="leftTable.tabData" border style="width: 100%">
                <el-table-column label="费用名称" width="74px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="20GP" width="74px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="40GP" width="81px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="40HQ" width="81px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="45HQ" width="81px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="40NOR" width="81px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="left-from">
            <div class="from-title">ALL-IN价格</div>
            <div class="from">
              <el-table :data="leftTable.tabData" border style="width: 100%">
                <el-table-column label="费用名称" width="74px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="20GP" width="74px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="40GP" width="81px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="40HQ" width="81px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="45HQ" width="81px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="40NOR" width="81px" align="center">
                  <template v-slot:default="scope">
                    <div>--</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="left-title">我的报价</div>
          <div class="right-container">
            <div class="left-from new-from">
              <div class="from-title">
                海运费价格 &nbsp;&nbsp;<el-radio
                  v-model="undefined"
                  label="1"
                  size="large"
                  >填写基础海运费</el-radio
                >
              </div>
              <div class="from">
                <el-table :data="rightTable.tabData" border style="width: 100%">
                  <el-table-column label="费用名称" width="70px" align="center">
                    <template v-slot:default="scope">
                      <div>基础海运费</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="20GP" width="70px" align="center">
                    <template v-slot:default="scope">
                      <div><el-input v-model="undefined" size="small" /></div>
                    </template>
                  </el-table-column>
                  <el-table-column label="40GP" width="74px" align="center">
                    <template v-slot:default="scope">
                      <div><el-input v-model="undefined" size="small" /></div>
                    </template>
                  </el-table-column>
                  <el-table-column label="40HQ" width="74px" align="center">
                    <template v-slot:default="scope">
                      <div><el-input v-model="undefined" size="small" /></div>
                    </template>
                  </el-table-column>
                  <el-table-column label="45HQ" width="74px" align="center">
                    <template v-slot:default="scope">
                      <div><el-input v-model="undefined" size="small" /></div>
                    </template>
                  </el-table-column>
                  <el-table-column label="40NOR" width="74px" align="center">
                    <template v-slot:default="scope">
                      <div><el-input v-model="undefined" size="small" /></div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="left-from new-from">
              <div class="from-title">
                申请幅度 &nbsp;&nbsp;<el-radio
                  v-model="undefined"
                  label="1"
                  size="large"
                  >填写申请幅度</el-radio
                >
              </div>
              <div class="from">
                <el-table :data="rightTable.tabData" border style="width: 100%">
                  <el-table-column label="费用名称" width="70px" align="center">
                    <template v-slot:default="scope">
                      <div>--</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="20GP" width="70px" align="center">
                    <template v-slot:default="scope">
                      <div><el-input v-model="undefined" size="small" /></div>
                    </template>
                  </el-table-column>
                  <el-table-column label="40GP" width="74px" align="center">
                    <template v-slot:default="scope">
                      <div><el-input v-model="undefined" size="small" /></div>
                    </template>
                  </el-table-column>
                  <el-table-column label="40HQ" width="74px" align="center">
                    <template v-slot:default="scope">
                      <div><el-input v-model="undefined" size="small" /></div>
                    </template>
                  </el-table-column>
                  <el-table-column label="45HQ" width="74px" align="center">
                    <template v-slot:default="scope">
                      <div><el-input v-model="undefined" size="small" /></div>
                    </template>
                  </el-table-column>
                  <el-table-column label="40NOR" width="74px" align="center">
                    <template v-slot:default="scope">
                      <div><el-input v-model="undefined" size="small" /></div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="left-from new-from">
              <div class="from-title">最终价格 &nbsp;&nbsp;计算</div>
              <div class="from">
                <el-table :data="rightTable.tabData" border style="width: 100%">
                  <el-table-column label="费用名称" width="70px" align="center">
                    <template v-slot:default="scope">
                      <div>--</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="20GP" width="70px" align="center">
                    <template v-slot:default="scope">
                      <div>--</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="40GP" width="74px" align="center">
                    <template v-slot:default="scope">
                      <div>--</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="40HQ" width="74px" align="center">
                    <template v-slot:default="scope">
                      <div>--</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="45HQ" width="74px" align="center">
                    <template v-slot:default="scope">
                      <div>--</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="40NOR" width="74px" align="center">
                    <template v-slot:default="scope">
                      <div>--</div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="line"></div>
            <div class="yj">
              <span>预计总价：</span>
              <span>USD 99,350 & CNY 3500</span>
            </div>
            <div class="min-price">
              <span class="items1">底价：</span>
              <span class="items2">USD &nbsp;</span>
              <span class="items3">99,350&nbsp;</span>
              <span>& &nbsp;</span>
              <span class="items2">CNY &nbsp;</span>
              <span class="items3">1500</span>
            </div>
          </div>
          <div class="btns">
            <div>确认报价</div>
            <div>预览报价</div>
            <div @click="dialog.handleClose">放弃</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import request from "@/public/request.ts";

/*left表格相关*/
function leftTables() {
  let tabData = ref([{}, {}, {}]);
  return reactive({
    tabData,
  });
}
/*right表格相关*/
function rightTables() {
  let tabData = ref([{}]);
  return reactive({
    tabData,
  });
}

/*唤起&关闭对话框*/
function dialogs() {
  const dialogVisible = ref(false);
  const inquireInfoId = ref(null);
  function handleClose() {
    dialogVisible.value = false;
  }
  function handleOpen(Id) {
    inquireInfoId.value = Id
    getData();
    dialogVisible.value = true;
  }
  async function getData() {
    const res = await request.get("/api/FRInquireCustomer/GetInquireInfo", {
      inquireInfoId: inquireInfoId.value,
    });
  }
  return reactive({
    dialogVisible,
    handleClose,
    handleOpen,
  });
}
export default defineComponent({
  name: "inquiryPriceDialog",
  setup() {
    const leftTable = leftTables();
    const rightTable = rightTables();
    const dialog = dialogs();
    return {
      dialog,
      leftTable,
      rightTable,
    };
  },
});
</script>

<style scoped lang="scss">
.dialog-title {
  width: 100%;
  height: 52px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 24px;
  div:nth-child(1) {
    font-size: 16px;
    color: #303133;
    font-weight: 500;
  }
  div:nth-child(2) {
  }
  div:nth-child(3) {
    font-size: 14px;
    color: #fd953e;
  }
}
.dialog-container {
  .body {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    .left {
      flex: 1;
      box-sizing: border-box;
    }
    .right {
      flex: 1;
      box-sizing: border-box;
      padding-left: 8px;
      width: 100%;
    }
  }
}
::v-deep .el-dialog__header {
  padding: 0;
}
::v-deep .el-dialog__body {
  padding: 9px 22px 18px 24px;
}
.left-title {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}
::v-deep .from .el-table th.el-table__cell > .cell {
  font-size: 12px;
  color: #969799;
  font-weight: 500;
}
::v-deep .from .el-table--small .el-table__cell {
  padding: 2px 0;
}
::v-deep .from .el-table td.el-table__cell div {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.right-container {
  margin-top: 8px;
  padding: 0 8px 15px 8px;
  box-sizing: border-box;
  background: #f8f8f8;
  border: 1px solid #e4e7ed;
}
.left-from {
  width: 473px;
  background-color: #f8f8f8;
  padding: 8px;
  margin-top: 8px;
  .from-title {
    font-size: 12px;
    color: #606266;
    display: flex;
    align-items: center;
  }
  .from {
    margin-top: 8px;
  }
}
.new-from {
  padding: 0;
  width: 438px;
}
::v-deep .from-title .el-radio {
  height: 0;
}
::v-deep .from-title .el-radio__label {
  font-size: 12px;
  padding-left: 5px;
}
::v-deep .from-title .el-radio__inner {
  width: 12px;
  height: 12px;
}
::v-deep .el-input__inner {
  padding: 0 2px;
  background-color: #f2f3f5;
}
::v-deep .el-input--small .el-input__inner {
  height: 20px;
}
::v-deep .el-table--border .el-table__cell:first-child .cell {
  padding: 0;
  padding-left: 0;
}
.line {
  margin-top: 20px;
  width: 100%;
  border-top: 1px solid #f1f2f4;
}
.yj {
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: right;
  margin-right: 10px;
  span:nth-child(1) {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
  }
  span:nth-child(2) {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
    text-decoration: line-through;
  }
}
.min-price {
  margin-top: 16px;
  display: flex;
  justify-content: right;
  align-items: center;
  margin-right: 10px;
  .items1 {
    font-size: 14px;
    color: #ef4333;
    font-weight: 500;
  }
  .items2 {
    font-size: 14px;
    color: #ef4333;
    font-weight: 700;
  }
  .items3 {
    font-size: 24px;
    color: #ef4333;
    font-weight: 700;
  }
}
.btns {
  margin-top: 25px;
  display: flex;
  div {
    padding: 8px 16px 8px 16px;
    cursor: pointer;
  }
  div:nth-child(1) {
    background: #fd953e;
    border-radius: 2px;
    color: #ffffff;
  }
  div:nth-child(2) {
    background: #fcf1e7;
    border: 1px solid #fd953e;
    border-radius: 2px;
    color: #fd953e;
    margin-left: 8px;
  }
  div:nth-child(3) {
    background: #ffffff;
    border: 1px solid #e4e7ed;
    border-radius: 2px;
    color: #3c4144;
    margin-left: 8px;
    padding: 8px 18px 8px 18px;
  }
}
</style>