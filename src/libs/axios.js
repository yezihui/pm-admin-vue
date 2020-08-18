// 请求封装
import axios from 'axios'
import {Message, Modal} from 'view-design'
import router from '@/router'
import store from '@/store'
class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig () {
    let config = {
      baseURL: this.baseUrl
    }
    return config
  }

  destroy (url) {
    delete this.queue[url]
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      // if (!Object.keys(this.queue).length) {
      //   Spin.show() // 不建议开启，因为界面不友好
      // }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      console.debug('[' + url + ']')
      console.debug('接口请求返回内容=====>' + res)
      const {data, status} = res
      if (data.success) {
        // 请求成功
        return {data, status}
      } else {
        // 请求返回失败
        if (data.code === 201 || data.code === 202) {
          // 未登录或者登录已过期,需要引导用户重新登录
          Message.error(data.message)
          store.dispatch('handleLogOut').then(res => {
            router.push({
              name: 'login'
            })
          })
          throw new Error(data.message)
        } else {
          // 其他错误
          Message.error(data.message)
          throw new Error(data.message)
        }
      }
    }, error => {
      // HTTP请求出错，可能是接口请求规范不正确获取HTTP原生异常
      this.destroy(url)
      Message.error('请求服务器异常')
      return Promise.reject(error)
    })
  }

  request (options) {
    // 创建请求对象
    const instance = axios.create()
    // 拷贝配置
    options = Object.assign(this.getInsideConfig(), options)
    // options.url 相对路径，没有前缀地址
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
