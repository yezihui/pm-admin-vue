<template>
  <div>
    <Upload
      ref="upload"
      multiple
      :headers="headers"
      :name="name"
      :format="fileFormat"
      :show-upload-list="showUploadList"
      :default-file-list="defaultFileList"
      :on-success="handleSuccess"
      :max-size="maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :on-remove="handleRemove"
      :on-progress="onProgress"
      :action="url"
    >
      <Button icon="ios-cloud-upload-outline">{{title}}(最多上传{{maxUpload}}个)</Button>
    </Upload>
    <div class="flex-start-align-center" v-if="!showUploadList && hideUploadList">
      <Progress v-if="percentage>0" :percent="percentage" />
      <Button class="loading-btn" v-if="percentage>0 && percentage<100" loading shape="circle"></Button>
    </div>
  </div>
</template>
<style lang="less" scoped>
.loading-btn {
  width: 16px;
  height: 16px;
  line-height: 10px;
  left: -20px;
}
.loading-btn /deep/ .ivu-icon-ios-loading {
  font-size: 12px;
  line-height: 10px;
}
.flex-start-align-center {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
</style>
<script>
import { getToken } from '@/libs/util';
import config from '@/config';
const baseUrl =
  process.env.NODE_ENV === 'development'
    ? config.baseUrl.dev
    : config.baseUrl.pro;
export default {
  name: 'FileUpload',
  props: {
    title: {
      type: String,
      default: '上传附件'
    },
    setKey: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'drag'
    },
    showUploadList: {
      type: Boolean,
      default: true
    },
    hideUploadList: {
      type: Boolean,
      default: true
    },
    maxSize: {
      type: Number,
      default: 102400
    },
    maxUpload: {
      type: Number,
      default: 10
    },
    fileFormat: {
      type: Array,
      default: function() {
        return ['rar', 'zip', 'doc', 'docx', 'pdf', 'xlsx', 'xls', 'apk'];
      }
    },
    defaultList: Array,
    disabled: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: '/v1/common/file/upload'
    }
  },
  data() {
    return {
      uploadList: [],
      name: 'file',
      defaultFileList: [],
      percentage: 0
    };
  },
  computed: {
    headers() {
      return {
        token: getToken()
      };
    }
  },
  watch: {
    defaultList(val) {
      this.defaultFileList = val
    }
  },
  methods: {
    onProgress(event, file, fileList) {
      let percent = parseInt(event.percent.toFixed(2));
      if (percent >= 99) {
        percent = 99;
      }
      this.percentage = percent;
    },
    handleRemove(file, fileList) {
      let obj = {};
      obj['file'] = file;
      obj['fileList'] = fileList;
      obj['key'] = this.setKey;
      this.$emit('on-remove', obj);
    },
    handleSuccess(res, file, fileList) {
      const data = res.data;
      if (data.success) {
        this.percentage = 100;
        this.$emit('on-success-upload', data, file, fileList);
      } else {
        if (data.sourceFileName) {
          file.name = data.sourceFileName;
        }
        file.url = 'http://' + data.fileSaveFullPath;
        // 将上传成功的数据传递父组件
        data.key = this.setKey;
        this.percentage = 100;
        this.$emit('on-success-upload', data, file, fileList);
      }
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
      // 如果只限制上传一个，每次上传都清除列表
      if (this.maxUpload == 1) {
        this.clearFiles();
      }
      if (this.showUploadList) {
        this.$emit('before-upload', false);
      }
      const check = this.uploadList.length < this.maxUpload;
      if (!check) {
        this.$Notice.warning({
          title: '最多允许上传' + this.maxUpload + '个'
        });
      }
      return check;
    },
    // 清空已上传的文件列表
    clearFiles() {
      this.$refs['upload'].clearFiles();
    }
  },
  mounted() {}
};
</script>
