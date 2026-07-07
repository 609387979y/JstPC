<template>
    <div class="info-box">
        <div class="info-item" :class="value?.Status != 1 ? 'my-info' : ''" v-for="(value, i) in info" :key="i">
            <template v-if="value?.Status == 1">
                <div class="avatar-box">
                    <el-avatar :size="32" :src="value.Avatar" style="margin-top: 4px">
                        <img src="@/assets/default-avatar.svg" />
                    </el-avatar>
                </div>
                <div class="info-text">
                    <div class="name-class">{{ value.RealName }}<span v-if="value.MobilePhone">（{{ value.MobilePhone
                            }}）</span></div>
                    <div class="text-box">
                        <div style="white-space: pre-wrap;" v-html="value?.ChatContent">
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="join-class" v-if="joinArr.indexOf(value?.RealName) == -1 || joinArr[i] == value.RealName">
                    <el-tag type="info">业务员{{ value?.RealName }}进入</el-tag>{{
                        joinArrFun(value.RealName, i)
                    }}
                </div>
                <div class="info-text">
                    <div class="name-class">{{ value.RealName }}<span v-if="value.MobilePhone">（{{ value.MobilePhone
                            }}）</span></div>
                    <div class="text-box">
                        <div style="white-space: pre-wrap;" v-html="value?.ChatContent">
                        </div>
                    </div>
                </div>
                <div class="avatar-box">
                    <el-avatar :size="32" :src="value.Avatar" style="margin-top: 4px">
                        <img src="@/assets/default-avatar.svg" />
                    </el-avatar>
                </div>
            </template>
        </div>
        <div class="tip" v-if="info?.length < 2">目前正在联系供应商中···</div>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({
    info: {
        type: Object,
        default: () => { }
    }
})

const userInfo = computed(() => {
    if (store.state.auth.employee) {
        return store.state.auth.user;
    } else {
        return {};
    }
});

const scrollLast = () => {
    if (!document.querySelector('.info-box')) return
    console.log(document.querySelector('.info-box').scrollHeight)
    document.querySelector('.info-box').scrollTo({
        top: document.querySelector('.info-box').scrollHeight, // 容器内部内容的总高度
        behavior: 'smooth'
    });
}

const joinArr = ref([])
const joinArrFun = (val, i) => {
    if (joinArr.value.indexOf(val) != -1) return
    joinArr.value[i] = val
    return 12333
}

defineExpose({
    scrollLast
})

watch(
    () => props.info,
    scrollLast()
)

onMounted(() => {
    scrollLast()
})
</script>

<style lang="scss" scoped>
.info-box {
    overflow-y: auto;

    .info-item {
        display: flex;
        margin-top: 8px;
        flex-wrap: wrap;

        &:first-child {
            margin-top: 0;
        }

        &.my-info {
            justify-content: right;

            .info-text {
                margin-left: 0 !important;
                margin-right: 10px !important;

                .name-class {
                    width: auto !important;
                    text-align: right;
                }
            }
        }

        .avatar-box {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }

        .info-text {
            margin-left: 10px;
        }


    }

    .tip {
        text-align: center;
        margin-top: 8px;
        font-size: 14px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.45);
    }

    .text-box {
        background-color: #F7F7F7;
        max-width: 247px;
        border-radius: 4px;
        padding: 12px;
        margin-top: 10px;
        font-size: 14px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.85);
    }
}

.join-class {
    width: 100%;
    text-align: center;
    margin: 5px 0;

    :deep(.el-tag--info){
        border: none !important;
    }

    span {
        display: inline-block;
    }
}

.view-content{
    max-width: none !important;
}
</style>