<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
             :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="起运港口" prop="originPort">
        <el-input v-model="dataForm.originPort" placeholder="起运港口"></el-input>
      </el-form-item>
      <el-form-item label="起运码头" prop="porFacilityName">
        <el-input v-model="dataForm.porFacilityName" placeholder="起运码头"></el-input>
      </el-form-item>
      <el-form-item label="船公司" prop="shipCompany">
        <el-input v-model="dataForm.shipCompany" placeholder="船公司"></el-input>
      </el-form-item>
      <el-form-item label="航线代码" prop="serviceCode">
        <el-input v-model="dataForm.serviceCode" placeholder="航线代码"></el-input>
      </el-form-item>
      <el-form-item label="目的港口" prop="destinationPort">
        <el-input v-model="dataForm.destinationPort" placeholder="目的港口"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="dataForm.stock" placeholder="库存"></el-input>
      </el-form-item>
      <el-form-item label="航程" prop="estimatedTransitTimeInDays">
        <el-input v-model="dataForm.estimatedTransitTimeInDays" placeholder="航程"></el-input>
      </el-form-item>
      <el-form-item label="有效开始日期" prop="effectiveStartDate">
        <el-input v-model="dataForm.effectiveStartDate" placeholder="有效开始日期"></el-input>
      </el-form-item>
      <el-form-item label="有效结束日期" prop="effectiveEndDate">
        <el-input v-model="dataForm.effectiveEndDate" placeholder="有效结束日期"></el-input>
      </el-form-item>
      <el-form-item label="箱型" prop="equipmentType">
        <el-input v-model="dataForm.equipmentType" placeholder="箱型"></el-input>
      </el-form-item>
      <el-form-item label="费用" prop="price">
        <el-input v-model="dataForm.price" placeholder="费用"></el-input>
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

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        originPort: '',
        porFacilityName: '',
        shipCompany: '',
        serviceCode: '',
        destinationPort: '',
        stock: '',
        estimatedTransitTimeInDays: '',
        effectiveStartDate: '',
        effectiveEndDate: '',
        equipmentType: '',
        price: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        originPort: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        porFacilityName: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        shipCompany: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        serviceCode: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        destinationPort: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        stock: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        estimatedTransitTimeInDays: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        // effectiveStartDate: [
        //   { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        // ],
        // effectiveEndDate: [
        //   { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        // ],
        equipmentType: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        price: [
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
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/crab/crawlerdata/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/crab/crawlerdata/', this.dataForm).then(({ data: res }) => {
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
    }, 1000, {
      'leading': true,
      'trailing': false
    })
  }
}
</script>
