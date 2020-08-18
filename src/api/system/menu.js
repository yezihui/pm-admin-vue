import axios from '@/libs/api.request'
import {getToken} from '@/libs/util'

// 查询一级菜单列表
export const getParentMenus = () => {
  return axios.request({
    url: '/sys/menu/selectParentMenus',
    headers: {
      token: getToken()
    },
    method: 'get'
  })
}

// 查询二级菜单列表
export const getSecondMenus = (menuId) => {
  return axios.request({
    url: '/sys/menu/selectSecondMenus/' + menuId,
    headers: {
      token: getToken()
    },
    method: 'get'
  })
}

// 新增一级菜单
export const addParentMenu = (data) => {
  return axios.request({
    url: '/sys/menu/addParentMenu',
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

// 新增二级菜单
export const addSecondMenu = (data) => {
  return axios.request({
    url: '/sys/menu/addSecondMenu',
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

// 查询菜单信息
export const selectMenuById = (id) => {
  return axios.request({
    url: '/sys/menu/select/' + id,
    headers: {
      token: getToken()
    },
    method: 'get'
  })
}

// 上移菜单顺序
export const upMenuSequence = (menuId, preId) => {
  return axios.request({
    url: `sys/menu/up/sequence?menuId=${menuId}&preId=${preId}`,
    headers: {
      token: getToken()
    },
    method: 'post'
  })
}

// 下移菜单顺序
export const downMenuSequence = (menuId, nextId) => {
  return axios.request({
    url: `sys/menu/down/sequence?menuId=${menuId}&nextId=${nextId}`,
    headers: {
      token: getToken()
    },
    method: 'post'
  })
}

// 编辑菜单
export const editMenu = (id, data) => {
  return axios.request({
    url: '/sys/menu/edit/' + id,
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

// 删除菜单
export const deleteMenuById = (id) => {
  return axios.request({
    url: '/sys/menu/delete/' + id,
    headers: {
      token: getToken()
    },
    method: 'delete'
  })
}
