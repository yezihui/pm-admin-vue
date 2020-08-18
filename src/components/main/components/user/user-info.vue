<template>
  <div>
    <Drawer :closable="false" width="640" v-model="isVisible" @on-visible-change="visibleChange">
      <p :style="pStyle">个人主页</p>
      <div class="demo-drawer-profile">
        <Row>
          <i-col span="12">
            登录名: {{userName}}
          </i-col>
          <i-col span="12">
            昵称: {{nickName}}
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            性别: {{gender}}
          </i-col>
          <i-col span="12">
            邮箱: {{email}}
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            最近登录时间: {{lastLoginTime}}
          </i-col>
          <i-col span="12">
            创建时间: {{createTime}}
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            备注信息: {{remark}}
          </i-col>
        </Row>
      </div>
    </Drawer>
  </div>
</template>

<script>
  export default {
    name: 'user-info',
    props: {
      visible: {
        type: Boolean,
        default: false,
        required: true
      }
    },
    data() {
      return {
        isVisible: false,
        pStyle: {
          fontSize: '16px',
          color: 'rgba(0,0,0,0.85)',
          lineHeight: '24px',
          display: 'block',
          marginBottom: '16px'
        }
      }
    },
    computed: {
      userName() {
        return this.$store.state.user.userName
      },
      nickName() {
        return this.$store.state.user.nickName
      },
      gender() {
        let gen = this.$store.state.user.gender
        return gen === '1' ? '男' : '女'
      },
      email() {
        return this.$store.state.user.email
      },
      remark() {
        return this.$store.state.user.remark
      },
      lastLoginTime() {
        return this.$store.state.user.lastLoginTime
      },
      createTime() {
        return this.$store.state.user.createTime
      }
    },
    methods: {
      // modal显示隐藏事件
      visibleChange(val) {
        if (!val) {
          this.$emit('on-close')
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

<style>
  .demo-drawer-profile {
    font-size: 14px;
  }

  .demo-drawer-profile .ivu-col {
    margin-bottom: 12px;
  }
</style>
