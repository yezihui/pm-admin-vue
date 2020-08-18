// auth

export const authMixin = {
  data() {
    return {
      operators: [],
      pageAuth: [],
      authCode: ''
    }
  },
  watch: {},
  mounted() {
    this.operators = this.$store.state.user.activeMenuOperators;
    if (this.authCode) {
      this.pageAuth = this.$pageUtil.menuOperators(this.authCode)
    }
  },
  methods: {}
}
