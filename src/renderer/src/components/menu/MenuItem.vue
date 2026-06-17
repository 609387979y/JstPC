<template>
    <div :class="selected?'selected':''" class="menu-item">
        <!-- <div class="icon">
            <el-icon :size="20">
                <slot name="icon"></slot>
            </el-icon>
        </div> -->
        <div class="name">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue"
export default defineComponent({
    components: {

    },
    props:{
        /**
         * 是否已选中
         */
        selected: {
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
.menu-item {
    text-align: center;
    cursor: pointer;
    color:#C8C9CC;
    &.selected {
         color: #409eff;
    }
    // &:hover {
    //     color: #409eff;
    // }
    .name {
        margin-top: 7px;
        font-size: 12px;
        letter-spacing: 0px;
        font-weight: 400;

    }
    .icon {
    }
}
</style>