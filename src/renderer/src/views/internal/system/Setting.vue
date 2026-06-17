<template>
  <div>
    <JstCardLayout border style="width: 800px;margin:0 auto">
      <template #title>


        版本更新

      </template>

      <div class="update">
        <!-- <div class="status">
          <el-icon v-if="isStatusLoading == false" :size="20" color="#409EFF">
            <circle-check-filled />
          </el-icon>
          <el-icon v-else :size="20" color="#409EFF" class="is-loading">
            <RefreshRight />
          </el-icon>
        </div>-->

        <div class="update-content">
          <div>当前版本: {{ version }}</div>
          <div style="margin-top: 5px;">最新版本: {{ latestVersion }}</div>
        </div>
      </div>
      <div>
        {{ host }}
      </div>
      <el-progress v-if="latestVersion != version" :percentage="progress" />
    </JstCardLayout>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue"
import env from "@share/env"
import { CircleCheckFilled, RefreshRight } from "@element-plus/icons"
import { useStore } from "vuex"

export default defineComponent({
  components: {
    CircleCheckFilled,
    RefreshRight
  },
  data() {
    return {
      version: env.version,
      host: env.host
    }
  },
  mounted() {

  },
  computed: {
    latestVersion() {
      return this.$store.state.update.latestVersion
    },
    progress() {
      return this.$store.state.update.progress
    }
  }
})
</script>

<style lang='scss' scoped>
.title {
  font-size: 153.85%;
  font-weight: 400;
}

.field {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.update {
  font-weight: 400;
  display: flex;
  align-items: center;
  height: 50px;

  .status {
    margin-right: 10px;
  }
}
</style>