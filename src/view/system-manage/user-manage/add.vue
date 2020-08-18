<template>
  <Modal :mask-closable="false" v-model="isVisible" @on-visible-change="visibleChange">
    <p slot="header" style="text-align:center">
      <Icon type="ios-information-circle"></Icon>
      <span>新增用户</span>
    </p>
    <div>
      <Alert show-icon>新用户默认密码与用户名一样,用户登录可以修改</Alert>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem prop="loginName" label="用户名">
          <i-input v-model="form.loginName"></i-input>
        </FormItem>
        <FormItem prop="nickName" label="昵称">
          <i-input v-model="form.nickName"></i-input>
        </FormItem>
        <FormItem prop="mobilePhone" label="手机号">
          <Input type="tel" v-model="form.mobilePhone"></Input>
        </FormItem>
        <FormItem prop="gender" label="性别">
          <RadioGroup v-model="form.gender">
            <Radio label="1">男</Radio>
            <Radio label="2">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="remark" label="备注">
          <i-input v-model="form.remark"></i-input>
        </FormItem>
        <FormItem prop="isEnabled" label="账号状态">
          <i-switch v-model="form.isEnabled">
            <span slot="1">开启</span>
            <span slot="0">关闭</span>
          </i-switch>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="primary" :loading="loading" @click="ok">保存</Button>
      <Button type="error" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { addUser } from '@/api/system/user';

export default {
  name: 'AddModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        return callback(new Error('手机号格式不正确'));
      } else {
        callback();
      }
    };
    return {
      isVisible: false,
      loading: false,
      form: {
        loginName: '',
        mobilePhone: '',
        gender: '',
        nickName: '',
        remark: '',
        isEnabled: true
      },
      rules: {
        loginName: [
          { required: true, message: '登录名不能为空', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            validator: validatePhone,
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    // rules() {
    //   return {
    //     loginName: this.loginNameRules,
    //     nickName: this.nickNameRules,
    //     mobilePhone: this.mobilePhoneRules
    //   };
    // }
  },
  methods: {
    // 提交更改
    ok() {
      let vm = this;
      vm.$refs.form.validate(valid => {
        if (valid) {
          vm.loading = true;
          addUser(this.form)
            .then(() => {
              vm.loading = false;
              vm.isVisible = false;
              vm.$emit('on-success');
            })
            .catch(() => {
              vm.loading = false;
            });
        }
      });
    },
    // 关闭当前弹框，调用父组件的取消事件，修改父组件的visible
    cancel() {
      this.isVisible = false;
    },
    // modal显示隐藏事件，关闭时修改父组件的visible，显示时设置当前Modal为已显示状态
    visibleChange(val) {
      if (!val) {
        this.$emit('cancel');
      }
    }
  },
  watch: {
    // 父组件的visible值监控
    visible: function(val) {
      if (val) {
        this.$refs.form.resetFields();
        this.isVisible = val;
      }
    }
  }
};
</script>
