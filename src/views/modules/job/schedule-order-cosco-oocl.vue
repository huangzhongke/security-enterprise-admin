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
      <el-table-column prop="beanName" :label="$t('网站')" header-align="center" align="left" width="80"></el-table-column>
      <el-table-column prop="startName" :label="$t('起始港口')" header-align="center" align="left"></el-table-column>
      <el-table-column prop="endName" :label="$t('目的港口')" header-align="center" align="left"></el-table-column>
      <el-table-column :formatter="formatterEquipment" prop="equipment" :label="$t('柜子类型')" header-align="center"
                       align="left"></el-table-column>
      <el-table-column prop="quantity" :label="$t('数量')" header-align="center" align="left"></el-table-column>
      <el-table-column prop="vesselName" :label="$t('航线名')" header-align="center" align="left"></el-table-column>
      <el-table-column prop="voyage" :label="$t('航次')" header-align="center" align="left"></el-table-column>
      <el-table-column prop="orderDate" :label="$t('下单时间')" header-align="center" align="left"></el-table-column>
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
  data () {
    return {
      visible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/order/coscoooclorder/page',
        getDataListIsPage: true
      },
      dataForm: {
        id: '',
        beanName: this.$route.params.crawlerType
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.getDataList()
    }
  }
}
</script>
