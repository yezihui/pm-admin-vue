<template>
  <Dropdown @on-click="onClick">
      <div class="warning cursor-p">
          {{themeList[seletedItem].name}}
         <Icon :size="18" type="md-arrow-dropdown"></Icon>
      </div>
      <DropdownMenu slot="list">
          <DropdownItem v-for="item in themeList" :name="item.value" :key="item.value" :selected="seletedItem===item.value">{{item.name}}</DropdownItem>
      </DropdownMenu>
  </Dropdown>
</template>
<style lang="less" scoped>
</style>
<script>
export default {
  name: 'theme-change',
  components: {},
  props: {
    themeList: {
      type: Array,
      default() {
        return []
      }
    },
    seletedItem: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    onClick(e) {
      this.$emit('onClick', e)
    }
  }
};
</script>
