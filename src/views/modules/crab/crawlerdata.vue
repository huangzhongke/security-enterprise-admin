<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-crab__crawlerdata}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.id" placeholder="id" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('crab:crawlerdata:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('crab:crawlerdata:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('crab:crawlerdata:export')" type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="originPort" label="起运港口" header-align="center" align="center"></el-table-column>
        <el-table-column prop="porFacilityName" label="起运码头" header-align="center" align="center"></el-table-column>
        <el-table-column prop="shipCompany" label="船公司" header-align="center" align="center"></el-table-column>
        <el-table-column prop="serviceCode" label="航线代码" header-align="center" align="center"></el-table-column>
        <el-table-column prop="destinationPort" label="目的港口" header-align="center" align="center"></el-table-column>
        <el-table-column prop="stock" label="库存" header-align="center" align="center"></el-table-column>
        <el-table-column prop="estimatedTransitTimeInDays" label="航程" header-align="center" align="center"></el-table-column>
        <el-table-column prop="effectiveStartDate" label="有效开始日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="effectiveEndDate" label="有效结束日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="equipmentType" label="箱型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="price" label="费用" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('crab:crawlerdata:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('crab:crawlerdata:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
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
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './crawlerdata-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/crab/crawlerdata/page',
        getDataListIsPage: true,
        exportURL: '/crab/crawlerdata/export',
        deleteURL: '/crab/crawlerdata',
        deleteIsBatch: true
      },
      dataForm: {
        id: ''
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
