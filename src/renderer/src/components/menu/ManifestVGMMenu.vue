<template>
  <div class="container">
    <div class="top">
      <div
        @click="toPage('/manifest/vgm/VGMNrafts')"
        :selected="routeEqual('/manifest/vgm/VGMNrafts')"
        class="menu-item"
        :class="
          routeEqual('/manifest/vgm/VGMNrafts') ? 'menu-item-selected' : ''
        "
      >
        <img
          v-if="routeEqual('/manifest/vgm/VGMNrafts')"
          src="@/assets/menu/cgx-select.svg"
        />
        <img v-else src="@/assets/menu/cgx.svg" />
        草稿箱
      </div>

      <div
        @click="toPage('/manifest/vgm/VGMSend')"
        :selected="routeEqual('/manifest/vgm/VGMSend')"
        class="menu-item"
        :class="routeEqual('/manifest/vgm/VGMSend') ? 'menu-item-selected' : ''"
      >
        <img
          v-if="routeEqual('/manifest/vgm/VGMSend')"
          src="@/assets/menu/yfs-select.svg"
        />
        <img v-else src="@/assets/menu/yfs.svg" />
        已发送
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
