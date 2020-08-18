// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
// 权限指令
import permission from './components/Permission'

import './index.less'
// import style
import '@/assets/icons/iconfont.css'
import { hasOneOf, getDate } from '@/libs/tools';
import moment from 'moment'
import { formatDateTime, formatDate, getSelectionIds } from '@/libs/util'
import * as pageUtil from '@/libs/pageUtil'
// 引入图片查看器
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 99999
  }
})
importDirective(Vue)
Vue.use(permission)
Vue.directive('clickOutside', clickOutside)
Vue.use(ViewUI)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * @description 权限判断方法
 */
Vue.prototype.$hasOneOf = hasOneOf
Vue.prototype.$getDate = getDate
/**
 * 时间格式化工具
 */
Vue.prototype.$moment = moment;
Vue.prototype.$formatDateTime = formatDateTime;
Vue.prototype.$formatDate = formatDate;
Vue.prototype.$getSelectionIds = getSelectionIds;
Vue.prototype.$pageUtil = pageUtil;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
