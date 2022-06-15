<template>
  <div>
    <el-button type="primary" @click="completeTask()">{{ $t('process.completeTask') }}</el-button>
    <el-button type="warning" @click="rejectTask()">{{ $t('process.rejectTask') }}</el-button>
    <el-button type="success" @click="rollbackTask()">{{ $t('process.doBackRollback') }}</el-button>
    <el-button type="info" @click="entrustTask()">{{ $t('process.entrustTask') }}</el-button>
    <el-button type="danger" @click="terminationTask()">{{ $t('process.terminationTask') }}</el-button>
    <ren-task-back v-if="renTaskBackVisible" ref="renTaskBack"></ren-task-back>
    <ren-task-entrust v-if="renTaskEntrustVisible" ref="renTaskEntrust"></ren-task-entrust>
    <ren-task-handle v-if="renTaskHandleVisible" ref="renTaskHandle"></ren-task-handle>
  </div>
</template>

<script>
import RenTaskBack from './ren-task-back'
import RenTaskEntrust from './ren-task-entrust'
import RenTaskHandle from './ren-task-handle'
export default {
  name: 'RenProcessRunning',
  data () {
    return {
      // 是否显示退回窗口
      renTaskBackVisible: false,
      renTaskEntrustVisible: false,
      renTaskHandleVisible: false,
      parentObj: null,
      dataForm: {
        taskId: '',
        businessKey: '',
        processDefinitionKey: '',
        processInstanceId: ''
      },
      // 回调函数
      callbacks: {
        taskHandleSuccessCallback: null,
        taskHandleErrorCallback: null
      }
    }
  },
  components: {
    RenTaskBack,
    RenTaskEntrust,
    RenTaskHandle
  },
  created () {
    this.$nextTick(() => {
    })
  },
  props: {
  },
  watch: {
  },
  methods: {
    completeTask () {
      this.renTaskHandleVisible = true
      this.$nextTick(() => {
        this.$refs.renTaskHandle.dataForm.taskId = this.dataForm.taskId
        this.$refs.renTaskHandle.callbacks = this.callbacks
        this.$refs.renTaskHandle.handleType = 'complete'
        this.$refs.renTaskHandle.init()
      })
    },
    rejectTask () {
      this.renTaskHandleVisible = true
      this.$nextTick(() => {
        this.$refs.renTaskHandle.dataForm.taskId = this.dataForm.taskId
        this.$refs.renTaskHandle.callbacks = this.callbacks
        this.$refs.renTaskHandle.handleType = 'reject'
        this.$refs.renTaskHandle.init()
      })
    },
    rollbackTask () {
      this.renTaskBackVisible = true
      this.$nextTick(() => {
        this.$refs.renTaskBack.dataForm.taskId = this.dataForm.taskId
        this.$refs.renTaskBack.dataForm.processInstanceId = this.dataForm.processInstanceId
        this.$refs.renTaskBack.callbacks = this.callbacks
        this.$refs.renTaskBack.init()
      })
    },
    entrustTask () {
      this.renTaskEntrustVisible = true
      this.$nextTick(() => {
        this.$refs.renTaskEntrust.dataForm.taskId = this.dataForm.taskId
        this.$refs.renTaskEntrust.callbacks = this.callbacks
        this.$refs.renTaskEntrust.init()
      })
    },
    terminationTask () {
      this.renTaskHandleVisible = true
      this.$nextTick(() => {
        this.$refs.renTaskHandle.dataForm.taskId = this.dataForm.taskId
        this.$refs.renTaskHandle.callbacks = this.callbacks
        this.$refs.renTaskHandle.handleType = 'termination'
        this.$refs.renTaskHandle.init()
      })
    }
  }
}
</script>
