<template>
    <div v-show="showIcon">
        <el-popover
            popper-class="manifest-error-tips"
            placement="top-start"
            :width="220"
            trigger="hover"
            :disabled="disablePopover"
            :hide-after="10"
        >
            <template #reference>
                <slot>
                    <el-icon color="#F56C6C">
                        <warning-filled />
                    </el-icon>
                </slot>
            </template>
            <template #default>

                <div class="error">
                    <div v-for="(item, idx) in errorContent" :key="idx">{{ idx + 1 }}. {{ item }}</div>
                </div>
            </template>
        </el-popover>
    </div>
</template>
<script>
import { defineComponent } from "vue"

import { WarningFilled } from "@element-plus/icons"
export default defineComponent({
    components: {
        WarningFilled
    },
    props: {
        field: {
            type: String,
            default: ""
        }
    },
    inject: {
        fieldErrors: "manifest-form-fieldErrors"
    },
    data() {
        return {

        }
    },
    methods: {
        getErrors() {
            if(!this.fieldErrors){
				return []
			}
            if (typeof this.field == "string") {
                // string
                let errors = this.fieldErrors.value.get(this.field)
                if (errors == undefined || errors.length == 0) {
                    return [];
                }
                return errors
            } else {
                // 数组
                let arr = []
                for (let item of this.field) {
                    let errors = this.fieldErrors.value.get(item)
                    if (errors == undefined || errors.length == 0) {
                        continue;
                    } else {
                        arr = arr.concat(errors)
                    }
                }
                return arr
            }
        }
    },
    computed: {
        showIcon() {
            if (this.$slots.default) {
                // 有slot的情况下 不显示icon 通过disabled来判断是否显示弹窗
                return true;
            }
            if (!this.fieldErrors) {
                return false;
            }

            if (this.getErrors().length == 0) {
                return false;
            } else {
                return true
            }
        },

        disablePopover() {
            if (!this.$slots.default) {
                // 不存在slot的时候  不进行disable
                return false;
            }


            if (this.getErrors().length == 0) {
                return true;
            } else {
                return false
            }

        },
        errorContent() {
            if (this.showIcon == false) {
                return [];
            }
            return this.getErrors();
        }
    },
    created() {
  
    }
})
</script>
<style>
.el-popover.manifest-error-tips {
    padding: 5px !important;
}
</style>
<style lang="scss" scoped>
.error {
    font-size: 12px;
    color: #F56C6C;
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 400;
    // background: #ffeeee;
    padding: 5px;
}
</style>
