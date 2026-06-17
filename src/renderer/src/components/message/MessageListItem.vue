<template>
    <div class="info" :class="isRead?'read':''">
        <div class="title">{{ title }}</div>
        <div class="info-remark">{{ description }}</div>
        <div class="info-remark">{{ time }}</div>
    </div>
</template>

<script>
import { defineComponent } from "vue"
export default defineComponent({
    props: {
        title: {
            type: String,
            default: ""
        },
        /**
         * 详情
         */
        description: {
            type: String,
            default: ""
        },
        /**
         * 时间
         */
        time: {
            type: String,
            default: ""
        },
        /**
         * 是否已读
         */
        isRead: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        }
    },
    methods: {

    },
    created() {

    }
})
</script>

<style lang='scss' scoped>
.info {
    cursor: pointer;
    padding:12px 24px;
    .title {
        margin-bottom: 4px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        // line-height: 1.5715;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .info-remark {
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        // line-height: 1.5715;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
          transition: all .3s;
    &:hover {
        background: #e6f7ff;
        transition: all .3s;
    }
}
.read{
    opacity: .4;
    color: rgba(0,0,0,.85);
}
</style>