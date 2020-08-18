<template>
  <div>
    <editor v-if="active" :id="myEditor" v-model="editorContent" :init="init" @onChange="onChange" @onInit="onInit"  @onRemove="onRemove" @onBlur="onBlur"></editor>
    <Modal v-model="dirModelShow" scrollable title="左右边距" width="300" @on-ok="handleDirComfim">
        <RadioGroup v-model="radioVal" class="radioGroup">
            <Radio :label="2">选择</Radio>
            <Radio :label="1">自定义</Radio>
        </RadioGroup>
        <div v-show="radioVal == 2">
          <Select v-model="seletedVal" style="width:200px">
              <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div v-show="radioVal == 1">
          <InputNumber :min="0" v-model="seletedVal" placeholder="输入左右间距：如15" style="width: 250px"></InputNumber>
        </div>
    </Modal>
  </div>
</template>
<style lang="less" scoped>
.radioGroup{
  margin-bottom: 15px;
}
</style>
<script>

import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
// 插入表格插件
import 'tinymce/plugins/table'
// 首行缩进插件
// import indent2em from ''
// 列表插件
import 'tinymce/plugins/lists'
// 字数统计插件
import 'tinymce/plugins/wordcount'
// 自动调整
import 'tinymce/plugins/fullscreen'
// 不间断空格
import 'tinymce/plugins/nonbreaking'
// 超链接
import 'tinymce/plugins/link'
// 预览
import 'tinymce/plugins/preview'
import 'tinymce/plugins/image'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/code'
import {getToken} from '@/libs/util'
export default {
  name: 'tinymce-editor',
  components: {
    Editor
  },
  props: {
    myEditor: {
      default: 'myEditor'
    },
    value: {
      type: String,
      default: ''
    },
    plugins: {
      type: [String, Array],
      default: 'powerpaste nonbreaking fullscreen link lists table wordcount preview image imagetools code indent2em bzwh qxbz glfg lrdir dhm qcys'
    },
    toolbar: {
      type: [String, Array],
      default: 'undo redo | bzwh qxbz glfg  lrdir qcys| removeformat bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent indent2em | link image lists table wordcount | preview fullscreen code | formatselect | formatstyle' 
    },
    height: {
      type: [Number, String],
      default: 400
    }
  },
  data () {
    return {
      active: false,
      editorContent: this.value,
      seletedTxt: '',
      showDrawer: false,
      dirModelShow: false,
      radioVal: 2,
      seletedVal: 15,
      list: [
        {
          label: '10px',
          value: 10
        },
        {
          label: '15px',
          value: 15
        },
        {
          label: '20px',
          value: 20
        }
      ]
    }
  },
  computed: {
    init () {
      let vm = this
      require('@/components/tinymce-editor/plugin.min.js')
      tinymce.PluginManager.add('lrdir', function(editor, url) {
        // Add a button 
        editor.ui.registry.addButton('lrdir', {
          text: '边距',
          onAction: function () {
            vm.fnDirModel()
          }
        });
      });
      return {
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/ui/oxide',
        height: this.height,
        branding: false,
        plugins: this.plugins,
        toolbar: this.toolbar,
        allow_conditional_comments: false,
        allow_unsafe_link_target: true,
        rel_list: [
            {title: '允许跳转', value: 'webtax'},
            {title: '默认', value: 'friend'}
        ],
        nonbreaking_force_tab: true,
        formats: {
          removeformat: [
            {selector: 'p,b,strong,em,i,font,u,strike', remove: 'all'},
          ]
        },
        style_formats: [
            {title: '首行缩进', block: 'p', styles: {'text-indent': '2em'}}
        ],
        style_formats_merge: true,
        style_formats_autohide: true,
        external_plugins: {
          powerpaste: '/tinymce/plugins/powerpaste/plugin.min.js'
        },
        // 参数可以是propmt, merge, clear，效果自行切换对比
        powerpaste_word_import: 'propmt',
        // propmt, merge, clear
        powerpaste_html_import: 'propmt',
        powerpaste_allow_local_images: true,
        paste_data_images: true,
        images_upload_handler: function (blobInfo, success, failure) {
          let xhr, formData;

          xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open('POST', '/v1/common/image/upload');
          xhr.setRequestHeader('token', getToken());

          xhr.onload = function () {
            let json;
            if (xhr.status !== 200) {
              failure('请求上传失败: ' + xhr.status);
              return;
            }
            json = JSON.parse(xhr.responseText);

            if (!json.success || json.code !== 200) {
              failure('非法返回: ' + xhr.responseText);
              return;
            }
            success('https://' + json.data.fileSaveFullPath);
          };

          formData = new FormData();
          formData.append('image', blobInfo.blob(), blobInfo.filename());

          xhr.send(formData);
        }
      }
    }
  },
  methods: {
    fnModel() {
      let txt = tinymce.activeEditor.selection.getContent({format: 'text'})
      this.seletedTxt = ''
      if (txt) {
        this.seletedTxt = txt
        this.showDrawer = true
      } 
    },
    fnDirModel() {
      let txt = tinymce.activeEditor.selection.getContent()
      this.seletedTxt = ''
      if (txt) {
        this.seletedTxt = txt
        this.dirModelShow = true
      } 
    },
    handleComfim(v) {
      let id = v[0].id
      let txt = tinymce.activeEditor.selection.getContent({format: 'text'})
      tinymce.activeEditor.insertContent(`<span class="webtax_link" aid=${id} data-aid=${id} style="color: #4F79F5">${txt}</span>`);
    },
    handleDirComfim() {
      if (!this.seletedVal) return
      let txt = tinymce.activeEditor.selection.getContent()
      tinymce.activeEditor.insertContent(`<span style="display: inline-block; padding: 0 ${this.seletedVal}px">${txt}</span>`);
    },
    onInit () {
    },
    onRemove () {
    },
    onChange () {
    },
    onBlur () {
      this.$emit('onBlur')
    }
  },
  activated () {
    this.active = true
    // tinymce.EditorManager.execCommand('mceRemoveEditor', false, 'myEditor')
    // tinymce.EditorManager.execCommand('mceAddEditor', false, 'myEditor')
  },
  deactivated () {
    this.active = false
  },
  watch: {
    value: function (val) {
      this.editorContent = val
    },
    editorContent (newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>
