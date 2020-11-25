webpackJsonp([22],{qFfr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("1onU"),l=a("Vbaa"),n=a("gyMJ"),r={components:{Search:l.a,Pagination:i.a},data:function(){return{genderStr:{MALE:"男",FEMALE:"女",UNKNOW:"未知"},contactStatusStr:{YES:"已联系",NO:"待联系"},list:null,listLoading:!1,total:0,listQuery:{page:1,limit:10,importance:void 0,title:void 0,type:void 0,sort:"+id"},placeholder:"请输入姓名或手机号",dialogVisible:!1,form:{remark:" "},rules:{remark:[{required:!0,message:"请输入备注",triggle:"blur"}]},keyword:"",agentId:0,auditStatus:"",dialogTitle:""}},mounted:function(){this.getList()},methods:{pass:function(t){this.dialogVisible=!0,this.agentId=t.agentId,this.auditStatus="APPROVE",this.dialogTitle="通过",this.form={}},reject:function(t){this.dialogVisible=!0,this.agentId=t.agentId,this.auditStatus="REFUSE",this.dialogTitle="拒绝",this.form={}},onSubmit:function(){var t=this,e={agentId:this.agentId,auditStatus:this.auditStatus,contactRemark:this.form.remark};this.$refs.form.validate(function(a){a&&Object(n.a)("/v1/platform/agent/apply","put",e,"json").then(function(e){t.$message.success("操作成功"),t.dialogVisible=!1,t.getList()})})},getList:function(){var t=this;this.listLoading=!0,Object(n.a)("/v1/platform/agent/agents/apply?keyword="+this.keyword+"&pageNo="+this.listQuery.page+"&pageSize="+this.listQuery.limit).then(function(e){t.listLoading=!1,t.list=e.data.resultData.agents,t.total=e.data.resultData.totalNum})},searchHandle:function(t){this.keyword=t,this.listQuery.page=1,this.getList()}}},s={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container"},[a("search",{attrs:{placeholder:t.placeholder},on:{searchHandle:t.searchHandle}}),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],attrs:{data:t.list,"element-loading-text":"Loading","highlight-current-row":"","header-cell-style":{background:"#F4F5F8",color:"#666666"}}},[a("el-table-column",{attrs:{prop:"agentId",align:"center",label:"ID"}}),t._v(" "),a("el-table-column",{attrs:{prop:"agentName",align:"center",label:"姓名"}}),t._v(" "),a("el-table-column",{attrs:{prop:"phonenumber",label:"联系电话",align:"center"}}),t._v(" "),a("el-table-column",{attrs:{"class-name":"status-col",label:"性别",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t.genderStr[e.row.gender]))]}}])}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"状态"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t.contactStatusStr[e.row.contactStatus]))]}}])}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"省市区"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",[t._v("\r\n            "+t._s(e.row.province)+" "+t._s(e.row.city)+"\r\n            "+t._s(e.row.district)+"\r\n          ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{align:"center",prop:"createTime",label:"申请时间"}}),t._v(" "),a("el-table-column",{attrs:{align:"center",prop:"contactRemark",label:"备注"}}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return["YES"===e.row.contactStatus?a("div",[t._v("\r\n            "+t._s("APPROVE"===e.row.auditStatus?"通过":"拒绝")+"\r\n          ")]):a("div",[t.isHasPermissions("AGENT_MANAGEMENT:APPLY_AGENT:AUDIT_STATUS")?a("div",[a("el-button",{attrs:{size:"mini"},on:{click:function(a){return t.pass(e.row)}}},[t._v("通过")]),t._v(" "),a("el-button",{attrs:{size:"mini"},on:{click:function(a){return t.reject(e.row)}}},[t._v("拒绝")])],1):t._e()])]}}])})],1),t._v(" "),a("pagination",{attrs:{total:t.total,page:t.listQuery.page,limit:t.listQuery.limit},on:{"update:page":function(e){return t.$set(t.listQuery,"page",e)},"update:limit":function(e){return t.$set(t.listQuery,"limit",e)},pagination:t.getList}}),t._v(" "),a("el-dialog",{attrs:{title:t.dialogTitle,visible:t.dialogVisible,width:"30%",showClose:!1},on:{"update:visible":function(e){t.dialogVisible=e}}},[a("el-form",{ref:"form",attrs:{model:t.form,rules:t.rules}},[a("el-form-item",{attrs:{label:"备注",prop:"remark"}},[a("el-input",{attrs:{type:"textarea"},model:{value:t.form.remark,callback:function(e){t.$set(t.form,"remark",e)},expression:"form.remark"}})],1)],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.dialogVisible=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:t.onSubmit}},[t._v("完 成")])],1)],1)],1)},staticRenderFns:[]},o=a("VU/8")(r,s,!1,null,null,null);e.default=o.exports}});