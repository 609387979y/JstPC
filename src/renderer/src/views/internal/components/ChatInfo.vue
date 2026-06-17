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
                        <div style="white-space: pre-wrap;"
                            v-html="value?.ChatContent">
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="info-text">
                    <div class="name-class">{{ value.RealName }}<span v-if="value.MobilePhone">（{{ value.MobilePhone
                            }}）</span></div>
                    <div class="text-box">
                        <div style="white-space: pre-wrap;"
                            v-html="value?.ChatContent">
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
import { computed } from 'vue';
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
</script>

<style lang="scss" scoped>
.info-box {
    overflow-y: auto;

    .info-item {
        display: flex;
        margin-top: 8px;

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
        padding: 4px 12px;
        margin-top: 10px;
        font-size: 14px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.85);
    }
}
</style>