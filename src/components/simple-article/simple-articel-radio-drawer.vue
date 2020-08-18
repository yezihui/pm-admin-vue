<template>
    <Drawer title="选择关联法规" :closable="false" v-model="visible" @on-close="handleClose" width="1000" :styles="styles">
      <Form ref="searchForm" :model="pageRequest.condition" inline class="arrowBoxRev">
        <FormItem prop="title" style="width: 400px">
          <Input v-model="pageRequest.condition.title" placeholder="标题">
            <span slot="prepend">标题</span>
          </Input>
        </FormItem>
        <FormItem prop="category">
          <i-select v-model="pageRequest.condition.category" style="width:200px">
            <span slot="prefix" style="margin:0 10px;font-size: 12px">分类</span>
            <Option v-for="item in categories" :key="item.id" :value="item.id">{{item.categoryName}}</Option>
          </i-select>
        </FormItem>
         <div>
          <FormItem prop="anyWritNo" style="width: 250px">
            <Input v-model="anyWritNo" placeholder="文号" @on-change="dismantling">
              <span slot="prepend">文号</span>
            </Input>
          </FormItem>
          <FormItem prop="writNo" style="width: 200px">
            <Input v-model="pageRequest.condition.writNo" placeholder="发文字号">
              <span slot="prepend">发文字号</span>
            </Input>
          </FormItem>
          <FormItem prop="year" style="width: 80px">
            <DatePicker
              :value="pageRequest.condition.year"
              type="year"
              placeholder="发文年号"
              :editable="true"
              style="width: 100%"
              @on-change="handleYearChange"
            ></DatePicker>
          </FormItem>
          <FormItem prop="writOrder">
            <InputNumber v-model="pageRequest.condition.writOrder" placeholder="发文序号">
              <span slot="prepend">发文序号</span>
            </InputNumber>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSearch">搜索</Button>
            <Button type="error" style="margin-left: 5px" @click="handleResetSearch('searchForm')">重置</Button>
          </FormItem>
        </div>
      </Form>
      <!--表格-->
      <Table
        class="export-list-table"
        border
        stripe
        ref="dataTable"
        :loading="tableLoading"
        :columns="tableColumns"
        :data="pageInfo.records"
      ></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            show-total
            show-sizer
            show-elevator
            stripe
            style="margin-bottom: 10px"
            :page-size="pageRequest.pageSize"
            :page-size-opts="pageSizeOpts"
            :total="pageInfo.total"
            :current="pageInfo.current"
            @on-change="fnChangePage"
            @on-page-size-change="fnPageSizeChange"
          ></Page>
        </div>
      </div>
      <div class="drawer-footer">
        <Button
          style="margin-right: 8px"
          type="primary"
          :loading="btnLoading"
          @click="handleSuccess"
        >确定</Button>
        <Button @click="handleClose">关闭</Button>
      </div>
    </Drawer>
</template>
<style lang="less" scoped>
.drawer-footer {
  width: 100%;
  border-top: 1px solid #e8e8e8;
  text-align: left;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  background: #fff;
  z-index: 2;
}
.export-list-table /deep/ .ivu-radio-wrapper {
    margin-right: 0px;
    .ivu-radio{
      margin-right: 0px;
    }
}
</style>
<script>
import { articleSimpleList, categories } from '@/api/cms/article';
import { parseWritNo } from '@/libs/util';
export default {
  name: 'simple-articel-radio-drawer',
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    seletedArticle: {
      type: [Array],
      default() {
        return []
      }
    }
  },
  data() {
    return {
      styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
      },
      currentid: null,
      currentRow: [],
      categories: [],
      H5URL: 'http://h5.webtax.com.cn/app/article/share/',
      visible: false,
      btnLoading: false,
      tableLoading: false,
      reloadTable: false,
      anyWritNo: null,
      pageSizeOpts: [5, 10, 20, 50],
      // 分页请求
      pageRequest: {
        pageNo: 1,
        pageSize: 10,
        sort: ['desc'],
        orderField: ['updateTime'],
        condition: {
          title: '',
          category: '',
          writNo: null,
          year: null,
          writOrder: null,
          status: null
        }
      },
      // 分页信息
      pageInfo: {
        total: 0,
        current: 1,
        records: []
      },
      tableColumns: [
        {
          title: '选择',
          key: 'id',
          width: 70,
          align: 'center',
          render: (h, params) => {
            let id = params.row.id;
            let flag = false;
            if (this.currentid === id) {
              flag = true;
            } else {
              flag = false;
            }
            let self = this;
            return h('div', [
              h('Radio', {
                props: {
                  value: flag
                },
                on: {
                  'on-change': () => {
                    self.currentid = params.row.id
                    self.currentRow = [params.row];
                  }
                }
              })
            ]);
          }
        },
        {
          title: '标题',
          key: 'articleTitle',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '文号',
          key: 'referenceNumber',
          align: 'center'
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 100,
          render: (h, params) => {
            let statusText = params.row.status ? '上线' : '已下线';
            let statusColor = params.row.status ? 'success' : 'error';
            return h(
              'Tag',
              {
                props: {
                  color: statusColor
                }
              },
              statusText
            );
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return h(
              'Button',
              {
                props: {
                  type: 'text',
                  size: 'small',
                  disabled: false
                },
                class: 'table-col-ctlBtn',
                on: {
                  click: () => {
                    if (params.row.status) {
                      window.open(this.H5URL + params.row.id);
                    }
                  }
                }
              },
              params.row.status ? '预览' : '-'
            );
          }
        }
      ]
    };
  },
  created() {
    let env = process.env.VUE_APP_CURRENTMODE
    console.log(env);
    if (env == 'dev') this.H5URL = 'http://192.168.1.202:9191/app/article/share/'
    if (env == 'test') this.H5URL = 'http://test.h5.webtax.com.cn/app/article/share/'
    if (env == 'prod') this.H5URL = 'http://h5.webtax.com.cn/app/article/share/'
    // this.H5URL = node
  },
  mounted() {
    this.fnGetCategory();
    this.fnInitData();
  },
  computed: {},
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.handleSearch()
      }
    },
    seletedArticle(v) {
      this.chooseData = v
    },
    reloadTable: function(val) {
      if (val) {
        this.fnReloadTable();
      }
    }
  },
  methods: {
    fnGetCategory() {
      let vm = this;
      categories().then(res => {
        vm.categories = res.data.data;
      });
    },
    handleYearChange(val) {
      if (val !== '') {
        this.pageRequest.condition.year = val;
      } else {
        this.pageRequest.condition.year = [];
      }
    },
    // 拆解文号
    dismantling() {
      if (!this.anyWritNo.trim()) return;
      this.pageRequest.condition.writNo =
        parseWritNo(this.anyWritNo).writNo || null;
      this.pageRequest.condition.writOrder =
        Number(parseWritNo(this.anyWritNo).writOrder) || null;
      this.pageRequest.condition.year =
        parseWritNo(this.anyWritNo).year || null;
    },
    handleSearch() {
      this.pageRequest.pageNo = 1;
      this.reloadTable = true;
    },
    handleResetSearch(form) {
      this.anyWritNo = ''
      this.$refs[form].resetFields();
      this.pageRequest.pageNo = 1;
      // 刷新表格
      this.reloadTable = true;
    },
    handleSuccess() {
      let vm = this;
      console.log(this.currentid);
      console.log(this.currentRow);
      if (!this.currentid) { 
        this.$Message.warning('您未选择关联法规'); 
        return
      }
      this.handleClose()
      this.$emit('confim', this.currentRow);
    },
    // end
    handleClose() {
      this.visible = false;
      this.$emit('input', false);
    },
    // 重载表格
    fnReloadTable() {
      this.fnInitData();
    },
    fnInitData() {
      this.tableLoading = true;
      articleSimpleList(this.pageRequest)
        .then(res => {
          const data = res.data.data;
          this.pageInfo.records = data.records;
          this.pageInfo.current = data.pageNum;
          this.pageInfo.total = data.total;
          // 还原表格刷新状态
          this.reloadTable = false;
          this.tableLoading = false;
          if (this.chooseData.length) {
            this.currentid = this.chooseData[0].id
            this.currentRow = this.chooseData
            console.log(this.currentid);
            console.log(this.currentRow);
          } else {
            // Object.assign(this.pageInfo.records[index], {_checked: false})
            this.currentid = null
            this.currentRow = []
          }
        })
        .catch(() => {
          this.reloadTable = false;
          this.tableLoading = false;
        });
    },
    // 当前选中的法规,checkbox
    fnFilterSelect () {
      for (let val of this.chooseData) {
        let index = this.pageInfo.records.findIndex(item => item.id === val)
        if (index !== -1) {
          Object.assign(this.pageInfo.records[index], {_checked: true})
        }
      }
    },
    // 分页事件
    fnChangePage(page) {
      this.pageRequest.pageNo = page;
      // 刷新表格
      this.reloadTable = true;
    },
    // 页数
    fnPageSizeChange(size) {
      this.pageRequest.pageSize = size;
      // 刷新表格
      this.reloadTable = true;
    }
  }
};
</script>
