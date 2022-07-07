<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form  :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
             label-width="120px">
      <el-form-item  prop="beanName" :label="$t('schedule.beanName')">
<!--        :placeholder="$t('schedule.beanNameTips')"  v-model="dataForm.beanName"-->
        <el-input :disabled="true"  v-model="dataForm.beanName"></el-input>
      </el-form-item>
<!--      <el-form-item prop="params" :label="$t('schedule.params')">-->
<!--        <el-input v-model="dataForm.params" :placeholder="$t('schedule.params')"></el-input>-->
<!--        &lt;!&ndash;        <el-button @click="addParams('haha')">{{ $t('添加') }}</el-button> dialogFormVisible = true &ndash;&gt;-->
<!--&lt;!&ndash;        <el-button type="text" @click="dialogFormVisible = true">{{ $t(`${this.addOrUpdateName}`) }}</el-button>&ndash;&gt;-->
<!--      </el-form-item>-->
      <el-form-item  label="身份码" :label-width="formLabelWidth"  prop="authorization">
        <el-input   type="textarea" :row="10" v-model="dataForm.authorization" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="起始港" :label-width="formLabelWidth" prop="startPort.matched">
        <el-select
            v-model="dataForm.startPort.matched"
            change
            :multiple="false"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="fromMethod"
            :loading="selectFrom.loading"
        >
          <el-option
              v-for="item in selectFrom.options"
              :key="item.id"
              :value="item.matched">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目的港" :label-width="formLabelWidth" prop="endPort.matched">
        <el-select
            v-model="dataForm.endPort.matched"
            change
            :multiple="false"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="toMethod"
            :loading="selectTo.loading">
          <!--                :label="item.id"-->
          <el-option
              v-for="item in selectTo.options"
              :key="item.id"
              :value="item.matched">
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
        <el-input-number v-model.number="dataForm.quantity" :min="1" :max="10" label="集装箱数量"></el-input-number>
      </el-form-item>
      <el-form-item label="etd时间" :label-width="formLabelWidth" prop="etdDays">
        <el-input  v-model.number.trim="dataForm.etdDays" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="指定航名航次" :label-width="formLabelWidth" prop="isNeedLineName">
        <el-radio v-model="dataForm.isNeedLineName" :label=true>是</el-radio>
        <el-radio v-model="dataForm.isNeedLineName" :label=false>否</el-radio>
      </el-form-item>
      <el-form-item v-if="dataForm.isNeedLineName" label="航名" :label-width="formLabelWidth" prop="vesselName">
        <el-input v-model="dataForm.vesselName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.isNeedLineName" label="航次" :label-width="formLabelWidth" prop="voyage">
        <el-input v-model="dataForm.voyage" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="指定航线代码" :label-width="formLabelWidth" prop="isNeedSupplierName">
        <el-radio v-model="dataForm.isNeedSupplierName" :label=true>是</el-radio>
        <el-radio v-model="dataForm.isNeedSupplierName" :label=false>否</el-radio>
      </el-form-item>
      <el-form-item v-if="dataForm.isNeedSupplierName" label="航线代码" :label-width="formLabelWidth" prop="supplierName">
        <el-input v-model="dataForm.supplierName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="使用代理" :label-width="formLabelWidth" prop="isProxy">
        <el-radio v-model="dataForm.isProxy" :label=true>是</el-radio>
        <el-radio v-model="dataForm.isProxy" :label=false>否</el-radio>
      </el-form-item>
      <el-form-item label="填写收货人" :label-width="formLabelWidth" prop="brokerageAddress">
        <el-radio v-model="dataForm.isNeedConsigneeAddress" :label=true>是</el-radio>
        <el-radio v-model="dataForm.isNeedConsigneeAddress" :label=false>否</el-radio>
      </el-form-item>
      <el-form-item v-if="dataForm.isNeedConsigneeAddress" label="收货人" :label-width="formLabelWidth" prop="consigneeAddress.singleLine">
        <el-select
            v-model="dataForm.consigneeAddress.companyName"
            change
            :multiple="false"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="consigneeMethod"
            :loading="selectConsignee.loading">
          <el-option
              v-for="item in selectConsignee.options"
              :key="item.id"
              :value="item.companyName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="填写通知人" :label-width="formLabelWidth" prop="brokerageAddress">
        <el-radio v-model="dataForm.isNeedNotifyAddress" :label=true>是</el-radio>
        <el-radio v-model="dataForm.isNeedNotifyAddress" :label=false>否</el-radio>
      </el-form-item>
      <el-form-item v-if="dataForm.isNeedNotifyAddress" label="通知人" :label-width="formLabelWidth" prop="notifyAddress.singleLine">
        <el-select
            v-model="dataForm.notifyAddress.companyName"
            change
            :multiple="false"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="notifyMethod"
            :loading="this.selectNotify.loading">
          <!--                :label="item.id"-->
          <el-option
              v-for="item in this.selectNotify.options"
              :key="item.id"
              :value="item.companyName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="货运代理" :label-width="formLabelWidth" prop="brokerageAddress">
        <el-radio v-model="dataForm.isNeedBrokerageAddress" :label=true>是</el-radio>
        <el-radio v-model="dataForm.isNeedBrokerageAddress" :label=false>否</el-radio>
      </el-form-item>
      <el-form-item  label="scac" :label-width="formLabelWidth" prop="scac">
<!--        <el-input v-model="dataForm.scac" autocomplete="off"></el-input>-->
        <el-select v-model="dataForm.scac" placeholder="请选择">
          <el-option
              v-for="item in scacType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下单间隔时间" :label-width="formLabelWidth" prop="orderSleepTime">
        <el-input-number v-model.number="dataForm.orderSleepTime" :min="0" :max="10" label="下单间隔时间"></el-input-number>
      </el-form-item>
      <el-form-item  label="可接受最大价格" :label-width="formLabelWidth" prop="price">
        <el-input-number v-model.number="dataForm.price" :min="0" :max="99999"></el-input-number>
      </el-form-item>
      <el-form-item  label="重量" :label-width="formLabelWidth" prop="weight">
        <el-input-number v-model="dataForm.weight" :min="0" :max="99999"></el-input-number>
      </el-form-item>
      <el-form-item label="小提单号" :label-width="formLabelWidth" prop="references">
        <el-input v-model.trim="dataForm.references" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="账号" :label-width="formLabelWidth" prop="account">
        <el-select v-model="dataForm.account" placeholder="请选择">
          <el-option
              v-for="item in accountType"
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
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { cron } from 'vue-cron'

import { getFromPort, getToPort, getAddress } from '../../../utils/myUtils'

export default {
  data () {
    return {
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
      selectConsignee: {
        options: [],
        value: [],
        list: [],
        loading: false
      },
      selectNotify: {
        options: [],
        value: [],
        list: [],
        loading: false
      },
      visible: false,
      accountType: [
        {
          value: 0,
          label: '环集美线'
        },
        {
          value: 1,
          label: '泰博美线'
        },
        {
          value: 2,
          label: '附属账号'
        }
      ],
      equipmentType: [
        {
          value: '22G1',
          label: 'DRY 20'
        },
        {
          value: '42G1',
          label: 'DRY 40'
        },
        {
          value: '45G1',
          label: 'DRY 40H'
        },
        {
          value: 'L5G1',
          label: 'DRY 45H'
        },
        {
          value: '45RD',
          label: 'Reefer DRY 40H'
        }
      ],
      scacType: [
        {
          value: 'HSCP',
          label: '环集账号SCAC(HSCP)'
        },
        {
          value: 'MFID',
          label: '泰博账号SCAC(MFID)'
        },
        {
          value: 'NSIJ',
          label: '环集附属账号SCAC(NSIJ)'
        }
      ],
      dataForm: {
        beanName: `${this.$route.params.crawlerName}`,
        params: '{}',
        cronExpression: '0/5 * * * * ? *',
        remark: '',
        status: 0,
        account: 0,
        startPort: {
          iata: '',
          matched: '',
          matchedCountry: '',
          mode: '',
          unCode: '',
          id: ''
        },
        endPort: {
          id: '',
          fmc: true,
          iata: '',
          matched: '',
          matchedCountry: '',
          mode: '',
          unCode: ''
        },
        notifyAddress: {
          address1: '',
          cityTown: '',
          companyName: '',
          country: '',
          firstName: '',
          id: '',
          lastName: '',
          phone: '',
          singleLine: '',
          vatNo: '',
          postCode: ''
        },
        consigneeAddress: {
          address1: '',
          cityTown: '',
          companyName: '',
          country: '',
          firstName: '',
          id: '',
          lastName: '',
          phone: '',
          singleLine: '',
          vatNo: '',
          postCode: ''
        },
        isNeedBrokerageAddress: false,
        isNeedNotifyAddress: false,
        isNeedConsigneeAddress: false,
        etdDays: 0,
        isProxy: false,
        isNeedLineName: false,
        isNeedSupplierName: false,
        equipment: '',
        quantity: 1,
        vesselName: '',
        voyage: '',
        supplierName: '',
        orderSleepTime: 0,
        authorization: '',
        references: '',
        scac: '',
        price: 0,
        weight: 16000,
        type: 0
      },
      cronPopover: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px'
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
        authorization: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        references: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        equipment: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        scac: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        'startPort.matched': [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        'endPort.matched': [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'dataForm.endPort.matched': {
      deep: true,
      handler (newValue, oldValue) {
        this.selectTo.options.forEach(item => {
          if (item.matched === newValue) {
            this.dataForm.endPort = item
          }
        })
      }
    },
    'dataForm.startPort.matched': {
      deep: true,
      handler (newValue, oldValue) {
        this.selectTo.options.forEach(item => {
          if (item.matched === newValue) {
            this.dataForm.endPort = item
          }
        })
      }
    },
    'dataForm.notifyAddress.companyName': {
      deep: true,
      handler (newValue, oldValue) {
        this.selectNotify.options.forEach(item => {
          if (item.companyName === newValue) {
            this.dataForm.notifyAddress = item
          }
        })
      }
    },
    'dataForm.consigneeAddress.companyName': {
      deep: true,
      handler (newValue, oldValue) {
        this.selectConsignee.options.forEach(item => {
          if (item.companyName === newValue) {
            this.dataForm.consigneeAddress = item
          }
        })
      }
    }
  },
  methods: {
    fromMethod (query) {
      if (query !== '') {
        this.selectFrom.loading = true
        setTimeout(() => {
          this.selectFrom.loading = false
          getFromPort(this.dataForm.authorization, query).then(response => {
            if (response.data === '') {
              alert('身份码失效 暂无数据')
            }
            this.selectFrom.list = response.data.location || []
            this.selectFrom.options = this.selectFrom.list
          })
        }, 100)
      } else {
        this.selectFrom.options = []
      }
    },
    toMethod (query) {
      if (query !== '') {
        this.selectTo.loading = true
        this.selectFrom.options.forEach(item => {
          if (item.matched === this.dataForm.startPort.matched) {
            this.dataForm.startPort = item
          }
        })
        setTimeout(() => {
          this.selectTo.loading = false
          getToPort(this.dataForm.startPort, this.dataForm.authorization, query).then(response => {
            this.selectTo.list = response.data.location || []
            this.selectTo.options = this.selectTo.list
          })
        }, 100)
      } else {
        this.selectTo.options = []
      }
    },
    notifyMethod (query) {
      if (query !== '') {
        this.selectNotify.loading = true
        setTimeout(() => {
          this.selectNotify.loading = false
          getAddress(this.dataForm.authorization, query).then(response => {
            this.selectNotify.list = response.data.address || []
            this.selectNotify.options = this.selectNotify.list
          })
        }, 100)
      } else {
        this.selectNotify.options = []
      }
    },
    consigneeMethod (query) {
      if (query !== '') {
        this.selectConsignee.loading = true
        setTimeout(() => {
          this.selectConsignee.loading = false
          getAddress(this.dataForm.authorization, query).then(response => {
            this.selectConsignee.list = response.data.address || []
            this.selectConsignee.options = this.selectConsignee.list
          })
        }, 100)
      } else {
        this.selectConsignee.options = []
      }
    },
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
        // 吧查询回来的Params放回内层dialog框
        // console.log('1111', res.data.params)
        // const temp = JSON.parse(res.data.params)
        this.form = JSON.parse(res.data.params)
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
          tag: 'one',
          data: JSON.stringify(this.dataForm)
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/sys/schedule', formMap).then(({ data: res }) => {
          if (res.code !== 0) {
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
        }).catch(() => {
        })
      })
    }, 1000, { leading: true, trailing: false })
  }
}
</script>
