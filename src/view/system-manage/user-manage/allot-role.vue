<template>
  <Modal :mask-closable="false" v-model="isVisible" @on-visible-change="visibleChange">
    <p slot="header" style="text-align:center">
      <Icon type="ios-information-circle"></Icon>
      <span>分配权限</span>
    </p>
    <div v-if="hasGet">
      <Transfer
        ref="allot"
        :data="transferData"
        :titles="titles"
        :target-keys="targetKeys"
        :render-format="transferRender"
        @on-change="transferChange">
      </Transfer>
    </div>
    <div slot="footer">
      <Button type="primary" :loading="loading" @click="ok">保存</Button>
      <Button type="error" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
  import {allotUserRoles, getUserRoles} from '@/api/system/user'

  export default {
    name: 'AllotRoleModal',
    props: {
      visible: {
        type: Boolean,
        default: false,
        required: true
      },
      deliveryParam: {
        type: Object,
        required: true
      },
      loginNameRules: {
        type: Array,
        default: () => {
          return [
            {required: true, message: '登录名不能为空', trigger: 'blur'}
          ]
        }
      },
      nickNameRules: {
        type: Array,
        default: () => {
          return [
            {required: true, message: '昵称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    data() {
      return {
        hasGet: false,
        isVisible: false,
        loading: false,
        // 穿梭框的标题
        titles: ['分配角色', '已分配角色'],
        // 穿梭框数据
        transferData: [],
        // 目标列表
        targetKeys: []
      }
    },
    computed: {
      rules() {
        return {
          loginName: this.loginNameRules,
          nickName: this.nickNameRules
        }
      }
    },
    methods: {
      fnGetData() {
        // 获取数据
        let vm = this
        getUserRoles(this.deliveryParam.id).then(res => {
          const data = res.data.data
          data.forEach(item => {
            vm.transferData.push({
              key: item.roleId.toString(),
              label: item.roleName
            })
            if (item.choose) {
              vm.targetKeys.push(item.roleId.toString())
            }
          })
          vm.hasGet = true
        })
      },
      // 渲染列表
      transferRender(item) {
        return item.label
      },
      // 穿梭框事件
      transferChange(newTargetKeys, direction, moveKeys) {
        this.targetKeys = newTargetKeys
      },
      // 提交更改
      ok() {
        let vm = this
        vm.loading = true
        allotUserRoles(vm.deliveryParam.id, vm.targetKeys).then(() => {
          vm.loading = false
          vm.isVisible = false
          vm.$emit('on-success')
        }).catch(() => {
          vm.loading = false
        })
      },
      // 关闭
      cancel() {
        this.isVisible = false
      },
      // modal显示隐藏事件
      visibleChange(val) {
        if (!val) {
          this.$emit('cancel')
        }
      },
      clearData() {
        this.transferData = []
        this.targetKeys = []
      }
    },
    watch: {
      // 监控显示隐藏事件
      visible: function (val) {
        if (val) {
          this.isVisible = val
          this.clearData()
          this.fnGetData()
        }
      }
    }
  }
</script>

<style scoped>

</style>
