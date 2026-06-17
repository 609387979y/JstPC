<template>
    <div>
        <NotOpenDialogVue type="default" ref="notOpenDialogRef"></NotOpenDialogVue>
    </div>
</template>

<script>
import { defineComponent } from "vue"
import NotOpenDialogVue from "./NotOpenDialog.vue";
import { getElectronAgent } from "@share/agent"
import { useCompanyCertification } from "@/composables/user/certification"
import { applications } from "@/components/menu/ApplicationMenu"
export default defineComponent({
    components: {
        NotOpenDialogVue
    },
    data() {
        return {

        }
    },
    setup() {
        const agent = getElectronAgent();
        const certification = useCompanyCertification()
        return {
            agent,
            certification
        }
    },
    methods: {
        async entry(code) {
            switch (code) {
                case "nbManifest":
                    this.agent?.ipcRequest("window/externalUrl", 'http://www.justom.cn/#/jstvue/NewManifest');
                    break;
                case "shManifest":
                    if ((await this.certification.toUserAuth()) == false) {
                        this.agent?.ipcRequest("manifest/manifest", "/manifest/NewManifest")
                    }
                    break;
                case "freightRate":
                    this.agent?.ipcRequest("freight/freight", "/freightRate/PriceQuery")
                    break;
                case "voyageList":
                    this.agent?.ipcRequest("shippingfile/shippingfile", "/ShippingFile/ShippingFile?type=1")
                    break;
                case "shippingFile":
                    this.agent?.ipcRequest("shippingfile/shippingfile", "/ShippingFile/ShippingFile?type=2")
                    break;
                case "boxTrack":
                    if ((await this.certification.toUserAuth()) == false){
                      this.agent?.ipcRequest("boxTrack/boxTrack", "/internal/exitQuery")
                    }
                    break;
                case "fastCargo":
                    if ((await this.certification.toUserAuth()) == false){
                        this.agent?.ipcRequest("fastCargo/fastCargo", "/fastCargo/fastCargoWorkbench")
                    }

                    break;
                case "voyage":
                     if ((await this.certification.toUserAuth()) == false){
                        this.agent?.ipcRequest("shippingQuery/shippingQuery", "/internal/shippingQuery")
                     }
                    break;
                default:
                    this.$refs.notOpenDialogRef.showDialog()
                    break;
            }
        }
    },
    created() {

    }
})
</script>

<style lang='scss' scoped>
</style>