<template>
  <Modal :mask-closable="false" v-model="isVisible" @on-visible-change="visibleChange">
    <p slot="header" style="text-align:center">
      <Icon type="ios-information-circle"></Icon>
      <span>编辑用户</span>
    </p>
    <div v-if="hasGet">
      <Alert show-icon type="warning">用户名不能修改,可删除此用户后重新添加</Alert>
      <Form ref="opForm" :model="form" :rules="rules" :label-width="80">
        <FormItem prop="loginName" label="用户名">
          <i-input v-model="form.loginName" disabled></i-input>
        </FormItem>
        <FormItem prop="nickName" label="昵称">
          <i-input v-model="form.nickName"></i-input>
        </FormItem>
        <FormItem prop="mobilePhone" label="手机号">
          <Input v-model="form.mobilePhone"></Input>
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
import { editUser, getUserById } from '@/api/system/user';

export default {
  name: 'UpdateModal',
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
    // nickNameRules: {
    //   type: Array,
    //   default: () => {
    //     return [
    //       { required: true, message: '昵称不能为空', trigger: 'blur' }
    //     ]
    //   }
    // },
    // mobilePhoneRules: {
    //   type: Array,
    //   default: () => {
    //     return [
    //       { required: true, message: '手机号不能为空', trigger: 'blur' },
    //       {
    //         validator: validatePhone,
    //         message: '格式有误，请重新输入',
    //         trigger: 'blur'
    //       }
    //     ]
    //   }
    // }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        return callback(new Error('手机号格式不正确'));
      } else {
        callback();
      }
    };
    return {
      hasGet: false,
      isVisible: false,
      loading: false,
      form: {
        loginName: '',
        mobilePhone: '',
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
    // rules () {
    //   return {
    //     loginName: this.loginNameRules,
    //     mobilePhone: this.mobilePhoneRules,
    //     nickName: this.nickNameRules,
    //   }
    // }
  },
  methods: {
    fnGetData() {
      // 获取数据
      let vm = this;
      getUserById(this.deliveryParam.id).then(res => {
        const data = res.data.data;
        vm.form.loginName = data.loginName;
        vm.form.mobilePhone = data.mobilePhone;
        vm.form.nickName = data.nickName;
        vm.form.remark = data.remark;
        vm.form.isEnabled = data.isEnabled;
        vm.hasGet = true;
      });
    },
    // 提交更改
    ok() {
      let vm = this;
      this.$refs.opForm.validate(valid => {
        if (valid) {
          vm.loading = true;
          delete vm.form['loginName'];
          editUser(vm.deliveryParam.id, vm.form)
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
    // 关闭
    cancel() {
      this.isVisible = false;
    },
    // modal显示隐藏事件
    visibleChange(val) {
      if (!val) {
        this.$emit('cancel');
      }
    }
  },
  watch: {
    // 监控显示隐藏事件
    visible: function(val) {
      if (val) {
        this.isVisible = val;
        this.fnGetData();
      }
    }
  }
};
</script>

<style scoped>
</style>
