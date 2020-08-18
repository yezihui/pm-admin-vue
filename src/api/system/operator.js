import axios from '@/libs/api.request'
import {getToken} from '@/libs/util'

// 查询菜单权限列表
export const getMenuOperators = () => {
  return axios.request({
    url: '/sys/operator/menus',
    headers: {
      token: getToken()
    },
    method: 'get'
  })
}

// 根据菜单ID查询权限列表
export const selectByMenuId = (id) => {
  return axios.request({
    url: '/sys/operator/selectByMenuId/' + id,
    headers: {
      token: getToken()
    },
    method: 'get'
  })
}

// 添加权限与菜单关联
export const addOperatorByMenuId = (id, data) => {
  return axios.request({
    url: '/sys/operator/add/' + id,
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

// 查询权限详情
export const getOperatorById = (id) => {
  return axios.request({
    url: '/sys/operator/select/' + id,
    headers: {
      token: getToken()
    },
    method: 'get'
  })
}

// 编辑权限信息
export const editOperator = (id, data) => {
  return axios.request({
    url: '/sys/operator/edit/' + id,
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

// 删除权限信息
export const deleteOperatorById = (id) => {
  return axios.request({
    url: '/sys/operator/delete/' + id,
    headers: {
      token: getToken()
    },
    method: 'delete'
  })
}
