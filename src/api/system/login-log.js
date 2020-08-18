import axios from '@/libs/api.request'
import {getToken} from '@/libs/util'

// 查询日志信息-分页
export const loginLogPage = (data) => {
  return axios.request({
    url: '/sys/log/login/selectByPage',
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}

export const delteLoginLog = () => {
  return axios.request({
    url: '/sys/log/login/clear',
    headers: {
      token: getToken()
    },
    method: 'delete'
  })
}
