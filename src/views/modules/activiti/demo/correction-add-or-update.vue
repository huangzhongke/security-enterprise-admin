<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item :label="$t('correction.post')" prop="applyPost">
        <el-input v-model="dataForm.applyPost" :placeholder="$t('correction.post')"></el-input>
      </el-form-item>
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item :label="$t('correction.entryDate')" prop="entryDate">
            <el-date-picker v-model="dataForm.entryDate" value-format="yyyy-MM-dd" :placeholder="$t('correction.entryDate')" style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('correction.correctionDate')" prop="correctionDate">
            <el-date-picker v-model="dataForm.correctionDate" value-format="yyyy-MM-dd" :placeholder="$t('correction.correctionDate')" style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('correction.workContent')" prop="workContent">
        <el-input type="textarea" v-model="dataForm.workContent" :placeholder="$t('correction.workContent')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('correction.achievement')" prop="achievement">
        <el-input type="textarea" v-model="dataForm.achievement" :placeholder="$t('correction.achievement')"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <!--  流程启动组件  -->
      <ren-process-start v-if="processVisible" updateInstanceIdUrl="/act/demo/correction/updateInstanceId" saveFormUrl="/act/demo/correction" dataFormName="dataForm" ref="renProcessStart" ></ren-process-start>
    </template>
  </el-dialog>
</template>

<script>
// 引入工作流公共方法
import processModule from '@/mixins/process-module'
export default {
  // 注入公共方法
  mixins: [processModule],
  data () {
    return {
      // 是否显示流程启动组件
      processVisible: true,
      visible: false,
      dataForm: {
        id: '',
        applyPost: '',
        entryDate: '',
        correctionDate: '',
        workContent: '',
        achievement: '',
        creator: '',
        createDate: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        applyPost: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        entryDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        correctionDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        workContent: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        achievement: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        createTime: [
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
        if (this.dataForm.id) {
          this.getInfo()
        }
        // 将业务组件对象赋值给流程（回调时需要用到）
        this.$refs.renProcessStart.rootObj = this
        // 配置回调函数
        this.$refs.renProcessStart.callbacks = {
          startProcessSuccessCallback: this.closeCurrentDialog,
          startProcessErrorCallback: this.startProcessErrorCallback,
          formSaveSuccessCallback: null,
          formSaveErrorCallback: null
        }
        // 配置流程定义KEY
        this.$refs.renProcessStart.dataForm.processDefinitionKey = 'correctionprocess'
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/act/demo/correction/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    closeCurrentDialog () {
      this.visible = false
      this.$emit('refreshDataList')
    }
  }
}
</script>
