<template>
	<div class="shippingfile container">
		<div class="header">
			<div class="header-item" v-if="tabtype == 1" :class="tabtype == 1 ? 'header-item-active' : ''">船期表查询</div>
			<div class="header-item" v-if="tabtype == 2" :class="tabtype == 2 ? 'header-item-active' : ''">船司保函</div>
			<div class="bottomline" :class="tabtype == 2 ? 'bottomline2' : ''"></div>
		</div>
		<div v-if="tabtype == 1 && !iscqnull" class="wapper">
			<div class="wapper-item" v-for="item in cqlist" @click="gofilelist(1, item)">
				<div class="wapper-main">
					<div class="imgbox">
						<el-image class="wapper-image" fit="contain" :src="item.ShippingLogo" v-if="item.ShippingLogo">
						</el-image>
						<el-image class="wapper-image" fit="contain" :src="defaultimg" v-else>
						</el-image>
					</div>
					<div class="cqbox">
						<div class="cqbox_title">{{ item.ShippingName }}</div>
						<div class="cqbox_time">{{ item.Year }}年{{ item.Month }}月 船期表</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="tabtype == 2 && !iscsnull" class="wapper">
			<div class="wapper-item" v-for="item in cslist" @click="gofilelist(2, item)">
				<div class="wapper-main">
					<div class="imgbox">
						<el-image class="wapper-image" fit="contain" :src="item.ShippingLogo" v-if="item.ShippingLogo">
						</el-image>
						<el-image class="wapper-image" fit="contain" :src="defaultimg" v-else>
						</el-image>
					</div>
					<div class="bhbox">
						<div class="bhbox_title">{{ item.ShippingName }} 船司保函</div>
					</div>
				</div>
			</div>
		</div>

		<div v-if="tabtype == 1 && iscqnull" class="wapper">
			<AppNoData style="flex: 1;text-align: center;padding-bottom: 20px;">
				<template #content>暂无船期表</template>
			</AppNoData>
		</div>
		<div v-if="tabtype == 2 && iscsnull" class="wapper">
			<AppNoData style="flex: 1;text-align: center;padding-bottom: 20px;">
				<template #content>暂无船司保函</template>
			</AppNoData>
		</div>
	</div>
</template>

<script>
import {
	defineComponent,
	ref,
	reactive,
	onMounted
} from "vue";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import request from "@/public/request";
import AppNoData from "@/components/AppNoData.vue";

export default defineComponent({
	components: {
		AppNoData
	},
	setup() {
		const tabtype = ref(1);
		const defaultimg = ref("");
		const cqlist = ref([]);
		const cslist = ref([]);
		const router = useRouter();
		const route = useRoute();
		const iscqnull = ref(false);
		const iscsnull = ref(false);

		function changetab(i) {
			tabtype.value = i;
		}
		const setdefaultimg = async () => {
			let m = await import('@/assets/images/cs_defult.svg');
			defaultimg.value = m.default;
		}
		// 船期表
		async function getcqlist() {
			let res = await request.get('/api/MhShippingDate/GetShippingDateList', { Page: -1, Limit: -1, IsShow: 1 });
			if (res.Total == 0) {
				iscqnull.value = true
			} else {
				iscqnull.value = false
			}
			cqlist.value = res.Rows;
		}
		// 船司保函
		async function getcsbhlist() {
			let res = await request.get('/api/MhGuarantee/GetGuaranteeList', { Page: -1, Limit: -1, IsShow: 1 });
			if (res.Total == 0) {
				iscsnull.value = true
			} else {
				iscsnull.value = false
			}
			cslist.value = res.Rows;
		}
		function gofilelist(i, item) {
			let str = JSON.stringify(item);
			router.push({
				path: '/ShippingFile/filelist',
				query: {
					type: i,
					item: str
				}
			})
		}


		onMounted(() => {
			setdefaultimg();
			getcqlist();
			getcsbhlist();
			if (route.query.type) {
				changetab(route.query.type);
			} else {
				changetab(1);
			}

		});
		return {
			tabtype,
			changetab,
			defaultimg,
			setdefaultimg,
			cqlist,
			cslist,
			gofilelist,
			getcqlist,
			getcsbhlist,
			iscqnull,
			iscsnull
		}
	}
})
</script>

<style lang="scss" scoped>
.container {
	min-width: 1100px;
	background: #FFFFFF;
	border: 1px solid #E7E7E7;
}

.header {
	border-bottom: 1px solid #E4E7ED;
	box-sizing: border-box;
	padding: 0 16px;
	display: flex;
	position: relative;

	.header-item {
		line-height: 54px;
		font-size: 16px;
		color: #303133;
		letter-spacing: 0;
		margin-right: 32px;
		font-weight: 400;
		cursor: pointer;
	}

	.header-item-active {
		color: #409EFF;
		font-weight: 500;
	}

	.bottomline {
		position: absolute;
		left: 16px;
		bottom: 0;
		width: 80px;
		height: 2px;
		background: #409EFF;
		transition: all .3s;
	}

	.bottomline2 {
		width: 64px;
	}
}

.wapper {
	padding: 16px 8px 0 16px;
	padding-bottom: 0;
	box-sizing: border;
	display: flex;
	flex-wrap: wrap;

	.wapper-item {
		width: 25%;
		margin-bottom: 16px;
		padding-right: 8px;
		box-sizing: border-box;
		cursor: pointer;

		.wapper-main {
			width: 100%;
			background: #F7F8FA;
			height: 72px;
			box-sizing: border-box;
			padding: 8px;
			display: flex;

			.wapper-image {
				float: left;
				width: 56px;
				height: 56px;
				margin-right: 8px;
			}

			.cqbox {
				float: left;
				width: calc(100% - 64px);
				height: 100%;

				.cqbox_title {
					font-size: 16px;
					color: #3C4144;
					letter-spacing: 0;
					font-weight: bold;
					margin-top: 6px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.cqbox_time {
					font-size: 14px;
					color: #969799;
					letter-spacing: 0;
					margin-top: 2px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.cqbox_time:hover {
					color: #FA6400;
					text-decoration: underline;
				}
			}

			.bhbox {
				float: left;
				width: calc(100% - 64px);
				height: 100%;

				.bhbox_title {
					margin-top: 17px;
					font-size: 16px;
					color: #3C4144;
					letter-spacing: 0;
					font-weight: bold;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
}
</style>