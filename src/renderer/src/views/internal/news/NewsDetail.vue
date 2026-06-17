<template>
	<div v-if="newsinfo" class="newsDetail">

		<div class="detail">
			<div class="W1200px banxin">
				<div class="dis_f_c_c title"><span class="slh_one" :title="newsinfo.Title">{{ newsinfo.Title }}</span>
				</div>
				<div class="dis_f_c_c time"><img src="@/assets/images/time2.png" alt="" class="timeImg"> <span>发布时间:
						{{ newsinfo.Time.split("-")[0] }}年{{ newsinfo.Time.split("-")[1] }}月{{ newsinfo.Time.split("-")[2] }}日</span>
				</div>
				<div class="fwb" v-html="newsinfo.Content"></div>
			</div>
		</div>



	</div>
</template>

<script>
import {
	defineComponent,
	ref,
	reactive,
	onMounted,
	nextTick
} from "vue";
import request from "@/public/request";
import {
	useRoute,
	useRouter
} from 'vue-router';

export default defineComponent({
	components: {

	},
	setup() {

		const router = useRouter();
		const route = useRoute();
		const newsid = ref(0);
		const newsinfo = ref(null);


		function gozp() {
			router.push("/external/MHpage/socialRecruitment")
		}
		newsid.value = route.query.id;

		// 获取新闻详情
		async function getnewsinfo(id) {
			let res = await request.get('/api/MhPportalinfo/GetNewsInfo', { Id: id });
			newsinfo.value = res.Data;
		}


		//页面跳转
		function gopage(url) {
			router.push(url);
		}

		onMounted(() => {
			// 滚动到最上面
			document.querySelector(".el-main.view").scrollTo(0,0)
			getnewsinfo(newsid.value);

		})

		return {
			gozp,
			newsid,
			gopage,
			newsinfo
		}
	}
})
</script>

<style lang="scss" scoped>
.newsDetail {
	// background-color: #f4f6fb;
	width: 100%;
	min-height: 100vh;
	box-sizing: border-box;
	position: relative;

	.navHeader {
		width: 100%;
		height: 74px;
		background: #fff;
		border: 1px solid #f0f1f4;
		box-shadow: 0 0 24px 0 rgb(7 16 44 / 8%);
		position: relative;

		.headerBox {
			width: 1200px;
			height: 100%;
			margin: 0 auto;

			.logo {
				.image {
					cursor: pointer;
					width: auto;
					height: 34px;
				}
			}
		}

		.headerBottom {
			width: 100%;
			height: 2px;
			position: absolute;
			bottom: 0;
			left: 0;
		}

		.headerBottom :first-child {
			width: 100%;
			height: 2px;
			background: #4381fd;
		}

		.headerBottom :nth-child(2) {
			width: 100%;
			height: 2px;
			background: var(--theme);
		}

		.headerBottom :nth-child(3) {
			width: 100%;
			height: 2px;
			background: #00cbd2;
		}
	}

	.detail {
		margin-bottom: 124px;
		width: 100%;
		box-sizing: border-box;
		min-height: calc(100vh - 198px);
		display: flex;
		justify-content: center;
		align-items: flex-start;

	}

	.banxin {
		background: #fff;
		padding: 60px 120px 56px;
		overflow: hidden;

		.title {
			font-size: 30px;
			font-weight: 700;
			color: #24262f;
			margin-bottom: 22px;
		}

		.time {
			font-size: 16px;
			font-weight: 500;
			color: #444755;
			margin-bottom: 60px;

			.timeImg {
				width: 18px;
				height: 18px;
				margin-right: 12px;
				-o-object-fit: fit;
				object-fit: fit;
			}
		}

		.fwb {
			margin: 0 auto;
		}
	}

	.W1200px {
		width: 1200px;
	}
}

.MhLayout_bottom {
	.top {
		width: 100%;
		height: 334px;
		background-color: #1b2337;
		padding-top: 50px;
		box-sizing: border-box;

		.footer_top_left {
			width: 900px;

			.title {
				font-size: 15px;
				font-weight: 500;
				color: #fff;
				margin-bottom: 28px;
			}

			.titleContent {
				font-size: 14px;
				font-weight: 500;
				color: hsla(0, 0%, 100%, .5);
				margin-bottom: 16px;
				cursor: pointer;
				transition: all .35s;
			}

			.titleContent:hover {
				color: rgba(var(--theme-rgb), 1);
			}
		}

		.footer_top_right {
			.footer_top_right_qr_box {
				.footer_top_right_qr_text_top {
					font-size: 15px;
					font-weight: 500;
					color: #fff;
					margin-bottom: 26px;
				}

				.footer_top_right_qr_img {
					width: 104px;
					height: 104px;
					-o-object-fit: cover;
					object-fit: cover;
					border: 4px solid #fff;
					border-radius: 4px;
					margin-bottom: 14px;
					box-sizing: content-box;
					overflow: hidden;
				}

				.footer_top_right_qr_text_Bottom {
					font-size: 12px;
					font-weight: 500;
					color: #fff;
				}
			}
		}
	}

	.w1200px {
		min-width: 1200px;
	}

	.bottom {
		width: 100%;
		height: 54px;
		background-color: #181f31;

		.baLeft {
			.img {
				display: block;
				width: auto;
				height: 22px;
				opacity: .5;
				transition: all .35s;
				cursor: pointer;
				backface-visibility: hidden;
				-webkit-backface-visibility: hidden;
				-moz-backface-visibility: hidden;
				-ms-backface-visibility: hidden;
			}
		}

		.baRight {
			font-size: 13px;
			font-weight: 500;
			color: hsla(0, 0%, 100%, .5);
			display: flex;
			align-items: center;

			span {
				margin-right: 26px;
			}

			a {
				color: #fff;
				text-decoration: none;
				opacity: .5;
			}
		}

	}

}
</style>
