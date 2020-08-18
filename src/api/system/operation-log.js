import axios from '@/libs/api.request'
import {getToken} from '@/libs/util'

// 查询日志信息-分页
export const operationLogPage = (data) => {
  return axios.request({
    url: '/sys/log/operation/selectByPage',
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

export const operationLogDetail = (id) => {
  return axios.request({
    url: '/sys/log/operation/select/' + id,
    headers: {
      token: getToken()
    },
    method: 'get'
  })
}

export const delteOperationLog = () => {
  return axios.request({
    url: '/sys/log/operation/clear',
    headers: {
      token: getToken()
    },
    method: 'delete'
  })
}
