webpackJsonp([10],{Glgh:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=o("mvHQ"),n=o.n(r),a=o("1onU"),l=o("gyMJ"),s=o("Vbaa"),i=o("PJh5"),d=o.n(i),u={components:{Search:s.a,Pagination:a.a},data:function(){return{list:null,listLoading:!1,total:0,listQuery:{page:1,limit:10,importance:void 0,title:void 0,type:void 0,sort:"+id"},dialogVisibleEnd:!1,dialogVisibleRefund:!1,formEnd:{orderStatus:"FINISH",orderNo:"",beginTime:"",endTime:"",returnAddress:"",remark:"",orderId:"",province:"",city:"",district:""},formRefund:{orderStatus:"REFUND",orderNo:"",beginTime:"",payAmount:"",refundAmount:"",remark:"",orderId:""},rules:{endTime:[{required:!0,message:"请输入归还时间",tirrgle:"blur"}],returnAddress:[{required:!0,message:"请输入归还站点",tirrgle:"blur"}],refundAmount:[{required:!0,message:"请输入退款金额",tirrgle:"blur"}],remark:[{required:!0,message:"请输入备注",tirrgle:"blur"}]},orderNo:"",phonenumber:"",cabinetNo:"",powerbankNo:"",payType:"",orderStatus:"",optionsPay:[{label:"支付宝",value:"ALIPAY"},{label:"微信",value:"WECHART_PAY"}],optionsOrder:[{label:"订单完成",value:"FINISH"},{label:"正在租借",value:"PENDING"},{label:"租借中",value:"DOING"},{label:"未付款",value:"CREATED"},{label:"已退款",value:"REFUND"}],chargeRule:"",cbData:[],isSelect:!1,downloadLoading:!1}},mounted:function(){this.getList()},methods:{handleDownload:function(){var e=this;this.downloadLoading=!0,o.e(29).then(o.bind(null,"zWO4")).then(function(t){var o=e.formatJson(["orderNo","orderStatus","nickName","cabinetNo","duration","payAmount","payType","rentType","payTime"]);t.export_json_to_excel({header:["订单编号","订单状态","用户昵称","机柜编号","使用时长","支付费用","支付方式","扣款类型","支付时间"],data:o,filename:"导出"}),e.downloadLoading=!1})},formatJson:function(e){return this.list.map(function(t){return e.map(function(e){return"timestamp"===e?parseTime(t[e]):t[e]})})},querySearch:function(e,t){Object(l.a)("/v1/platform/stores/address?keyword="+this.formEnd.returnAddress).then(function(e){var o;o=e.data.resultData.storeAddess,t(o)})},changeSelect:function(){this.isSelect=!1},handleSelect:function(e){console.log(e,"res"),this.isSelect=!0,this.formEnd.province=e?e.province:"",this.formEnd.city=e?e.city:"",this.formEnd.district=e?e.district:"",this.formEnd.returnAddress=e?e.detailAddress:"",this.formRefund.storeId=e?e.storeId:"",this.formEnd.storeId=e?e.storeId:"",console.log(this.formEnd.province),console.log(this.formEnd.city),console.log(this.formEnd.district),console.log(this.formEnd.returnAddress),console.log(this.formRefund.storeId),console.log(this.formEnd.storeId)},free:function(){var e=d()().valueOf(),t=d()(this.formEnd.beginTime).add(this.chargeRule,"m").valueOf();this.formEnd.endTime=t>e?d()(e).format("YYYY-MM-DD HH:mm:ss"):d()(t).format("YYYY-MM-DD HH:mm:ss")},handleEnd:function(e){this.isSelect=!1,this.chargeRule=e.chargeRule.split("-")[0],void 0!==this.$refs.formEnd&&this.$refs.formEnd.resetFields(),this.formEnd=JSON.parse(n()(e)),this.formEnd.orderStatus="FINISH",this.formEnd.endTime="",this.dialogVisibleEnd=!0},handleRefund:function(e){void 0!==this.$refs.formRefund&&this.$refs.formRefund.resetFields(),this.formRefund=JSON.parse(n()(e)),this.formRefund.payAmount=this.formRefund.payAmount/100,this.formRefund.orderStatus="REFUND",this.dialogVisibleRefund=!0},onSubmitEnd:function(){var e=this;console.log(1),console.log(this.formEnd),console.log(this.isSelect),this.isSelect?this.$refs.formEnd.validate(function(t){t&&Object(l.a)("/v1/platform/order/status","put",e.formEnd,"json").then(function(t){console.log(t),e.$message.success("订单已结束"),e.dialogVisibleEnd=!1,e.getList()})}):this.$message.info("请选择归还站点！")},onSubmitRefund:function(){var e=this;console.log(11);var t=JSON.parse(n()(this.formRefund));console.log(t),t.refundAmount=100*t.refundAmount,console.log(t.refundAmount),this.$refs.formRefund.validate(function(o){o&&(console.log(o),Object(l.a)("/v1/platform/order/status","put",t,"json").then(function(t){console.log(t),e.$message.success("退款成功"),e.dialogVisibleRefund=!1,e.getList()}))})},getList:function(){var e=this;this.listLoading=!0,console.log(this.powerbankNo),Object(l.a)("/v1/platform/order/orders?orderNo="+this.orderNo+"&pageNo="+this.listQuery.page+"&pageSize="+this.listQuery.limit+"&phonenumber="+this.phonenumber+"&cabinetNo="+this.cabinetNo+"&powerbankNo="+this.powerbankNo+"&payType="+this.payType+"&orderStatus="+this.orderStatus+"\n        ").then(function(t){console.log(t),e.list=t.data.resultData.orders,e.total=t.data.resultData.totalNum,e.listLoading=!1})},changePay:function(e){this.payType=e},changeOrder:function(e){this.orderStatus=e},searchHandle:function(){this.listQuery.page=1,this.getList()}}},c={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"container"},[o("el-row",[o("el-col",{attrs:{span:7}},[o("el-input",{staticClass:"search-input",attrs:{"suffix-icon":"el-icon-search",placeholder:"订单编号："},model:{value:e.orderNo,callback:function(t){e.orderNo=t},expression:"orderNo"}})],1),e._v(" "),o("el-col",{attrs:{span:7}},[o("el-input",{staticClass:"search-input",attrs:{"suffix-icon":"el-icon-search",placeholder:"用户手机号："},model:{value:e.phonenumber,callback:function(t){e.phonenumber=t},expression:"phonenumber"}})],1),e._v(" "),o("el-col",{attrs:{span:7}},[o("el-input",{staticClass:"search-input",attrs:{"suffix-icon":"el-icon-search",placeholder:"机柜编号："},model:{value:e.cabinetNo,callback:function(t){e.cabinetNo=t},expression:"cabinetNo"}})],1),e._v(" "),o("el-col",{attrs:{span:7}},[o("el-input",{staticClass:"search-input",attrs:{"suffix-icon":"el-icon-search",placeholder:"充电宝编号："},model:{value:e.powerbankNo,callback:function(t){e.powerbankNo=t},expression:"powerbankNo"}})],1),e._v(" "),o("el-col",{attrs:{span:7}},[o("el-input",{staticClass:"search-input",attrs:{"suffix-icon":"el-icon-search",placeholder:"商家地址（未写）"},model:{value:e.powerbankNo,callback:function(t){e.powerbankNo=t},expression:"powerbankNo"}})],1)],1),e._v(" "),o("el-row",{staticStyle:{"margin-top":"20px"}},[o("el-col",{attrs:{span:7}},[o("el-select",{attrs:{clearable:"",placeholder:"支付方式："},on:{change:e.changePay},model:{value:e.payType,callback:function(t){e.payType=t},expression:"payType"}},e._l(e.optionsPay,function(e){return o("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),o("el-col",{attrs:{span:7}},[o("el-select",{attrs:{clearable:"",placeholder:"订单状态："},on:{change:e.changeOrder},model:{value:e.orderStatus,callback:function(t){e.orderStatus=t},expression:"orderStatus"}},e._l(e.optionsOrder,function(e){return o("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),o("el-button",{on:{click:e.searchHandle}},[e._v("查询")]),e._v(" "),o("el-button",{staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-download"},on:{click:e.handleDownload}},[e._v("导出")])],1),e._v(" "),o("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],attrs:{data:e.list,"element-loading-text":"Loading","highlight-current-row":"","header-cell-style":{background:"#F4F5F8",color:"#666666"}}},[o("el-table-column",{attrs:{prop:"orderNo",align:"center",label:"订单编号"}}),e._v(" "),o("el-table-column",{attrs:{prop:"orderStatus",align:"center",label:"订单状态"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("div",["FINISH"===t.row.orderStatus?o("span",{staticStyle:{color:"#d96d70"}},[e._v("订单完成")]):e._e(),e._v(" "),"PENDING"===t.row.orderStatus?o("span",{staticStyle:{color:"#fd9795"}},[e._v("正在租借")]):e._e(),e._v(" "),"DOING"===t.row.orderStatus?o("span",{staticStyle:{color:"#fd9795"}},[e._v("借用中")]):e._e(),e._v(" "),"REFUND"===t.row.orderStatus?o("span",{staticStyle:{color:"#399998"}},[e._v("已退款")]):e._e(),e._v(" "),"UNPAY"===t.row.orderStatus||"CREATED"===t.row.orderStatus?o("span",{staticStyle:{color:"#fd9795"}},[e._v("未付款")]):e._e()])]}}])}),e._v(" "),o("el-table-column",{attrs:{prop:"nickName",label:"用户昵称",align:"center"}}),e._v(" "),o("el-table-column",{attrs:{align:"center",prop:"phonenumber",label:"用户手机号"}}),e._v(" "),o("el-table-column",{attrs:{align:"center",prop:"cabinetNo",label:"机柜编号"}}),e._v(" "),o("el-table-column",{attrs:{align:"center",prop:"powerbankNo",label:"充电宝编号"}}),e._v(" "),o("el-table-column",{attrs:{align:"center",label:"借出信息"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("div",[o("span",{staticClass:"borrow-address"},[e._v("借出地点："+e._s(t.row.borrowAddress))]),e._v(" "),o("span",{staticClass:"borrow-time"},[e._v("借出时间："+e._s(t.row.beginTime))])])]}}])}),e._v(" "),o("el-table-column",{attrs:{align:"center",label:"归还信息"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("div",[o("span",{staticClass:"borrow-address"},[e._v("归还地点："+e._s(t.row.returnAddress))]),e._v(" "),o("span",{staticClass:"borrow-time"},[e._v("归还时间："+e._s(t.row.endTime))])])]}}])}),e._v(" "),o("el-table-column",{attrs:{align:"center",prop:"duration",label:"使用时长"}}),e._v(" "),o("el-table-column",{attrs:{align:"center",prop:"payAmount",label:"支付费用"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e._f("dealMoney")(t.row.payAmount)))]}}])}),e._v(" "),o("el-table-column",{attrs:{align:"center",prop:"payType",label:"支付方式"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("div",[e._v(e._s("ALIPAY"===t.row.payType?"支付宝":"微信"))])]}}])}),e._v(" "),o("el-table-column",{attrs:{align:"center",prop:"rentType",label:"扣款类型"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("div",["DEPOSIT"===t.row.rentType?o("span",[e._v("押金")]):e._e(),e._v(" "),"ALIPAY_ZHIMA"===t.row.rentType?o("span",[e._v("芝麻信用")]):e._e(),e._v(" "),"WECHAT_CODE"===t.row.rentType?o("span",[e._v("微信支付分")]):e._e()])]}}])}),e._v(" "),o("el-table-column",{attrs:{align:"center",prop:"payTime",label:"支付时间"}}),e._v(" "),o("el-table-column",{attrs:{align:"center",prop:"transactionId",label:"支付流水号"}}),e._v(" "),o("el-table-column",{attrs:{align:"center",label:"备注"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("div",["FINISH"===t.row.orderStatus?o("span",[e._v("\n            "+e._s(t.row.endRemark)+"\n          ")]):e._e(),e._v(" "),"REFUND"===t.row.orderStatus?o("span",[e._v("\n            "+e._s(t.row.refundRemark)+"\n          ")]):e._e()])]}}])}),e._v(" "),e.isHasPermissions("ORDER_MANAGEMENT:ORDER:ORDER_STATUS")?o("el-table-column",{attrs:{align:"center",label:"操作",width:"150px"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("div",["UNPAY"!==t.row.orderStatus&&"CREATED"!==t.row.orderStatus&&"FINISH"!==t.row.orderStatus?o("el-button",{attrs:{disabled:!("PENDING"==t.row.orderStatus||"DOING"==t.row.orderStatus),size:"mini"},on:{click:function(o){return e.handleEnd(t.row)}}},[e._v("结束")]):e._e(),e._v(" "),o("el-button",{attrs:{disabled:!("FINISH"==t.row.orderStatus),size:"mini"},on:{click:function(o){return e.handleRefund(t.row)}}},[e._v("退款")])],1)]}}],null,!1,489207137)}):e._e()],1),e._v(" "),o("pagination",{attrs:{total:e.total,page:e.listQuery.page,limit:e.listQuery.limit},on:{"update:page":function(t){return e.$set(e.listQuery,"page",t)},"update:limit":function(t){return e.$set(e.listQuery,"limit",t)},pagination:e.getList}}),e._v(" "),o("el-dialog",{attrs:{title:"结束",visible:e.dialogVisibleEnd,width:"30%"},on:{"update:visible":function(t){e.dialogVisibleEnd=t}}},[o("el-form",{ref:"formEnd",attrs:{model:e.formEnd,rules:e.rules,"label-width":"110px"}},[o("el-form-item",{attrs:{label:"订单号",prop:"orderNo"}},[o("el-input",{attrs:{type:"text",disabled:!0},model:{value:e.formEnd.orderNo,callback:function(t){e.$set(e.formEnd,"orderNo",t)},expression:"formEnd.orderNo"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"租借时间",prop:"beginTime"}},[o("el-input",{attrs:{disabled:!0},model:{value:e.formEnd.beginTime,callback:function(t){e.$set(e.formEnd,"beginTime",t)},expression:"formEnd.beginTime"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"归还时间",prop:"endTime"}},[o("el-date-picker",{attrs:{type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择日期时间"},model:{value:e.formEnd.endTime,callback:function(t){e.$set(e.formEnd,"endTime",t)},expression:"formEnd.endTime"}}),e._v(" "),o("el-button",{staticStyle:{width:"40px"},attrs:{size:"mini"},on:{click:e.free}},[e._v("免费")])],1),e._v(" "),o("el-form-item",{attrs:{label:"归还站点",prop:"returnAddress"}},[o("el-autocomplete",{staticClass:"inline-input",attrs:{"fetch-suggestions":e.querySearch,placeholder:"请输入内容","trigger-on-focus":!1},on:{select:e.handleSelect,blur:e.changeSelect},scopedSlots:e._u([{key:"default",fn:function(t){return[o("div",{staticClass:"name"},[e._v(e._s(t.item.detailAddress))]),e._v(" "),o("span",{staticClass:"addr"},[e._v("\n              "+e._s(t.item.province)+e._s(t.item.city)+e._s(t.item.district)+"\n            ")])]}}]),model:{value:e.formEnd.returnAddress,callback:function(t){e.$set(e.formEnd,"returnAddress",t)},expression:"formEnd.returnAddress"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"备注",prop:"remark"}},[o("el-input",{attrs:{type:"textarea"},model:{value:e.formEnd.remark,callback:function(t){e.$set(e.formEnd,"remark",t)},expression:"formEnd.remark"}})],1)],1),e._v(" "),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(t){e.dialogVisibleEnd=!1}}},[e._v("取 消")]),e._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:e.onSubmitEnd}},[e._v("提 交")])],1)],1),e._v(" "),o("el-dialog",{attrs:{title:"退款",visible:e.dialogVisibleRefund,width:"30%"},on:{"update:visible":function(t){e.dialogVisibleRefund=t}}},[o("el-form",{ref:"formRefund",attrs:{model:e.formRefund,rules:e.rules,"label-width":"110px"}},[o("el-form-item",{attrs:{label:"订单号",prop:"orderNo"}},[o("el-input",{attrs:{type:"text",disabled:!0},model:{value:e.formRefund.orderNo,callback:function(t){e.$set(e.formRefund,"orderNo",t)},expression:"formRefund.orderNo"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"租借时间",prop:"beginTime"}},[o("el-input",{attrs:{disabled:!0},model:{value:e.formRefund.beginTime,callback:function(t){e.$set(e.formRefund,"beginTime",t)},expression:"formRefund.beginTime"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"最大退款金额",prop:"endTime"}},[o("el-input",{attrs:{disabled:!0},model:{value:e.formRefund.payAmount,callback:function(t){e.$set(e.formRefund,"payAmount",t)},expression:"formRefund.payAmount"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"退款金额",prop:"refundAmount"}},[o("el-input",{model:{value:e.formRefund.refundAmount,callback:function(t){e.$set(e.formRefund,"refundAmount",t)},expression:"formRefund.refundAmount"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"备注",prop:"remark"}},[o("el-input",{attrs:{type:"textarea"},model:{value:e.formRefund.remark,callback:function(t){e.$set(e.formRefund,"remark",t)},expression:"formRefund.remark"}})],1)],1),e._v(" "),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(t){e.dialogVisibleRefund=!1}}},[e._v("取 消")]),e._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:e.onSubmitRefund}},[e._v("提 交")])],1)],1)],1)},staticRenderFns:[]};var f=o("VU/8")(u,c,!1,function(e){o("eyo7")},null,null);t.default=f.exports},eyo7:function(e,t){}});