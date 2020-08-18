<template>
  <div class="align-center">
    <span class="prefix">{{prefix}}</span>
    <Cascader :data="options" :placeholder="placeholder" v-model="selectedOptions" @on-change="onChange" :clearable="clearable" change-on-select :trigger="trigger"></Cascader>
  </div>
</template>
<style lang="less" scoped>
  .prefix{
    padding: 4px 7px;
    font-size: inherit;
    font-weight: normal;
    line-height: 22px;
    color: #515a6e;
    text-align: center;
    background-color: #f8f8f9;
    border: 1px solid #dcdee2;
    transform: translateX(2px);
  }
</style>
<script>
import { sourcelCrawlerArticle } from '@/api/cms/crawler';
export default {
  name: 'cascader-select',
  props: {
    placeholder: {
      type: String
    },
    value: {
      type: [String, Number, Array],
      default() {
        return []
      }
    },
    label: {
      type: [String, Number, Array],
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    },
    trigger: {
      default: 'click'
    },
    prefix: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: [],
      selectedOptions: this.value
    };
  },
  mounted() {
    console.log('sourcelCrawlerArticle');
    
    sourcelCrawlerArticle().then(res => {
      let _res = res.data;
      if (res.status === 200 && _res.code === 200) {
        let opdata = []

        // _res.data.map(v => {
        //   let obj = {
        //     value: v.siteCode,
        //     label: v.siteName,
        //     children: []
        //   }
        //   v.columnList.map(v => {
        //     let obj1 = {
        //       value: v.columnCode,
        //       label: v.columnName
        //     }
        //     obj.children.push(obj1)
        //   })
        //   opdata.push(obj)
        // })
        this.options = _res.data;
        // console.log(this.options);
      } else {
        this.$Message.error(_res.message);
      }
    });
  },
  watch: {
    value(val) {
      this.selectedOptions = val;
    }
  },
  methods: {
    clearSelect() {
      this.$refs.sourceSelect.clearSingleSelect();
    },
    onChange(val) {
      // this.$emit('input', this.selectedOptions);
      this.$emit('on-change', val);
    }
  }
};
</script>
