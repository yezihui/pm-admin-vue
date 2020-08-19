<template>
  <div>
    <Card>
      <!--搜索表单-->
      <i-form ref="searchForm" :model="searchForm" inline>
        <form-item prop="loginName">
          <i-input type="text" v-model="searchForm.loginName" placeholder="请输入...">
            <span slot="prepend">用户名</span>
          </i-input>
        </form-item>
        <form-item prop="isEnabled">
          <i-select v-model="searchForm.isEnabled" style="width:200px" placeholder="状态">
            <Option value="-1">全部</Option>
            <Option value="1">启用</Option>
            <Option value="0">禁用</Option>
          </i-select>
        </form-item>
        <form-item>
          <row>
            <i-col span="12" prop="createTime">
              <DatePicker v-model="searchForm.createTime" :editable="false" confirm type="daterange"
                          :start-date="new Date()"
                          placement="bottom-end" placeholder="创建时间" style="width: 200px"></DatePicker>
            </i-col>
          </row>
        </form-item>
        <form-item>
          <Button type="primary" @click="handleSearch">搜索</Button>
        </form-item>
        <form-item>
          <Button type="error" @click="handleResetSearch('searchForm')">重置</Button>
        </form-item>
      </i-form>
      <!--按钮-->
      <add-modal
        :visible="visibleAddModal"
        @on-success="handleModalSuccess"
        @cancel="fnCloseModal"/>

      <update-modal
        :visible="visibleEditModal"
        :delivery-param="editRow"
        @on-success="handleModalSuccess"
        @cancel="fnCloseModal"/>

      <allot-role-modal
        :visible="visibleAllotModal"
        :delivery-param="editRow"
        @on-success="handleModalSuccess"
        @cancel="fnCloseModal"/>

      <update-pwd-modal
        :visible="visibleUpdatePwdModal"
        :delivery-param="editRow"
        @on-success="handleModalSuccess"
        @cancel="fnCloseModal"/>

      <Button type="primary" @click="fnShowAddModal">新增用户</Button>
      <Button style="margin: 10px 5px;" type="info" @click="handleRefreshTable">刷新</Button>
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
  
  import {deleteUserById, userPage} from '@/api/system/user'
  import addModal from './add'
  import updateModal from './update'
  import allotRoleModal from './allot-role'
  import UpdatePwdModal from './update-pwd'

  export default {
    name: 'user-manage',
    components: {
      addModal,
      updateModal,
      allotRoleModal,
      UpdatePwdModal
    },
    data() {
      return {
        visibleUpdatePwdModal: false,
        visibleAddModal: false,
        visibleEditModal: false,
        visibleAllotModal: false,
        editRow: {
          id: ''
        },
        operators: [],
        // 是否刷新表格，用于操作表格数据后刷新表格条件
        reloadTable: false,
        tableLoading: false,
        // 搜索表单
        searchForm: {
          loginName: '',
          isEnabled: '',
          createTime: []
        },
        pageSizeOpts: [5, 10, 20, 50],
        // 分页请求
        pageRequest: {
          pageNo: 1,
          pageSize: 10,
          sort: ['desc'],
          orderField: ['updateTime'],
          condition: {
            loginName: '',
            isEnabled: '',
            createTimeBegin: '',
            createTimeEnd: ''
          }
        },
        // 分页信息
        pageInfo: {
          total: 0,
          current: 1,
          records: []
        },
        // 表格列
        tableColumns: [
          {
            title: '用户名',
            key: 'loginName',
            align: 'center',
            width: 150
          },
          {
            title: '昵称',
            key: 'nickName',
            align: 'center',
            minWidth: 150
          },
          {
            title: '状态',
            key: 'isEnabled',
            align: 'center',
            width: 130,
            render: (h, params) => {
              let statusText = params.row.isEnabled ? '启用' : '禁用'
              let statusColor = params.row.isEnabled ? 'success' : 'error'
              return h('Tag', {
                props: {
                  color: statusColor
                }
              }, statusText)
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable: true,
            width: 200
          },
          {
            title: '更新时间',
            key: 'updateTime',
            sortable: true,
            sortType: 'desc',
            width: 200
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 300,
            fixed: 'right',
            render: this.fnRenderTableOperation
          }
        ]
      }
    },
    methods: {
      // 过滤搜索表单条件
      fnFilterSearchCondition() {
        this.pageRequest.condition.loginName = this.searchForm.loginName
        this.pageRequest.condition.isEnabled = this.searchForm.isEnabled
        if (this.searchForm.createTime) {
          const beginDate = !this.searchForm.createTime[0] ? '' : this.$moment(new Date(this.searchForm.createTime[0])).format('YYYY-MM-DD')
          const endDate = !this.searchForm.createTime[1] ? '' : this.$moment(new Date(this.searchForm.createTime[1])).format('YYYY-MM-DD')
          this.pageRequest.condition.createTimeBegin = beginDate
          this.pageRequest.condition.createTimeEnd = endDate
        }
      },
      // 搜索
      handleSearch() {
        this.pageRequest.pageNo = 1
        this.reloadTable = true
      },
      // 重置按钮
      handleResetSearch(form) {
        this.$refs[form].resetFields()
        this.searchForm.createTime = []
        this.pageRequest.pageNo = 1
        // 刷新表格
        this.reloadTable = true
      },
      // 刷新
      handleRefreshTable() {
        this.pageRequest.pageNo = 1
        this.reloadTable = true
      },
      // 重载表格
      fnReloadTable() {
        this.fnFilterSearchCondition()
        this.tableLoading = true
        this.fnInitData()
      },
      fnInitData() {
        userPage(this.pageRequest).then(res => {
          const data = res.data.data
          this.pageInfo.records = data.records
          this.pageInfo.current = data.pageNum
          this.pageInfo.total = data.total
          // 还原表格刷新状态
          this.reloadTable = false
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      // 排序
      fnSort(table) {
        let order = table.order
        if (order === 'asc' || order === 'desc') {
          this.pageRequest.sort[0] = order
          this.pageRequest.orderField[0] = table.key
          this.pageRequest.pageNo = 1
          this.reloadTable = true
        }
      },
      // 分页事件
      fnChangePage(page) {
        this.pageRequest.pageNo = page
        // 刷新表格
        this.reloadTable = true
      },
      fnPageSizeChange(size) {
        this.pageRequest.pageSize = size
        // 刷新表格
        this.reloadTable = true
      },
      // 新增弹框
      fnShowAddModal() {
        this.visibleAddModal = true
      },
      // 编辑弹框
      fnShowEditModal(id) {
        this.visibleEditModal = true
        this.editRow.id = id
      },
      // 分配角色弹框
      fnShowAllotModal(id) {
        this.visibleAllotModal = true
        this.editRow.id = id
      },
      // 修改密码弹框
      fnShowUpdatePwdModal(id) {
        this.visibleUpdatePwdModal = true
        this.editRow.id = id
      },
      // 关闭弹框框
      fnCloseModal() {
        this.visibleAddModal = false
        this.visibleEditModal = false
        this.visibleAllotModal = false
        this.visibleUpdatePwdModal = false
      },
      // 弹框关闭，监控是否需要刷新表格
      handleModalSuccess() {
        // 更新操作成功回调,刷新数据
        this.$Message.success('操作成功')
        this.fnCloseModal()
        // 刷新表格
        this.reloadTable = true
      },
      // 删除按钮
      fnDel(id) {
        let vm = this
        this.$Modal.confirm({
          title: '操作确认',
          content: '此操作将无法恢复。是否继续删除?',
          onOk: function () {
            deleteUserById(id).then(() => {
              vm.$Message.success('删除成功')
              // 刷新表格
              vm.reloadTable = true
            })
          }
        })
      },
      fnRenderTableOperation(h, params) {
        let infoBtn = h('Button', {
          props: {
            type: 'text',
            size: 'small',
            disabled: false
          },
          class: 'table-col-ctlBtn',
          on: {
            click: () => {
              this.fnShowAllotModal(params.row.userId)
            }
          }
        }, '分配角色')
        let editBtn = h('Button', {
          props: {
            type: 'text',
            size: 'small',
            disabled: false
          },
          class: 'table-col-ctlBtn',
          on: {
            click: () => {
              this.fnShowEditModal(params.row.userId)
            }
          }
        }, '编辑')
        let resetBtn = h('Button', {
          props: {
            disabled: false,
            type: 'text',
            size: 'small'
          },
          class: 'table-col-ctlBtn',
          on: {
            click: () => {
              this.fnShowUpdatePwdModal(params.row.userId)
            }
          }
        }, '修改密码')
        let delBtn = h('Button', {
          props: {
            disabled: false,
            type: 'text',
            size: 'small'
          },
          class: 'table-col-ctlBtn',
          on: {
            click: () => {
              this.fnDel(params.row.userId)
            }
          }
        }, '删除')
        return h('div', [editBtn, resetBtn, delBtn])
      }
    },
    computed: {
      hasAddOperation() {
        return this.$hasOneOf(this.operators, ['user$add'])
      }
    },
    mounted() {
      // 获取本菜单权限列表
      this.operators = this.$store.state.user.activeMenuOperators
      // 实例完成后首先加载表格,配置notCache=true后，此页面需要缓存
      this.fnInitData()
    },
    watch: {
      reloadTable: function (val) {
        if (val) {
          this.fnReloadTable()
        }
      }
    }
  }
</script>
