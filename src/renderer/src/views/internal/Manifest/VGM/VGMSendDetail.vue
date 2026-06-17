<template>
    <div style="background-color: #fff;padding: 16px 24px;">
        <manifestTipsVue hidebtn v-if="infoData.Status === 2" tiptype="error" title="失败" :content="infoData.FailReason">
        </manifestTipsVue>

        <VGMPreview :model="infoData"></VGMPreview>
    </div>
</template>

<script>
import { defineComponent } from "vue"
import VGMPreview from "./components/VGMPreview.vue"
import manifestTipsVue from "../components/manifestTips.vue"


export default defineComponent({
    components: {
        VGMPreview,
        manifestTipsVue
    },
    data() {
        return {
            id: 0,
            infoData: {}
        }
    },
    methods: {
        async getData() {
            let res = await this.$http.get("/api/CargoEDISHVGM/GetVGMInfo", { id: this.id })
            if (!res.Status) {
                this.$message.error(res.Message ?? '失败')
                return;
            }

            this.infoData = res.Data;
        }
    },
    activated() {
        this.id = this.$route.query.vgmId
        this.getData()
    }
})
</script>

<style lang='scss' scoped>
</style>