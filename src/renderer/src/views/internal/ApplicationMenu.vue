<template>
  <div class="container">
    <div class="groups">
      <div class="group" ref="货物跟踪">
        <div class="tool-title">热门应用</div>
        <div class="content">
          <el-space wrap :size="space">
            <ApplicationMenu code="shManifest" @onClick="toAppDetail('shManifest')"></ApplicationMenu>
            <ApplicationMenu code="freightRate" @onClick="toAppDetail('freightRate')"></ApplicationMenu>

            <ApplicationMenu code="nbManifest" @onClick="toAppDetail('nbManifest')"></ApplicationMenu>
            <ApplicationMenu code="shippingFile" @onClick="toAppDetail('shippingFile')">
            </ApplicationMenu>
            <ApplicationMenu code="voyageList" @onClick="toAppDetail('voyageList')">
            </ApplicationMenu>

            
          <ApplicationMenu code="boxTrack" @onClick="toAppDetail('boxTrack')">
          </ApplicationMenu>

          <ApplicationMenu code="voyage" @onClick="toAppDetail('voyage')">
          </ApplicationMenu>

                    <ApplicationMenu code="fastCargo" @onClick="toAppDetail('fastCargo')">
          </ApplicationMenu>
          </el-space>
        </div>
      </div>

      <div class="group" style="padding-top: 32px" ref="货物跟踪">
        <div class="tool-title">所有应用</div>
        <div class="content">
          <el-space wrap :size="space">
            <ApplicationMenu code="shManifest" @onClick="toAppDetail('shManifest')"></ApplicationMenu>

            <ApplicationMenu code="freightRate" @onClick="toAppDetail('freightRate')"></ApplicationMenu>

            <ApplicationMenu code="nbManifest" @onClick="toAppDetail('nbManifest')"></ApplicationMenu>
            <ApplicationMenu code="boxTrack" @onClick="toAppDetail('boxTrack')"></ApplicationMenu>

            <ApplicationMenu
              code="fastCargo"
              @onClick="toAppDetail('fastCargo')"
            ></ApplicationMenu>

            <ApplicationMenu code="freightListen" @onClick="toAppDetail('freightListen')"></ApplicationMenu>

            <ApplicationMenu code="voyage" @onClick="toAppDetail('voyage')"></ApplicationMenu>

            <ApplicationMenu code="shipPosition" @onClick="toAppDetail('shipPosition')"></ApplicationMenu>

            <ApplicationMenu code="shipSpace" @onClick="toAppDetail('shipSpace')"></ApplicationMenu>

            <ApplicationMenu code="shippingFile" @onClick="toAppDetail('shippingFile')"></ApplicationMenu>

            <ApplicationMenu code="voyageList" @onClick="toAppDetail('voyageList')"></ApplicationMenu>
          </el-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watchEffect } from "vue";
import { Search } from "@element-plus/icons";
import request from "@/public/request";
import { ElMessage, ElLoading } from "element-plus";
import TrackOceanRecord from "@/components/trackOcean/TrackOceanRecord.vue";
import { utils } from "justom-share";
import { useRoute, useRouter } from "vue-router";
import { getElectronAgent } from "@share/agent";
import { useCompanyCertification } from "@/composables/user/certification";

import BaseJstInfoFooter from "@/views/internal/internalComponents/BaseJstInfoFooter.vue";
import ApplicationMenu from "@/components/menu/ApplicationMenu";

const certification = useCompanyCertification();

const router = useRouter();
const agent = getElectronAgent();

const space = ref(32);
function toAppDetail(code) {
  router.push({
    path: "/internal/applicationDetail",
    query: {
      code: code,
    },
  });
}
function openToolUrl() { }
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  color: #333;
}

.container {
  background-color: #fff;
  padding: 10px;

  :deep(.el-tabs__header) {
    margin: 0px;
  }

  :deep(.el-space__item) {
    padding-bottom: 16px !important;
  }

  :deep(.el-tabs__item) {
    font-size: 16px;
  }

  :deep(.el-tabs__nav-wrap::after) {
    background-color: #f2f3f5;
    height: 1px;
  }
}

.content {
  margin-top: 16px;
}

.tool-title {
  font-size: 16px;
  color: #333;
  margin-top: 32px;
}

.tool-remark {
  font-size: 14px;
  font-weight: 500;
  color: #727887;
  line-height: 16px;
}

.groups {}

.group {
  // padding-top:32px;
}

.fixed {
  // position: sticky;
  // top:0px;
  // z-index:99;
  // background-color: #fff;
}

.tool-tab {
  position: sticky;
  top: 0px;
  z-index: 2;
  background-color: #fff;
}
</style>
