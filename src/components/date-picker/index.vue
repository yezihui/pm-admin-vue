<template>
  <div class="date-picker-wrap">
    <div v-show="prefix !== ''" slot="prefix" class="prefix">{{prefix}}</div>
    <DatePicker
      type="daterange"
      :placeholder="placeholder"
      v-model="dateValue"
      :format="format"
      :show-week-numbers="showWeekNumbers"
      :start-date="startDate"
      :confirm="confirm"
      :size="size"
      :open="open"
      :disabled="disabled"
      :clearable="clearable"
      :editable="editable"
      :time-picker-options="timePickerOptions"
      :element-id="elementId"
      :readonly="readonly"
      :transfer="transfer"
      :separator="separator"
      :capture="capture"
      :shortcuts="shortcuts"
      :disabledDate="disabledDate"
      @on-change="onChange"
      @on-open-change="onOpenChange"
      @on-ok="onOk"
      @on-clear="onClear"
      @on-clickoutside="onClickoutside"
    ></DatePicker>
  </div>
</template>
<style lang="less" scoped>
.date-picker-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.date-picker-wrap /deep/ .ivu-date-picker {
  flex: 1;
}
.prefix {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid #ddd;
  height: 32px;
  line-height: 32px;
  transform: translateX(2px);
  background: #eee;
  padding: 0 10px;
  font-size: 12px;
}
</style>
<script>
//       :disabledDate="disabledDate"
export default {
  name: 'MydatePicker',
  components: {},
  props: {
    dateoption: {
      type: [Object, String],
      default: ''
    },
    prefix: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number, Date],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showWeekNumbers: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: Date,
      default: null
    },
    confirm: {
      type: Boolean,
      default: false
    },
    open: {
      type: Boolean,
      default: null
    },
    size: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    transfer: {
      type: Boolean,
      default: false
    },
    elementId: {
      type: String,
      default: ''
    },
    timePickerOptions: {
      type: Object,
      default() {
        return {};
      }
    },
    separator: {
      type: String,
      default: ''
    },
    capture: {
      type: Boolean,
      default: true
    },
    shortcuts: {
      type: Array,
      default() {
        return [];
      }
    },
    disabledDate: {
      type: Function
    }
  },
  data() {
    return {
      dateValue: this.value
    };
  },
  created() {},
  mounted() {
    console.log(this.dateoption);
  },
  computed: {},
  watch: {
    value(val) {
      console.log(val);

      this.dateValue = val;
    }
  },
  methods: {
    onChange(val) {
      this.$emit('input', this.dateValue);
      this.$emit('on-change', val);
    },
    onOpenChange(e) {
      this.$emit('on-open-change', e);
    },
    onOk(e) {
      this.$emit('on-ok', e);
    },
    onClear(e) {
      this.$emit('on-clear', e);
    },
    onClickoutside(e) {
      this.$emit('on-clickoutside', e);
    }
  }
};
</script>
