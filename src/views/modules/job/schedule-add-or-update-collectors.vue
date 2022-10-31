<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
             label-width="120px">
      <el-form-item prop="beanName" :label="$t('schedule.beanName')">
        <!--        :placeholder="$t('schedule.beanNameTips')"  v-model="dataForm.beanName"-->
        <el-input :disabled="true" v-model="dataForm.beanName"></el-input>
      </el-form-item>
      <el-form-item label="网站" prop="FormData.website">
        <el-select v-model="dataForm.FormData.website" :placeholder="$t('选择爬取的网站')" ref="website">
          <el-option
              v-for="item in webs"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起始港-目的港" prop="FormData.quotes">
        <el-select multiple
                   filterable
                   allow-create
                   default-first-option
                   v-model="dataForm.FormData.quotes" placeholder="请选择">
          <el-option
              v-for="item in quotesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="cronExpression" :label="$t('schedule.cronExpression')">
        <el-popover v-model="cronPopover">
          <cron @change="changeCron" @close="cronPopover=false" i18n="cn"></cron>
          <el-input slot="reference" @click="cronPopover=true" v-model="dataForm.cronExpression"
                    :placeholder="$t('schedule.cronExpressionTips')"></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('schedule.remark')">
        <el-input v-model="dataForm.remark" :placeholder="$t('schedule.remark')"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button :loading="isCommitForm" type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { cron } from 'vue-cron'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        beanName: `${this.$route.params.crawlerName}`,
        params: '{}',
        cronExpression: '0/2 * * * * ? *',
        remark: '',
        FormData: {
          quotes: '',
          website: ''
        }
      },
      cronPopover: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      isCommitLogin: false,
      isCommitForm: false,
      formLabelWidth: '120px',
      webs: [
        {
          label: 'one',
          value: 'one'
        },
        {
          label: 'cosco',
          value: 'cosco'
        },
        {
          label: 'oocl',
          value: 'oocl'
        }
      ],
      quotesOptions: [
        {
          label: '宁波-雅加达',
          value: '宁波-雅加达'
        },
        {
          label: '宁波-巴生',
          value: '宁波-巴生'
        }
      ]
    }
  },
  components: {
    cron
  },
  computed: {
    dataRule () {
      return {
        beanName: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        cronExpression: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        'FormData.website': [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        'FormData.quotes': [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    changeCron (val) {
      this.dataForm.cronExpression = val
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/sys/schedule/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = res.data
        // this.form = JSON.parse(res.data.params)
      }).catch(() => {
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.dataForm.params = JSON.stringify(this.dataForm.FormData)
        const formMap = {
          tag: 'collectors',
          data: JSON.stringify(this.dataForm)
        }
        this.isCommitForm = true
        this.$http[!this.dataForm.id ? 'post' : 'put']('/sys/schedule', formMap).then(({ data: res }) => {
          if (res.code !== 0) {
            this.visible = false
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
          this.isCommitForm = false
        }).catch(() => {
        })
      })
    }, 1000, {
      leading: true,
      trailing: false
    })
  },
  mounted () {
  }
}
</script>
