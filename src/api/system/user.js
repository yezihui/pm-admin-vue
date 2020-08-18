import axios from '@/libs/api.request'
import {getToken} from '@/libs/util'

// 分页查询用户列表
export const userPage = (data) => {
  return axios.request({
    url: '/sys/user/selectByPage',
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

// 新增用户
export const addUser = (data) => {
  return axios.request({
    url: '/sys/user/add',
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

// 查询用户信息
export const getUserById = (id) => {
  return axios.request({
    url: '/sys/user/select/' + id,
    headers: {
      token: getToken()
    },
    method: 'get'
  })
}

// 编辑用户信息
export const editUser = (id, data) => {
  return axios.request({
    url: '/sys/user/edit/' + id,
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

// 查询用户的角色列表
export const getUserRoles = (id) => {
  return axios.request({
    url: '/sys/user/selectUserRoles/' + id,
    headers: {
      token: getToken()
    },
    method: 'get'
  })
}

// 分配用户角色
export const allotUserRoles = (id, data) => {
  return axios.request({
    url: '/sys/user/roles/allot/' + id,
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

// 修改用户密码
export const updatePwd = (id, data) => {
  return axios.request({
    url: '/sys/user/update/pass/' + id,
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

// 删除用户
export const deleteUserById = (id) => {
  return axios.request({
    url: '/sys/user/delete/' + id,
    headers: {
      token: getToken()
    },
    method: 'delete'
  })
}
/**
 * 获取查询统计使用的用户信息
 * @param {*}  
 */
export const statsUsers = () => {
  return axios.request({
    url: '/stats/query/user/list',
    headers: {
      token: getToken()
    },
    method: 'get'
  })
}
