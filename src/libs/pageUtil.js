import store from '@/store'
import {getOperators} from '@/libs/util'
function closeTag(route) {
  console.log(route);
  let router = {
    name: route.name,
    params: route.params,
    query: route.query
  }
  store.commit('closeTag', router)
}
// 单独获取某个菜单下的权限
function menuOperators(menuCode) {
  let operators = getOperators(store.state.user.menus, menuCode).operators
  let arr = operators.split(',')
  return arr
}

let baseUrl = ''; // H5地址
const prod = process.env;
if (prod.NODE_ENV === 'development') {
  baseUrl = 'http://192.168.1.202:9191/app/article/share/';
} else if (
  prod.NODE_ENV === 'production' &&
  prod.VUE_APP_CURRENTMODE === 'test'
) {
  baseUrl = 'http://test.h5.webtax.com.cn/app/article/share/';
} else {
  baseUrl = 'http://h5.webtax.com.cn/app/article/share/';
}
function openPage(id) {
  window.open(baseUrl + id);
}

export { closeTag, menuOperators, openPage }
