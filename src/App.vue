<template>
  <div id="app">
    <keep-alive :exclude="['add-article']">
      <router-view v-if="isRouterAlive" />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reloadPage: this.reloadPage
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reloadPage() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true
      });
    }
  }
};
</script>

<style lang="less">
@import "./assets/css/common.css";
@import "./assets/css/theme.less";
.size {
  width: 100%;
  height: 100%;
}

html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

#app {
  .size;
}
</style>
