<template>
  <el-button type="primary" @click="processStartHandle()">{{ $t('process.createInstance') }}</el-button>
</template>

<script>
import qs from 'qs'
export default {
  name: 'RenProcessStart',
  data () {
    return {
      formUrl: '',
      instanceIdUrl: '',
      formName: null,
      rootObj: null,
      dataForm: {
        processDefinitionKey: ''
      },
      // 回调函数
      callbacks: {
        startProcessSuccessCallback: null,
        startProcessErrorCallback: null,
        formSaveSuccessCallback: null,
        formSaveErrorCallback: null
      }
    }
  },
  components: {
  },
  created () {
    this.$nextTick(() => {
      this.formUrl = this.saveFormUrl
      this.instanceIdUrl = this.updateInstanceIdUrl
      this.formName = this.dataFormName
    })
  },
  props: {
    saveFormUrl: String,
    updateInstanceIdUrl: String,
    dataFormName: String
  },
  watch: {
    saveFormUrl (val) {
      this.formUrl = val
    },
    updateInstanceIdUrl (val) {
      this.instanceIdUrl = val
    },
    dataFormName (val) {
      this.formName = val
    }
  },
  methods: {
    // 启动流程事件
    processStartHandle () {
      if (!this.formUrl) {
        return this.$message.error(this.$t('process.formURLError'))
      }
      if (!this.dataForm.processDefinitionKey) {
        return this.$message.error(this.$t('process.keyError'))
      }
      if (!this.formName) {
        return this.$message.error(this.$t('process.formNameError'))
      }
      this.rootObj.$refs[this.formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http.get(`/act/process/lastestPage`, {
          params: {
            key: this.dataForm.processDefinitionKey
          }
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          if (!res.data.list || res.data.list.length <= 0) {
            return this.$message.error(this.$t('process.notExistError'))
          }
          this.$http['post'](this.formUrl, this.rootObj[this.formName]).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
              if (this.callbacks.formSaveErrorCallback) {
                this.callbacks.formSaveErrorCallback(res)
              }
            }
            if (this.callbacks.formSaveSuccessCallback) {
              this.callbacks.formSaveSuccessCallback(res)
            }
            if (!res.data.businessKey) {
              return this.$message.error(this.$t('process.businessKeyError'))
              // this.startProcess(this.dataForm.processDefinitionKey, null, this.rootObj[this.formName])
            } else {
              this.startProcess(this.dataForm.processDefinitionKey, res.data.businessKey, this.rootObj[this.formName])
            }
          }).catch(() => {})
        }).catch(() => {})
      })
    },
    // 启动流程
    startProcess (processDefinitionKey, businessKey, formData) {
      var data = {
        processDefinitionKey: processDefinitionKey,
        businessKey: businessKey,
        variables: formData
      }
      this.$http['post']('/act/running/startOfBusinessKey', data).then(({ data: res }) => {
        if (res.code !== 0) {
          if (this.callbacks.startProcessErrorCallback) {
            this.callbacks.startProcessErrorCallback(res.data)
          }
        }
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            if (this.callbacks.startProcessSuccessCallback) {
              this.callbacks.startProcessSuccessCallback(res.data)
            }
          }
        })
        if (this.instanceIdUrl) {
          var params = qs.stringify({
            processInstanceId: res.data.processInstanceId,
            processDefinitionKey: processDefinitionKey,
            businessKey: businessKey
          })
          this.$http['post'](this.instanceIdUrl + '?' + params).then(({ data: res }) => {})
        }
      }).catch(() => {})
    }
  }
}
</script>
