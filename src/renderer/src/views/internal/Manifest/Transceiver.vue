<template>
	<div class="container Transceiver">
		<div class="title">收发通</div>

		<div class="btnbox">
			<div class="btnlist">
				<el-button type="success" size="mini" @click="add()">
					<el-icon>
						<plus />
					</el-icon>新增
				</el-button>
				<el-button @click="copyTemplate(null)" size="mini">
					<el-icon>
						<document-copy />
					</el-icon>复制
				</el-button>
				<el-button @click="deleteTemplate(null)" size="mini">
					<el-icon>
						<delete />
					</el-icon>删除
				</el-button>
			</div>
			<div class="searchbox">
				<el-input v-model="search.tempName" size="mini" placeholder="关键字查询">
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

		<JstPageTable
			@change="getList"
			:data="data"
			:option="tableOption"
			class="manifesttable"
			:rowClassName="tableRowClassName"
		>
			<el-table-column type="selection" width="40px" fixed="left"></el-table-column>
			<el-table-column prop="tempname" label="模板名称">
				<template #default="scope">
					<span @click="openEdit(scope.row.Id)" class="tempname">{{ scope.row.TempName }}</span>
				</template>
			</el-table-column>

			<el-table-column prop="SH_NAME" label="发货人名称"></el-table-column>
			<el-table-column prop="CN_NAME" label="收货人名称"></el-table-column>
			<el-table-column prop="NT_NAME" label="通知人名称"></el-table-column>
			<el-table-column prop="EmployeeName" label="创建人员"></el-table-column>
			<el-table-column prop="CreateTime" label="创建时间" width="124px"></el-table-column>
			<el-table-column prop="remark" label="操作" width="136px" fixed="right">
				<template #default="scope">
					<div class="tablebtn">
						<span @click="openEdit(scope.row.Id)" class="green">编辑</span>
						<span @click="copyTemplate(scope.row.Id)" class="green">复制创建</span>
						<span @click="deleteTemplate(scope.row.Id)" class="red">删除</span>
					</div>
				</template>
			</el-table-column>
		</JstPageTable>
	</div>

	<el-dialog
		v-model="SFTDialog"
		title="收发通信息模板"
		width="1000px"
		top="60px"
		custom-class="SFTDialog"
		@close="sftreset"
	>
		<div class="SFTBox">
			<el-form>
				<div class="temptopbox">
					<div class="title">
						<span>模板名称</span>
					</div>
					<div class="content" :class="isTempName ? 'namesuccess' : 'namewarning'">
						<el-input @input="namecahnge" v-model="model.TempName" placeholder="请输入模板名称"></el-input>
					</div>
				</div>
				<ManifestSFT :form="model"></ManifestSFT>
			</el-form>
		</div>
		<div class="SFTbottom">
			<el-button size="mini" @click="SFTDialog = false">取消</el-button>
			<el-button size="mini" @click="saveTemplate" type="success">保存</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { defineComponent, ref, reactive, onActivated, computed, watch } from "vue";
import request from "@/public/request";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

import ManifestSFT from "./components/ManifestSFT.vue";
import { Search, Delete, DocumentCopy, Plus } from "@element-plus/icons";
import { utils, useTableOption } from "justom-share"

export default defineComponent({
	components: {
		Search,
		Delete,
		DocumentCopy,
		Plus,
		ManifestSFT
	},
	setup() {

		const search = ref({
			tempName: ''
		})

		const data = ref([]);
		const SFTDialog = ref(false);
		const model = ref({
			Id: 0,
			TempName: "",
			SH_CODE: "",
			SH_CNTRY: "",
			SH_NAME: "",
			SH_ADDR: "",
			SH_TEL: "",
			SH_AEO: "",
			SH_EMAIL: "",
			SH_FAX: "",
			CN_CODE: "",
			CN_CNTRY: "",
			CN_NAME: "",
			CN_ADDR: "",
			CN_TEL: "",
			CN_AEO: "",
			CN_ATTN: "",
			CN_ATTN_TEL: "",
			CN_EMAIL: "",
			CN_FAX: "",
			NT_CODE: "",
			NT_CNTRY: "",
			NT_NAME: "",
			NT_ADDR: "",
			NT_TEL: "",
			NT_AEO: "",
			NT_EMAIL: "",
			NT_FAX: ""
		})

		const isTempName = ref(true);

		// 列表配置
		const tableOption = useTableOption({
			// 选中筛选器
			selectFilter(data) {
				return data.Id;
			}
		});
		//获取列表
		async function getList() {

			tableOption.loading = true;

			// 调用接口
			let res = await request.get("/api/CargoEDISFTTemp/GetList", {
				Page: tableOption.page,
				Limit: tableOption.pageSize,
				tempName: search.value.tempName
			})

			// 设置总数和当前页数据
			tableOption.total = res.Data.Total;
			for (let row of res.Data.Rows) {
				row.CreateTime = utils.formatDateTime(row.CreateTime);
				row.UpdateTime = utils.formatDateTime(row.UpdateTime);
			}
			data.value = res.Data.Rows;

			// Loading 结束
			tableOption.loading = false;

		}



		// 表格选中样式回调
		function tableRowClassName({ row, rowIndex }) {
			let color = ''
			for (let item of tableOption.selected.values()) {
				if (item === row.id) color = 'table-SelectedRow-bgcolor'
			}
			return color
		}
		// 搜索模板
		function searchclick() {
			tableOption.page = 1;
			getList();
		}
		// 新增模板
		function add() {
			model.value = {
				Id: 0,
				TempName: "",
				SH_CODE: "",
				SH_CNTRY: "",
				SH_NAME: "",
				SH_ADDR: "",
				SH_TEL: "",
				SH_AEO: "",
				SH_EMAIL: "",
				SH_FAX: "",
				CN_CODE: "",
				CN_CNTRY: "",
				CN_NAME: "",
				CN_ADDR: "",
				CN_TEL: "",
				CN_AEO: "",
				CN_ATTN: "",
				CN_ATTN_TEL: "",
				CN_EMAIL: "",
				CN_FAX: "",
				NT_CODE: "",
				NT_CNTRY: "",
				NT_NAME: "",
				NT_ADDR: "",
				NT_TEL: "",
				NT_AEO: "",
				NT_EMAIL: "",
				NT_FAX: ""
			}
			SFTDialog.value = true;
		}
		// 关闭弹窗
		function sftreset() {
			model.value = {
				Id: 0,
				TempName: "",
				SH_CODE: "",
				SH_CNTRY: "",
				SH_NAME: "",
				SH_ADDR: "",
				SH_TEL: "",
				SH_AEO: "",
				SH_EMAIL: "",
				SH_FAX: "",
				CN_CODE: "",
				CN_CNTRY: "",
				CN_NAME: "",
				CN_ADDR: "",
				CN_TEL: "",
				CN_AEO: "",
				CN_ATTN: "",
				CN_ATTN_TEL: "",
				CN_EMAIL: "",
				CN_FAX: "",
				NT_CODE: "",
				NT_CNTRY: "",
				NT_NAME: "",
				NT_ADDR: "",
				NT_TEL: "",
				NT_AEO: "",
				NT_EMAIL: "",
				NT_FAX: ""
			}
		}

		function namecahnge(val) {
			if (val) {
				isTempName.value = true;
			} else {
				isTempName.value = false;
			}
		}


		async function openEdit(id) {
			let res = await request.get("/api/CargoEDISFTTemp/GetInfo", {
				id: id
			})
			if (res.Status == false) {
				ElMessage.error(res.Message);
				return
			}
			model.value = res.Data;
			SFTDialog.value = true;
		}

		/**
		 * 保存模板
		 */
		async function saveTemplate() {
			if (model.value.Id != 0) {
				let res = await request.post("/api/CargoEDISFTTemp/Update", model.value)
				if (res.Status == false) {
					ElMessage.error(res.Message);
					return
				}
				ElMessage.success("成功")
			} else {
				let res = await request.post("/api/CargoEDISFTTemp/Create", model.value)
				if (res.Status == false) {
					ElMessage.error(res.Message);
					return
				}
				ElMessage.success("成功")
			}

			getList()
			SFTDialog.value = false;
		}

		/**
		 * 删除模板
		 * @param {*} id 
		 */
		async function deleteTemplate(id) {
			let ids = []
			if (id) {
				ids = [id]
			} else {
				if (tableOption.selected.length == 0) {
					ElMessage.warning("请选择一条数据")
					return;
				}
				ids = tableOption.selected
			}

			let res = await request.post("/api/CargoEDISFTTemp/DeleteList", {
				idList: ids
			})
			if (res.Status == false) {
				ElMessage.error(res.Message);
				return
			}
			ElMessage.success("成功")
			getList()
		}

		async function copyTemplate(id) {
			let select = 0
			if (id) {
				select = id
			} else {
				if (tableOption.selected.length == 0) {
					ElMessage.warning("请选择一条数据")
					return;
				}
				select = tableOption.selected[0]
			}

			let res = await request.get("/api/CargoEDISFTTemp/GetInfo", {
				id: select
			})

			if (res.Status == false) {
				ElMessage.error(res.Message);
				return
			}
			model.value = res.Data;
			model.value.Id = 0;

			SFTDialog.value = true;

		}





		onActivated(async () => {
			getList();
		});
		return {
			search,
			data,
			tableOption,
			tableRowClassName,
			getList,
			searchclick,
			SFTDialog,
			model,
			add,
			sftreset,
			namecahnge,
			isTempName,
			openEdit,
			saveTemplate,
			deleteTemplate,
			copyTemplate
		}
	},
})
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	background: #ffffff;
	box-sizing: border-box;
	padding: 16px 24px;

	.title {
		font-size: 14px;
		color: #303133;
		letter-spacing: 0;
		font-weight: 500;
		line-height: 20px;
		margin-bottom: 8px;
	}

	.btnbox {
		height: 40px;
		display: flex;
		justify-content: space-between;
		margin-bottom: 12px;

		.btnlist {
			display: flex;
			align-items: center;

			button {
				i {
					margin-right: 2px;
				}
			}
		}

		.searchbox {
			width: 321px;
			display: flex;
			align-items: center;
		}
	}
	.tablebtn {
		width: 100%;
		display: flex;
		align-items: center;
		span {
			display: inline-block;
			float: left;
			cursor: pointer;
			letter-spacing: -0.86px;
		}
		.green {
			color: #8dce6c;
			margin-right: 5px;
		}
		.red {
			margin-left: 15px;
			color: #ef4333;
		}
	}
	.tempname {
		color: #8dce6c;
		letter-spacing: 0;
		font-weight: 400;
		text-decoration: underline;
		cursor: pointer;
	}
}
.Transceiver {
	.btnbox {
		:deep(.el-input__inner) {
			border: 1px solid #8dce6c;
		}
		:deep(.el-input-group__append, .el-input-group__prepend) {
			background-color: #8dce6c;
			border: 1px solid #8dce6c;

			.el-icon {
				color: #ffffff;
			}
		}
	}
}
</style>
<style lang="scss">
.SFTDialog {
	position: relative;

	.SFTBox {
		width: 100%;
		height: 600px;
		box-sizing: border-box;
		overflow: auto;
		padding: 17px 15px 67px 15px;

		.temptopbox {
			width: 100%;
			height: 37px;
			border: 1px solid #ebeef5;
			border-bottom: none;
			box-sizing: border-box;
			display: flex;

			.title {
				text-align: center;
				padding-left: 5px;
				width: 114px;
				height: 36px;
				line-height: 36px;
				box-sizing: border-box;
				background-color: #f8f8f8;
				color: #909399;
				border-right: 1px solid #ebeef5;

				span {
					position: relative;
				}

				span::before {
					content: "*";
					position: absolute;
					top: -9px;
					left: -8px;
					color: #ef4333;
				}
			}

			.content {
				flex: 1;
				display: flex;
				align-items: center;

				.el-input__inner {
					background: rgba(0, 0, 0, 0);
					border: none;
				}
			}
			.namesuccess {
				background: #f0f9ea;
			}
			.namewarning {
				background: #f9eeea;
			}
		}
	}
	.SFTBox::-webkit-scrollbar {
		width: 4px;
	}
	.SFTBox::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: rgba(0, 0, 0, 0.2);
	}
	.SFTBox::-webkit-scrollbar-track {
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
			width: 86px;
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
