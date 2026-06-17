import { RouteRecordRaw } from "vue-router";

const manifestRoutes: RouteRecordRaw[] = [
	{
		name: "NewManifest",
		path: "/manifest/NewManifest",
		component: () => import("@/views/internal/Manifest/NewManifest.vue"),
		meta: {
			title: "新建舱单"
		},
	},
	{
		name: "Nrafts",
		path: "/manifest/Nrafts",
		component: () => import("@/views/internal/Manifest/Nrafts.vue"),
		meta: {
			title: "草稿箱",
		},
	},
	{
		name: "NraftsEdit",
		path: "/manifest/NraftsEdit",
		component: () => import("@/views/internal/Manifest/NraftsEdit.vue"),
		meta: {
			title: "编辑草稿",
			lastPagePath: '/manifest/Nrafts'
		},
	},
	{
		name: "UnSendEdit",
		path: "/manifest/UnSendEdit",
		component: () => import("@/views/internal/Manifest/UnSendEdit.vue"),
		meta: {
			title: "编辑舱单",
			lastPagePath: '/manifest/Tobesent'
		},
	},
	{
		name: "SentEdit",
		path: "/manifest/SentEdit",
		component: () => import("@/views/internal/Manifest/SentEdit.vue"),
		meta: {
			title: "编辑已发送舱单",
			lastPagePath: '/manifest/Hasbeensent'
		},
	},
	{
		name: "Tobesent",
		path: "/manifest/Tobesent",
		component: () => import("@/views/internal/Manifest/Tobesent.vue"),
		meta: {
			title: "待发送",
		},
	},
	{
		name: "manifestToBeSentDetail",
		path: "/manifest/toBeSentDetail",
		component: () => import("@/views/internal/Manifest/SendDetail.vue"),
		meta: {
			title: "详情",
			lastPagePath: '/manifest/Tobesent'
		},
	},
	{
		name: "Hasbeensent",
		path: "/manifest/Hasbeensent",
		component: () => import("@/views/internal/Manifest/Hasbeensent.vue"),
		meta: {
			title: "已发送",
		},
	},
	{
		name: "manifestSentDetail",
		path: "/manifest/sentDetail",
		component: () => import("@/views/internal/Manifest/SendDetail.vue"),
		meta: {
			title: "详情",
			lastPagePath: '/manifest/Hasbeensent'
		},
	},

	{
		name: "Transceiver",
		path: "/manifest/Transceiver",
		component: () => import("@/views/internal/Manifest/Transceiver.vue"),
		meta: {
			title: "收发通",
		},
	},
]

const vgmRoutes:RouteRecordRaw[] = [

	{
		name: "VGMNrafts",
		path: "/manifest/vgm/VGMNrafts",
		component: () => import("@/views/internal/Manifest/VGM/VGMNrafts.vue"),
		meta: {
			title: "草稿箱"
		},
	},
	{
		name: "NewVGM",
		path: "/manifest/vgm/NewVGM",
		component: () => import("@/views/internal/Manifest/VGM/NewVGM.vue"),
		meta: {
			title: "新建VGM",
			lastPagePath:"/manifest/vgm/VGMNrafts"
		},
	},
	{
		name: "VGMSend",
		path: "/manifest/vgm/VGMSend",
		component: () => import("@/views/internal/Manifest/VGM/VGMSend.vue"),
		meta: {
			title: "已发送"
		},
	},
	{
		name: "VGMNraftsEdit",
		path: "/manifest/vgm/VGMNraftsEdit",
		component: () => import("@/views/internal/Manifest/VGM/VGMNraftsEdit.vue"),
		meta: {
			title: "编辑草稿",
			lastPagePath:"/manifest/vgm/VGMNrafts"
		},
	},
	{
		name: "VGMSendEdit",
		path: "/manifest/vgm/VGMSendEdit",
		component: () => import("@/views/internal/Manifest/VGM/VGMSendEdit.vue"),
		meta: {
			title: "编辑VGM",
			lastPagePath:"/manifest/vgm/VGMSend"
		},
	},
	{
		name: "VGMSendDetail",
		path: "/manifest/vgm/VGMSendDetail",
		component: () => import("@/views/internal/Manifest/VGM/VGMSendDetail.vue"),
		meta: {
			title: "VGM详情",
			lastPagePath:"/manifest/vgm/VGMSend"
		},
	}

]
export default <RouteRecordRaw[]>[
	...manifestRoutes,
	...vgmRoutes
];