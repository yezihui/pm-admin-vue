<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录怪村纸集后台管理系统" :bordered="false">
        <div class="form-con">
          <login-form ref="login" @on-success="handleSubmitCode"></login-form>
          <p class="login-tip">请输入账号、密码登录</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import LoginForm from '_c/login-form'
  import {mapActions} from 'vuex'

  export default {
    components: {
      LoginForm
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'handleCodeLogin',
        'getUserInfo',
        'getDictList'
      ]),
      // 根据账号和密码获取验证码
      handleSubmitCode({userName, password}) {
        this.handleLogin({userName, password}).then(() => {
          this.getUserInfo().then(() => {
            let _login = this.$refs.login
            _login.isGetCode = false
            _login.form.tips = ''
            _login.form.vcode = ''
            // this.getDictList().then(() => {
              this.$router.push({
                name: this.$config.homeName
              })
            // })
          })
        })
      }
    }
  }
</script>

<style>

</style>
