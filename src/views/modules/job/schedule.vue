<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-job__schedule">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.beanName" :placeholder="$t('schedule.beanName')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="pauseHandle()">{{ $t('schedule.pauseBatch') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="resumeHandle()">{{ $t('schedule.resumeBatch') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="runHandle()">{{ $t('schedule.runBatch') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="logHandle()">{{ $t('schedule.log') }}</el-button>
        </el-form-item>
        <el-form-item v-if="this.$route.params.crawlerType != 'monitor'">
          <el-button type="success" @click="orderHandle()">{{ $t('下单列表') }}</el-button>
        </el-form-item>
        <el-form-item v-if="showOrderList">
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
          v-loading="dataListLoading"
          :data="temp"
          border
          @selection-change="dataListSelectionChangeHandle"
          @sort-change="dataListSortChangeHandle"
          style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="beanName" :label="$t('schedule.beanName')" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="params" :label="$t('schedule.params')" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="cronExpression" :label="$t('schedule.cronExpression')" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="remark" :label="$t('schedule.remark')" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="status" :label="$t('schedule.status')" sortable="custom" header-align="center"
                         align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" size="small">{{ $t('schedule.status1') }}</el-tag>
            <el-tag v-else size="small" type="danger">{{ $t('schedule.status0') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button type="text" size="small" @click="pauseHandle(scope.row.id)">{{
                $t('schedule.pause')
              }}
            </el-button>
            <el-button type="text" size="small" @click="resumeHandle(scope.row.id)">{{
                $t('schedule.resume')
              }}
            </el-button>
            <el-button type="text" size="small" @click="runHandle(scope.row.id)">{{ $t('schedule.run') }}</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <add-or-update-one v-if="oneVisible" ref="addOrUpdateOne" @refreshDataList="getDataList"></add-or-update-one>
      <add-or-update-oocl v-if="ooclVisible" ref="addOrUpdateOocl" @refreshDataList="getDataList"></add-or-update-oocl>
      <add-or-update-cosco v-if="coscoVisible" ref="addOrUpdateCosco"
                           @refreshDataList="getDataList"></add-or-update-cosco>
      <add-or-update-monitor v-if="monitorVisible" ref="addOrUpdateMonitor"
                             @refreshDataList="getDataList"></add-or-update-monitor>
      <add-or-update-cma v-if="cmaVisible" ref="addOrUpdateCma"  @refreshDataList="getDataList"></add-or-update-cma>
      <add-or-update-collectors v-if="collectorsVisible" ref="addOrUpdateCollectors"  @refreshDataList="getDataList"></add-or-update-collectors>
      <!-- 弹窗, 日志列表 -->
      <log v-if="logVisible" ref="log"></log>
      <OneOrder v-if="orderVisible" ref="order"></OneOrder>
      <CoscoOoclOrder v-if="coscoOoclOrderVisible" ref="tOrder"></CoscoOoclOrder>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdateOne from './schedule-add-or-update-one'
import AddOrUpdateOocl from './schedule-add-or-update-oocl'
import AddOrUpdateCosco from './schedule-add-or-update-cosco'
import AddOrUpdateMonitor from './schedule-add-or-update-monitor'
import AddOrUpdateCma from './schedule-add-or-update-cma'
import Log from './schedule-log'
import OneOrder from './schedule-order-one'
import CoscoOoclOrder from './schedule-order-cosco-oocl'
import AddOrUpdateCollectors from '@/views/modules/job/schedule-add-or-update-collectors'

export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/schedule/page',
        getDataListIsPage: true,
        deleteURL: '/sys/schedule',
        deleteIsBatch: true,
        exportURL: '/sys/schedule/order/export'
      },
      dataForm: {
        beanName: '',
        type: this.getType()
      },
      logVisible: false,
      orderVisible: false,
      oneVisible: false,
      ooclVisible: false,
      coscoVisible: false,
      monitorVisible: false,
      cmaVisible: false,
      collectorsVisible: false,
      showOrderList: false,
      coscoOoclOrderVisible: false
    }
  },
  beforeMount () {
    if (this.$route.params.crawlerType === 'one') {
      this.showOrderList = true
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    AddOrUpdateOne,
    Log,
    AddOrUpdateOocl,
    OneOrder,
    AddOrUpdateCosco,
    AddOrUpdateMonitor,
    CoscoOoclOrder,
    AddOrUpdateCma,
    AddOrUpdateCollectors
  },
  methods: {
    // 暂停
    pauseHandle (id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { handle: this.$t('schedule.pause') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.put('/sys/schedule/pause', id ? [id] : this.dataListSelections.map(item => item.id)).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    // 恢复
    resumeHandle (id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { handle: this.$t('schedule.resume') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.put('/sys/schedule/resume', id ? [id] : this.dataListSelections.map(item => item.id)).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    // 执行
    runHandle (id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { handle: this.$t('schedule.run') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.put('/sys/schedule/run', id ? [id] : this.dataListSelections.map(item => item.id)).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      if (this.$route.params.crawlerType === 'one') {
        this.oneVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateOne.dataForm.id = id
          this.$refs.addOrUpdateOne.init()
        })
      } else if (this.$route.params.crawlerType === 'oocl') {
        this.ooclVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateOocl.dataForm.id = id
          this.$refs.addOrUpdateOocl.init()
        })
      } else if (this.$route.params.crawlerType === 'cosco') {
        this.coscoVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateCosco.dataForm.id = id
          this.$refs.addOrUpdateCosco.init()
        })
      } else if (this.$route.params.crawlerType === 'monitor') {
        this.monitorVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateMonitor.dataForm.id = id
          this.$refs.addOrUpdateMonitor.init()
        })
      } else if (this.$route.params.crawlerType === 'cma') {
        this.cmaVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateCma.dataForm.id = id
          this.$refs.addOrUpdateCma.init()
        })
      } else if (this.$route.params.crawlerType === 'all') {
        this.collectorsVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateCollectors.dataForm.id = id
          this.$refs.addOrUpdateCollectors.init()
        })
      }
      // this.addOrUpdateVisible = true
    },
    // 日志列表
    logHandle () {
      this.logVisible = true
      this.$nextTick(() => {
        this.$refs.log.init()
      })
    },
    orderHandle () {
      if (this.$route.params.crawlerType === 'one') {
        this.orderVisible = true
        this.$nextTick(() => {
          this.$refs.order.init()
        })
      } else if (this.$route.params.crawlerType === 'cosco' || this.$route.params.crawlerType === 'oocl') {
        this.coscoOoclOrderVisible = true
        this.$nextTick(() => {
          this.$refs.tOrder.init()
        })
      }
    },
    getType () {
      if (this.$route.params.crawlerType === 'one') {
        return 0
      }
      if (this.$route.params.crawlerType === 'oocl') {
        return 1
      }
      if (this.$route.params.crawlerType === 'cosco') {
        return 2
      }
      if (this.$route.params.crawlerType === 'monitor') {
        return 3
      }
      if (this.$route.params.crawlerType === 'cma') {
        return 4
      }
      if (this.$route.params.crawlerType === 'all') {
        return 5
      }
    }
  }
}
</script>
