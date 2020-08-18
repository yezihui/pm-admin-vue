<template>
  <Modal :mask-closable="false" v-model="isVisible" @on-visible-change="visibleChange">
    <p slot="header" style="text-align:center">
      <Icon type="ios-information-circle"></Icon>
      <span>修改密码</span>
    </p>
    <Alert show-icon type="warning">修改密码将逼迫此用户下线，重新登录</Alert>
    <Form ref="opForm" :model="form" :rules="ruleCustom" :label-width="80">
      <FormItem prop="pwd" label="密码">
        <i-input type="password" v-model="form.pwd"></i-input>
      </FormItem>
      <FormItem prop="replyPwd" label="确认密码">
        <i-input type="password" v-model="form.replyPwd"></i-input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" :loading="loading" @click="ok">保存</Button>
      <Button type="error" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
  import {updatePwd} from '@/api/system/user'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
        required: true
      },
      deliveryParam: {
        type: Object,
        required: true
      }
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.form.replyPwd !== '') {
            // 对第二个密码框单独验证
            this.$refs.opForm.validateField('replyPwd')
          }
          callback()
        }
      }
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.pwd) {
          callback(new Error('两次输入不匹配!'))
        } else {
          callback()
        }
      }
      return {
        isVisible: false,
        loading: false,
        form: {
          pwd: '',
          replyPwd: ''
        },
        ruleCustom: {
          pwd: [
            { validator: validatePass, trigger: 'blur' }
          ],
          replyPwd: [
            { validator: validatePassCheck, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 提交更改
      ok() {
        let vm = this
        this.$refs.opForm.validate((valid) => {
          if (valid) {
            vm.loading = true
            updatePwd(vm.deliveryParam.id, vm.form).then(() => {
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
          this.isVisible = val
        }
      }
    }

  }
</script>

<style scoped>

</style>
