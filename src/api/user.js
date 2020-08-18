import axios from '@/libs/api.request'
import { getToken } from '@/libs/util'
// 账号+密码登录
export const login = ({ userName, password }) => {
  const data = {
    username: userName,
    password: password
  }
  return axios.request({
    url: '/api/auth/login',
    data,
    method: 'post'
  })
}

// 账号+验证码登录接口
export const loginByCode = ({ userName, password }) => {
  const data = {
    usernameOrPhone: userName,
    vcode: password
  }
  return axios.request({
    url: '/api/auth/vcode/login',
    data,
    method: 'post'
  })
}
// 登录成功发送验证码接口
export const loginGetCode = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: '/api/auth/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/api/auth/resources',
    headers: {
      token: token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/api/auth/logout',
    headers: {
      token: token
    },
    method: 'post'
  })
}

export const modifyPassword = (token, data) => {
  return axios.request({
    url: '/api/auth/modify/password',
    headers: {
      token: token
    },
    data,
    method: 'post'
  })
}

/**
 * 
 * @param {*} token 
 * @param {*} data 
 */
export const getSMSCode = (data) => {
  return axios.request({
    url: '/api/auth/vcode/' + data,
    headers: {
      token: getToken()
    },
    method: 'get'
  })
}
