<template>
  <el-dialog :visible.sync="visible" :title="$t('process.doBackRollback')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item :label="$t('process.comment')" prop="comment">
            <el-input type="textarea" v-model="dataForm.comment" :placeholder="$t('process.comment')"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="doBackRollback()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import qs from 'qs'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        comment: '',
        taskId: '',
        processInstanceId: ''
      },
      // 回调函数
      callbacks: {
        taskHandleSuccessCallback: null,
        taskHandleErrorCallback: null
      }
    }
  },
  computed: {
    dataRule () {
      return {
        comment: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    doBackRollback: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        var params = qs.stringify({
          'taskId': this.dataForm.taskId,
          'processInstanceId': this.dataForm.processInstanceId,
          'comment': this.dataForm.comment
        })
        this.$http['post']('/act/task/backPreviousTask?', params).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
            if (this.callbacks.taskHandleErrorCallback) {
              this.callbacks.taskHandleErrorCallback(res)
            }
            return
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              if (this.callbacks.taskHandleSuccessCallback) {
                this.callbacks.taskHandleSuccessCallback(res)
              }
            }
          })
        })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
