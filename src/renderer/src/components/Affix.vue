<template>
  <div class="fx-content">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Affix",
  props: {},
  data() {
    return {
      height: "",
      fxDom: "",
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleAffixScroll);
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("scroll", this.handleAffixScroll);
    this.$destroy();
    next();
  },
  methods: {
    handleAffixScroll(e) {
      let height;
      this.fxDom = document.getElementsByClassName("fx-content");
      this.height
        ? ((height = this.height), this.setActive(height))
        : ((this.height = this.fxDom[0].offsetTop),
          this.setActive(this.fxDom[0].offsetTop));
    },
    setActive(height) {
      height=height-70
      if ((document.documentElement.scrollTop > height)&&this.fxDom[0]) {
        this.fxDom[0].classList.add("fx-content-active");
      } else if(this.fxDom[0]) {
        this.fxDom[0].classList.remove("fx-content-active");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.fx-content-active {
  position: fixed;
  top: 74px;
  z-index: 100;
  width: calc(100% - 32px);
}
</style>
