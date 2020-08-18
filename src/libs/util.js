import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
// cookie保存的天数
import config from '@/config';
import { forEach, hasOneOf, objEqual } from '@/libs/tools';

const { title, cookieExpires, useI18n } = config;

export const getSelectionIds = (vm, dataTable, flag) => {
  let selectRows = vm.$refs[dataTable].getSelection();
  if (selectRows.length <= 0) {
    vm.$Message.warning('请勾选一条以上的数据再进行操作！');
    return false;
  }
  if (!flag) {
    let ids = '';
    let arr = [];
    for (var i in selectRows) {
      // ids += selectRows[i].id + ',';
      arr.push(selectRows[i].id);
      ids = arr.join(',');
    }
    return ids;
  } else {
    return selectRows
  }
};
/**
 * 格式化时间戳
 * @param time
 * @returns {string}
 */
export const parseTimestamp = time => {
  let date = new Date(time);
  return (
    date.toLocaleDateString().replace(/\//g, '-') +
    ' ' +
    date.toTimeString().substr(0, 8)
  );
};

export const isEmpty = val => {
  return !val || val == null || val.length <= 0;
};

export const parseAryParam = ary => {
  var str = '';
  ary.forEach(m => {
    str += m + ',';
  });
  return str;
};

export const splitStrToAry = (str, splitStr) => {
  let ary = str.split(splitStr);
  for (var i = 0; i < ary.length; i++) {
    if (!isEmpty(ary[i])) ary.splice(i, 1);
  }
  return ary;
};

export const aryToStr = (ary, splitStr) => {
  var str = '';
  for (var i = 0; i < ary.length; i++) {
    if (!isEmpty(ary[i])) str += ary + splitStr;
  }
  return str;
};

// 判断一个字符串是否都为数字
export const isDigit = strNum => {
  var match = strNum.match(/^\d+$/); // 考虑小数写法 ^\d+(\.\d+)?$
  return match;
};

export const parseParam = (param, key) => {
  var paramStr = '';
  if (
    typeof param === 'string' ||
    typeof param === 'number' ||
    typeof param === 'boolean'
  ) {
    paramStr += '&' + key + '=' + encodeURIComponent(param);
  } else {
    for (var i in param) {
      var k =
        key == null
          ? i
          : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      if (param[i]) {
        // 参数如果为空，则抛弃
        paramStr += '&' + util.parseParam(param[i], k);
      }
    }
  }
  return paramStr.substr(1);
};

export const uniqueAry = arr => {
  var res = [arr[0]];
  for (var i = 1; i < arr.length; i++) {
    var repeat = false;
    for (var j = 0; j < res.length; j++) {
      if (arr[i] === res[j]) {
        repeat = true;
        break;
      }
    }
    if (!repeat) {
      res.push(arr[i]);
    }
  }
  return res;
};

export const formatDate = (date, fmt) => {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fmt;
};
/**
 * 获取默认加上时分秒
 * @param {*} date ：['2019-07-07', '2019-07-08']
 */
export const formatDateTime = date => {
  let v1 = date[0] + ' 00:00:00'
  let v2 = date[1] + ' 23:59:59'
  let value = [v1, v2]
  return value
};
/**
 * 获取星期
 * @param {string} date ：2019-07-07 00:00:00
 */
export const formatDay = date => {
  // let da = date.substr()
  let weekArray = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ];

  let week = weekArray[new Date(date).getDay()];
  return week
};
/**
 *
 * @param {*} date 日期格式1900-01-01
 * @param {*} delay 往前天数  number
 * @param {*} key 往前forward往后
 */
export const delayDate = (date, delay = 0, key = 'forward') => {
  let myDate = new Date();
  if (!date) {
    // 如果没有传日期则拿当天日期
    let cy1 = myDate.getFullYear();
    let cm1 = myDate.getMonth() + 1;
    let cd1 = myDate.getDate();
    date = cy1 + '-' + cm1 + '-' + cd1;
  }
  let month;
  delay = parseInt(delay);
  let year = Number(date.split('-')[0]);
  month = month = Number(date.split('-')[1]);
  let day = Number(date.split('-')[2]);
  myDate.setFullYear(year, month - 1, day);
  if (key == 'forward') {
    myDate.setDate(myDate.getDate() - delay);
  } else {
    myDate.setDate(myDate.getDate() + delay);
  }
  let cy = myDate.getFullYear();
  let cm = myDate.getMonth() + 1;
  let cd = myDate.getDate();
  let ystring =
    cy + '-' + (cm < 10 ? '0' + cm : cm) + '-' + (cd < 10 ? '0' + cd : cd);
  if (key == 'forward') {
    return [ystring, date];
  } else {
    return [date, ystring];
  }
};

/**
 * 构建操作对象
 * @param updateObj
 * @param route
 */
export const buildUpdateObj = (updateObj, route) => {
  if (!updateObj) {
    console.error('操作对象为空，构建操作对象失败！！');
    return;
  }
  updateObj.updateType = parseInt(route.query.updateType);
  if (updateObj.updateType == null) {
    console.error('路由参数有误，构建操作对象失败！！');
    return;
  }
  if (updateObj.updateType !== 0) {
    updateObj.id = route.query.updateId;
  }
  switch (updateObj.updateType) {
    case 0: // 新增
      updateObj.routerName = updateObj.module + '-add';
      break;
    case 1: // 修改
      updateObj.routerName = updateObj.module + '-update';
      break;
    case 2: // 查看
      updateObj.routerName = updateObj.module + '-info';
      break;
    case 4: // 爬虫库垃圾箱查看
      updateObj.routerName = updateObj.module + '-info';
      break;
  }
};

/**
 * 格式化操作对象
 * @type {string}
 */
export const parseUpdateObj = updateObj => {
  for (var key in updateObj) {
    if (typeof updateObj[key] === 'boolean') {
      if (updateObj[key]) {
        updateObj[key] = 1;
      } else {
        updateObj[key] = 0;
      }
    }
  }
  return updateObj;
};

export const TOKEN_KEY = 'token';

export const THEME_ITEM = 'theme';

export const REGION_KEY = 'region';

export const DICT_LIST_KEY = 'dictList';

export const setToken = token => {
  Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 });
};

/**
 * 从cookies里去token，存在：返回token,不存在false
 * @returns {*}
 */
export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) return token;
  else return false;
};
// 剩余优惠券数量
export const getQuota = () => {
  return sessionStorage.getItem('quota') || 0
}
// 已被领取优惠券数量
export const getReceiveNum = () => {
  return sessionStorage.getItem('receiveNum') || 0
}
export const setTheme = theme => {
  Cookies.set(THEME_ITEM, theme, { expires: 30 });
};
/**
 * 从cookies里取theme，存在：返回theme,不存在0
 * @returns {*}
 */
export const getTheme = () => {
  const theme = Cookies.get(THEME_ITEM);
  if (theme) return theme;
  else return 0;
};

export const setDictList = list => {
  Cookies.set(DICT_LIST_KEY, JSON.stringify(list), {
    expires: cookieExpires || 1
  });
};

export const getDictList = () => {
  const list = Cookies.get(DICT_LIST_KEY);
  if (list) return JSON.parse(list);
  else return [];
};

export const setRegion = list => {
  Cookies.set(REGION_KEY, list, { expires: cookieExpires || 1 });
};

export const getRegion = () => {
  const list = Cookies.get(REGION_KEY);
  if (list) return list;
  else return [];
};

export const hasChild = item => {
  return item.children && item.children.length !== 0;
};

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true;
    else return false;
  } else return true;
};
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = [];
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      };
      if (
        (hasChild(item) || (item.meta && item.meta.showAlways)) &&
        showThisMenuEle(item, access)
      ) {
        obj.children = getMenuByRouter(item.children, access);
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href;
      if (showThisMenuEle(item, access)) res.push(obj);
    }
  });
  return res;
};

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1;
  let len = routers.length;
  let homeRoute = {};
  while (++i < len) {
    let item = routers[i];
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName);
      if (res.name) return res;
    } else {
      if (item.name === homeName) homeRoute = item;
    }
  }
  return homeRoute;
};

/**
 * 从用户权限菜单里找到菜单下面的权限列表
 * @param userMenus
 * @param menuCode
 * @returns {Array|{name}|{}|*}
 */
export const getOperators = (userMenus, menuCode) => {
  let res = [];
  let i = -1;
  let len = userMenus.length;
  // while (++i < len) {
  //   let item = userMenus[i];
  //   if (item.children && item.children.length) {
  //     let res = getOperators(item.children, menuCode);
  //     if (res.menuCode) return res;
  //   } else {
  //     if (item.menuCode === menuCode) res = item;
  //   }
  // }
  return res;
};

/**
 * 从树形菜单里找到等于routeName的节点
 * @param userMenus
 * @param routeName
 * @returns {{menuCode}|*|{}|*}
 */
export const findFromUserMenus = (userMenus, routeName) => {
  let node = {};
  let i = -1;
  let len = userMenus.length;
  while (++i < len) {
    let item = userMenus[i];
    if (item.menuCode === routeName) {
      return item;
    } else {
      if (item.children && item.children.length) {
        let res = findFromUserMenus(item.children, routeName);
        if (res.menuCode) return res;
      }
    }
  }

  return node;
};

/**
 * 构造树形菜单路由
 * @param routes
 * @param userMenus
 * @returns {*[]}
 */
export const buildUserMenu = (routes, userMenus) => {
  let res = [];
  // 遍历路由列表
  forEach(routes, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      // 查找用户权限菜单列表是否存在此菜单
      let node = findFromUserMenus(userMenus, item.name);
      if (
        Object.keys(node).length ||
        item.name === '_home' ||
        item.name === 'home'
      ) {
        if (item.name !== 'home' || item.name === '_home') {
          item.meta.title = node.menuName;
        }
        let obj = {
          icon: (item.meta && item.meta.icon) || '',
          name: item.name,
          meta: item.meta
        };
        // 用户拥有此菜单权限,继续遍历子列表
        if (hasChild(item)) {
          obj.children = buildUserMenu(item.children, userMenus);
        }
        res.push(obj);
      }
    }
  });

  return res;
};

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = { ...homeRoute, icon: homeRoute.meta.icon };
  let routeMetched = route.matched;
  if (routeMetched.some(item => item.name === homeRoute.name)) {
    return [homeItem];
  }
  let res = routeMetched
    .filter(item => {
      return item.meta === undefined || !item.meta.hideInBread;
    })
    .map(item => {
      let meta = { ...item.meta };
      if (meta.title && typeof meta.title === 'function') {
        meta.__titleIsFunction__ = true;
        meta.title = meta.title(route);
      }
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: meta
      };
      return obj;
    });
  res = res.filter(item => {
    return !item.meta.hideInMenu;
  });
  return [{ ...homeItem, to: homeRoute.path }, ...res];
};

export const getRouteTitleHandled = route => {
  let router = { ...route };
  let meta = { ...route.meta };
  let title = '';
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true;
      title = meta.title(router);
    } else title = meta.title;
  }
  meta.title = title;
  router.meta = meta;
  return router;
};

export const showTitle = (item, vm) => {
  let { title, __titleIsFunction__ } = item.meta;
  if (!title) return;
  if (useI18n) {
    if (title.includes('{{') && title.includes('}}') && useI18n) {
      title = title.replace(/({{[\s\S]+?}})/, (m, str) =>
        str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim()))
      );
    } else if (__titleIsFunction__) title = item.meta.title;
    else title = vm.$t(item.name);
  } else title = (item.meta && item.meta.title) || item.name;
  return title;
};

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list);
};
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList;
  return list ? JSON.parse(list) : [];
};

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute;
  let newList = [...list];
  if (newList.findIndex(item => item.name === name) >= 0) return newList;
  else newList.push({ name, path, meta });
  return newList;
};

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, routes) => {
  const routePermissionJudge = list => {
    return list.some(item => {
      if (item.children && item.children.length) {
        if (item.name === name) {
          return true;
        }
        return routePermissionJudge(item.children);
      } else if (item.name === name) {
        return true;
      }
    });
  };
  return routePermissionJudge(routes);
};

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&');
  let paramObj = {};
  keyValueArr.forEach(item => {
    const keyValue = item.split('=');
    paramObj[keyValue[0]] = keyValue[1];
  });
  return paramObj;
};

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {};
  if (list.length === 2) {
    res = getHomeRoute(list);
  } else {
    const index = list.findIndex(item => routeEqual(item, route));
    if (index === list.length - 1) res = list[list.length - 2];
    else res = list[index + 1];
  }
  return res;
};

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1;
  while (++i < times) {
    callback(i);
  }
};

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = file => {
  let nameSplit = file.name.split('.');
  let format = nameSplit[nameSplit.length - 1];
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsText(file); // 以文本格式读取
    let arr = [];
    reader.onload = function (evt) {
      let data = evt.target.result; // 读到的数据
      let pasteData = data.trim();
      arr = pasteData
        .split(/[\n\u0085\u2028\u2029]|\r\n?/g)
        .map(row => {
          return row.split('\t');
        })
        .map(item => {
          return item[0].split(',');
        });
      if (format === 'csv') resolve(arr);
      else reject(new Error('[Format Error]:你上传的不是Csv文件'));
    };
  });
};

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = array => {
  let columns = [];
  let tableData = [];
  if (array.length > 1) {
    let titles = array.shift();
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      };
    });
    tableData = array.map(item => {
      let res = {};
      item.forEach((col, i) => {
        res[titles[i]] = col;
      });
      return res;
    });
  }
  return {
    columns,
    tableData
  };
};

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode;
    } else {
      return findNodeUpper(ele.parentNode, tag);
    }
  }
};

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode;
  if (parentNode) {
    let classList = parentNode.classList;
    if (
      classList &&
      classes.every(className => classList.contains(className))
    ) {
      return parentNode;
    } else {
      return findNodeUpperByClasses(parentNode, classes);
    }
  }
};

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase();
  if (ele.childNodes.length) {
    let i = -1;
    let len = ele.childNodes.length;
    while (++i < len) {
      let child = ele.childNodes[i];
      if (child.tagName === tagName) return child;
      else return findNodeDownward(child, tag);
    }
  }
};

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access);
};

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {};
  const params2 = route2.params || {};
  const query1 = route1.query || {};
  const query2 = route2.query || {};
  return (
    route1.name === route2.name &&
    objEqual(params1, params2) &&
    objEqual(query1, query2)
  );
};

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length;
  let res = false;
  doCustomTimes(len, index => {
    if (routeEqual(tagNavList[index], routeItem)) res = true;
  });
  return res;
};

export const localSave = (key, value) => {
  localStorage.setItem(key, value);
};

export const localRead = key => {
  return localStorage.getItem(key) || '';
};

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil((difference / duration) * 50);

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback();
      return;
    }

    let d = start + step > end ? end : start + step;
    if (start > end) {
      d = start - step < end ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  };
  scroll(from, to, step);
};

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem);
  const pageTitle = showTitle(handledRoute, vm);
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title;
  window.document.title = resTitle;
};

// 汉字转为阿拉伯数字
let chnNumChar = {
  零: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9
};
let chnNameValue = {
  十: { value: 10, secUnit: false },
  百: { value: 100, secUnit: false },
  千: { value: 1000, secUnit: false },
  万: { value: 10000, secUnit: true },
  亿: { value: 100000000, secUnit: true }
};

export const ChineseToNumber = chnStr => {
  let rtn = 0;
  let section = 0;
  let number = 0;
  let secUnit = false;
  let str = chnStr.split('');

  for (let i = 0; i < str.length; i++) {
    let num = chnNumChar[str[i]];
    if (typeof num !== 'undefined') {
      number = num;
      if (i === str.length - 1) {
        section += number;
      }
    } else {
      let unit = chnNameValue[str[i]].value;
      secUnit = chnNameValue[str[i]].secUnit;
      if (secUnit) {
        section = (section + number) * unit;
        rtn += section;
        section = 0;
      } else {
        section += number * unit;
      }
      number = 0;
    }
  }
  return rtn + section;
};

/**
 * 拆解文号
 * @param {string} str
 */
export const parseWritNo = str => {
  let reg1 = /^(\D+)()第(\d+)号$/;
  let reg2 = /^(\D+)(\d{4})年第(\d+)号$/;
  let reg3 = /^(\D+)(\d{4})年(\d+)号$/;
  let reg4 = /^(\D+)\[(\d{4})\](\d+)号$/;
  let reg5 = /^(\D+)\[(\d{4})\]第(\d+)号$/;
  let reg6 = /^(.+?)()第(\d+)号令$/;
  let reg16 = /^(.+?)()(\d+)号令$/;
  let reg7 = /^(.*?)()第(\D+)号$/;
  let reg8 = /^(\D+)\〔(\d{4})\〕(\d+)号$/;
  let reg9 = /^(\D+)\〔(\d{4})\〕第(\d+)号$/;
  let reg10 = /^(\D+)\((\d{4})\)(\d+)号$/;
  let reg11 = /^(\D+)\（(\d{4})\）(\d+)号$/;
  let reg12 = /^(\D+)\［(\d{4})\］(\d+)号$/;
  let reg13 = /^(\D+)\{(\d{4})\}(\d+)号$/;
  let reg14 = /^(\D+)\｛(\d{4})\｝(\d+)号$/;
  let reg15 = /^(\D+)\【(\d{4})\】(\d+)号$/;
  let reg17 = /^(\D+)(\d{4})年第(\d+)号公告$/;
  let writNo = '';
  let writOrder = '';
  let year = '';
  let content = [];
  if (reg1.test(str)) {
    content = reg1.exec(str);
  }
  if (reg2.test(str)) {
    content = reg2.exec(str);
  }
  if (reg3.test(str)) {
    content = reg3.exec(str);
  }
  if (reg4.test(str)) {
    content = reg4.exec(str);
  }
  if (reg5.test(str)) {
    content = reg5.exec(str);
  }
  if (reg6.test(str)) {
    content = reg6.exec(str);
  }
  if (reg8.test(str)) {
    content = reg8.exec(str);
  }
  if (reg9.test(str)) {
    content = reg9.exec(str);
  }
  if (reg10.test(str)) {
    content = reg10.exec(str);
  }
  if (reg11.test(str)) {
    content = reg11.exec(str);
  }
  if (reg12.test(str)) {
    content = reg12.exec(str);
  }
  if (reg13.test(str)) {
    content = reg13.exec(str);
  }
  if (reg14.test(str)) {
    content = reg14.exec(str);
  }
  if (reg15.test(str)) {
    content = reg15.exec(str);
  }
  if (reg16.test(str)) {
    content = reg16.exec(str);
  }
  if (reg17.test(str)) {
    content = reg17.exec(str);
  }
  writOrder = content[3];
  // 特殊字符放在最后
  if (reg7.test(str)) {
    content = reg7.exec(str);
    writNo = content[1];
    writOrder = ChineseToNumber(content[3]);
  }
  writNo = content[1];
  year = content[2];
  return {
    writNo,
    writOrder,
    year
  };
};

/**
 * 手机号验证
 * @param {string|number} str
 */
export const checkMobilePhone = str => {
  if (str.match(/^(?:1\d{2})-?\d{5}(\d{3}|\*{3})$/) == null) {
    return false;
  } else {
    return true;
  }
};
/**
 * 合并两个数组对象的数据并去重
 * @param {*} options 
 * currentArr： 当前已有的数组对象
 * targetArr：新添加进来的数组对象
 * key：唯一键值
 */
export const difConcat = ({ currentArr = [], targetArr = [], key = 'id' }) => {
  if (currentArr.length > 0) {
    let arr = targetArr.filter(item => {
      return currentArr.every(
        data => data[key] !== item[key]
      );
    });
    return currentArr.concat(arr);
  } else {
    return targetArr;
  }
}

/**
 * 判断此对象是否是Object类型
 * @param {Object} obj  
 */
export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * 判断此类型是否是Array类型
 * @param {Array} arr 
 */
export const isArray = (arr) => {
  return Object.prototype.toString.call(arr) === '[object Array]';
}

/**
 *  深度比较两个对象是否相同
 * @param {Object} oldData 
 * @param {Object} newData 
 */
export const equalsArrObj = (oldData, newData) => {
  // 类型为基本类型时,如果相同,则返回true
  if (oldData === newData) return true;
  if (
    isObject(oldData) &&
    isObject(newData) &&
    Object.keys(oldData).length === Object.keys(newData).length
  ) {
    // 类型为对象并且元素个数相同
    console.log('类型为对象并且元素个数相同');
    // 遍历所有对象中所有属性,判断元素是否相同
    for (const key in oldData) {
      if (oldData.hasOwnProperty(key)) {
        if (!equalsArrObj(oldData[key], newData[key])) return false;
      }
    }
  } else if (
    isArray(oldData) &&
    isArray(oldData) &&
    oldData.length === newData.length
  ) {
    console.log('类型为数组并且数组长度相同');
    // 类型为数组并且数组长度相同
    for (let i = 0, length = oldData.length; i < length; i++) {
      if (!equalsArrObj(oldData[i], newData[i])) {
        return false // 如果数组元素中具有不相同元素,返回false
      }; 
    }
  } else {
    // 其它类型,均返回false
    return false;
  }
  console.log(1111);
  
  // 走到这里,说明数组或者对象中所有元素都相同,返回true
  return true;
}

// 加密
export const encrypt = (str, wkey = 'webtax') => {
  return CryptoJS.AES.encrypt(str, wkey).toString()
}

// 解密
export const decrypt = (str, wkey = 'webtax') => {
  let bytes = CryptoJS.AES.decrypt(str, wkey);
  return bytes.toString(CryptoJS.enc.Utf8)
}
