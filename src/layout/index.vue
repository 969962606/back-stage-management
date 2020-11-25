<template>
  <div class="app-wrapper">
    <!-- 左侧边栏 -->
    <sidebar class="sidebar-container"></sidebar>
    <!-- 右边主体 -->
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
       <!-- 首页头部 -->
        <navbar />
      </div>
      <!-- 订单管理一行 -->
      <breadcrumb class="breadcrumb-container" />
      <!-- 主体内容 -->
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from "./components";
import Breadcrumb from "@/components/Breadcrumb";
export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Breadcrumb
  },
  computed: {
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@/styles/mixin.scss";
.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - 200px);
  transition: width 0.28s;
}
</style>
