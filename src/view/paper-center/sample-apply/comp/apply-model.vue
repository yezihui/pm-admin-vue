<template>
  <Modal v-model="isVisible" @on-visible-change="visibleChange">
    <p slot="header">
      <span>跟踪回访</span>
    </p>
    <Form ref="formValidate" :model="form" :rules="rules" :label-width="100">
      <FormItem prop label="跟踪记录:" v-if="list!==undefined && list!==null && list.length>0">
        <ul>
          <li class="step" v-for="(item,index) in list" :key="index">
            <div class="step-list">
              <div>
                状态：
                <span
                  class="inline-block"
                  :class="item.status===2?'success':'warning'"
                >{{appStatus(item.status)}}</span>
              </div>
              <p class="step-remark">{{item.remark}}</p>
              <p class="step-user">
                {{item.createTime}}
                <span class="inline-block info">{{item.createUserName}}</span>
              </p>
            </div>
            <!-- <div class="step-del" @click="delApplyStatus(item.id)">删除</div> -->
          </li>
        </ul>
      </FormItem>
      <FormItem prop="status" label="状态:">
        <Select v-model="form.status" size="large">
          <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.key }}</Option>
        </Select>
      </FormItem>
      <FormItem prop="remark" label="备注:">
        <Input type="text" v-model.trim="form.remark" style="width: 100%;" placeholder="输入备注" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button
        type="primary"
        :loading="loading"
        @click="handleSubmit('formValidate')"
      >确定</Button>
      <Button type="error" @click="cancel('formValidate')">取消</Button>
    </div>
  </Modal>
</template>
<style lang="less" scoped>
.step {
  display: flex;
}
.step-list {
  flex: 1;
  max-height: 400px;
  overflow: auto;
}
.step-del {
  align-self: flex-end;
  min-width: 100px;
  padding: 0 20px;
  text-align: right;
  color: orangered;
  cursor: pointer;
}
</style>
<script>
import { traceList, addTrace, delTrace } from '@/api/paper/sampleApply';
export default {
  name: 'apply-model',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      id: 0,
      // 0：待处理，1：有意向，2：无效申请，3：申请成功
      status: [
        {
          key: '拒绝',
          value: 1
        },
        {
          key: '办理',
          value: 2
        }
      ],
      isVisible: false,
      loading: false,
      rules: {
        remark: [
          {
            required: true,
            message: '写点备注信息吧',
            trigger: 'blur'
          }
        ]
      },
      list: [],
      form: {
        status: 0,
        remark: ''
      },
      operators: []
    };
  },
  watch: {
    // 监控显示隐藏事件
    visible: function(val) {
      this.isVisible = val;
    },
    value(val) {
      this.getTraceList(val);
      this.id = val;
    }
  },
  mounted() {
    // 获取本菜单权限列表
    this.operators = this.$store.state.user.activeMenuOperators;
    // 实例完成后首先加载表格,配置notCache=true后，此页面需要缓存
  },
  computed: {
  },
  methods: {
    delApplyStatus(id) {
      delTrace([id]).then(res => {
        let _res = res.data;
        if (_res.code === 200) {
          this.$Message.success('删除成功');
          this.getTraceList(this.id);
        }
      });
    },
    appStatus(applyStatus) {
      let status = '';
      this.status.map((v, i) => {
        if (applyStatus === v.value) {
          status = v.key;
        }
      });
      return status;
    },
    getTraceList(id) {
      // 回访记录列表权限
      traceList(id).then(res => {
        let _res = res.data;
        if (_res.code === 200 && _res.success) {
          this.list = _res.data ? _res.data : [];
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    // modal显示隐藏事件
    visibleChange(val) {
      if (!val) {
        this.$emit('cancel');
      } else {
        this.isVisible = val;
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.loading = true;
          addTrace(this.id, this.form)
            .then(res => {
              this.loading = false;
              this.$refs['formValidate'].resetFields();
              this.getTraceList(this.id);
              this.$emit('confim');
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.$Message.error('Fail!');
        }
      });
    },
    // 关闭
    cancel(name) {
      this.isVisible = false;
      this.$refs[name].resetFields();
      this.$emit('cancel');
    }
  }
};
</script>
