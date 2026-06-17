<template>
  <div>
    <el-row class="workbench-components" :gutter="8">
      <el-col :span="12">
        <JstCardLayout>
          <UserInfoVue></UserInfoVue>
        </JstCardLayout>
      </el-col>
      <el-col :span="12">
        <TrackOceanSearchVue></TrackOceanSearchVue>
      </el-col>

      <el-col :span="24">
        <TrackOceanListVue></TrackOceanListVue>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent } from "vue"
import UserInfoVue from "@/components/workbench/UserInfo.vue"
import TrackOceanSearchVue from "@/components/workbench/TrackOceanSearch.vue"
import TrackOceanListVue from "@/components/workbench/TrackOceanList.vue"
export default defineComponent({
  components: {
    UserInfoVue,
    TrackOceanSearchVue,
    TrackOceanListVue
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
.workbench-components {
  :deep(.card_staff) {
    margin-bottom: 8px;
  }
}
</style>