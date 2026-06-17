<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
    <UpdateVersionDialog></UpdateVersionDialog>
  </el-config-provider>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted
} from "vue";
import { useStore } from "vuex"
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import UpdateVersionDialog from "@/components/update/UpdateVersionDialog.vue"
import { getElectronAgent } from "@share/agent"


export default defineComponent({
  components: {
    UpdateVersionDialog
  },
  setup() {
    const store = useStore();







    return {
      locale: zhCn,
    };
  }
});
</script>
<style lang="scss">
@import "./styles/public.scss";

html,
body {
  background: rgba(0, 0, 0, 0) !important;
  background-color: rgba(0, 0, 0, 0) !important;

}
#app {
  width: 100%;
  height: 100%;
  margin: 0px auto;
  padding: 0px;
  font-size: 12px;

}


</style>