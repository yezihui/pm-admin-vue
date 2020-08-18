<template>
  <Modal v-model="isVisible" @on-visible-change="visibleChange" :mask-closable="false">
    <p slot="header" style="text-align:center">
      <Icon type="ios-information-circle"></Icon>
      <span>修改登录密码</span>
    </p>
    <Alert show-icon type="warning">修改密码成功后将重新登录</Alert>
    <Form ref="opForm" :model="form" :rules="ruleCustom" :label-width="80">
      <FormItem prop="oldPwd" label="旧密码">
        <i-input type="password" v-model="form.oldPwd"></i-input>
      </FormItem>
      <FormItem prop="newPwd" label="新密码">
        <i-input type="password" v-model="form.newPwd"></i-input>
      </FormItem>
      <FormItem prop="replyNewPwd" label="确认新密码">
        <i-input type="password" v-model="form.replyNewPwd"></i-input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" :loading="loading" @click="ok">保存</Button>
      <Button type="error" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name: 'modify-pwd',
    props: {
      visible: {
        type: Boolean,
        default: false,
        required: true
      }
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.form.replyNewPwd !== '') {
            // 对第二个密码框单独验证
            this.$refs.opForm.validateField('replyNewPwd')
          }
          callback()
        }
      }
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.newPwd) {
          callback(new Error('两次输入不匹配!'))
        } else {
          callback()
        }
      }
      return {
        isVisible: false,
        loading: false,
        form: {
          oldPwd: '',
          newPwd: '',
          replyNewPwd: ''
        },
        ruleCustom: {
          newPwd: [
            {validator: validatePass, trigger: 'blur'}
          ],
          replyNewPwd: [
            {validator: validatePassCheck, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      ...mapActions([
        'modifySecurityPwd'
      ]),
      // 提交更改
      ok() {
        let vm = this
        this.$refs.opForm.validate((valid) => {
          if (valid) {
            vm.loading = true
            this.modifySecurityPwd(vm.form).then(() => {
              vm.loading = false
              vm.isVisible = false
              vm.$emit('on-success')
            }).catch(() => {
              vm.loading = false
            })
          }
        })
      },
      // modal显示隐藏事件
      visibleChange(val) {
        if (!val) {
          this.$emit('cancel')
        }
      },
      // 关闭
      cancel() {
        this.isVisible = false
      }
    },
    watch: {
      // 父组件的visible值监控
      visible: function (val) {
        if (val) {
          this.$refs.opForm.resetFields()
          this.isVisible = val
        }
      }
    }

  }
</script>
