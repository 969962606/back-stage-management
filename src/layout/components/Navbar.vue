<template>
  <div class="navbar">
    <span class="index">
      <router-link to="/">
        <svg-icon icon-class="mune_home" />
        首页
      </router-link>
      <svg-icon @click="logout" class="logout" icon-class="logout" />
    </span>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { requestApi } from "@/api/index";

export default {
  computed: {
    ...mapGetters(["sidebar"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    logout() {
        this.$router.push({path: '/login'})
        localStorage.removeItem('resultData')
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.navbar {
  position: relative;
  height: 60px;
  line-height: 60px;
  width: 100%;
  background: $navBg;
  color: $navText;
  font-size: 14px;
  & .index {
    float: right;
    margin-right: 50px;
    & .logout{
        margin-left: 50px;
        cursor: pointer;
    }
  }
}
</style>
