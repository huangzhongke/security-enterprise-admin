<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
             label-width="120px">
      <el-form-item prop="beanName" :label="$t('schedule.beanName')">
        <!--        :placeholder="$t('schedule.beanNameTips')"  v-model="dataForm.beanName"-->
        <el-input :disabled="true" v-model="dataForm.beanName"></el-input>
      </el-form-item>
      <el-form-item label="账号选择" :label-width="formLabelWidth" prop="account">
        <el-select v-model="dataForm.account" class="m-2" clearable placeholder="Select" size="large">
          <el-option
              v-for="item in accountList"
              :key="item.id"
              :label="item.user"
              :value="item.user"
          />
        </el-select>
        <el-button @click="login" type="primary" :loading="isCommitLogin" style="margin-left: 20px"
                   :disabled="dataForm.account===''">登录
        </el-button>
      </el-form-item>
      <el-form-item label="起始港" :label-width="formLabelWidth" prop="startPort.cityFullNameEn">
        <el-select
            v-model="showStartPortName"
            change
            :multiple="false"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="getStartPort"
            :loading="selectFrom.loading"
        >
          <el-option
              v-for="item in selectFrom.options"
              :key="item.id"
              :value="item.cityFullNameCn + '-'+ item.cityFullNameEn">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目的港" :label-width="formLabelWidth" prop="endPort.cityFullNameEn">
        <el-select
            v-model="showEndPortName"
            change
            :multiple="false"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="getEndPort"
            :loading="selectTo.loading">
          <!--                :label="item.id"-->
          <el-option
              v-for="item in selectTo.options"
              :key="item.id"
              :value="item.cityFullNameCn + '-'+item.cityFullNameEn">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="集装箱类型" :label-width="formLabelWidth" prop="equipment">
        <el-select v-model="dataForm.equipment" placeholder="请选择">
          <el-option
              v-for="item in equipmentType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量" :label-width="formLabelWidth" prop="quantity">
        <el-input-number v-model.number="dataForm.quantity" :min="1" :max="100" label="集装箱数量"></el-input-number>
      </el-form-item>
      <el-form-item label="指定航名航次" :label-width="formLabelWidth" prop="isNeedVesselName">
        <el-radio v-model="dataForm.isNeedVesselName" :label=true>是</el-radio>
        <el-radio v-model="dataForm.isNeedVesselName" :label=false>否</el-radio>
      </el-form-item>
      <el-form-item v-if="dataForm.isNeedVesselName" label="航名" :label-width="formLabelWidth" prop="vesselName">
        <el-input v-model="dataForm.vesselName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.isNeedVesselName" label="航次" :label-width="formLabelWidth" prop="voyage">
        <el-input v-model="dataForm.voyage" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="可接受最大价格" :label-width="formLabelWidth" prop="price">
        <el-input-number v-model.number="dataForm.price" :min="0" :max="99999"></el-input-number>
      </el-form-item>
      <el-form-item label="预计开航时间">
        <el-col :span="11">
          <el-date-picker  type="date" placeholder="最早开航时间" v-model="dataForm.startDate" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="最晚开航时间" v-model="dataForm.endDate" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="搜索子账号" :label-width="formLabelWidth" prop="orderAccount">
        <el-select v-model="dataForm.childAccount" multiple placeholder="请选择">
          <el-option
              v-for="item in childAccountList"
              :key="item.id"
              :label="item.user"
              :value="item.user">
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
import { getAccountList } from '../../../utils/ooclUtils'
import { loginUser, getPort } from '@/utils/coscoUtils'

export default {
  data () {
    return {
      visible: false,
      showStartPortName: '',
      showEndPortName: '',
      dataForm: {
        beanName: `${this.$route.params.crawlerName}`,
        params: '{}',
        cronExpression: '0/2 * * * * ? *',
        remark: '',
        status: 0,
        startPort: {
          cityFullNameCn: '',
          cityFullNameEn: '',
          cityName: '',
          ctryName: '',
          id: '',
          isActive: '',
          stateCode: '',
          stateName: '',
          unlocode: '',
          updateTime: '',
          updateBy: ''
        },
        endPort: {
          cityFullNameCn: '',
          cityFullNameEn: '',
          cityName: '',
          ctryName: '',
          id: '',
          isActive: '',
          stateCode: '',
          stateName: '',
          unlocode: '',
          updateTime: '',
          updateBy: ''
        },
        equipment: '',
        vesselName: '',
        voyage: '',
        quantity: 1,
        price: 0,
        account: '',
        cookie: '',
        token: '',
        startDate: '',
        endDate: '',
        childAccount: [],
        isNeedVesselName: false,
        type: 2
      },
      cronPopover: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      isCommitLogin: false,
      isCommitForm: false,
      formLabelWidth: '120px',
      selectFrom: {
        options: [],
        value: [],
        list: [],
        loading: false
      },
      selectTo: {
        options: [],
        value: [],
        list: [],
        loading: false
      },
      equipmentType: [
        {
          value: '20GP',
          label: '20GP'
        },
        {
          value: '40GP',
          label: '40GP'
        },
        {
          value: '40HQ',
          label: '40HQ'
        }
      ],
      accountList: [],
      childAccountList: []
    }
  },
  components: {
    cron
  },
  computed: {
    dataRule () {
      return {
        beanName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        account: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        showStartPortName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        showEndPortName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        equipment: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        childAccount: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    deep: true,
    showStartPortName (newValue, oldValue) {
      this.selectFrom.options.forEach(item => {
        if (item.cityFullNameCn + '-' + item.cityFullNameEn === newValue) {
          this.dataForm.startPort = item
        }
      })
    },
    showEndPortName (newValue, oldValue) {
      this.selectTo.options.forEach(item => {
        if (item.cityFullNameCn + '-' + item.cityFullNameEn === newValue) {
          this.dataForm.endPort = item
        }
      })
    }
  },
  methods: {
    getStartPort (query) {
      if (query !== '') {
        this.selectFrom.loading = true
        setTimeout(() => {
          this.selectFrom.loading = false
          console.log(this.dataForm.cookie)
          getPort(query, this.dataForm.cookie, this.dataForm.token).then(({ data: res }) => {
            if (res.data === '') {
              this.$message.info('未搜索到结果')
            }
            this.selectFrom.list = res.data || []
            this.selectFrom.options = this.selectFrom.list
          })
        }, 50)
      } else {
        this.selectFrom.options = []
      }
    },
    getEndPort (query) {
      if (query !== '') {
        this.selectTo.loading = true
        setTimeout(() => {
          this.selectTo.loading = false
          getPort(query, this.dataForm.cookie, this.dataForm.token).then(({ data: res }) => {
            if (res.data === '') {
              this.$message.info('未搜索到结果')
            }
            this.selectTo.list = res.data || []
            this.selectTo.options = this.selectTo.list
          })
        }, 50)
      } else {
        this.selectFrom.options = []
      }
    },
    login () {
      this.isCommitLogin = true
      loginUser(this.dataForm.account).then(({ data: res }) => {
        if (res.code === 0) {
          this.$message.success('登陆成功')
          this.dataForm.cookie = res.data.cookie
          this.dataForm.token = res.data.token
        } else {
          this.$message.error(res.msg)
        }
        this.isCommitLogin = false
      })
    },
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.showStartPortName = ''
        this.showEndPortName = ''
        this.dataForm.startDate = ''
        this.dataForm.endDate = ''
        this.dataForm.childAccount = []
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
        this.showStartPortName = this.dataForm.startPort.cityFullNameCn + '-' + this.dataForm.startPort.cityFullNameEn
        this.showEndPortName = this.dataForm.endPort.cityFullNameCn + '-' + this.dataForm.endPort.cityFullNameEn
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
        const formMap = {
          tag: 'cosco',
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
    }, 1000, { leading: true, trailing: false })
  },
  mounted () {
    getAccountList(true, 1).then(({ data: res }) => {
      this.accountList = res.data
    })
    getAccountList(true, 1).then(({ data: res }) => {
      this.childAccountList = res.data
    })
    this.dataForm.cookie = ''
    this.dataForm.token = ''
  }
}
</script>
