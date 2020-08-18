// table列表请求相关
import { bus } from '@/Bus/bus.js';
import { mapMutations } from 'vuex';
export const tableMixin = {
  components: {},
  data() {
    return {
      // 是否刷新表格，用于操作表格数据后刷新表格条件
      tableApi: '',
      reloadTable: false,
      tableLoading: false,
      selections: [],
      pageSizeOpts: [5, 10, 20, 50],
      // 分页请求
      pageRequest: {
        pageNo: 1,
        pageSize: 10,
        sort: [],
        orderField: [],
        condition: {}
      },
      sort: [],
      orderField: [],
      condition: {},
      // 分页信息
      pageInfo: {
        total: 0,
        current: 1,
        records: []
      },
      operators: [],
      resData: {}
    }
  },
  created() {
    this.initCondition()
  },
  watch: {
    reloadTable(val) {
      if (val) {
        this.initCondition()
        this.fnRefreshTable();
      }
    }
  },
  computed: {
    isSeleteds() {
      return this.selections.length == 0 
    }
  },
  mounted() {
    console.log('mi mounted');
    this.operators = this.$store.state.user.activeMenuOperators;
    // 实例完成后首先加载表格,配置notCache=true后，此页面需要缓存
    this.doGetList();
  },
  methods: {
    ...mapMutations(['closeTag']),
    initCondition() {
      let pageRequest = this.pageRequest
      pageRequest.condition = this.condition
      pageRequest.sort = this.sort
      pageRequest.orderField = this.orderField
      this.pageRequest = pageRequest
    },
    // 请求前做一些数据处理
    beforeInitTable() {
      return true
    },
    // 渲染表格前要做的数据处理
    beforeRenderTable(data) {
      return true
    },
    async doGetList() {
      if (!this.tableApi) return
      if (!await this.beforeInitTable()) {
        return false
      }
      this.tableLoading = true;
      let id = this.id || 0
      this.tableApi(this.pageRequest, id)
        .then(res => {
          let data = res.data.data;
          // 如果需要渲染数据前做一些数据处理
          if (!this.beforeRenderTable(res.data)) {
            this.pageInfo.records = this.resData.data.records ? this.resData.data.records : [];
          } else {
            this.pageInfo.records = data.records;
          }
          this.pageInfo.current = data.pageNum;
          this.pageInfo.total = data.total;
          // 还原表格刷新状态
          this.reloadTable = false;
          this.tableLoading = false;
        }).then(() => {
          this.afterRenderTable()
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    afterRenderTable() {
      console.log('afterRenderTable');
      return true
    },
    selectionChange(v) {
      this.selections = v
    },
    // 重置表格:对应刷新全部按钮
    fnReloadTable() {
      this.pageRequest.pageNo = 1;
      this.reloadTable = true
    },
    // 刷新表格，只是刷新当前页
    fnRefreshTable() {
      this.doGetList()
    },
    beforeFnSearchReset() {
      return true
    },
    // 重置按钮
    fnSearchReset(formRef) {
      this.$refs[formRef].resetFields();
      // 刷新表格
      if (!this.beforeFnSearchReset()) {
        return false
      }
      this.fnReloadTable()
    },
    // 排序
    fnSort(table) {
      let order = table.order;
      if (order === 'asc' || order === 'desc') {
        this.pageRequest.sort[0] = order;
        this.pageRequest.orderField[0] = table.key;
        this.pageRequest.pageNo = 1;
        this.reloadTable = true;
      }
    },
    // 分页事件
    fnChangePage(page) {
      this.pageRequest.pageNo = page;
      // 刷新表格
      this.reloadTable = true;
    },
    fnPageSizeChange(size) {
      this.pageRequest.pageSize = size;
      // 刷新表格
      this.reloadTable = true;
    },
    openPage(options) {
      const tagNavList = this.$store.state.app.tagNavList;
      let index = tagNavList.findIndex(item => item.name === options.name);
      if (index !== -1) {
        // this.$Message.warning('页面打开，请先关闭');
        // return
        let clodeTag = tagNavList[index]
        this.closeTag({name: clodeTag.name, params: clodeTag.params, query: clodeTag.query})
      }
      this.$nextTick(() => {
        setTimeout(() => {
          const route = {
            name: options.name,
            params: options.params ? options.params : {},
            query: options.query ? options.query : {}
          };
          this.$router.push(route);
        }, 300);
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
