import { RouteRecordRaw } from "vue-router";

const shipfileRoutes: RouteRecordRaw[] = [
	{
		name: "ShippingFile",
		path: "/ShippingFile/ShippingFile",
		component: () => import("@/views/internal/ShippingFile/ShippingFile.vue"),
		meta: {
			title: "船司资料下载"
		},
	},
	{
		name: "filelist",
		path: "/ShippingFile/filelist",
		component: () => import("@/views/internal/ShippingFile/filelist.vue"),
		meta: {
			title: "船司文件下载",
			lastPagePath: '/ShippingFile/ShippingFile'
		},
	}
]
export default <RouteRecordRaw[]>[
	...shipfileRoutes,
];