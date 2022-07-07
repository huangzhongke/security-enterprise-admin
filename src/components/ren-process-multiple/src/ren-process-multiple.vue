<template>
  <div>
    <ren-process-start v-if="startProcessVisible" :saveFormUrl="saveFormUrl" :updateInstanceIdUrl="updateInstanceIdUrl" :dataFormName="dataFormName" ref="renProcessStart"></ren-process-start>
    <ren-process-running v-if="runningHandleVisible" ref="renProcessRunning"></ren-process-running>
    <ren-process-detail v-if="processDetailVisible" ref="renProcessDetail"></ren-process-detail>
  </div>
</template>

<script>
export default {
  name: 'RenProcessMultiple',
  data () {
    return {
      // 是否显示启动流程
      startProcessVisible: false,
      // 是否任务处理
      runningHandleVisible: false,
      // 是否显示流程处理详情
      processDetailVisible: false,
      // 用于区分流程启动（start）、任务处理(taskHandle)以及查看详情(null)
      showType: null,
      // 父级对象
      parentObj: null,
      dataForm: {
        processDefinitionKey: '',
        taskId: '',
        businessKey: '',
        processInstanceId: ''
      },
      // 回调函数
      callbacks: {
        // 启动成功回调
        startProcessSuccessCallback: null,
        // 启动失败回调
        startProcessErrorCallback: null,
        // 任务处理成功回调
        taskHandleSuccessCallback: null,
        // 任务处理失败回调
        taskHandleErrorCallback: null,
        // 表单保存成功回调
        formSaveSuccessCallback: null,
        // 表单保存失败回调
        formSaveErrorCallback: null
      }
    }
  },
  components: {
  },
  created () {
    this.$nextTick(() => {
      if (!this.showType) {
        this.startProcessVisible = false
        this.runningHandleVisible = false
        this.processDetailVisible = true
      } else if (this.showType === 'start') {
        // 启动流程
        this.startProcessVisible = true
        this.$nextTick(() => {
          this.$refs.renProcessStart.rootObj = this.parentObj
          this.$refs.renProcessStart.callbacks = this.callbacks
          this.$refs.renProcessStart.dataForm.processDefinitionKey = this.dataForm.processDefinitionKey
        })
      } else if (this.showType === 'taskHandle') {
        // 任务处理
        this.runningHandleVisible = true
        this.$nextTick(() => {
          this.$refs.renProcessRunning.rootObj = this.parentObj
          this.$refs.renProcessRunning.dataForm.taskId = this.dataForm.taskId
          this.$refs.renProcessRunning.dataForm.processInstanceId = this.dataForm.processInstanceId
          this.$refs.renProcessRunning.callbacks = this.callbacks
          this.$refs.renProcessRunning.dataForm.businessKey = this.dataForm.businessKey
          this.$refs.renProcessRunning.dataForm.processDefinitionKey = this.dataForm.processDefinitionKey
        })
      }
    })
  },
  props: {
    saveFormUrl: String,
    updateInstanceIdUrl: String,
    dataFormName: String
  },
  watch: {
  },
  methods: {
  }
}
</script>
