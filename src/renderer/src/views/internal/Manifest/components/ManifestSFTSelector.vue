<template>
    <el-dialog v-model="show" top="50px" title="收发通信息模板选择" width="1100px" custom-class="previewDialog">
		<div class="previewBox">
			<div style="display: flex; justify-content: space-between;padding-bottom: 18px;">
				<div></div>
				<div>
					<el-input v-model="keyword" size="mini" placeholder="关键字查询">
						<template #append>
							<el-button @click="searchclick()">
								<el-icon>
									<search />
								</el-icon>
							</el-button>
						</template>
					</el-input>
				</div>
			</div>
			<div class="list">
				<el-scrollbar height="460px">
					<div :class="item.Id == chooseId?'choose':''" @click="choose(item.Id)" class="item" v-for="item in data" :key="item.Id">
						<table >
							<tr>
								<td class="label">模板名称</td>
								<td class="value">{{ $utils.formatEmptyString(item.TempName) }}</td>
							</tr>
							<tr>
								<td class="label">发货人名称</td>
								<td class="value">{{ $utils.formatEmptyString(item.SH_NAME) }}</td>
							</tr>
							<tr>
								<td class="label">收货人名称</td>
								<td class="value">{{ $utils.formatEmptyString(item.CN_NAME) }}</td>
							</tr>
							<tr>
								<td class="label">通知人名称</td>
								<td class="value">{{ $utils.formatEmptyString(item.NT_NAME) }}</td>
							</tr>

							<tr>
								<td class="label">创建人</td>
								<td class="value">{{ $utils.formatEmptyString(item.EmployeeName) }}</td>
							</tr>

							<tr>
								<td class="label">创建时间</td>
								<td class="value">{{ $utils.formatDateTime(item.CreateTime) }}</td>
							</tr>
						</table>
						<div class="chooseimg" v-if="item.Id == chooseId">
							<img src="../../../../assets/images/SFT-select.svg" />
						</div>
					</div>
				</el-scrollbar>
			</div>
		</div>
		<div class="SFTbottom">
			<el-button size="mini" @click="show = false">取消</el-button>
			<el-button size="mini" @click="confirm" type="primary">确定</el-button>
		</div>
        <!-- <template #footer>
            <span class="dialog-footer">
                <el-button @click="show = false">取消</el-button>
                <el-button @click="confirm" type="primary">确定</el-button>
            </span>
        </template> -->
    </el-dialog>
</template>
<script>
import { defineComponent } from "vue"
import { Search } from "@element-plus/icons";
export default defineComponent({
    components: {
        Search
    },
    data() {
        return {
            // 搜索关键字
            keyword: "",
            // 数据
            data: [],
            // 显示dialog
            show: false,
            chooseId:0
        }
    },
    emits:["choose"],
    methods: {
        async openSelector() {
            await this.getList();
            this.show = true
        },
        choose(id){
            this.chooseId = id;
        },
        async getList() {
            let res = await this.$http.get("/api/CargoEDISFTTemp/GetList", {
                Page: -1,
                tempName: this.keyword
            })
            this.data = res.Data.Rows
            this.chooseId = 0;
        },
        async confirm(){
            if(this.chooseId == 0){
                this.$message.warning("请选择一个模板");
                return;
            }
            let res = await this.$http.get("/api/CargoEDISFTTemp/GetInfo",{
                id:this.chooseId
            })
            this.$emit("choose",res.Data);
            this.show = false;
        }
    },
    watch:{
        keyword(){
            this.getList();
        }
    },
    mounted() {
        // this.getList();
    }
})
</script>
<style lang="scss" scoped>
.item {

    width: calc(100% - 8px);
    margin-top: 20px;
    cursor: pointer;
    border: 2px solid rgba(0,0,0,0);
	box-sizing: border-box;
	position: relative;
    &:hover{
        border: 2px solid #8DCE6C;
    }
    &.choose{
        border: 2px solid #8DCE6C;
		border-radius: 4px;
    }
    table{
        width:100%;
            border-collapse: collapse;
    }
    td {
        border: 1px solid #e4e7ed;
    }
    tr {
        height: 35px;
    }
    .label {
        background: #f2f3f5;
        font-size: 10.35px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        width: 100px;
        padding-left: 10px;
    }
    .value {
        padding-left: 10px;
    }
	.chooseimg{
		position: absolute;
		bottom: -4px;
		right: 0;
	}
}
</style>
<style lang="scss">
.previewDialog {
	position: relative;

	.previewBox {
		width: 100%;
		height: 600px;
		box-sizing: border-box;
		overflow: auto;
		padding: 17px 15px 67px 15px;

		
	}
	.previewBox::-webkit-scrollbar {
		width: 4px;
	}
	.previewBox::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: rgba(0, 0, 0, 0.2);
	}
	.previewBox::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		border-radius: 0;
		background: rgba(0, 0, 0, 0.1);
	}

	.SFTbottom {
		width: 100%;
		height: 50px;
		background: #ffffff;
		text-align: center;
		box-sizing: border-box;
		padding-top: 14px;
		box-shadow: 0 -1px 1px 0 rgba(60, 65, 68, 0.25);
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 10;

		button {
			margin: 0 13px;
		}
	}

	.el-dialog__header {
		border-bottom: 1px solid #f2f3f5;
		text-align: center;

		.el-dialog__title {
			font-size: 24px;
			color: #303133;
			letter-spacing: -1.71px;
			font-weight: 500;
		}
	}
	.el-dialog__body {
		padding: 0;
	}
}
</style>