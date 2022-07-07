<template>
  <el-card shadow="never" class="aui-card--fill">
    <h4>{{ $t('process.flowImage') }}</h4>
    <img :src="getResourceURL()" class="image">
    <h4>{{ $t('process.circulation') }}</h4>
    <div class="mod-sys__dict">
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column prop="activityName"  :label="$t('process.taskName')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="assignee" :label="$t('process.assignee')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="startTime" :label="$t('task.startTime')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="endTime" :label="$t('task.endTime')"  header-align="center" align="center"></el-table-column>
        <el-table-column prop="comment" :label="$t('process.comment')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="durationInSeconds" :label="$t('task.durationInSeconds')" header-align="center" align="center" width="180"></el-table-column>
      </el-table>
      <el-pagination
        v-if="dataForm.pid === '0'"
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
<style scoped>
  .image {
    width: 60%;
    display: block;
    margin: 0 auto 30px auto;
  }
</style>

<script>
import Cookies from 'js-cookie'
import qs from 'qs'
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  name: 'RenProcessDetail',
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/act/his/getTaskHandleDetailInfo',
        getDataListIsPage: false,
        createdIsNeed: false,
        deleteIsBatch: true,
        deleteIsBatchKey: 'deploymentId'
      },
      dataForm: {
        processInstanceId: ''
      }
    }
  },
  created () {
    this.dataForm.processInstanceId = this.$route.params.processInstanceId
    this.getResourceURL()
    this.getDataList()
  },
  methods: {
    // 获取流程(xml/image)url地址
    getResourceURL () {
      const params = qs.stringify({
        token: Cookies.get('token'),
        processInstanceId: this.dataForm.processInstanceId
      })
      return `${window.SITE_CONFIG.apiURL}/act/his/getInstImage?${params}`
    }
  }
}
</script>
