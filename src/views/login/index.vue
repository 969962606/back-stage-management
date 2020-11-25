<template>
  <div class="login">
    <div class="content">
      <h1 class="title">欢迎登陆</h1>
      <p class="sub-title">充丫充电·后台管理系统</p>
      <p class="qrCode" id="login_container">
        
      </p>
      <!-- <div class="tip">请扫描二维码登录</div>  -->
    </div>
  </div>
</template>
<script>
import {login }from '@/api/login.js'
export default {
  name: 'login',
  data() {
    return {}
  },
  mounted() {
    // var url = encodeURIComponent('http://manager.echongya.com/#/login')
    var url = encodeURIComponent('http://manager.echongya.com/#/white')

    var obj = new WxLogin({
      id: 'login_container',
      appid: 'wxfd60ba1173f2838a',
      scope: 'snsapi_login',
      redirect_uri: url,
      state: Math.ceil(Math.random()*1000),
      style: "black",
      href: ''
    })
  },
  methods: {

  },
  beforeRouteUpdate(to, from, next) {
    console.log('扫码登录了', to.path)
    console.log('tag', '')
    var url = document.URL;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var str1 = str.split("?");
      var strs = str1[1].split("&");
      for (var i = 0; i< strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
      let params = {
        code: theRequest["code"]
      }
      // login(params).then(response => {
      //   if (response.resultStatus) {
      //     localStorage.setItem(
      //       "resultData",
      //       JSON.stringify(response.resultData)
      //     );
      //     window.location.href = '/#/index';
      //   } else {
      //     console.log('扫码登录失败')
      //   }
      // })
      this.$store.dispatch('/user/login', params).then( () => {
        this.$router.push({ path: '/'})
      })
    }
    next();
  }
};
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background: url("~@/assets/login-bg.png");
  background-size: 100% 100%;
  position: relative;
  & .content {
    position: absolute;
    width: 300px;
    top: 102px;
    right: 340px;
    text-align: center;
    & .title {
      font-size: 26px;
      font-family: PingFangS;
      font-weight: 600;
      color: rgba(57, 210, 128, 1);
    }
    & .sub-title {
      font-size: 16px;
      font-family: PingFangSL;
      font-weight: 300;
      color: rgba(102, 102, 102, 1);
    }
    & .tip {
      font-size: 16px;
      font-family: PingFangSL;
      font-weight: 300;
      color: rgba(153, 153, 153, 1);
    }
  }
}
</style>
