(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0b3400"],{2826:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-card",{staticClass:"aui-card--fill",attrs:{shadow:"never"}},[a("div",{staticClass:"mod-demo__product}"},[a("el-form",{attrs:{inline:!0,model:e.dataForm},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.getDataList()}}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"id",clearable:""},model:{value:e.dataForm.id,callback:function(t){e.$set(e.dataForm,"id",t)},expression:"dataForm.id"}})],1),a("el-form-item",[a("el-button",{on:{click:function(t){return e.getDataList()}}},[e._v(e._s(e.$t("query")))])],1),a("el-form-item",[e.$hasPermission("demo:product:save")?a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.addOrUpdateHandle()}}},[e._v(e._s(e.$t("add")))]):e._e()],1),a("el-form-item",[e.$hasPermission("demo:product:delete")?a("el-button",{attrs:{type:"danger"},on:{click:function(t){return e.deleteHandle()}}},[e._v(e._s(e.$t("deleteBatch")))]):e._e()],1)],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{data:e.dataList,border:""},on:{"selection-change":e.dataListSelectionChangeHandle}},[a("el-table-column",{attrs:{type:"selection","header-align":"center",align:"center",width:"50"}}),a("el-table-column",{attrs:{prop:"id",label:"id","header-align":"center",align:"center"}}),a("el-table-column",{attrs:{prop:"name",label:"产品名称","header-align":"center",align:"center"}}),a("el-table-column",{attrs:{prop:"content",label:"产品介绍","header-align":"center",align:"center"}}),a("el-table-column",{attrs:{prop:"createDate",label:"创建时间","header-align":"center",align:"center"}}),a("el-table-column",{attrs:{label:e.$t("handle"),fixed:"right","header-align":"center",align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.$hasPermission("demo:product:update")?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){return e.addOrUpdateHandle(t.row.id)}}},[e._v(e._s(e.$t("update")))]):e._e(),e.$hasPermission("demo:product:delete")?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){return e.deleteHandle(t.row.id)}}},[e._v(e._s(e.$t("delete")))]):e._e()]}}])})],1),a("el-pagination",{attrs:{"current-page":e.page,"page-sizes":[10,20,50,100],"page-size":e.limit,total:e.total,layout:"total, sizes, prev, pager, next, jumper"},on:{"size-change":e.pageSizeChangeHandle,"current-change":e.pageCurrentChangeHandle}}),e.addOrUpdateVisible?a("add-or-update",{ref:"addOrUpdate",on:{refreshDataList:e.getDataList}}):e._e()],1)])},l=[],r=a("e1a5"),i=a("872d"),d={mixins:[r["a"]],data:function(){return{mixinViewModuleOptions:{getDataListURL:"/demo/product/page",getDataListIsPage:!0,deleteURL:"/demo/product",deleteIsBatch:!0},dataForm:{id:""}}},components:{AddOrUpdate:i["default"]}},o=d,s=a("2877"),c=Object(s["a"])(o,n,l,!1,null,null,null);t["default"]=c.exports}}]);