(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4155cd69"],{5536:function(e,t,r){"use strict";r("99af"),r("4de4"),r("b0c0");var a=r("5530"),s=r("a18c");t["a"]={data:function(){return{processVisible:!1}},methods:{initProcessMultiple:function(e){var t=this,r=this.$route.params.processShowType;this.processVisible=!0,this.$nextTick((function(){t.$route.params.processDefinitionKey&&(t.$refs.renProcessMultiple.dataForm.processDefinitionKey=t.$route.params.processDefinitionKey),t.$route.params.taskId&&(t.$refs.renProcessMultiple.dataForm.taskId=t.$route.params.taskId),t.$route.params.processInstanceId&&(t.$refs.renProcessMultiple.dataForm.processInstanceId=t.$route.params.processInstanceId),t.$refs.renProcessMultiple.dataForm.businessKey=t.$route.params.businessKey,t.$refs.renProcessMultiple.showType=r,t.$refs.renProcessMultiple.parentObj=t,t.$refs.renProcessMultiple.callbacks=e}))},closeCurrentTab:function(e){var t=this.$store.state.contentTabsActiveName;if(this.$store.state.contentTabs=this.$store.state.contentTabs.filter((function(e){return e.name!==t})),this.$store.state.contentTabs.length<=0)return this.$store.state.sidebarMenuActiveName=this.$store.state.contentTabsActiveName="home",!1;t===this.$store.state.contentTabsActiveName&&this.$router.push({name:this.$store.state.contentTabs[this.$store.state.contentTabs.length-1].name})},getProcDefRouteSet:function(e,t){var r=this;this.$http.get("/act/process/getProcDefBizRoute/".concat(e.processDefinitionId)).then((function(s){var o=s.data;if(0!==o.code)return r.$message.error(o.msg);if(!o.data||!o.data.bizRoute)return r.$message.error(r.$t("process.routeError"));var n=Object(a["a"])(Object(a["a"])({},e),o.data);t(n)})).catch((function(){}))},getProcDefBizRouteAndProcessInstance:function(e,t){var r=this;this.$http.get("/act/process/getProcDefBizRouteAndProcessInstance",{params:e}).then((function(s){var o=s.data;if(0!==o.code)return r.$message.error(o.msg);if(!o.data||!o.data.bizRoute)return r.$message.error(r.$t("process.routeError"));var n=Object(a["a"])(Object(a["a"])({},e),o.data);t(n)})).catch((function(){}))},getLatestProcDefRouteSet:function(e,t){var r=this;this.$http.get("/act/process/getLatestProcDefBizRoute",{params:{procDefKey:e}}).then((function(s){var o=s.data;if(0!==o.code)return r.$message.error(o.msg);if(!o.data||!o.data.bizRoute)return r.$message.error(r.$t("process.routeError"));var n=Object(a["a"])({procDefKey:e},o.data);t(n)})).catch((function(){}))},forwardDetail:function(e){var t={routeName:"".concat(this.$route.name,"__detail_").concat(e.processInstanceId),menuId:"".concat(this.$route.meta.menuId),title:"".concat(this.$route.meta.title," - ").concat(e.processDefinitionName),path:e.bizRoute,params:{processInstanceId:e.processInstanceId,businessKey:e.businessKey}};Object(s["a"])(t,this.$router)},forwardTaskDetail:function(e){var t={routeName:"".concat(this.$route.name,"__detail_").concat(e.taskId),menuId:"".concat(this.$route.meta.menuId),title:"".concat(this.$route.meta.title," - ").concat(e.taskName),path:e.bizRoute,params:{taskId:e.taskId,processInstanceId:e.processInstanceId,businessKey:e.businessKey}};Object(s["a"])(t,this.$router)},forwardHandleUrl:function(e){var t={routeName:"".concat(this.$route.name,"__handle_").concat(e.taskId),menuId:"".concat(this.$route.meta.menuId),title:"".concat(this.$route.meta.title," - ").concat(e.taskName),path:e.bizRoute,params:{taskId:e.taskId,processInstanceId:e.processInstanceId,processShowType:"taskHandle",businessKey:e.businessKey}};Object(s["a"])(t,this.$router)}}}},d9b0:function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("el-dialog",{attrs:{visible:e.visible,title:e.dataForm.id?e.$t("update"):e.$t("add"),"close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.visible=t}}},[r("el-form",{ref:"dataForm",attrs:{model:e.dataForm,rules:e.dataRule,"label-width":"en-US"===e.$i18n.locale?"120px":"80px"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.dataFormSubmitHandle()}}},[r("el-form-item",{attrs:{label:e.$t("correction.post"),prop:"applyPost"}},[r("el-input",{attrs:{placeholder:e.$t("correction.post")},model:{value:e.dataForm.applyPost,callback:function(t){e.$set(e.dataForm,"applyPost",t)},expression:"dataForm.applyPost"}})],1),r("el-row",{attrs:{gutter:40}},[r("el-col",{attrs:{span:12}},[r("el-form-item",{attrs:{label:e.$t("correction.entryDate"),prop:"entryDate"}},[r("el-date-picker",{staticStyle:{width:"100%"},attrs:{"value-format":"yyyy-MM-dd",placeholder:e.$t("correction.entryDate")},model:{value:e.dataForm.entryDate,callback:function(t){e.$set(e.dataForm,"entryDate",t)},expression:"dataForm.entryDate"}})],1)],1),r("el-col",{attrs:{span:12}},[r("el-form-item",{attrs:{label:e.$t("correction.correctionDate"),prop:"correctionDate"}},[r("el-date-picker",{staticStyle:{width:"100%"},attrs:{"value-format":"yyyy-MM-dd",placeholder:e.$t("correction.correctionDate")},model:{value:e.dataForm.correctionDate,callback:function(t){e.$set(e.dataForm,"correctionDate",t)},expression:"dataForm.correctionDate"}})],1)],1)],1),r("el-form-item",{attrs:{label:e.$t("correction.workContent"),prop:"workContent"}},[r("el-input",{attrs:{type:"textarea",placeholder:e.$t("correction.workContent")},model:{value:e.dataForm.workContent,callback:function(t){e.$set(e.dataForm,"workContent",t)},expression:"dataForm.workContent"}})],1),r("el-form-item",{attrs:{label:e.$t("correction.achievement"),prop:"achievement"}},[r("el-input",{attrs:{type:"textarea",placeholder:e.$t("correction.achievement")},model:{value:e.dataForm.achievement,callback:function(t){e.$set(e.dataForm,"achievement",t)},expression:"dataForm.achievement"}})],1)],1),r("template",{slot:"footer"},[r("el-button",{on:{click:function(t){e.visible=!1}}},[e._v(e._s(e.$t("cancel")))]),e.processVisible?r("ren-process-start",{ref:"renProcessStart",attrs:{updateInstanceIdUrl:"/act/demo/correction/updateInstanceId",saveFormUrl:"/act/demo/correction",dataFormName:"dataForm"}}):e._e()],1)],2)},s=[],o=r("5530"),n=r("5536"),c={mixins:[n["a"]],data:function(){return{processVisible:!0,visible:!1,dataForm:{id:"",applyPost:"",entryDate:"",correctionDate:"",workContent:"",achievement:"",creator:"",createDate:""}}},computed:{dataRule:function(){return{applyPost:[{required:!0,message:this.$t("validate.required"),trigger:"blur"}],entryDate:[{required:!0,message:this.$t("validate.required"),trigger:"blur"}],correctionDate:[{required:!0,message:this.$t("validate.required"),trigger:"blur"}],workContent:[{required:!0,message:this.$t("validate.required"),trigger:"blur"}],achievement:[{required:!0,message:this.$t("validate.required"),trigger:"blur"}],createTime:[{required:!0,message:this.$t("validate.required"),trigger:"blur"}]}}},methods:{init:function(){var e=this;this.visible=!0,this.$nextTick((function(){e.$refs["dataForm"].resetFields(),e.dataForm.id&&e.getInfo(),e.$refs.renProcessStart.rootObj=e,e.$refs.renProcessStart.callbacks={startProcessSuccessCallback:e.closeCurrentDialog,startProcessErrorCallback:e.startProcessErrorCallback,formSaveSuccessCallback:null,formSaveErrorCallback:null},e.$refs.renProcessStart.dataForm.processDefinitionKey="correctionprocess"}))},getInfo:function(){var e=this;this.$http.get("/act/demo/correction/".concat(this.dataForm.id)).then((function(t){var r=t.data;if(0!==r.code)return e.$message.error(r.msg);e.dataForm=Object(o["a"])(Object(o["a"])({},e.dataForm),r.data)})).catch((function(){}))},closeCurrentDialog:function(){this.visible=!1,this.$emit("refreshDataList")}}},i=c,l=r("2877"),u=Object(l["a"])(i,a,s,!1,null,null,null);t["default"]=u.exports}}]);