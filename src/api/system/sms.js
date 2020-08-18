import axios from '@/libs/api.request'
import {getToken} from '@/libs/util'

// =======短信消息=======
export const smsMessagePage = (data) => {
  return axios.request({
    url: '/sys/sms/message/page',
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  })
}
export const deleteSmsMessage = () => {
  return axios.request({
    url: '/sys/sms/message/clear',
    headers: {
      token: getToken()
    },
    method: 'delete'
  })
}
