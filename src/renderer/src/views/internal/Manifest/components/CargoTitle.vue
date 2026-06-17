<template>
  <div class="tag">
    <div class="block">
    </div>
    <div class="text">
        <slot></slot>
    </div>

  </div>
</template>

<script>
import { defineComponent} from "vue" 
export default defineComponent({
  components:{

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
.tag{
    display: flex;


    .block{
        width: 4px;
        background-color: #8DCE6C;
        margin-right: 8px;
    }
    .text{
      font-size: 14px;
      color: #303133;
      letter-spacing: 0;
      line-height: 22px;
      font-weight: bold;
    }
}
</style>