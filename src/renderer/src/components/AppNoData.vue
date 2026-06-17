<template>
    <div class="no-data">
      <img src="@/assets/images/no-data.svg" />
      <div>
          <slot name="content"></slot>
      </div>
    </div>
</template>
<script>
import { defineComponent } from "vue"
export default defineComponent({
    props: {

    },
    name: "Notice",
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
<style lang="scss" scope>

</style>