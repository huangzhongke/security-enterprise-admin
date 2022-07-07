<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-activiti__process">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.processDefinitionId" :placeholder="$t('process.name')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="businessKey" :label="$t('process.businessKey')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="processInstanceId" :label="$t('running.id')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="processDefinitionName" :label="$t('process.processDefinitionName')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="processDefinitionVersion" :label="$t('process.processDefinitionVersion')" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="startUserName" :label="$t('process.startUserId')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="startTime" :label="$t('process.startTime')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="endTime" :label="$t('process.endTime')" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDetail(scope.row)">{{ $t('process.viewFlowImage') }}</el-button>
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
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import processModule from '@/mixins/process-module'
export default {
  mixins: [mixinViewModule, processModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/act/his/getMyHandledInstancePage',
        getDataListIsPage: true,
        deleteIsBatch: true,
        deleteIsBatchKey: 'deploymentId'
      },
      dataForm: {
        processDefinitionId: ''
      }
    }
  },
  components: {
  },
  methods: {
    showDetail (row) {
      if (!row.businessKey) {
        return this.$message.error(this.$t('task.detailError'))
      }
      this.getProcDefRouteSet(row, this.forwardDetail)
    }
  }
}
</script>
