<template>
  <div></div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  components: {},
  data() {
    return {};
  },
  methods: {},
  async mounted() {
    const loading = this.$loading({ lock: true });

    if (this.$route.query.guid) {
      let res = await this.$http.get("/api/AuthUser/GetTokenByGuid", {
        guid: this.$route.query.guid,
      });
      // 登录
      await this.$store.dispatch("auth/setTokenAndGetInfo", res).catch(() => {});

      this.$router.push("/internal/home");
      loading.close();
    } else {
      // 注册

      // 先前往entry 界面 然后拉起注册弹窗
      let url =
        import.meta.env.VITE_AXIOS_HOST +
        "/#/wxBind?BindToken=" +
        encodeURIComponent(this.$route.query.BindToken);
      await this.$router.push("/");
      loading.close();

      window.open(url, "_blank", "width=1400, height=700");
    }
  },
});
</script>

<style lang="scss" scoped></style>
