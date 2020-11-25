webpackJsonp([21],{"T+sA":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("mvHQ"),o=a.n(n),r=a("Vbaa"),i=a("1onU"),l=a("gyMJ"),s={components:{Search:r.a,Pagination:i.a},data:function(){var e=this;return{disabled:!0,date:null,list:null,listLoading:!1,total:0,listQuery:{page:1,limit:10,importance:void 0,title:void 0,type:void 0,sort:"+id"},dialogVisible:!1,showClose:!1,form:{agentName:"",phonenumber:"",password:"",beforePayoffPercentage:"",afterPayoffPercentage:""},dialogTitle:"新增加盟商",rules:{agentName:[{required:!0,message:"请输入真实姓名",trigger:"blur"}],phonenumber:[{required:!0,message:"请输入手机号码",trigger:"blur"}],password:[{required:!0,message:"请输入账号密码",trigger:"blur"}],payOffPercentage:[{required:!0,trigger:"blur",validator:function(t,a,n){""===e.form.beforePayoffPercentage&&""===e.form.afterPayoffPercentage?n(new Error("请输入完整的代理分成")):n()}}]},keyword:"",startDate:"",endDate:"",placeholder:"请输入姓名或手机号",agentId:0,formOperate:{remark:""},rulesOperate:{remark:[{required:!0,message:"请输入备注",trigger:"blur"}]},dialogOperateTitle:"禁止",dialogOperateVisible:!1,agentStatus:""}},mounted:function(){this.getList()},methods:{handleDownload:function(){var e=this;this.downloadLoading=!0,a.e(29).then(a.bind(null,"zWO4")).then(function(t){var a=e.formatJson(["agentId","account","agentName","phonenumber","password","openTime","superior","percentage","agentAmount","remark"]);t.export_json_to_excel({header:["ID","登入账号","姓名","联系方式","开通时间","上级","分成比例","总收益","备注"],data:a,filename:"加盟商列表导出"}),e.downloadLoading=!1})},formatJson:function(e){return this.list.map(function(t){return e.map(function(e){return"timestamp"===e?parseTime(t[e]):t[e]})})},toCabinet:function(e){this.$router.push({path:"/equipManage/rackList",query:{agengId:e.agentId}})},recover:function(e){this.dialogOperateVisible=!0,this.agentStatus=e.agentStatus,this.agentId=e.agentId},handleRecover:function(){var e=this,t={agentStatus:"NORMAL",remark:this.formOperate.remark};console.log(t),this.$refs.formOperate.validate(function(a){a&&Object(l.a)("/v1/platform/agent/"+e.agentId,"put",t,"json").then(function(t){e.dialogOperateVisible=!1,e.$message.success("保存成功"),e.getList()})})},delet:function(e){var t=this;console.log(112),this.$confirm("是否确认删除该条数据？","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(l.a)("/v1/platform/aaa/"+e.agentId,"delete",{},"json").then(function(e){t.$message({type:"success",message:"删除成功!"}),t.getList()})}).catch(function(){t.$message({type:"info",message:"已取消删除"})})},forbit:function(e){var t=this;this.$confirm("是否确认禁用该加盟商账号，确认后账号不可使用","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(l.a)("/v1/platform/agent/"+e.agentId,"put",{agentStatus:"FORBIDDEN"},"json").then(function(e){t.$message({type:"success",message:"操作成功!"}),t.getList()})}).catch(function(){t.$message({type:"info",message:"已取消操作"})})},showEdit:function(e){this.disabled=!1,this.dialogTitle="编辑加盟商",this.agentId=e.agentId,this.form=JSON.parse(o()(e)),this.dialogVisible=!0},add:function(){this.disabled=!0,this.dialogVisible=!0,this.dialogTitle="新增加盟商",this.agentId=0,this.form={}},getList:function(){var e=this;Object(l.a)("/v1/platform/agent/agents?keyword="+this.keyword+"&startDate="+(this.startDate||"")+"&endDate="+(this.endDate||"")+"&pageNo="+this.listQuery.page+"&pageSize="+this.listQuery.limit).then(function(t){e.list=t.data.resultData.agents,e.total=t.data.resultData.totalNum})},onSubmit:function(){var e=this;this.$refs.form.validate(function(t){console.log(t),t?e.save():e.$message.info("星号为必填项！")})},save:function(){var e=this;console.log(this.form),Object(l.a)("/v1/platform/agent/"+this.agentId,"post",this.form,"json").then(function(t){e.$message.success("保存成功"),e.dialogVisible=!1,e.getList()})},searchHandle:function(e){this.keyword=e,this.getList(),this.listQuery.page=1}}},c={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("span",{staticClass:"txt"},[e._v("开通时间：")]),e._v(" "),a("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd",placeholder:"开始日期"},model:{value:e.startDate,callback:function(t){e.startDate=t},expression:"startDate"}}),e._v("至\n  "),a("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd",placeholder:"结束日期"},model:{value:e.endDate,callback:function(t){e.endDate=t},expression:"endDate"}}),e._v(" "),a("search",{attrs:{placeholder:e.placeholder},on:{searchHandle:e.searchHandle}}),e._v(" "),a("el-button",{staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-download"},on:{click:e.handleDownload}},[e._v("导出")]),e._v(" "),e.isHasPermissions("AGENT_MANAGEMENT:AGENT:ADD")?a("el-button",{staticStyle:{float:"right"},on:{click:e.add}},[e._v("新增加盟商")]):e._e(),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],attrs:{data:e.list,"element-loading-text":"Loading","highlight-current-row":"","header-cell-style":{background:"#F4F5F8",color:"#666666"}}},[a("el-table-column",{attrs:{prop:"agentId",align:"center",label:"ID"}}),e._v(" "),a("el-table-column",{attrs:{prop:"account",align:"center",label:"登入账号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"agentName",label:"姓名",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"phonenumber","class-name":"status-col",label:"联系方式",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",prop:"openTime",label:"开通时间"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",prop:"superior",label:"上级"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",prop:"percentage",label:"分成比例"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",[e._v(e._s(t.row.percentage)+"%")])]}}])}),e._v(" "),a("el-table-column",{attrs:{align:"center",prop:"agentAmount",label:"总收益"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",[e._v(e._s(e._f("dealMoney")(t.row.agentAmount)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{align:"center",prop:"remark",label:"备注"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"操作",width:"250px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",[a("el-button",{attrs:{size:"mini"},on:{click:function(a){return e.toCabinet(t.row)}}},[e._v("设备列表")]),e._v(" "),e.isHasPermissions("AGENT_MANAGEMENT:AGENT:EDIT")?a("el-button",{attrs:{size:"mini"},on:{click:function(a){return e.showEdit(t.row)}}},[e._v("编辑")]):e._e(),e._v(" "),a("el-button",{attrs:{type:"danger",size:"mini"},on:{click:function(a){return e.delet(t.row)}}},[e._v("删除")]),e._v(" "),e.isHasPermissions("AGENT_MANAGEMENT:AGENT:AGENT_STATUS")?a("span",["NORMAL"===t.row.agentStatus?a("el-button",{attrs:{type:"danger",size:"mini"},on:{click:function(a){return e.forbit(t.row)}}},[e._v("禁用")]):e._e(),e._v(" "),"FORBIDDEN"===t.row.agentStatus?a("el-button",{attrs:{type:"warning",size:"mini"},on:{click:function(a){return e.recover(t.row)}}},[e._v("恢复")]):e._e()],1):e._e()],1)]}}])})],1),e._v(" "),a("pagination",{attrs:{total:e.total,page:e.listQuery.page,limit:e.listQuery.limit},on:{"update:page":function(t){return e.$set(e.listQuery,"page",t)},"update:limit":function(t){return e.$set(e.listQuery,"limit",t)},pagination:e.getList}}),e._v(" "),a("el-dialog",{attrs:{title:"恢复",visible:e.dialogOperateVisible,showClose:e.showClose,width:"30%"},on:{"update:visible":function(t){e.dialogOperateVisible=t}}},[a("el-form",{ref:"formOperate",attrs:{model:e.formOperate,rules:e.rulesOperate}},[a("el-form-item",{attrs:{label:"备注",prop:"remark"}},[a("el-input",{attrs:{type:"textarea"},model:{value:e.formOperate.remark,callback:function(t){e.$set(e.formOperate,"remark",t)},expression:"formOperate.remark"}})],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dialogOperateVisible=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{on:{click:e.handleRecover}},[e._v("提交")])],1)],1),e._v(" "),a("el-dialog",{attrs:{title:e.dialogTitle,visible:e.dialogVisible,showClose:e.showClose,width:"30%"},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules}},[a("el-form-item",{attrs:{label:"手机号码",prop:"phonenumber"}},[a("el-input",{attrs:{type:"number",placeholder:"请输入手机号码"},model:{value:e.form.phonenumber,callback:function(t){e.$set(e.form,"phonenumber",e._n(t))},expression:"form.phonenumber"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"账号密码",prop:"password"}},[a("el-input",{attrs:{type:"",placeholder:"密码不能低于8位"},model:{value:e.form.password,callback:function(t){e.$set(e.form,"password",t)},expression:"form.password"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"真实姓名",prop:"agentName"}},[a("el-input",{attrs:{placeholder:"请输入真实姓名"},model:{value:e.form.agentName,callback:function(t){e.$set(e.form,"agentName",t)},expression:"form.agentName"}})],1),e._v(" "),a("p",{staticStyle:{"font-size":"16px"}},[e._v("分成配置")]),e._v(" "),a("el-form-item",{attrs:{label:"代理分成",prop:"payOffPercentage"}},[a("br"),e._v(" "),a("el-row",[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"回本前:","label-width":"59px"}},[a("el-input",{model:{value:e.form.beforePayoffPercentage,callback:function(t){e.$set(e.form,"beforePayoffPercentage",t)},expression:"form.beforePayoffPercentage"}},[a("span",{attrs:{slot:"suffix"},slot:"suffix"},[e._v("%")])])],1)],1),e._v(" "),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"回本后:","label-width":"59px"}},[a("el-input",{model:{value:e.form.afterPayoffPercentage,callback:function(t){e.$set(e.form,"afterPayoffPercentage",t)},expression:"form.afterPayoffPercentage"}},[a("span",{attrs:{slot:"suffix"},slot:"suffix"},[e._v("%")])])],1)],1)],1)],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dialogVisible=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{on:{click:e.onSubmit}},[e._v("提 交")])],1)],1)],1)},staticRenderFns:[]},u=a("VU/8")(s,c,!1,null,null,null);t.default=u.exports}});