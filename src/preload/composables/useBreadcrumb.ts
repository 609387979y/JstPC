import {
    ref,
    reactive,
    onMounted,
    watch,
    defineComponent,
    PropType,
  } from "vue";
  import {
    RouteLocationNormalizedLoaded,
    RouteLocation,
    Router,
    useRoute,
    useRouter,
  } from "vue-router";
  
  export interface Breadcrumb {
    /**
     * 标题
     */
    title?: string;
    /**
     * route 路径
     */
    route?: string;
  }
  
  function loadBreadcrumb(
    breadcrumb: Breadcrumb[],
    router: Router,
    currentRoute: RouteLocation
  ) {
    if (currentRoute.meta.lastPagePath) {
      let lastRoute = router.resolve(currentRoute.meta.lastPagePath);
      if (lastRoute.matched.length != 0) {
        breadcrumb.unshift({
          title: lastRoute.meta.title,
          route: currentRoute.meta.lastPagePath,
        });
        // 继续向上找
        loadBreadcrumb(breadcrumb, router, lastRoute);
      }
    }
  }
  
  /**
   * 使用 面包屑
   */
  export function useBreadcrumb() {
    const router = useRouter();
    const route = useRoute();
  
    // 当前面包屑
    const currentBreadcrumb = ref<Breadcrumb[]>([]);
  
    // 进入页面
    function choose(page: RouteLocationNormalizedLoaded) {
      let breadcrumb: Breadcrumb[] = [];
      // 加载 面包屑
      loadBreadcrumb(breadcrumb, router, page);
      if(breadcrumb.length != 0){
        breadcrumb.push({
          title:page.meta.title,
          route:page.fullPath
        });
      }
      currentBreadcrumb.value = breadcrumb;
    }
  
    onMounted(() => {
      choose(route);
    });
    watch(route, (newVal) => {
      choose(newVal);
    });
  
    return reactive({
      currentBreadcrumb,
    });
  }
  