<template>
  <div>
    <Card>
      <p slot="title">纸张管理</p>
      <!--搜索表单-->
      <i-form ref="searchForm" :model="pageRequest.condition" inline>
        <form-item prop="paper">
          <i-input type="text" v-model="pageRequest.condition.paperName" placeholder="请输入...">
            <span slot="prepend">纸张名称</span>
          </i-input>
        </form-item>
        <form-item>
          <Button type="primary" @click="handleSearch">搜索</Button>
        </form-item>
        <form-item>
          <Button type="error" @click="handleResetSearch('searchForm')">重置</Button>
        </form-item>
      </i-form>

      <Button type="primary" style="margin: 0 0 10px 0" :disabled="!hasAddOperation" @click="createAddPage">新增纸张</Button>
      <Button type="error" style="margin: 0 0 10px 5px" :disabled="!hasDeleteOperation" @click="handleBatchDelete">批量删除</Button>
      <Button type="success" style="margin: 0 0 10px 5px" @click="handleRefreshCurrentTable">刷新当前页</Button>
      <Button type="info" style="margin: 0 0 10px 5px" @click="handleRefreshTable">刷新全部</Button>
      
      <!--按钮-->
      <add-modal :visible="visibleAddModal" @on-success="handleModalSuccess" @cancel="fnCloseModal"></add-modal>
      <update-modal
        :visible="visibleEditModal"
        :delivery-param="editRow"
        @on-success="handleModalSuccess"
        @cancel="fnCloseModal"/>
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

import {deletePaper, paperListPage} from '@/api/paper/paper'
import { bus } from '@/Bus/bus.js';
import addModal from './comp/add-paper/add-paper';
import updateModal from './comp/update-paper/update-paper';

export default {
  name: 'paper-manage',
  components: {
    addModal, updateModal
  },
  data () {
    return {
      operators: [],
      // 是否刷新表格，用于操作表格数据后刷新表格条件
      reloadTable: false,
      tableLoading: false,
      visibleAddModal: false,
      visibleEditModal: false,
      selectId: '0',
      pageSizeOpts: [5, 10, 20, 50],
      // 分页请求
      pageRequest: {
        pageNo: 1,
        pageSize: 10,
        sort: ['desc'],
        orderField: ['updateTime'],
        condition: {
          paperName: null
        }
      },
      editRow: {
        id: ''
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
          title: '纸种',
          key: 'paperType',
          align: 'center',
          width: 120
        },
        {
          title: '产品编号',
          key: 'paperNo',
          align: 'center',
          width: 180
        },
        {
          title: '产品名称',
          key: 'paperName',
          align: 'center',
          width: 180
        },
        {
          title: '克重',
          key: 'paperWeight',
          align: 'center',
          width: 140,
          sortable: true
        },
        {
          title: '产地',
          key: 'paperOrigin',
          align: 'center',
          width: 120
        },
        {
          title: '耐破指数',
          key: 'popStrength',
          align: 'center',
          width: 200
        }, 
        {
          title: '耐折强度',
          key: 'foldStrength',
          align: 'center',
          width: 100
        }, 
        {
          title: '环压指数',
          key: 'ringCrush',
          align: 'center',
          width: 190
        },
        {
          title: '水分',
          key: 'moisture',
          align: 'center',
          width: 100
        },
        {
          title: '价格',
          key: 'paperPrice',
          align: 'center',
          width: 150
        },
        {
          title: '更新时间',
          key: 'updateTime',
          sortable: true,
          sortType: 'desc',
          align: 'center',
          width: 170
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 150,
          fixed: 'right',
          render: this.fnRenderTableOperation
        }
      ]
    }
  },
  computed: {
    // 新增纸张权限
    hasAddOperation () {
      return true
    },
    // 删除纸张权限
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
    setDropList() {
      this.dropdownItems = [
        {
          value: 2,
          label: '删除纸张',
          disabled: false
        }
      ]
    },
    success() {
      this.reloadTable = true;
      this.cancel()
    },
    cancel() {
      this.showResetPhone = false
    },
    createAddPage () {
       this.visibleAddModal = true;
    },
    // 编辑弹框
    fnShowEditModal(id) {
      this.visibleEditModal = true
      this.editRow.id = id
    },
    // 关闭弹框框
    fnCloseModal() {
      this.visibleAddModal = false;
      this.visibleEditModal = false;
    },
    // 弹框关闭，监控是否需要刷新表格
    handleModalSuccess() {
      // 更新操作成功回调,刷新数据
      this.$Message.success('操作成功');
      this.fnCloseModal();
      // 刷新表格
      this.reloadTable = true;
    },
    // 搜索
    handleSearch () {
      this.pageRequest.pageNo = 1
      this.reloadTable = true
    },
    // 重置按钮
    handleResetSearch (form) {
      this.pageRequest.condition.paperName = '';
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
      paperListPage(this.pageRequest).then(res => {
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
    fnRenderTableOperation(h, params) {
      let editBtn = h('Button', {
        props: {
          type: 'text',
          size: 'small'
        },
        class: 'table-col-ctlBtn',
        on: {
          click: () => {
            this.fnShowEditModal(params.row.id)
          }
        }
      }, '编辑')
      let delBtn = h('Button', {
        props: {
          type: 'text',
          size: 'small'
        },
        class: 'table-col-ctlBtn',
        on: {
          click: () => {
            this.fnDel(params.row.id)
          }
        }
      }, '删除')
      return h('div', [editBtn, delBtn])
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
    },
    // 批量删除
    handleBatchDelete () {
      const selections = this.$refs.dataTable.getSelection()
      if (selections.length > 0) {
        const ids = []
        selections.forEach(item => {
          ids.push(item.id)
        })
        this.$Modal.confirm({
          content: '确认批量删除所选纸张吗?',
          onOk: () => {
            deletePaper(ids).then(() => {
              this.$Message.success('删除成功')
              // 刷新表格
              this.reloadTable = true
            })
          }
        })
      } else {
        this.$Message.warning('您未选择操作行')
      }
    },
    // 删除按钮
    fnDel(id) {
      let vm = this
      this.$Modal.confirm({
        title: '操作确认',
        content: '此操作将无法恢复。是否继续删除?',
        onOk: function () {
          const ids = []
          ids.push(id)
          deletePaper(ids).then(() => {
            vm.$Message.success('删除成功')
            // 刷新表格
            vm.reloadTable = true
          })
        }
      })
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
