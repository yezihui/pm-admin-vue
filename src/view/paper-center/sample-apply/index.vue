<template>
  <div>
    <Card>
      <p slot="title">抽样申请</p>
      <i-form ref="searchForm" :model="pageRequest.condition" inline>
        <form-item prop="phone">
          <i-input type="text" v-model="pageRequest.condition.phone" placeholder="请输入...">
            <span slot="prepend">手机号</span>
          </i-input>
        </form-item>
        <FormItem prop="status">
          <Select v-model="pageRequest.condition.status" style="width: 200px">
            <span slot="prefix" style="margin:0 10px;font-size: 12px">申请状态</span>
            <Option
              v-for="item in statusList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <form-item>
          <Button type="primary" @click="handleSearch">搜索</Button>
        </form-item>
        <form-item>
          <Button type="error" @click="handleResetSearch('searchForm')">重置</Button>
        </form-item>
      </i-form>
      
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
     <apply-model
      :visible="visibleAddModal"
      v-model="applyId"
      @confim="confim"
      @cancel="fnCloseModal"
    ></apply-model>
  </div>
</template>
<script>

import {sampleApplyListPage} from '@/api/paper/sampleApply'
import { bus } from '@/Bus/bus.js';
import ApplyModel from './comp/apply-model.vue';
export default {
  name: 'sample-apply',
  components: {
    ApplyModel
  },
  data () {
    return {
      applyId: 0,
      visibleAddModal: false,
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
          phone: null,
          status: null
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
          sortable: true,
          width: 180
        },
        {
          title: '纸种',
          key: 'paperType',
          sortable: true,
          align: 'center',
          width: 120
        },
        {
          title: '产品编号',
          key: 'paperNo',
          sortable: true,
          align: 'center',
          width: 180
        },
        {
          title: '产品名称',
          key: 'paperName',
          sortable: true,
          align: 'center',
          width: 180
        },
        {
          title: '取样信息',
          key: 'message',
          align: 'center',
          width: 420
        },
        {
          title: '取样状态',
          key: 'status',
          sortable: true,
          align: 'center',
          width: 180,
          render: (h, params) => {
            let text =
              params.row.status === 0
                ? '新申请'
                : params.row.status === 1
                ? '已拒绝'
                : '已办理';
            return h('div', {}, text);
          }
        },
        {
          title: '申请时间',
          key: 'createTime',
          sortable: true,
          sortType: 'desc',
          align: 'center',
          width: 170
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 100,
          fixed: 'right',
          render: this.fnRenderTableOperation
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
    },
    statusList() {
      return [{ value: 0, label: '新申请' }, { value: 1, label: '已拒绝' }, { value: 2, label: '已办理' }];
    }
  },
  mounted () {
    // 获取本菜单权限列表
    this.operators = [...this.$store.state.user.activeMenuOperators]
    // 实例完成后首先加载表格,配置notCache=true后，此页面需要缓存
    this.fnInitData()
  },
  watch: {
    reloadTable: function (val) {
      if (val) {
        this.fnReloadTable()
      }
    }
  },
  methods: {
    traceAddModal(id) {
      this.applyId = id;
      this.visibleAddModal = true;
    },
    success() {
      this.reloadTable = true;
      this.cancel()
    },
    cancel() {
      this.showResetPhone = false
    },
    confim() {
      // 刷新表格
      this.reloadTable = true;
      this.$Message.success('操作成功');
      this.fnCloseModal();
    },
    // 关闭弹框框
    fnCloseModal() {
      this.visibleAddModal = false;
    },
    fnRenderTableOperation(h, params) {
      let editBtn = h('Button', {
        props: {
          type: 'text',
          size: 'small'
        },
        class: 'table-col-ctlBtn',
        on: {
          click: () => {
            this.traceAddModal(params.row.id)
          }
        }
      }, '回访')
      return h('div', [editBtn])
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
