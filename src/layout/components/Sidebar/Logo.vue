<template>
<!-- 充丫.后台管理系统 -->
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <router-link class="sidebar-logo-link" to="/">
        <img src="../../../assets/logo.gif" class="sidebar-logo" />
        <p class="sidebar-title">{{ title }}</p>

      </router-link>
    </transition>
  </div>
</template>
<script>
export default {
  name: "SidebarLogo",
  data() {
    return {
      title: "充丫.后台管理系统",
      logo: "@/assets/logo.gif"
    };
  }
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.sidebar-logo-container {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  & .sidebar-logo-link {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    text-align: center;
    & .sidebar-logo {
      width: 50px;
      height: 50px;
    }
    & .sidebar-title {
      color: #fff;
      font-size: 12px;
      margin-top: 30px;
      font-family: PingFangSC-Semibold, PingFang SC;
    }
  }
}
</style>
