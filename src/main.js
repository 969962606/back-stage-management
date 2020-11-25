// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Vuex from "vuex";
// import VueAMap from 'vue-amap';
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import store from "./store";
import "@/assets/font.scss";
import "@/styles/index.scss";

import "@/icons";
// import '@/permission'

// router.beforeEach((to, from, next) => {
//     if (to.path !== '/login') {
//         if (localStorage.getItem('accessToken').accessToken) {
//             next();
//         } else {

//         }

//     }
// })

Vue.use(Vuex);
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.isHasPermissions = function(permisstion) {
  const allPermissions = localStorage.getItem("allPermissions");
  if (allPermissions.includes(permisstion)) {
    return true;
  }
  return false;
};
// 全局过滤器
Vue.filter("dealMoney", function(value) {
  if (!value) return 0;
  return (value / 100).toFixed(2)
});
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: {
    App
  },
  template: "<App/>"
});
