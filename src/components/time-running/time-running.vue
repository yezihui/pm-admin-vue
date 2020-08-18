<template>
  <span>{{showTime}}</span>
</template>
<style lang="less" scoped>
  
</style>
<script>
export default {
  name: 'time-running',
  components: {},
  props: {
    runtime: {
      type: [Number, String, Object],
      default() {
        return {
          qaNum: 0,
          textNum: 0,
          timeRemaining: 0
        }
      }
    }
  },
  data () {
    return {
      timer: 0,
      time: this.runtime.timeRemaining,
      showTime: '剩余时间：00:00:00'
    }
  },
  watch: {
    time(v) {
      this.timeCalc(v);
    }
  },
  mounted() {
    if (this.runtime.qaNum != 0 || this.runtime.textNum != 0) {
      this.timeRunning()
    } else {
      this.showTime = '暂无订单需处理'
    }
  },
  methods: {
    timeCalc(time) {
      this.showTime = this.formatSeconds(time);
    },
    timeRunning() {
      this.timer = setInterval(() => {
        this.time = this.time - 1;
        // if (this.time <= 0) clearInterval(this.timer)
      }, 1000);
    },
    formatSeconds(value) {
      let theTime = Math.abs(value); // 秒
      let middle = 0; // 分
      let hour = 0; // 小时
      let d = 0; // 天
      let result = '';
      if (theTime > 60) {
        middle = parseInt(theTime / 60);

        theTime = parseInt(theTime % 60);
        if (middle > 60) {
          hour = parseInt(middle / 60);
          middle = parseInt(middle % 60);
          if (hour > 24) {
            d = parseInt(hour / 24)
            hour = hour % 24
          }
        }
      }
      result =
        (d > 0 ? (d + '天 ') : '') +
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (middle < 10 ? '0' + middle : middle) +
        ':' +
        (theTime < 10 ? '0' + theTime : theTime);
      let txt = value >= 0 ? '剩余时间：' + result : '超过时间：' + result;
      return txt;
    }
  }
}
</script>
