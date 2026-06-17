<template>
  <div class="container">
    <div class="top">
      <el-menu :key="menuList" :default-active="this.$route.path" class="el-menu-vertical-demo" @open="handleOpen"
        @close="handleClose">

        <div v-for="value, i in menuList" :key="i">
          <el-menu-item v-if="!value.children || !value.children.length" :index="value.url" @click="toPage(value.url)">
            <img :src="getImageUrl(value.icon)" v-if="value.icon && this.$route.path != value.url"
              style="margin-right: 5px;" />
            <img :src="getImageUrl(value.iconActive)" style="margin-right: 5px;"
              v-if="value.iconActive && this.$route.path == value.url">
            <span>{{ value.name }}</span>
          </el-menu-item>
          <el-sub-menu v-else :index="value.url">
            <template #title>
              <img :src="getImageUrl(value.icon)" v-if="value.icon && this.$route.path != value.url" style="margin-right: 5px;" />
              <img :src="getImageUrl(value.iconActive)" v-if="value.iconActive && this.$route.path == value.url"
                style="margin-right: 5px;" />
              <span>{{ value.name }}</span>
            </template>
            <el-menu-item v-for="item in value.children" :index="item.url" @click="toPage(item.url)">
              <span>{{ item.name }}</span>
            </el-menu-item>
          </el-sub-menu>
        </div>
        <template v-if="chatList?.length && menuType == 1">
          <div v-for="value, i in chatList">
            <div class="son-title" style="margin-top: 24px;" v-if="value.Time == getCurrentDate">新对话</div>
            <div class="son-title"
              v-if="value.Time != getCurrentDate && ((chatList[0].Time == getCurrentDate && i == 1) || (chatList[0].Time != getCurrentDate && i == 0))">
              历史记录</div>
            <div class="son-title" style="font-size: 10px;margin-top: 4px;line-height: 20px;"
              v-if="value.Time != getCurrentDate">{{ value.Time }}</div>
            <el-menu-item v-for="item, index in value.info" :index="item.url" :key="index"
              @click="toPage(item.url, item.query)">
              <img :src="getImageUrl(item.icon)" v-if="item.icon && this.$route.path != item.url" style="margin-right: 5px;" />
              <img :src="getImageUrl(item.iconActive)" v-if="item.iconActive && this.$route.path == item.url"
                style="margin-right: 5px;">
              <span style="width: 100%;overflow: hidden;text-overflow: ellipsis;flex: 1;">{{ item.name }}</span>
            </el-menu-item>
          </div>
        </template>

      </el-menu>
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
  props: {
    menuType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      nowDate: ''
    };
  },
  computed: {


  },
  methods: {
    toPage(path, query = {}) {
      this.$router.push({ path: path, query: query });
    },
    routeEqual(path) {
      return path.toLowerCase() === this.currentRoute;
    },
    getImageUrl(name) {
      return new URL(`../../assets/${name}`, import.meta.url).href
    }
  },
  computed: {
    currentRoute() {
      return this.$route.path.toLowerCase();
    },
    menuList() {
      return this.$store.state.menu.menuList;
    },
    newList() {
      return this.$store.state.menu.newList;
    },
    replyList() {
      return this.$store.state.menu.replyList;
    },
    chatList() {
      let arr = {}
      console.log(this.newList)
      this.newList.forEach(item => {
        this.replyList.forEach(item2 => {
          if (item.Time == item2.Time) {
            console.log(item.Time)
            arr[item.Time] = arr[item.Time] || []
            arr[item.Time] = [...item.info, ...item2.info]
          }
        })
      })
      this.newList.forEach(item => {
        if (!arr[item.Time]) {
          arr[item.Time] = []
          arr[item.Time] = item.info
        }
      })
      this.replyList.forEach(item => {
        if (!arr[item.Time]) {
          arr[item.Time] = []
          arr[item.Time] = item.info
        }
      })

      let newArr = []
      for (let key in arr) {
        newArr.push({ Time: key, info: arr[key] })
      }
      console.log(newArr)
      return newArr
    },
    getCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始
      const day = String(now.getDate()).padStart(2, '0');
      console.log(`${year}-${month}-${day}`, '年月日')
      return `${year}-${month}-${day}`;
    }
  },
  created() { },
});
</script>

<style lang="scss" scoped>
:root {
  // --el-aside-width:70px;
}



.container {
  background: #F7F8FA;
  box-shadow: 2px 0 2px 0 rgba(228, 231, 237, 0.35);
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: #fff;

  border: 1px solid #F2F3F5;
  box-sizing: border-box;
  // min-height: 500px;
}

.space {
  text-align: center;
  margin: 0 auto;

  :deep(.el-space__item) {
    width: 60px;
  }
}

.menu-item-selected {
  background: #f2f8fd;
  border: 1px solid #a0cfff !important;
  border-radius: 8px;
  padding: 4px 4px;
  width: 50px;
  height: 50px;
}

.menu-item {
  border: 1px solid #F7F8FA;
  border-radius: 8px;
  padding: 4px 4px;
  transition: 0.8s;
  width: 50px;
  height: 50px;
  box-sizing: content-box !important;
}

.top {
  padding-top: 26px;
}

.bottom {
  // padding-bottom:26px;
}

.menu-title {
  color: #3C4144;
  height: 18px;
}

.menu-icon {
  margin-bottom: 5px;
}

.menu-icon-container {
  height: 24px !important;
}

:root {}



.el-menu-item {
  height: 40px;
  line-height: 40px;
  display: flex;
  box-sizing: border-box;

  &.is-active {
    background-color: #fd953e !important;
    color: #fff;
  }

  &:hover {
    background-color: #FFF4EC;
  }
}

:deep(.el-sub-menu__title) {
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  background-color: #fff;

  &:hover {
    background-color: #FFF4EC;
  }
}

.son-title {
  padding-left: 20px;
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 24px;
}

.icon-active {
  width: 48px;
  height: 48px;
  /* 这里的颜色就是你想要的 SVG 颜色 */
  background-color: #3366ff;

  /* 核心：将 SVG 作为蒙版 (兼容性需加 -webkit- 前缀) */
  mask-image: url('./icon.svg');
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: url('./icon.svg');
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
</style>
