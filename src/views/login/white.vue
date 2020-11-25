<template>
  <div></div>
</template>

<script>
import { login } from "@/api/login";
import {mapActions }from 'vuex'
export default {
  methods: {
    ...mapActions(['login']),
    getUser() {
      console.log("用户确认");
      let code = this.$route.query.code;
      let params = {
        code: code
      };
      login(params).then(response => {
        console.log(response, "response");
      });
    },
    login() {
      var url = document.URL;
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var str1 = str.split("?");
        var strs = str1[1].split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
        let params = {
          code: theRequest["code"]
        };

        login(params).then(response => {
          console.log("response", response);
          if (response.data.resultStatus) {
            localStorage.setItem(
              "resultData",
              JSON.stringify(response.data.resultData)
            );
            const accessToken = response.data.resultData.accessToken
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('allPermissions', response.data.resultData.permissions.split(";"))
            window.location.href = "/#/index";
          } else {
            console.log("扫码登录失败");
          }
        });
        // console.log(this.$store, 'store')
        // login(params)
        // .then(() => {
        //   this.$router.push({ path: "/" });
        // });
      }
    }
  },
  created() {
    console.log("URL", document.URL);
    this.login();
  },
  watch: {
    $route: "getUrlParam"
  },
  beforeRouteUpdate(to, from, next) {
    console.log("扫码登录了", to.path);
    var url = document.URL;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var str1 = str.split("?");
      var strs = str1[1].split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
      let params = {
        code: theRequest["code"]
      };

      login(params).then(response => {
        if (response.resultStatus) {
          localStorage.setItem(
            "resultData",
            JSON.stringify(response.resultData)
          );
          window.location.href = "/#/index";
        } else {
          console.log("扫码登录失败");
        }
      });
    }
    next();
  }
};
</script>
