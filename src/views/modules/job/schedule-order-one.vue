<template>
  <el-dialog :visible.sync="visible" :title="$t('下单列表')" :close-on-click-modal="false" :close-on-press-escape="false"
             width="75%">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.id" :placeholder="$t('下单Id')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t('query') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @sort-change="dataListSortChangeHandle"
        height="460"
        style="width: 100%;"
    >
      <el-table-column prop="id" :label="$t('下单Id')" header-align="center" align="left" width="80"></el-table-column>
      <el-table-column prop="startPort" :label="$t('起始港口')" header-align="center" align="left"></el-table-column>
      <el-table-column prop="endPort" :label="$t('目的港口')" header-align="center" align="left"></el-table-column>
      <el-table-column :formatter="formatterEquipment" prop="equipment" :label="$t('柜子类型')" header-align="center"
                       align="left"></el-table-column>
      <el-table-column prop="quantity" :label="$t('数量')" header-align="center" align="left"></el-table-column>
      <el-table-column prop="orderSleepTime" :label="$t('休眠时间')" header-align="center" align="left"></el-table-column>
      <el-table-column prop="orderDate" :label="$t('下单时间')" header-align="center" align="left"></el-table-column>
      <el-table-column :formatter="formatterProxy" prop="isProxy" :label="$t('使用代理')" header-align="center"
                       align="left"></el-table-column>
      <el-table-column :formatter="formatterSupplierName" prop="isNeedSupplierName" :label="$t('是否指定供应商')"
                       header-align="center"
                       align="left"></el-table-column>
      <el-table-column :formatter="formatterLineName" prop="isNeedLineName" :label="$t('是否指定航名航次')"
                       header-align="center"
                       align="left"></el-table-column>
      <el-table-column prop="supplierName" :label="$t('供应商名')" header-align="center" align="left"></el-table-column>
      <el-table-column prop="vessel" :label="$t('航线名')" header-align="center" align="left"></el-table-column>
      <el-table-column prop="voyage" :label="$t('航次')" header-align="center" align="left"></el-table-column>
      <el-table-column :formatter="formatterAccount" prop="account" :label="$t('下单账号')" header-align="center"
                       align="left"></el-table-column>
      <el-table-column prop="etd" :label="$t('ETD')" header-align="center" align="left"></el-table-column>
      <el-table-column prop="reference" :label="$t('小提单号')" header-align="center" align="left"></el-table-column>
    </el-table>
    <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
    </el-pagination>
  </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'

export default {
  mixins: [mixinViewModule],
  data() {
    return {
      visible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/sys/schedule/order/page',
        getDataListIsPage: true
      },
      dataForm: {
        id: ''
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.getDataList()
    },
    formatterProxy(row, column) {
      if (row.isProxy === true) {
        return '是'
      } else {
        return '否'
      }
    },
    formatterSupplierName (row, column) {
      if (row.isNeedSupplierName === true) {
        return '是'
      } else {
        return '否'
      }
    },
    formatterLineName (row, column) {
      if (row.isNeedLineName === true) {
        return '是'
      } else {
        return '否'
      }
    },
    formatterAccount (row, column) {
      if (row.account === 0) {
        return '环集账号'
      } else if (column === 1) {
        return '泰博账号'
      } else if (column === 2) {
        return '环集附属账号'
      }
    },
    formatterEquipment (row, column) {
      if (row.equipment === '22G1') {
        return '20GP'
      } else if (row.equipment === '42G1') {
        return '40GP'
      } else if (row.equipment === '45G1') {
        return '40HQ'
      } else if (row.equipment === 'L5G1') {
        return '45HQ'
      } else if (row.equipment === '45RD') {
        return 'NOR'
      }
    }
  }
}
</script>
