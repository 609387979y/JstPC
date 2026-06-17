<template>
    <div >
       <UserSettingVue></UserSettingVue>
    </div>
</template>

<script>
import { defineComponent } from "vue"
import UserSettingVue from "@/components/user/userSetting/index.vue"
export default defineComponent({
    components: {
        UserSettingVue
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
</style>