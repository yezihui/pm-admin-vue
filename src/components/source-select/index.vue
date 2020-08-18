<template>
  <div>
    <Select
      ref="sourceSelect"
      label-in-value
      :placeholder="placeholder"
      :multiple="multiple"
      :disabled="disabled"
      :clearable="clearable"
      v-model="selectedOptions"
      @on-change="onChange"
    >
      <span v-show="prefix !== ''" slot="prefix" style="margin:0 10px;font-size: 12px">{{prefix}}</span>
      <Option v-for="item in options" :value="item.siteCode" :key="item.id">{{ item.siteName }}</Option>
    </Select>
  </div>
</template>
<script>
import { sourcelCrawlerArticle } from '@/api/cms/crawler';
export default {
  name: 'SourceSelect',
  props: {
    placeholder: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array],
      default: ''
    },
    label: {
      type: [String, Number, Array],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
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
        this.options = _res.data;
        console.log(this.options);
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
      this.$emit('input', this.selectedOptions);
      this.$emit('on-change', val);
    }
  }
};
</script>
