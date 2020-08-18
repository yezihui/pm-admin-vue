<template>
  <div>
    <div class="demo-upload-list" v-for="item in uploadList" :key="item.name">
      <template v-show="item.status === 'finished'">
        <img :src="item.url" />
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-show="item.status !== 'finished'">
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>

    <Upload
      ref="upload"
      :headers="headers"
      :name="name"
      :show-upload-list="showUploadList"
      :default-file-list="defaultFileList"
      :on-success="handleSuccess"
      :format="fileFormat"
      :max-size="maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :multiple="multiple"
      :type="type"
      :action="url"
      style="display: inline-block;width:58px;"
    >
      <div style="width: 58px;height:58px;line-height: 58px;" v-show="!disabled">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="图片预览" v-model="visible" style="z-index: 10002">
      <img :src="imageUrl" v-if="visible" style="width: 100%" />
    </Modal>
  </div>
</template>
<style lang="less" scoped>
</style>
<script>
import { getToken } from '@/libs/util';
import './index.less';
import config from '@/config';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? config.baseUrl.dev
    : config.baseUrl.pro;
export default {
  name: 'ImageUpload',
  props: {
    setKey: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'drag'
    },
    showUploadList: {
      type: Boolean,
      default: false
    },
    maxSize: {
      type: Number,
      default: 2048
    },
    maxUpload: {
      type: Number,
      default: 1
    },
    fileFormat: {
      type: Array,
      default: function() {
        return ['jpg', 'jpeg', 'png'];
      }
    },
    defaultList: Array,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      url: '/v1/common/image/upload',
      imageUrl: '',
      visible: false,
      uploadList: [],
      headers: {},
      name: 'image',
      defaultFileList: this.defaultList
    };
  },
  methods: {
    setDefaultList() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.defaultFileList = this.defaultList;
          // 赋值后马上更新
          this.uploadList = this.$refs.upload.fileList;
        });
      }, 800);
    },
    handleView(url) {
      this.imageUrl = url;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      this.$nextTick(() => {
        // 赋值后马上更新
        this.uploadList = this.$refs.upload.fileList;
      });
      this.$emit('on-remove', this.setKey);
    },
    handleSuccess(res, file) {
      const data = res.data;
      file.url = 'http://' + data.fileSaveFullPath;
      file.name = data.fileSaveName;
      file.status = 'finished';
      if (this.uploadList.length === 0) {
        this.uploadList.push(file);
      }
      // 将上传成功的数据传递父组件

      data.key = this.setKey;
      this.$emit('on-success-upload', data);
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件上传格式不正确',
        desc: '[' + file.name + ']格式不正确，请选择正确的文件格式'
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '上传文件限制',
        desc: '文件 ' + file.name + ' 超过' + this.maxSize / 1024 + 'MB'
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < this.maxUpload;
      if (!check) {
        this.$Notice.warning({
          title: '最多允许上传' + this.maxUpload + '个'
        });
      }
      return check;
    },
    removeAll() {
      this.$refs.upload.fileList = [];
      this.uploadList = [];
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
    this.headers = {
      token: getToken()
    };
    this.setDefaultList();
  }
};
</script>
