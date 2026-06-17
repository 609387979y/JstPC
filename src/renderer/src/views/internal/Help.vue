<template>
    <webview id="helpView" src="http://www.jstower.cn:8757/project-1/"  style="width:100%;height:100%">
        help
    </webview>
</template>

<script>
import { defineComponent } from "vue"
export default defineComponent({
    components: {

    },
    data() {
        return {

        }
    },
    methods: {

    },
    mounted() {
        const webview = document.getElementById('helpView')
        webview.addEventListener('new-window', (e) => {
            webview.src = e.url;
        });

    }
})
</script>

<style lang='scss' scoped>
</style>