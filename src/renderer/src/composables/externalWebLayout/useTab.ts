import {
  RouteLocation,
  Router,
  useRoute,
  useRouter,
  RouteLocationRaw,
} from "vue-router";
import { Store } from "vuex";
import { RootState } from "@/store/types";
import { TabStatus, TabCache, UpdateTabInfo } from "@/store/modules/tab";
import { computed, reactive, watch, ref, onMounted, nextTick } from "vue";
import { getElectronAgent } from "@share/agent";
// import { MenuTree } from "@/types/menu";
import { usePageCache } from "justom-share";
import Sortable from "sortablejs";


// 404 页面替换
function routeReplace(router: Router,route:RouteLocation){
  if (route.matched.length == 0) {
    route = router.resolve({
      path: "/internal/404",
      query: {
        url: route.fullPath,
      },
    });
  }
  return route;
}
// 解析 路由 argumentsList
function parseRouteArgs(router: Router, argumentsList: any[]) {
  // 解析路径
  let route = routeReplace(router,router.resolve(...argumentsList));
  return route;
}



/**
 * tab栏
 */
export default function tabRef(store: Store<RootState>, router: Router) {
  const route = useRoute();
  const tabStates = store.state.tab as TabStatus;
  const tabRef = ref<any>(null);
  const agent = getElectronAgent();
  const tabs = computed(() => {
    return tabStates.tabs;
  });

  async function switchTab(fullPath: string) {
    await router.switch(fullPath);
  }
  async function gotoRoute(tab: TabCache) {
    let existTab = tabStates.tabs.find((t) => t.route == tab.route);
    // 当前如果有这个tab的 那就直接切换到这个tab
    // 没有的添加一个
    if (!existTab) {
      existTab = tab;
      await router.openTab(existTab.route!);
    } else {
      // 判断tab页面是否存在
      await switchTab(existTab.route!);
    }
  }

  const activeTab = ref<string>(route.fullPath);

  function tabClick(tab: any) {
    console.log('click tab!!!',tab)
    switchTab(tab.route);
  }

  // 触发删除tab事件
  function onTabRemove(fullPath: string, ev: any) {
    // 手动触发删除事件
    removeTab(fullPath);
  }
  // 删除tab
  // redirect false -> 仅仅删除 不进行跳转  true->删除并寻找最近的跳转
  async function removeTab(fullPath: string, redirect: boolean = true) {
    let idx = tabStates.tabs.findIndex((t) => t.route == fullPath);
    if (activeTab.value != fullPath) {
      // 删除的不是当前tab
      await store.dispatch("tab/removeTab", fullPath);
      return;
    }

    if (redirect == false) {
      // 仅仅删除 不进行跳转
      return;
    }

    // 寻找最近的一个tab
    let target = null;

    // 先向前找
    if (idx - 1 >= 0) {
      target = tabStates.tabs[idx - 1];
    }

    // 再向后找
    if (!target && idx + 1 < tabStates.tabs.length) {
      target = tabStates.tabs[idx + 1];
    }
    
    await store.dispatch("tab/removeTab", fullPath);
    // 如果没有菜单了 跳转到 /workbench 工作台
    if (target) {
      activeTab.value = target.route!;
      console.log(activeTab)
      switchTab(target.route!);
    } else {
      // router.push("/workbench");
      agent.ipcRequest("external/opt", 'close');
    }
  }

  // 关闭右侧的所有菜单
  function closeRightTabs(fullPath: string, ev: any) {
    let idx = tabStates.tabs.findIndex((t) => t.route == fullPath);
    let closeTabList = [];
    // 防止删除中循环错误 是先记录下来path再删
    for (let i = idx + 1; i < tabStates.tabs.length; i++) {
      closeTabList.push(tabStates.tabs[i].route);
    }
    for (let path of closeTabList) {
      onTabRemove(path!, ev);
    }
  }

  // 关闭右侧的所有菜单
  function closeOtherTabs(fullPath: string, ev: any) {
    let closeTabList = tabStates.tabs
      .filter((t) => t.route != fullPath)
      .map((t) => t.route);

    for (let path of closeTabList) {
      onTabRemove(path!, ev);
    }
  }

  //关闭所有菜单
  function closeAllTabs(fullPath: string, ev: any) {
    let closeTabList = [] as any
    tabStates.tabs.forEach(t=>{
      closeTabList.push(t.route)
    })
    for (let path of closeTabList) {
      removeTab(path!);
    }
  }



  //点击tab
  function clickMenuItem(menu: MenuTree) {
    gotoRoute({
      title: menu.MenuName,
      route: menu.Path,
    });
  }
  
  async function reFreshTab(){
    //更新标签名
    tabStates.tabs.find(t=>t.route == route.fullPath).title=route.meta.title
  }

  onMounted(async () => {
    // 初始化 tab 拖动
    let el = tabRef.value.$el.querySelector(".el-tabs__nav.is-top");
    new Sortable(el, {
      direction: "horizontal",
      animation: 150,
      draggable: ".el-tabs__item",
      // 列表内元素顺序更新的时候触发
      onEnd: function (evt) {
        if (evt.oldIndex != evt.newIndex) {
          // 根据DOM的 idx 来生成顺序
          let items = el.querySelectorAll(".tab-dragable-item");
          let arr = [];
          for (let item of items) {
            arr.push(Number(item.getAttribute("idx")));
          }
          store.dispatch("tab/replacePosition", arr);
        }
      },
    });

    // 如果tab中不存在当前tab  则添加
    if(tabStates.tabs.find(t=>t.route == route.fullPath) == undefined){
      // parseRouteArgs(router,[route.fullPath])
      // 添加tab 修改当前activeTab
      await store.dispatch("tab/addTab",<TabCache>{
        title:route.meta.title,
        route:route.fullPath
      })
      activeTab.value = route.fullPath;

    }
  });

  // 监听路由变化
  watch(route, (newVal, oldVal) => {
    // 不是internal里面的页面不进行处理
    // if (!newVal.matched.find((t) => t.name == "internal")) {
    //   return;
    // }
    if (route.params.OPEN_NEW_TAB) {
      activeTab.value = newVal.fullPath;
      return;
    }

    // switch / openTab 是不需要修改名称的
    // 跨tab 切换

    // 如果newVal存在于tab里面  则不执行 属于tab切换
    if (!tabStates.tabs.find((t) => t.title == newVal.meta.title)) {
      store.dispatch("tab/updateActiveTabInfo", <UpdateTabInfo>{
        oldTabRoute: activeTab.value,
        info: {
          title: newVal.meta.title,
          route: newVal.fullPath,
        },
      });
    }
    
    activeTab.value = newVal.fullPath;
  });

  /**打开一个新tab */
  router.openTab = new Proxy(router.push, {
    apply: (target, thisArg, argumentsList) => {
      // 解析路径
      let route = parseRouteArgs(router, argumentsList);
      // 标记不需要缓存
      route.params = Object.assign(route.params, {
        PAGE_CACHE_DONT_USE_CACHE: true,
        OPEN_NEW_TAB: true,
      });
      console.log('???????')
      store.dispatch("tab/addTab", <TabCache>{
        title: route.meta.title,
        route: route.fullPath,
      });
      return Reflect.apply(target, thisArg, [route]);
    },
  });

  /**
   * 关闭tab
   * @param path 需要关闭的tab 不传为当前tab
   */
  router.closeTab = (path: string = "") => {
    if (path == "") {
      path = activeTab.value;
    }
    removeTab(path);
  };
  /**
   * 关闭当前 然后前往并刷新一个地址
   * */
  router.closeAndRefreshTab = new Proxy(router.replace, {
    apply: (target, thisArg, argumentsList) => {
      // 解析路径
      let route = parseRouteArgs(router, argumentsList);
      // 标记不需要缓存
      route.params = Object.assign(route.params, {
        PAGE_CACHE_DONT_USE_CACHE: true
      });
      let current = activeTab.value;
      return Reflect.apply(target, thisArg, [route]).then(()=>{
        removeTab(current,false)
      });
    },
  });

  route.modifyCurrentTabTitle = (title:string)=>{
    store.dispatch("tab/modifyTabTitle",{
      path:route.fullPath,
      title:title
    })
  }


  // tab页缓存
  const keepAliveNode = ref<any>(null);
  usePageCache(keepAliveNode);
  return reactive({
    activeTab,
    tabs,
    keepAliveNode,
    switchTab,
    removeTab,
    reFreshTab,
    gotoRoute,
    tabClick,
    tabRef,
    onTabRemove,
    closeRightTabs,
    closeOtherTabs,
    closeAllTabs,
    clickMenuItem,
  });
}
