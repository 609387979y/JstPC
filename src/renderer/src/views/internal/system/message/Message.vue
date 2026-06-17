<template>
  <div >
    <MessageManageView isExternal></MessageManageView>
  </div>
</template>

<script>
import { defineComponent} from "vue" 
import MessageManageView from "@/components/message/MessageManageView.vue"
export default defineComponent({
  components:{
      MessageManageView
  },
  data() {
    return {

    }
  },
  methods:{

  },
  created(){

  }
 })
</script>

<style lang='scss' scoped>
</style>