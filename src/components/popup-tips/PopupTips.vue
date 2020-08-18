<template>
  <div class="tips-box animated fadeIn" ref="tipsBox" :style="style" v-show="isShow">
    <Icon class="tip-close" type="ios-close" @click="hide" />
    <h2 class="tips-title">{{options.title}}</h2>
    <ul class="clr">
      <li class="tips-item" v-for="(item,index) in options.list" :key="index">{{item}}</li>
    </ul>
  </div>
</template>
<style lang="less" scoped>
.tips-box {
  box-shadow: 0px 2px 4px #eeeeee;
  border-radius: 4px;
  overflow: hidden;
  position: fixed;
  background-color: #fff;
  padding: 15px;
}
.tip-close {
  position: absolute;
  font-size: 24px;
  cursor: pointer;
  right: 5px;
  top: 5px;
}
ul{
  margin-top: 10px;
}
ul,
li {
  list-style: none;
}
.tips-item {
  padding: 2px 0px;
}
</style>
<script>
export default {
  name: 'PopupTips',
  components: {},
  props: {
    options: {
      type: [Object, String],
      default() {
        return {
          title: '提示',
          list: []
        };
      }
    },
    elX: {
      type: [Number, String],
      default: 0
    },
    elY: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      elH: 0,
      elW: 0,
      isShow: false
    };
  },
  created() {},
  mounted() {},
  computed: {
    style() {
      let x = this.elX - this.elW - 5
      let y = this.elY
      let stly = `left:${x}px;top:${y}px`;
      return stly;
    }
  },
  watch: {},
  methods: {
    calcWH() {
      this.$nextTick(v => {
        this.elW = this.$refs.tipsBox.clientWidth;
        this.elH = this.$refs.tipsBox.clientHeight;
      });
    },
    show() {
      this.isShow = true;
      this.calcWH();
    },
    hide() {
      this.isShow = false;
    }
  }
};
</script>
