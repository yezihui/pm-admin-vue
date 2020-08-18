<template>
  <div>
    <Select
      ref="dictSelect"
      label-in-value
      :placeholder="placeholder"
      :multiple="multiple"
      :disabled="disabled"
      :clearable="clearable"
      v-model="selectedOptions"
      @on-change="onChange">
      <span v-show="prefix !== ''" slot="prefix" style="margin:0 10px;font-size: 12px">{{prefix}}</span>
      <Option v-for="item in options" :value="item.code" :key="item.code">{{ item.name }}</Option>
    </Select>
  </diV>
</template>

<script>

export default {
  name: 'DictSelect',
  props: {
    // 字典编码，字符串
    dictGroupCode: {
      type: String,
      default: ''
    },
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
  data () {
    return {
      options: [],
      selectedOptions: this.value
    }
  },
  computed: {},
  methods: {
    clearSelect () {
      this.$refs.dictSelect.clearSingleSelect()
    },
    onChange (val) {
      this.$emit('input', this.selectedOptions)
      this.$emit('on-change', val)
    }
  },
  mounted () {
    const dictList = this.$store.state.user.dictList
    if (!dictList && dictList.length > 0) {
      this.$Message.error('无法获取字典信息,请重新刷新页面')
      return
    }
    let index = dictList.findIndex(item => item.code === this.dictGroupCode)
    if (index !== -1) {
      this.$nextTick(() => {
        this.options = dictList[index].children
      })
    }
  },
  watch: {
    value (val) {
      this.selectedOptions = val
    }
  }
}
</script>
