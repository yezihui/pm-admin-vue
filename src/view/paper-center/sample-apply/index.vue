<template>
  <div>
    <Card>
      <p slot="title">抽样申请</p>
      <Button type="success" style="margin: 0 0 10px 5px" @click="handleRefreshCurrentTable">刷新当前页</Button>
      <Button type="info" style="margin: 0 0 10px 5px" @click="handleRefreshTable">刷新全部</Button>
      
      <!--表格-->
      <div v-if="true">
        <Table border stripe ref="dataTable"
               :loading="tableLoading"
               :columns="tableColumns"
               :data="pageInfo.records"
               @on-sort-change="fnSort"></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page show-total show-sizer show-elevator
                  :transfer="true"
                  style="margin-bottom: 10px"
                  :page-size="pageRequest.pageSize"
                  :page-size-opts="pageSizeOpts"
                  :total="pageInfo.total"
                  :current="pageInfo.current"
                  @on-change="fnChangePage"
                  @on-page-size-change="fnPageSizeChange"></Page>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>

import {sampleApplyListPage} from '@/api/paper/sampleApply'
import { bus } from '@/Bus/bus.js';
export default {
  name: 'sample-apply',
  components: {
  },
  data () {
    return {
      operators: [],
      // 是否刷新表格，用于操作表格数据后刷新表格条件
      reloadTable: false,
      tableLoading: false,
      selectId: '0',
      pageSizeOpts: [5, 10, 20, 50],
      // 分页请求
      pageRequest: {
        pageNo: 1,
        pageSize: 10,
        sort: ['desc'],
        orderField: ['id'],
        condition: {
          paperName: null
        }
      },
      // 分页信息
      pageInfo: {
        total: 0,
        current: 1,
        records: []
      },
      dropdownItems: [],
      // 表格列
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '手机号',
          key: 'phone',
          align: 'center',
          width: 180,
          sortable: true
        },
        {
          title: '申请信息',
          key: 'message',
          align: 'center',
          width: 1180
        },
        {
          title: '申请时间',
          key: 'createTime',
          sortable: true,
          sortType: 'desc',
          align: 'center',
          width: 170
        }
      ]
    }
  },
  computed: {
    // 新增项目权限
    hasAddOperation () {
      return true
    },
    // 删除项目权限
    hasDeleteOperation () {
      return true
    }
  },
  mounted () {
    // 获取本菜单权限列表
    this.operators = [...this.$store.state.user.activeMenuOperators]
    // 实例完成后首先加载表格,配置notCache=true后，此页面需要缓存
    this.fnInitData()
    this.setDropList()
  },
  watch: {
    reloadTable: function (val) {
      if (val) {
        this.fnReloadTable()
      }
    }
  },
  methods: {
    success() {
      this.reloadTable = true;
      this.cancel()
    },
    cancel() {
      this.showResetPhone = false
    },
    // 搜索
    handleSearch () {
      this.pageRequest.pageNo = 1
      this.reloadTable = true
    },
    // 重置按钮
    handleResetSearch (form) {
      this.$refs[form].resetFields()
      this.pageRequest.pageNo = 1
      // 刷新表格
      this.reloadTable = true
    },
    // 重载表格
    fnReloadTable () {
      this.fnInitData()
    },
    fnInitData () {
      this.tableLoading = true
      sampleApplyListPage(this.pageRequest).then(res => {
        const data = res.data.data
        this.pageInfo.records = data.records
        this.pageInfo.current = data.pageNum
        this.pageInfo.total = data.total
        this.tableLoading = false
        this.reloadTable = false
      }).catch(() => {
        this.tableLoading = false
        this.reloadTable = false
      })
    },
    // 排序
    fnSort (table) {
      let order = table.order
      if (order === 'asc' || order === 'desc') {
        this.pageRequest.sort[0] = order
        this.pageRequest.orderField[0] = table.key
        this.pageRequest.pageNo = 1
        this.reloadTable = true
      }
    },
    // 分页事件
    fnChangePage (page) {
      this.pageRequest.pageNo = page
      // 刷新表格
      this.reloadTable = true
    },
    // 页数
    fnPageSizeChange (size) {
      this.pageRequest.pageSize = size
      // 刷新表格
      this.reloadTable = true
    },
    // 刷新当前
    handleRefreshCurrentTable () {
      this.reloadTable = true
    },
    // 刷新全部
    handleRefreshTable () {
      this.pageRequest.pageNo = 1
      this.reloadTable = true
    }
  },
  activated() {
    bus.$on('reflashdata', val => {
      if (val) {
        this.reloadTable = val;
      }
    });
  }
}
</script>
