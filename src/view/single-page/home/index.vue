<template>
  <div>
    首页
  </div>
</template>
<style lang="less" scoped>
  .numFont{
    margin-left:20px;
    font-size:40px;
    color: red;
  }
</style>
<script>
export default {
  name: 'home',
  data() {
    return {
      actData: {},
      actData1: {}
    }
  },
  methods: {
    handleTo(name) {
      this.$router.push({name})
    }
  }
};
</script>
<style>
</style>
