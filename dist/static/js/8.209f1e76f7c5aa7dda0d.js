webpackJsonp([8],{M9A7:function(t,e,n){"use strict";e.a=function(t){return Object(s.a)({url:"/v1/platform/code2session",method:"post",data:t})};var s=n("vLgD")},"T+/8":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});n("M9A7");var s={name:"login",data:function(){return{}},mounted:function(){var t=encodeURIComponent("http://manager.echongya.com/#/white");new WxLogin({id:"login_container",appid:"wxfd60ba1173f2838a",scope:"snsapi_login",redirect_uri:t,state:Math.ceil(1e3*Math.random()),style:"black",href:""})},methods:{},beforeRouteUpdate:function(t,e,n){var s=this;console.log("扫码登录了",t.path),console.log("tag","");var i=document.URL,a=new Object;if(-1!=i.indexOf("?")){for(var o=i.substr(1).split("?")[1].split("&"),r=0;r<o.length;r++)a[o[r].split("=")[0]]=unescape(o[r].split("=")[1]);var c={code:a.code};this.$store.dispatch("/user/login",c).then(function(){s.$router.push({path:"/"})})}n()}},i={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"login"},[e("div",{staticClass:"content"},[e("h1",{staticClass:"title"},[this._v("欢迎登陆")]),this._v(" "),e("p",{staticClass:"sub-title"},[this._v("充丫充电·后台管理系统")]),this._v(" "),e("p",{staticClass:"qrCode",attrs:{id:"login_container"}})])])}]};var a=n("VU/8")(s,i,!1,function(t){n("vCOY")},"data-v-6734e1e2",null);e.default=a.exports},vCOY:function(t,e){}});