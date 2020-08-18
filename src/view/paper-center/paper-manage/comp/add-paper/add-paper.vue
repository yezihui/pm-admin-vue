<template>
  <Modal v-model="isVisible" @on-visible-change="visibleChange">
    <p slot="header">
      <span>新增纸张</span>
    </p>
    <div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem prop="paperType" label="纸种">
          <Input v-model="form.paperType"/>
        </FormItem>
        <FormItem prop="paperNo" label="产品编号">
          <Input v-model="form.paperNo"/>
        </FormItem>
        <FormItem prop="paperName" label="产品名称">
          <Input v-model="form.paperName"/>
        </FormItem>
        <FormItem prop="paperWeight" label="克重">
          <Input v-model="form.paperWeight"/>
        </FormItem>
        <FormItem prop="paperOrigin" label="产地">
          <Input v-model="form.paperOrigin"/>
        </FormItem>
        <FormItem prop="popStrength" label="耐破指数">
          <Input v-model="form.popStrength"/>
        </FormItem>
        <FormItem prop="ringCrush" label="环压指数">
          <Input v-model="form.ringCrush"/>
        </FormItem>
        <FormItem prop="paperPrice" label="价格">
          <Input v-model="form.paperPrice"/>
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
        paperNo: [
          { required: true, message: '产品编号不能为空', trigger: 'blur' }
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
        ringCrush: [
          { required: true, message: '环压指数不能为空', trigger: 'blur' }
        ],
        paperPrice: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ]
      },
      isVisible: false,
      loading: false,
      form: {
        paperType: '',
        paperNo: '',
        paperName: '',
        paperWeight: '',
        paperOrigin: '',
        popStrength: '',
        ringCrush: '',
        paperPrice: ''
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
      console.log(e);
    },
    // 提交更改
    ok() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          addPaper(this.form)
            .then(res => {
              this.loading = false;
              this.cancel();
              this.$emit('on-success');
            })
            .catch((e) => {
              this.$Notice.error('网络异常');
              this.loading = false;
            });
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
