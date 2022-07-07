<template>
  <el-dialog :visible.sync="visible" :title="$t('process.entrustTask')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item :label="$t('process.assignee')">
        <el-input v-model="dataForm.entrustUserName" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="selectUserInfo()"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="entrustTask()">{{ $t('confirm') }}</el-button>
    </template>
    <select-user v-if="selectUserVisible" ref="selectUser" ></select-user>
  </el-dialog>
</template>

<script>
import SelectUser from './select-user'
import qs from 'qs'
export default {
  data () {
    return {
      visible: false,
      selectUserVisible: false,
      dataForm: {
        id: '',
        entrustUserId: '',
        entrustUserName: '',
        taskId: ''
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
        entrustUserName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    SelectUser
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 委托
    entrustTask () {
      if (!this.dataForm.entrustUserId) {
        this.$message.error(this.$t('process.entrustError'))
        return
      }
      var task = qs.stringify({
        taskId: this.dataForm.taskId,
        assignee: this.dataForm.entrustUserId
      })
      this.$http['post']('/act/task/entrust', task).then(({ data: res }) => {
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
      }).catch(() => {})
    },
    selectUserInfo () {
      this.selectUserVisible = true
      this.$nextTick(() => {
        this.$refs.selectUser.dataForm.id = ''
        this.$refs.selectUser.init(this.setUserInfo)
      })
    },
    setUserInfo (userInfo) {
      this.dataForm.entrustUserId = userInfo.id
      this.dataForm.entrustUserName = userInfo.realName
    }
  }
}
</script>
