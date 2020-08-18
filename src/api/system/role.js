import axios from '@/libs/api.request'
import {getToken} from '@/libs/util'

// 查询角色列表
export const rolePage = (data) => {
  return axios.request({
    url: '/sys/role/selectByPage',
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

// 新增角色
export const addRole = (data) => {
  return axios.request({
    url: '/sys/role/add',
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

// 查询角色信息
export const getRoleById = (id) => {
  return axios.request({
    url: '/sys/role/select/' + id,
    headers: {
      token: getToken()
    },
    method: 'get'
  })
}

// 编辑角色信息
export const editRole = (id, data) => {
  return axios.request({
    url: '/sys/role/edit/' + id,
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

// 删除角色
export const deleteRoleById = (id) => {
  return axios.request({
    url: '/sys/role/delete/' + id,
    headers: {
      token: getToken()
    },
    method: 'delete'
  })
}

// 查询角色的权限列表
export const getRoleOperators = (id) => {
  return axios.request({
    url: '/sys/role/operators/' + id,
    headers: {
      token: getToken()
    },
    method: 'get'
  })
}

// 分配角色权限
export const allotRoleOperators = (id, data) => {
  return axios.request({
    url: '/sys/role/allot/operators/' + id,
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}
