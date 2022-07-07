<!--  流程业务表单   -->
<template>
  <el-card shadow="never" class="aui-card--fill">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item :label="$t('correction.post')" prop="applyPost">
              <el-input v-model="dataForm.applyPost" :disabled="fieldDisabled" :placeholder="$t('correction.post')"></el-input>
          </el-form-item>
          <el-row :gutter="40">
              <el-col :span="12">
                  <el-form-item :label="$t('correction.entryDate')" prop="entryDate">
                      <el-date-picker v-model="dataForm.entryDate" :disabled="fieldDisabled" value-format="yyyy-MM-dd" :placeholder="$t('correction.entryDate')" style="width: 100%"></el-date-picker>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item :label="$t('correction.correctionDate')" prop="correctionDate">
                      <el-date-picker v-model="dataForm.correctionDate" :disabled="fieldDisabled" value-format="yyyy-MM-dd" :placeholder="$t('correction.correctionDate')" style="width: 100%"></el-date-picker>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-form-item :label="$t('correction.workContent')" prop="workContent">
              <el-input type="textarea" v-model="dataForm.workContent" :disabled="fieldDisabled" :placeholder="$t('correction.workContent')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('correction.achievement')" prop="achievement">
              <el-input type="textarea" v-model="dataForm.achievement" :disabled="fieldDisabled" :placeholder="$t('correction.achievement')"></el-input>
          </el-form-item>
      </el-form>
      <!--  流程综合组件   -->
      <ren-process-multiple v-if="processVisible" updateInstanceIdUrl="/act/demo/correction/updateInstanceId" saveFormUrl="/act/demo/correction" dataFormName="dataForm" ref="renProcessMultiple" ></ren-process-multiple>
  </el-card>
</template>

<script>
// 引入工作流公共方法
import processModule from '@/mixins/process-module'
export default {
  // 注入公共方法
  mixins: [processModule],
  data () {
    return {
      visible: false,
      // 表单属性是否可编辑
      fieldDisabled: false,
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
  created () {
    // 将业务KEY赋值给表单
    this.dataForm.id = this.$route.params.businessKey
    this.init()
    // 流程回调
    var callbacks = {
      startProcessSuccessCallback: this.closeCurrentTab,
      startProcessErrorCallback: this.startProcessErrorCallback,
      taskHandleSuccessCallback: this.closeCurrentTab,
      taskHandleErrorCallback: this.taskHandleErrorCallback,
      formSaveSuccessCallback: null,
      formSaveErrorCallback: null
    }
    // 初始化综合组件
    this.initProcessMultiple(callbacks)
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
          // 如业务KEY已存在，不允许编辑
          this.fieldDisabled = true
          this.getInfo()
        }
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
    // 启动流程出错回调
    startProcessErrorCallback (data) {
      console.log(data)
    },
    // 任务处理出错回调
    taskHandleErrorCallback (data) {
    }
  }
}
</script>
