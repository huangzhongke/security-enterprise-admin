<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__correction}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="$hasPermission('activiti:correction:all')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('activiti:correction:all')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="instanceId" :label="$t('running.id')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="applyPost" :label="$t('correction.post')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="entryDate" :label="$t('correction.entryDate')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="correctionDate" :label="$t('correction.correctionDate')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="workContent" :label="$t('correction.workContent')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="achievement" :label="$t('correction.achievement')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" :label="$t('createDate')" header-align="center" align="center"></el-table-column>
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
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './correction-add-or-update'
// 引入工作流公共方法
import processModule from '@/mixins/process-module'
export default {
  // 注入公共方法
  mixins: [mixinViewModule, processModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/act/demo/correction/page',
        getDataListIsPage: true,
        exportURL: '/act/demo/correction/export',
        deleteURL: '/act/demo/correction',
        deleteIsBatch: true
      },
      dataForm: {
        id: ''
      },
      // 流程定义KEY
      procDefKey: 'correctionprocess'
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    // 查看流程处理详情
    showDetail (row) {
      if (!row.id) {
        return this.$message.error(this.$t('task.detailError'))
      }
      var params = {
        businessKey: row.id,
        procDefKey: this.procDefKey
      }
      this.getProcDefBizRouteAndProcessInstance(params, this.forwardDetail)
    }
  }
}
</script>
