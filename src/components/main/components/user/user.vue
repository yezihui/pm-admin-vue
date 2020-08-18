<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge>
        <Avatar style="background-color: #87d068" :icon="userAvatar"/>
        <span style="padding-left: 6px;">{{userName}}</span>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="info">
          <Icon type="md-person"/>
          <span style="padding-left: 6px;">个人信息</span>
        </DropdownItem>
        <DropdownItem name="pwd">
          <Icon type="ios-key-outline"/>
          <span style="padding-left: 6px;">修改密码</span></DropdownItem>
        <DropdownItem name="logout" divided>
          <Icon type="ios-log-out"/>
          <span style="padding-left: 6px;">退出登录</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <modify-pwd
      :visible="visibleModifyPwdModal"
      @on-success="modifySuccess"
      @cancel="visibleModifyPwdModal = false"/>

    <user-info :visible="visibleUserInfo" @on-close="closeUserInfo"></user-info>
  </div>
</template>

<script>
  import './user.less'
  import {mapActions} from 'vuex'
  import {setTagNavListInLocalstorage} from '@/libs/util'
  import ModifyPwd from './modify-pwd'
  import UserInfo from './user-info'

  export default {
    name: 'User',
    components: {
      ModifyPwd,
      UserInfo
    },
    props: {
      userAvatar: {
        type: String,
        default: ''
      },
      userName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        visibleModifyPwdModal: false,
        visibleUserInfo: false
      }
    },
    methods: {
      ...mapActions([
        'handleLogOut'
      ]),
      closeUserInfo() {
        this.visibleUserInfo = false
      },
      info() {
        this.visibleUserInfo = true
      },
      modifySuccess() {
        let vm = this
        setTagNavListInLocalstorage([])
        this.$store.state.app.tagNavList = []
        this.$Modal.warning({
          title: '提示',
          content: '请重新登录',
          onOk: function () {
            vm.$router.push({
              name: 'login'
            })
          }
        })
      },
      logout() {
        let vm = this
        this.$Modal.confirm({
          title: '提示',
          content: '确认退出登录吗?',
          onOk: function () {
            setTagNavListInLocalstorage([])
            vm.$store.state.app.tagNavList = []
            vm.handleLogOut().then(() => {
              vm.$router.push({
                name: 'login'
              })
            })
          }
        })
      },
      handleClick(name) {
        switch (name) {
          case 'info':
            this.info()
            break
          case 'pwd':
            this.visibleModifyPwdModal = true
            break
          case 'logout':
            this.logout()
            break
        }
      }
    }
  }
</script>
