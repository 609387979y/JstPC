<template>
    <div style="background-color: #fff;padding: 16px 24px;">
        <manifestTipsVue hidebtn v-if="infoData.Status === 3" tiptype="error" title="失败" :content="infoData.FailReason">
        </manifestTipsVue>

        <ManifestPreviewVue :model="infoData"></ManifestPreviewVue>
    </div>
</template>

<script>
import { defineComponent } from "vue"
import manifestTipsVue from "./components/manifestTips.vue"
import ManifestPreviewVue from "./components/ManifestPreview.vue"
export default defineComponent({
    components: {
        ManifestPreviewVue,
        manifestTipsVue
    },
    data() {
        return {
            id: 0,
            infoData: {Details:[]}
        }
    },
    methods: {
        async getData() {
            let res = await this.$http.get("/api/CargoEDISHManifest/GetInfo", { id: this.id })
            if (!res.Status) {
                this.$message.error(res.Message ?? '失败')
                return;
            }

            this.infoData = res.Data;
        }
    },
    activated() {
        this.id = this.$route.query.id
        this.getData()
    }
})
</script>

<style lang='scss' scoped>
</style>