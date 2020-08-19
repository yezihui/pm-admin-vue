<template>
  <Modal v-model="isVisible" @on-visible-change="visibleChange" width="800px">
    <p slot="header">
      <span>新增纸张</span>
    </p>
    <div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem prop="paperType" label="纸种">
              <Input v-model="form.paperType"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="paperName" label="产品名称">
              <Input v-model="form.paperName"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem prop="paperWeight" label="克重">
              <Input v-model="form.paperWeight"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="paperOrigin" label="产地">
              <Input v-model="form.paperOrigin"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem prop="popStrength" label="耐破指数">
              <Input v-model="form.popStrength"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="foldStrength" label="耐折强度">
              <Input v-model="form.foldStrength"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem prop="ringCrush" label="环压指数">
              <Input v-model="form.ringCrush"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="moisture" label="水分">
              <Input v-model="form.moisture"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
           <FormItem prop="paperPrice" label="价格">
            <Input v-model="form.paperPrice"/>
          </FormItem>
          </Col>
          <Col span="4">
            <FormItem prop="isEnabled"  label="起">
              <i-switch v-model="form.isEnabled">
                <span slot="1">开启</span>
                <span slot="0">关闭</span>
              </i-switch>
            </FormItem>
          </Col>
          <Col span="8">
           <FormItem prop="updateTime" label="更新时间">
              <DatePicker type="datetime" v-model="form.updateTime" placeholder="请选择更新时间"></DatePicker>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div slot="footer">
      <Button type="primary" :loading="loading" @click="ok">保存</Button>
      <Button type="error" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { addPaper } from '@/api/paper/paper';

export default {
  name: 'AddModal',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    isOpen: Boolean
  },
  data() {
    return {
      rules: {
        paperType: [
          { required: true, message: '纸种不能为空', trigger: 'blur' }
        ],
        paperName: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        paperWeight: [
          { required: true, message: '克重不能为空', trigger: 'blur' }
        ],
        paperOrigin: [
          { required: true, message: '产地不能为空', trigger: 'blur' }
        ],
        popStrength: [
          { required: true, message: '耐破指数不能为空', trigger: 'blur' }
        ],
        foldStrength: [
          { required: true, message: '耐折强度不能为空', trigger: 'blur' }
        ],
        ringCrush: [
          { required: true, message: '环压指数不能为空', trigger: 'blur' }
        ],
        moisture: [
          { required: true, message: '水分不能为空', trigger: 'blur' }
        ],
        paperPrice: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ]
      },
      isVisible: false,
      loading: false,
      form: {
        paperType: '',
        paperName: '',
        paperWeight: '',
        paperOrigin: '',
        popStrength: '',
        foldStrength: '',
        ringCrush: '',
        moisture: '',
        paperPrice: '',
        updateTime: null,
        isBottom: false
      }
    };
  },
  mounted() {},
  computed: {},
  methods: {
    // 上传成功回调
    handleUpload(url) {
      this.form.avatar = url.fileSavePath;
    },
    onChange(e) {
    },
    // 提交更改
    ok() {
      this.$refs.form.validate(valid => {
        let vm = this;
        let time = vm.form.updateTime ? this.$moment(vm.form.updateTime).format('YYYY-MM-DD HH:mm:ss') : null;
        if (valid) {
          this.loading = true;
          let request = {
            paperType: vm.form.paperType,
            paperName: vm.form.paperName,
            paperWeight: vm.form.paperWeight,
            paperOrigin: vm.form.paperOrigin,
            popStrength: vm.form.popStrength,
            foldStrength: vm.form.foldStrength,
            ringCrush: vm.form.ringCrush,
            moisture: vm.form.moisture,
            paperPrice: vm.form.paperPrice,
            isBottom: vm.form.isBottom,
            updateTime: time
          };
          addPaper(request)
            .then(res => {
              this.loading = false;
              this.cancel();
              this.$emit('on-success');
            })
            .catch((e) => {
              this.$Notice.error('网络异常');
              this.loading = false;
            });
        } else {
          this.$Message.error('必填项不能为空!');
          vm.loading = false;
        }
      });
    },
    // 关闭
    cancel() {
      this.isVisible = false;
      this.$refs['form'].resetFields();
      this.form.avatar = '';
      this.$emit('cancel');
    },
    // modal显示隐藏事件
    visibleChange(val) {
      if (!val) {
        this.$emit('cancel');
      } else {
        this.isVisible = val;
      }
    }
  },
  watch: {
    // 监控显示隐藏事件
    visible: function(val) {
      if (!val) {
        this.$emit('cancel');
      } else {
        this.isVisible = val;
      }
    }
  }
};
</script>

<style scoped>
</style>
