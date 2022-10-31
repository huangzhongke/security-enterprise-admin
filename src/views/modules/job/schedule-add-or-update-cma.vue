<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
             label-width="120px">
      <el-form-item prop="beanName" :label="$t('schedule.beanName')">
        <!--        :placeholder="$t('schedule.beanNameTips')"  v-model="dataForm.beanName"-->
        <el-input :disabled="true" v-model="dataForm.beanName"></el-input>
      </el-form-item>
      <el-form-item label="账号选择" :label-width="formLabelWidth" prop="submitData.account">
        <el-select v-model="dataForm.submitData.account" class="m-2" clearable placeholder="Select" size="large">
          <el-option
              v-for="item in accountList"
              :key="item.id"
              :label="item.user"
              :value="item.user"
          />
        </el-select>
        <el-button @click="login" type="primary" :loading="isCommitLogin" style="margin-left: 20px">登录</el-button>
      </el-form-item>
      <el-form-item label="起始港" :label-width="formLabelWidth" prop="submitData.startPort.cityFullNameEn">
        <el-select
            v-model="dataForm.submitData.startPort"
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
              :key="item.Name"
              :value="item.Name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目的港" :label-width="formLabelWidth" prop="submitData.endPort.cityFullNameEn">
        <el-select
            v-model="dataForm.submitData.endPort"
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
              :key="item.Name"
              :value="item.Name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="集装箱类型" :label-width="formLabelWidth" prop="submitData.equipment">
        <el-select v-model="dataForm.submitData.equipment" placeholder="请选择">
          <el-option
              v-for="item in equipmentType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="净重(KGM)" :label-width="formLabelWidth" prop="submitData.weight">
        <el-input-number size="medium" placeholder="前10公斤: 10" v-model.number="dataForm.submitData.weight"
                         label="集装箱数量" :min="0" :max="99999"></el-input-number>
      </el-form-item>
      <el-form-item label="柜数" :label-width="formLabelWidth" prop="submitData.quantity">
        <el-input-number size="small" v-model.number="dataForm.submitData.quantity" :min="1" :max="99999"
                         label="集装箱数量"></el-input-number>
      </el-form-item>
      <el-form-item label="指定航名航次" :label-width="formLabelWidth" prop="submitData.isNeedVessel">
        <el-radio v-model="dataForm.submitData.isNeedVessel" :label=true>是</el-radio>
        <el-radio v-model="dataForm.submitData.isNeedVessel" :label=false>否</el-radio>
      </el-form-item>
      <el-form-item v-if="dataForm.submitData.isNeedVessel" label="航名" :label-width="formLabelWidth"
                    prop="submitData.vesselName">
        <el-input v-model="dataForm.submitData.vesselName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.submitData.isNeedVessel" label="航次" :label-width="formLabelWidth"
                    prop="submitData.voyage">
        <el-input v-model="dataForm.submitData.voyage" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="可接受最大价格" :label-width="formLabelWidth" prop="submitData.price">
        <el-input-number v-model.number="dataForm.submitData.price" :min="0" :max="99999"></el-input-number>
      </el-form-item>
      <el-form-item label="船舶离港日期" prop="submitData.leavePortDate">
        <el-col :span="11">
          <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="船舶离港日期"
                          v-model="dataForm.submitData.leavePortDate"
                          style="width: 100%;" @change="changeTime" format="yyyy-MM-dd"></el-date-picker>
        </el-col>
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
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { cron } from 'vue-cron'
import http from '@/utils/request'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        beanName: `${this.$route.params.crawlerName}`,
        params: '{}',
        cronExpression: '0/5 * * * * ? *',
        remark: '',
        status: 0,
        type: 4,
        submitData: {
          account: '',
          startPort: {},
          endPort: {},
          equipment: '',
          quantity: 1,
          weight: 16000,
          isNeedVessel: false,
          vesselName: '',
          voyage: '',
          price: 0,
          leavePortDate: '',
          cookie: '',
          token: '',
          first: true
        }
      },
      cronPopover: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      isCommitLogin: false,
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
          value: '20ST',
          label: '20\' 干货标准集装箱'
        },
        {
          value: '40ST',
          label: '40\' 干货标准集装箱'
        },
        {
          value: '40HC',
          label: '40\' 干货高集装箱'
        },
        {
          value: '45HC',
          label: '45\' 干货高集装箱'
        },
        {
          value: '20RF',
          label: '20尺冻柜'
        }
      ],
      accountList: []
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
        'submitData.equipment': [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        'submitData.account': [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        'submitData.leavePortDate': [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  // watch: {
  //   'dataForm.submitData.equipment': {
  //     deep: true,
  //     handler (newVal, oldVal) {
  //       let sub = ''
  //       if (newVal === '20ST' || newVal === '40ST' || newVal === '40HC' || newVal === '45HC') {
  //         // eslint-disable-next-line no-unused-vars
  //         sub = 'ST'
  //       } else {
  //         sub = 'RF'
  //       }
  //       setTimeout(() => {
  //         http({
  //           url: '/cmaw/pricingGroupsAndDetail',
  //           method: 'POST',
  //           data: {
  //             equipmentType: sub,
  //             pol: this.dataForm.submitData.startPort,
  //             pod: this.dataForm.submitData.endPort,
  //             cookie: this.dataForm.submitData.cookie,
  //             token: this.dataForm.submitData.token
  //           }
  //         }).then(({ data }) => {
  //           console.log(data)
  //         })
  //       }, 100)
  //     }
  //   }
  // },
  methods: {
    changeTime (val) {
      this.dataForm.submitData.leavePortDate = val
    },
    getStartPort (query) {
      if (query !== '') {
        this.selectFrom.loading = true
        setTimeout(() => {
          this.selectFrom.loading = false
          http({
            url: '/cmaw/port',
            method: 'POST',
            data: {
              query: query
            }
          }).then(({ data }) => {
            this.selectFrom.list = data.data || []
            this.selectFrom.options = this.selectFrom.list
          }).catch(error => {
            console.log(error)
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
          console.log(this.dataForm.cookie)
          http({
            url: '/cmaw/port',
            method: 'POST',
            data: {
              query: query
            }
          }).then(({ data }) => {
            this.selectTo.list = data.data || []
            this.selectTo.options = this.selectTo.list
          }).catch(error => {
            console.log(error)
          })
        }, 50)
      } else {
        this.selectTo.options = []
      }
    },
    getAccountList () {
      http({
        url: '/spider/account/list',
        method: 'get',
        params: {
          isOrderAccount: true,
          type: 2
        }
      }).then(({ data }) => {
        this.accountList = data.data
      })
    },
    login () {
      this.isCommitLogin = true
      http({
        url: '/cmaw/loginCMA',
        method: 'POST',
        data: {
          username: this.dataForm.submitData.account
        }
      }).then(({ data }) => {
        this.dataForm.submitData.cookie = data.data.cookie + ' ' + data.data.aspCookie + '; ' + data.data.datadome + '; ' + data.data.cookieToken
        this.dataForm.submitData.token = data.data.headerToken
        this.dataForm.submitData.ip = data.data.ip
        console.log(data)
        this.$message.success('登陆成功')
        this.isCommitLogin = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('登陆失败')
        this.isCommitLogin = false
      })
    },
    init () {
      this.visible = true
      this.$nextTick(() => {
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
      console.log('getIno')
      this.$http.get(`/sys/schedule/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = res.data
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
          tag: 'cma',
          data: JSON.stringify(this.dataForm)
        }
        console.log('formMap', formMap)
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
              console.log(this.dataForm)
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
    this.getAccountList()
  }
}
</script>
