import {
  buildUserMenu,
  getBreadCrumbList,
  getHomeRoute,
  getMenuByRouter,
  getNextRoute,
  getRouteTitleHandled,
  getTagNavListFromLocalstorage,
  routeEqual,
  routeHasExist,
  setTagNavListInLocalstorage,
  getTheme,
  setTheme,
  getQuota,
  getReceiveNum
} from '@/libs/util'
import {objEqual} from '@/libs/tools'
import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'

const {homeName} = config

const closePage = (state, route) => {
  console.info('关闭页面')
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    errorList: [],
    historyUsers: null,
    themeItem: parseInt(getTheme()) || 0,
    hasReadErrorPage: false,
    quota: parseInt(getQuota()) || 0,
    receiveNum: parseInt(getQuota()) || 0
  },
  getters: {
    // 从路由器列表直接构造菜单数据
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access),
    // 用户权限列表
    userMenus: (state, getters, rootState) => buildUserMenu(routers, rootState.user.menus),
    errorCount: state => state.errorList.length,
    getHistoryUsers(state) {
      let historyUsers = state.historyUsers ? state.historyUsers : JSON.parse(localStorage.getItem('historyUsers'))
      return historyUsers
    },
    seletedItem(state) {
      let themeItem = state.themeItem  
      return themeItem
    }
  },
  mutations: {
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      // 如果第一个不是home页则删除掉第一个元素
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      // 将首页home放到第一位
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => {
        let params1 = item.params || {}
        let params2 = route.params || {}
        let query1 = item.query || {}
        let query2 = route.query || {}
        return (item.name === route.name) && objEqual(params1, params2) && objEqual(query1, query2)
      })
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag (state, {route, type = 'unshift'}) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setSelectedUsers(state, data) {
      if (data) {
        state.historyUsers = data
        localStorage.setItem('historyUsers', JSON.stringify(data))
      } else {
        state.historyUsers = null
        localStorage.removeItem('historyUsers');
      }
    },
    setThemeItem(state, data) {
      state.themeItem = data
      setTheme(data)
    },
    setQuota(state, value) {
      state.quota = value
      sessionStorage.quota = value
    },
    setReceiveNum(state, value) {
      state.receiveNum = value
      sessionStorage.receiveNum = value
    }
  },
  actions: {}
}
