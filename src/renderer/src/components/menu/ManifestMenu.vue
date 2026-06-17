<template>
  <div class="container">
    <div class="top">
      <div
        @click="toPage('/manifest/NewManifest')"
        :selected="routeEqual('/manifest/NewManifest')"
        class="menu-item"
        :class="routeEqual('/manifest/NewManifest') ? 'menu-item-selected' : ''"
      >
        <img
          v-if="routeEqual('/manifest/NewManifest')"
          src="@/assets/menu/newmanifest-select.svg"
        />
        <img v-else src="@/assets/menu/newmanifest.svg" />
        新建舱单
      </div>
      <div
        @click="toPage('/manifest/Nrafts')"
        :selected="routeEqual('/manifest/Nrafts')"
        class="menu-item"
        :class="routeEqual('/manifest/Nrafts') ? 'menu-item-selected' : ''"
      >
        <img
          v-if="routeEqual('/manifest/Nrafts')"
          src="@/assets/menu/cgx-select.svg"
        />
        <img v-else src="@/assets/menu/cgx.svg" />
        草稿箱
      </div>
      <div
        @click="toPage('/manifest/Tobesent')"
        :selected="routeEqual('/manifest/Tobesent')"
        class="menu-item"
        :class="routeEqual('/manifest/Tobesent') ? 'menu-item-selected' : ''"
      >
        <img
          v-if="routeEqual('/manifest/Tobesent')"
          src="@/assets/menu/dfs-select.svg"
        />
        <img v-else src="@/assets/menu/dfs.svg" />
        待发送
      </div>
      <div
        @click="toPage('/manifest/Hasbeensent')"
        :selected="routeEqual('/manifest/Hasbeensent')"
        class="menu-item"
        :class="routeEqual('/manifest/Hasbeensent') ? 'menu-item-selected' : ''"
      >
        <img
          v-if="routeEqual('/manifest/Hasbeensent')"
          src="@/assets/menu/yfs-select.svg"
        />
        <img v-else src="@/assets/menu/yfs.svg" />
        已发送
      </div>
      <div
        @click="toPage('/manifest/Transceiver')"
        :selected="routeEqual('/manifest/Transceiver')"
        class="menu-item"
        :class="routeEqual('/manifest/Transceiver') ? 'menu-item-selected' : ''"
      >
        <img
          v-if="routeEqual('/manifest/Transceiver')"
          src="@/assets/menu/sft-select.svg"
        />
        <img v-else src="@/assets/menu/sft.svg" />
        收发通
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Menu, Setting, List } from "@element-plus/icons";
import MenuItem from "./MenuItem.vue";
export default defineComponent({
  components: {
    Menu,
    MenuItem,
    Setting,
    List,
  },
  data() {
    return {};
  },
  methods: {
    toPage(path) {
      this.$router.push(path);
    },
    routeEqual(path) {
      return path.toLowerCase() === this.currentRoute;
    },
  },
  computed: {
    currentRoute() {
      return this.$route.path.toLowerCase();
    },
  },
  created() {},
});
</script>

<style lang="scss" scoped>
.container {
  background-color: #ffffff;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  box-shadow: inset -2px 0 2px rgb(228 231 237 / 45%);

  // min-height: 500px;
}
.space {
  width: 100%;
}
.menu-item-selected {
  background: #f0f9ea;
  opacity: 1 !important;
  font-weight: 600;
}
.menu-item {
  line-height: 48px;
  padding: 4px;
  transition: 0.3s;
  color: #3c4144;
  &:hover {
    background: #f0f9ea;
    opacity: 1;
  }
  cursor: pointer;
  opacity: 0.65;
  display: flex;
  align-items: center;
  padding: 0 13px;
  img {
    margin-right: 8px;
  }
}
.top {
  padding-top: 26px;
}
.bottom {
  // padding-bottom:26px;
}
</style>
