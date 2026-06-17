<template>
    <div class="menu-layout">

        <el-dropdown v-if="showMenu" class="option" trigger="click">
            <img src="@/assets/images/more-option.svg" />
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="remove">移除</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>

        <div @click="$emit('triggerClick')" class="menu-group-item ">

            <div class="menu-group-item-img">
                <slot>
                    <div v-if="textIcon != null" :style="textIcon.style" class="text-icon">
                        {{ textIcon.text }}
                    </div>
                </slot>
            </div>

            <div>
                <div class="menu-group-item-title">
                    <slot name="title">
                        {{ title }}
                    </slot>
                </div>
                <div class="menu-group-item-description">
                    <slot name="description">
                        {{ description }}
                    </slot>
                </div>
            </div>

        </div>

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
        description: {
            type: String,
            default: ""
        },
        showMenu: {
            type: Boolean,
            default: false
        },
        textIcon: {
            type: Object,
            default: () => {
                return {
                    text: "",
                    style: ""
                }
            }
        }
    },
    emits: ["triggerClick,remove"],
    computed: {
        actualImg() {
            const imgUrl = new URL(this.src, import.meta.url)
            return imgUrl
        }
    },
    data() {
        return {

        }
    },
    methods: {
        remove() {
            this.$emit("remove")
        }
    },
    created() {

    }
})
</script>

<style lang='scss' scoped>
.menu-layout {
    position: relative;

    .menu-group-item {
        width: 250px;
        padding: 15px;
        display: flex;
        box-sizing: border-box;
        cursor: pointer;
        position: relative;
        transition: 0.5s;
        background-color: #fff;
        border-radius: 4px;

        &:hover {
            box-shadow: 1px 1px 10px #ececec;
        }

        border: 1px solid #f2f3f5;

        .menu-group-item-img {
            width: 56px;
            height: 56px;
            margin-right: 10px;
        }

        .menu-group-item-title {
            font-size: 14px;
            font-weight: bold;
            line-height: 20px;
            overflow: hidden;
            white-space: nowrap;
        }

        .menu-group-item-description {
            color: #cbcbcb;
            display: -webkit-box; //谷歌
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2; //显示几行
            overflow: hidden;
        }


    }

    .option {
        position: absolute;
        top: 7px;
        right: 10px;
        z-index: 100;
        cursor: pointer;
        display: none;

    }

    &:hover {
        .option {
            display: block;
        }
    }

    .text-icon {
        width: 56px;
        height: 56px;


        text-align: center;
        line-height: 54px;
        font-size: 16px;
        color: #fff;
        background-color: #fff;
        border-radius: 50%;
        font-weight: 700;
    }
}
</style>