<template>
  <div style="margin: 10px;overflow: hidden">
    <div style="float: right;">
      <Page
        show-total
        show-sizer
        show-elevator
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
</template>
<style lang="less" scoped>
</style>
<script>
import { tableMixin } from '@/mixins';
export default {
  name: 'Pagination',
  components: {},
  mixins: [tableMixin],
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {}
};
</script>
