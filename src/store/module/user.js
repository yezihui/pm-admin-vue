import {getUserInfo, login, loginByCode, logout, modifyPassword} from '@/api/user'
import {getOperators, getToken, setToken, encrypt, decrypt} from '@/libs/util'
export default {
  state: {
    userName: '',
    nickName: '',
    gender: '',
    email: '',
    remark: '',
    lastLoginTime: '',
    createTime: '',
    avatarImgPath: '',
    avatarIcon: 'md-person',
    token: getToken(),
    // 用户权限菜单列表
    menus: [],
    dictList: [],
    access: '',
    hasGetInfo: false,
    // 当前激活中的菜单下面的权限
    activeMenuOperators: [],
    activeSubMenuOperators: []
  },
  mutations: {
    setUserName(state, name) {
      state.userName = name
    },
    setNickName(state, nickName) {
      state.nickName = nickName
    },
    setGender(state, gender) {
      state.gender = gender
    },
    setEmail(state, email) {
      state.email = email
    },
    setRemark(state, remark) {
      state.remark = remark
    },
    setLastLoginTime(state, lastLoginTime) {
      state.lastLoginTime = lastLoginTime
    },
    setCreateTime(state, createTime) {
      state.createTime = createTime
    },
    setMenus(state, menus) {
      state.menus = menus
    },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token
      // 设置TOKEN到cookies里
      setToken(token)
    },
    setDictList(state, list) {
      state.dictList = list
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    },
    getOperatorsFromMenus(state, menu) {
      // let activeMenu = getOperators(state.menus, menu)
      // if (Object.keys(activeMenu).length && menu) {
      //   state.activeMenuOperators = activeMenu.operators.split(',')
      //   localStorage.setItem('activeMenuOperators', activeMenu.operators)
      // } else {
      //   localStorage.setItem('activeMenuOperators', [])
      //   state.activeMenuOperators = []
      // }
    },
    getSubOperatorsFromMenus(state, menu) {
      let activeMenu = getOperators(state.menus, menu)
      if (Object.keys(activeMenu).length && menu) {
        state.activeSubMenuOperators = activeMenu.operators.split(',')
        localStorage.setItem('activeSubMenuOperators', activeMenu.operators)
      } else {
        state.activeSubMenuOperators = []
        localStorage.setItem('activeSubMenuOperators', [])
      }
    },
    clearlocalStorage() {
      localStorage.clear()
    }
  },
  actions: {
    // 根据验证码登录
    handleLogin({commit}, {userName, password}) {
      userName = userName.trim()
      password = password.trim()
      return new Promise((resolve, reject) => {
        login({userName, password}).then(res => {
          const data = res.data.data
          commit('setToken', data.token)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut({state, commit}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setUserName', '')
          commit('setNickName', '')
          commit('setMenus', [])
          commit('clearlocalStorage')
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 修改安全密码
    modifySecurityPwd({state, commit}, data) {
      return new Promise((resolve, reject) => {
        modifyPassword(state.token, data).then(() => {
          commit('setToken', '')
          commit('setUserName', '')
          commit('setNickName', '')
          commit('setMenus', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo({state, commit}) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data.data
            commit('setUserName', data.username)
            commit('setNickName', data.nickName)
            commit('setGender', data.gender)
            commit('setEmail', data.email)
            commit('setRemark', data.remark)
            commit('setLastLoginTime', data.lastLoginTime)
            commit('setCreateTime', data.createTime)
            commit('setMenus', data.menus)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
